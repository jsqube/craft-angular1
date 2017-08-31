##wukong-craft 使用指南
#### json数据驱动业务模块开发
&emsp;&emsp;业务模块开发过程中，wukong-craft采用元数据驱动的方式使用wukong-craft-api动态生成页面，参考如下样例：
```
.state("home.list", {
    url: "/{docName}/{action}",
    templateProvider: ['$stateParams','$templateCache','$http',function ($stateParams,$templateCache,$http) {
        var appConfig= $templateCache.get('meta/app-module-config.json');
        console.log(appConfig);
        var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
        console.log("template file=",config.tpl);
        return $http.get(config.tpl).then(function (tpl) {
            return tpl.data;
        })
    }],

    controllerProvider: ['$stateParams','$templateCache', function ($stateParams, $templateCache) {
        var appConfig= $templateCache.get('meta/app-module-config.json');
        var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
        console.log("route is: /form/{}/{}", $stateParams.docName,$stateParams.action);
        console.log("route config controller: {1}", config);
        return config.ctrl;
    }],
    resolve: {
        listComponents: ['$ocLazyLoad','$templateCache', '$stateParams',function ($ocLazyLoad,$templateCache, $stateParams) {
            var appConfig= $templateCache.get('meta/app-module-config.json');
            console.log(appConfig);
            var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
            console.log("template modules=",config.modules);
            return $ocLazyLoad.load(config.modules);
        }],
        data: ['CrudService', '$stateParams', '$q','$templateCache','listComponents',function (CrudService, $stateParams, $q,$templateCache,listComponents) {
            console.log($stateParams.docName);
            var appConfig= $templateCache.get('meta/app-module-config.json');
            console.log(appConfig);
            var config=appConfig[$stateParams.docName + '-' + $stateParams.action];
            console.log(config.repo);
            var deferred = $q.defer();
            CrudService.list(config.repo).then(function (data) {
                console.log(data);
                var result = data["content"];
                console.log(result);
                deferred.resolve(result);
            }, function (msg) {
                console.log(msg);
                deferred.resolve([]);
            });
            return deferred.promise;
        }],
        meta: ['$templateCache', '$stateParams','listComponents',function ($templateCache, $stateParams,listComponents) {
            console.log($stateParams.docName);
            var metadata = $templateCache.get("meta/" + $stateParams.docName + '-' + $stateParams.action+".json");
            console.log(metadata);
            return metadata;
        }]

    }
})
```
&emsp;&emsp;该样例中，需要配置的数据项共有5个：
&emsp;&emsp;1、配置路由加载模板，对应templateProvider
&emsp;&emsp;2、配置路由控制器，对应controllerProvider
&emsp;&emsp;3、配置路由需要加载的文件列表，对应resolve中listComponents
&emsp;&emsp;4、配置api中需要获取的业务数据，对应resolve中data
&emsp;&emsp;5、配置api中页面元素，对应resolve中meta
&emsp;&emsp;配置数据可以统一写在配置文件中，实现逻辑代码与配置参数的解耦。上例中参数从配置文件meta/app-module-config.json中获取。配置文件样例参考：
```
$templateCache.put("meta/app-module-config.json",{
	"data-source-list": {
	    "repo": "reportDataSource",
	    "ctrl": "DataSourceCtrl",
	    "tpl": "views/list.html",
	    "modules": [{name:"DataSourceCtrl",
	        files: ['scripts/controllers/data-source-controller.js']
	    }]
	}
});
$templateCache.put("meta/data-source-list.json",{
    "repo":"reportDataSource",
    "columns": [
        {"name": "id", "label": "ID", "sort": "id"},
        {"name": "name", "label": "数据源名称", "sort": "name"}
    ],
    "topButtons": [
        {
            "callback": "export",
            "params": {"docName":"data-source"},
            "label": "导出",
            "class": "btn btn-sm btn-primary",
            "icon": "glyphicon glyphicon-export"
        },
        {
            "callback": "import",
            "params": {"docName":"data-source"},
            "label": "导入",
            "class": "btn btn-sm btn-primary",
            "icon": "glyphicon glyphicon-import"
        },
        {
            "callback": "new",
            "params": {"docName":"data-source"},
            "label": "添加",
            "class": "btn btn-sm btn-primary",
            "icon": "glyphicon glyphicon-plus-sign"
        }
    ],
    "inlineButtons": [
        {
            "callback": "edit",
            "label": "编辑",
            "class": "btn btn-xs btn-primary",
            "icon": "glyphicon glyphicon-edit"
        },
        {
            "callback": "delete",
            "label": "删除",
            "class": "btn btn-xs btn-danger",
            "icon": "glyphicon glyphicon-trash"
        }
    ]
});
```
&emsp;&emsp;上例配置文件中，实现data-source-list数据源列表配置，前4项配置写在meta/app-module-config.json中，第5项页面元素配置写在meta/data-source-list.json中。结合两端代码可以发现，业务数据采用CrudService与后台交互动态获取，数据源列表页面元素包含了repo、columns、topButtons和inlineButtons，使用中解析json即可。