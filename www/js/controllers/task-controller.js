
angular.module('task-controller',[])
	.controller('TaskCtrl',['$scope', '$ionicPopup','$state','Task', 'MyInfo', function($scope, $ionicPopup, $state, Task, MyInfo) {
        //获取数据库数据
        $scope.abc=[
        {title:'任务1',
        tstate:'未处理',
        time:'1234-12-45',
        content:'老婆生孩子，请假3年'},
        {title:'任务2',
        tstate:'已批准',
        time:'1234-12-45',
        content:'老婆生孩子，请假3年'},
        {title:'任务3',
        tstate:'未批准',
        time:'1234-12-45',
        content:'老婆生孩子，请假3年'}
        ];

        $scope.bcd=[
        {title:'任务1',
        time:'1234-12-45',
        aplyr:'阿大',
        content:'老婆生孩子，请假3年'},
        {title:'任务2',
        time:'1234-12-45',
        aplyr:'阿二',
        content:'老婆生孩子，请假3年'},
        {title:'任务3',
        time:'1234-12-45',
        aplyr:'阿三',
        content:'老婆生孩子，请假3年'},
        ];


//        var user = JSON.parse(sessionStorage.getItem("user"));
//        console.log($scope.user);
//        console.log($scope.user.userID);
		var user = JSON.parse(MyInfo.getLocalInfor());
        Task.getTaskList("task",user).success(function(data){//获取任务状态列表
            if(data == "err in get /task"){
                $scope.showErrorMesPopup("error in vacation");
                console.log("ahsud");
            }
            else{
                var temp = JSON.stringify(data);
                $scope.tasks_state = JSON.parse(temp);
                console.log(temp);
                console.log($scope.tasks_state);
            }
        });
        Task.getTask2Deal("task",$scope.user).success(function(data){//获取待处理任务列表
            if(data == "fail"){
                $scope.showErrorMesPopup("error in vacation");
                console.log("ahsud");
            }
            else{
                var temp = JSON.stringify(data);
                $scope.tasks2deal = JSON.parse(temp);
                console.log(temp);
                console.log($scope.tasks2deal);
            }
        });


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

        // 显示任务申请具体信息
        $scope.task_state=[];
/*        $scope.ShowDetail = function(task_state) {
            $ionicPopup.show({
                title: task_state.title,
                subTitle: task_state.time,
                content: task_state.content,
                scope: $scope,
                buttons: [                    
                    {
                        text: '返回',                        
                        onTap: function(e) {                      
                                      
                        }
                    },
                ]
            })
        };
*/

        //任务处理
        $scope.task2deal=[];
/*        $scope.DealTask = function(task2deal){
            $ionicPopup.show({
                title: task2deal.title,
                subTitle: task2deal.time,
                content: task2deal.content + '</br>----' + task2deal.aplyr,
                scope: $scope,
                buttons: [
                    {   text: '驳回' ,   
                        type: 'button-small',                     
                        onTap: function(e) {                      
                        //do bo hui                
                        }
                    },
                    {
                        text: '批准',
                        type: 'button-positive button-small',
                        onTap: function(e) {
                        //do acception
                        }
                    },
                ]
            })
        };
*/
		}])
    .controller('TaskAplCtrl',['$scope', '$state', 'Task', '$ionicPopup', '$timeout', 'MyInfo',function($scope, $state, Task, $ionicPopup, $timeout, MyInfo) {
        $scope.task = {userID:"",
                        userName:"",
                        numOfDays: "",
                        starTime: "", 
                        motivation: ""};
        $scope.master = {userID:"",
                        userName:"",
                        numOfDays: "",
                        starTime: "", 
                        motivation: ""};

        $scope.temp ={userID:"9",
                    userName:"申一",
                    numOfDays:"6",
                    starTime:"123141324",
                    motivation:"aiiiiiiiiiiiifhrbawuiergab ewdurq"};

//        var user = JSON.parse(sessionStorage.getItem("user"));
  		 var user = JSON.parse(MyInfo.getLocalInfor());          
          


        $scope.submit = function(){
            $scope.task.userID = user.userID;
            $scope.task.userName = user.userName; 
            console.log($scope.task);
            Task.LeaveApl("task",  $scope.task).success(function(data){
                if(data == "fail"){
                    $scope.showErrorMesPopup("申请发送失败");
                    console.log("22222");
                }else{
                    $scope.showSuccessMesPopup("成功发送申请");
                    $state.go("tab.task");
                    console.log($scope.task);
                }
          });

            $scope.task.apldate = new Date();
            console.log($scope.task);
        };

        $scope.showErrorMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
            }, 1000);
        };

        $scope.showSuccessMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>',
                template: '<p style="text-align: center"><ion-spinner icon="android" class="spinner-positive"></ion-spinner></p>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
                $state.go("tab.chatting");
            }, 500);
        };


        $scope.reset = function() {
            $scope.task = angular.copy($scope.master);
            console.log($scope.task);
        };
        $scope.reset();

        $scope.back2task = function(){
            $state.go("tab.task");
        };

        }])

    .controller('TaskDetailCtrl',['$scope', '$state', '$stateParams', 'Task', function($scope, $state, $stateParams, Task) {

        $scope.dtltask = $stateParams.dtltask;
        console.log($stateParams.dtltask);
        console.log($scope.dtltask);

        Task.getTaskDetail("task",$scope.dtltask).success(function(data){
            if(data == "fail"){
                console.log("250");
            }
            else{
                var temp = JSON.stringify(data);
                console.log(temp);
                $scope.task_detail = JSON.parse(temp);
                console.log($scope.task_detail);
                console.log($scope.task_detail.createTime);
                console.log($scope.task_detail.createTime[1]);
                var string = $scope.task_detail.createTime;
                console.log(string);
                var string1 = string.substring(0, string.length-19);
                var string2 = string.substring(11, string.length-10);
                string = "";
                string = string1 + ' ' + string2;
                console.log(string1);
                console.log(string2);
                console.log(string);
                $scope.task_detail.createTime = string;
//                $scope.task_detail.createTime[10] = ' ';
//                for(var i = 19; i < 29; i++){
//                    $scope.task_detail.createTime[i] = '';
//                }
                console.log($scope.task_detail.createTime);
            }
        });

//        var temp = $scope.task_detail.createTime;
//        console.log(temp[1]);
        
        $scope.back2task = function(){
            $state.go("tab.task");
        };
        }])


    .controller('Task2DealDetailCtrl',['$scope', '$state', '$stateParams', 'Task', function($scope, $state, $stateParams, Task) {

        $scope.dtltask2deal = $stateParams.dtltask2deal;
        console.log($stateParams.dtltask2deal);
        console.log($scope.dtltask2deal);

        Task.getTask2DeaDetail("task",$scope.dtltask2deal).success(function(data){
            if(data == "fail"){
                console.log("250");
            }
            else{
                var temp = JSON.stringify(data);
                console.log(temp);
                $scope.task2deal_detail = JSON.parse(temp);
                console.log($scope.task2deal_detail);
            }
        });

        
        $scope.back2task = function(){
            $state.go("tab.task");
        };

        $scope.refuse = function(){

        };

        $scope.approve = function(){

        };

        }]);
/*
    $data.getAnnocement("bulletin",  $scope.user).success(function(data){
                if(data == "err in post /bulletin"){
                    $scope.showErrorMesPopup("error in bulletin");
                    console.log(2);
                }else{
                     var bulletins = JSON.stringify(data);
                     console.log(bulletins);
                     sessionStorage.setItem("bulletins",bulletins);
                }
          });*/