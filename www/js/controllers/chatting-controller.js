
angular.module('chatting-controller',[])

	.controller('ChatCtrl',['$scope', '$state', function($scope, $state) {

        //执行用户聊天操作
        $scope.doChatting = function(){
            $state.go("chatting-detail",{"id":1});
        };

        $scope.onSwipeLeft = function() {
        	$state.go("tab.list");
    };
    }])
    .controller('ChatDetailCtrl',['$scope','$state',function($scope, $state){
    	//返回
    	$scope.back2chat = function(){
            $state.go("tab.chatting");
        };
    }]);
