
/**
	* 	Core Service: includes user-defined functions shared across controllers
*/

app.service('CoreServices', function () { 
	this.say = function () { 
		console.log("Hello World"); 
	} 
}); 

app.service("sessionDataLoader", function($http) {
	this.load = function() {
		console.log("sessionDataLoader found");
		return $http({url: "mock/session.json"});
		// return $http.get('mock/session.json');
	}
});

// app.factory('Session', function($http) {
// 	return {
// 		get:  function(){
// 	        return $http.get('mock/session.json'); // this will return a promise to controller
//     	}
//     }
// });
