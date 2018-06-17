
app.controller("updateKycHistoryController", function ($rootScope, $scope, $location) {

    if($rootScope.loggedIn){
        $scope.loggedUser = $rootScope.loggedUser;

        var viewValue = $rootScope.contractInstance.viewCustomer.call($rootScope.ethAddress);
        $scope.custName = $rootScope.customername;
        $scope.file = viewValue[2];
        $scope.gender = viewValue[3];
        $scope.nationality = viewValue[4];

        $scope.isHistoryAvailable = false;
        $scope.history=[];
        var historyLength = $rootScope.contractInstance.lengthKYCUpdateHistory.call($rootScope.ethAddress);

        for (var i=0; i<historyLength; i++) {
            $scope.isHistoryAvailable = true;
        	var historyValue = $rootScope.contractInstance.getKYCUpdateHistory.call($rootScope.ethAddress,i);

        	 var obj = {
         		customerName: historyValue[0],
         		date: new Date(historyValue[1]*1000),
         		fileHash: 'http://localhost:8080/ipfs/'+historyValue[2],
         		gender: historyValue[3],
         		nationality: historyValue[4],
        	};
	      	$scope.history.push(obj);
	    }


    }else{
        //$location.url("login");
    }

    $scope.scrollTo = function(id) {
      $location.path(id);
    }


});
