
/**
	* 	Core Service: includes user-defined functions shared across controllers
*/

app.service('CoreServices', function () { 
	this.say = function () { 
		console.log("Hello World"); 
	} 
}); 

app.service("SessionLoader", ['$rootScope', 'Session', function($rootScope, Session) {     
	this.reload = function() {
		Session.then(function(response){
    		// console.log(JSON.stringify(response.data));
        	$rootScope.session = response.data.session;
    	},
    	function(response){ //error
    		//console.log(JSON.stringify(response.data));
        	$rootScope.session = {};
    	});
        console.log($rootScope.session);
        return $rootScope.session;
	},
    this.session = function(){
        console.log("Returning rootScope session...");
        return $rootScope.session;
    }
}]);

 app.factory('Session', ['$http','$rootScope', function($http,$rootScope) {    
    return $http({
        url: 'http://localhost:3000/check',
        method: "POST",
        data : $rootScope.session
    });
    //Session is then-able, used in SessionLoader service
}]); 
