app.controller("loginController", function ($rootScope, $scope, $location, $http) {


     $rootScope.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    $scope.isOrgasaction=false;
    $scope.isCustomer=false;
    $rootScope.ethAddress="0x0";
    $rootScope.customername="";
    $rootScope.isCustomerUser = false;
    $rootScope.isOrgasactionUser = false;

    $scope.login = function () {

        if($scope.username == null || $scope.password == null || $scope.category == null){
            alert("Enter valid username and password");
            return;
        } else {
            $http.post("dblogin", {
                                  params: {
                                    username: $scope.username,
                                    password: $scope.password,
                                    category: $scope.category
                                  }
            }).then(function(response) {
                console.log(response.data.length);
                if(response.data.length == 0){
                    alert("Sorry! Invalid username or password. Sign up first if you haven't!");
                } else{
                    $rootScope.ethAddress = response.data[0].ethaddress;
                    $rootScope.customername = response.data[0].name;


                    //initiated contract after db login
                    $rootScope.web3.personal.unlockAccount($rootScope.ethAddress, response.data[0].password);
                    $rootScope.kycContract = $rootScope.web3.eth.contract(abi);
                    $rootScope.deployedContract = $rootScope.kycContract.new({
                        data: binaryData,
                        from: $rootScope.web3.eth.accounts[0],
                        gas: 4700000
                    });
                    $rootScope.contractInstance = $rootScope.kycContract.at(contractAddress);


                    var verifyAccount;
                    if($scope.category == "ORG"){
                        verifyAccount = $rootScope.contractInstance.checkOrganization.call($scope.username);
                        $rootScope.isOrgasactionUser = true;
                    } else if($scope.category == "CUST"){
                        verifyAccount = $rootScope.contractInstance.checkCustomer.call($scope.username);
                        $rootScope.isCustomerUser = true;
                    }

                    if(verifyAccount == "0x0000000000000000000000000000000000000000"){
                            if($scope.category == "ORG"){
                                var check = $rootScope.contractInstance.registerOrganisation.sendTransaction($rootScope.ethAddress, $scope.username, $rootScope.customername, $scope.category, {
                                    from: $rootScope.web3.eth.accounts[0],
                                    gas: 4700000
                                });

                                verifyAccount = $rootScope.contractInstance.checkOrganization.call($scope.username);

                            } else if($scope.category == "CUST"){
                                var check = $rootScope.contractInstance.registerCustomer.sendTransaction($rootScope.ethAddress, $scope.username, $rootScope.customername, {
                                    from: $rootScope.web3.eth.accounts[0],
                                    gas: 4700000
                                });

                                verifyAccount = $rootScope.contractInstance.checkCustomer.call($scope.username);
                                
                            }
                    }
                    
                    if(verifyAccount == $rootScope.ethAddress){
                        var loginValue = $rootScope.contractInstance.viewCustomer.call($rootScope.ethAddress);
                        console.log(loginValue);
                        $rootScope.customername = loginValue[0];
                        $rootScope.file = loginValue[2];
                        $rootScope.gender = loginValue[3];
                        $rootScope.nationality = loginValue[4];
                       
                        success();
                    } else {
                        alert("Sorry! Invalid username or password. Sign up first if you haven't!");
                    }

                } 
            });
        }  
        
    };

    function success() {
        $rootScope.loggedIn = true;
        $rootScope.loggedUser = $scope.username;

        //var back = $location.search().back || "";
        if($rootScope.isOrgasactionUser){
            $location.url("/requestkyc");
        } else if($rootScope.isCustomerUser) {
            $location.url("/dashboard");
        }
        
    }

    function failure() {
        $rootScope.loggedIn = false;
    }

    $scope.registration = function (){

        if($scope.orgusername == null || $scope.orgusername == "" || $scope.orgpassword == null || $scope.orgpassword == "" || $scope.orgname == null || $scope.orgname == ""){
            alert("Enter valid details \nUsername \nSelect category \nCustomer/Organization name \npassoword");
            return;
        }

        $http.post("dbregister", {
              params: {
                username: $scope.orgusername,
                password: $scope.orgpassword
              }
            }).then(function(response) {
                console.log(response.data);
                if(response.data.length == 0){

                    if($scope.isOrgasaction){
                        $scope.category = "ORG";
                    } else {
                        $scope.category = "CUST";
                    }

                    var accountAddress = $rootScope.web3.personal.newAccount($scope.orgpassword);
                    $http.post("dbupdate", {
                                  params: {
                                    username: $scope.orgusername,
                                    password: $scope.orgpassword,
                                    ethaddress: accountAddress,
                                    category: $scope.category,
                                    name: $scope.orgname
                                  }
                    }).then(function(response) {
                            console.log("update result");
                            alert($scope.orgname+" customer account successfully created");
                     });

                } else {
                    alert("Unable to process, "+$scope.orgname+" account already register.");
                }
                
        });
        
    }

    
    $scope.onSelectCategory = function(){
        if($scope.orgcategory=="ORG"){
            $scope.isOrgasaction=true;
            $scope.isCustomer=false;
        } else if($scope.orgcategory=="CUST"){
            $scope.isOrgasaction=false;
            $scope.isCustomer=true;
        }  
    }

});

