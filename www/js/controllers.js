angular.module('app.controllers', [])
.controller('CommonCtrl', function ($scope, $ionicLoading, $state,$ionicPopup,$timeout,$cordovaToast) {
    $scope.showLoad = function () {
        $ionicLoading.show({
            template: "<ion-spinner icon='ios'></ion-spinner>"
        });
        $timeout(function () {
            $ionicLoading.hide();
        }, 10000);
    };
    $scope.showAlert = function (msg) {
        var alertPopup = $ionicPopup.alert({
            title: '消息',
            template: msg,
            okText: '确定'
        });
    };
    $scope.hideLoad = function () {
        $ionicLoading.hide();
    };
    $scope.showToast = function (msg) {
        if (window.cordova) {
            $cordovaToast.showShortCenter(msg).then(function (success) {

            }, function (error) {

            });
        } else {
            $scope.showAlert(msg);
        }
    };
    $scope.logout=function() {
        $ionicPopup.show({
            template: '<div class="content">确定退出？</div>',
            title: '消息',
            scope: $scope,
            buttons: [{
                text: '取消',
                type: 'button-balanced',
            }, {
                text: '<b>确定</b>',
                type: 'button-balanced',
                onTap: function(e) {
                    localStorage.clear();
                    localStorage.setItem('weburl', weburl);
                    $state.go("login");
                }
            }]
        });
    };
})
.controller('ServiceCtrl', function ($scope) {

})
.controller('AccountCtrl', function ($scope) {

})
.controller('ServiceCtrl', function ($scope) {

})
.controller('AccountCtrl', function ($scope) {

})
.controller('FarmCtrl', function ($scope, $state) {
    // if(window.localStorage.firstrun === "false" || window.localStorage.firstrun === undefined) {
    //   $state.go("login");
    // }
});



