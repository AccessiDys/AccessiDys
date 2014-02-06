/* File: treeView.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

/*global cnedApp*/
/*jshint loopfunc:true*/
'use strict';

cnedApp.directive('ezTree', function() {

  return {
    restrict: 'A',
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function(tElement, tAttrs, transclude) {

      var repeatExpr,
        childExpr,
        rootExpr,
        childrenExpr,
        branchExpr;

      repeatExpr = tAttrs.ezTree.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);
      childExpr = repeatExpr[1];
      rootExpr = repeatExpr[2];
      childrenExpr = repeatExpr[3];
      branchExpr = repeatExpr[4];

      return function link(scope, element) {

        var rootElement = element[0].parentNode,
          cache = [];

        // Reverse lookup

        function lookup(child) {
          var i = cache.length;
          while (i--) {
            if (cache[i].scope[childExpr] === child) {
              return cache.splice(i, 1)[0];
            }
          }
        }

        scope.$watch(rootExpr, function(root) {

          var currentCache = [];

          // Recurse the data structure
          (function walk(children, parentNode, depth) {

            var i = 0,
              n = children.length,
              child,
              cached,
              cursor,
              grandchildren;

            // Iterate the children at the current level
            for (; i < n; ++i) {

              child = children[i];

              // See if this child has been previously rendered
              // using a reverse lookup by object reference
              cached = lookup(child);

              // If it has not, render a new element and prepare its scope
              // We also cache a reference to its branch node which will
              // be used as the parentNode in the next level of recursion
              if (!cached) {
                transclude(scope.$new(), function(clone, childScope) {
                  childScope[childExpr] = child;
                  cached = {
                    scope: childScope,
                    element: clone[0],
                    branch: clone.find(branchExpr)[0]
                  };
                });
              }

              // Store the current depth on the scope in case you want 
              // to use it (for good or evil, no judgment).
              cached.scope.$depth = depth;

              // We will compare the cached element to the element in 
              // at the destination index. If it does not match, then 
              // the cached element is being moved into this position.
              cursor = parentNode.childNodes[i];
              if (cached.element !== cursor) {
                parentNode.insertBefore(cached.element, cursor);
              }

              // Push the object onto the new cache which will replace
              // the old cache at the end of the walk.
              currentCache.push(cached);

              // If the child has children of its own, recurse 'em.             
              grandchildren = child[childrenExpr];
              if (grandchildren && grandchildren.length) {
                walk(grandchildren, cached.branch, depth + 1);
              }
            }
          })(root, rootElement, 0);

          // Cleanup objects which have been removed.
          // Remove DOM elements and destroy scopes to prevent memory leaks.
          var i = cache.length;
          while (i--) {
            cache[i].element.remove();
            cache[i].scope.$destroy();
          }

          // Replace previous cache.
          cache = currentCache;

        }, true);
      };
    }
  };
});

cnedApp.directive('uiNestedSortable', ['$parse',
  function($parse) {

    var eventTypes = 'Create Start Sort Change BeforeStop Stop Update Receive Remove Over Out Activate Deactivate'.split(' ');

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var options = attrs.uiNestedSortable ? $parse(attrs.uiNestedSortable)() : {};

        angular.forEach(eventTypes, function(eventType) {

          var attr = attrs['uiNestedSortable' + eventType],
            callback;

          if (attr) {
            callback = $parse(attr);
            options[eventType.charAt(0).toLowerCase() + eventType.substr(1)] = function(event, ui) {
              scope.$apply(function() {

                callback(scope, {
                  $event: event,
                  $ui: ui
                });
              });
            };
          }

        });

        //note the item="{{child}}" attribute on line 17
        options.isAllowed = function(item, parent) {
          if (!parent) return false;
          var attrs = parent.context.attributes;
          parent = attrs.getNamedItem('item');
          attrs = item.context.attributes;
          item = attrs.getNamedItem('item');
          //if ( ... ) return false;
          return true;
        };

        element.nestedSortable(options);

      }
    };
  }
]);