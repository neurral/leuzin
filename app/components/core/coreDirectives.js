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

app.directive("subNav", function () {
	console.log="attempting subNav";
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: "app/components/core/navView.html"
  	};
});