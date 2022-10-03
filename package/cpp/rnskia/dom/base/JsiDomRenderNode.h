
#pragma once

#include "JsiDomNode.h"
#include "JsiDomDeclarationNode.h"
#include "JsiDrawingContext.h"
#include "PointProp.h"
#include "MatrixProp.h"
#include "TransformProp.h"
#include "PaintProp.h"

#include "JsiDomDeclarationNode.h"

namespace RNSkia {

static const char* PropNameOrigin = "origin";
static PropId PropNameOpacity = JsiPropId::get("opacity");

class JsiDomRenderNode : public JsiDomNode {
public:
  JsiDomRenderNode(std::shared_ptr<RNSkPlatformContext> context,
                   const char* type) : JsiDomNode(context, type) {
    _paintProp = addProperty(std::make_shared<PaintProp>());
    _opacityProp = addProperty(std::make_shared<JsiProp>(PropNameOpacity, PropType::Number));
    _matrixProp = addProperty(std::make_shared<MatrixProp>(PropNameMatrix));
    _transformProp = addProperty(std::make_shared<TransformProp>(PropNameTransform));
    _originProp = addProperty(std::make_shared<PointProp>(PropNameOrigin));
  }
  
  JSI_HOST_FUNCTION(render) {
    // Get drawing context
    render(std::make_shared<JsiDrawingContext>(runtime, arguments, count).get());
    return jsi::Value::undefined();
  }
  
  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiDomNode, addChild),
                       JSI_EXPORT_FUNC(JsiDomNode, removeChild),
                       JSI_EXPORT_FUNC(JsiDomNode, insertChildBefore),
                       JSI_EXPORT_FUNC(JsiDomNode, setProps),
                       JSI_EXPORT_FUNC(JsiDomNode, setProp),
                       JSI_EXPORT_FUNC(JsiDomNode, dispose),
                       JSI_EXPORT_FUNC(JsiDomNode, children),
                       JSI_EXPORT_FUNC(JsiDomRenderNode, render))
  
  void render(JsiDrawingContext* context) {
    
    auto props = getProperties();
    if (props == nullptr) {
      // A node might have an empty set of properties - then we can just render the node directly
      renderNode(context);
      return;
    }
    
    // Since the paint props uses parent paint, we need to set it before we call onPropsChanged
    _paintProp->setParentPaint(context->getPaint());
    
    // Make sure we commit any waiting transactions in the props object
    props->commitTransactions();
    
    // Make sure we update any properties that were changed in sub classes so that
    // they can update any derived values
    if (props->getHasPropChanges()) {
      onPropsChanged(props);
    }
    
    // Handle matrix/transforms
    if (_hasMatrixOrTransformProp) {
      auto matrix = _matrixProp->hasValue() ?
        _matrixProp->getDerivedValue() : _transformProp->getDerivedValue();
      
      // Save canvas state
      context->getCanvas()->save();
      
      if (_originProp->hasValue()) {
        // Handle origin
        context->getCanvas()->translate(_originProp->getDerivedValue().x(),
                                        _originProp->getDerivedValue().y());
      }
      
      // Concat canvas' matrix with our matrix
      context->getCanvas()->concat(*matrix);
      
      if (_originProp->hasValue()) {
        // Handle origin
        context->getCanvas()->translate(-_originProp->getDerivedValue().x(),
                                        -_originProp->getDerivedValue().y());
      }
    }
    
    // Render the node
    renderNode(materializeContext(context));
    
    // Restore if needed
    if (_hasMatrixOrTransformProp) {
      context->getCanvas()->restore();
    }
    
    // Reset all changes in props
    props->resetPropChanges();
  };
  
protected:
  /**
   Override to implement rendering where the current state of the drawing context is correctly set.
   */
  virtual void renderNode(JsiDrawingContext* context) = 0;
  
  /**
   Update flags when props are set
   */
  void onPropsSet(jsi::Runtime &runtime, JsiDomNodeProps* props) override {
    JsiDomNode::onPropsSet(runtime, props);
    _hasMatrixOrTransformProp = _matrixProp->hasValue() || _transformProp->hasValue();
  }
  
private:
  /**
   Returns true if any of the child nodes have changes
   */
  bool getChildDeclarationNodesHasPropertyChanged() {
    for (auto &child: getChildren()) {
      auto declarationNode = std::dynamic_pointer_cast<JsiDomDeclarationNode>(child);
      if (declarationNode != nullptr) {
        if (declarationNode->getProperties()->getHasPropChanges()) {
          return true;
        }
      }
    }
    return false;
  }
  
  JsiDrawingContext* materializeContext(JsiDrawingContext* context) {
    auto props = getProperties();
    // We only need to update the cached context if the paint property or opacity property has changed
    if (_paintProp->hasChanged(props) ||
        getChildDeclarationNodesHasPropertyChanged() ||
        context->hasChanged() ||
        props->getHasPropChanges(PropNameOpacity) ||
        _prevOpacity != context->getOpacity()) {
      
      // Paint - start by getting paint from parent context
      auto paint = context->getPaint();
      
      // If our child paint has a value we can use it.
      if (_paintProp->getDerivedValue() != nullptr) {
        paint = _paintProp->getDerivedValue();
      }
      
      // Opacity
      _prevOpacity = context->getOpacity();
      if (_opacityProp->hasValue()) {
        _prevOpacity *= _opacityProp->getPropValue()->getAsNumber();
        // TODO: Is this enough to override the opacity correctly?
        paint->setAlpha(255 * _prevOpacity);
      }
      
      // Create the cached drawing context if it is not set
      if (_cachedContext == nullptr) {
        _cachedContext = std::make_shared<JsiDrawingContext>(context, paint, _prevOpacity);
      } else {
        _cachedContext->setPaint(paint);
        _cachedContext->setOpacity(_prevOpacity);
      }
      
      // Enumerate children and let them modify the drawing context
      for (auto &child: getChildren()) {
        auto declarationNode = std::dynamic_pointer_cast<JsiDomDeclarationNode>(child);
        if (declarationNode != nullptr) {
          declarationNode->materializeNode(_cachedContext.get());
        }
      }
    }
    
    // Update canvas - it might change on each frame
    if (_cachedContext != nullptr) {
      _cachedContext->setCanvas(context->getCanvas());
    }
    
    return _cachedContext != nullptr ? _cachedContext.get() : context;
  }
  
  double _prevOpacity;
  bool _hasMatrixOrTransformProp;
  std::vector<JsiBaseProp> _props;
  std::shared_ptr<PointProp> _originProp;
  std::shared_ptr<MatrixProp> _matrixProp;
  std::shared_ptr<TransformProp> _transformProp;
  std::shared_ptr<PaintProp> _paintProp;
  std::shared_ptr<JsiProp> _opacityProp;
  std::shared_ptr<JsiDrawingContext> _cachedContext;
};

}
