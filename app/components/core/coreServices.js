
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
    		console.log(JSON.stringify(response.data));
        	$rootScope.session = response.data.session;
    	},
    	function(response){
    		console.log(JSON.stringify(response.data));
        	$rootScope.session = response.statusText;	
    	});
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
    // .then(function(response) {
    //         // success
    //         return response.data
    // }
    // , 
    // function(response) { // optional
    //         // failed
    //         console.log("failed");
    // });
}]); 

// app.factory('Session', function($http) {
// 	return {
// 		get:  function(){
// 	        return $http.get('mock/session.json'); // this will return a promise to controller
//     	}
//     }
// });
