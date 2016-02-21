var app = angular	.module('leuzin');


/**
	TODO remove, replaced with ng-view
*/
// app.directive("subApp", function () {
// 	return {
// 		restrict: 'AE',
// 		replace: 'false',
// 		template: '<h3>Component</h3>'
// 		// template: function(app){
// 			// return app
// 		// }
// 		//templateUrl: "app/components/core/login.html"
//   	};
// });

app.directive("sidebar", function(){
	return {
		restrict: 'AE',
		replace: 'true',
		// template: function(sideBarFactory){}, //TODO create a factory to create a app-dependent sidebar
		templateUrl:"app/components/core/views/sidebar.html"
	};
})