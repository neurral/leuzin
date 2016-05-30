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
    'ui.bootstrap',
    'authModule'
    ])
    //  For a simulator use: url: 'http://127.0.0.1:8080/api'
    // url: 'https://neurral-nacc-0.herokuapp.com/'
    // url: 'http://localhost:3000'

  .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
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
            url: '/index',
            // abstract: true,
            templateUrl: 'app/components/core/views/home.html',
            data: { title: 'Home' }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/components/core/login_module.html',
            controller: 'LoginCtrl',
            data: { title: 'Login' }
        })
        .state('register', {
            url: '/register',
            templateUrl: 'app/components/core/register_module.html',
            controller: 'RegisterCtrl',
            data: { title: 'Register' }
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/components/core/dash_module.html',
            controller: 'DashboardCtrl',
            data: { title: 'Dashboard' }
        })
        .state('activate_token', {
            url: "/in/:username?token",
            templateUrl: 'app/components/core/token_module.html',
            controller: 'TokenCtrl',
            data: { title: 'Activate Link' }
        })
        .state('404', {
            url: '/404',
            templateUrl: 'app/components/core/views/404.html',
            data: { title: 'Not Found' }
        }); 

        //when no states the href, go to dashboard. isAuthenticated will be checked in $stateChangeStart
        //and will redirect to login if not logged in.
        $urlRouterProvider.when('', '/index');
        //everything else, 404
        $urlRouterProvider.otherwise('/404');

    }])


  .run(['APP_PROPERTIES','$rootScope', '$state', 'AuthService', '$http', 'ModalService',
    function (APP_PROPERTIES,$rootScope, $state, AuthService, $http, ModalService) {
    // console.log(JSON.stringify($state.get()));
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['Accept'] = 'application/json';

    $rootScope.modalOptions = ModalService.modalOptions;
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        console.log(next.name);
        // console.log('RS:' +$rootScope.session + "AUTH'd: "+ JSON.stringify(AuthService.sessionInfo()));
        // console.log(JSON.stringify("StateParams: " + nextParams));
        
        /* Set the Route Title to the Page Title*/
        $rootScope.title = APP_PROPERTIES.display_name + " | " + (next.data.title || "");
        // console.log($rootScope.title);

        var allowed_unauth_states = ['index','login','register','activate_token'];
        if (!AuthService.isAuthenticated()) {
            // if (next.name !== 'index' && next.name !== 'login' && next.name !== 'register' && next.name !== 'activate_token') {
            if (allowed_unauth_states.indexOf(next.name) < 0){
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
}]);