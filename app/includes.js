
/**
	Download all dependents
	//The callback function is called when (baseUrl)/path/to/scriptfilename is loaded.
    //If the file calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".

*/

requirejs(
	[
		// "components/core/_test",
		// "components/core/_test2",
		"components/core/appController"
	], 
	function() {
    	console.log("requirement files loaded!");
	}
);
