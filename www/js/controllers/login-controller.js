angular.module('login-controller',[])
	.controller('LoginCtrl', function($scope,$state,MyInfo,$data,$timeout,$ionicPopup) {
        
        $scope.input={
            account:"",
            password:""
        };
       
       
        var formUser={
            userPhone:"",
            userPwd:""
        }
        $scope.login = function() {
           // $state.go("tab.chats",{},{reload:true});
           formUser.userPhone = $scope.input.account;
           formUser.userPwd = $scope.input.password;
           console.log(formUser);

            $data.login("user", formUser).success(function(data){
                if(data == "fail"){
                    $scope.showErrorMesPopup("手机号或密码错误");
                }
                else if(data == "forbidden")
                {
                  alert("该用户被管理员禁用");
                }
                else
                {
                   $scope.showSuccessMesPopup("正在登录请稍后");
                   var user = JSON.stringify(data);
                   
                   MyInfo.initlocalInfor(user);
//                   Colleagues.initColleagues();

                   //console.log("local information");
                  // console.log(MyInfo.getLocalInfor());


                  // sessionStorage.setItem("user",user);
                   //登陆极光的服务器
                  // console.log(user);
                   window.JMessage.login($scope.input.account, $scope.input.password,function (response) {
                     window.JMessage.getMyInfo(
                         function(response) {
                             var myInfo = JSON.parse(response);
                             console.log(myInfo);
                             MyInfo.init(myInfo);
                            // $scope.myInfo = MyInfo.all();
                            // console.log($scope.myInfo);
                             //alert($scope.myInfo);
                         }, function(errorStr) {
                             console.log(errorStr);  // 输出错误信息。
                         });
                    //alert(response);
                     $state.go("tab.chats",{},{reload:true});
                 }, function(errorStr){
                     alert(errorStr);
                 });

                }
            });
           
        };

         $scope.showErrorMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
            }, 1000);
        };

        $scope.showSuccessMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>',
                template: '<p style="text-align: center"><ion-spinner icon="android" class="spinner-positive"></ion-spinner></p>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
 //               $state.go("tab.chats");
            }, 500);
        };
    });