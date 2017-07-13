angular.module('list-controller',[])
    .controller('FriendsCtrl', function($scope, Friends, Colleagues, $ionicScrollDelegate, MyInfo, $state) {
/*        $scope.$on('$ionicView.enter', function(e) {
            //获取当前用户所有会话框列表
            Friends.getAll(
            ).then(function(data) {
                $scope.friends = data;
            });
        });*/
        $scope.dd="age";
        $scope.cc="name";
        $scope.data = [{
        name: 'name 1',
        gender: 'male',
        age: 26,
        score: 70
    }, {
        name: 'name 2',
        gender: 'female',
        age: 24,
        score: 84
    }, {
        name: 'name 3',
        gender: 'male',
        age: 20,
        score: 76
    }, {
        name: 'name 4',
        gender: 'female',
        age: 22,
        score: 64
    }];

        $scope.information = JSON.parse(MyInfo.getLocalInfor());
        console.log($scope.information);
        $scope.lists = Colleagues.getAll();
        $scope.depart="userDepart";
        console.log($scope.lists);

        var list = $scope.lists;

        //将相关人员加到相对应的部门下面
        var tmplist={};
        for (var i = 0; i < list.length-1; i++){
                for (var j = i; j < list.length; j++){
                    if (list[i].userDepart > list[j].userDepart){
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                }
            }
        }
        console.log(list);
        for(i=0;i<list.length;i++){
            var dpt=list[i].DepartName;
            if( tmplist[dpt] ==undefined){
                tmplist[dpt]=[]
            }
            tmplist[dpt].push(list[i] );
        }
        $scope.sorted_lists = tmplist;

        $scope.go2gpchat = function(){
            console.log("nimab");
            $state.go("group-chatting");
            console.log("跳转成功");
        };


    })
    .controller('FriendsAddCtrl', function($scope) {
        $scope.input={'friendName':''};
        $scope.sendAddFriendRequest = function() {
            //$state.go("tab.friends",{},{reload:true});
            window.JMessage.sendInvitationRequest($scope.input.friendName, "","",
                function(response){
                    alert('请求发送成功');
                    //$state.go("chats",{},{reload:true});
                    //window.JMessage.username = username;
                }, function(errorStr){
                    alert(errorStr);
                });
        };
    })
    /*
    .controller('FriendsDetailCtrl', function($scope, $stateParams, Friends) {
        alert($stateParams.friendId);

        $scope.friend = Friends.get($stateParams.friendId);
        $scope.enterSingleChats = function() {
            usernameForConversation = username;
            $state.go("chat-detail",{},{reload:true});
        };
        $scope.sendSingleMessage = function() {
            function sendMessage() {
                var messageContentString = $("#messageContent").val();
                window.JMessage.sendSingleTextMessage(
                    usernameForConversation, messageContentString, null,
                    function (response) {
                        var msg = JSON.parse(response);
                        messageArray.unshift(msg);
                        refreshConversation();
                    }, function (response) {
                        console.log("send message fail" + response);
                        alert("send message fail" + response);
                    });
            }
        };
    });*/