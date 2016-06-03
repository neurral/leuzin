angular.module("leuzin")

/*
	CONSTANTS
*/
.constant('APP_PROPERTIES',{
	name: 'leuzin',
	display_name: 'Leuzin'
})
.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated'
})
.constant('API_ENDPOINT', {
	// url: 'https://neurral-nacc-0.herokuapp.com'
	url: 'http://localhost:3000'
	// url: 'mock'
})

/* mappings for modules available in neurral */
// .constant('MODULES', {
	
// })



/*
	SERVICES
*/
.service("ModalService",function($timeout,$window){
	var observerCBs = [];
	var registerObserverCallback = function(callback){
		observerCBs.push(callback);
	};
	var notifyObservers = function(){
		angular.forEach(observerCBs, function(callback){
      // console.log("Notifying...");
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
    console.log("Show spinner: " + msg);
    $window.document.activeElement.blur(); //remove focus from last clicked button
    flash(msg,0,false);
    // angular.element('#load').trigger('click');
    angular.element(document.querySelector('#load')).trigger('click');
  }

  var hideSpinner = function(){
    // angular.element('#unload').trigger('click');
    angular.element(document.querySelector('#unload')).trigger('click');
    // resetModal();
    console.log("Hide spinner");
  }

  var flash = function(msg, timeOut, isEnd){ 
  	// console.log("Flashing " +msg + " : timeout=" + timeOut);
    modalOptions.allowOk = false;
    modalOptions.isEnd = isEnd;
    modalOptions.loadingMessage =  msg ? msg : "Loading..."; 
        
    if (timeOut == 0 ){ 
      if (isEnd) {
        modalOptions.allowOk = true;
      }
    }
    else { 
      // console.log("Timing out! " + timeOut);
      //TODO timoeout not working when using hte variable passed
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
      else cb();
    } 
  }

  return {
    // resetModal: resetModal,
  	registerObserverCallback: registerObserverCallback,
  	showSpinner: showSpinner,
  	flash: flash,
  	flashSuccess: flashSuccess,
  	flashInfo: flashInfo,
  	flashFailure: flashFailure,
    flashWithCB: flashWithCB,
  	modalOptions: modalOptions
  };
})

/*
	DIRECTIVES
*/

.directive('initialization',['$rootScope',function($rootScope) {
	//this basically executes a timeout before broadcasting the "intialized string for activate_token"
	return {
		restrict: 'A',
		link: function($scope) {
			var to;
			var listener = $scope.$watch(function() {
				clearTimeout(to);
				to = setTimeout(function () {
					console.log('Leuzin: initialized');
					listener();
					$rootScope.$broadcast('initialized'); //TODO should I $emit this shit?
				}, 500);
			});
		}
	};
}])
.directive("lzspinner", function (ModalService) {
	return {
		restrict: 'E',
		scope: {
      		modalOpts: '=options'
    	},
		replace: 'true',
		templateUrl: "app/components/core/views/modal_spinner.html"/*,
		link: function(){
			angular.element('#unload').bind('click',function(){
				ModalService.resetModal();
				// console.log("Bound click...");
			});
		}*/
  	};
})

/*
	CONTROLLERS	
*/


.controller('AppCtrl', function($rootScope,$scope, AuthService, $state, $timeout, ModalService, $q){
  /* Synchronizers to $scope */
  ModalService.registerObserverCallback(function(){
    $rootScope.modalOptions = ModalService.modalOptions;
    // console.log("$scope modal options: " + JSON.stringify($scope.modalOptions) + "\n service: " + JSON.stringify(ModalService.modalOptions));
  });
  AuthService.registerObserverCallback(function(){
      $rootScope.session = AuthService.sessionInfo(); 
  });

  //Should this be here in top-controller?
  $scope.logout = function() {
    ModalService.showSpinner("Logging out...");
    AuthService.logout(JSON.stringify({ user: $scope.user }));
    $state.go('login');
    ModalService.flashSuccess('Logged out!', false);
  };

})

.controller('LoginCtrl', function($scope, AuthService, $state, ModalService, $rootScope) {
  $scope.user = {};  

  $scope.requestToken = function(){
    ModalService.showSpinner("Requesting new token...");
    if ($scope.user.username == undefined) {
      ModalService.flashFailure('Error! Please enter your username.',true);      
    }
    else {
      AuthService.requestToken($scope.user).then(function(msg) {
      // $scope.syncSession(); //Since LoginCtrl is nested in AppCtrl, we can call the function from AppCtrl. 
      // console.log("Yeah");
      ModalService.flashSuccess(msg,true);
    }, function(errMsg) {
      ModalService.flashFailure('Request failed: ' + errMsg,true);
    });

    }
  };

  $scope.login = function() {
    ModalService.showSpinner("Logging in...");
    AuthService.login(JSON.stringify({ user: $scope.user })).then(function(userData) {
      // $scope.syncSession(); //Since LoginCtrl is nested in AppCtrl, we can call the function from AppCtrl. 
      $rootScope.user = userData;
      ModalService.flashSuccess('Login success!', false);
      $state.go('dashboard');
    }, function(errMsg) {
      ModalService.flashFailure('Login failed: ' + errMsg,true);
    });
  };
})

.controller('TokenCtrl', ["$rootScope","$scope", "AuthService", "API_ENDPOINT", "$http", "$state", "$stateParams", "ModalService", "$timeout",
  function($rootScope, $scope, AuthService, API_ENDPOINT, $http, $state, $stateParams, ModalService, $timeout) {
  // console.log(JSON.stringify($stateParams));
  $scope.message = '';

  var loadNewToken = function(){
    // console.log("loading new token");
    ModalService.showSpinner("Setting new token for " + $stateParams.username + "...");
    //activate the new token to API so that it will have an expiry and can be used for log in later!
    AuthService.activateNewToken($stateParams).then(
      function(userData){
        // ModalService.flashSuccess("Login success!",true);    
        // $state.go('dashboard');
        $rootScope.user = userData;
        ModalService.flashWithCB("Access granted!",false, function(){$state.go('dashboard');});
      },
      function(result){
        $scope.message = result[0];
        // ModalService.flashFailure("Login failed: "+result, true); 
        ModalService.flashWithCB("Login failed: "+result, true, function(){$state.go('login');});        
      });
  }

  //listen to when the body directive has initialized
  //use $watch instead of orig $on?
  $scope.$watch('initialized', function() {
    // console.log("calling loadNewToken");
    loadNewToken();
  });
  
}])

.controller('RegisterCtrl', function($scope, AuthService, $state, ModalService) {
  $scope.user = {
    date_start : new Date()
  };

  //Angular UI for form
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
    // console.log(JSON.stringify($scope.user));
    ModalService.showSpinner("Requesting registration...");
    AuthService.register(JSON.stringify({ user: $scope.user })).then(function(msg) {
      console.log('Response = ' + JSON.stringify(msg));
      // ModalService.flash("Registered successfully. Please see your email for your access link.",0,true);
      // $state.go('login');
      ModalService.flashWithCB("Registration submitted! You will be emailed once your account is approved by an administrator.",true, function(){$state.go('login');});
    }, function(errMsg) {
      ModalService.flash("Registration failed: Error " + errMsg,0,true);
    });
  };
})

.controller('DashboardCtrl', function($rootScope,$scope, AuthService, API_ENDPOINT, $http, $state, $ocLazyLoad) {

})

;