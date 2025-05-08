/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

import {enableViewTransition} from 'shared/ReactFeatureFlags';

export let viewTransitionMutationContext = false;

export function pushMutationContext() {
  if (!enableViewTransition) {
    return false;
  }
  const prev = viewTransitionMutationContext;
  viewTransitionMutationContext = false;
  return prev;
}

export function popMutationContext(prev) {
  if (enableViewTransition) {
    viewTransitionMutationContext = prev;
  }
}

export function trackHostMutation() {
  if (enableViewTransition) {
    viewTransitionMutationContext = true;
  }
}
