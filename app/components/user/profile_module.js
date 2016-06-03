// angular.module('userModule')

angular.module('leuzin')
.controller("UserProfileCtrl", function($scope){
	$scope.opened = {};

	$scope.open = function($event, elementOpened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened[elementOpened] = !$scope.opened[elementOpened];
	};

})
;

console.log('Leuzin: profile_module.js here!');