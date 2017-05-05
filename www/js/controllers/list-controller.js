
angular.module('list-controller',[])
	.controller('ListCtrl',['$scope', '$state', function($scope, $state) {


		$scope.onSwipeLeft = function() {
        	$state.go("tab.task");
    	};

//滑动跳转
        $scope.onSwipeRight = function() {
            $state.go("tab.chatting");
        };

		}]);