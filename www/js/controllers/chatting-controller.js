angular.module('chatting-controller',[])
.controller('ChatsCtrl', function($scope, Chats) 
   {
        //alert(Chats.all());
        $scope.$on('$ionicView.enter', function(e) 
        {
            Chats.getAll().then(function(data) 
            {
                $scope.chats = data;
                console.log("Output chat list nest step");
                console.log($scope.chats);

            });
        });
        document.addEventListener('jmessage.onReceiveMessage', function(msg) 
        {
             console.log(msg);
             Chats.getAll().then(function(data) 
             {
                 $scope.chats = data;
                 console.log($scope.chats);
             });
         }, false);
      
        $scope.remove = function(chat) 
        {
            //alert(chat.targetId);
            window.JMessage.deleteSingleConversation(chat.targetId, null,
                function(response)
                {
                    //(response);
                    Chats.remove(chat);// 删除成功
                }, 
                function(errorMsg) 
                {
                    console.log(errorMsg);
                });
        };
    })  
.controller('ChatDetailCtrl', function($scope, $rootScope, $stateParams, $cordovaCamera,$ionicActionSheet,Chats, MyInfo, Messages) 
    {
       // alert($stateParams.chatId);
       $scope.chat = Chats.get($stateParams.chatId);
       //获取是本人名字
       $scope.user = MyInfo.all().userName;
       //存储的是对话框id
       $scope.toUser = $stateParams.chatId;
       //定义一个数组，存储所有的历史消息
      // $scope.messages = new Array();
        var conrentMessage = 
        {
            content:
            {
                text: '',
               // image:''
            },
            contentType: 'text',
            fromID:''
        };
        $scope.sending = false;
        //将input.message初始化为空值
        $scope.input={'message':''};
        $scope.$on('$ionicView.enter', function(e) 
        {
            window.JMessage.enterSingleConversation($scope.toUser, null,
                function(response) 
                {
                    //加载历史信息
                    Messages.getAll('single',$scope.toUser,0,10).then(function(data) 
                    {
                        $scope.messages= data;
                        console.log($scope.messages);
                    });

                    $scope.sendMessage = function ()
                    {
                        conrentMessage.content.text = $scope.input.message;
                        conrentMessage.fromID = $scope.user;
                        $scope.sending = true;
                        window.JMessage.sendSingleTextMessage($scope.toUser, $scope.input.message, null,
                            function(response) 
                            {
                                $scope.$apply(function () 
                                {
                                    Messages.getAll('single',$scope.toUser,0,10).then(function(data) 
                                    {
                                        $scope.messages= data;
                                    });
                                });
                              //  keepKeyboardOpen();
                              //  viewScroll.scrollBottom(true);
                              // $scope.messages.push(conrentMessage);
                              // $scope.$apply($scope.messages);   
                            //appendSendMsg(MyInfo.all().nickname, $scope.input.message)
                            },  
                            function(errorMsg)
                             {
                                alert(errorMsg);   // 输出错误信息。
                            }); 
                            //发送消息结束后将对话框置为空
                            $scope.input={'message':''};
                            $scope.sending = false;
                    };
                    //发送图片
                    $scope.sendPicture = function()
                    {
                        var hideSheet = $ionicActionSheet.show
                        ({
                            buttons: 
                            [
                                {text: '拍照'},
                                {text: '从手机相册选择'}
                            ],
                            cancelText: '取消',
                            cancel: function () 
                            {
                            },
                            buttonClicked: function (index) 
                            {
                                console.log(index);
                                if (index == '0') 
                                {
                                    document.addEventListener("deviceready", function ()
                                    {
                                    //拍照
                                        console.log("马上就要拍照了！");
                                        var options = 
                                        {
                                            quality: 100,
                                            destinationType: Camera.DestinationType.DATA_URL,
                                            sourceType: Camera.PictureSourceType.CAMERA,
                                            allowEdit: true,
                                            encodingType: Camera.EncodingType.JPEG,
                                            targetWidth: 100,
                                            targetHeight: 100,
                                            popoverOptions: CameraPopoverOptions,
                                            saveToPhotoAlbum: true,
                                            correctOrientation: true
                                        };
                                        $cordovaCamera.getPicture(options).then(function (imageData) 
                                        {
                                            $scope.data.imageSrc = "data:image/jpeg;base64," + imageData;
                                            console.log($scope.data.imageSrc);
                                          
                                        }, 
                                        function (err) 
                                        {
                                        // error
                                        });
                                    }, false);

                                } 
                                else if (index == '1') 
                                {
                                    document.addEventListener("deviceready", function () 
                                    {
                                        //从手机相册选择
                                        var options = 
                                        {
                                            destinationType: Camera.DestinationType.FILE_URI,
                                            sourceType: 2,     //设为0或2，调用的就是系统的图库
                                            quality: 50,
                                            allowEdit: true,
                                            targetWidth: 200,
                                            targetHeight: 200
                                        };

                                        $cordovaCamera.getPicture(options).then(function (imageURI) 
                                        {
                                            //准备开始发送图片
                                            window.JMessage.sendSingleImageMessage($scope.toUser,imageURI,null,
                                                function(response) 
                                                {
                                                    var message = JSON.parse(response);
                                                    console.log(message);
                                                    console.log("发送图片成功");
                                                    $scope.$apply(function () 
                                                    {
                                                        Messages.getAll('single',$scope.toUser,0,10).then(function(data) 
                                                        {
                                                            $scope.messages= data;
                                                            console.log( $scope.messages);
                                                        });
                                                    });
                                                }, 
                                                function(errorMsg) 
                                                {
                                                    alert(errorMsg);  // 输出错误信息。
                                                });
                                        }, 
                                        function (err) 
                                        {
                                        // error
                                        });
                                    }, false);
                                }
                                return true;
                            }
                        });
                    };

                    //当前会话框事件监听
                    document.addEventListener('jmessage.onReceiveMessage', function(msg) 
                    {
                        // alert(msg.fromUser);
                        conrentMessage.content.text = msg.content.text;
                        conrentMessage.fromID = msg.fromUser.username;
                        // $scope.$apply($scope.messages.push(conrentMessage));
                        // conrentMessage.content.text = msg.content.text;
                        // conrentMessage.fromID = msg.fromUser.username;
                        // Messages.message.push(conrentMessage);
                        // alert(Messages.message);
                        // $scope.messages = Messages.getLocalMessage();
                        $scope.$apply(function () 
                        {
                            Messages.getAll('single',$scope.toUser,0,10).then(function(data) 
                            {
                                $scope.messages= data;
                            });
                        });
                        // viewScroll.scrollBottom(true);
                        //appendReceMsg(msg.fromUser.nickname,msg.content.text);
                    }, false);

                    //离开当前会话移除监听和会话
                    $scope.$on('$ionicView.beforeLeave', function(e) 
                    {
                        document.removeEventListener('jmessage.onReceiveMessage', function()
                        {
                        },false);
                        window.JMessage.exitConversation(
                            function(response)
                            {
                            }, 
                            function(errorMsg) 
                            {
                                alert(errorMsg);
                            }
                        );
                    });
                /* function keepKeyboardOpen() 
                    {
                        console.log('keepKeyboardOpen');
                        txtInput.one('blur', function() 
                        {
                            console.log('textarea blur, focus back on it');
                            txtInput[0].focus();
                        });
                    }*/
                },
                function(errorMsg) 
                {
                   alert(errorMsg);  // 输出错误信息。
                });
        });
    })


//群聊

.controller('GroupChatingCtrl', function($scope, $stateParams, Groups, $state) {

    
})