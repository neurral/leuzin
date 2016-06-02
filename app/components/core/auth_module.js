angular.module('authModule',[])
.service("AuthService",["$q", "$http", "API_ENDPOINT", function($q, $http, API_ENDPOINT){
  var KEY_SESSION = 'local_session';  //should we use the token key or..this 'lcoal_session' will cause one session per browser only
  var session = {};


  //Notifications for AppCtrl
  var observerCBs = [];
  var registerObserverCallback = function(callback){
    observerCBs.push(callback);
  };
  var notifyObservers = function(){
    angular.forEach(observerCBs, function(callback){
      callback();
    });
  };
 
  function loadUserCredentials() {
    session = JSON.parse(window.localStorage.getItem(KEY_SESSION));
    //TODO : add validation check of expiry time if past, or we could validate to the api?
    // console.log(JSON.stringify(session));
    if (session) {
      useCredentials(session.token);
    }
    else session = undefined;
  }
 
  function storeUserCredentials(userAndToken) {
    window.localStorage.setItem(KEY_SESSION, JSON.stringify(userAndToken));
    session = userAndToken;
    session.isAuthenticated = true;
    useCredentials(userAndToken.token);
  }
 
  function useCredentials(token) {
    // Set the token as header for your requests!
    // session.isAuthenticated = isAuthenticated;
    // console.log(session.token);
    $http.defaults.headers.common.Authorization = "Token token="+token;
    notifyObservers();
  }
 
  function destroyUserCredentials() {
    session = undefined;
    $http.defaults.headers.common.Authorization = undefined;
    // window.localStorage.removeItem(KEY_SESSION);
    notifyObservers();
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/register', user).then(
      	function(result) {
          // console.log(JSON.stringify(result));
         	resolve(result);
      	},
      	function(result){
      		//TODO: retrieve Reg ERRORS here
          reject(result.status);
      	}
      );
    });
  };
 
  var login = function(user) {
    loadUserCredentials();
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/login', user).then(
      	function(result) {
          console.log("Session: " + JSON.stringify(result));
          if (result) {
            session.isAuthenticated = true;
            resolve(result.data);
          }
      	},
      	function(result){
          console.log(JSON.stringify(result));
          destroyUserCredentials();
      		reject(result.data.errors);
      });
    });
  };

  var requestToken = function(user){
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/request-token/'+user.username).then(
        function(result) {
          if (result.status == 202) resolve("Your request is being processed. Please check your email for your access link.");
        },
        function(result){
          console.log(JSON.stringify(result));
          reject(result.data.errors);
      });
    });
  }

  var activateToken = function(session){
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/in/'+session.username+"?token="+session.token).then(
        function(result) {
          if (result.status == 200) {
            resolve(result.data);
            storeUserCredentials(session);
          }
          else if (result.status == 409){
            reject(result);
          }
          else {
            reject("Unknown issue, please retry later: " +result.status);
          }
          // TODO check why this does not produce modal in heroku
        },
        function(result){
          console.log(JSON.stringify(result));
          if (result.status == 404){
            reject("Bad/expired token.");
          }
          else {
           reject(result.data.errors);
          }
      });
    });
  }

  var logout = function() {
    // TODO : add ajax call for session delete in API
    destroyUserCredentials();
  };
 
  loadUserCredentials(); //automatically load
 
  //Exposed functions 
  return {
    registerObserverCallback: registerObserverCallback,
    login: login,
    register: register,
    logout: logout,
    requestToken: requestToken,
    activateNewToken: activateToken,
    isAuthenticated: function() {return (session && session.isAuthenticated);},
    sessionInfo: function() {return session;} 
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

