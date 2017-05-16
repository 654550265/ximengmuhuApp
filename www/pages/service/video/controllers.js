angular.module('app.controllers')

.controller("videoCtrl", function($scope, $ionicTabsDelegate, VideoService, $ionicPopover, $ionicModal, $timeout, InitService) {

    $ionicTabsDelegate.showBar(false);
    $scope.currentAuthority = [];

    //检查  是否具有此权限
    function checkHasThisAuthority(superName, subName, subName2) {
        var result = false;
        if($scope.currentAuthority.length >= 1){
            var superAuthority = $scope.currentAuthority[0].Items.filter(function (val, index) {
                return val.Url == superName;
            });
            superAuthority = superAuthority[0].Items.filter(function (val, index) {
                return val.Url == subName;
            });
            result = superAuthority[0].Items.some(function (val) {
                return val.Url == subName2;
            });
        }
        return result;
    }

    $scope.authoritySendData = {
        userid: user.Id,
        uname: user.Name,
        depId: user.PeID,
        roleId: user.RoleId
    };
    $scope.GetUserFarmRoleList = function () {
        InitService.GetUserFarmRoleList($scope.authoritySendData).success(function (data) {
            authority = data.MyObject == null ? [] : data.MyObject ;
            localStorage.setItem('authority', JSON.stringify(authority));
        }).error(function (data) {
            $scope.showToast(data);
        });
    };
    $scope.GetUserFarmRoleList();

    $scope.farms = [];
    $scope.farm = {};
    var tempset = {};

    $scope.getFarms = function(){
        $scope.showLoad();
        VideoService.list().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true && data.MyObject.length > 0) {
                for (var i = 0; i < data.MyObject.length; i++) {
                    var Pens = data.MyObject[i].Pens;
                    for (var j = 0; j < Pens.length; j++) {
                        if(Pens[j].Cameras.length > 0){
                            Pens[j].Cameras.push({});
                            Pens[j].videos = chunk(Pens[j].Cameras, 2);
                        }
                    }
                }
                $scope.farms = data.MyObject;
                $scope.farm = $scope.farms[0];
                if(authority.length > 0){
                    for (var i = 0; i < authority.length; i++) {
                        if(authority[i].FarmId === $scope.farm.CommId){
                            $scope.currentAuthority.push(authority[i])
                            var Pens = $scope.farm.Pens;
                            for (var j = 0; j < Pens.length; j++) {
                                if(Pens[j].Cameras.length > 0){
                                    for (var k = 0; k < Pens[j].Cameras.length; k++) {
                                        if(checkHasThisAuthority('server','hk','update')){
                                            Pens[j].Cameras[k].canSet = true;
                                        }else{
                                            Pens[j].Cameras[k].canSet = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    $scope.getFarms();

    $scope.selectFarm = function($event) {
        $ionicPopover.fromTemplateUrl('./pages/service/video/farm-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
            $scope.popover.show($event);
        });
    };

    $scope.closePopover = function() {
        $scope.popover.remove();
    };

    $scope.openVideo = function(item) {
        window.camctrl.launch(item.CameraIp, item.CameraPort, item.UserName, item.Password, item.Tunel, function(msg) {});
    };

    $scope.changeFarm = function(item){
        $scope.currentAuthority = [];
        $scope.farm = item;
        $scope.popover.remove();
        if(authority.length > 0){
            for (var i = 0; i < authority.length; i++) {
                if(authority[i].FarmId === $scope.farm.CommId){
                    $scope.currentAuthority.push(authority[i]);
                    var Pens = $scope.farm.Pens;
                    for (var j = 0; j < Pens.length; j++) {
                        if(Pens[j].Cameras.length > 0){
                            for (var k = 0; k < Pens[j].Cameras.length; k++) {
                                if(checkHasThisAuthority('server','hk','update')){
                                    Pens[j].Cameras[k].canSet = true;
                                }else{
                                    Pens[j].Cameras[k].canSet = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    $scope.showSetting = function(item){
        tempset = angular.copy(item);
        $ionicModal.fromTemplateUrl('./pages/service/video/setting.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.settingModal = modal;
            $scope.settingModal.show();
            $scope.setting = item;
        });
    };

    $scope.hideSetting = function(){
        $scope.setting.Alias = tempset.Alias;
        $scope.setting.CameraType = tempset.CameraType;
        $scope.setting.PenId = tempset.PenId;
        $scope.settingModal.remove();
    };

    $scope.saveSetting = function(){
        $scope.showLoad();
        VideoService.setVideoInfo($scope.setting).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.settingModal.remove();
                $scope.getFarms();
                $timeout(function(){
                    $scope.showToast("保存成功");
                }, 500);
            } else {
                $scope.showToast("保存失败");
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

});
