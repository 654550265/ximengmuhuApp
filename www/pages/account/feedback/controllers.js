angular.module('app.controllers').controller('feedBackCtrl',function ($scope, $ionicTabsDelegate ,AccountService,$ionicHistory) {
    $ionicTabsDelegate.showBar(false);

    $scope.sedData = {
        uname: user.Name
    };

    $scope.SaveCommentData = function () {
        console.log($scope.sedData);
        if($scope.sedData.content == '' || $scope.sedData.content == null){
            $scope.showToast('请输入您的意见和建议后再提交');
            return false;
        }
        AccountService.SaveCommentData($scope.sedData).success(function (data) {
            if(data.Status == true){
                $scope.showToast('提交成功！');
                $ionicHistory.goBack(-1);
                $scope.content = null;
            }
        }).error(function (data) {
            $scope.showToast(data.Message);
        });
    }

});