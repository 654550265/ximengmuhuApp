angular.module('app.controllers').controller('serviceCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, $ionicTabsDelegate, InitService, AnalyticsService) {

    AnalyticsService.trackView('服务页面');

    $ionicTabsDelegate.showBar(true);
    /*s获取权限对象*/

    /*头导航的切换*/
    $scope.showHeader = false;
    if (readServiceTimes <= 0) {
        $scope.serviceHelp = true;
        $scope.showHeader = true;
        $ionicTabsDelegate.showBar(false);
    } else {
        $scope.serviceHelp = false;
    }

    $scope.serviceHelpStep = function() {
        $scope.serviceHelp = false;
        $scope.showHeader = false;
        $ionicTabsDelegate.showBar(true);
        readServiceTimes++;
        localStorage.setItem('readServiceTimes', readServiceTimes);
    };
    $scope.showAModul = function() {
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
    };
    $scope.showBModul = function() {
        $scope.showA = false;
        $scope.showB = true;
        $scope.showC = false;
    };
    $scope.showCModul = function() {
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
    };
    $scope.isManage = true;

    $scope.notice = function() {
        $scope.showToast("此功能暂未开通！");
    };


    /*标准管理  农事添加  饲料页面页面*/
    $ionicModal.fromTemplateUrl('./pages/service/fodder.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.fodderModal = modal;
    });
    $scope.hideFodderModal = function() {
        $scope.fodderModal.hide();
    };

    /*apps管理  页面*/
    $ionicModal.fromTemplateUrl('./pages/service/apps-management.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.appsManagementAddModal = modal;
    });
    $scope.shwoAppsManagementAdd = function() {
        $scope.showA = true;
        $scope.appsManagementAddModal.show();
    };
    $scope.hideAppsManagementAdd = function() {
        $scope.appsManagementAddModal.hide();
    };

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
        console.log($ionicSlideBoxDelegate.currentIndex());
    };
});

