
angular.module('personal-controller',[])
    .controller('PersonalCtrl',['$scope','$ionicPopup', '$state', function($scope, $ionicPopup, $state){

    


        // 确认弹出框
        $scope.showConfirm = function() {
            $ionicPopup.confirm({
                title: "确认退出当前登录？",
                okText:"确认",
                cancelText:"取消"
            })
                .then(function(res) {
                    if(res) {
                        $state.go('login');
                    } else {
                       return false;
                    }
                });
        };

        //滑动跳转
        $scope.onSwipeRight = function() {
            $state.go("tab.task");
        };


    }]);
