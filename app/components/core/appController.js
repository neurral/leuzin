// var app = angular.module("leuzin")

angular.module('sessionModule', [])
  .directive('sessionDirective', function() {
    return {
      scope: {
      	session : {}; //replace this with retrieval frim localstorage?
      },
      templateUrl: 'session_.html',
      replace: true,
      controller: 'SessionController',
      controllerAs: 'sessionCtrl'
    };
  })
  .controller('SessionController', function() {
    this.session = [
      {firstName: 'Rachel', lastName: 'Washington'},
      {firstName: 'Joshua', lastName: 'Foster'},
      {firstName: 'Samuel', lastName: 'Walker'},
      {firstName: 'Phyllis', lastName: 'Reynolds'}
    ];
  });

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/components/core/views/login.html',
        controller: 'LoginController'
      }).
      when('/login', {
        templateUrl: 'app/components/core/views/login.html',
        controller: 'LoginController'
      }).
      when('/home', {
        templateUrl: 'app/components/dashboard/views/dashboard.html',
        controller: 'HomeController'
      }).
      // when('/phones/:phoneId', {
      //   templateUrl: 'partials/phone-detail.html',
      //   controller: 'PhoneDetailCtrl'
      // }).
      otherwise({
        redirectTo: '/404'
      });
  }]);

app.controller("AppController", ['SessionLoader','$location', 
	function(SessionLoader, $location) {     
	console.log("AppController running...");
	var self = this;
	var session = SessionLoader.reload();
	// console.log(session);
	if (angular.equals({},session)) {
		// alert("test");
		$location.url = 'login';
		$location.replace();
	}
	else {
		// $location.url = 'home';
		// $location.replace();
	}
}]);

app.controller("LoginController", [function(){
	var self = this;

}]);
app.controller("HomeController", [function(){
	var self = this;

}]);