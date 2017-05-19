angular.module('app.controllers', [])
    .controller('CommonCtrl', function ($scope,$ionicLoading,$ionicPopup) {
      $scope.showLoad = function() {
        $ionicLoading.show({
          template: "<ion-spinner icon='ios'></ion-spinner>"
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 10000);
      };
      $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
          title: '消息',
          template: msg,
          okText: '确定'
        });
      };
      $scope.hideLoad = function() {
        $ionicLoading.hide();
      };
      $scope.showToast = function(msg) {
        if (window.cordova) {
          $cordovaToast.showShortCenter(msg).then(function(success) {

          }, function(error) {

          });
        } else {
          $scope.showAlert(msg);
        }
      };


        var firstrun = false;
        localStorage.setItem('firstrun', firstrun);

    })
    .controller('ServiceCtrl', function ($scope) {

    })
    .controller('AccountCtrl', function ($scope) {

    });



