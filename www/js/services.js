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


    .factory('Group', ['$q',function($q) {
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
                    window.JMessage.getGroupInfo(groupId,
                        function(response){
                            deferred.resolve(JSON.parse(response));
                        },function(error){
                            alert(error);
                        });
                    return deferred.promise;
                },
                createGroup: function(groupName){
                  var deferred = $q.defer();
                  window.JMessage.createGroup(groupName,"For Department Chatting!",
                    function (groupId){
                          deferred.resolve(groupId)
                  },
                  function (errorMsg) {
                    console.log(errorMsg);
                  });
                  return deferred.promise;
                },
                addMembers: function(groupId,usernameStr){
                  var deferred = $q.defer();
                  console.log(groupId);
                  console.log(usernameStr);
                  window.JMessage.addGroupMembers(groupId,usernameStr,function (){
                    return  deferred.resolve(true);
                  }, function (errorMsg) {
                 // Error callback.
                    deferred.reject(false);
                    console.log(errorMsg);
                  });
                  return deferred.promise;
                }
            }
        }])

    .factory('$data',function($http){
        return {
            login : function(tableName,requestParams){
                 var url =config.basePath+tableName;

                  return $http.post(url+"/login", {userPhone: requestParams.userPhone,userPwd:requestParams.userPwd});
            }            
        }

    })

    .factory('bulletinsService',function($http){
      
      return{
            getReadBulletin :function(tableName,requestParams){
              var url = config.basePath+tableName;
              return $http.post(url+"/search/read",requestParams);
            },
            getunReadBulletin :function(tableName,requestParams){
              var url = config.basePath+tableName;
              return $http.post(url+"/search/unread/list",requestParams);
            },
            getunReadDetail :function(tableName,requestParams){
              var url = config.basePath+tableName;
              return $http.post(url+"/search/unread/detail",requestParams);
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
          //发送请假申请
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

          //处理任务
          handleRequest:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/handlerequest",requestParams); 
          },
          //调整任务
          adjustRequest:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/adjustrequest",requestParams);
          },
          //删除任务状态列表中的已完成任务
          TaskDelete:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/vacation/delete",requestParams);
          },
          //获取其他任务name
          getOTaskName:function(tableName){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.get(url+"/deploy");
          },
          //发送其他类型任务申请
          AplOTask:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/other/request",requestParams); 
          },
          //获取待处理非请假任务列表
          getOT2Deal:function(tableName,requestParams){
            var url = config.basePath+tableName;
            console.log(url);
            return $http.post(url+"/other/handle/list",requestParams); 
          }
        }
      })

    .factory('Colleagues',function($http){
      return{
          getColleagus:function(tableName){
            var url = config.basePath+"user";
            return $http.get(url);
          }
      }
    })
    .factory('Passsword',function($http){
      return{
        modifyPassword: function(requestParams){
          var url =  config.basePath + "user/update/pwd";
          console.log(url);
           return $http.post(url, {userPhone: requestParams.userPhone,userID:requestParams.userID,
            oldPwd:requestParams.oldPwd,newPwd:requestParams.newPwd});
        }
      }
    });