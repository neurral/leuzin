
/**
	* 	Core Service: includes user-defined functions shared across controllers
*/

app.service('CoreServices', function ($http) { 
    	this.say = function () { 
    		console.log("Hello World"); 
    	} 
    }); 

app.factory('Session', function($http) {
  // var Session = {
  //   data: {},
  //   saveSession: function() { /* save session data to db */ },
  //   updateSession: function() { 
  //     /* load data from db */
  //     $http.get('mock/session.json').then(function(r) { 
		// // console.log(JSON.stringify(Session));
  //     	Session.data = r.data;
  //     });
  //   }
  // };
  // Session.updateSession();
  // return Session; 
    return {
        get:  function(){
            return $http.get('mock/session.json'); // this will return a promise to controller
        }
	}
});
