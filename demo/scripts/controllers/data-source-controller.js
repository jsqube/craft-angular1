/**
 * Created by Ming on 2017/4/19.
 */
(function () {
    angular.module('DataSourceCtrl', []).controller("DataSourceCtrl", function ($scope,BaseHandler,CrudService,DownloadService,ngToast) {
        // console.log(data);
        // console.log(meta);
        // $scope.data = data;
        // $scope.meta = meta;
        // $scope.user = {name: "jone"};

        $scope.handlers = angular.extend(BaseHandler);
        // $scope.handlers.advise=function (item) {
        //     if (item) {
        //         item.lockLabel = item.isLocked ? '已锁定' : "未锁定";
        //         item.birthdayDis = $filter('date')(item.birthday, 'yyyy-MM-dd');
        //     }
        // }
        $scope.handlers.getDocName=function () {
            console.log("this is getting called");
            return "data-source";
        };
        $scope.handlers.getRepoName=function () {
            return "reportDataSource";
        };
        $scope.handlers.itemChanged=function (item) {
            var driverOptions= {
                "MySQL": {
                    "driverClass": "com.mysql.jdbc.Driver",
                        "protocol": "jdbc:mysql://",
                        "delimiter": "/"
                },
                "Oracle": {
                    "driverClass": "oracle.jdbc.driver.OracleDriver",
                        "protocol": "jdbc:oracle:thin@",
                        "delimiter": ":"
                },
                "SqlServer": {
                    "driverClass": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
                        "protocol": "jdbc:sqlserver://",
                        "delimiter": ";databasename="
                },
                "Sybase": {
                    "driverClass": "com.sybase.jdbc3.jdbc.SybDriver",
                        "protocol": "jdbc:sybase:Tds:",
                        "delimiter": "/"
                },
                "DB2": {
                    "driverClass": "com.ibm.db2.jdbc.app.DB2Driver",
                        "protocol": "jdbc:db2://",
                        "delimiter": "/"
                },
                "PostgreSql": {
                    "driverClass": "org.postgresql.Driver",
                        "protocol": "jdbc:postgresql://",
                        "delimiter": "/"
                }
            };

            if(item.hasOwnProperty("driverType")){
                var type=item["driverType"];
                item.driverClass=driverOptions[type].driverClass;
                item.jdbcUrl=driverOptions[type].protocol+ item.host+":"+item.port+driverOptions[type].delimiter+item.schema;
            }
        };

        $scope.handlers.testConnection=function (item) {
            // CrudService.service('dataSourceService','testConnection',item).then(function (data) {
            //     console.log(data);
            //     // vm.serviceData=data["_embedded"]["reportDataSource"];
            // },function (error) {
            //     console.log(error)
            // })


            var params={"dataSource":JSON.stringify(item)};

            CrudService.postService('dataSourceService','testConnection',params).then(function (data) {
                    console.log(data.data);
                    // vm.serviceData=data["_embedded"]["reportDataSource"];
                    if(data.data===true){
                        ngToast.create({
                            "content":"<a href='#' class=''>数据库链接正常！</a>",
                            "className":'success',
                            "horizontalPosition":"center",
                            "verticalPosition":"middle",
                            "maxNumber":2,
                            "timeout":1000
                        });
                    }else{
                        ngToast.create({
                            "content":"<a href='#' class=''>数据库链接失败！</a>",
                            "className":'warning',
                            "horizontalPosition":"center",
                            "verticalPosition":"middle",
                            "maxNumber":2,
                            "timeout":1000
                        });
                    }

                },function (error) {
                    console.log(error)
                    ngToast.create({
                        "content":"<a href='#' class=''>数据库链接失败！</a>",
                        "className":'warning',
                        "horizontalPosition":"center",
                        "verticalPosition":"middle",
                        "maxNumber":2,
                        "timeout":1000
                    });
                })
        }

        $scope.handlers.export=function (item) {
            var selectedItems=$scope.getSelectedItems(item);
            console.log(selectedItems);
            var methodParams={ids:JSON.stringify(selectedItems)};
            CrudService.getService('dataSourceService','export',methodParams).then(function (data) {
                console.log(data);
                DownloadService.downloadFile("dataSource.json",angular.toJson(data.data,true));
            },function (error) {
                console.log(error)
                ngToast.create({
                    "content":"<a href='#' class=''>数据库导出失败！</a>",
                    "className":'warning',
                    "horizontalPosition":"center",
                    "verticalPosition":"middle",
                    "maxNumber":2,
                    "timeout":1000
                });
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