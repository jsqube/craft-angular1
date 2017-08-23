(function () {
    angular.module('metadata', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put("meta/app-config.json",{
            RootPath:'http://localhost:9000',
            authTokenName:"JWT-TOKEN"
        });

        $templateCache.put("meta/app-module-config.json",{
            "report-list": {
                "repo": "report",
                "ctrl": "ReportCtrl",
                "tpl": "views/list.html",
                "modules": [{
                    files: ['scripts/controllers/report-controller.js']
                }]
            },

            "data-source-list": {
                "repo": "reportDataSource",
                "ctrl": "DataSourceCtrl",
                "tpl": "views/list.html",
                "modules": [{
                    files: ['scripts/controllers/data-source-controller.js']
                }]
            },
            "dict-list": {
                "repo": "dictionary",
                "ctrl": "DictCtrl",
                "tpl": "views/list.html",
                "modules": [{
                    files: ['scripts/controllers/dict-controller.js']
                }]
            },
            "form-designer-list": {
                "repo": "forms",
                "ctrl": "FormDesignerCtrl",
                "tpl": "views/list.html",
                "modules": [{
                    files: ['scripts/controllers/form-designer-controller.js']
                }]
            }
        });

        $templateCache.put("meta/report-list.json",{
            "repo":"report",
            "columns": [
                {"type":"checkbox","name": "id","model":"selectedIds"},
                {"name": "id", "label": "ID", "sort": "id"},
                {"name": "reportName", "label": "报表名称", "sort": "reportName"}
            ],
            "topButtons": [
                {
                    "callback": "export",
                    "params": {"docName":"report"},
                    "label": "导出",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-export"
                },
                {
                    "callback": "import",
                    "params": {"docName":"report"},
                    "label": "导入",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-import"
                },
                {
                    "callback": "new",
                    "params": {"docName":"report"},
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
                    "callback": "preview",
                    "label": "预览",
                    "class": "btn btn-xs btn-info",
                    "icon": "glyphicon glyphicon-signal"
                },
                {
                    "callback": "delete",
                    "label": "删除",
                    "class": "btn btn-xs btn-danger",
                    "icon": "glyphicon glyphicon-trash"
                }
            ]
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
    }]);
}).call(this);