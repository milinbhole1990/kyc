var app = angular.module("kycApp", ["ngRoute"]);

app.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
}]);

app.config(function ($routeProvider) {
    $routeProvider
        // login view definition
        .when("/login", {
            controller: "loginController",
            templateUrl: "login.html"
        })
        // dashboard app view definition
        .when("/dashboard", {
            controller: "dashboardController",
            templateUrl: "dashboard.html"
        })
        // requestkyc app view definition
        .when("/requestkyc", {
            controller: "requestkyController",
            templateUrl: "request_kyc.html"
        })
        // requestkyc app view definition
        .when("/updatekychistory", {
            controller: "updateKycHistoryController",
            templateUrl: "updatekyc_history.html"
        })
        // logout definition
        .when("/logout", {
            controller: "logoutController",
            templateUrl: "logout.html"
        })
        
        .otherwise({
            redirectTo: "/login"
        });
});

