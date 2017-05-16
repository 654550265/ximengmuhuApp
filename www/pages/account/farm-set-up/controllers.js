
angular.module('app.controllers').controller('farmSetCtrl', function($scope, $ionicTabsDelegate, AccountService, $state, $ionicModal, QQLbsService) {
    $scope.showA = true;
    $scope.deptId =null;
    /*模块切换器*/
    $scope.showAModul = function() {
        $scope.showA = true;
        $scope.showB = false;
    };
    $scope.showBModul = function() {
        $scope.showA = false;
        $scope.showB = true;
    };

    $scope.backToAccount = function() {
        $state.go('tab.account');
        $ionicTabsDelegate.showBar(true);
    };

    $scope.userInofromation = { //当前用户信息
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        Id: user.Id
    };

    $scope.thisWorker = {};
    $scope.currentWorker = {};
    $scope.currentCorporationInfo = {}; //当前公司主体信息
    /*      $scope.wokerNewInofromation = {};*/
    $scope.getFarmsList = function() {
        $scope.showLoad();
        AccountService.farmInfo($scope.userInofromation).success(function(data) {
            $scope.farmTotal = data.MyObject;
            $scope.myFarms = $scope.farmTotal.filter(function(farm) {
                return farm.IsMy == 1;
            });
            $scope.othersFarms = $scope.farmTotal.filter(function(farm) {
                return farm.IsMy == 0;
            });
            $scope.hideLoad();
        }).error(function() {
            console.log("没获取到信息");
        });
        $ionicTabsDelegate.showBar(false);
    };
    $scope.getFarmsList();

    $scope.userInofromation = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        Id: user.Id
    };

    $scope.deleteOtherFarm = function(item, $index) {
        AccountService.deleteOtherFarm($scope.userInofromation, item.CommID).success(function(data) {
            if (data.Status) {
                $scope.othersFarms.splice($index, 1);
            }
        }).error(function() {
            console.log("没获取到信息");
        });

    };
    /*农场详情选择页面*/

    var currentFarmID = null;
    $scope.showFarmDetailLists = function(index) {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/farm-detail-lists.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.farmDetailListsModal = modal;
            $scope.farmDetailListsModal.show();
        });

        $scope.nowIndex = index; //$scope.nowIndex  当前选中的农场在当年列表中的编号
        if ($scope.showA) {
            $scope.currentFarms = $scope.myFarms;
            $scope.showSetBut = true;
        } else {
            $scope.currentFarms = $scope.othersFarms;
            $scope.showSetBut = false;
        }
        currentFarmId = $scope.currentFarms[index].CommID;
        $scope.workersListMessage.ComID = $scope.currentFarms[index].CommID;
    };

    /*个体农场详情页面*/

    $scope.shoFarmModal = function(item) {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/farm-info-show.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.farmInfoModal = modal;
            $scope.farmInfoModal.show();
        });

        $scope.showSetBut = false;
        if (item.IsMy == 1) {
            $scope.showSetBut = true;
        } else {
            $scope.showSetBut = false;
        }
    };
    //地址修改
    $scope.mudi = {
        province: "",
        provinceName: "",
        city: "",
        cityName: "",
        district: "",
        districtName: "",
        lat: "",
        lng: ""
    };
    $scope.provinces = [];
    $scope.cities = [];
    $scope.addmudi = function() {
        $scope.showLoad();
        $scope.mudi = {
            province: $scope.mudi.province || "",
            provinceName: $scope.mudi.provinceName || "",
            city: $scope.mudi.city || "",
            cityName: $scope.mudi.cityName || "",
            district: "",
            districtName: "",
            lat: "",
            lng: ""
        };
        QQLbsService.getDistrict().success(function(data) {
            $scope.hideLoad();
            if (data.status === 0) {
                $scope.provinces = data.result[0];
                $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/mudi.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.mudiModal = modal;
                    $scope.mudiModal.show();
                    $scope.currentFarm.CommAddress = '';
                });
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.getCity = function() {
        $scope.showLoad();
        QQLbsService.getChildren($scope.mudi.province).success(function(data) {
            $scope.hideLoad();
            if (data.status === 0) {
                $scope.cities = data.result[0];
                for (var i = $scope.provinces.length - 1; i >= 0; i--) {
                    if ($scope.provinces[i].id == $scope.mudi.province) {
                        $scope.mudi.provinceName = $scope.provinces[i].fullname;
                        return false;
                    }
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.getCityName = function() {
        for (var i = $scope.cities.length - 1; i >= 0; i--) {
            if ($scope.cities[i].id == $scope.mudi.city) {
                $scope.mudi.cityName = $scope.cities[i].fullname;
                return false;
            }
        }
    };

    $scope.doneMudi = function() {
        if ($scope.mudi.province === "") {
            $scope.showToast("请选择省份");
            return false;
        }
        if ($scope.mudi.city === "") {
            $scope.showToast("请选择城市");
            return false;
        }
        $scope.mudiModal.remove();
    };

    /*个体农场详情修改/设置页面*/
    $scope.showSetFarmInfo = function() {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/farm-info-set.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.farmInfoSetupModal = modal;
            $scope.farmInfoSetupModal.show();
        });
        $scope.currentFarm = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            CommName: $scope.currentFarms[$scope.nowIndex].CommName,
            CommTel: $scope.currentFarms[$scope.nowIndex].CommTel,
            CommAddress: $scope.currentFarms[$scope.nowIndex].CommAddress
        };

    };

    $scope.backToAccount = function() {
        $state.go('tab.account');
        $ionicTabsDelegate.showBar(true);
    };

    $scope.currentFarm = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        CommAddress:'',
    };

    $scope.saveFarmInfo = function() {
        $scope.currentFarm.Id = currentFarmId;
        if ($scope.currentFarm.CommName == undefined || $scope.currentFarm.CommName == "") {
            $scope.showToast('农场名称不能为空');
            return false;
        }
        if ($scope.currentFarm.CommTel == undefined || $scope.currentFarm.CommTel == "") {
            $scope.showToast('农场电话不能为空');
            return false;
        }
        if ($scope.mudi.provinceName == undefined || $scope.mudi.provinceName == "") {
            $scope.showToast('请选择所在城市');
            return false;
        }
        if ($scope.mudi.cityName == undefined || $scope.mudi.cityName == "") {
            $scope.showToast('请选择所在城市');
            return false;
        }
        if ($scope.currentFarm.CommAddress == undefined || $scope.currentFarm.CommAddress == "") {
            $scope.showToast('请输入农场地址');
            return false;
        }
        if ($scope.mudi.provinceName.indexOf("市") == -1) {
            $scope.currentFarm.CommAddress = $scope.mudi.cityName + $scope.currentFarm.CommAddress;
        } else {
            $scope.currentFarm.CommAddress = $scope.mudi.provinceName + $scope.mudi.cityName + $scope.currentFarm.CommAddress;
        }
        AccountService.setFarm($scope.currentFarm).success(function(data) {
            if (data.Status == true) {
                $scope.showToast("保存成功");
                $scope.farmInfoSetupModal.remove();
                $scope.currentFarms[$scope.nowIndex].CommName = $scope.currentFarm.CommName;
                $scope.currentFarms[$scope.nowIndex].CommTel = $scope.currentFarm.CommTel;
                $scope.currentFarms[$scope.nowIndex].CommAddress = $scope.currentFarm.CommAddress;
            }
        }).error(function() {
            console.log("没获取到信息");
        });
    };

    /*个体农场 人员 职位列表*/
    $scope.thisFarm = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId
    };
    /*获得人员信息列表*/
    $scope.showPositionsModal = function(thisfarm,type) {
        if ($scope.showA == true) {
            $scope.thisFarm.IsMy = 1; //自己的
        } else if ($scope.showB == true) {
            $scope.thisFarm.IsMy = 0; //别人的
        }
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/position.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.positionsModal = modal;
            if (type == 0) {
                $scope.showAsAccess = false;
            } else if (type == 1) {
                $scope.showAsAccess = true;
            }
            $scope.positionsModal.show();
        });
        $scope.thisFarm.CommID = thisfarm.CommID;
        $scope.CurrentCommID = thisfarm.CommID;
        AccountService.getFarmPesronInfo($scope.thisFarm).success(function(data) {
            if (data.Status == true) {
                $scope.positionList = data.MyObject;
            }
        }).error(function() {
            console.log("没获取到信息");
        });
    };

    /*人员列表 */
    $scope.workersListMessage = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId
    };
    $scope.currentPositionIndex = null;
    $scope.showPerson = function(index) {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/workers-list.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.personListModal = modal;
            $scope.personListModal.show();
        });
        $scope.workersListMessage.CommID = $scope.CurrentCommID;
        $scope.workersListMessage.IsMy = $scope.thisFarm.IsMy;
        $scope.currentPositionIndex = index;
        $scope.workersListMessage.PositionID = $scope.positionList[index].pID;
        AccountService.getFarmPesronList($scope.workersListMessage).success(
            function(data) {
                if (data.Status == true) {
                    $scope.workersList = data.MyObject;
                }
            }
        ).error(function() {
            console.log("没获取到信息");
        });
    };

    $scope.exitPersonList = function () {
        $scope.personListModal.remove();
        AccountService.getFarmPesronInfo($scope.thisFarm).success(function(data) {
            if (data.Status == true) {
                $scope.positionList = data.MyObject;
            }
        }).error(function() {
            console.log("没获取到信息");
        });
    };

    $scope.deleteWorker = function(item, $index) {
        AccountService.deleteWorker(item.pId, $scope.currentFarm.Id).success(function(data) {
            if (data.Status) {
                $scope.workersList.splice($index, 1);
            }
        }).error(function() {
            console.log("没获取到信息");
        });

    };

    /*人员详情界面*/
    var useInfo = null;
    var thisWorkerID = null;
    $scope.showWorkerInfo = function(index) {
        $scope.wokerInofromation = {};
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/worker-info.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.workerInfoModal = modal;
            $scope.workerInfoModal.show();
        });
        $scope.wokerInofromation.Id = $scope.workersList[index].pId;
        thisWorkerID = $scope.wokerInofromation.Id;
        $scope.currentWorker.Id = $scope.wokerInofromation.Id;
        AccountService.getFarmPesronInformation($scope.wokerInofromation).success(function(data) {
            useInfo = data.MyObject;
            $scope.wokerInofromation = {
                avatar: uploadurl + useInfo.pRemark,
                sex: useInfo.psex,
                phoneNumber: useInfo.pPhoneNumber,
                myname: useInfo.pmyname,
                name: useInfo.pname,
                email: useInfo.pEmailAddress,
                pBDepartment: useInfo.pBDepartment,
                BDepartmentId: useInfo.pBDepartmentId
            };
            if(useInfo.pRemark == null){
                $scope.wokerInofromation.avatar = "img/user.png";
            }
        }).error(function() {
            console.log("没获取到信息");
        });
    };
    $scope.exitWorkerInfo = function() {
        $scope.workerInfoModal.remove();
        AccountService.getFarmPesronList($scope.workersListMessage).success(
            function(data) {
                if (data.Status == true) {
                    $scope.workersList = data.MyObject;
                }
            }
        ).error(function() {
                console.log("没获取到信息");
            });
    };

    /*员工信息设置界面*/
    $scope.showSetWorkerInfo = function() {

        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/worker-info-set.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.setWorkerInfoModal = modal;
            $scope.setWorkerInfoModal.show();
        });
        $scope.thisWorker = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            ID: thisWorkerID,
            Sex: $scope.wokerInofromation.sex,
            PhoneNumber: $scope.wokerInofromation.phoneNumber,
            MyName: $scope.wokerInofromation.myname,
            EmailAddress: $scope.wokerInofromation.email,
            BDepartmentId: $scope.wokerInofromation.BDepartmentId
        };
    };

    $scope.choosePosition = function(thisWorker) {
        $scope.deptId = thisWorker.BDepartmentId;
        for (var i = 0; i < $scope.positionList.length; i++) {
            if ($scope.positionList[i].pID == thisWorker.BDepartmentId) {
                $scope.showPosition = $scope.positionList[i].pname;
                $scope.BDepartmentId = $scope.positionList[i].pID;
            }
        }
    };
    var phonereg = /^1[0-9]{10}$/;
    $scope.saveWorkerInfo = function() {
    /*    if ($scope.thisWorker.MyName == undefined || $scope.thisWorker.MyName == "") {
            $scope.showToast('姓名不能为空');
            return false;
        }
        if ($scope.thisWorker.Sex == undefined || $scope.thisWorker.Sex == "") {
            $scope.showToast('性别不能为空');
            return false;
        }
        if ($scope.thisWorker.EmailAddress == undefined || $scope.thisWorker.EmailAddress == "") {
            $scope.showToast('邮箱不能为空');
            return false;
        }
        if ($scope.thisWorker.PhoneNumber == undefined || $scope.thisWorker.PhoneNumber == "") {
            $scope.showToast('手机号不能为空');
            return false;
        }
        if (!phonereg.test($scope.thisWorker.PhoneNumber)) {
            $scope.showToast('手机号格式有误');
            return false;
        }*/
        if ($scope.thisWorker.BDepartmentId == undefined || $scope.thisWorker.BDepartmentId == "") {
            $scope.showToast('职位不能为空');
            return false;
        }
        AccountService.setFarmPesronInformation($scope.thisWorker).success(function(data) {
            if (data.Status == true) {
                $scope.showToast("保存成功");
                $scope.setWorkerInfoModal.remove();
                $scope.wokerInofromation = {
                    sex: $scope.thisWorker.Sex,
                    phoneNumber: $scope.thisWorker.PhoneNumber,
                    name: useInfo.pname,
                    myname: $scope.thisWorker.MyName,
                    email: $scope.thisWorker.EmailAddress,
                    pBDepartment: $scope.showPosition,
                    BDepartmentId: $scope.deptId
                };
            }
        }).error(function(data) {
            $scope.showToast(data.Message);
        });
    };
    /*s-权限设置*/

	$scope.getAppMenuListSendData = {};
    $scope.showAssessSet = function (item) {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/assess.html', {  //
            scope: $scope
        }).then(function(modal) {
            $scope.showAssessModel = modal;
			$scope.thisAssessPositon = item;
            $scope.showAssessModel.show();
			$scope.getAppMenuListSendData = {
				roleId:$scope.thisAssessPositon.pID,
				farmId:currentFarmId
			};
			AccountService.GetAppMenuList($scope.getAppMenuListSendData).success(function (data) {
                $scope.assessShowObjectList = data;
                if(data.length >= 1) {
                    $scope.assessShowObjectList[0].IsOpen = true;
                }
                // 如果三级目录值 AuthAccess 存在 false 就把1级和2级目录值 AuthAccess 设置为 false
                for (var i = 0; i < $scope.assessShowObjectList.length; i++) {
                    var level1 = $scope.assessShowObjectList[i];
                    for (var j = 0; j < level1.children.length; j++) {
                        var level2 = level1.children[j];
                        for (var k = 0; k < level2.children.length; k++) {
                            var level3 = level2.children[k];
                            if(!level3.AuthAccess){
                                level2.AuthAccess = false;
                                level1.AuthAccess = false;
                            }
                        }
                    }
                }
			}).error(function () {
				console.log("没获取到信息");
			});
        });
    };

    /*左侧的 选项按钮*/
    $scope.assessChooseSuper = function (assessShowObject) {
        $scope.assessShowObjectList.forEach(function (value, index, arry) {
            value.IsOpen = false;
        });
        assessShowObject.IsOpen = true;
    };
    /*左侧的 权限按钮*/
    $scope.assessSuperAuth = function ($event, assessShowObject) {
        $event.stopPropagation();
        changeAuthAccess(!assessShowObject.AuthAccess, assessShowObject);
    };
    /*右侧的 选项按钮*/
    $scope.showSubContent = function (assessShowObjectSub) {
        assessShowObjectSub.IsOpen = !assessShowObjectSub.IsOpen;
    };

    /*右侧的 权限按钮*/
    $scope.rightAssessSuperAuth = function ($event, assessShowObjectSub ,assessShowObject) {
        $event.stopPropagation();
        changeAuthAccess(!assessShowObjectSub.AuthAccess, assessShowObjectSub);
        assessShowObject.AuthAccess = assessShowObject.children.every(function (value) {
            return value.AuthAccess == true;
        });
        assessShowObjectSub.IsOpen = true;
    };
    /*最底层按钮*/
    $scope.chooseOperate = function (assessOperate, assessShowObjectSub,assessShowObject) {
        assessOperate.AuthAccess = !assessOperate.AuthAccess;
        assessShowObjectSub.AuthAccess = assessShowObjectSub.children.every(function (value) {
            return value.AuthAccess == true;
        });
        assessShowObject.AuthAccess = assessShowObject.children.every(function (value) {
            return value.AuthAccess == true;
        });
    };
    /*权限确认按钮*/
    $scope.confirmAssessModel = function () {
        var sendData = {
            FarmId: currentFarmId,
            RoleId: $scope.thisAssessPositon.pID,
            MenuIds: ''
        };
        var tmpArray = [];
        sendData.MenuIds = chooseAuthIsTrue($scope.assessShowObjectList, tmpArray).join(',');
        console.log(sendData);
        AccountService.SaveAppRolePermission(sendData).success(function (data) {
            console.log(data);
            if(data.Status == true){
                $scope.showToast('保存成功');
            }  else {
                $scope.showToast('保存失败');
            }
        }).error(function () {
            console.log("没获取到信息");
            $scope.showToast('保存失败');
        });
        $scope.showAssessModel.remove();
    };
    /*权限返回按钮*/
    $scope.exitAssessModel = function () {
        $scope.showAssessModel.remove();
        $scope.assessShowObjectList = [];
    };
    /*e-权限设置*/

    /*公司主体信息展示页面*/
    $scope.sendUserId = {
        Id: user.Id
    };
    var thisInfo = null;
    $scope.showCorporationInfo = function(item) {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/corporation-info.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.corporationInfoModal = modal;
            $scope.corporationInfoModal.show();
        });
        if (item.IsMy == 1) {
            $scope.showSetBut = true;
        } else {
            $scope.showSetBut = false;
        }

        AccountService.getCorporationInformation($scope.sendUserId).success(function(data) {
            thisInfo = data.MyObject;
            if (data.Status == true) {
                $scope.showCorporation = {
                    name: thisInfo.pComName,
                    registration: thisInfo.pCommRegistration,
                    represent: thisInfo.pCommRepresent,
                    phoneNum: thisInfo.pComTel,
                    cardId: thisInfo.pCommcardID,
                    address: thisInfo.pComAddress,
                    ID: thisInfo.pId
                };
            }
        }).error(function() {
            console.log("没获取到信息");
        });
    };


    /*公司主体信息修改页面*/
    $scope.showSetCoInfo = function() {
        $ionicModal.fromTemplateUrl('./pages/account/farm-set-up/corporation-info-set.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.setCorporationInfoModal = modal;
            $scope.setCorporationInfoModal.show();
        });
        if (!!$scope.currentCorporationInfo.name) {
            $scope.currentCorporationInfo = {
                ComName: $scope.showCorporation.name,
                CommRegistration: $scope.showCorporation.registration,
                CommRepresent: $scope.showCorporation.represent,
                ComTel: $scope.showCorporation.phoneNum,
                CommcardId: $scope.showCorporation.cardId,
                ComAddress: $scope.showCorporation.address,
                ID: $scope.showCorporation.ID
            };
        }
    };

    var comnumberidreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    $scope.saveCorporationInfo = function() {

        if ($scope.currentCorporationInfo.ComName == undefined || $scope.currentCorporationInfo.ComName == "") {
            $scope.showToast('企业名称不能为空');
            return false;
        }
        if ($scope.currentCorporationInfo.CommRepresent == undefined || $scope.currentCorporationInfo.CommRepresent == "") {
            $scope.showToast('法人代表不能为空');
            return false;
        }
        if ($scope.currentCorporationInfo.ComTel == undefined || $scope.currentCorporationInfo.ComTel == "") {
            $scope.showToast('联系方式不能为空');
            return false;
        }
        if ($scope.currentCorporationInfo.CommcardId == undefined || $scope.currentCorporationInfo.CommcardId == "") {
            $scope.showToast('身份证号码不能为空');
            return false;
        }
        if (!comnumberidreg.test($scope.currentCorporationInfo.CommcardId)) {
            $scope.showToast('手机号格式有误');
            return false;
        }
        $scope.currentCorporationInfo.userid = user.Id;
        $scope.currentCorporationInfo.ID = '';
        AccountService.setCorporationInformation($scope.currentCorporationInfo).success(function(data) {
            if (data.Status == true) {
                $scope.showToast("保存成功");
                $scope.showCorporation = {
                    name: $scope.currentCorporationInfo.ComName,
                    registration: $scope.currentCorporationInfo.CommRegistration,
                    represent: $scope.currentCorporationInfo.CommRepresent,
                    phoneNum: $scope.currentCorporationInfo.ComTel,
                    cardId: $scope.currentCorporationInfo.CommcardId,
                    address: $scope.currentCorporationInfo.ComAddress
                };
                $scope.setCorporationInfoModal.remove();
            }
        }).error(function() {

        });
    };


	/*多个角色  权限设置*/
	$scope.showSetPositions = function () {
		$ionicModal.fromTemplateUrl('./pages/account/farm-set-up/set-position.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.setPositonsModal = modal;
			$scope.setPositonsModal.show();
		});
	};

	$scope.showList = function (items) {
		items.Isopen = !items.Isopen;
	};

});