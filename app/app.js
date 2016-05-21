'use strict';
/**
	Start the Angular App definition.
	List the injections separated by comma
    */

    var app = angular.module("leuzin", [
    // 'ngRoute',
    // 'sessionModule',
    // 'loginModule',
    'ui.router',
    'authModule'
    ])

    .constant('AUTH_EVENTS', {
      notAuthenticated: 'auth-not-authenticated'
    })
    .constant('API_ENDPOINT', {
      // url: 'https://neurral-nacc-0.herokuapp.com'
      url: 'http://localhost:3000'
    })
    //  For a simulator use: url: 'http://127.0.0.1:8080/api'
    // url: 'https://neurral-nacc-0.herokuapp.com/'
    // url: 'http://localhost:3000'

  .config(function($stateProvider, $urlRouterProvider) {
        // $locationProvider.html5Mode(true);
        // $locationProvider.html5Mode({
        //   enabled: true,
        //   requireBase: false
        // });

        // $urlRouterProvider.when('', '/');
        // otherwise report 404
        // 

        $stateProvider
        .state('index', {
            url: 'index',
            // abstract: true,
            templateUrl: 'app/components/core/views/home.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/components/core/login_module.html',
            controller: 'LoginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'app/components/core/register_module.html',
            controller: 'RegisterCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/components/core/dash_module.html',
            controller: 'DashboardCtrl'
        })
        .state('404', {
            url: '/404',
            templateUrl: 'app/components/core/views/404.html',
        }); 

        //when no states the href, go to dashboard. isAuthenticated will be checked in $stateChangeStart
        //and will redirect to login if not logged in.
        $urlRouterProvider.when('', '/dashboard');
        //everything else, 404
        $urlRouterProvider.otherwise('/404');

    })


  .run(function ($rootScope, $state, AuthService, $http) {
    // console.log(JSON.stringify($state.get()));
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['Accept'] = 'application/json';

    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        console.log(next.name);
        if (!AuthService.isAuthenticated()) {
          if (next.name !== 'login' && next.name !== 'register') {
            event.preventDefault();
            $state.go('login');
        }
    }
    else {
        if (next.name === 'login' || next.name === 'register') {
                    event.preventDefault(); //do not allow login or register if already logged in
                }
            }
        });
});


// .directive("navigation", function () {
//     return {
//         restrict: 'E',
//         replace: 'true',
//         // template: '<h3>Component</h3>'
//         // template: function(app){
//         //  return app
//         // }
//         templateUrl: "app/components/core/views/navbar.html"
//     };
// })
// .controller('myCtrl', function(SessionLoader) {
//     var self = this;
//     self.session ={ 
//         session : {
//             username : "2013000016",
//             session_key : "fgypsbwmkgtbafzu"
//         }
//     };
//     SessionLoader.retrieveSession(self.session)
//     .then(function(response){
//         //successfull session check
//         self.session =  response.session;
//     },function(response){
//         //promise rejected
//         self.session = null;
//     });
//     console.log("Session by service: " + JSON.stringify(self.session));

// })
