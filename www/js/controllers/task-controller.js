
angular.module('task-controller',[])
	.controller('TaskCtrl',['$scope', '$state', function($scope, $state) {

		$scope.onSwipeLeft = function() {
        	$state.go("tab.personal");
    	};
    	$scope.onSwipeRight = function() {
        	$state.go("tab.list");
    	};

		}]);