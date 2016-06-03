angular.module('authModule',[])

.service("AuthService",["$q", "$http", "APP_PROPERTIES", function($q, $http, APP_PROPERTIES){
	var KEY_SESSION = 'neurral_session';  //this will cause one session per browser only, as per our singular-login-policy
	var session = {};

	//Notifications for Parent Controller
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
		//TODO : add client-side validation check of expiry time if past, or we could validate to the api?
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
		$http.defaults.headers.common.Authorization = "Token token="+token;
		notifyObservers();
	}

	function destroyUserCredentials() {
		session = undefined;
		$http.defaults.headers.common.Authorization = undefined;
		window.localStorage.removeItem(KEY_SESSION);
		notifyObservers();
	}

	var register = function(user) {
		return $q(function(resolve, reject) {
			$http.post(APP_PROPERTIES.api + '/register', user).then(
			function(result) {
				resolve(result);
			},
			function(result){
				reject(result.status);
			});
		});
	};

	var login = function(user) {
		loadUserCredentials();
		return $q(function(resolve, reject) {
			$http.post(APP_PROPERTIES.api + '/login', user).then(
			function(result) {
				console.log("LoginData: " + JSON.stringify(result));
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
			$http.post(APP_PROPERTIES.api + '/request-token/'+user.username).then(
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
			$http.post(APP_PROPERTIES.api + '/in/'+session.username+"?token="+session.token).then(
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

	var logout = function(user) {
		$http.post(APP_PROPERTIES.api + '/logout', user); //TODO : add promise resolution?
		destroyUserCredentials();
	};

	/* Auto Execute */
	loadUserCredentials();

	/* Exposed Functions */
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

.factory('AuthInterceptor', ['$rootScope', '$q', 'APP_PROPERTIES',function ($rootScope, $q, APP_PROPERTIES) {
	return {
		responseError: function (response) {
			$rootScope.$broadcast({
				401: APP_PROPERTIES.auth_events.notAuthenticated,
			}[response.status], response);
			return $q.reject(response);
		}
	};
}])

.config(function ($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});

