'use strict';
/**
	Start the Angular App definition.
	List the injections separated by comma
*/

    var app = angular.module("leuzin", [
    'ui.router',
    'ui.bootstrap',
    'xeditable',
    'oc.lazyLoad',
    'authModule'
    ])

    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // debug: true,
            events: true,
            modules: [
                {
                    name: 'UserModule',
                    files: ['app/components/user/profile_module.js']
                }
                // {} another module, dont forget comma separator
            ]
        });
    }])
    // Example of ocLoader event, use this somewhere e.g.g controller 
    // ocLazyLoad.moduleLoaded, ocLazyLoad.moduleReloaded, ocLazyLoad.componentLoaded, ocLazyLoad.fileLoaded
    // $scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
    //   console.log('module loaded', module);
    // });

    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('index', {
            url: '/index',
            // abstract: true,
            templateUrl: 'app/components/core/views/home.html',
            data: { title: 'Home' }
        })
        .state('404', {
            url: '/404',
            templateUrl: 'app/components/core/views/404.html',
            data: { title: 'Not Found' }
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
        .state('activate_token', {
            url: "/in/:username?token",
            templateUrl: 'app/components/core/token_module.html',
            controller: 'TokenCtrl',
            data: { title: 'Activate Link' }
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/components/core/dash_module.html',
            controller: 'DashboardCtrl',
            data: { title: 'Dashboard' }
        })
        .state('dashboard.profile', {
            url: "/profile",
            data: { title: 'Profile' },
            // views: {
            //     "userprofile": {
                    controller: 'UserProfileCtrl', // This view will use UserProfileCtrl loaded below in the resolve
                    templateUrl: 'app/components/user/profile_module.html'

                // }
            // }
            ,           
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                userprofileLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('UserModule');
                }]
            }
        })
        ; 

        $urlRouterProvider.when('', '/index');
        //everything else, 404
        $urlRouterProvider.otherwise('/404');

    }])

  .run(['APP_PROPERTIES','$rootScope', '$state', 'AuthService', '$http', 'ModalService', '$ocLazyLoad', 'editableOptions','editableThemes',
    function (APP_PROPERTIES,$rootScope, $state, AuthService, $http, ModalService, $ocLazyLoad, editableOptions,editableThemes) {

    // console.log(JSON.stringify($state.get()));
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['Accept'] = 'application/json';
    $http.defaults.headers.common['Cache-Control'] = 'max-age=0, no-cache, no-store, must-revalidate';

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    $rootScope.modalOptions = ModalService.modalOptions;
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        console.log('[Route] ' + next.name);
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
            else if (next.name === 'index') {
                event.preventDefault();
                $state.go('dashboard'); 
            }
        }
    });
}]);