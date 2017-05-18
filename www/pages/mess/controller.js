angular.module("app.controllers")
.controller('messCtrl', function ($scope,$http,$state) {
  $scope.notmess=function(){
    $state.go("tab.farm");
  }
});
