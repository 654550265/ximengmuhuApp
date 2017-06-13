angular.module("app.controllers")
.controller('ServiceCtrl', function ($scope,$ionicTabsDelegate) {

})
.controller("ServiceSunCtrl",function(OutService,$scope,$ionicTabsDelegate,$timeout,$state){
    //显示和隐藏底部的操作栏
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    OutService.getFeedList({
        sysRoleId:UserMessage.RoleId,
        sysDeptId:UserMessage.SysDeptId
    }).success(function(res){
        if(res.Status==true) {
            $scope.FeedFootList = res.MyObject;
        }else{
            $scope.showToast(res.Message);
        }
    }).error(function(){

    });
    //单位
    OutService.GetFeedUnit({}).success(function(res){
        if(res.Status==true){
            $scope.Unit=res.MyObject;
        }
    }).error(function(){

    })
    //生成单号
    function getTime(){
        var date = new Date();
        var dan=moment(date).format('YYMMDDhhmmss');
        return dan;
    }
    $scope.danHao=getTime();
    //生成日期
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.Feed={
        FeedNo:$scope.danHao
    };
    $scope.checkText=function(){
        $scope.jiaFa=parseInt($scope.Feed.FeedNum)*parseInt($scope.Feed.FeedPrice);
        if(!$scope.jiaFa){
            $scope.jiaFa=0;
        }
    }
    $scope.Preservation=function(){
        var reg=/^[1-9]{1}\d*(\.\d{1,2})?$/;
        if($scope.Feed.provider==undefined){
            $scope.showToast("请输入供应商");
        }else if($scope.Feed.FeedName==undefined){
            $scope.showToast("请选择饲料的名称");
        }else if($scope.Feed.FeedNum==undefined){
            $scope.showToast("请输入购买的数量");
        }else if($scope.Feed.FeedUnits==undefined){
            $scope.showToast("请选择需要购买的单位");
        }else if($scope.Feed.FeedPrice==undefined){
            $scope.showToast("请输入单价");
        }else if(!reg.test($scope.Feed.FeedPrice)){
            $scope.showToast("请输入两位小数的纯数字");
        }else{
            OutService.BuyFeedFood($scope.Feed)
            .success(function(res){
                if(res.Status==true){
                    $scope.showLoad();
                    $timeout(function(){
                        $scope.hideLoad();
                        $state.go("tab.service");
                    },1000);
                }
            }).error(function(){

            })
        }
    }
});
