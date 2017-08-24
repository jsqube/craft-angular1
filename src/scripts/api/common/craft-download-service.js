(function () {
    'use strict';
    /**
     * ========================================================================
     * DownloadService
     * ========================================================================
     */
    angular.module('craft.api.download',[]).factory('DownloadService', DownloadServiceFun);
    DownloadServiceFun.$inject=[];
    function DownloadServiceFun(){
        var downloadService = angular.extend({});
        downloadService.strMimeType = 'application/octet-stream;charset=utf-8';
        downloadService.setMimeType = function (mimeType) {
            this.strMimeType = mimeType;
        };

        downloadService.isIE = function () {
            var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
            return match ? parseInt(match[1]) : false;
        };
        downloadService.isSafari = function () {
            var match = navigator.userAgent.match('(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/');
            return match ? parseInt(match[2]) : false;
        };
        downloadService.downloadFile = function (fileName, content) {
            var D = document;
            var a = D.createElement('a');
            var rawFile;
            var ieVersion;

            ieVersion = this.isIE();
            if (ieVersion && ieVersion < 10) {
                var frame = D.createElement('iframe');
                document.body.appendChild(frame);

                frame.contentWindow.document.open("text/html", "replace");
                frame.contentWindow.document.write('sep=,\r\n' + content);
                frame.contentWindow.document.close();
                frame.contentWindow.focus();
                frame.contentWindow.document.execCommand('SaveAs', true, fileName);

                document.body.removeChild(frame);
                return true;
            }

            // IE10+
            if (navigator.msSaveBlob) {
                return navigator.msSaveBlob(
                    new Blob([content], {
                        type: this.strMimeType
                    }),
                    fileName
                );
            }

            //html5 A[download]
            if ('download' in a) {
                var blob = new Blob(
                    [content], {
                        type: this.strMimeType
                    }
                );
                rawFile = URL.createObjectURL(blob);
                a.setAttribute('download', fileName);
            } else {
                rawFile = 'data:' + this.strMimeType + ',' + encodeURIComponent(content);
                a.setAttribute('target', '_blank');
            }

            a.href = rawFile;
            a.setAttribute('style', 'display:none;');
            D.body.appendChild(a);
            setTimeout(function () {
                if (a.click) {
                    a.click();
                    // Workaround for Safari 5
                } else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                }
                D.body.removeChild(a);
            }, this.delay);
        };

        return downloadService;
    }
}).call(this);