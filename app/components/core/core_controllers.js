angular.module('leuzin')


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
    AuthService.logout();
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

//Test loading a profile
  // var loadProfile = function(){
  //   console.log('Loading profile.js');
  //   $scope.$parent.loadJS('app/components/user/profile_modulse.js', 'text/javascript', 'utf-8')
  //   .then(function(script){
  //     console.log('Loaded js!');
  //   });
  // }

  // loadProfile();
  // $ocLazyLoad.load('UserModule');
  //     // Example of ocLoader event, use this somewhere e.g.g controller 
  //   // ocLazyLoad.moduleLoaded, ocLazyLoad.moduleReloaded, ocLazyLoad.componentLoaded, ocLazyLoad.fileLoaded
  //   $scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
  //     console.log('module loaded', module);
  //   });

})
;

