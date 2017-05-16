angular.module('starter.controllers', [])
    .controller('MessageCtrl', function ($scope) {

    })
    .controller('FarmCtrl', function ($scope,$state) {
        if(window.localStorage.firstrun==="false"){
            $state.go("login");
        }
    })
  .controller('loginCtrl', function ($scope) {
  })
    .controller('ServiceCtrl', function ($scope) {
    })
    .controller('AccountCtrl', function ($scope) {

    });
