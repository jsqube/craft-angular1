/**
 * Created by Ming on 2017/6/3.
 */
angular.module('AuthCtrl',[]).controller('AuthCtrl',function ($scope,HttpService,ConfigService, TokenService,$state) {
    $scope.login=function () {
        console.log("login",$scope.user);
        HttpService.post(ConfigService.getAppConfig().RootPath+'/auth',$scope.user).then(function (data) {
            console.log(data);
            TokenService.saveToken(ConfigService.getAppConfig().authTokenName,data.token);
            $state.go('home.default');
        },function (error) {
            console.log(error)
        });

    }
});