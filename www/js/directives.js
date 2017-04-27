
angular.module('lqApp.directives',[])

    .directive('hello',['$data',function($data){
        return {
            restrict:"E",
            templateUrl:"templates/data-list.html",
            replace:true,
            link:function(scope,element,attr){
                element.bind("mouseenter",function(){
                    $data.all(attr.datasource);
                    scope.datas = $data.datas;
                });
            }
        }
    }]);