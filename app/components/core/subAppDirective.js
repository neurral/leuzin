angular.module("leuzin")

.directive("subApp", function () {
	return {
		restrict: 'A',
		replace: 'false',
		template: '<h3>Hello World!</h3>'
  	};
});