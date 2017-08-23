(function () {
    angular.module('DictCtrl',[]).controller('DictCtrl',function ($scope,$state,BaseHandler,CrudService,DownloadService) {
        $scope.handlers = angular.extend(BaseHandler);
        $scope.handlers.getDocName=function () {
            return "dict";
        };
        $scope.handlers.getRepoName=function () {
            return "dictionary";
        };
        $scope.handlers.hideDictionary=function (item) {
            return item["type"]==="2";
        };
        $scope.handlers.hideHintSearch=function (item) {
            return item["type"]==="1";
        };

        $scope.handlers.export=function (item) {
            var selectedItems=$scope.getSelectedItems(item);
            console.log(selectedItems);
            var methodParams={ids:JSON.stringify(selectedItems)};
            CrudService.getService('dictService','export',methodParams).then(function (data) {
                console.log(data);
                DownloadService.downloadFile("dict.json",angular.toJson(data.data,true));
            },function (error) {
                console.log(error)
            })
        };
        $scope.getSelectedItems=function (targetList) {
            return targetList.filter(function (item) {
                return item.checked;
            }).map(function (item) {
                return item.id;
            });
        }
    })
}).call(this);