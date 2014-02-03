/*global cnedApp,CKEDITOR */
'use strict';

cnedApp.directive('ckEditor', ['$rootScope', function($rootScope) {
    return {
        require: '?ngModel',
        link: function($scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0], {
                toolbar: attr.barre
            });

            ck.on('pasteState', function() {
                $scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function() {
                ck.setData(ngModel.$modelValue);
            };

            function updateModel() {
                $scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            }

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            /* Get data of CKEDITOR */
            $rootScope.$on('getCkEditorValue', function() {
                $rootScope.ckEditorValue = CKEDITOR.instances.editorOcr.getData();
            });
        }
    };
}]);