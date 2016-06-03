angular.module('leuzin')
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
});