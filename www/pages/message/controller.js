angular.module("app.controllers")

.controller('MessageCtrl', function($scope, $ionicTabsDelegate, $state, MessageService) {

    $scope.items = MessageService.init();

    $scope.gotoList = function(item) {
        $state.go('tab.messageList', { type: item.type, name: item.name });
    };

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $ionicTabsDelegate.showBar(true);
    });

    $scope.$on("$ionicView.beforeLeave", function(event, data) {
        $ionicTabsDelegate.showBar(false);
    });
})

.controller("MessageListCtrl", function($scope, MessageService, $ionicTabsDelegate, $ionicModal, $stateParams, $ionicScrollDelegate) {
    //通知公告的数据请求
    var type = $stateParams.type;
    $scope.title = $stateParams.name;
    var page = 1;
    $scope.messages = [];
    $scope.list = function() {
        MessageService.list(page++, type).success(function(res) {
            if (res.Status == true) {
                $scope.messages = $scope.messages.concat(res.MyObject);
                $scope.messages.reverse();
                $ionicScrollDelegate.scrollBottom();
            }
        });
    }();

    $scope.loadHistory = function(){
        MessageService.list(page++, type).success(function(res) {
            if (res.Status == true && res.MyObject.length > 0) {
                res.MyObject.reverse();
                $scope.messages.unshift(res.MyObject);
            }else{
                page--;
            }
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.view = function(item) {
        $ionicModal.fromTemplateUrl('./pages/message/messageView.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.searchDetailsModal = modal;
            $scope.message = item;
            $scope.searchDetailsModal.show();
        });
    }

    $scope.hideModal = function() {
        $scope.searchDetailsModal.remove();
    }
})

.controller('MessageOrderCtrl', function($scope, $ionicTabsDelegate, $state, MessageService, $ionicScrollDelegate,$ionicModal,NewMessageService) {
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    $scope.data={
        uid:UserMessage.Id,
        sysroleId:UserMessage.RoleId,
        sysDepId:UserMessage.SysDeptId,
        istype:1,
        page:1,
        psize:5
    };
    MessageService.GetSaleOrderFeedBack($scope.data).success(function(res){
        if(res.Status==true){
            $scope.Orders=res.MyObject;
        }
    }).error(function(){

    });
    $scope.loadHistory=function(){
        $scope.canLoads=true;
        $scope.page=1;
        MessageService.GetSaleOrderFeedBack($scope.data).success(function(res){
            if(res.Status==true){
                $scope.Orders=res.MyObject;
            }
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function(){

        });
    };
    $scope.hideModal=function(){
        $scope.searchDetailsModal.remove();
    };
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.NowDate=getDate();
    $scope.gotoSendMessage=function(index){
        $ionicModal.fromTemplateUrl('./pages/message/OrderMessageList.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.searchDetailsModal = modal;
            $scope.searchDetailsModal.show();
        });
        $scope.OrderMessageList=$scope.Orders[index];
    };
    $scope.page=1;
    $scope.canLoads=true;
    $scope.loadMore=function(){
        MessageService.GetSaleOrderFeedBackJia($scope.page++).success(function(res){
            if(res.Status==true){
                for(var i=0;i<res.MyObject.length;i++){
                    $scope.Orders.push(res.MyObject[i]);
                }
                if(res.MyObject.length<5){
                    $scope.canLoads=false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }).error(function(){});
    }
});
