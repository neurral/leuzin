
/**
	Start the Angular App definition
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
            templateUrl: 'app/components/core/views/login.html',
            controller: 'HomeController'
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