angular.module("app.controllers")
.controller('messCtrl', function (MessService,$scope,$state,$timeout){
    //获取省市
    MessService.getProvince().success(function(res){
        $scope.province=res.MyObject;
    }).error(function(){

    });
    $scope.member={};
    $scope.getCity=function(){
        MessService.getCity({
            pid:$scope.member.qi
        }).success(function(res){
            $scope.city=res.MyObject;
        }).error(function(){

        });
    }
    $scope.getSuMu=function(){
        MessService.getCity({
            pid:$scope.member.sumu
        }).success(function(res){
            $scope.sumu=res.MyObject;
        }).error(function(){

        });
    }
    $scope.notmess=function(){
        $state.go("login");
    }
    $scope.mess={
        tel:get()
    }
    function get(){
        var reg=/^1[34578]\d{9}$/;
        if(reg.test(UserMessage.RoleNameAll)){
            $scope.dis=true;
            return UserMessage.RoleNameAll;
        }else{
            $scope.dis=false;
            return "";
        }
    }
    $scope.PostFarmName=function(){
        MessService.PostFarm({
            uid:UserMessage.Id,
            sysRoleId:UserMessage.RoleId,
            sysDeptId:UserMessage.SysDeptId,
            myName:$scope.mess.name,
            province:$scope.member.qi,
            city:$scope.member.sumu,
            county:$scope.member.sumus,
            mobileTel:$scope.mess.tel,
            commName:$scope.mess.farmName
        }).success(function(res){
            if(res.Status==true){
                $scope.showLoad();
                $timeout(function() {
                    $scope.hideLoad();
                    $state.go("tab.farm");
                }, 1000);
            }
        }).error(function(){
        });
    }
});
