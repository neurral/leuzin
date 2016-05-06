'use strict';
/**
	Start the Angular App definition.
	List the injections separated by comma
*/

var app = angular.module("leuzin", [
    // 'ngRoute',
    'sessionModule',
    'loginModule'
])
.controller('myCtrl', function(SessionLoader) {
    var self = this;
    self.session ={ 
        session : {
            username : "2013000016",
            session_key : "fgypsbwmkgtbafzu"
        }
    };
    SessionLoader.retrieveSession(self.session)
    .then(function(response){
        //successfull session check
        self.session =  response.session;
    },function(response){
        //promise rejected
        self.session = null;
    });
    console.log("Session by service: " + JSON.stringify(self.session));

})

.run(function($rootScope,$http) {
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.common['Accept'] = 'application/json';

    //this is a 'remembered' session, replace this with retrieval from localstorage or similar
    //$rootScope.session = {};
    //$rootScope.session = {
    //     session : {
    //         username : "2013000016",
    //         session_key : "fgypsbwmkgtbafzu"
    //     }
    // };
});
