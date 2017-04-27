/**
 * Created by zhoupan on 2015/9/14.
 */
angular.module('login-controller',[])

    .controller('LoginCtrl',['$scope', '$ionicPopup', '$timeout', '$state',  '$data', function($scope, $ionicPopup, $timeout, $state, $data) {
        $scope.formUser = {};

        //执行用户登录操作
        $scope.doLogin = function(){
             $timeout(function() {
                myPopup.close(); // 2秒后关闭
                $state.go("tab.personal");
            }, 2000);
        };
    }]);
