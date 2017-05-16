angular.module('app.controllers')

.controller("TaskCtrl", function($scope, $ionicTabsDelegate, $state, $ionicHistory, ServiceService, $ionicScrollDelegate) {

    $ionicTabsDelegate.showBar(false);
    
    $scope.tasks = [];
    $scope.data = {
        userid: user.Id,
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        page: 0,
        IsType: 1
    };

    var taskTabs = localStorage.getItem("taskTabs") || null;
    if (taskTabs === null) {
        $scope.tabs = [{
            name: '收到的任务',
            active: true
        }, {
            name: '发起的任务',
            active: false
        }, {
            name: '待评价',
            active: false
        }];
    } else {
        $scope.tabs = JSON.parse(taskTabs);
        for (var i = 0; i < $scope.tabs.length; i++) {
            if($scope.tabs[i].active){
                $scope.data.IsType = i+1;
            }
        }
    }

    $scope.CanBeLoaded = true;
    $scope.GetMyOrderAll = function(){
        $scope.showLoad();
        $scope.data.page += 1;
        ServiceService.GetMyOrderAll($scope.data).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true && data.MyObject && data.MyObject.length > 0) {
                data.MyObject.map(function(item) {
                    $scope.tasks.push(item);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.CanBeLoaded = false;
            }
        }).error(function(data) {
            $scope.showToast(data.Message);
        });
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.GetMyOrderAll();
    });

    $scope.change = function(item, index) {
        if (item.active !== true) {
            $scope.tabs.map(function(obj) {
                if (obj === item) {
                    obj.active = true;
                } else {
                    obj.active = false;
                }
            });
            localStorage.setItem("taskTabs", JSON.stringify($scope.tabs));
            $ionicScrollDelegate.scrollTop();
        }
        $scope.CanBeLoaded = true;
        $scope.tasks = [];
        $scope.data.page = 0;
        $scope.data.IsType = index+1;
        $scope.GetMyOrderAll();
    };

    $scope.back = function(){
        $ionicHistory.goBack(-1);
    };

    $scope.delete = function(Id, index){
        $scope.tasks.splice(index, 1);
        $scope.showLoad();
        ServiceService.DeleteOrderPlain(Id).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("删除成功");
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
})

.controller('TaskAddCtrl', function($scope, $ionicModal, ServiceService, $ionicHistory, $ionicTabsDelegate, $ionicPopup, $cordovaDatePicker, $timeout, TaskService, FarmService) {

    $scope.work = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        OrderZID: "",
        TaskBID: '',
        TaskCID: '',
        Daylist: "",
        PFList: "",
        TXDate: "",
        TaskTime: "",
        TaskName: "饲喂",
        TaskB: "",
        ComID: "",
        PenID: "",
        PlainID: ""
    };

    $scope.getFarms = function() {
        $scope.showLoad();
        FarmService.list().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null && data.MyObject.length > 0) {
                    $scope.farms = data.MyObject;
                    $scope.work.ComID =  $scope.farms[0].CommID;
                    $scope.getHouse();
                    $scope.work.PenID =  $scope.farms[0].penslist[0].PID;
                }
            }
            $scope.getColumn();
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    $scope.getFarms();

    $scope.getHouse = function(){
        for (var i = 0; i < $scope.farms.length; i++) {
            if($scope.farms[i].CommID === $scope.work.ComID){
                $scope.houses = $scope.farms[i].penslist;
                if($scope.houses.length > 0){
                    $scope.work.PenID =  $scope.houses[0].PID;
                }
            }
        }
        $scope.getColumn();
    };

    $scope.getColumn = function(){
        $scope.showLoad();
        FarmService.GetLWAll( $scope.work.PenID).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null && data.MyObject.length > 0) {
                    $scope.columns = data.MyObject;
                    $scope.columns =  $scope.columns.filter(function (val) {
                        return parseInt(val.plannum) > 0;
                    });
                }
                if($scope.columns.length > 0){
                    $scope.work.PlainID = $scope.columns[0].PID;
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.DFeeds = [];
    $scope.Departments = [];
    $scope.GetDepartment = function(){
        $scope.showLoad();
        ServiceService.GetDepartment().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.Departments = data.MyObject;
                $scope.work.TaskBID = $scope.Departments[0].ID;
                $scope.work.TaskCID = $scope.Departments[0].ID;
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    $scope.GetDepartment();

    $scope.getTaskB = function(){
        for (var i = 0; i < $scope.Departments.length; i++) {
            if($scope.Departments[i].ID === $scope.work.TaskBID){
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

    $scope.showDays = function(){
        if($scope.work.Daylist != ""){
            var days = $scope.work.Daylist.split("^");
            $scope.dayLength = 0;
            for (var i = 0; i < $scope.workDays.length; i++) {
                var aitem = $scope.workDays[i];
                for (var j = 0; j < aitem.length; j++) {
                    if(days.in_array(aitem[j].value+"")){
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
                if($scope.selectall.checked && aitem[j].value != null){
                    $scope.dayLength ++;
                    $scope.work.Daylist += aitem[j].value + "^";
                }
            }
        }
    };
    
    $scope.saveDays = function(){
        $scope.work.Daylist = "";
        $scope.dayLength = 0;
        for (var i = 0; i < $scope.workDays.length; i++) {
            var aitem = $scope.workDays[i];
            for (var j = 0; j < aitem.length; j++) {
                if(aitem[j].ischecked && aitem[j].value != null){
                    $scope.dayLength ++;
                    $scope.work.Daylist += aitem[j].value + "^";
                }
            }
        }
        $scope.DaysModal.hide();
    };

    $scope.getDate = function() {
        var crudate = null;
        if (window.cordova) {
            document.addEventListener("deviceready", function() {
                var options = {
                    date: new Date(),
                    mode: 'date', // or 'time'
                    allowOldDates: true,
                    allowFutureDates: true,
                    doneButtonLabel: '确认',
                    doneButtonColor: '#000000',
                    cancelButtonLabel: '取消',
                    cancelButtonColor: '#000000'
                };
                if(isIOS){
                  options.locale = 'zh_CN';
                }
                $cordovaDatePicker.show(options).then(function(date) {
                    crudate = moment(date).format('YYYY-MM-DD');
                    $scope.work.TaskDate = crudate;
                });
            }, false);
        } else {
            crudate = moment(new Date()).format('YYYY-MM-DD');
            $scope.work.TaskDate = crudate;
        }
    };

    $scope.getTime = function() {
        var crudate = null;
        if (window.cordova) {
            document.addEventListener("deviceready", function() {
                var options = {
                    date: new Date(),
                    mode: 'time', // or 'time'
                    allowOldDates: true,
                    allowFutureDates: true,
                    doneButtonLabel: '确认',
                    doneButtonColor: '#000000',
                    cancelButtonLabel: '取消',
                    cancelButtonColor: '#000000'
                };
                if(isIOS){
                  options.locale = 'zh_CN';
                }
                $cordovaDatePicker.show(options).then(function(date) {
                    crudate = moment(date).format('HH:mm');
                    $scope.work.TaskTime = crudate;
                });
            }, false);
        } else {
            crudate = moment(new Date()).format('HH:mm');
            $scope.work.TaskTime = crudate;
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

    $scope.getTaskB = function(){
        for (var i = 0; i < $scope.Departments.length; i++) {
            if($scope.Departments[i].ID === $scope.work.TaskBID){
                $scope.work.TaskB = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $scope.getTaskC = function(){
        for (var i = 0; i < $scope.Departments.length; i++) {
            if($scope.Departments[i].ID === $scope.work.TaskCID){
                $scope.work.TaskC = $scope.Departments[i].Name;
                return false;
            }
        }
    };

    $scope.addFeed = function(){
        $scope.Feeds = [];
        $scope.showLoad();
        ServiceService.FeedProsGet(0, $scope.search.Data).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.Feeds = data.MyObject.map(function(item){
                    item.PFName = item.FeedName;
                    if($scope.DFeeds){
                        item.checked = false;
                        $scope.DFeeds.forEach(function(obj){
                            if(obj.Id === item.Id){
                                item.checked = true;
                                item.PFNum = obj.PFNum;
                            }
                        });
                    }else{
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
            $scope.showToast(data.Message);
        });
    };
   
    $scope.chooseFeeds = function(){
        $scope.DFeeds = [];
        $scope.Feeds.map(function(item){
            if(item.checked === true){
                if(item.checked){
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

    $scope.searchFeed = function(){
        $timeout(function(){
            if($scope.search.Data){
                $scope.FeedsShow = [];
                for (var i = 0; i < $scope.Feeds.length; i++) {
                    if($scope.Feeds[i].FeedName.indexOf($scope.search.Data) >= 0){
                        $scope.FeedsShow.push($scope.Feeds[i]);
                    }
                }
            }else{
                $scope.FeedsShow = $scope.Feeds;
            }
        }, 300);
    };

    $scope.clearSearch = function(){
        $scope.search.Data = "";
        $scope.FeedsShow = $scope.Feeds;
    };

    $scope.minus = function(item, index){
        if(item.PFNum > 1){
            item.PFNum = item.PFNum - 1;
        }else{
            $scope.deleteFeed(index);
        }
    };

    $scope.plus = function(item){
        item.PFNum = item.PFNum + 1;
    };

    $scope.save = function(){
        if($scope.work.TaskName == ''){
            $scope.showToast("请选择操作类容");
            return false;
        }
        if($scope.work.TaskBID == ''){
            $scope.showToast("请选择执行者");
            return false;
        }
        if($scope.DFeeds == []){
            $scope.showToast("请添加物料");
            return false;
        }
        $scope.work.PFList = "";
        for (var i = 0; i < $scope.DFeeds.length; i++) {
            $scope.work.PFList += $scope.DFeeds[i].Id + ";" + $scope.DFeeds[i].PFName + ";" + $scope.DFeeds[i].PFNum + "^";
        }
        $scope.showLoad();
        TaskService.save($scope.work).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                $ionicHistory.goBack(-1);
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
})

.controller('TaskViewCtrl', function($scope, $state, $stateParams, ServiceService, $ionicModal, $cordovaFileTransfer, $ionicLoading, $ionicHistory, $ionicPopup, $ionicTabsDelegate) {

    $scope.uploadurl = uploadurl;
    $ionicTabsDelegate.showBar(false);
    var ids = $stateParams.id.split(':');
    $scope.rating = {
        current: 5,
        max: 5
    };
    $scope.data = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        ID: ids[0],
        IsType: ids[1],
        userid: ids[2]
    };
    $scope.myImage = false;
    $scope.showItem = {};
    $scope.showOther = {};
    $scope.saveItem = {
        userid: user.Id,
        Id: $scope.data.ID,
        IsType: $scope.data.IsType,
        TaskPhoto: '',
        TaskGps: '',
        WLlist: []
    };

    $scope.showLoad();
    ServiceService.ReadMyOrder($scope.data).success(function(data) {
        if (data.Status === true) {
            $scope.hideLoad();
            $scope.showItem = data.MyObject[0];
            $scope.showItem.WLList = $scope.showItem.WLList.map(function(item){
                item.WLNum = parseFloat(item.WLNum);
                return item;
            });
            $scope.showItem.CreateTime = new Date($scope.showItem.CreateTime);
            $scope.showOther = data.UMyObject;
            $scope.rating.current = parseInt($scope.showItem.FlagContentB);
        }
    }).error(function(data) {
        $scope.hideLoad();
        $scope.showToast(data.Message);
    });

    $scope.minus = function(item, index) {
        if (item.WLNum > 1) {
            item.WLNum = item.WLNum - 1;
        }
    };

    $scope.plus = function(item) {
        item.WLNum = item.WLNum + 1;
    };

    /*拍照*/
    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                var image = document.getElementById('myImage');
                image.src = imageURI;
                $scope.uploadFile(imageURI);
            }, function onFail(message) {
                console.log('Failed because: ' + message);
            }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };
    /*上传照片*/
    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: user.Id
            };
            $cordovaFileTransfer.upload(appurl + 'UploadUFile', imageURI, UploadOptions).then(function(result) {
                $scope.hideLoad();
                // $scope.showToast("上传成功！");
                $scope.saveItem.TaskPhoto = UploadOptions.fileName;
            }, function(err) {
                $scope.hideLoad();
                $scope.showToast("上传失败，请检查网络连接是否正常！");
            }, function(progress) {
                var intProgress = (progress.loaded / progress.total) * 100;
                if(intProgress < 100){
                    $ionicLoading.show({
                        template: '上传中：' + parseInt(intProgress) + '%'
                    });
                }else{
                    $scope.hideLoad();
                }
            });
        }, false);
    };

    $scope.SaveOrderAll = function() {
        $scope.showLoad();
        if(myposition && myposition != ""){
            $scope.saveItem.TaskGps = myposition.latitude + "," + myposition.longitude;
        }
        $scope.showItem.WLList.map(function(item){
            $scope.saveItem.WLlist.push(item);
        });
        ServiceService.SaveOrderAll($scope.saveItem).success(function(data) {
            if (data.Status === true) {
                $scope.hideLoad();
                $scope.showToast("保存成功");
                $ionicHistory.goBack(-1);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
})

.controller('TaskReviewCtrl', function($scope, $state, $stateParams, ServiceService, $ionicModal, $cordovaFileTransfer, $ionicLoading, $ionicHistory, $ionicPopup, $ionicTabsDelegate) {

    $scope.uploadurl = uploadurl;
    $ionicTabsDelegate.showBar(false);
    $scope.rating = {
        current: 5,
        max: 5
    };

    var ids = $stateParams.id.split(':');
    $scope.data = {
        ID: ids[0],
        IsType: ids[1],
        userid: ids[2]
    };
    $scope.myImage = false;
    $scope.showItem = {};
    $scope.showOther = {};
    $scope.saveItem = {
        userid: user.Id,
        Id: $scope.data.ID,
        IsType: $scope.data.IsType,
        TaskPhoto: '',
        TaskGps: '',
        FlagContentB: $scope.rating.current
    };

    $scope.showLoad();
    ServiceService.ReadMyOrder($scope.data).success(function(data) {
        if (data.Status === true) {
            $scope.hideLoad();
            $scope.showItem = data.MyObject[0];
            $scope.showItem.CreateTime = new Date($scope.showItem.CreateTime);
            if($scope.showItem.FlagContentB){
                $scope.rating.current = parseInt($scope.showItem.FlagContentB);
            }
            $scope.showOther = data.UMyObject;
        }
    }).error(function(data) {
        $scope.hideLoad();
        $scope.showToast(data.Message);
    });

    $scope.getSelectedRating = function(rating) {
        $scope.rating.current = rating;
        $scope.saveItem.FlagContentB = rating;
    };

    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                var image = document.getElementById('myImage');
                image.src = imageURI;
                $scope.uploadFile(imageURI);
            }, function onFail(message) {
                console.log('Failed because: ' + message);
            }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };

    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: user.Id
            };
            $cordovaFileTransfer.upload(appurl + 'UploadUFile', imageURI, UploadOptions).then(function(result) {
                $scope.hideLoad();
                // $scope.showToast("上传成功！");
                $scope.saveItem.TaskPhoto = UploadOptions.fileName;
            }, function(err) {
                $scope.hideLoad();
                $scope.showToast("上传失败，请检查网络连接是否正常！");
            }, function(progress) {
                var intProgress = (progress.loaded / progress.total) * 100;
                if(intProgress < 100){
                    $ionicLoading.show({
                        template: '上传中：' + parseInt(intProgress) + '%'
                    });
                }else{
                    $scope.hideLoad();
                }
            });
        }, false);
    };

    $scope.SaveOrderAll = function() {
        $scope.showLoad();
        if(myposition && myposition != ""){
            $scope.saveItem.TaskGps = myposition.latitude + "," + myposition.longitude;
        }
        ServiceService.SaveOrderAll($scope.saveItem).success(function(data) {
            if (data.Status === true) {
                $scope.hideLoad();
                $scope.showToast("保存成功");
                $ionicHistory.goBack(-1);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
})

.controller('MyTaskCtrl', function($scope, $state, $stateParams, ServiceService, $ionicModal, $cordovaFileTransfer, $ionicLoading, $ionicHistory, $ionicPopup, $ionicTabsDelegate) {

    $scope.uploadurl = uploadurl;
    $ionicTabsDelegate.showBar(false);
    var ids = $stateParams.id.split(':');
    $scope.rating = {
        current: 5,
        max: 5
    };

    $scope.data = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        ID: ids[0],
        IsType: ids[1],
        userid: ids[2]
    };
    $scope.myImage = false;
    $scope.showItem = {};
    $scope.showOther = {};
    $scope.saveItem = {
        userid: user.Id,
        Id: $scope.data.ID,
        IsType: $scope.data.IsType,
        TaskPhoto: '',
        TaskGps: '',
        WLlist: []
    };

    $scope.showLoad();
    ServiceService.ReadMyOrder($scope.data).success(function(data) {
        if (data.Status === true) {
            $scope.hideLoad();
            $scope.showItem = data.MyObject[0];
            $scope.showItem.CreateTime = new Date($scope.showItem.CreateTime);
            $scope.showOther = data.UMyObject;
            $scope.rating.current = parseInt($scope.showItem.FlagContentB);
        }
    }).error(function(data) {
        $scope.hideLoad();
        $scope.showToast(data.Message);
    });

    $scope.editWL = function(item) {
        $scope.data = {
            value: parseInt(item.WLNum)
        };

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<button class="button button-icon icon ion-minus-circled" ng-click="minus()"></button><input class="popedit" type="text" ng-model="data.value"><button class="button button-icon icon ion-plus-circled" ng-click="add()"></button>',
            title: '配方',
            subTitle: item.WLName,
            scope: $scope,
            buttons: [
                { text: '取消' }, {
                    text: '<b>保存</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.value || $scope.data.value < 0) {
                            $scope.showToast("数量必须大于0");
                        } else {
                            item.WLNum = $scope.data.value;
                            $scope.saveItem.WLlist.push(item);
                        }
                    }
                }
            ]
        });
    };

    $scope.add = function() {
        $scope.data.value += 1;
    };

    $scope.minus = function() {
        $scope.data.value -= 1;
    };

    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                var image = document.getElementById('myImage');
                image.src = imageURI;
                $scope.uploadFile(imageURI);
            }, function onFail(message) {
                console.log('Failed because: ' + message);
            }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };

    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: user.Id
            };
            $cordovaFileTransfer.upload(appurl + 'UploadUFile', imageURI, UploadOptions).then(function(result) {
                $scope.hideLoad();
                // $scope.showToast("上传成功！");
                $scope.saveItem.TaskPhoto = UploadOptions.fileName;
            }, function(err) {
                $scope.hideLoad();
                $scope.showToast("上传失败，请检查网络连接是否正常！");
            }, function(progress) {
                var intProgress = (progress.loaded / progress.total) * 100;
                if(intProgress < 100){
                    $ionicLoading.show({
                        template: '上传中：' + parseInt(intProgress) + '%'
                    });
                }else{
                    $scope.hideLoad();
                }
            });
        }, false);
    };

    $scope.SaveOrderAll = function() {
        $scope.showLoad();
        if(myposition && myposition != ""){
            $scope.saveItem.TaskGps = myposition.latitude + "," + myposition.longitude;
        }
        ServiceService.SaveOrderAll($scope.saveItem).success(function(data) {
            if (data.Status === true) {
                $scope.hideLoad();
                $scope.showToast("保存成功");
                $ionicHistory.goBack(-1);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
});
