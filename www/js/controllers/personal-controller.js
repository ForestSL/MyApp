angular.module('personal-controller',[])
    .controller('PersonalCtrl',['$scope','$ionicPopup', '$state','$data', function($scope, $ionicPopup,$state,$data){

      
        //获取当前session中的user(即当前登录的用户)
        $scope.user = JSON.parse(sessionStorage.getItem("user"));
        $data.getAnnocement("bulletin",  $scope.user).success(function(data){
                if(data == "err in post /bulletin"){
                    $scope.showErrorMesPopup("error in bulletin");
                    console.log(2);
                }else{
                     var bulletins = JSON.stringify(data);
                     console.log(bulletins);
                     sessionStorage.setItem("bulletins",bulletins);
                }
          });

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

        //个人信息
        $scope.show_personal_infor = function() {
            $state.go("information");
        };
        $scope.show_announcement = function() {

        

            $state.go("announce");
        };
        $scope.modifyPassword = function(){
          $state.go("modify");  
        };
    }])

    .controller('PersonalInforCtrl',['$scope', '$state', function($scope, $state){

        //获取当前session中的user(即当前登录的用户)
        $scope.user = JSON.parse(sessionStorage.getItem("user"));
        
        $scope.back2personal = function(){
            $state.go("tab.personal");
        };

    }])

    .controller('ModifyCtrl',['$scope', '$state', function($scope, $state){
        $scope.back2personal = function(){
            $state.go("tab.personal");
        };
    }])

    .controller('AnnounceCtrl',['$scope', '$state', function($scope, $state){
     
        $scope.bulletins = JSON.parse(sessionStorage.getItem("bulletins"));
//        $scope.bulletins = [
//        {name:'argscheck',
//        time:'123',
//        content:'123123'},
//       {name:'argscheck',
//        time:'123',
//        content:'123123'}
//        ] 
        $scope.back2personal = function(){
            $state.go("tab.personal");
        };
    }]);
