/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

import ReactSharedInternals from 'shared/ReactSharedInternals';


export function addTransitionType(type) {
  const pendingTransitionTypes = ReactSharedInternals.V;
  if (pendingTransitionTypes === null) {
    ReactSharedInternals.V = [type];
  } else if (pendingTransitionTypes.indexOf(type) === -1) {
    pendingTransitionTypes.push(type);
  }
}
