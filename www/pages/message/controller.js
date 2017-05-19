angular.module("app.controllers")
.controller('MessageCtrl', function ($scope,$ionicModal,$state) {
    $scope.gotoBooking=function(){
        $state.go("Announcements");
    }
});
