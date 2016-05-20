angular.module('authModule',[])
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
.constant('API_ENDPOINT', {
  url: 'https://neurral-nacc-0.herokuapp.com'
})
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
  // url: 'https://neurral-nacc-0.herokuapp.com/'
  // url: 'http://localhost:3000'

.service("AuthService",["$q", "$http", "API_ENDPOINT", function($q, $http, API_ENDPOINT){
  var SESSION = 'local_session';  //should we use the token key or..this 'lcoal_session' will cause one session per browser only
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var session = JSON.parse(window.localStorage.getItem(SESSION));
    //TODO : add validation check of expiry time if past, or we could validate to the api?
    if (session) {
      useCredentials(session);
    }
    else session = {};
    return session;
  }
 
  function storeUserCredentials(session) {
    window.localStorage.setItem(SESSION, JSON.stringify(session));
    useCredentials(session);
  }
 
  function useCredentials(session) {
    isAuthenticated = true;
    authToken = session.session_key;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
    //you need to pass the username as param in the AJAX call or the request will be invalid despite Authorization header
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(SESSION);
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
    	user = {
    		user : {
    			username: user.username,
    			password: user.password
    		}
    	}
      $http.post(API_ENDPOINT.url + '/signup', user).then(
      	function(result) {
        	if (result.data.success) {
          	resolve(result.data.msg);
        	} else {
          	reject(result.data.msg);
        	}
      	},
      	function(result){
      		//TODO: retrieve Reg ERRORS here
      	}
      );
    });
  };
 
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/login', user).then(
      	function(result) {
          console.log("Session: " + JSON.stringify(result.data.session.session_key));
          if (result) storeUserCredentials(result.data.session);
          resolve(result);
      	},
      	function(result){
      		reject("No session");
      });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
    sessionInfo: function() {return loadUserCredentials();} 
  };
}])
 
.factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS',function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
}])
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

