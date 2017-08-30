/**
 * Created by irving on 2017/8/30.
 */
(function () {
    'use strict';
    angular.module('craft.auth.handler', ["ngToast"]);
    angular.module('craft.auth.handler').factory('AuthHandlerService', AuthHandlerServiceFunc);

    AuthHandlerServiceFunc.$inject = ["ngToast", "$state"];

    function AuthHandlerServiceFunc(ngToast, $state) {

        return {
            notLogonHandler: function () {
                ngToast.create({
                    className: 'danger',
                    content: '未登录,请登录'
                });
                $state.go('auth.login', {location: true, reload: true});
            },

            errorLogonHandler: function (error) {
                ngToast.create({
                    className: 'danger',
                    content: '登录失败' + error.errMsg
                });
            },

            toastError: function (error) {
                ngToast.create({
                    className: 'danger',
                    content: error.errMsg
                });
            }
        };
    }

}).call(this);