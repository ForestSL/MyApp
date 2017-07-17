
angular.module('task-controller',[])
	.controller('TaskCtrl',function($scope, $ionicPopup, $state, Task, MyInfo, Colleagues) {

//-------------------------------界面上tab界面切换---------------------------------
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
    //数组合并
        $scope.abc = $scope.abc.concat($scope.bcd);
        console.log($scope.abc);

//-------------------------------从数据库获取申请任务列表和待处理任务列表---------------------------------

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
        Task.getTask2Deal("task",user).success(function(data){//获取待处理任务列表
            if(data == "fail"){
                $scope.showErrorMesPopup("error in vacation");
                console.log("请假获取失败");
            }
            else{
                var vacation_task = JSON.parse(JSON.stringify(data));
                console.log(vacation_task);
                Colleagues.getColleagus().success(function(data){//获取所有用户信息
                    if(data == "err"){
                        console.log("err");
                    }
                    else{
                        var alluser = JSON.parse(JSON.stringify(data));
                        console.log(alluser);
                        $scope.tasks2deal ={};
                        var count = 0;
                        var temp0 =  {
                            id:"",
                            userID:"",
                            userName:"",
                            name:"",
                            creat_at:"",
                            content:""
                        };
                        var temp =  {
                            id:"",
                            userID:"",
                            userName:"",
                            name:"",
                            creat_at:"",
                            content:""
                        };
                        for(var i = 0; i < vacation_task.length; i++){//将请假和其他任务两个不同的流程数据整理合并
                            temp = temp0;
                            temp.name = "请假";
                            temp.id = vacation_task[i].id;
                            temp.userID = vacation_task[i].assignee;
                            temp.creat_at = vacation_task[i].createTime;
                            temp.content = vacation_task[i].description;
                            for(var j = 0; j < alluser.length; j++)
                                if(temp.userID == alluser[j].userID)
                                    temp.userName = alluser[j].userName;
                            if($scope.tasks2deal[count] == undefined){
                                $scope.tasks2deal[count] = [];
                                $scope.tasks2deal[count].push(temp);
                                count++;
                            }
                            console.log($scope.tasks2deal);
                        }
                
                        Task.getOT2Deal("task",user).success(function(data){//获取待处理非请假任务列表
                            if(data == "fail"){
                                $scope.showErrorMesPopup("error in vacation");
                                console.log("待处理失败");
                            }
                            else{
                                var temp = JSON.stringify(data);
                                $scope.ot2deal = JSON.parse(temp);
                                console.log(temp);
                                console.log($scope.ot2deal);
                            }
//                        $scope.tasks2deal = $scope.tasks2deal.concat($scope.ot2deal);
//                        console.log($scope.tasks2deal);
                        });
                    }
                });
            }
        });
        



//-------------------------------删除已经结束流程的任务---------------------------------

        $scope.remove = function(event,item){
            event.stopPropagation();
            console.log(item);
            var temp = item.processID;
            Task.TaskDelete("task", item).success(function(data){
                if(data == "err in post /task/vacation/delete"){
                    console.log("ahsud");
                }
                else{
                    console.log("删除成功");
                    Task.getTaskList("task",user).success(function(data){//获取任务状态列表
                        if(data == "err in get /task"){
                        $scope.showErrorMesPopup("error in vacation");
                        console.log("ahsud");
                    }
                    else{
                        var temp = JSON.stringify(data);
                        $scope.tasks_state = JSON.parse(temp);
                        console.log($scope.tasks_state);
                    }
                    });
                }
            });    
        };

//-------------------------------下拉刷新重新从服务器获取数据并在界面上显示---------------------------------

        $scope.doRefresh = function() {
            $scope.$apply(function (){
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
                Task.getTask2Deal("task",user).success(function(data){//获取待处理任务列表
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
            });
            $scope.$broadcast('scroll.refreshComplete');
        }; 


		// $scope.onSwipeLeft = function() {//会和左划删除任务冲突，故删去功能
  //       	$state.go("tab.personal");
  //   	};
  //   	$scope.onSwipeRight = function() {
  //       	$state.go("tab.list");
  //   	};

//-------------------------------跳转到任务申请界面---------------------------------
//
        $scope.task_apl = function(){
            $state.go("taskApl");
        }


		})
    .controller('TaskAplCtrl',function($scope, $state, Task, $ionicPopup, $timeout, MyInfo) {

//-------------------------------界面上tab界面切换---------------------------------
        $scope.tabIndex = '请假';

        $scope.isOne = false;
        $scope.isTwo = false;

        $scope.showTab = function(tabIndex){
            if(tabIndex=='请假'){ 
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


        $scope.task = {userID:"",
                        userName:"",
                        numOfDays: "",
                        startTime: "", 
                        motivation: ""};

        //数据（伪）
        $scope.temp ={userID:"9",
                    userName:"申一",
                    numOfDays:"6",
                    startTime:"123141324",
                    motivation:"aiiiiiiiiiiiifhrbawuiergab ewdurq"};
        //获取用户的相关数据
  		 var user = JSON.parse(MyInfo.getLocalInfor());          
          

//-------------------------------submit方法，提交表单数据---------------------------------
//
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

//-------------------------------获取可供申请的其他任务的名称---------------------------------
//
        Task.getOTaskName("task").success(function(data){
                if(data == "err in get /task/deploy"){
                    console.log("22222");
                }
                else{
                    var temp = JSON.stringify(data);
                    $scope.OTaskName = JSON.parse(temp);
                    console.log($scope.OTaskName);
                }
          });

        $scope.otask={name:"",
                    userID:"",
                    userName:"",
                    content:"",
                    receiver:""};

//----------------------其他类型任务提交--------------------------------

        $scope.Osubmit = function(){
            console.log("otask.name"); 
            console.log($scope.otask.name);
            $scope.otask.userID = user.userID;
            $scope.otask.userName = user.userName;
            console.log($scope.otask);
            Task.AplOTask("task",  $scope.otask).success(function(data){
                if(data == "fail"){
                    $scope.showErrorMesPopup("申请发送失败");
                    console.log("22222");
                }
                else{
                    $scope.showSuccessMesPopup("成功发送申请");
                    console.log($scope.task);
                }
            });
        };

        //提交失败的弹窗
        $scope.showErrorMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
            }, 1000);
        };
        //提交成功的弹窗
        $scope.showSuccessMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>',
                template: '<p style="text-align: center"><ion-spinner icon="android" class="spinner-positive"></ion-spinner></p>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
                $state.go("tab.task");
            }, 500);
        };


        $scope.back2task = function(){
            $state.go("tab.task");
        };

        })

    .controller('TaskDetailCtrl', function($scope, $state, $stateParams, Task, $ionicPopup, MyInfo, $timeout) {

        $scope.dtltask = $stateParams.dtltask;//获取前端绑定的数据
        console.log($stateParams.dtltask);
        console.log($scope.dtltask);

//-------------------------------连接数据库获取任务的具体内容---------------------------------

        Task.getTaskDetail("task",$scope.dtltask).success(function(data){
            if(data == "fail"){
                console.log("250");
            }
            else{
                var temp = JSON.stringify(data);
                console.log(temp);
                $scope.task_detail = JSON.parse(temp);
                console.log($scope.task_detail);
                console.log($scope.task_detail.createTime)
                console.log($scope.task_detail.createTime);
            }
        });

//        var temp = $scope.task_detail.createTime;
//        console.log(temp[1]);

//-------------------------------当列表中显示请求被驳回的时候相关任务界面按钮功能---------------------------------        
//-------------------------------放弃请假，不再作出调整---------------------------------
        $scope.giveup = function(){
            $ionicPopup.confirm({
                title: "确认终止当前申请？",
                okText:"确认",
                cancelText:"取消"
            })
                .then(function(res) {
                    if(res) {
                        var user = JSON.parse(MyInfo.getLocalInfor());
                        var temp = {userID:"",
                                    id:"",
                                    numOfDays:"",
                                    startTime:"",
                                    motivation:"",
                                    send:"false"};
                        temp.userID = user.userID;
                        temp.id = $scope.task_detail.id;
                        // temp.numOfDays = $scope.task_detail.startTime;
                        // temp.motivation = $scope.task_detail.motivation;
                        Task.adjustRequest("task",  temp).success(function(data){
                            if(data == "fail"){
                                $scope.showErrorMesPopup("终止请求失败");
                                console.log("22222");
                            }
                            else{
                                $scope.showSuccessMesPopup("申请已终止");
                                
                                }
                            });
                        $state.go('tab.task');
                    } else {
                       return false;
                    }
                });
            
        };

//----------------------------跳转到调整请假信息界面，再次发出请假请求------------------------------------
//
        $scope.adjust = function(){
            $state.go("adjust", {ad_task:$scope.task_detail});
        };

        //失败弹窗
        $scope.showErrorMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
            }, 1000);
        };
        //成功弹窗
        $scope.showSuccessMesPopup = function(title) {
            var myPopup = $ionicPopup.show({
                title: '<b>'+title+'</b>',
                template: '<p style="text-align: center"><ion-spinner icon="android" class="spinner-positive"></ion-spinner></p>'
            });
            $timeout(function() {
                myPopup.close(); // 2秒后关闭
                $state.go("tab.task");
            }, 500);
        };

        $scope.back2task = function(){
            $state.go("tab.task");
        };
        })


    .controller('Task2DealDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $timeout,Task, MyInfo) {

        $scope.dtltask2deal = $stateParams.dtltask2deal;//获取前端绑定数据
        console.log($stateParams.dtltask2deal);
        console.log($scope.dtltask2deal);

//-------------------------------连接数据库获取任务的具体内容---------------------------------

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

        $scope.handle = {id:"0",
                        approve:"true",
                        motivation:""};
        $scope.handle.id = $scope.dtltask2deal.id;

        $scope.back2task = function(){
            $state.go("tab.task");
        };

//-----------------------------驳回请假申请-----------------------------------
//
        $scope.refuse = function(){
            var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="handle.motivation">',
            title: '请输入备注信息',
            subTitle: '（可不填）',
            scope: $scope,
            buttons: [
                { text: '取消' },
                {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
//                    return $scope.handle.motivation;
                    console.log($scope.handle.motivation);
                    $scope.handle.approve = "false";
                    Task.handleRequest("task",$scope.handle).success(function(data){
                        if(data == "fail"){
                            console.log("250");
                            $scope.showErrorMesPopup("处理失败，请刷新列表");
                        }       
                        else{
                            console.log("1");
                            $scope.showSuccessMesPopup("处理成功");
                        }  
                    });
                }
                }]
            });
            myPopup.then(function() {
                console.log('Tapped!');
                myPopup.close();
            });

        };

//-----------------------------同意请假-----------------------------------

        $scope.approve = function(){
            Task.handleRequest("task",$scope.handle).success(function(data){
                if(data == "fail"){
                    console.log("250");
                    $scope.showErrorMesPopup("处理失败，请刷新列表");
                }
                else{
                    console.log("1");
                    $scope.showSuccessMesPopup("处理成功");
                }
            });

        };

//-------------------------------点击列表中名称为调整请假的任务---------------------------------
//------------------------------放弃请假，不再作出调整----------------------------------
        //
        $scope.giveup = function(){
            $ionicPopup.confirm({
                title: "确认终止当前申请？",
                okText:"确认",
                cancelText:"取消"
            })
                .then(function(res) {
                    if(res) {
                        var user = JSON.parse(MyInfo.getLocalInfor());
                        var temp = {userID:"",
                                    id:"",
                                    numOfDays:"",
                                    startTime:"",
                                    motivation:"",
                                    send:"false"};
                        temp.userID = user.userID;
                        temp.id = $scope.task2deal_detail.id;
                        // temp.numOfDays = $scope.task_detail.startTime;
                        // temp.motivation = $scope.task_detail.motivation;
                        Task.adjustRequest("task",  temp).success(function(data){
                            if(data == "fail"){
                                $scope.showErrorMesPopup("终止请求失败");
                                console.log("22222");
                            }
                            else{
                                $scope.showSuccessMesPopup("申请已终止");
                                console.log($scope.task);
                                }
                            });
                        $state.go('tab.task');
                    } else {
                       return false;
                    }
                });
            
        };

//-------------------------------跳转到调整请假信息界面，再次发出请假请求---------------------------------
        //
        $scope.adjust = function(){
            $state.go("adjust", {ad_task:$scope.dtltask2deal});
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
                $state.go("tab.task");
            }, 500);
        };

    })

    .controller('TaskAdjustCtrl', function($scope, $state, Task, $ionicPopup, $stateParams, $timeout, MyInfo) {
        $scope.task2ad = $stateParams.ad_task;
        console.log($scope.task2ad);
        $scope.task2ad = $stateParams.ad_task;
        console.log($scope.task2ad);
        var user = JSON.parse(MyInfo.getLocalInfor());
        console.log(user);
        $scope.task = {userID:"",
                    id:"",
                    numOfDays:"",
                    startTime:"",
                    motivation:"",
                    send:"true"};   


        $scope.submit = function(){
            $scope.task.userID = user.userID;
            $scope.task.id = $scope.task2ad.id;
            console.log($scope.task);
            Task.adjustRequest("task",  $scope.task).success(function(data){
                if(data == "fail"){
                    $scope.showErrorMesPopup("申请发送失败");
                    console.log("22222");
                }
                else{
                    $scope.showSuccessMesPopup("成功发送申请");
                    console.log($scope.task);
                }
          });

            // $scope.task.apldate = new Date();
            // console.log($scope.task);
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
                $state.go("tab.task");
            }, 500);
        };


        $scope.back2task = function(){
            $state.go("tab.task");
        };
    });
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