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
                },
                function(errorMsg) 
                {
                   alert(errorMsg);  // 输出错误信息。
                });
        });
    })


//群聊

.controller('GroupChatingCtrl', function($scope, $stateParams, MyInfo,Groups, $state) 
{

    //将输入框input.message初始化为空值
    $scope.input={'message':''};
    //初始化默认为不可输入
    $scope.sending = false;
    //获取是本人信息
    $scope.user = JSON.parse(MyInfo.getLocalInfor());
    console.log($scope.user);
    //取得所在所在部门
    var myDepart = $scope.user.DepartName;
    console.log(myDepart);
    //获取所有部门的人的信息
    $scope.friendList=$stateParams.Depart_list;
    console.log($scope.friendList);
    //存储部门群聊的groupId
    $scope.groupId = 0;
    //判断有没有部门群
    window.JMessage.getGroupIDList(function (list) 
    {
        // Success callback.
        $scope.groupList =JSON.parse(list);
        console.log($scope.groupList);
        for(var  i=0; i< $scope.groupList.length;i++)
        {
            console.log("执行了判断");
            window.JMessage.getGroupInfo($scope.groupList[i], function (data) 
            {
                var groupInfor = JSON.parse(data);
                    //if(groupInfor.groupName)
                console.log(groupInfor);

                if(groupInfor.groupName== $scope.user.DepartName)
                {
                    //如果已经有部门群，则将$scope.groupId设置为非0
                $scope.groupId =groupInfor.groupId;
                }   
            }, 
            function (errorMsg) 
            {
            });
        }      
    }, 
    function (errorMsg) 
    {      // Error callback.
        console.log(errMsg);
    });
    //如果没有所在群，是部长，则新建一个群，供给部门聊天
    if($scope.user.isLeader!=0 && $scope.groupId == 0)
    {
        console.log("开始建群");
        window.JMessage.createGroup($scope.user.DepartName, 'For Chatting', function (groupId) 
        {
            $scope.usernameStr = "";
            console.log(groupId);
            $scope.groupId = groupId;
            var  count = 0;
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

            window.JMessage.addGroupMembers(groupId, $scope.usernameStr, function (res) 
                    {
                        console.log(res);
                    }, 
                    function (errorMsg) 
                    {
                        console.log(errorMsg);
                    });
        
            window.JMessage.getGroupInfo(groupId, function (data) 
            {
                var groupInfor = JSON.parse(data);
                console.log(groupInfor);
            }, 
            function (errorMsg) 
            {
            });
        }, 
       function (errorMsg) 
       {  
       });
    }
    //如果没有所在群，是部员，则提醒本群已经被解散
    else if($scope.user.isLeader==0 && $scope.groupId == 0)
    {
        alert("本群聊已经被部长解散");
    }

    $scope.$on('$ionicView.enter', function(e)
    {
        /* $scope.sendMessage = function()
         {
            window.JMessage.sendGroupTextMessage($scope.groupId, 'content',function(response) 
            {
            var message = JSON.parse(response);
            }, 
            function(errorMsg) 
            {
                console.log(errorMsg);  // 输出错误信息。
            });
         }*/
       
    });

       
})