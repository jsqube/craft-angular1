(function () {
    angular.module('craft.widgets.FieldRender',[]);
    angular.module('craft.widgets.FieldRender').directive('craftFieldRender',  ['$templateCache', '$compile',  function ($templateCache, $compile) {

        var getTemplateUrl = function(type) {
            var templateUrl = "templates/widgets/field-render/" + type + ".html";
            return templateUrl;
        };

        var linker = function (scope, element, attribute) {
            var templateUrl=getTemplateUrl(scope.field.type);
            // $http.get(templateUrl).success(function(data) {
            //     element.html(data);
            //     $compile(element.contents())(scope);
            // });

            element.html($templateCache.get(templateUrl));
            $compile(element.contents())(scope);

            // scope.fieldValue = _.get(scope.currentItem, scope.field.name);
            // scope.$watch("fieldValue", function (newValue, oldValue, scope) {
            //     _.set(scope.currentItem, scope.field.name, newValue);
            // });
        };
        return {
            restrict: 'E',
            scope: {
                field: '=',
                currentItem: '='
            },
            controller:[function(){
            }],
            link: linker
        };
    }]);

}).call(this);