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
        $scope.doRefresh = function() 
        {
            Chats.getAll().then(function(data) 
            {
                $scope.chats = data;
                console.log("Output chat list nest step");
                console.log($scope.chats);

            });
            $scope.$broadcast('scroll.refreshComplete');
        }; 

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

.controller('ChatDetailCtrl', function($ionicNavBarDelegate, $scope, $rootScope, $stateParams, $cordovaCamera,$ionicActionSheet,Chats, MyInfo, Messages) 
    {  
       // alert($stateParams.chatId);
       $scope.chat = Chats.get($stateParams.chatId);
       //获取是本人名字
       $scope.user = MyInfo.all().userName;
       //存储的是对话框id
       $scope.toUser = $stateParams.chatId;
    
        $scope.sending = false;
        //将input.message初始化为空值
        $scope.input={'message':''};

        //发送文本信息
        $scope.sendMessage = function ()
        {
          
            $scope.sending = true;
            window.JMessage.sendSingleTextMessage($scope.toUser, $scope.input.message, null,
            function(response) 
            {
                $scope.$apply(function () 
                {
                    Messages.getAll('single',$scope.toUser,0,20).then(function(data) 
                    {
                        $scope.messages= data;
                    });
                });
                              
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
                                console.log(err);
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
                                quality: 100,
                                allowEdit: true,
                                targetWidth: 200,
                                targetHeight: 200
                            };
                            $cordovaCamera.getPicture(options).then(function (imageURI) 
                            {
                                //准备开始发送图片
                                window.JMessage.sendSingleImageMessage($scope.toUser,imageURI,'',function(response) 
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
                                    // 输出错误信息。
                                alert(errorMsg);  
                                });
                            }, 
                            function (err) 
                            {
                                // error
                                console.log(err);
                            });
                        }, false);
                    }
                    return true;
                }
            });
        };

        $scope.$on('$ionicView.enter', function(e) 
        {
            window.JMessage.enterSingleConversation($scope.toUser, null,
                function(response) 
                {
                    //加载历史信息
                    Messages.getAll('single',$scope.toUser,0,20).then(function(data) 
                    {
                        $scope.messages= data;
                        console.log($scope.messages);
                    });          
                    //当前会话框事件监听
                    document.addEventListener('jmessage.onReceiveMessage', function(msg) 
                    {
                      
                        $scope.$apply(function () 
                        {
                            Messages.getAll('single',$scope.toUser,0,20).then(function(data) 
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
                },
                function(errorMsg) 
                {
                   alert(errorMsg);  // 输出错误信息。
                });
        });
    })


//群聊

.controller('GroupChatingCtrl', function($scope, $rootScope, $stateParams, $cordovaCamera,$ionicActionSheet,Chats, MyInfo, Messages,Group) 
{
    //将输入框input.message初始化为空值
    $scope.input={'message':''};
    //初始化默认为不可输入
    $scope.sending = false;
    //获取是本人信息
    $scope.user = JSON.parse(MyInfo.getLocalInfor());
    console.log($scope.user);
    //标示本人id
    $scope.userName = $scope.user.userPhone;
    console.log($scope.userName);

  
    //取得所在所在部门
    var myDepart = $scope.user.DepartName;
    console.log(myDepart);
    //获取所有部门的人的信息
    $scope.friendList=$stateParams.Depart_list;
    console.log($scope.friendList);
    //存储部门群聊的groupId,并默认为0
    $scope.groupId = 0;

    //发送文本文件
    //发送文本信息
    $scope.sendMessage = function ()
    {
        console.log("进入 sendMessages");
        $scope.sending = true;
        console.log($scope.input.message);
        console.log($scope.groupId);
        window.JMessage.sendGroupTextMessage($scope.groupId, $scope.input.message,
        function(response) 
        {
            console.log("开始发送信息");
            var testMessage = JSON.parse(response);
             console.log(testMessage);
            $scope.$apply(function () 
            {
                Messages.getAll('group',$scope.groupId,0,20).then(function(data) 
                {
                    $scope.messages= data;
                });
            });                  
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
                            console.log(err);
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
                            quality: 100,
                            allowEdit: true,
                            targetWidth: 200,
                            targetHeight: 200
                        };
                        $cordovaCamera.getPicture(options).then(function (imageURI) 
                        {
                            //准备开始发送图片
                            window.JMessage.sendGroupImageMessage($scope.groupId,imageURI,function(response) 
                            {
                                var message = JSON.parse(response);
                                console.log(message);
                                console.log("发送图片成功");
                                $scope.$apply(function () 
                                {
                                    Messages.getAll('group',$scope.groupId,0,20).then(function(data)
                                    {
                                        $scope.messages= data;
                                        console.log( $scope.messages);
                                    });
                                });
                            }, 
                            function(errorMsg) 
                            {
                                    // 输出错误信息。
                                alert(errorMsg);  
                            });
                        }, 
                        function (err) 
                        {
                            // error
                            console.log(err);
                        });
                    }, false);
                }
                return true;
            }
        });
    };   
    //判断有没有部门群，如果没有就新建一个部门
    Group.getAll().then(function(group) 
    {
        // Success callback.
        $scope.groupList = group;
        console.log($scope.groupList);
        console.log("输出isleader");
        console.log($scope.user.isLeader);
        console.log("输出groupId");
        console.log($scope.groupId );  
        //如果为部长且没有部门群，则新建一个群
        if(($scope.user.isLeader!=0)&&($scope.groupList.length==0) )
        {
            //创建群 并初始化$scope.groupId为部长所拥有的群Id
            Group.createGroup($scope.user.DepartName).then(function(data)
            {   
                var temp = JSON.stringify(data);
                $scope.groupId = JSON.parse(temp);
                console.log($scope.groupId);

                var  count = 0;
                $scope.usernameStr = "";
                //将同一部门的userName组装成字符串
                for(var i=0;i<$scope.friendList[myDepart].length;i++)
                {
                    $scope.addMemberName = $scope.friendList[myDepart][i].userPhone;
                    console.log($scope.addMemberName);
                    if($scope.addMemberName ===$scope.user.userPhone)
                    {
                    }
                    else if(count == 0)
                    {
                        $scope.usernameStr = $scope.addMemberName;
                        count++;    
                    }
                    else
                    {
                        $scope.usernameStr =  $scope.usernameStr +　',' +  $scope.addMemberName;
                    }
                }
                console.log( $scope.usernameStr);
                //向群里添加部门内所有员工的userName
                Group.addMembers($scope.groupId,$scope.usernameStr).then(function(data)
                {
                    
                    window.JMessage.enterGroupConversation($scope.groupId,function() 
                    {   
                        console.log("进入群聊conversation成功");
                        Messages.getAll('group',$scope.groupId,0,10).then(function(data) 
                        {
                            console.log("Next line group messages");
                            console.log(JSON.parse(data));
                            $scope.messages= data;
                            console.log($scope.messages);
                        });
                        //对接收信息事件进行监听
                        document.addEventListener('jmessage.onReceiveMessage', function(msg) 
                        {
                            $scope.$apply(function () 
                            {
                                Messages.getAll('group',$scope.groupId,0,20).then(function(data) 
                                {
                                    $scope.messages= data;
                                });
                            });             
                        }, false);
                        //离开当前会话移除监听和会话
                        $scope.$on('$ionicView.beforeLeave', function(e) 
                        {
                            document.removeEventListener('jmessage.onReceiveMessage', function()
                            {
                            },false);

                            window.JMessage.exitConversation(function(response)
                            {
                            }, 
                            function(errorMsg) 
                            {
                                alert(errorMsg);
                            });
                        });
                    }, 
                    function(errorMsg) 
                    {
                        console.log(errorMsg)
                    });    
                });
            }, 
            function(errorMsg) 
            {
                console.log(errorMsg);
            });         

        }
        //如果为部员且没有部门，则弹窗本群已经被解散
        else if(($scope.user.isLeader==0 )&& ($scope.groupList.length==0))
        {
            //说明群刚刚被解散
            alert("本群聊已经被部长解散");
        }
        //如果已经有了相应的部门
        else
        {
            $scope.groupId = $scope.groupList[0];
            console.log($scope.groupId);
            
            window.JMessage.enterGroupConversation($scope.groupId,function() 
            {   
                console.log("进入群聊conversation成功");
                Messages.getAll('group',$scope.groupId,0,20).then(function(data) 
                {
                    console.log("Next line group messages");
                    $scope.messages= data;
                    console.log($scope.messages);
                });             
                //对接收信息事件进行监听
                document.addEventListener('jmessage.onReceiveMessage', function(msg) 
                {
                    $scope.$apply(function () 
                    {
                        Messages.getAll('group',$scope.groupId,0,20).then(function(data) 
                        {
                            $scope.messages= data;
                        });
                    });             
                }, false);
                //离开当前会话移除监听和会话
                $scope.$on('$ionicView.beforeLeave', function(e) 
                {
                    document.removeEventListener('jmessage.onReceiveMessage', function()
                    {
                    },false);
                    window.JMessage.exitConversation(function(response)
                    {
                    }, 
                    function(errorMsg) 
                    {
                        alert(errorMsg);
                    });
                });
            }, 
            function(errorMsg) 
            {
                console.log(errorMsg)
            });    
        }
    }) 
})