app.controller("logoutController", function ($rootScope, $location, $scope) {
      	
      	$rootScope.loggedIn = false;
         $scope.login = function() {
                $location.path("login");
         }
   
});
