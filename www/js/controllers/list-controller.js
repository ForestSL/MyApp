angular.module('list-controller',[])
    .controller('FriendsCtrl', function($scope, Friends, Colleagues, $ionicScrollDelegate, MyInfo, $state) {

        $scope.information = JSON.parse(MyInfo.getLocalInfor());
        $scope.lists = {}
        Colleagues.getColleagus().success(function(data){//获取用户列表
            if(data == "err"){
                console.log("err");
            }
            else{
                var tmp = JSON.parse(JSON.stringify(data));
                console.log(tmp);
                $scope.lists = tmp;
                console.log($scope.lists);
                $scope.depart="userDepart";
                var list = $scope.lists;

        //将相关人员加到相对应的部门下面
                var tmplist={};
                for (var i = 0; i < list.length-1; i++){
                    for (var j = i; j < list.length; j++){
                        if (list[i].userDepart > list[j].userDepart){
                            var temp = list[i];
                            list[i] = list[j];
                            list[j] = temp;
                        }
                    }
                }
                console.log(list);
                for(i=0;i<list.length;i++){
                    var dpt=list[i].DepartName;
                    if( tmplist[dpt] ==undefined){
                        tmplist[dpt]=[]
                    }       
                    tmplist[dpt].push(list[i] );
                }
                $scope.sorted_lists = tmplist;
            }
        });

        

        

        $scope.doRefresh = function() {
            $scope.$apply(function (){
                Colleagues.getColleagus().success(function(data){//获取用户列表
                    if(data == "err"){
                        console.log("err");
                    }
                    else{
                        var tmp = JSON.parse(JSON.stringify(data));
                        console.log(tmp);
                        $scope.lists = tmp;
                        var list = $scope.lists;
        //将相关人员加到相对应的部门下面
                        var tmplist={};
                        for (var i = 0; i < list.length-1; i++){
                            for (var j = i; j < list.length; j++){
                                if (list[i].userDepart > list[j].userDepart){
                                    var temp = list[i];
                                    list[i] = list[j];
                                    list[j] = temp;
                                }
                            }
                        }
                        console.log(list);
                        for(i=0;i<list.length;i++){
                            var dpt=list[i].DepartName;
                            if( tmplist[dpt] ==undefined){
                                tmplist[dpt]=[]
                            }
                            tmplist[dpt].push(list[i] );
                        }
                        $scope.sorted_lists = tmplist;
                        console.log(tmplist);

                    }
                });
               
            });
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.go2gpchat = function(){
            console.log("nimab");
            $state.go("group-chatting");
            console.log("跳转成功");
        };


    })