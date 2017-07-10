angular.module('starter.services', [])

    .factory('Chats', ['$q',function($q) {
 /*   var chats = {[{
          id: 0,
          targetId: 'nocoolyoyo2',
          lastText: '最近怎样',
          type: "single",
          unReadMsgCnt: 0,
          lastMsgDate: 1468983461848,
          face: 'img/ben.png'
        }]};
*/
    var chats = {};
    return {
      //获取历史对话框
      getAll: function() {
        var deferred = $q.defer();
        window.JMessage.getConversationList(
            function (response) {
              if(JSON.parse(response).length != 0) {
                chats = JSON.parse(response);
              }
              deferred.resolve(chats);
            }, function (errorStr) {
              alert(errorStr);
            });
        return deferred.promise;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      },
      init: function(data) {
        chats = data;
      }
    };
  }])

    .factory('Messages', ['$q',function($q) {
/*        var messages = [{
            id: 0,
            targetId: 'nocoolyoyo2',
            lastText: '最近怎样',
            type: "single",
            unReadMsgCnt: 0,
            lastMsgDate: 1468983461848,
            face: 'img/ben.png'
        }];
  */
      var messages={};
       return {
            getAll: function(conversationType, value, from, limit) {
                var deferred = $q.defer();
                window.JMessage.getHistoryMessages(conversationType, value, '',from, limit,
                    function(response) {
                        messages = JSON.parse(response).reverse();
                       // messages = messages.reverse();
                        deferred.resolve(messages);
                    }, function(errorMsg) {
                        console.log(errorMsg);  // 输出错误信息。
                    });
                console.log(deferred.promise);
                return deferred.promise;
            },
            getLocalMessage: function(){
                return messages;
            },
            remove: function(chat) {
                chats.splice(messages.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
        };
    }])

    .factory('MyInfo', function() {
      var myInfo = {
        address: "",
        appkey: "",
        birthday: "",
        gender: "",
        nickname: "nocool",
        noteText: "",
        notename: "",
        region: "",
        signature: "",
        userName: "nocool",
        userID: 123,
        blacklist:0,
        isFriend:0,
        noDisturb:0,
        star:0,
        avatarPath:""
      };
      var localInfor={
        userName:"初始化",
        userPhone:"假的",
        userPwd:"",
        creat_at:"",
        DepartName:"",
        idLeader:0,
        userDepart:1,
        userPicture:""
      }
      return {
        all: function() {
          return myInfo;
        },
        edit: function(attr) {
          chats.splice(chats.indexOf(chat), 1);
        },
        init: function(data) {
          myInfo = data;
        },
        initlocalInfor: function(data)
        {
          localInfor=data;
        },
        getLocalInfor: function()
        {
          return localInfor;
        }
      };
    })

    .factory('Friends', ['$q',function($q) {
          var friends = [];

          return {
            getAll: function() {
              var deferred = $q.defer();
              window.JMessage.getFriendList(
                  function (response) {
                    friends = JSON.parse(response);
                    deferred.resolve(friends);
                  }, function (errorStr) {
                    alert(errorStr);
                  });
              return deferred.promise;
            },
            get: function(userId){
              for (var i = 0; i < friends.length; i++) {
                if (friends[i].userID === parseInt(userId)) {
                  return friends[i];
                }
              }
              return null;
            }
          };
        }])

    .factory('Colleagues',function($http)
    {
      var colleagues=[];
      return{
        initColleagues:function(){
            //将路由定位到后台user内
            var url =config.basePath+"user";
            $http.get(url).success(function(data){
              colleagues=data;
              
              //console.log(data);
             // console.log(colleagues);
              //console.log(colleagues[1]);
              //console.log(colleagues[2]["userName"]);

            });
        },
        getAll:function(){
          return colleagues;
        }
      }
    })
    .factory('Groups', ['$q',function($q) {
            var groups = [];
            return {
                getAll: function() {
                    var deferred = $q.defer();
                    window.JMessage.getGroupIDList(
                       function (response) {
                           groups = JSON.parse(response);
                           deferred.resolve(groups);
                        }, function (errorMsg) {
                                alert(errorMsg);
                    });
                    return deferred.promise;
                },
                getDetail: function(groupId){
                    var deferred = $q.defer();
                    alert(groupId);
                    window.JMessage.getGroupInfo(groupId,
                        function(response){
                            deferred.resolve(JSON.parse(response));
                        },function(error){
                            alert(error);
                        });
                    return deferred.promise;
                }
            };
        }])

    .factory('$data',function($http){
        return {
            login : function(tableName,requestParams){
                 var url =config.basePath+tableName;

                  return $http.post(url+"/login", {userPhone: requestParams.userPhone,userPwd:requestParams.userPwd});
            },
             getAnnocement :function(tableName,requestParams){
              var url = config.basePath+tableName;
              return $http.post(url+"/search",requestParams);
            }
        }

    })
    .factory('bulletinsService',function(){
      var bulletins;
      return{
        getBulletins:function()
        {
          return bulletins;
        },
        initBulletins:function(data)
        {
          bulletins=data;
        }
      }
    })

    .factory('Task',function($http){
        return{
          //获取任务列表
          getTaskList:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/list",requestParams);
          },
          //请假申请
          LeaveApl:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/request",requestParams); 
          },
          //查看任务详情
          getTaskDetail:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/list/detail",requestParams); 
          },
          //获取待处理任务列表
          getTask2Deal:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/handle/list",requestParams); 
          },
          //获取待处理任务详情
          getTask2DeaDetail:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/handle/detail",requestParams); 
          },

          handleRequest:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/handlerequest",requestParams); 
          }
        }
      });