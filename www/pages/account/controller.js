angular.module("app.controllers")
.controller("AccountCtrl",function($scope,$ionicModal){

})
.controller("AccountSubCtrl",function($scope,$ionicTabsDelegate){
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
});
