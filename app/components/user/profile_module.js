// angular.module('userModule')

angular.module('leuzin')

.service("UserService",["$q", "$http", "APP_PROPERTIES", function($q, $http, APP_PROPERTIES){
	var update = function(user) {
		console.log(user);
		return $q(function(resolve, reject) {
			$http.patch(APP_PROPERTIES.api + '/users/'+user.username+'/update', user).then(
			function(result) {
				console.log("UpdateData: " + JSON.stringify(result));
				if (result.status = 200) {
					resolve(result.data);
				}
				else {
					reject("Unknown error");
				}
			},
			function(result){
				console.log(JSON.stringify(result));
				reject(result.data.errors);
			});
		});
	};

	return {
		update: update
	};
}])

.controller("UserProfileCtrl", function($rootScope,$scope,UserService){
	// $scope.user = $rootScope.user;
	$scope.opened = {};
	$scope.open = function($event, elementOpened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened[elementOpened] = !$scope.opened[elementOpened];
	};

	$scope.updateUser = function() {
		UserService.update($scope.user).then(function(updatedUserData) {
			$rootScope.user = updatedUserData;
			return;
		}, function(errMsg) {
			return (errMsg);
		});
	}
})
;

console.log('Leuzin: profile_module.js here!');