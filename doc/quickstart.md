##wukong-craft 使用指南
#### quickstart
&emsp;&emsp;使用wukong-craft需导入craft-core.min.js、craft.css文件，见示例：

```
<head>
    <meta charset="UTF-8">
    <title>Craft quick start demo</title>
    <link rel="stylesheet" href="../dist/craft/css/craft.css"/>
</head>
<body>
<script src="../dist/craft/min/craft-core.min.js"></script>

    <div ng-controller="DemoCtrl">
        {{model}}
    </div>
<script>
    angular.module("app",['craft.core']);
    angular.module("app").controller("DemoCtrl",function ($scope) {
        $scope.model="Hello Craft!";
    })
</script>
```
&emsp;&emsp;示例中导入了craft-core.min.js、craft.css文件，在body中单项绑定model参数。浏览器中打开该网页，如果wukong-craft正常工作则在网页内显示Hello Craft!，如果未能正常工作，则显示{{model}}。

#### 2. Oclazyload懒加载
&emsp;&emsp;懒加载机制解决一次性加载过多网络资源的弊端，提高用户体验。wukong-craft使用Oclazyload实现，在使用懒加载时无需另外导入包。使用方式如下：
&emsp;&emsp;1、在路由配置中给出按需加载的模块列表，如下例所示：

```
$stateProvider.state('chart', {
    templateProvider: ['$http', function ($http) {
        return $http.get("chart/charts-template.html").then(function (tpl) {
            return tpl.data;
        })
    }],
    controllerProvider: [function () {
        return "LineChartCtrl"
    }],
    resolve: {
        chart: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
                    name: "chart",
                    files: ["chart/chart.js"]
                });
        }]
    }
})
```
&emsp;&emsp;本例中完成在路由跳转至chart时，加载文件files: ["chart/chart.js"]。
&emsp;&emsp;2、在引入懒加载文件列表的同时，可以为该路由指定控制器，如上例中LineChartCtrl呗设置为该路由的Controller，在chart/chart.js中实现了该controller的定义。
#### 3. 配置文件
&emsp;&emsp;在wukong-craft中通过将参数写入json中，实现项目config参数及各个api的参数配置。
&emsp;&emsp;以ConfigService为例，该service中可以配置项目根目录。如下所示：
```
$templateCache.put("meta/app-config.json",{
    RootPath:'http://localhost:9000',
    authTokenName:"JWT-TOKEN"
});
```
&emsp;&emsp;这里将项目参数写入meta/app-config.json中，如在使用项目中需要获取RootPath参数，可以通过调用ConfigService.getAppConfig().RootPath即可获取。
&emsp;&emsp;api参数配置样例如下：
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
```
上例中将数据源列表参数配置到app-module-config.json中去，在使用中可以参考：
```
var appConfig= $templateCache.get('meta/app-module-config.json');
//使用appConfig['uib-modules']['modules'].files可以得到files列表内容
```
&emsp;&emsp;将所有api配置放在统一位置，可以便于查找修改，将配置文件和逻辑代码隔离开。