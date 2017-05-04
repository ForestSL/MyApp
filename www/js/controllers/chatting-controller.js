
angular.module('chatting-controller',[])

	.controller('ChatCtrl',['$scope', '$state', function($scope, $state) {

        //执行用户聊天操作
        $scope.doChatting = function(){
            $state.go("chatting-detail",{"id":1});
        };
    }]);