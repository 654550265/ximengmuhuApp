angular.module("app.controllers")
    .controller('MessageCtrl', function ($scope, $ionicTabsDelegate,$state) {

    })
    .controller("MessageSubCtrl",function($scope, $ionicTabsDelegate,$ionicModal){
        $ionicTabsDelegate.showBar(false);

        //单击去通知公告详情
        $scope.gotoMoreText=function(){
            $ionicModal.fromTemplateUrl('./pages/message/AnnouncementsMore.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.searchDetailsModal = modal;
                if(!$scope.searchDetail){
                    $scope.searchDetailsModal.show();
                    $scope.searchDetail = true;
                }
            });
        }
        $scope.hideModal=function(){
            $scope.searchDetailsModal.hide();
        }
        $scope.$on("$ionicView.beforeLeave", function(event, data){
            $ionicTabsDelegate.showBar(true);
        });
        //单击显示已发布消息详情的模态
        $scope.gotoMoreAnn=function(){
            $ionicModal.fromTemplateUrl('./pages/message/BookingMessageMore.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.searchDetailsModal = modal;
                $scope.searchDetailsModal.show();
            });
        }
        //发布消息的模态
        $scope.gotoRelease=function(){
            $ionicModal.fromTemplateUrl('./pages/message/release.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.searchDetailsModal = modal;
                $scope.searchDetailsModal.show();
            });
        }
        //收到消息的详情模态
        $scope.gotoGetMessageMoreText=function(){
            $ionicModal.fromTemplateUrl('./pages/message/getMessageMore.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.searchDetailsModal = modal;
                $scope.searchDetailsModal.show();
            });
        }
        //预约通知的详情页面
        $scope.gotoMessOrder=function(){
             
        }
    });
