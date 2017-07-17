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

        // $data.getAnnocement("bulletin", MyInfo.getLocalInfor()).success(function(data){
        //         if(data == "err in post /bulletin"){
        //             $scope.showErrorMesPopup("error in bulletin");
        //         }else{

        //              var mybulletins = JSON.stringify(data);
        //              console.log(mybulletins);
        //              bulletinsService.initBulletins(mybulletins);
        //              console.log(bulletinsService.getBulletins());
        //              //sessionStorage.setItem("bulletins",bulletins);
        //         }
        //   });

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

            $state.go("bulletin");
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


    .controller('BulletinCtrl',function($scope, $state, bulletinsService, MyInfo){
        //-------------------------------界面上tab界面切换---------------------------------
        $scope.tabIndex = '未读';

        $scope.isOne = false;
        $scope.isTwo = false;

        $scope.showTab = function(tabIndex){
            if(tabIndex=='未读'){
                $scope.isOne = true;
                $scope.isTwo = false;
            }else{
                $scope.isHaveMoreData = true;
                $scope.isOne = false;
                $scope.isTwo = true;
            }
            $scope.tabIndex = tabIndex;
        };

        $scope.showTab($scope.tabIndex);

     
        var user = JSON.parse(MyInfo.getLocalInfor());
        console.log(user);
        var a = {departName:""};//因后端变量名称采用一个中间变量存数据
        a.departName = user.DepartName;
        console.log(a);
        bulletinsService.getReadBulletin("bulletin",a).success(function(data){
            if(data == "err in post /bulletin"){
                console.log(250);
            //        $scope.showErrorMesPopup("error in bulletin");
            }
            else{
                var temp = JSON.stringify(data);
                $scope.bulletins = JSON.parse(temp);
                console.log($scope.bulletins);
                     //sessionStorage.setItem("bulletins",bulletins);
            }
        });
        bulletinsService.getunReadBulletin("bulletin",a).success(function(data){
            if(data == "err in post /bulletin"){
                console.log(250);
            //        $scope.showErrorMesPopup("error in bulletin");
            }
            else{
                var temp = JSON.stringify(data);
                $scope.un_bulletins = JSON.parse(temp);
                console.log($scope.un_bulletins);
                     //sessionStorage.setItem("bulletins",bulletins);
            }
        });
//        $scope.bulletins = [
//        {name:'argscheck',
//        time:'123',
//        content:'123123'},
//       {name:'argscheck',
//        time:'123',
//        content:'123123'}
//        ] 
        $scope.doRefresh = function() {

            bulletinsService.getReadBulletin("bulletin",a).success(function(data){
                if(data == "err in post /bulletin"){
                    console.log(250);
            //        $scope.showErrorMesPopup("error in bulletin");
                }
                else{
                    var temp = JSON.stringify(data);
                    $scope.bulletins = JSON.parse(temp);
                    console.log($scope.bulletins);
                         //sessionStorage.setItem("bulletins",bulletins);
                }
            });
            bulletinsService.getunReadBulletin("bulletin",a).success(function(data){
                if(data == "err in post /bulletin"){
                    console.log(250);
                //        $scope.showErrorMesPopup("error in bulletin");
                }
                else{
                    var temp = JSON.stringify(data);
                    $scope.un_bulletins = JSON.parse(temp);
                    console.log($scope.un_bulletins);
                         //sessionStorage.setItem("bulletins",bulletins);
                }
            });
            // $scope.bulletins = {};
            // $scope.$apply(function (){
            //     $scope.bulletins = JSON.parse(bulletinsService.getAnnocement());
            //     console.log($scope.bulletins);
            // });
            // console.log($scope.bulletins);
            $scope.$broadcast('scroll.refreshComplete');
        };        
        $scope.back2personal = function(){
            $state.go("tab.account");
        };
    })

    .controller('BulletinDetailCtrl',function($scope, $state, $stateParams, $sce){
        $scope.bulletin = $stateParams.blt_detail;
        console.log($scope.bulletin);
        $scope.bulletin_content = $sce.trustAsHtml($scope.bulletin.html);

        $scope.back2bulletin = function(){
            $state.go("bulletin");
        };
    })

    .controller('ModifyCtrl',function($scope, $state,MyInfo,Passsword){
        $scope.back2personal = function(){
            $state.go("tab.account");
        };
        var user = JSON.parse(MyInfo.getLocalInfor());

        $scope.input ={
            oldPassword:"",
            newPassword:"",
            conformPassword:""
        };

        $scope.doModify= function()
        {
            newPassword = $scope.input.newPassword;
            conformPassword = $scope.input.conformPassword;
            oldPassword =$scope.input.oldPassword;
            console.log(newPassword );
            console.log(conformPassword);
           
            if(newPassword===conformPassword )
            {
                var  userInfor =
                {
                    userID:"",
                    userPhone:"",
                    newPwd:"",
                    oldPwd:""
                }

                console.log(user);
                userInfor.userID = user.userID;
                userInfor.userPhone = user.userPhone;
                userInfor.newPwd = newPassword;
                userInfor.oldPwd = oldPassword;

                console.log(userInfor);

                Passsword.modifyPassword(userInfor).success(function(data)
                {
                    if(data == "success")
                        alert("修改密码成功");
                },
                function(errorMsg)
                {
                    console.log("修改密码错误");
                });
            }
            else
            {
                alert("两次输入新密码不一致!");
            }
        };
});

