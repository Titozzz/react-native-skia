/*global NodeJS*/
import type { HostConfig } from "react-reconciler";

import { exhaustiveCheck, shallowEq } from "../renderer/typeddash";

import { GroupNode } from "./nodes/GroupNode";
import {
  NodeType,
  isDeclarationNode,
  CircleNode,
  FillNode,
  RectNode,
} from "./nodes";
import type { CircleNodeProps, GroupNodeProps, RootNode, Node } from "./nodes";

const DEBUG = false;
export const debug = (...args: Parameters<typeof console.log>) => {
  if (DEBUG) {
    console.log(...args);
  }
};

class InvalidChildren extends Error {
  constructor(type: NodeType, msg: string) {
    super(`${type} doesn't have children (${msg})`);
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      skGroup: GroupNodeProps;
      skCircle: CircleNodeProps;
    }
  }
}

type Container = RootNode;
type Instance = Node;

// should it be Record<string, any>?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any;
type TextInstance = Node;
type SuspenseInstance = Instance;
type HydratableInstance = Instance;
type PublicInstance = Instance;
type HostContext = null;
type UpdatePayload = true;
type ChildSet = unknown;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;

type SkiaHostConfig = HostConfig<
  NodeType,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
>;

const appendNode = (parent: Node, child: Node) => {
  if (isDeclarationNode(parent)) {
    parent.children.push(child);
  } else {
    throw new InvalidChildren(parent.type, `trying to append ${child.type}`);
  }
};

const removeNode = (parent: Node, child: Node) => {
  if (isDeclarationNode(parent)) {
    const index = parent.children.indexOf(child);
    parent.children.splice(index, 1);
    // TODO: PUT THIS BACK!!!!!!
    //child.depMgr.unSubscribeNode(child);
    // unsubscribe to all children as well
    if (isDeclarationNode(child)) {
      for (const c of child.children) {
        removeNode(child, c);
      }
    }
  } else {
    throw new InvalidChildren(parent.type, `trying to remove ${child.type}`);
  }
};

const insertBefore = (parent: Node, child: Node, before: Node) => {
  if (isDeclarationNode(parent)) {
    const index = parent.children.indexOf(child);
    if (index !== -1) {
      parent.children.splice(index, 1);
    }
    const beforeIndex = parent.children.indexOf(before);
    parent.children.splice(beforeIndex, 0, child);
  } else {
    throw new InvalidChildren(parent.type, `trying to append ${child.type}`);
  }
};

const createNode = (_container: Container, type: NodeType, props: Props) => {
  switch (type) {
    case NodeType.Circle:
      return new CircleNode(props);
    case NodeType.Fill:
      return new FillNode();
    case NodeType.Rect:
      return new RectNode(props);
    case NodeType.Group:
      return new GroupNode(props);
    case NodeType.Root:
      throw new Error(`Unsupported Skia Node: ${type}`);
    default:
      // TODO: here we need to throw a nice error message
      // This is the error that will show up when the user uses nodes not supported by Skia (View, Audio, etc)
      return exhaustiveCheck(type, "Unsupported Skia Node:");
  }
};

export const skHostConfig: SkiaHostConfig = {
  /**
   * This function is used by the reconciler in order to calculate current time for prioritising work.
   */
  now: Date.now,

  supportsMutation: true,
  isPrimaryRenderer: false,
  supportsPersistence: false,
  supportsHydration: false,
  //supportsMicrotask: true,

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  appendChildToContainer(container, child) {
    debug("appendChildToContainer", container, child);
    appendNode(container, child);
  },

  appendChild(parent, child) {
    debug("appendChild", parent, child);
    appendNode(parent, child);
  },

  getRootHostContext: (_rootContainerInstance: Node) => {
    debug("getRootHostContext");
    return null;
  },

  getChildHostContext(_parentHostContext, _type, _rootContainerInstance) {
    debug("getChildHostContext");
    return null;
  },

  shouldSetTextContent(_type, _props) {
    return false;
  },

  createTextInstance(
    _text,
    _rootContainerInstance,
    _hostContext,
    _internalInstanceHandle
  ) {
    debug("createTextInstance");
    // return SpanNode({}, text) as SkNode;
    throw new Error("Text nodes are not supported yet");
  },

  createInstance(
    type,
    props,
    container,
    _hostContext,
    _internalInstanceHandle
  ) {
    debug("createInstance", type);
    return createNode(container, type, props) as Node;
  },

  appendInitialChild(parentInstance, child) {
    debug("appendInitialChild");
    appendNode(parentInstance, child);
  },

  finalizeInitialChildren(
    parentInstance,
    _type,
    _props,
    _rootContainerInstance,
    _hostContext
  ) {
    debug("finalizeInitialChildren", parentInstance);
    return false;
  },

  commitMount() {
    // if finalizeInitialChildren = true
    debug("commitMount");
  },

  prepareForCommit(_containerInfo) {
    debug("prepareForCommit");
    return null;
  },

  finalizeContainerChildren: () => {
    debug("finalizeContainerChildren");
  },

  resetAfterCommit(container) {
    debug("resetAfterCommit");
    container.redraw();
  },

  getPublicInstance(node: Instance) {
    debug("getPublicInstance");
    return node;
  },

  prepareUpdate: (
    _instance,
    type,
    oldProps,
    newProps,
    _rootContainerInstance,
    _hostContext
  ) => {
    debug("prepareUpdate");
    const propsAreEqual = shallowEq(oldProps, newProps);
    if (propsAreEqual) {
      return null;
    }
    debug("update ", type);
    return true;
  },

  commitUpdate(
    instance,
    _updatePayload,
    type,
    _prevProps,
    nextProps,
    _internalHandle
  ) {
    debug("commitUpdate: ", type);
    instance.props = nextProps;
  },

  commitTextUpdate: (
    _textInstance: TextInstance,
    _oldText: string,
    _newText: string
  ) => {
    //  textInstance.instance = newText;
  },

  clearContainer: (container) => {
    debug("clearContainer");
    container.children.splice(0);
  },

  preparePortalMount: () => {
    debug("preparePortalMount");
  },

  removeChild: (parent, child) => {
    removeNode(parent, child);
  },

  removeChildFromContainer: (parent, child) => {
    removeNode(parent, child);
  },

  insertInContainerBefore: (parent, child, before) => {
    insertBefore(parent, child, before);
  },

  insertBefore: (parent, child, before) => {
    insertBefore(parent, child, before);
  },
};
