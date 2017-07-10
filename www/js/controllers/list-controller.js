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

/*
    $scope.users  = [   
    {     
      "_id": "53fceb7ef214c5316e93e7c8",     
      "first_name": "Francis",     
      "last_name": "Hill"   
    },   
    {     
      "_id": "53fceb7e4a46965ec9f1d08f",     
      "first_name": "Lessie",     
      "last_name": "Caldwell"   
    },     
    {     
      "_id": "53fceb7e67e3275edd8b577d",     
      "first_name": "Whitehead",     
      "last_name": "Sosa"   
    }];
    var users = $scope.users;
    $scope.alphabet = iterateAlphabet();

  //将相关人员加到相对应的部门下面
    var tmp={};
    for(i=0;i<users.length;i++){
      var letter=users[i].first_name.toUpperCase().charAt(0);
      if( tmp[letter] ==undefined){
        tmp[letter]=[]
      }
      tmp[letter].push(users[i] );
    }
    $scope.sorted_users = tmp;




  function iterateAlphabet(){
     var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     var numbers = new Array();
     for(var i=0; i<str.length; i++)
     {
        var nextChar = str.charAt(i);
        numbers.push(nextChar);
     }
     return numbers;
  }

  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }


  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
*/



        $scope.information = JSON.parse(MyInfo.getLocalInfor());
        console.log($scope.information);
        $scope.lists = Colleagues.getAll();
        $scope.depart="userDepart";
        console.log($scope.lists);

        var list = $scope.lists;
        //返回部门对象，需要获取现有的所有部门
        /*
        var DepartList = CreateDepartList();
        function CreateDepartList(){
            var departname = new Array();
            var departid = new Array();
            for(var i=0; i<list.length; i++){
                var nextDepart = list[i].DepartName;
                departname.push(nextDepart);
                console.log(departname);
            }
            for(var i=0; i<list.length; i++){
                var nextDepartID = list[i].userDepart;
                departid.push(nextDepartID);
                console.log(departid);
            }
            console.log(departname);
            console.log(departid);
            //除去重复部门
            for(var i = 0;i < departname.length-1;i++){
                for(var j = i+1;j< departname.length;j++){
                    if(departname[i] == departname[j]){
                        departname.splice(j,1);
                        departid.splice(j,1);
                    }
                }
            }

            console.log(departname);
            console.log(departid);
            //部门排序
            for (var i = 0; i < departid.length-1; i++){
                for (var j = i; j < departid.length; j++){
                    if (departid[i] > departid[j]){
                        var temp = departid[i];
                        departid[i] = departid[j];
                        departid[j] = temp;
                        var tmp = departname[i];
                        departname[i] = departname[j];
                        departname[j] = tmp;
                    }
                }
            }
            console.log(departname);
            console.log(departid);
            return departname;
        }*/

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