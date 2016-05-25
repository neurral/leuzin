angular.module('leuzin')

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