/**
 * Created by Ming on 2017/4/12.
 */
(function () {
    angular.module("FormDesignerCtrl",[]).controller("FormDesignerCtrl",function ($scope,$state,BaseHandler) {
        $scope.handlers = angular.extend(BaseHandler);
        $scope.handlers.getDocName=function () {
            // console.log("this is getting called");
            return "form-designer";
        };
        $scope.handlers.config={
            "tpl":"views/"
        };
        // $scope.handlers.new=function (obj) {
        //     console.log("new", obj);
        //     $state.go("home.formDesign", obj, {location: true, reload: false});
        // };
        // $scope.handlers.edit = function (item) {
        //     $state.go("home.formEdit", {"docName": BaseHandler.getDocName(), "id": item.id}, {location: true, reload: false});
        // };
        $scope.handlers.preview = function (item) {
            $state.go("home.edit", {"docName": BaseHandler.getDocName(),"action":"preview", "id": item.id}, {location: true, reload: false});
        };

        $scope.handlers.getRepoName=function () {
            return "forms";
        }
    })
}).call(this);