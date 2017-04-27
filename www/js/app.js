angular.module('lqApp', ['ionic', 'lqApp.controllers', 'lqApp.services','lqApp.directives'])

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
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        //使用$ionicConfigProvider服务解决ionic项目生成的导航栏在手机顶部的问题
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        // 使用$stateProvider中的state()方法来进行路由的配置，这是ionic种的路由实现机制
        // 此处，没有使用AngularJS中的路由机制

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('login');

        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract:true,
                templateUrl: 'templates/tabs.html'
            })

            //登录
            .state('login',{
                url:'/login',
                templateUrl:'templates/login.html',
            })

            //聊天模块
            .state('tab.chatting',{
                url:'/chatting',
                views:{
                    'tab-chatting':{
                        templateUrl:'templates/tab-chatting.html',
                    }
                }

            })

            //聊天-详情模块
            .state('tab.main-detail',{
                url:'/chatting/:id',
                views:{
                    'chatting-detail':{
                        templateUrl:'templates/chatting-detail.html',
                    }
                }

            })





            //通讯录模块
            .state('tab.list',{
                url:'/list',
                views:{
                    'tab-list':{
                        templateUrl:'templates/tab-list.html',
                    }
                }

            })


            //任务模块
            .state('tab.task',{
                url:'/task',
                views:{
                    'tab-task':{
                        templateUrl:'templates/tab-task.html',
                    }
                }

            })


            //我模块
            .state('tab.personal',{
                url:'/personal',
                views:{
                    'tab-personal':{
                        templateUrl:'templates/tab-personal.html',
                        controller: 'PersonalCtrl'
                    }
                }

            })
    });