var app = angular.module('leuzin');


/**
	TODO remove, replaced with ng-view
*/
// app.directive("subapp", function () {
// 	return {
// 		restrict: 'AE',
// 		replace: 'false',
// 		// template: '<h3>Component</h3>'
// 		// template: function(app){
// 			// return app
// 		// }
// 		templateUrl: "app/components/core/views/login.html"
//   	};
// });

app.directive("navigation", function () {
	return {
		restrict: 'E',
		replace: 'true',
		// template: '<h3>Component</h3>'
		// template: function(app){
		// 	return app
		// }
		templateUrl: "app/components/core/views/navbar.html"
  	};
});