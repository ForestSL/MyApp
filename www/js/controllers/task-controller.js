
angular.module('task-controller',[])
	.controller('TaskCtrl',['$scope', '$state', function($scope, $state) {

        $scope.tasks_state=[
        {title:'任务1',
        tstate:'未处理',
        time:'1234-12-45'},
        {title:'任务2',
        tstate:'已批准',
        time:'1234-12-45'},
        {title:'任务3',
        tstate:'未批准',
        time:'1234-12-45'}
        ];

        $scope.tasks2deal=[
        {title:'任务1',
        time:'1234-12-45',
        aplyr:'a'},
        {title:'任务2',
        time:'1234-12-45',
        aplyr:'b'},
        {title:'任务3',
        time:'1234-12-45',
        aplyr:'c'},
        ];

		$scope.onSwipeLeft = function() {
        	$state.go("tab.personal");
    	};
    	$scope.onSwipeRight = function() {
        	$state.go("tab.list");
    	};

        $scope.task_apl = function(){
            $state.go("taskApl");
        }


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

		}])
    .controller('TaskAplCtrl',['$scope', '$state', function($scope, $state) {

        $scope.back2task = function(){
            $state.go("tab.task");
        };

        }]);