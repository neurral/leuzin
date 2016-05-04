'use strict';
/**
	Start the Angular App definition.
	List the injections separated by comma
*/

var app = angular.module("leuzin", [
    'ngRoute'
])


.run(function($rootScope,$http) {
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['Accept'] = 'application/json';

    //this is a 'remembered' session, replace this with retrieval from localstorage or similar
    $rootScope.session = {};
    // $rootScope.session = {
    //     session : {
    //         username : "2013000016",
    //         session_key : "fgypsbwmkgtbafzu"
    //     }
    // };
});