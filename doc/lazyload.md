##wukong-craft 使用指南
#### Oclazyload懒加载
&emsp;&emsp;懒加载机制解决一次性加载过多网络资源的弊端，提高用户体验。wukong-craft使用Oclazyload实现，在使用懒加载时无需另外导入包。
&emsp;&emsp;如下例所示：

```
.state('home', {
	url: "/{page}",
    templateProvider: ['$stateParams','$templateCache','$http', function ($stateParams,$templateCache,$http) {
        var appConfig = $templateCache.get('meta/app-module-config.json');
        var config = appConfig[$stateParams.page];
        return $http.get(config.tpl).then(function (tpl) {
            return tpl.data;
        });
    }],
    controllerProvider: ['$stateParams','$templateCache', function ($stateParams, $templateCache) {
        var appConfig = $templateCache.get('meta/app-module-config.json');
        var config = appConfig[$stateParams.page];
        return config.ctrl;
    }],
    resolve: {
        listComponents: ['$ocLazyLoad','$templateCache', '$stateParams',function ($ocLazyLoad,$templateCache, $stateParams) {
            var appConfig = $templateCache.get('meta/app-module-config.json');
            var config = appConfig[$stateParams.page];
            return $ocLazyLoad.load(config.modules);
        }]
    }
});
```
&emsp;&emsp;在本例中，使用ocLazyLoad懒加载需要完成3项配置：
&emsp;&emsp;1、配置路由加载模板，对应templateProvider
&emsp;&emsp;2、配置路由控制器，对应controllerProvider
&emsp;&emsp;3、配置路由需要加载的文件列表，对应resolve
&emsp;&emsp;配置数据可以统一写在配置文件中，实现逻辑代码与配置参数的解耦。上例中参数从配置文件meta/app-module-config.json中获取。配置文件样例参考：
```
$templateCache.put("meta/app-module-config.json",{
    "chart": {
        "ctrl": "LineChartCtrl",
        "tpl": "chart/charts-template.html",
        "modules": [{name:"chart",
            files: ['chart/chart.js']
        }]
    }
});
```
&emsp;&emsp;路由跳转代码参考：
```
//指向home路由，其中page参数为chart
$state.go("home", {"page": "chart"}, {location: true, reload: true});
```
&emsp;&emsp;两端代码定义了路由home参数page为'chart'时的路由配置。LineChartCtrl为该路由的控制器，chart/charts-template.html为采用的模板，懒加载的文件为chart/chart.js。