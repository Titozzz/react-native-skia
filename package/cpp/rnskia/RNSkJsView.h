#pragma once

#include <functional>
#include <memory>
#include <mutex>
#include <vector>
#include <string>

#include <jsi/jsi.h>

#include <JsiValueWrapper.h>
#include <RNSkView.h>

#include <RNSkInfoParameter.h>
#include <RNSkPlatformContext.h>
#include <RNSkTimingInfo.h>
#include <RNSkLog.h>
#include <JsiSkCanvas.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <SkCanvas.h>
#include <SkBBHFactory.h>
#include <SkPictureRecorder.h>

#pragma clang diagnostic pop

class SkPicture;
class SkRect;
class SkImage;

namespace RNSkia {
class JsiSkCanvas;
using namespace facebook;

class RNSkJsRenderer:
  public RNSkRenderer,
  public std::enable_shared_from_this<RNSkJsRenderer> {
public:
  RNSkJsRenderer(std::function<void()> requestRedraw,
                         std::shared_ptr<RNSkPlatformContext> context);
  
  bool tryRender(std::shared_ptr<RNSkCanvasProvider> canvasProvider) override;
  
  void renderImmediate(std::shared_ptr<RNSkCanvasProvider> canvasProvider) override;
  
  void setDrawCallback(std::shared_ptr<jsi::Function> drawCallback);
    
  std::shared_ptr<RNSkInfoObject> getInfoObject();
    
private:
  void performDraw(std::shared_ptr<RNSkCanvasProvider> canvasProvider);
    
  void callJsDrawCallback(std::shared_ptr<JsiSkCanvas> jsiCanvas,
                          int width,
                          int height,
                          double timestamp);
  
  void drawInJsiCanvas(std::shared_ptr<JsiSkCanvas> jsiCanvas,
                       int width,
                       int height,
                       double time);

  std::shared_ptr<RNSkPlatformContext> _platformContext;
  std::shared_ptr<jsi::Function> _drawCallback;
  std::shared_ptr<JsiSkCanvas> _jsiCanvas;
  std::shared_ptr<std::timed_mutex> _jsDrawingLock;
  std::shared_ptr<std::timed_mutex> _gpuDrawingLock;
  std::shared_ptr<RNSkInfoObject> _infoObject;
  RNSkTimingInfo _jsTimingInfo;
  RNSkTimingInfo _gpuTimingInfo;
};

class RNSkJsView: public RNSkView {
public:
  /**
   * Constructor
   */
  RNSkJsView(std::shared_ptr<RNSkPlatformContext> context,
                     std::shared_ptr<RNSkCanvasProvider> canvasProvider):
    RNSkView(context,
             canvasProvider,
             std::make_shared<RNSkJsRenderer>(std::bind(&RNSkJsView::requestRedraw, this),
                                                      context)) {}
  
  void updateTouchState(std::vector<RNSkTouchInfo>& touches) override {
    std::static_pointer_cast<RNSkJsRenderer>(getRenderer())->getInfoObject()->updateTouches(touches);
    RNSkView::updateTouchState(touches);
  }
  
  void setJsiProperties(std::unordered_map<std::string, JsiValueWrapper> &props) override {
    for(auto& prop: props) {
      if(prop.first == "drawCallback") {
        if(prop.second.isUndefinedOrNull()) {
          // Clear drawcallback
          std::static_pointer_cast<RNSkJsRenderer>(getRenderer())->setDrawCallback(nullptr);
          return;
        } else if (prop.second.getType() != JsiWrapperValueType::Function) {
          // We expect a function for the draw callback custom property
          throw std::runtime_error("Expected a function for the drawCallback custom property.");
        }

        // Save callback
        std::static_pointer_cast<RNSkJsRenderer>(getRenderer())->setDrawCallback(prop.second.getAsFunction());        

        // Request redraw
        requestRedraw();

      } else {
        RNSkView::setJsiProperties(props);
      }
    }
  }
};
} // namespace RNSkia
