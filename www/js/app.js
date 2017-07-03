// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //启动极光推送服务
    //调试模式
    window.plugins.jPushPlugin.init();
    window.plugins.jPushPlugin.setDebugMode(true);
    document.addEventListener('jmessage.onReceiveMessage', function(msg) {
      //alert('新消息');
      //appendReceMsg(msg.fromUser.nickname,msg.content.text);
    }, false);
  });
})
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
   


  //使用$ionicConfigProvider服务解决ionic项目生成的导航栏在手机顶部的问题
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

/*
     
      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('center');
*/
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
        $stateProvider
  // setup an abstract state for the tabs directive
//登陆界面路由
        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        })
        //tab路由
        .state('tab', {
          url: '',
          abstract: true,
          templateUrl: 'templates/tabs.html'
        })
        //会话列表
        .state('tab.chats', {
          url: '/chats',
          views: {
              'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
              }
          }
        })
        .state('tab.chats-add', {
          url: '/chats-add',
          views: {
            'tab-chats': {
              templateUrl: 'templates/chats-add.html',
              controller: 'ChatsAddCtrl'
            }
        }
        })
        .state('tab.chat-detail', {
          url: '/chat-detail',
          params: {"chatId": null},
          views: {
            'tab-chats': {
              templateUrl: 'templates/chat-detail.html',
              controller: 'ChatDetailCtrl'
            }
          }
        })
  
        //好友列表
        .state('tab.friends', {
          url: '/friends',
          cache:'false',
          views: {
            'tab-friends': {
              templateUrl: 'templates/tab-friends.html',
              controller: 'FriendsCtrl'
            }
          }
        })

        .state('tab.friends-detail', {
          url: '/friends-detail',
          params: {"friendId": null},
          views: {
            'tab-friends': {
              templateUrl: 'templates/friends-detail.html',
              controller: 'FriendsDetailCtrl'
            }
          }
        })
        //群组列表
        .state('tab.groups', {
          url: '/groups',
          views: {
            'tab-groups': {
              templateUrl: 'templates/tab-groups.html',
              controller: 'GroupsCtrl'
            }
          }
        })
        .state('tab.group-detail', {
          url: '/group-detail',
          params: {"groupId": null},
          views: {
            'tab-groups': {
              templateUrl: 'templates/group-detail.html',
              controller: 'GroupDetailCtrl'
            }
          }
        })
        .state('tab.group-add', {
          url: '/group-add',
          views: {
            'tab-groups': {
              templateUrl: 'templates/group-add.html',
              controller: 'GroupAddCtrl'
            }
          }
        })

        //个人信息部分
        .state('tab.account', {
          url: '/account',
          cache:'false', 
          views: {
            'tab-account': {
              templateUrl: 'templates/tab-personal.html',
              controller: 'AccountCtrl'
            }
          }
        })
        //个人详细信息
        .state('information',{
          url:'/information',
          cache:'false', 
          templateUrl:'templates/personal-infor.html',
          controller:'PersonalInforCtrl'
        })
        //公告
        .state('announce',{
          url:'/announce',
          templateUrl:'templates/announce.html',
          controller:'AnnounceCtrl'
        })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
