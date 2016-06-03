angular.module("leuzin")


.constant('APP_PROPERTIES',{
	name: 'leuzin',
	display_name: 'Leuzin'
})
.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated'
})
.constant('API_ENDPOINT', {
	url: 'https://neurral-nacc-0.herokuapp.com'
	// url: 'http://localhost:3000'
	// url: 'mock'
})

/* mappings for modules available in neurral */
// .constant('MODULES', {
	
// })

;