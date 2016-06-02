angular.module('leuzin')

.service("ModalService",function($timeout,$window){
	var observerCBs = [];
	var registerObserverCallback = function(callback){
		observerCBs.push(callback);
	};
	var notifyObservers = function(){
		angular.forEach(observerCBs, function(callback){
      // console.log("Notifying...");
			callback();
		});
	};

  var modalOptions = {
      loadingMessage: "Loading...",
      allowOk: false,
      title: "",
      isEnd: false,
      alertType: '',
      icon: 'glyphicon-refresh spinning'
  };

  // var resetModal = function(){
  // 	this.modalOptions = {
  //     loadingMessage: "Loading...",
  //     allowOk: false,
  //     title: "",
  //     isEnd: false,
  //     alertType: '',
  //     icon: 'glyphicon-refresh spinning'
  // };
  //   notifyObservers();
  // };	

  var showSpinner = function(msg){
    console.log("Show spinner: " + msg);
    $window.document.activeElement.blur(); //remove focus from last clicked button
    flash(msg,0,false);
    // angular.element('#load').trigger('click');
    angular.element(document.querySelector('#load')).trigger('click');
  }

  var hideSpinner = function(){
    // angular.element('#unload').trigger('click');
    angular.element(document.querySelector('#unload')).trigger('click');
    // resetModal();
    console.log("Hide spinner");
  }

  var flash = function(msg, timeOut, isEnd){ 
  	// console.log("Flashing " +msg + " : timeout=" + timeOut);
    modalOptions.allowOk = false;
    modalOptions.isEnd = isEnd;
    modalOptions.loadingMessage =  msg ? msg : "Loading..."; 
        
    if (timeOut == 0 ){ 
      if (isEnd) {
        modalOptions.allowOk = true;
      }
    }
    else { 
      // console.log("Timing out! " + timeOut);
      //TODO timoeout not working when using hte variable passed
      $timeout(function(){hideSpinner()},timeOut);
    }
    notifyObservers();
  }

  //terminal (ending) flashes
  var flashSuccess = function(msg,withOK){
  	// modalOptions.alertType='success';
  	// modalOptions.icon='glyphicon-ok';
  	flash(msg,(withOK ? 0 : 2000),true);
  }
  var flashFailure = function(msg,withOK){	
  	// modalOptions.alertType='danger';
  	// modalOptions.icon='glyphicon-remove';
  	flash(msg,(withOK ? 0 : 2000),withOK);

  }
  var flashInfo = function(msg,withOK){
  	flash(msg,(withOK ? 0 : 2000),withOK);
  }
  var flashWithCB = function(msg,withOK,cb){
    flash(msg,(withOK ? 0 : 2000),withOK);
    if (cb){
      if (withOK) {
        //bind the callback (e.g. a #state.go after the flash) to the OK button
        angular.element('#unload').bind('click',cb);
      }
      else cb();
    } 
  }

  return {
    // resetModal: resetModal,
  	registerObserverCallback: registerObserverCallback,
  	showSpinner: showSpinner,
  	flash: flash,
  	flashSuccess: flashSuccess,
  	flashInfo: flashInfo,
  	flashFailure: flashFailure,
    flashWithCB: flashWithCB,
  	modalOptions: modalOptions
  };

});