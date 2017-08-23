(function () {
    angular.module('ReportCtrl',[]).controller('ReportCtrl',function ($scope,$state,BaseHandler,CrudService,DownloadService ) {

        $scope.handlers = angular.extend(BaseHandler);
        $scope.handlers.getDocName=function () {
            return "report";
        };
        // $scope.handlers.new=function (obj) {
        //     console.log("new", obj);
        //     $state.go("home.reportDesign", {}, {location: true, reload: false});
        // };
        // $scope.handlers.edit = function (item) {
        //     $state.go("home.reportEdit", {"docName": BaseHandler.getDocName(), "id": item.id}, {location: true, reload: false});
        // };
        $scope.handlers.preview = function (item) {
            $state.go("home.edit", {"docName": BaseHandler.getDocName(),"action":"preview", "id": item.id}, {location: true, reload: false});
        };


        $scope.handlers.getRepoName=function () {
            return "report"
        };
        $scope.handlers.export=function (item, params) {
            console.log(item,params);
            var selectedItems=$scope.getSelectedItems(item);
            console.log(selectedItems);
            var methodParams={ids:JSON.stringify(selectedItems)};
            CrudService.getService('reportService','export',methodParams).then(function (data) {
                console.log(data);
                DownloadService.downloadFile("report.json",angular.toJson(data.data,true));
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
        };

        $scope.handlers.import=function (item, params) {
            console.log("import",params);
            $state.go("home.list", {"docName": BaseHandler.getDocName(),"action":"import"}, {location: true, reload: false});

        };
    });

    angular.module('ReportCtrl').controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
        var $ctrl = this;
        $ctrl.items = items;
        $ctrl.selected = {
            item: $ctrl.items[0]
        };

        $ctrl.ok = function () {
            $uibModalInstance.close($ctrl.selected.item);
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
}).call(this);