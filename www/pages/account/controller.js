angular.module("app.controllers")
.controller("AccountCtrl",function($scope){
    $scope.UserMessage=UserMessage;
})
.controller("AccountSubCtrl",function($scope,$ionicTabsDelegate,$ionicModal,setFarmService,$state){
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });

    //单击隐藏模态
    $scope.hideModal=function(){
        $scope.searchDetailsModal.remove();
    };
    $scope.setFarm=UserMessage;
    //显示牧场设置信息模态
    $scope.gotoSetFarm=function(){
        $ionicModal.fromTemplateUrl('./pages/account/setFarmList.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.searchDetailsModal = modal;
            $scope.searchDetailsModal.show();
        });
    };
    $scope.setFarmMessage={
        uid:UserMessage.Id,
        sysRoleId:UserMessage.RoleId,
        sysDeptId:UserMessage.SysDeptId
    };
    $scope.setFarmSave=function(){
        setFarmService.setFarmSave($scope.setFarmMessage).success(function(res){
            if(res.Status==true){
                var User=UserMessage;
                User.CommName=$scope.setFarmMessage.commName;
                User.MobileTel=$scope.setFarmMessage.mobileTel;
                User.Address=$scope.setFarmMessage.address;
                localStorage.setItem("userMessage",JSON.stringify(User));
                $scope.searchDetailsModal.remove();
            }
        }).error(function(){

        });
    }
    //退出登录
    $scope.checkOut=function(){
        $scope.logout();
        // localStorage.removeItem("userMessage");
        //
        // $state.go("login");
    }
});
