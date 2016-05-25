angular.module('leuzin')

.controller('AppCtrl', function($scope, AuthService, $state, $timeout, ModalService){
  // TODO add obecjt for modal spinner
  ModalService.registerObserverCallback(function(){
    $scope.modalOptions = ModalService.modalOptions;
    // console.log("$scope modal options: " + JSON.stringify($scope.modalOptions) + "\n service: " + JSON.stringify(ModalService.modalOptions));
  });
  
  $scope.syncSession = function(){
      //lets add the session info to the AppCtrl Scope, which is accessible to all controllers
      //we need these $scope vars because we needed variables for ng-if in view. We cant use AuthService for that.
      $scope.session = AuthService.sessionInfo();
      $scope.session.isAuthenticated = AuthService.isAuthenticated();
  }

  //Should this be here?
  $scope.logout = function() {
    AuthService.logout();
    $scope.syncSession();
    $state.go('login');
  };
})

.controller('LoginCtrl', function($scope, AuthService, $state, ModalService) {
  $scope.user = {};  

  $scope.login = function() {
    ModalService.showSpinner("Logging in...");
    $scope.user = {
        user : $scope.user
    }
    AuthService.login($scope.user).then(function(msg) {
      $scope.syncSession(); //Since LoginCtrl is nested in AppCtrl, we can call the function from AppCtrl. 
      $state.go('dashboard');
      ModalService.flashSuccess('Login success!',false);
    }, function(errMsg) {
      console.log('Login failed: ', errMsg);
      // alert('Login failed: ', errMsg);
      ModalService.flashFailure('Login failed.',true);
    });
  };
})

.controller('RegisterCtrl', function($scope, AuthService, $state, ModalService) {
  $scope.user = {};

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
    $scope.user = {
      user : $scope.user 
    };
    // console.log(JSON.stringify($scope.user));
    ModalService.showSpinner("Requesting registration...");
    AuthService.register($scope.user).then(function(msg) {
      console.log('Response = ' + JSON.stringify(msg));
      ModalService.flash("Registered successfully. Please see your email for your username and password.",0,true);
      $state.go('login');
    }, function(errMsg) {
      ModalService.flash("Registration failed.",0,true);
    });
  };
})

.controller('DashboardCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  // $scope.destroySession = function() {
  //   AuthService.logout();
  // };

  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };
  
  $scope.syncSession();
});

;