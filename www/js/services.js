
angular.module('lqApp.services',[])

//http://115.159.38.100:3000

    .factory('$data',function($http){
        return {
            login : function(tableName,requestParams){
               	 var url =config.basePath+tableName;

                  return $http.post(url+"/login", {userPhone: requestParams.userPhone,userPwd:requestParams.userPwd});
            },
             getAnnocement :function(tableName,requestParams){
            	var url = config.basePath+tableName;
            	return $http.post(url+"/search",requestParams);
            }

            
        }

    });
