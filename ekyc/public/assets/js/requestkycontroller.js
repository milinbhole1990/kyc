
app.controller("requestkyController", function ($rootScope, $scope, $location) {

    if($rootScope.loggedIn){
        $scope.loggedUser = $rootScope.loggedUser;
    }else{
        //$location.url("/login?back=" + $location.url());
    }
    $scope.scrollTo = function(id) {
      $location.path(id);
   }
});
