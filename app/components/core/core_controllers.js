angular.module('leuzin')

.controller('AppCtrl', function($scope, AuthService, $state){
  $scope.showSpinner = function(msg){
    if (msg)
      $scope.loadingMessage = msg;
    else
      $scope.loadingMessage = "Loading...";
    angular.element('#load').trigger('click');
  }
  $scope.hideSpinner = function(){angular.element('#unload').trigger('click');}

  $scope.syncSession = function(){
      //lets add the session info to the AppCtrl Scope, which is accessible to all controllers
      //we need these $scope vars because we needed variables for ng-if in view. We cant use AuthService for that.
      $scope.session = AuthService.sessionInfo();
      $scope.session.isAuthenticated = AuthService.isAuthenticated();
      // angular.element('#load').trigger('click');
  }

  $scope.logout = function() {
    AuthService.logout();
    $scope.syncSession();
    $state.go('login');
  };
})

.controller('LoginCtrl', function($scope, AuthService, $state) {
  $scope.user = {
    username: '',
    password: ''
  };  

  $scope.login = function() {
    $scope.showSpinner("Logging in...");
    $scope.user = {
      user : {
        username : $scope.user.username,
        password : $scope.user.password
      }
    }
    AuthService.login($scope.user).then(function(msg) {
      $scope.syncSession(); //Since LoginCtrl is nested in AppCtrl, we can call the function from AppCtrl. 
      $state.go('dashboard');
      $scope.hideSpinner();
    }, function(errMsg) {
      console.log('Login failed: ', errMsg);
      // alert('Login failed: ', errMsg);
      $scope.hideSpinner();
    });
    
  };
})

.controller('RegisterCtrl', function($scope, AuthService, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
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