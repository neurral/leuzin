// var app = angular.module("leuzin")

// app.controller("AppController", function (CoreServices,AUTH_EVENTS,sessionData) {
// 	var self = this;
// 	// // CoreServices.say();
// 	// Session.get().then(function(res){
// 	// 	self.session = res.data;
// 	// 	// console.log(JSON.stringify(res.data));
// 	// });
// 	console.log("trying appctrller");
// 	self.session = sessionData.data;
// 	console.log(JSON.stringify(sessionData.data));
// 	console.log("status: "+self.session.status);	
// });

app.controller("AppController", ['SessionLoader', function(SessionLoader) {     
	console.log("AppController running...");
	var self = this;
	var session = SessionLoader.reload();
	console.log(session);
}]);

app.controller('LoginController', function () {

});

app.controller('HomeController', function() {

});