angular.module('personal-controller',[])
    .controller('AccountCtrl', function($scope,MyInfo,$ionicPopup,$state,$data,bulletinsService) {
//        $scope.myInfo = MyInfo.all();
		//获取当前session中的user(即当前登录的用户)
       	var asd = {ss:"asdd"};
        console.log(asd);
 //       var myuser = JSON.parse(MyInfo.getLocalInfor());
        $scope.user = JSON.parse(MyInfo.getLocalInfor());
 //       console.log(myuser);
        console.log($scope.user);
        $data.getAnnocement("bulletin", MyInfo.getLocalInfor()).success(function(data){
                if(data == "err in post /bulletin"){
                    $scope.showErrorMesPopup("error in bulletin");
                    
                    console.log(2);
                }else{

                     var mybulletins = JSON.stringify(data);
                     console.log(mybulletins);
                     bulletinsService.initBulletins(mybulletins);
                     console.log(bulletinsService.getBulletins());
                     //sessionStorage.setItem("bulletins",bulletins);
                }
          });

        // 确认弹出框
        $scope.showConfirm = function() {
            $ionicPopup.confirm({
                title: "确认退出当前登录？",
                okText:"确认",
                cancelText:"取消"
            })
                .then(function(res){
                    if(res) {
                        window.JMessage.logout(function() {
                            console.log("登出极光成功");
                                    }, function(errorStr) {
                             console.log(errorStr);  // 输出错误信息。
    });
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

            console.log("输出个人资料");
            $scope.user=MyInfo.getLocalInfor();
            console.log($scope.user);
            $state.go("information");
        };
        $scope.show_announcement = function() {

        

            $state.go("announce");
        };
        $scope.modifyPassword = function(){
          $state.go("modify");  
        };
    })

    .controller('PersonalInforCtrl', function($scope, $state,MyInfo){

        //获取当前session中的user(即当前登录的用户)
        console.log(MyInfo.getLocalInfor());
        $scope.information = JSON.parse(MyInfo.getLocalInfor());
        console.log($scope.information);
//        $scope.IsLeader = "傻逼";
/*        if(information.isLeader == "1")
            $scope.IsLeader = {"董事长"}；
        else if(information.isLeader == information.userDepart)
            $scope.IsLeader = {"部长"};
        else
            $scope.IsLeader = {"部员"};
*/        $scope.back2personal = function(){
 //       	console.log("absiudcheuairfhbiuaer");
            $state.go("tab.account",{}, {reload: true});
        };

    })


    .controller('AnnounceCtrl',function($scope, $state,bulletinsService){
     
        $scope.bulletins = JSON.parse(bulletinsService.getBulletins());
//        $scope.bulletins = [
//        {name:'argscheck',
//        time:'123',
//        content:'123123'},
//       {name:'argscheck',
//        time:'123',
//        content:'123123'}
//        ] 
        $scope.back2personal = function(){
            $state.go("tab.account");
        };
    });
