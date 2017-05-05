
angular.module('task-controller',[])
	.controller('TaskCtrl',['$scope', '$state', function($scope, $state) {

		$scope.onSwipeLeft = function() {
        	$state.go("tab.personal");
    	};
    	$scope.onSwipeRight = function() {
        	$state.go("tab.list");
    	};


		$scope.tabIndex = '任务申请状态';

        $scope.isOne = false;
        $scope.isTwo = false;

        $scope.showTab = function(tabIndex){
            if(tabIndex=='任务申请状态'){
                $scope.isOne = true;
                $scope.isTwo = false;
            }else{
                $scope.isHaveMoreData = true;
                $scope.isOne = false;
                $scope.isTwo = true;
            }
            $scope.tabIndex = tabIndex;
        };

        $scope.showTab($scope.tabIndex);

		}]);