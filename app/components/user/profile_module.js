// angular.module('userModule')

angular.module('leuzin')

.directive("userprofile", function (ModalService) {
	return {
		restrict: 'E',
		scope: {
      		// modalOpts: '=options'
    	},
		replace: 'true',
		templateUrl: "app/components/user/profile_module.html"/*,
		link: function(){
			angular.element('#unload').bind('click',function(){
				ModalService.resetModal();
				// console.log("Bound click...");
			});
		}*/
  	};
})

.controller("UserProfileCtrl", function(){
	
})
;

console.log('profile_module.js here!');