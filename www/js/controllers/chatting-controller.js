
angular.module('chatting-controller',[])
   .controller('ChatsCtrl', function($scope, Chats) {
        //alert(Chats.all());
        $scope.$on('$ionicView.enter', function(e) {
            Chats.getAll(
            ).then(function(data) {
                $scope.chats = data;
            });
        });
        // document.addEventListener('jmessage.onReceiveMessage', function(msg) {
        //     Chats.getAll(
        //     ).then(function(data) {
        //         $scope.chats = data;
        //     });
        // }, false);
        // //离开当前会话移除监听和会话
        // $scope.$on('$ionicView.beforeLeave', function(e) {
        //     document.removeEventListener('jmessage.onReceiveMessage', function(){
        //     },false);
        // });


        //$scope.chats = Chats.all();
        $scope.remove = function(chat) {
            //alert(chat.targetId);
            window.JMessage.deleteSingleConversation(chat.targetId, null,
                function(response){
                    //(response);
                    Chats.remove(chat);// 删除成功
                }, function(errorMsg) {
                    console.log(errorMsg);
                });

        };
    })
   
    .controller('ChatDetailCtrl', function($scope, $rootScope, $stateParams, Chats, MyInfo, Messages) {
       // alert($stateParams.chatId);
       $scope.chat = Chats.get($stateParams.chatId);
       $scope.user = MyInfo.all().userName;
       $scope.toUser = $stateParams.chatId;
        var conrentMessage = {
            content:{
                text: ''
            },
            contentType: 'text',
            fromID:''
        };
        $scope.sending = false;
        // var dialog = document.getElementById('dialog');
        $scope.input={'message':''};
        $scope.$on('$ionicView.enter', function(e) {
            window.JMessage.enterSingleConversation($scope.toUser, null,
                function(response) {
                    Messages.getAll('single',$scope.toUser,0,10).then(function(data) {
                        $scope.messages= data;
                    });
                    $scope.sendMessage = function (){
                        conrentMessage.content.text = $scope.input.message;
                        conrentMessage.fromID = $scope.user;
                        $scope.sending = true;
                        window.JMessage.sendSingleTextMessage($scope.toUser, $scope.input.message, null,
                            function(response) {
                                $scope.$apply(function () {
                                    $scope.messages.push(conrentMessage);
                                });
                                keepKeyboardOpen();
                                viewScroll.scrollBottom(true);
                                // $scope.messages.push(conrentMessage);
                                // $scope.$apply($scope.messages);
                                $scope.input.message.val('');
                                $scope.sending = false;
                                //appendSendMsg(MyInfo.all().nickname, $scope.input.message)
                            }, function(errorMsg) {
                                alert(errorMsg);   // 输出错误信息。
                            });
                    };
                    //当前会话框事件监听
                    document.addEventListener('jmessage.onReceiveMessage', function(msg) {
                        // alert(msg.fromUser);
                        conrentMessage.content.text = msg.content.text;
                        conrentMessage.fromID = msg.fromUser.username;
                        // $scope.$apply($scope.messages.push(conrentMessage));
                        // conrentMessage.content.text = msg.content.text;
                        // conrentMessage.fromID = msg.fromUser.username;
                        // Messages.message.push(conrentMessage);
                        // alert(Messages.message);
                        // $scope.messages = Messages.getLocalMessage();
                        $scope.$apply(function () {
                            $scope.messages.push(conrentMessage);
                        });
                        // viewScroll.scrollBottom(true);
                        //appendReceMsg(msg.fromUser.nickname,msg.content.text);
                    }, false);

                    //离开当前会话移除监听和会话
                    $scope.$on('$ionicView.beforeLeave', function(e) {
                        document.removeEventListener('jmessage.onReceiveMessage', function(){
                        },false);
                        window.JMessage.exitConversation(
                            function(response){
                            }, function(errorMsg) {
                                alert(errorMsg);
                            }
                        );
                    });
                    function keepKeyboardOpen() {
                        console.log('keepKeyboardOpen');
                        txtInput.one('blur', function() {
                            console.log('textarea blur, focus back on it');
                            txtInput[0].focus();
                        });
                    }
                }, function(errorMsg) {
                   alert(errorMsg);  // 输出错误信息。
                 });
        });
    })


//群聊

    .controller('GroupsCtrl', function($scope,Groups) {
        $scope.$on('$ionicView.enter', function(e) {
            //获取当前用户组列表
            Groups.getAll(
            ).then(function(data) {
                $scope.groups = data;
            });
        });
    })
    .controller('GroupDetailCtrl', function($scope, $stateParams, Groups) {
        $scope.$on('$ionicView.enter', function(e) {
            //获取当前用户组列表
            alert(groupId);
            Groups.getDetail(stateParams.groupId).then(function(data) {
                $scope.group = data;
            });
        });
    })
    .controller('GroupAddCtrl', function($scope) {
        $scope.sendAddGroupRequest = function (){

        }
    });