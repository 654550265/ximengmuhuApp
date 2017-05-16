angular.module('app.controllers')

.controller('accountCtrl', function($scope, $ionicModal, AccountService, $state, $timeout, $ionicTabsDelegate, $cordovaBarcodeScanner, MessageService, $cordovaSms, $ionicPopup, VersionService, FarmService, AnalyticsService) {

    AnalyticsService.trackView('我的页面');

    $ionicTabsDelegate.showBar(true);
    $scope.userInofromation = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        Id: user.Id
    };
    $scope.isShow = false;
    $scope.devOn = devOn;
    // if(isIOS){
    //     $scope.isShow = false;
    // }

    $scope.goToMyCard = function() {
        AccountService.getPersonalinformation($scope.userInofromation).success(function(data) {
            var useInfo = data.MyObject;
            if (data.Status == true) {
                $scope.showMyInformation = {
                    avatar: uploadurl + useInfo.pRemark,
                    myname: useInfo.pmyname,
                    PNO: user.PNO
                };
                if (useInfo.pRemark == null) {
                    $scope.showMyInformation.avatar = "img/user.png";
                }
            }
        }).error(function() {
            console.log("没获取到信息");
        });
    };
    $scope.goToMyCard();

    /*扫一扫*/
    $scope.cur = {
        farm: null
    };
    $scope.farms = [];
    $scope.scan = function() {
        document.addEventListener("deviceready", function() {
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    if (barcodeData.text != "") {
                        var reg = /^1[0-9]{10}$/;
                        if (reg.test(barcodeData.text)) {
                            $scope.chooseFarm(barcodeData.text);
                        } else {
                            $scope.showToast(barcodeData.text);
                        }
                    }
                }, function(error) {
                    console.log(error);
                });
        }, false);
    };

    $scope.chooseFarm = function(phone) {
        phone = phone.replace("+86", "");
        phone = phone.replace(/-/g, "");
        phone = phone.replace(/ /g, "");
        var reg = /^1[0-9]{10}$/;
        if (!reg.test(phone)) {
            $scope.showToast("手机号格式错误");
            return false;
        }
        $scope.showLoad();
        FarmService.listByPhone(phone).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true && data.MyObject.length > 0) {
                $scope.farms = data.MyObject;
                if ($scope.farms.length > 1) {
                    $scope.cur.farm = $scope.farms[0];
                    $ionicPopup.show({
                        templateUrl: 'pages/message/farm-modal.html',
                        title: '选择申请加入的农场',
                        subTitle: '',
                        scope: $scope,
                        buttons: [
                            { text: '取消' }, {
                                text: '<b>申请</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    $scope.invite($scope.cur.farm, phone);
                                }
                            }
                        ]
                    });
                } else if ($scope.farms.length === 1) {
                    $scope.curfarm = $scope.farms[0];
                    $scope.invite($scope.curfarm, phone);
                }
            } else {
                $scope.showToast("未找到农场");
            }
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.invite = function(item, phone) {
        $scope.showLoad();
        if (user.PersonName === null) {
            user.PersonName = user.Name;
        }
        $scope.Inviter = {
            SysDepID: item.SysDepID,
            SysRoleID: item.SysRoleID,
            PensSpaceId: "",
            BKey: "",
            YCommID: item.Id,
            YQUserID: "",
            YQUserPhone: "",
            BUserID: user.Id,
            BPhone: user.Name,
            BContent: user.PersonName + "申请加入" + item.CommName,
            BFlag: 0,
            BType: 2,
            CreatePerson: user.PersonName
        };
        MessageService.JoinFarm($scope.Inviter).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                item.didJoin = true;
                $scope.showToast(data.Message);
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.cururl = {
        weburl: weburl
    };
    $scope.setUrl = function() {
        weburl = $scope.cururl.weburl;
        appurl = weburl + '/app/';
        uploadurl = weburl + '/up/';
        localStorage.setItem('weburl', weburl);
        $ionicPopup.show({
            template: '<div class="content">切换成功，为了保证数据的正确性请退出重新登录！</div>',
            title: '消息',
            subTitle: '',
            scope: $scope,
            buttons: [{
                text: '暂不退出'
            }, {
                text: '<b>立即退出</b>',
                type: 'button-positive',
                onTap: function(e) {
                    $scope.logout();
                }
            }]
        });
    };
})

.controller('aboutusCtrl', function($scope, $ionicTabsDelegate, VersionService, $ionicPopup) {
    $ionicTabsDelegate.showBar(false);

    $scope.version = version;

    $scope.isShow = true;
    if(isIOS){
        $scope.isShow = false;
    }

    $scope.checkUpdate = function() {
        VersionService.get().success(function(data) {
            if (data.Status === true && data.MyObject != null) {
                var new_version = data.MyObject;
                if (parseInt(new_version.replace(/\./g, "")) > parseInt(version.replace(/\./g, ""))) {
                    $ionicPopup.show({
                        template: '<div class="content">检测到新版本，点击确定下载。</div>',
                        title: '消息',
                        subTitle: '',
                        scope: $scope,
                        buttons: [{
                            text: '取消'
                        }, {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                // window.open('http://fir.im/realidfarm', '_system');
                                navigator.app.loadUrl('http://fir.im/realidfarm', { openExternal: true });
                            }
                        }]
                    });
                } else {
                    $scope.showToast("已经是最新版！");
                }
            }
        }).error(function(data) {
            console.log(data);
        });
    };
})

.controller('newhelpCtrl', function($scope, $ionicTabsDelegate, VersionService, $ionicPopup, $ionicNavBarDelegate, $ionicHistory) {
    $ionicTabsDelegate.showBar(false);
})

.controller('mydeviceCtrl', function($scope, $ionicTabsDelegate, VersionService, $ionicPopup, $ionicNavBarDelegate, $ionicHistory, $cordovaBarcodeScanner) {
    $ionicTabsDelegate.showBar(false);

    $scope.mydevices = [];
    if(mydevices){
        $scope.mydevices = mydevices;
    }

    $scope.addDevice = function(){
        document.addEventListener("deviceready", function() {
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    if (barcodeData.text.indexOf("LF") > -1) {
                        var flag = 0;
                        for (var i = 0; i < mydevices.length; i++) {
                            if(mydevices[i].name === barcodeData.text){
                                $scope.showToast("您已经绑定过该设备");
                                flag = 1;
                                break;
                            }
                        }
                        if(flag === 0){
                            var device = {
                                name: barcodeData.text,
                                type: "360"
                            };
                            mydevices.push(device);
                            localStorage.setItem('mydevices', JSON.stringify(mydevices));
                            $scope.mydevices = mydevices;
                            $scope.showToast("绑定成功！");
                        }
                    }else{
                        $scope.showToast("二维码错误");
                    }
                }, function(error) {
                    console.log(error);
                });
        }, false);
    };

    $scope.deleteDevice = function(index){
        $scope.mydevices.splice(index, 1);
        mydevices = $scope.mydevices;
        localStorage.setItem('mydevices', mydevices);
    };
});
