angular.module('app.controllers').controller('messageCtrl', function($scope, $cordovaContacts, $ionicModal, $cordovaBarcodeScanner, MessageService, $state, $timeout, $ionicScrollDelegate, $interval, $ionicTabsDelegate, AnalyticsService) {

    $ionicTabsDelegate.showBar(true);

    AnalyticsService.trackView('消息页面');

    if (window.cordova) {
        if(isIOS){
            window.plugins.jPushPlugin.resetBadge();
        }
    }

    $scope.messages = [{
        name: "系统消息",
        IsType: 1,
        time: "",
        num: "",
        show: true,
        icon: "icon_system.png"
    }, {
        name: "监测预警消息",
        IsType: 2,
        time: "",
        num: "",
        show: false
    }, {
        name: "控制系统消息",
        IsType: 3,
        time: "",
        num: "",
        show: false
    }, {
        name: "服务中心消息",
        IsType: 4,
        time: "",
        num: "",
        show: false
    }, {
        name: "在线客服消息",
        IsType: 5,
        time: "",
        num: "",
        show: false
    }, {
        name: "农场消息",
        IsType: 6,
        time: "",
        num: "",
        show: true,
        icon: "icon_farm.png"
    }, {
        name: "任务消息",
        IsType: 7,
        time: "",
        num: "",
        show: false
    }, {
        name: "计划消息",
        IsType: 8,
        time: "",
        num: "",
        show: false
    }, {
        name: "政府服务号",
        IsType: 9,
        time: "",
        num: "",
        show: false
    }, {
        name: "保险服务号",
        IsType: 10,
        time: "",
        num: "",
        show: false
    }, {
        name: "银行服务号",
        IsType: 11,
        time: "",
        num: "",
        show: false
    }, {
        name: "第三方涉农企业等",
        IsType: 12,
        time: "",
        num: "",
        show: false
    }];

    MessageService.NewsTypeAll().success(function(data) {
        if (data.Status === true) {
            if (data.MyObject != null) {
                for (var i = 0; i < data.MyObject.length; i++) {
                    var item = data.MyObject[i];
                    $scope.messages[i].num = item.NewsCount;
                    $scope.messages[i].time = item.NewsTime;
                }
                $timeout(function() {
                    $scope.$apply();
                });
            }
        }
    }).error(function(data) {
        $scope.showAlert(data.Message);
    });

    $scope.gotoList = function(IsType) {
        $state.go('tab.messageList', { id: IsType });
    };

})

.controller('messageListCtrl', function($scope, MessageService, $stateParams, $state, $ionicTabsDelegate, $ionicHistory, $ionicPopup, ServiceService) {
    $ionicTabsDelegate.showBar(false);

    var type = $stateParams.id;
    var page = 1;
    $scope.msglist = [];
    $scope.listType = parseInt(type);
    $scope.NewsTypeList = function() {
        $scope.showLoad();
        MessageService.NewsTypeList(type, page).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null) {
                    $scope.msglist = data.MyObject;
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    $scope.NewsTypeList();

    $scope.msgDoInviter = function(type, Id) {
        $scope.showLoad();
        MessageService.DoInviter(type, Id).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast(data.Message);
            } else {
                $scope.showToast(data.Message);
            }
            $scope.NewsTypeList();
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
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

    $scope.cur = {
        role: ""
    };
    $scope.chooseRole = function(type, Id) {
        $ionicPopup.show({
            templateUrl: 'pages/message/role-modal.html',
            title: '选择角色',
            subTitle: '',
            scope: $scope,
            buttons: [
                { text: '取消' }, {
                    text: '<b>确认</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $scope.msgDoJoinFarm(type, Id);
                    }
                }
            ]
        });
    };

    $scope.msgDoJoinFarm = function(type, Id) {
        $scope.showLoad();
        MessageService.DoJoinFarm(type, Id, $scope.cur.role).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast(data.Message);
            } else {
                $scope.showToast(data.Message);
            }
            $scope.NewsTypeList();
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.msgview = function(typeId, id) {
        $state.go('tab.messageView', { typeId: typeId, id: id });
    };

    if (user.Rank === 1) {
        $scope.ishow = true;
    } else {
        $scope.ishow = false;
    }
})

.controller('messageViewCtrl', function($scope, MessageService, $stateParams, $sce, $ionicTabsDelegate) {
    $ionicTabsDelegate.showBar(false);

    var id = $stateParams.id;
    var typeId = $stateParams.typeId;
    $scope.message = {};
    $scope.showLoad();
    MessageService.NewsTypeDetail(typeId, id).success(function(data) {
        $scope.hideLoad();
        if (data.Status === true) {
            if (data.MyObject != null) {
                $scope.message = data.MyObject;
            }
        }
    }).error(function(data) {
        $scope.hideLoad();
        $scope.showToast(data.Message);
    });

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };
})


.controller('serviceGovCtrl', function($scope, MessageService, $cordovaContacts, $cordovaBarcodeScanner, $cordovaSms, $cordovaToast, $timeout) {

})

.controller('serviceBankCtrl', function($scope, MessageService, $cordovaContacts, $cordovaBarcodeScanner, $cordovaSms, $cordovaToast, $timeout) {

})

.controller('serviceSafeCtrl', function($scope, MessageService, $cordovaContacts, $cordovaBarcodeScanner, $cordovaSms, $cordovaToast, $timeout) {

})

.controller('makeMsgCtrl', function($scope, MessageService, $ionicHistory, $ionicModal) {
    $scope.message = {
        userlist: "",
        title_type: "新闻"
    };
    $scope.allPersons = [];
    $scope.choosePersons = [];
    $scope.userlist = [];
    $scope.selectall = {
        checked: false
    };

    $ionicModal.fromTemplateUrl('pages/message/person.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.personmodal = modal;
    });

    $scope.openpersonModal = function() {
        $scope.personmodal.show();
    };

    $scope.closepersonModal = function() {
        $scope.personmodal.hide();
    };

    $scope.getPersons = function() {
        $scope.showLoad();
        MessageService.GetPersonAll($scope.entry).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject && data.MyObject != null) {
                    for (var i = 0; i < data.MyObject.length; i++) {
                        data.MyObject[i].checked = false;
                    }
                    $scope.allPersons = data.MyObject;
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    $scope.getPersons();

    $scope.addPersons = function() {
        for (var i = 0; i < $scope.allPersons.length; i++) {
            for (var j = 0; j < $scope.choosePersons.length; j++) {
                $scope.choosePersons[j].checked = true;
                if ($scope.choosePersons[j].Id === $scope.allPersons[i].Id) {
                    $scope.allPersons[i].checked = $scope.choosePersons[j].checked;
                }
            }
        }
        $scope.openpersonModal();
    };

    $scope.cancel = function(index) {
        $scope.personmodal.hide();
    };

    $scope.savePerson = function(index) {
        $scope.choosePersons = [];
        $scope.userlist = [];
        for (var i = 0; i < $scope.allPersons.length; i++) {
            var item = $scope.allPersons[i];
            if (item.checked === true) {
                $scope.choosePersons.push(item);
                $scope.userlist.push(item.Id);
            }
        }
        $scope.message.userlist = $scope.userlist.toString();
        $scope.personmodal.hide();
    };

    $scope.chooseall = function() {
        for (var i = 0; i < $scope.allPersons.length; i++) {
            $scope.allPersons[i].checked = $scope.selectall.checked;
        }
    };

    $scope.back = function() {
        $ionicHistory.goBack(-1);
    };

    $scope.save = function() {
        if ($scope.message.title_name == "" || $scope.message.title_name == undefined) {
            $scope.showToast("请输入标题");
            return false;
        }
        if ($scope.message.theContent == "" || $scope.message.theContent == undefined) {
            $scope.showToast("请输入内容");
            return false;
        }
        if ($scope.message.userlist == "" || $scope.message.userlist == undefined) {
            $scope.showToast("请选择接收人");
            return false;
        }
        $scope.showLoad();
        MessageService.PublicNews($scope.message).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                $scope.back();
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

})

.controller('chatCtrl', function($scope, MessageService, $ionicHistory, $ionicModal) {

});
