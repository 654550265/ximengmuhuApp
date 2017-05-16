angular.module('app.controllers').controller('StandardCtrl', function($scope, $ionicModal, ServiceService, $ionicTabsDelegate, FarmService, $state, $ionicPopup) {
    $ionicTabsDelegate.showBar(false);

    $scope.IsType = 1;
    $scope.showA = true;
    /*头导航的切换*/
    $scope.showAModul = function() {
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
        $scope.IsType = 1;
        $scope.GetOrderAll();
    };
    $scope.showBModul = function() {
        $scope.showA = false;
        $scope.showB = true;
        $scope.showC = false;
        $scope.IsType = 2;
        $scope.GetOrderAll();
    };
    $scope.showCModul = function() {
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
        $scope.IsType = 3;
        $scope.GetOrderAll();
    };

    $scope.isManage = true;

    $scope.standards = [];
    $scope.GetOrderAll = function() {
        $scope.showLoad();
        ServiceService.list($scope.IsType).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null && data.MyObject.length > 0) {
                    $scope.standards = data.MyObject.map(function(item) {
                        item.checked = false;
                        item.showmore = false;
                        return item;
                    });
                } else {
                    $scope.standards = [];
                }
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    $scope.GetOrderAll();

    $scope.related = {
        standardId: "",
        farmId: "",
        houseId: "",
        columnId: ""
    };
    $scope.activeChecked = false;
    $scope.activeStandard = null;
    $scope.chooseStandard = function(item) {
        $scope.activeChecked = !item.checked;
        for (var i = 0; i < $scope.standards.length; i++) {
            $scope.standards[i].checked = false;
        }
        item.checked = $scope.activeChecked;
        if ($scope.activeChecked) {
            $scope.activeStandard = item;
        } else {
            $scope.activeStandard = null;
        }
    };

    /*初始化的载入*/
    $scope.getFarms = function() {
        $scope.farms = [];
        $scope.showLoad();
        FarmService.list().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null && data.MyObject.length > 0) {
                    data.MyObject.map(function(item){
                        if(item.IsMy === 1){
                            $scope.farms.push(item);
                        }
                    });
                    $scope.houses = $scope.farms[0].penslist;
                    $scope.related.farmId = $scope.farms[0].CommID;
                    $scope.related.houseId = $scope.farms[0].penslist[0].PID;
                    $scope.getColumn();
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.showRelated = function() {
        $ionicModal.fromTemplateUrl('./pages/service/standard/related.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.relatedModal = modal;
            $scope.relatedModal.show();
            $scope.related.standardId = $scope.activeStandard.Id;
            $scope.getFarms();
        });
    };

    $scope.getHouse = function() {
        for (var i = 0; i < $scope.farms.length; i++) {
            if ($scope.farms[i].CommID === $scope.related.farmId) {
                $scope.houses = $scope.farms[i].penslist;
                $scope.related.houseId = $scope.farms[i].penslist[0].PID;
                $scope.getColumn();
            }
        }
    };

    $scope.getColumn = function() {
        $scope.showLoad();
        FarmService.GetLWAll($scope.related.houseId).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null && data.MyObject.length > 0) {
                    $scope.columns = data.MyObject.map(function(item) {
                        item.checked = true;
                        return item;
                    });
                    $scope.columns = $scope.columns.filter(function(val) {
                        return parseInt(val.plannum) > 0;
                    });
                    if($scope.columns.length > 0){
                        $scope.related.columnId = $scope.columns[0].PID;
                    }
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    // 多次递归关联栏位
    var times = 0;
    $scope.saveRelated = function() {
        if ($scope.columns.length > 0) {
            $scope.showLoad();
            var obj = $scope.columns[times];
            if (obj.checked) {
                $scope.related.columnId = obj.PID;
                ServiceService.saveRelated($scope.related).success(function(data) {
                    if (data.Status === true && times === $scope.columns.length - 1) {
                        $scope.hideLoad();
                        $scope.showToast("关联成功");
                        $scope.activeChecked = false;
                        $scope.GetOrderAll();
                        $scope.relatedModal.remove();
                        times = 0;
                    } else {
                        times++;
                        $scope.saveRelated();
                    }
                }).error(function(data) {
                    $scope.hideLoad();
                    $scope.showAlert(data.Message);
                });
            } else {
                if (times === $scope.columns.length - 1) {
                    $scope.hideLoad();
                    $scope.showToast("关联成功");
                    $scope.activeChecked = false;
                    $scope.GetOrderAll();
                    $scope.relatedModal.remove();
                    times = 0;
                } else {
                    times++;
                    $scope.saveRelated();
                }
            }
        } else {
            $scope.showToast("请添加栏位");
        }
    };

    // $scope.saveRelated = function() {
    //     if ($scope.columns.length > 0) {
    //         $scope.showLoad();
    //         ServiceService.saveRelated($scope.related).success(function(data) {
    //             if (data.Status === true) {
    //                 $scope.hideLoad();
    //                 $scope.showToast("关联成功");
    //                 $scope.activeChecked = false;
    //                 $scope.GetOrderAll();
    //                 $scope.relatedModal.remove();
    //             } else {
    //                 $scope.showToast(data.Message);
    //             }
    //         }).error(function(data) {
    //             $scope.hideLoad();
    //             $scope.showToast(data.Message);
    //         });
    //     } else {
    //         $scope.showToast("请添加栏位");
    //     }
    // };

    $scope.edit = function(item, $event) {
        $state.go('tab.standard-edit', { Id: item.Id });
        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;
    };

    $scope.deleteStandard = function(item, $event) {
        if ($event.stopPropagation) $event.stopPropagation();
        if(item.PensList === ""){
            $ionicPopup.confirm({
                title: '消息',
                template: '确认删除？',
                buttons: [{
                    text: '取消',
                    type: 'button-positive'
                }, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $scope.showLoad();
                        ServiceService.deleteStandard(item.Id).success(function(data) {
                            $scope.hideLoad();
                            if (data.Status === true) {
                                $scope.GetOrderAll();
                                $scope.showToast("删除成功");
                            }
                        }).error(function(data) {
                            $scope.hideLoad();
                            $scope.showAlert(data.Message);
                        });
                    }
                }]
            });
        }else{
            $scope.showToast("已关联栋舍，无法删除");
        }
    };

    $scope.showMore = function(item, $event){
        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        item.showmore = !item.showmore;
    };


    $scope.cancelRelated = function() {
        $scope.cancel = {
            standardId: "",
            columns: []
        };
        $scope.cancelColumns = [];
        $ionicModal.fromTemplateUrl('./pages/service/standard/cancelRelated.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.cancelModal = modal;
            $scope.cancelModal.show();
            $scope.cancel.standardId = $scope.activeStandard.Id;
            $scope.activeStandard.orderplainlist.map(function(item){
                item.checked = true;
                $scope.cancelColumns.push(item);
            });
        });
    };

    $scope.saveCancel = function(){
        $scope.cancelColumns.map(function(item){
            if(item.checked === true){
                $scope.cancel.columns.push(item.Id);
            }
        });
        if($scope.cancel.columns.length > 0){
            $scope.showLoad();
            $scope.cancel.columns = $scope.cancel.columns.join(";");
            ServiceService.saveCancel($scope.cancel).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.showToast("取消成功");
                    $scope.activeChecked = false;
                    $scope.GetOrderAll();
                    $scope.cancelModal.remove();
                } else {
                    $scope.showToast("取消失败");
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            });
        }else{
            $scope.showToast("请选择栏位");
        }
    };

})

.controller('StandardAddCtrl', function($scope, $ionicModal, ServiceService, $ionicHistory, $ionicTabsDelegate, $ionicPopup, $cordovaDatePicker, $timeout) {
    $ionicTabsDelegate.showBar(false);
    $scope.standard = {
        Id: "",
        TaskType: "1",
        TaskAllName: "",
        TaskAllList: "",
        TaskContent: "",
        SysDepID: user.PeID,
        SysRoleID: user.RoleId
    };

    $scope.tasks = [];
    $scope.task = {
        TaskZName: '',
        TaskDay: '',
        isopen: true,
        works: []
    };
    $scope.days = $scope.tasks.length;

    $ionicModal.fromTemplateUrl('./pages/service/standard/taskSetting.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.taskSettingModal = modal;
    });

    $scope.settingdata = {
        showDelete: false,
        showReorder: false
    };

    $scope.moveTask = function(item, fromIndex, toIndex) {
        $scope.tasks.splice(fromIndex, 1);
        $scope.tasks.splice(toIndex, 0, item);
    };

    $scope.onTaskDelete = function(item) {
        $scope.tasks.splice($scope.tasks.indexOf(item), 1);
    };

    $scope.addTask = function() {
        $scope.task = {
            TaskZName: '',
            TaskDay: '',
            isopen: true,
            works: []
        };
        $scope.tasks.push($scope.task);
    };

    $scope.showTaskSetting = function() {
        $scope.taskSettingModal.show();
    };

    $scope.hideTaskSetting = function() {
        $scope.days = 0;
        for (var i = $scope.tasks.length - 1; i >= 0; i--) {
            if ($scope.tasks[i].TaskZName === '') {
                $scope.tasks.splice(i, 1);
            } else {
                $scope.days += parseInt($scope.tasks[i].TaskDay);
            }
        }
        $scope.taskSettingModal.hide();
    };

    $scope.edit = function() {
        $scope.settingdata.showDelete = !$scope.settingdata.showDelete;
        $scope.settingdata.showReorder = !$scope.settingdata.showReorder;
    };

    $scope.saveTask = function() {
        $scope.days = 0;
        $scope.standard.TaskAllList = "";
        if ($scope.tasks.length > 0) {
            for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i].TaskZName == '') {
                    $scope.showToast("请输入阶段名");
                    return false;
                }
                if ($scope.tasks[i].TaskDay == '') {
                    $scope.showToast("请输入天数");
                    return false;
                }
                $scope.days += parseInt($scope.tasks[i].TaskDay);
                if ($scope.tasks[i].hasOwnProperty('Id')) {
                    $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + '^' + $scope.tasks[i].Id + ';';
                } else {
                    $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + ';';
                }
            }
            $scope.showLoad();
            ServiceService.AddOrderAll($scope.standard).success(function(data) {
                if (data.Status === true) {
                    if ($scope.standard.Id === '') {
                        $scope.standard.Id = data.Id;
                    }
                    ServiceService.one($scope.standard.Id).success(function(data) {
                        $scope.hideLoad();
                        if (data.Status === true) {
                            $scope.tasks = data.UMyObject.map(function(item, index) {
                                item.isopen = true;
                                item.works = $scope.tasks[index].works;
                                return item;
                            });
                            $scope.taskSettingModal.hide();
                            $scope.settingdata.showDelete = false;
                            $scope.settingdata.showReorder = false;
                        } else {
                            $scope.showToast(data.Message);
                        }
                    }).error(function(data) {
                        $scope.hideLoad();
                        $scope.showAlert(data.Message);
                    });
                } else {
                    $scope.showToast(data.Message);
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            });
        } else {
            $scope.showToast("请添加周期");
            return false;
        }
    };

    $scope.save = function() {
        if ($scope.standard.标准名称 == '') {
            $scope.showToast("请输入标准名称");
            return false;
        }
        $scope.standard.TaskAllList = "";
        for (var i = 0; i < $scope.tasks.length; i++) {
            if ($scope.tasks[i].hasOwnProperty('Id')) {
                $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + '^' + $scope.tasks[i].Id + ';';
            } else {
                $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + ';';
            }
        }
        ServiceService.AddOrderAll($scope.standard).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                $ionicHistory.goBack(-1);
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.work = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        OrderZID: "",
        TaskBID: "",
        TaskCID: "",
        Daylist: "",
        TXTime: "",
        TaskName: "",
        PFList: "",
        TaskB: ""
    };
    $scope.workDays = [];
    $scope.currentTask = {};

    $ionicModal.fromTemplateUrl('./pages/service/standard/workAdd.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.workAddModal = modal;
    });

    $scope.addWork = function(item) {
        $scope.work = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            OrderZID: "",
            TaskBID: "",
            TaskCID: "",
            Daylist: "",
            TXTime: "",
            TaskName: "",
            PFList: "",
            TaskB: ""
        };
        $scope.DFeeds = [];
        $scope.currentTask = item;
        $scope.workDays = [];
        var times = item.TaskDay + (7 - (item.TaskDay % 7));
        for (var i = 1; i <= times; i++) {
            var temp = {
                value: i,
                ischecked: false
            };
            if (i > item.TaskDay) {
                temp.value = null;
            }
            $scope.workDays.push(temp);
        }
        $scope.workDays = chunk($scope.workDays, 7);
        $scope.work.OrderZID = item.Id;
        $scope.GetDepartment();
        $scope.workAddModal.show();
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

    $scope.getTaskB = function() {
        for (var i = 0; i < $scope.Departments.length; i++) {
            if ($scope.Departments[i].ID === $scope.work.TaskBID) {
                $scope.work.TaskB = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $ionicModal.fromTemplateUrl('./pages/service/standard/Days.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.DaysModal = modal;
    });

    $scope.showDays = function() {
        if ($scope.work.Daylist != "") {
            var days = $scope.work.Daylist.split("^");
            $scope.dayLength = 0;
            for (var i = 0; i < $scope.workDays.length; i++) {
                var aitem = $scope.workDays[i];
                for (var j = 0; j < aitem.length; j++) {
                    if (days.in_array(aitem[j].value + "")) {
                        aitem[j].ischecked = true;
                    }
                }
            }
        }
        $scope.DaysModal.show();
    };

    $scope.selectall = {
        checked: false
    };
    $scope.chooseall = function() {
        for (var i = 0; i < $scope.workDays.length; i++) {
            var aitem = $scope.workDays[i];
            for (var j = 0; j < aitem.length; j++) {
                aitem[j].ischecked = $scope.selectall.checked;
                if ($scope.selectall.checked && aitem[j].value != null) {
                    $scope.dayLength++;
                    $scope.work.Daylist += aitem[j].value + "^";
                }
            }
        }
    };

    $scope.saveDays = function() {
        $scope.work.Daylist = "";
        $scope.dayLength = 0;
        for (var i = 0; i < $scope.workDays.length; i++) {
            var aitem = $scope.workDays[i];
            for (var j = 0; j < aitem.length; j++) {
                if (aitem[j].ischecked && aitem[j].value != null) {
                    $scope.dayLength++;
                    $scope.work.Daylist += aitem[j].value + "^";
                }
            }
        }
        $scope.DaysModal.hide();
    };

    $scope.getTime = function() {
        var crudate = null;
        if (window.cordova) {
            document.addEventListener("deviceready", function() {
                var options = {
                    date: new Date(),
                    mode: 'time', // or 'time'
                    allowOldDates: true,
                    allowFutureDates: false,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };
                $cordovaDatePicker.show(options).then(function(date) {
                    crudate = moment(date).format('HH:mm');
                    $scope.work.TXTime = crudate;
                });
            }, false);
        } else {
            crudate = moment(new Date()).format('HH:mm');
            $scope.work.TXTime = crudate;
        }
    };

    $scope.DFeeds = [];
    $scope.FeedsShow = [];
    $scope.search = {
        Data: ""
    };
    $ionicModal.fromTemplateUrl('./pages/service/standard/Feeds.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.FeedsModal = modal;
    });

    $scope.closeFeeds = function() {
        $scope.FeedsModal.hide();
    };

    $scope.getTaskB = function() {
        for (var i = 0; i < $scope.Departments.length; i++) {
            if ($scope.Departments[i].ID === $scope.work.TaskBID) {
                $scope.work.TaskB = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $scope.getTaskC = function() {
        for (var i = 0; i < $scope.Departments.length; i++) {
            if ($scope.Departments[i].ID === $scope.work.TaskCID) {
                $scope.work.TaskC = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $scope.addFeed = function() {
        $scope.Feeds = [];
        $scope.showLoad();
        ServiceService.FeedProsGet(0, $scope.search.Data).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.Feeds = data.MyObject.map(function(item) {
                    item.PFName = item.FeedName;
                    if ($scope.DFeeds) {
                        item.checked = false;
                        $scope.DFeeds.forEach(function(obj) {
                            if (obj.Id === item.Id) {
                                item.checked = true;
                                item.PFNum = obj.PFNum;
                            }
                        });
                    } else {
                        item.checked = false;
                    }
                    return item;
                });
                $scope.FeedsShow = $scope.Feeds;
                $scope.FeedsModal.show();
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.chooseFeeds = function() {
        $scope.DFeeds = [];
        $scope.Feeds.map(function(item) {
            if (item.checked === true) {
                if (item.checked) {
                    item.PFNum = item.PFNum ? item.PFNum : 1;
                }
                $scope.DFeeds.push(item);
            }
        });
        $scope.search.Data = "";
        $scope.closeFeeds();
    };

    $scope.deleteFeed = function(index) {
        $scope.DFeeds.splice(index, 1);
    };

    $scope.searchFeed = function() {
        $timeout(function() {
            if ($scope.search.Data) {
                $scope.FeedsShow = [];
                for (var i = 0; i < $scope.Feeds.length; i++) {
                    if ($scope.Feeds[i].FeedName.indexOf($scope.search.Data) >= 0) {
                        $scope.FeedsShow.push($scope.Feeds[i]);
                    }
                }
            } else {
                $scope.FeedsShow = $scope.Feeds;
            }
        }, 300);
    };

    $scope.clearSearch = function() {
        $scope.search.Data = "";
        $scope.FeedsShow = $scope.Feeds;
    };

    $scope.minus = function(item, index) {
        if (item.PFNum > 1) {
            item.PFNum = item.PFNum - 1;
        } else {
            $scope.deleteFeed(index);
        }
    };

    $scope.plus = function(item) {
        item.PFNum = item.PFNum + 1;
    };

    $scope.editWork = function(item, TaskDay, task) {
        $scope.work = item;
        $scope.work.TaskID = task.Id;
        $scope.DFeeds = [];
        $scope.currentTask = task;
        $scope.workDays = [];
        $scope.Daylist = item.Daylist.split("^");
        $scope.Daylist.pop();
        $scope.dayLength = $scope.Daylist.length;
        $scope.PFList = item.PFList.split("^");
        $scope.PFList.pop();
        $scope.DFeeds = $scope.PFList.map(function(subitem) {
            var feed = subitem.split(";");
            var feedobj = {};
            feedobj.Id = feed[0];
            feedobj.PFName = feed[1];
            feedobj.PFNum = parseInt(feed[2]);
            feedobj.checked = true;
            return feedobj;
        });
        var times = TaskDay + (7 - (TaskDay % 7));
        for (var i = 1; i <= times; i++) {
            var temp = {
                value: i,
                ischecked: false
            };
            if (i > TaskDay) {
                temp.value = null;
            }
            for (var j = 0; j < $scope.Daylist.length; j++) {
                if (parseInt($scope.Daylist[j]) === i) {
                    temp.ischecked = true;
                }
            }
            $scope.workDays.push(temp);
        }
        $scope.workDays = chunk($scope.workDays, 7);
        $scope.work.OrderZID = item.Id;
        $scope.GetDepartment();
        $scope.workAddModal.show();
    };


    $scope.saveWork = function() {
        if ($scope.work.TaskName == '') {
            $scope.showToast("请选择操作类容");
            return false;
        }
        if ($scope.work.TaskBID == '') {
            $scope.showToast("请选择执行者");
            return false;
        }
        if ($scope.DFeeds == []) {
            $scope.showToast("请添加物料");
            return false;
        }
        $scope.work.PFList = "";
        for (var i = 0; i < $scope.DFeeds.length; i++) {
            $scope.work.PFList += $scope.DFeeds[i].Id + ";" + $scope.DFeeds[i].PFName + ";" + $scope.DFeeds[i].PFNum + "^";
        }
        var flag = 0;
        for (var j = 0; j < $scope.currentTask.works.length; j++) {
            if ($scope.currentTask.works[j].Id === $scope.work.Id) {
                flag = 1;
            }
        }
        $scope.showLoad();
        ServiceService.saveWork($scope.work).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (flag === 0) {
                    $scope.work.Id = data.Id;
                    $scope.currentTask.works.push($scope.work);
                }
                $scope.showToast("保存成功");
                $scope.workAddModal.hide();
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
})

.controller('StandardEditCtrl', function($scope, $ionicModal, ServiceService, $ionicHistory, $ionicTabsDelegate, $ionicPopup, $cordovaDatePicker, $timeout, $stateParams) {
    $ionicTabsDelegate.showBar(false);

    var Id = $stateParams.Id;

    $scope.days = 0;
    $scope.IsPlan = 0;
    $scope.getOne = function() {
        $scope.showLoad();
        ServiceService.one(Id).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.standard = data.MyObject;
                $scope.standard.TaskType = $scope.standard.TaskType + "";
                $scope.tasks = data.UMyObject.map(function(item) {
                    $scope.days += parseInt(item.TaskDay);
                    for (var i = 0; i < item.works.length; i++) {
                        item.works[i].PFList = "";
                        item.works[i].Daylist = "";
                        var preorder = item.works[i].preorder;
                        var preorderday = item.works[i].preorderday;
                        for (var j = 0; j < preorder.length; j++) {
                            item.works[i].PFList += preorder[j].PFID + ";" + preorder[j].PFName + ";" + preorder[j].PFNum + "^";
                        }
                        for (var k = 0; k < preorderday.length; k++) {
                            item.works[i].Daylist += preorderday[k].PDay + "^";
                        }
                    }
                    item.isopen = true;
                    return item;
                });
                $scope.IsPlan = data.IsPlan;
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    $scope.getOne();

    $ionicModal.fromTemplateUrl('./pages/service/standard/taskSetting.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.taskSettingModal = modal;
    });

    $scope.settingdata = {
        showDelete: false,
        showReorder: false
    };

    $scope.moveTask = function(item, fromIndex, toIndex) {
        $scope.tasks.splice(fromIndex, 1);
        $scope.tasks.splice(toIndex, 0, item);
    };

    $scope.onTaskDelete = function(item) {
        $scope.tasks.splice($scope.tasks.indexOf(item), 1);
    };

    $scope.addTask = function() {
        $scope.task = {
            TaskZName: '',
            TaskDay: '',
            isopen: true,
            works: []
        };
        $scope.tasks.push($scope.task);
    };

    $scope.showTaskSetting = function() {
        $scope.taskSettingModal.show();
    };

    $scope.hideTaskSetting = function() {
        $scope.days = 0;
        for (var i = $scope.tasks.length - 1; i >= 0; i--) {
            if ($scope.tasks[i].TaskZName === '') {
                $scope.tasks.splice(i, 1);
            } else {
                $scope.days += parseInt($scope.tasks[i].TaskDay);
            }
        }
        $scope.taskSettingModal.hide();
    };

    $scope.edit = function() {
        $scope.settingdata.showDelete = !$scope.settingdata.showDelete;
        $scope.settingdata.showReorder = !$scope.settingdata.showReorder;
    };

    $scope.saveTask = function() {
        $scope.days = 0;
        $scope.standard.TaskAllList = "";
        if ($scope.tasks.length > 0) {
            for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i].TaskZName == '') {
                    $scope.showToast("请输入阶段名");
                    return false;
                }
                if ($scope.tasks[i].TaskDay == '') {
                    $scope.showToast("请输入天数");
                    return false;
                }
                $scope.days += parseInt($scope.tasks[i].TaskDay);
                if ($scope.tasks[i].hasOwnProperty('Id')) {
                    $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + '^' + $scope.tasks[i].Id + ';';
                } else {
                    $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + ';';
                }
            }
            $scope.showLoad();
            ServiceService.AddOrderAll($scope.standard).success(function(data) {
                if (data.Status === true) {
                    if ($scope.standard.Id === '') {
                        $scope.standard.Id = data.Id;
                    }
                    ServiceService.one($scope.standard.Id).success(function(data) {
                        $scope.hideLoad();
                        if (data.Status === true) {
                            $scope.tasks = data.UMyObject.map(function(item, index) {
                                item.isopen = true;
                                item.works = $scope.tasks[index].works;
                                return item;
                            });
                            $scope.taskSettingModal.hide();
                            $scope.settingdata.showDelete = false;
                            $scope.settingdata.showReorder = false;
                        } else {
                            $scope.showToast(data.Message);
                        }
                    }).error(function(data) {
                        $scope.hideLoad();
                        $scope.showAlert(data.Message);
                    });
                } else {
                    $scope.showToast(data.Message);
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            });
        } else {
            $scope.showToast("请添加周期");
            return false;
        }
    };

    $scope.save = function() {
        if ($scope.standard.标准名称 == '') {
            $scope.showToast("请输入标准名称");
            return false;
        }
        $scope.standard.TaskAllList = "";
        for (var i = 0; i < $scope.tasks.length; i++) {
            if ($scope.tasks[i].hasOwnProperty('Id')) {
                $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + '^' + $scope.tasks[i].Id + ';';
            } else {
                $scope.standard.TaskAllList += $scope.tasks[i].TaskZName + '^' + $scope.tasks[i].TaskDay + ';';
            }
        }
        ServiceService.AddOrderAll($scope.standard).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                $ionicHistory.goBack(-1);
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.work = {
        OrderZID: "",
        TaskBID: "",
        TaskCID: "",
        Daylist: "",
        TXTime: "",
        TaskName: "",
        PFList: "",

        TaskB: "",
        TaskC: ""
    };
    $scope.workDays = [];
    $scope.currentTask = {};

    $ionicModal.fromTemplateUrl('./pages/service/standard/workEdit.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.workAddModal = modal;
    });

    $scope.addWork = function(item) {
        $scope.work = {
            OrderZID: "",
            TaskBID: "",
            TaskCID: "",
            Daylist: "",
            PFList: "",
            TXTime: "",
            TaskName: "",

            TaskB: "",
            TaskC: ""
        };
        $scope.dayLength = 0;
        $scope.DFeeds = [];
        $scope.currentTask = item;
        $scope.workDays = [];
        var times = item.TaskDay + (7 - (item.TaskDay % 7));
        for (var i = 1; i <= times; i++) {
            var temp = {
                value: i,
                ischecked: false
            };
            if (i > item.TaskDay) {
                temp.value = null;
            }
            $scope.workDays.push(temp);
        }
        $scope.workDays = chunk($scope.workDays, 7);
        $scope.work.OrderZID = item.Id;
        $scope.GetDepartment();
        $scope.workAddModal.show();
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

    $scope.getTaskB = function() {
        for (var i = 0; i < $scope.Departments.length; i++) {
            if ($scope.Departments[i].ID === $scope.work.TaskBID) {
                $scope.work.TaskB = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $scope.getTaskC = function() {
        for (var i = 0; i < $scope.Departments.length; i++) {
            if ($scope.Departments[i].ID === $scope.work.TaskCID) {
                $scope.work.TaskC = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $ionicModal.fromTemplateUrl('./pages/service/standard/Days.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.DaysModal = modal;
    });

    $scope.showDays = function() {
        $scope.DaysModal.show();
    };

    $scope.selectall = {
        checked: false
    };
    $scope.chooseall = function() {
        for (var i = 0; i < $scope.workDays.length; i++) {
            var aitem = $scope.workDays[i];
            for (var j = 0; j < aitem.length; j++) {
                aitem[j].ischecked = $scope.selectall.checked;
                if ($scope.selectall.checked && aitem[j].value != null) {
                    $scope.dayLength++;
                    $scope.work.Daylist += aitem[j].value + "^";
                }
            }
        }
    };

    $scope.saveDays = function() {
        $scope.work.Daylist = "";
        $scope.dayLength = 0;
        for (var i = 0; i < $scope.workDays.length; i++) {
            var aitem = $scope.workDays[i];
            for (var j = 0; j < aitem.length; j++) {
                if (aitem[j].ischecked && aitem[j].value != null) {
                    $scope.dayLength++;
                    $scope.work.Daylist += aitem[j].value + "^";
                }
            }
        }
        $scope.DaysModal.hide();
    };

    $scope.getTime = function() {
        var crudate = null;
        if (window.cordova) {
            document.addEventListener("deviceready", function() {
                var options = {
                    date: new Date(),
                    mode: 'time', // or 'time'
                    allowOldDates: true,
                    allowFutureDates: false,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };
                $cordovaDatePicker.show(options).then(function(date) {
                    crudate = moment(date).format('HH:mm');
                    $scope.work.TXTime = crudate;
                });
            }, false);
        } else {
            crudate = moment(new Date()).format('HH:mm');
            $scope.work.TXTime = crudate;
        }
    };

    $scope.DFeeds = [];
    $scope.FeedsShow = [];
    $scope.search = {
        Data: ""
    };
    $ionicModal.fromTemplateUrl('./pages/service/standard/Feeds.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.FeedsModal = modal;
    });

    $scope.closeFeeds = function() {
        $scope.FeedsModal.hide();
    };

    $scope.addFeed = function() {
        $scope.Feeds = [];
        $scope.showLoad();
        ServiceService.FeedProsGet(0, $scope.search.Data).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.Feeds = data.MyObject.map(function(item) {
                    item.PFName = item.FeedName;
                    if ($scope.DFeeds) {
                        item.checked = false;
                        $scope.DFeeds.forEach(function(obj) {
                            if (obj.Id === item.Id) {
                                item.checked = true;
                                item.PFNum = obj.PFNum;
                            }
                        });
                    } else {
                        item.checked = false;
                    }
                    return item;
                });
                $scope.FeedsShow = $scope.Feeds;
                $scope.FeedsModal.show();
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.chooseFeeds = function() {
        $scope.DFeeds = [];
        $scope.Feeds.map(function(item) {
            if (item.checked === true) {
                if (item.checked) {
                    item.PFNum = item.PFNum ? item.PFNum : 1;
                }
                $scope.DFeeds.push(item);
            }
        });
        $scope.search.Data = "";
        $scope.closeFeeds();
    };

    $scope.deleteFeed = function(index) {
        $scope.DFeeds.splice(index, 1);
    };

    $scope.searchFeed = function() {
        $timeout(function() {
            if ($scope.search.Data) {
                $scope.FeedsShow = [];
                for (var i = 0; i < $scope.Feeds.length; i++) {
                    if ($scope.Feeds[i].FeedName.indexOf($scope.search.Data) >= 0) {
                        $scope.FeedsShow.push($scope.Feeds[i]);
                    }
                }
            } else {
                $scope.FeedsShow = $scope.Feeds;
            }
        }, 300);
    };

    $scope.clearSearch = function() {
        $scope.search.Data = "";
        $scope.FeedsShow = $scope.Feeds;
    };

    $scope.minus = function(item, index) {
        if (item.PFNum > 1) {
            item.PFNum = item.PFNum - 1;
        } else {
            $scope.deleteFeed(index);
        }
    };

    $scope.plus = function(item) {
        item.PFNum = item.PFNum + 1;
    };

    $scope.editWork = function(item, TaskDay, task) {
        $scope.work = item;
        $scope.work.TaskID = task.Id;
        $scope.DFeeds = [];
        $scope.currentTask = task;
        $scope.workDays = [];
        $scope.Daylist = item.Daylist.split("^");
        $scope.Daylist.pop();
        $scope.dayLength = $scope.Daylist.length;
        $scope.PFList = item.PFList.split("^");
        $scope.PFList.pop();
        $scope.DFeeds = $scope.PFList.map(function(subitem) {
            var feed = subitem.split(";");
            var feedobj = {};
            feedobj.Id = feed[0];
            feedobj.PFName = feed[1];
            feedobj.PFNum = parseInt(feed[2]);
            feedobj.checked = true;
            return feedobj;
        });
        var times = TaskDay + (7 - (TaskDay % 7));
        for (var i = 1; i <= times; i++) {
            var temp = {
                value: i,
                ischecked: false
            };
            if (i > TaskDay) {
                temp.value = null;
            }
            for (var j = 0; j < $scope.Daylist.length; j++) {
                if (parseInt($scope.Daylist[j]) === i) {
                    temp.ischecked = true;
                }
            }
            $scope.workDays.push(temp);
        }
        $scope.workDays = chunk($scope.workDays, 7);
        $scope.work.OrderZID = task.Id;
        $scope.GetDepartment();
        $scope.workAddModal.show();
    };

    $scope.saveWork = function() {
        if ($scope.work.TaskName == '') {
            $scope.showToast("请选择操作类容");
            return false;
        }
        if ($scope.work.TaskBID == '') {
            $scope.showToast("请选择执行者");
            return false;
        }
        if ($scope.DFeeds == []) {
            $scope.showToast("请添加物料");
            return false;
        }
        if (!$scope.work.Daylist) {
            $scope.work.Daylist = "";
            for (var i = 0; i < $scope.workDays.length; i++) {
                var aitem = $scope.workDays[i];
                for (var j = 0; j < aitem.length; j++) {
                    if (aitem[j].ischecked) {
                        $scope.dayLength++;
                        $scope.work.Daylist += aitem[j].value + "^";
                    }
                }
            }
        }
        $scope.work.PFList = "";
        for (var l = 0; l < $scope.DFeeds.length; l++) {
            $scope.work.PFList += $scope.DFeeds[l].Id + ";" + $scope.DFeeds[l].PFName + ";" + $scope.DFeeds[l].PFNum + "^";
        }
        var flag = 0;
        for (var k = 0; k < $scope.currentTask.works.length; k++) {
            if ($scope.currentTask.works[k].Id === $scope.work.Id) {
                flag = 1;
            }
        }
        $scope.showLoad();
        ServiceService.saveWork($scope.work).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (flag === 0) {
                    $scope.work.Id = data.Id;
                    $scope.currentTask.works.push($scope.work);
                }
                $scope.showToast("保存成功");
                $scope.workAddModal.hide();
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
});
