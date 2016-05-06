// var app = angular.module("leuzin")
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