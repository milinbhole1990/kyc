
app.controller("dashboardController", function ($rootScope, $scope, $location, $timeout) {

    $scope.onLoad = function(){
        if($rootScope.loggedIn){
            $scope.loggedUser = $rootScope.loggedUser;
            $scope.custName = $rootScope.customername;
            $scope.isSubmit = false;
            $scope.isUpdate = false;
            if($rootScope.file == ""){
                $scope.isSubmit = false;
                $scope.isUpdate = true;
            } else {
                $scope.isSubmit = true;
                $scope.isUpdate = false;
                $scope.kycSrc = "http://localhost:8080/ipfs/"+$rootScope.file;
                
            }
        }else{
            //$location.url("login");
        }
    }

    $scope.onLoad();
    

    $scope.scrollTo = function(id) {
      $location.path(id);
    }

   $scope.submitKyc = function(){
   		 console.log($rootScope.ethAddress+" : "+$rootScope.loggedUser+" : "+$rootScope.customername+" : "+$scope.file+" : "+$scope.gender+" : "+$scope.nationality+" : "+$scope.file);
   		 
         if($scope.file == null || $scope.gender == null || $scope.nationality == null || $scope.nationality == ""){
            alert("Fill all the below details \nEnter Nationality \nSelect Gender \nUpload File");
            return;
         } 

         if($scope.file.type == "image/jpeg" || $scope.file.type == "image/png"){
            //nothing
         } else {
            alert("Upload Only imgae file with type \njpeg \npng");
            return;
         }

         //IPFS file upoload
          var reader = new FileReader();
          reader.onloadend = function() {
            var ipfs = window.IpfsApi('localhost', 5001); // Connect to IPFS
            var buf = buffer.Buffer(reader.result);// Convert data into buffer
            ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
              if(err) {
                console.error(err);
                return;
              }
              var hash = result[0].hash;
              //var url = "http://localhost:8080/ipfs/"+hash;
              console.log("HASH : "+hash)
              //console.log("URL : "+url);
              //update new hash value
              $rootScope.file = hash;
              
              $scope.isSubmit = true;
              $scope.isUpdate = false;
                        //$scope.onLoad();
              $rootScope.gender = $scope.gender;
              $rootScope.nationality = $scope.nationality;
              $scope.kycSrc = "http://localhost:8080/ipfs/"+$rootScope.file;

              $scope.check = $rootScope.contractInstance.updateCustomer.sendTransaction($rootScope.ethAddress, $rootScope.loggedUser, $rootScope.customername, $scope.gender, $scope.nationality, hash, {
                    from: $rootScope.web3.eth.accounts[0],
                    gas: 4700000
              });  
              alert($rootScope.customername+" KYC Uploaded Successfully");
                        
            })

          }
          reader.readAsArrayBuffer($scope.file);
          $timeout(function() { 
                $scope.onLoad();
          }, 2000);
          //$scope.onLoad();
   }

   $scope.updateKyc = function(){
   		$scope.isSubmit = false;
        $scope.isUpdate = true;
   }

   $scope.fileUploadFinish = function(){
    
   }

});

