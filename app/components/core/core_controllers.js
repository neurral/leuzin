angular.module('leuzin')

.controller('LoginCtrl', function($scope, AuthService, $state) {
  $scope.user = {
    username: '',
    password: ''
  };  

  $scope.login = function() {
    $scope.user = {
      user : {
        username : $scope.user.username,
        password : $scope.user.password
      }
    }
    AuthService.login($scope.user).then(function(msg) {
      $state.go('dashboard');
    }, function(errMsg) {
      console.log('Login failed: ', errMsg);
      alert('Login failed: ', errMsg);
    });
  };
});