
/**
	* 	Core Service: includes user-defined functions shared across controllers
*/

angular.module('leuzin', [])
    .service('coreServices', function () { 
    	this.say = function () { 
    		return "Hello World"; 
    	} 
    }); 