angular.module("leuzin")

/*
	CONSTANTS
*/
.constant('APP_PROPERTIES',{
	name: 'leuzin',
	display_name: 'Leuzin',
	auth_events: {
		notAuthenticated: 'auth-not-authenticated'
	},
	// api:  'https://neurral-nacc-0.herokuapp.com'
	api: 'http://localhost:3000'
	// api: 'mock'
})

/* mappings for modules available in neurral */
// .constant('MODULES', {
	
// })


/*
	SERVICES
*/
.service("ModalService",['$timeout','$window',
function($timeout,$window){
	var observerCBs = [];
	var registerObserverCallback = function(callback){
		observerCBs.push(callback);
	};
	var notifyObservers = function(){
		angular.forEach(observerCBs, function(callback){
			callback();
		});
	};

	var modalOptions = {
		loadingMessage: "Loading...",
		allowOk: false,
		title: "",
		isEnd: false,
		alertType: '',
		icon: 'glyphicon-refresh spinning'
	};

		var showSpinner = function(msg){
		$window.document.activeElement.blur(); //remove focus from last clicked button
		flash(msg,0,false);
		// angular.element('#load').trigger('click');
		angular.element(document.querySelector('#load')).trigger('click');
	}

	var hideSpinner = function(){
		// angular.element('#unload').trigger('click');
		angular.element(document.querySelector('#unload')).trigger('click');
	}

	var flash = function(msg, timeOut, isEnd){ 
		modalOptions.allowOk = false;
		modalOptions.isEnd = isEnd;
		modalOptions.loadingMessage =  msg ? msg : "Loading...";       
		if (timeOut == 0 ){ 
			if (isEnd) {
				modalOptions.allowOk = true;
			}
		}
		else { 
			$timeout(function(){hideSpinner()},timeOut);
		}
		notifyObservers();
	}

	//terminal (ending) flashes
	var flashSuccess = function(msg,withOK){
		// modalOptions.alertType='success';
		// modalOptions.icon='glyphicon-ok';
		flash(msg,(withOK ? 0 : 2000),true);
	}
	var flashFailure = function(msg,withOK){	
		// modalOptions.alertType='danger';
		// modalOptions.icon='glyphicon-remove';
		flash(msg,(withOK ? 0 : 2000),withOK);
	}
	var flashInfo = function(msg,withOK){
		flash(msg,(withOK ? 0 : 2000),withOK);
	}
	var flashWithCB = function(msg,withOK,cb){
		flash(msg,(withOK ? 0 : 2000),withOK);
		if (cb){
			if (withOK) {
				//bind the callback (e.g. a #state.go after the flash) to the OK button
				angular.element('#unload').bind('click',cb);
			}
			else cb(); //call directly
		} 
	}

	//Expose the functions 
	return {
		registerObserverCallback: registerObserverCallback,
		showSpinner: showSpinner,
		flash: flash,
		flashSuccess: flashSuccess,
		flashInfo: flashInfo,
		flashFailure: flashFailure,
		flashWithCB: flashWithCB,
		modalOptions: modalOptions
	};
}])

/*
	DIRECTIVES
*/
.directive('initialization',['$rootScope',
function($rootScope) {
//this basically a timeout before broadcasting the "initialized" for activate_token state
	return {
		restrict: 'A',
		link: function($scope) {
			var to;
			var listener = $scope.$watch(function() {
				clearTimeout(to);
				to = setTimeout(function () {
				console.log('[Leuzin] initialized');
				listener();
				$rootScope.$broadcast('initialized'); //TODO should I $emit this shit?
				}, 500);
			});
		}
	};
}])
.directive("lzspinner",['ModalService',
function (ModalService) {
	return {
		restrict: 'E',
		scope: {
      		modalOpts: '=options'
    	},
		replace: 'true',
		templateUrl: 'app/components/core/views/modal_spinner.html'
  	};
}])

/*
	CONTROLLERS	
*/
.controller('AppCtrl', ['$rootScope', '$scope', 'AuthService', '$state', '$timeout', 'ModalService', '$q',
function($rootScope,$scope, AuthService, $state, $timeout, ModalService, $q){
	/* Synchronizers to top-level $scope */
	ModalService.registerObserverCallback(function(){
		$rootScope.modalOptions = ModalService.modalOptions;
	});
	AuthService.registerObserverCallback(function(){
		$rootScope.session = AuthService.sessionInfo(); 
	});
	//Logout is in top controller so that it can be called from the navbar 
	$scope.logout = function() {
		ModalService.showSpinner("Logging out...");
		AuthService.logout(JSON.stringify({ user: $scope.user }));
		$state.go('login');
		ModalService.flashSuccess('Logged out!', false);
	};
}])

.controller('LoginCtrl', ['$scope', 'AuthService', '$state', 'ModalService', '$rootScope', 
function($scope, AuthService, $state, ModalService, $rootScope) {
	$scope.user = {};  
	$scope.requestToken = function(){
		ModalService.showSpinner("Requesting new token...");
		if ($scope.user.username == undefined) {
			ModalService.flashFailure('Error! Please enter your username.',true);      
		}
		else {
			AuthService.requestToken($scope.user).then(function(msg) {
				ModalService.flashSuccess(msg,true);
			}, function(errMsg) {
				ModalService.flashFailure('Request failed: ' + errMsg,true);
			});
		}
	};
	$scope.login = function() {
		ModalService.showSpinner("Logging in...");
		AuthService.login(JSON.stringify({ user: $scope.user })).then(function(userData) {
			$rootScope.user = userData;
			ModalService.flashSuccess('Login success!', false);
			$state.go('dashboard');
		}, function(errMsg) {
			ModalService.flashFailure('Login failed: ' + errMsg,true);
		});
	};
}])

.controller('TokenCtrl', ["$rootScope","$scope", "AuthService", "$http", "$state", "$stateParams", "ModalService", "$timeout",
function($rootScope, $scope, AuthService, $http, $state, $stateParams, ModalService, $timeout) {
	$scope.message = '';

	var loadNewToken = function(){
		ModalService.showSpinner("Setting new token for " + $stateParams.username + "...");
		//activate the new token to API so that an expiry can be set and can be used for log in later!
		AuthService.activateNewToken($stateParams).then(
			function(userData){
				$rootScope.user = userData;
				ModalService.flashWithCB("Access granted!",false, function(){$state.go('dashboard');});
			},
			function(result){
				$scope.message = result[0];
				ModalService.flashWithCB("Login failed: "+result, true, function(){$state.go('login');});        
		});
	}
	//listen to when the body directive 'initialization' has initialized
	//use $watch instead of orig $on?
	$scope.$watch('initialized', function() {
		// console.log("calling loadNewToken");
		loadNewToken();
	});
}])

.controller('RegisterCtrl', ['$scope', 'AuthService', '$state', 'ModalService',
function($scope, AuthService, $state, ModalService) {
	$scope.user = {
		date_start : new Date()
	};
	//Angular UI properties for form
	$scope.dateOptions = {
		formatYear: 'yy',
		// maxDate: new Date(),
		minDate: new Date(1950, 1, 1),
		startingDay: 1
	};
	$scope.birthdayCal = {
		opened: false
	};
	$scope.dateStartCal = {
		opened: false
	};
	//Submit functions
	$scope.register = function() {
			ModalService.showSpinner("Requesting registration...");
			AuthService.register(JSON.stringify({ user: $scope.user })).then(function(msg) {
			console.log('Response = ' + JSON.stringify(msg));
			ModalService.flashWithCB("Registration submitted! You will be emailed once your account is approved by an administrator.",true, function(){$state.go('login');});
		}, function(errMsg) {
			ModalService.flash("Registration failed: Error " + errMsg,0,true);
		});
	};
}])

.controller('DashboardCtrl',['$rootScope','$scope', 'AuthService', '$http', '$state', '$ocLazyLoad',
function($rootScope,$scope, AuthService, $http, $state, $ocLazyLoad) {

}])

;