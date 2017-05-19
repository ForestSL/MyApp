
angular.module('list-controller',[])
	.controller('ListCtrl',['$scope', '$state', function($scope, $state) {

		$scope.tasks = [
    	{ title: '董事会' },
    	{ title: '人事部' },
    	{ title: '技术部' },
    	{ title: '秘书部' },
    	{ title: '财务部' },
  		];


		$scope.onSwipeLeft = function() {
        	$state.go("tab.task");
    	};

//滑动跳转
        $scope.onSwipeRight = function() {
            $state.go("tab.chatting");
        };

		}]);