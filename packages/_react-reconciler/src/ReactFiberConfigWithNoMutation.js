/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// Renderers that don't support mutation
// can re-export everything from this module.

function shim(...args) {
  throw new Error(
    'The current renderer does not support mutation. ' +
      'This error is likely caused by a bug in React. ' +
      'Please file an issue.',
  );
}

// Mutation (when unsupported)
export const supportsMutation = false;
export const cloneMutableInstance = shim;
export const cloneMutableTextInstance = shim;
export const appendChild = shim;
export const appendChildToContainer = shim;
export const commitTextUpdate = shim;
export const commitMount = shim;
export const commitUpdate = shim;
export const insertBefore = shim;
export const insertInContainerBefore = shim;
export const removeChild = shim;
export const removeChildFromContainer = shim;
export const resetTextContent = shim;
export const hideInstance = shim;
export const hideTextInstance = shim;
export const unhideInstance = shim;
export const unhideTextInstance = shim;
export const clearContainer = shim;
export const applyViewTransitionName = shim;
export const restoreViewTransitionName = shim;
export const cancelViewTransitionName = shim;
export const cancelRootViewTransitionName = shim;
export const restoreRootViewTransitionName = shim;
export const cloneRootViewTransitionContainer = shim;
export const removeRootViewTransitionClone = shim;
export const measureInstance = shim;
export const measureClonedInstance = shim;
export const wasInstanceInViewport = shim;
export const hasInstanceChanged = shim;
export const hasInstanceAffectedParent = shim;
export const startViewTransition = shim;
export const startGestureTransition = shim;
export const stopGestureTransition = shim;
export const createViewTransitionInstance = shim;
export const getCurrentGestureOffset = shim;
export const subscribeToGestureDirection = shim;
