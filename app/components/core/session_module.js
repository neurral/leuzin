// var app = angular.module("leuzin")

angular.module('sessionModule', [])
.directive('sessioner', ['$rootScope',function($rootScope) {
	return {
	  scope: {},
      restrict: 'E',
      templateUrl: 'app/components/core/session_module.html',
      replace: true,
      // controller: 'SessionController', //executes before compilation
      // controllerAs: 'sessionCtrl'
      // link: function postLink(scope, element, attrs) {
      //     scope.session ={ 
      //     		session : {
      //         		username : "2013000016",
      //         		session_key : "fgypsbwmkgtbafzu"
      //         	}
      //     }
      //     scope.getSession = function(scope.session){
      //         SessionLoader.retrieveSession(scope.session).then(function(response){
      //             scope.session = response.data.session;
      //         });
      //     }
      //     // default query
      //     // It may  be the first one or may be getting from angular's cache
      //     scope.getSession(scope.session);
      // }
  };
}])
// .controller('SessionController',['SessionLoader','$scope', function(SessionLoader,$scope) {
	//this coresponds to scope
	// this.session = {session : {username : "2013000016",session_key : "fgypsbwmkgtbafzu"}};
	// this.session = SessionLoader.reload();
	// alert(this.session);
	
	// $scope.session ={ 
	// 	session : {
	// 		username : "2013000016",
	// 		session_key : "fgypsbwmkgtbafzu"
	// 	}
	// };
	// $scope.getSession = function(){
	//  	SessionLoader.retrieveSession($scope.session)
	//  	.then(function(response){
	//  		$scope.session = response.session;
	//  	});
	// };
	// $scope.getSession($scope.session);
	//alert(JSON.stringify($scope.session));
// }])
.service("SessionLoader", ['$http','$q', function($http, $q) {     
	var querySession = function(session_param){
		var deferred = $q.defer();
		console.log('querying');
		// this.session = {session : {username : "2013000016",session_key : "fgypsbwmkgtbafzu"}}; 
		var config = {
			url: 'http://localhost:3000/check',
			method: "POST",
			data : session_param
		};

		$http(config).then(function(response){
			deferred.resolve(response.data.session);
		},function(response){
        	deferred.reject("no session");
        });

		return deferred.promise;
	};

    return {
		retrieveSession: querySession
    };

}]);
// .factory('Session', ['$http', function($http) {  
// 	this.session = {session : {username : "2013000016",session_key : "fgypsbwmkgtbafzu"}};  
// 	console.log('SessionFactory: '+this.session);
// 	return $http({
// 		url: 'http://localhost:3000/check',
// 		method: "POST",
// 		data : this.session
// 	});
//     //Session is then-able, used in SessionLoader service
// }]);
