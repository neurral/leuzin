'use strict';
/**
	Start the Angular App definition.
	List the injections separated by comma
*/

var app = angular.module("leuzin", [
    'ngRoute',
    'restangular'
]);


app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

/**
	Routes as a Single-Page app
*/

//TODO for modification and testing
app.config(
    ['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            title: 'Index',
            controller: 'AppController',
            controllerAs: 'appCtrl',
            templateUrl: 'app/components/core/views/home.html',
            resolve:{
                sessionData: function(sessionDataLoader){
                    return sessionDataLoader.load();
                }
            }

        });
        $routeProvider.when('/home', {
            title: 'Home',
            templateUrl: 'app/components/core/views/home.html',
            controller: 'HomeController',
            controllerAs: 'homeCtrl'
        });
        $routeProvider.when('/login', {
            title: 'Home',
            templateUrl: 'app/components/core/views/login.html'
        });
        $routeProvider.when('/app/dashboard', {
            title: 'Dashboard',
            templateUrl: 'app/components/dashboard/views/dashboard.html',
        });
        // $routeProvider.when('/Product/:id', {
        //     title: 'Product',
        //     templateUrl: '/Assets/Views/Product.html',
        //     controller: 'ProductController'
        // });
        $routeProvider.otherwise({title:'404',templateUrl:'app/components/core/views/404.html'});
    }]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);