// var app = angular.module("leuzin")

app.controller("AppController", function (CoreServices,Session) {
	CoreServices.say();
	Session.get().then(function(response){
		console.log(JSON.stringify(response.data));
	});
	
})

.controller("IndexController", function () {

})

.controller('LoginController', function () {

})

.controller('HomeController', function() {

});