/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


import {
  getWorkInProgressRoot,
  getPendingTransitionTypes,
} from './ReactFiberWorkLoop';

import {getIsHydrating} from './ReactFiberHydrationContext';

import {getTreeId} from './ReactFiberTreeContext';





let globalClientIdCounter = 0;

export function assignViewTransitionAutoName(
  props,
  instance,
) {
  if (instance.autoName !== null) {
    return instance.autoName;
  }

  const root = ((getWorkInProgressRoot()));
  const identifierPrefix = root.identifierPrefix;

  let name;
  if (getIsHydrating()) {
    const treeId = getTreeId();
    // Use a captial R prefix for server-generated ids.
    name = '\u00AB' + identifierPrefix + 'T' + treeId + '\u00BB';
  } else {
    // Use a lowercase r prefix for client-generated ids.
    const globalClientId = globalClientIdCounter++;
    name =
      '\u00AB' +
      identifierPrefix +
      't' +
      globalClientId.toString(32) +
      '\u00BB';
  }
  instance.autoName = name;
  return name;
}

export function getViewTransitionName(
  props,
  instance,
) {
  if (props.name != null && props.name !== 'auto') {
    return props.name;
  }
  // We should have assigned a name by now.
  return (instance.autoName);
}

function getClassNameByType(classByType) {
  if (classByType == null || typeof classByType === 'string') {
    return classByType;
  }
  let className = null;
  const activeTypes = getPendingTransitionTypes();
  if (activeTypes !== null) {
    for (let i = 0; i < activeTypes.length; i++) {
      const match = classByType[activeTypes[i]];
      if (match != null) {
        if (match === 'none') {
          // If anything matches "none" that takes precedence over any other
          // type that also matches.
          return 'none';
        }
        if (className == null) {
          className = match;
        } else {
          className += ' ' + match;
        }
      }
    }
  }
  if (className == null) {
    // We had no other matches. Match the default for this configuration.
    return classByType.default;
  }
  return className;
}

export function getViewTransitionClassName(
  defaultClass,
  eventClass,
) {
  const className = getClassNameByType(defaultClass);
  const eventClassName = getClassNameByType(eventClass);
  if (eventClassName == null) {
    return className;
  }
  if (eventClassName === 'none') {
    return eventClassName;
  }
  if (className != null && className !== 'none') {
    return className + ' ' + eventClassName;
  }
  return eventClassName;
}
