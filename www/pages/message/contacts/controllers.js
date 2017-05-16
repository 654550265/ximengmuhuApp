angular.module('app.controllers').controller('contactsCtrl', function($scope, $cordovaContacts, $ionicModal, $cordovaBarcodeScanner, MessageService, $state, $timeout, $ionicScrollDelegate, $interval, $ionicTabsDelegate) {

    $ionicTabsDelegate.showBar(false);

	$scope.teamMembers = [];
    $scope.showLoad();
    MessageService.getTeams().success(function(data) {
        $scope.hideLoad();
        if (data.Status === true) {
            if (data.MyObject != null) {
                $scope.infoList = data.MyObject;
            }
        }
    }).error(function(data) {
        $scope.hideLoad();
        $scope.showAlert(data.Message);
    });

	$scope.showList = function (items) {
		items.Isopen = !items.Isopen;
	};

    $scope.isShow = false;

    $scope.showact = function(){
        $scope.isShow = !$scope.isShow;
    };
    
    $scope.hidebackdrop = function(){
        $scope.isShow = false;
    };
})

.controller('mycardCtrl', function($scope, MessageService, $cordovaContacts, $cordovaBarcodeScanner, $cordovaSms, $cordovaToast, $timeout, $ionicTabsDelegate) {
    $ionicTabsDelegate.showBar(false);

    $scope.user = user;
    $scope.mycard = "";
    $scope.showLoad();
    MessageService.GetUserQR(user.Name).success(function(data) {
        $scope.hideLoad();
        if (data.Status === true) {
            if (data.MyObject != null) {
                $scope.mycard = uploadurl + user.Name + ".jpg";
            }
        }
    }).error(function(data) {
        $scope.hideLoad();
        $scope.showAlert(data.Message);
    });
})

.controller('inviteCtrl', function($scope, MessageService, $cordovaContacts, $cordovaBarcodeScanner, $cordovaSms, $cordovaToast, $timeout, $cordovaSQLite, $ionicPopup, $ionicTabsDelegate, $ionicPlatform, ServiceService) {
    $ionicTabsDelegate.showBar(false);
    $scope.allcontacts = [];
    $scope.contacts = [];
    var page = 0;
    $scope.hasContact = true;
    $scope.cur = {
        farm: null,
        role: null
    };
    $scope.farms = [];
    if(farms){
        farms.map(function(item) {
            if (item.IsMy === 1) {
                $scope.farms.push(item);
            }
        });
    }
    $scope.searchData = null;
    $scope.phone = null;
    $scope.role = null;
    $scope.isIOS = isIOS;

    $scope.$on('$ionicView.enter', function() {
        document.addEventListener("deviceready", function() {
            $scope.showLoad();
            var i = 0;
            var opts = {
                multiple: true
            };
            $cordovaContacts.find(opts).then(function(allContacts) {
                $scope.contacts = allContacts;
                $scope.hideLoad();
            });
        }, false);
    });

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
        $scope.phone = phone;
        if (farmsNum >= 1) {
            $scope.cur.farm = $scope.farms[0];
            $ionicPopup.show({
                templateUrl: 'pages/message/farm-modal.html',
                title: '选择邀请的农场',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: '取消' }, {
                        text: '<b>下一步</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $scope.chooseRole();
                        }
                    }
                ]
            });
        } else {
            $scope.showToast("请先添加农场");
        }
    };

    $scope.Departments = [];
    $scope.GetDepartment = function() {
        $scope.showLoad();
        ServiceService.GetDepartment().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.Departments = data.MyObject;
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    $scope.GetDepartment();

    $scope.chooseRole = function() {
        if ($scope.cur.farm.CommID == '' || $scope.cur.farm.CommID == null || $scope.cur.farm.CommID == undefined) {
            $scope.showToast("请选择加入的农场!");
            return false;
        } else {
            $scope.cur.role = $scope.Departments[0].ID;
            $ionicPopup.show({
                templateUrl: 'pages/message/role-modal.html',
                title: '选择角色',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: '取消' }, {
                        text: '<b>邀请</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $scope.invite();
                        }
                    }
                ]
            });
        }
    };

    $scope.invite = function() {
        $scope.showLoad();
        var sendPeople = user.PersonName || user.Name;
        $scope.Inviter = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            PensSpaceId: "",
            BKey: "",
            YCommID: $scope.cur.farm.CommID,
            YQUserID: user.Id,
            YQUserPhone: user.Name,
            BUserID: "",
            BPhone: $scope.phone,
            BContent: sendPeople + "邀请你加入" + $scope.cur.farm.CommName,
            BFlag: 0,
            BType: 1,
            YDepartID: $scope.cur.role
        };
        MessageService.Inviter($scope.Inviter).success(function(data) {
            if (data.Status === true) {
                if (data.MyObject != null) {
                    if (data.MyObject === 1) {
                        $scope.hideLoad();
                        $scope.showToast('邀请发送成功！');
                    } else if (data.MyObject === -1) {
                        var options = {
                            replaceLineBreaks: false, // true to replace \n by a new line, false by default
                            android: {
                                // intent: 'INTENT'  // send SMS with the native android SMS messaging
                                intent: '' // send SMS without open any other app
                            }
                        };
                        document.addEventListener("deviceready", function() {
                            $cordovaSms
                                .send($scope.phone, sendPeople + '邀请你加入' + $scope.cur.farm.CommName + '，现在去下载 http://fir.im/realidfarm', options)
                                .then(function() {
                                    $scope.hideLoad();
                                    $scope.showToast('邀请发送成功！');
                                }, function(error) {
                                    $scope.hideLoad();
                                    $scope.showToast('邀请发送失败！');
                                });
                        });
                    }
                } else {
                    $scope.hideLoad();
                    $scope.showToast(data.Message);
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
})

.controller('TeamCtrl', function($scope, MessageService, $cordovaContacts, $cordovaBarcodeScanner, $cordovaSms, $cordovaToast, $timeout, $ionicTabsDelegate, $ionicPopup, FarmService) {
    $ionicTabsDelegate.showBar(false);
    $scope.search = {
        data: ""
    };
    $scope.teams = [];
    $scope.user = {
        phone: user.Name
    };
    $scope.search = function() {
        if ($scope.search.data === undefined || $scope.search.data === "") {
            $scope.showToast("请输入搜索农场id/农场名称");
            return false;
        }
        $scope.teams = [];
        $scope.showLoad();
        MessageService.Community($scope.search.data).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null) {
                    $scope.teams = data.MyObject.map(function(item){
                        item.didJoin = false;
                        return item;
                    });
                } else {
                    $scope.showToast("您搜索的农场不存在");
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    // $scope.scan = function() {
    //     document.addEventListener("deviceready", function() {
    //         $cordovaBarcodeScanner
    //             .scan()
    //             .then(function(barcodeData) {
    //                 console.log(barcodeData);
    //             }, function(error) {
    //                 console.log(error);
    //             });
    //     }, false);
    // };

    // $scope.JoinFarm = function(item) {
    //     $scope.showLoad();
    //     if (user.PersonName === null) {
    //         user.PersonName = user.Name;
    //     }
    //     $scope.Inviter = {
    //         SysDepID: item.SysDepID,
    //         SysRoleID: item.SysRoleID,
    //         PensSpaceId: "",
    //         BKey: "",
    //         YCommID: item.Id,
    //         YQUserID: "",
    //         YQUserPhone: "",
    //         BUserID: user.Id,
    //         BPhone: user.Name,
    //         BContent: user.PersonName + "申请加入" + item.CommName,
    //         BFlag: 0,
    //         BType: 2,
    //         CreatePerson: user.PersonName
    //     };
    //     MessageService.JoinFarm($scope.Inviter).success(function(data) {
    //         $scope.hideLoad();
    //         if (data.Status === true) {
    //             item.didJoin = true;
    //             $scope.showToast(data.Message);
    //         } else {
    //             $scope.showToast(data.Message);
    //         }
    //     }).error(function(data) {
    //         $scope.hideLoad();
    //         $scope.showAlert(data.Message);
    //     });
    // };

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
                                    $scope.JoinFarm($scope.cur.farm, phone);
                                }
                            }
                        ]
                    });
                } else if ($scope.farms.length === 1) {
                    $scope.curfarm = $scope.farms[0];
                    $scope.JoinFarm($scope.curfarm, phone);
                }
            } else {
                $scope.showToast("未找到农场");
            }
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.JoinFarm = function(item, phone) {
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
});