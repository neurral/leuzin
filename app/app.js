
/**
	Start the Angular App definition.
	List the injections separated by comma
*/

var app = angular.module("leuzin", [
	'ngRoute'
]);


/**
	Routes as a Single-Page app
*/

//TODO for modification and testing
app.config(
    ['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            title: 'Home',
            controller: 'IndexController',
            controllerAs: 'indexCtrl'
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
        // $routeProvider.when('/Product/:id', {
        //     title: 'Product',
        //     templateUrl: '/Assets/Views/Product.html',
        //     controller: 'ProductController'
        // });
    }]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);