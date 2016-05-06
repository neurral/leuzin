// var app = angular.module("leuzin")

angular.module('loginModule', [])
.directive('loginForm', ['$rootScope',function($rootScope) {
	return {
	  scope: {},
      restrict: 'E',
      templateUrl: 'app/components/core/login_module.html',
      replace: true,
      controller: 'LoginController', //executes before compilation
      controllerAs: 'loginCtrl'
  };
}])
.controller('LoginController',['LoginService','$scope', function(LoginService,$scope) {
	var self = this;
	// $scope.user ={ 
	// 	user : {
	// 		username : "2013000016",
	// 		password : "fgypsbwmkgtbafzu"
	// 	}
	// };
	self.login = function(user){
		user = {
			user : {
				username : user.username,
				password : user.password
			}
		};
		// alert("Check creds: " + JSON.stringify(user));
	 	delete $scope.session; 
	 	LoginService.tryLogin(user).then(
	 		function(result){
	 			$scope.session = result.session;
	 		},
	 		function(result){
	 			$scope.session = null;
	 		}
	 	);
	 	// console.log(JSON.stringify($scope.session));
	};
	
}])
.service("LoginService", ['$http','$q', function($http, $q) {     
	var login = function(login_params){
		var deferred = $q.defer();
		var config = {
			url: 'http://localhost:3000/login',
			method: "POST",
			data : login_params
		};

		$http(config).then(function(response){
			deferred.resolve(response.data.session);
		},function(response){
        	deferred.reject("login failed");
        });

		return deferred.promise;
		// $http(config).then(function(response){
		// 	console.log("success login response");
		// 	return response.data.session;
		// },function(response){
		// 	console.log("failed login response");
 		 //       	return {};
		  //       });
	};

    return {
		tryLogin: login
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
