angular.module("app.controllers")
.controller('FarmCtrl', function ($scope, $ionicTabsDelegate,$state,$ionicModal) {
    if (UserMessage==null) {
        $state.go("login");
    }
    $scope.yuyue=function(){
        $ionicModal.fromTemplateUrl('./pages/farm/newMessageOrder.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.searchDetailsModal = modal;
            $scope.searchDetailsModal.show();
        });
    }
})
.controller('FarmEnterCtrl', function (EnterService,$scope, $ionicSlideBoxDelegate ,$ionicTabsDelegate,$state,$interval,$ionicLoading,$cordovaFileTransfer,$cordovaDatePicker) {
    //入栏操作
    $ionicTabsDelegate.showBar(false);
    $scope.buttonBar = [{
        name: "批量操作",
        active: 1
    }, {
        name: "按耳号操作",
        active: 0
    }];
    var num=0;
    $scope.slideHasChanged = function (chooseIndex) {
        $scope.buttonBar.forEach(function (item, index) {
            if (chooseIndex == index) {
                item.active = 1;
                num=1
            } else {
                item.active = 0;
                num=0;
            }
        });
        $ionicSlideBoxDelegate.slide(chooseIndex);
    };
    $scope.getDates=function(){
        var options = {
            date: new Date(),
            mode: 'date',
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.entry.date=getDate(res);
            });
        }, false);
    };
    $scope.getD=function(){
        var options = {
            date: new Date(),
            mode: 'date',
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.entrys.date=getDate(res);
            });
        }, false);
    };
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    $scope.PreservationContinue=function(){
        if(num==0){
            //批量入栏
            var PCList=$("#enter-list-pici li").html();
            var imageName=document.getElementById("myImage").getAttribute("src").split("/").pop();
            EnterService.getEnters({
                SysDepID:UserMessage.SysDeptId,
                SysRoleID:UserMessage.RoleId,
                username:UserMessage.Name,
                PCNO:$scope.entry.JHNO,
                IsType:$scope.entry.isType,
                PCList:PCList,
                TaskGps:"110,120",
                ImageName:imageName
            }).success(function(res){
                if(res.Status==true){
                    $scope.entry={};
                    $scope.entry.JHNO=getTime();
                    $scope.entry.date=getDate();
                    $("#enter-list-pici").html("");
                    document.getElementById("myImage").setAttribute("src","");
                }else{
                    $scope.showToast(res.Message);
                }
            }).error(function(){

            });
        }else{
            var enterList=$("#lhListEnter li");
            function fn(){
                for(var i=0,n="";i<enterList.length;i++){
                    n+=enterList[i].innerHTML+",";
                }
                return n;
            }
            var imageName=document.getElementById("myImage2").getAttribute("src").split("/").pop();
            EnterService.getEnter({
                SysDepID:UserMessage.SysDeptId,
                SysRoleID:UserMessage.RoleId,
                username:UserMessage.Name,
                PCNO:$scope.entrys.JHNO,
                IsType:$scope.entrys.isType,
                PCList:fn(),
                TaskGps:"120,10",
                ImageName:imageName
            }).success(function(res){
                if(res.Status==true){
                    $scope.entrys={};
                    $scope.entrys.JHNO=getTime();
                    $scope.entrys.date=getDate();
                    $("#lhListEnter").html("");
                    document.getElementById("myImage2").setAttribute("src","");
                }else{
                    $scope.showToast(res.Message);
                }
            }).error(function(){

            });
        }
    };
    EnterService.GetVariety({}).success(function(res){
        if(res.Status==true){
            $scope.enterPing=res.MyObject;
        }
    }).error(function(){

    });
    $scope.EnterIstype=[{Id:1,Name:"羊"},{Id:3,Name:"牛"}];
    $scope.Preservation=function(){
        if(num==0){
            //批量入栏
            var PCList=$("#enter-list-pici li").html();
            var imageName=document.getElementById("myImage").getAttribute("src").split("/").pop();
            EnterService.getEnters({
                SysDepID:UserMessage.SysDeptId,
                SysRoleID:UserMessage.RoleId,
                username:UserMessage.Name,
                PCNO:$scope.entry.JHNO,
                IsType:$scope.entry.isType,
                PCList:PCList,
                TaskGps:"110,120",
                ImageName:imageName
            }).success(function(res){
                if(res.Status==true){
                    $state.go("tab.farm");
                }else{
                    $scope.showToast(res.Message);
                }
            }).error(function(){

            });
        }else{
            var enterList=$("#lhListEnter li");
            function fn(){
                for(var i=0,n="";i<enterList.length;i++){
                    n+=enterList[i].innerHTML+",";
                }
                return n;
            }
            var imageName=document.getElementById("myImage2").getAttribute("src").split("/").pop();
            EnterService.getEnter({
                SysDepID:UserMessage.SysDeptId,
                SysRoleID:UserMessage.RoleId,
                username:UserMessage.Name,
                PCNO:$scope.entrys.JHNO,
                IsType:$scope.entrys.isType,
                PCList:fn(),
                TaskGps:"120,10",
                ImageName:imageName
            }).success(function(res){
                if(res.Status==true){
                    $scope.showToast(res.Message);
                    $state.go("tab.farm");
                }else{
                    $scope.showToast(res.Message);
                }
            }).error(function(){

            });
        }
    };
    $scope.entry={
        JHNO:getTime(),
        date:getDate()
    };
    $scope.entrys={
        JHNO:getTime(),
        date:getDate()
    };
    //生成单号
    function getTime(){
        var date = new Date();
        var dan=moment(date).format('YYMMDDhhmmss');
        return dan;
    }
    //生成日期
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    //获取经纬度
    // function GPS(){
    //     /*获取经纬度*/
    //     var posOptions = {timeout: 10000, enableHighAccuracy: true};
    //     $cordovaGeolocation.getCurrentPosition(posOptions)
    //     .then(function (position) {
    //         return position.coords.latitude+","+position.coords.longitude;//精度纬度
    //     }, function(err) {
    //         // error
    //     });
    // }
    // console.log(GPS());
    //上传图片
    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                if(num==0){
                    var image = document.getElementById('myImage');
                    image.src = imageURI;
                }else{
                    var image = document.getElementById('myImage2');
                    image.src = imageURI;
                }

                $scope.uploadFile(imageURI);
            }, function onFail(message){

            },{ quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };
    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: UserMessage.Id
            };
            $cordovaFileTransfer.upload('http://192.168.1.228:1313/app/UploadUFile', imageURI, UploadOptions).then(function(result) {
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
    // 蓝牙模块
    var notifitime = 0;
    var str1 = [];
    var str2 = [];
    var onData = function(buffer) {
        var result = "";
        var data = new Uint8Array(buffer);
        var array_data = $.map(data, function(value, index) {
            return [value];
        });
        if(array_data.length < 20 && array_data.length > 10){
            for (var k = 0; k < array_data.length; k++) {
                result += String.fromCharCode(array_data[k]);
            }
            result = result.ID64Decode();
            setValue();
        }else{
            if (notifitime % 2 === 0) {
                notifitime = 0;
                str1 = array_data;
            } else {
                str2 = array_data;
                for (var i = 0; i < str2.length; i++) {
                    str1.push(str2[i]);
                }
                for (var j = 0; j < str1.length; j++) {
                    result += String.fromCharCode(str1[j]);
                }
                result = result.rfidDecode();
                if(num==0){
                    makeRes(result);
                }else{
                    makeResTwo(result);
                }

            }
            notifitime++;
        }
    };
    var arr=[];
    var arr1=[];
    function makeRes(type){
        if(arr.length==0){
            arr.push(type);
            $scope.numbers=arr.length;
        }else if(arr.length>0){
            $scope.showToast("只能扫描1个耳标号");
        }
        $scope.saomiao=arr[0];
    }
    function makeResTwo(type){
        arr.push(type);
        $scope.erbiaList=check(arr);
        $scope.enterListLength=arr1.length;
    }
    function check(arg){
        for(var i=0;i<arg.length;i++){
            if(arr1.indexOf(arg[i])<0){
                arr1.push(arg[i]);
                $scope.showToast("扫描成功了");
            }else{
            }
        }
        return arr1;
    }
    var onFailure = function(error) {
        ble.disconnect(deviceble.id, function() {
        }, function() {

        });
    };
    function scanble() {
        console.log("正在扫描外围设备中...");
        $scope.time = 30;
        $ionicLoading.show({
            template: $scope.bleText
        });
        ble.startScan([], function(bledevice) {
            if (bledevice.name !== undefined && bledevice.name !== null && bledevice.name !== "") {
                console.log("扫描到设备" + bledevice.name);
                if (bledevice.name.indexOf("LF") > -1) {
                    var flag = 0;
                    if(mydevices && mydevices.length > 0){
                        for (var i = 0; i < mydevices.length; i++) {
                            if(mydevices[i].name === bledevice.name){
                                ble.stopScan(
                                    function() { console.log("stopScan complete"); },
                                    function() { console.log("stopScan failed"); }
                                );
                                deviceble = bledevice;
                                localStorage.setItem('deviceble', JSON.stringify(bledevice));
                                connect();
                                break;
                            }
                        }
                        if(flag === 0 && i === mydevices.length){
                            $scope.showToast("未发现已绑定设备，请检查设备是否开启");
                            ble.stopScan(
                                function() { console.log("stopScan complete"); },
                                function() { console.log("stopScan failed"); }
                            );
                            $ionicLoading.hide();
                        }
                    }else{
                        ble.stopScan(
                            function() { console.log("stopScan complete"); },
                            function() { console.log("stopScan failed"); }
                        );
                        deviceble = bledevice;
                        localStorage.setItem('deviceble', JSON.stringify(bledevice));
                        connect();
                    }
                }
            }
        }, function() {
            console.log("扫描设备失败");
        });

        setTimeout(function() {
            if(deviceble){
                ble.isConnected(
                    deviceble.id,
                    function() {
                    },
                    function() {
                        ble.stopScan(
                            function() {
                                $scope.showToast("未发现设备");
                                $ionicLoading.hide();
                            },
                            function() { console.log("stopScan failed"); }
                        );
                    }
                );
            }
        }, 30000);
    }
    function connect() {
        console.log("正在连接设备 " + deviceble.name);
        ble.connect(deviceble.id, function(res) {
            errorTimes = 0;
            $ionicLoading.hide();
            $scope.bleStatus = "on";
            console.log("已连接设备" + deviceble.name);
            $scope.showToast("连接成功");
            ble.startNotification(deviceble.id, service_uuid, characteristic_uuid, onData, onFailure);
        }, function(error) {
            errorTimes++;
            if(errorTimes === 1){
                connect();
            }else{
                $ionicLoading.hide();
                $scope.showToast("连接失败，请检查设备是否开启或已连接其他手机!");
            }
        });
    }

    var timeInterval = null;
    var errorTimes = 0;
    $scope.bleStatus = "off";
    $scope.time = 30;
    $scope.bleText = "正在连接设备...";
    $scope.connectble = function() {
        ble.isEnabled(
            function() {
                scanble();
            },
            function() {
                if(isAndroid){
                    ble.enable(function() {
                        console.log("用户已允许开启蓝牙");
                        scanble();
                    }, function() {
                        console.log("拒绝开启手机蓝牙");
                    });
                }else{
                    $scope.showToast("请开启手机蓝牙");
                }
            }
        );
    };

    $scope.disconnectble = function() {
        ble.disconnect(deviceble.id, function() {
            $scope.bleStatus = "off";
            $scope.showToast("设备已断开连接");
        }, function() {
            $scope.showToast("断开失败");
        });
    };

    $scope.checkBLE = function() {
        if (deviceble) {
            ble.isEnabled(
                function() {
                    ble.isConnected(
                        deviceble.id,
                        function() {
                            console.log("定时检测：设备已连接");
                            $scope.bleStatus = "on";
                        },
                        function() {
                            console.log("定时检测：设备未连接");
                            $scope.bleStatus = "off";
                            $scope.$apply();
                        }
                    );
                },
                function() {
                    $scope.bleStatus = "off";
                }
            );
        } else {
            $scope.bleStatus = "off";
        }
    };

    var interval_ble = null;
    document.addEventListener('deviceready', function() {
        interval_ble = $interval(function() {
            $scope.checkBLE();
        }, 60000);
        ble.startStateNotifications(
            function(state) {
                console.log("蓝牙状态：" + state);
                if (state === "on") {

                } else if (state === "off") {
                    console.log("监听状态：手机蓝牙已关闭");
                    $scope.bleStatus = "off";
                } else if (state === "turningOff") {
                    $scope.bleStatus = "off";
                }
                $scope.$apply();
            }
        );
    }, false);

    $scope.$on('$ionicView.beforeLeave', function() {
        $scope.disconnectble();
        $interval.cancel(interval_ble);
    });
    // 蓝牙模块
    //入栏操作
})
//出栏控制器
.controller("FarmOutCtrl",function(OutService,$scope, $ionicSlideBoxDelegate ,$ionicTabsDelegate,$state,$interval,$ionicLoading,$cordovaFileTransfer,$timeout,$cordovaDatePicker){
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    $scope.getDates=function(){
        var options = {
            date: new Date(),
            mode: 'date',
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.getTiem=getDate(res);
            });
        }, false);
    };
    //生成单号
    function getTime(){
        var date = new Date();
        var dan=moment(date).format('YYMMDDhhmmss');
        return dan;
    }
    $scope.danhao=getTime();
    //生成日期
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.getTiem=getDate();
    $scope.out={};
    //上传图片
    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                var image = document.getElementById('myImage3');
                image.src = imageURI;
                $scope.uploadFile(imageURI);
            }, function onFail(message){

            },{ quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };
    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: UserMessage.Id
            };
            $cordovaFileTransfer.upload('http://192.168.1.228:1313/app/UploadUFile', imageURI, UploadOptions).then(function(result) {
                $scope.hideLoad();
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
    $scope.OutSave=function(){
        function fn(){
            var OutList=$("#OutListEnter li");
            for(var i=0,n="";i<OutList.length;i++){
                n+=OutList[i].innerHTML+",";
            }
            return n;
        }
        var imageName=document.getElementById("myImage3").getAttribute("src").split("/").pop();
        OutService.OutSave({
            uname:UserMessage.RoleNameAll,
            sysRoleId:UserMessage.RoleId,
            sysDeptId:UserMessage.SysDeptId,
            CLPCNO:$scope.danhao,
            eartags:fn(),
            IsType:$scope.out.IsType,
            ImageName:imageName
        }).success(function(res){
            if(res.Status==true){
                $state.go("tab.farm");
            }else{
                $scope.showToast(res.Message);
            }
        }).error(function(){

        });
    };
    $scope.OutSaveContinue=function(){
        function fn(){
            var OutList=$("#OutListEnter li");
            for(var i=0,n="";i<OutList.length;i++){
                n+=OutList[i].innerHTML+",";
            }
            return n;
        }
        var imageName=document.getElementById("myImage3").getAttribute("src").split("/").pop();
        OutService.OutSave({
            uname:UserMessage.RoleNameAll,
            sysRoleId:UserMessage.RoleId,
            sysDeptId:UserMessage.SysDeptId,
            CLPCNO:$scope.danhao,
            eartags:fn(),
            IsType:$scope.out.IsType,
            ImageName:imageName
        }).success(function(res){
            if(res.Status==true){
                $scope.showLoad();
                $timeout(function(){
                    $scope.hideLoad();
                    $state.go("tab.out");
                },1000);
            }else{
                $scope.showToast(res.Message);
            }
        }).error(function(){

        });
    }
    // 蓝牙模块
    var notifitime = 0;
    var str1 = [];
    var str2 = [];
    var onData = function(buffer) {
        var result = "";
        var data = new Uint8Array(buffer);
        var array_data = $.map(data, function(value, index) {
            return [value];
        });
        if(array_data.length < 20 && array_data.length > 10){
            for (var k = 0; k < array_data.length; k++) {
                result += String.fromCharCode(array_data[k]);
            }
            result = result.ID64Decode();
            setValue();
        }else{
            if (notifitime % 2 === 0) {
                notifitime = 0;
                str1 = array_data;
            } else {
                str2 = array_data;
                for (var i = 0; i < str2.length; i++) {
                    str1.push(str2[i]);
                }
                for (var j = 0; j < str1.length; j++) {
                    result += String.fromCharCode(str1[j]);
                }
                result = result.rfidDecode();
                makeResTwo(result);
            }
            notifitime++;
        }
    };
    var arr=[];
    var arr1=[];
    function makeResTwo(type){
        arr.push(type);
        $scope.erbiaList=check(arr);
        $scope.enterListLength=arr1.length;
    }
    function check(arg){
        for(var i=0;i<arg.length;i++){
            if(arr1.indexOf(arg[i])<0){
                arr1.push(arg[i]);
                $scope.showToast("扫描成功了");
            }else{
            }
        }
        return arr1;
    }
    var onFailure = function(error) {
        ble.disconnect(deviceble.id, function() {
        }, function() {

        });
    };
    function scanble() {
        $scope.time = 30;
        $ionicLoading.show({
            template: $scope.bleText
        });
        ble.startScan([], function(bledevice) {
            if (bledevice.name !== undefined && bledevice.name !== null && bledevice.name !== "") {
                if (bledevice.name.indexOf("LF") > -1) {
                    var flag = 0;
                    if(mydevices && mydevices.length > 0){
                        for (var i = 0; i < mydevices.length; i++) {
                            if(mydevices[i].name === bledevice.name){
                                ble.stopScan(
                                    function() { console.log("stopScan complete"); },
                                    function() { console.log("stopScan failed"); }
                                );
                                deviceble = bledevice;
                                localStorage.setItem('deviceble', JSON.stringify(bledevice));
                                connect();
                                break;
                            }
                        }
                        if(flag === 0 && i === mydevices.length){
                            $scope.showToast("未发现已绑定设备，请检查设备是否开启");
                            ble.stopScan(
                                function() { console.log("stopScan complete"); },
                                function() { console.log("stopScan failed"); }
                            );
                            $ionicLoading.hide();
                        }
                    }else{
                        ble.stopScan(
                            function() { console.log("stopScan complete"); },
                            function() { console.log("stopScan failed"); }
                        );
                        deviceble = bledevice;
                        localStorage.setItem('deviceble', JSON.stringify(bledevice));
                        connect();
                    }
                }
            }
        }, function() {
            console.log("扫描设备失败");
        });
        setTimeout(function() {
            if(deviceble){
                ble.isConnected(
                    deviceble.id,
                    function() {
                    },
                    function() {
                        ble.stopScan(
                            function() {
                                $scope.showToast("未发现设备");
                                $ionicLoading.hide();
                            },
                            function() { console.log("stopScan failed"); }
                        );
                    }
                );
            }
        }, 30000);
    }
    function connect() {
        console.log("正在连接设备 " + deviceble.name);
        ble.connect(deviceble.id, function(res) {
            errorTimes = 0;
            $ionicLoading.hide();
            $scope.bleStatus = "on";
            console.log("已连接设备" + deviceble.name);
            $scope.showToast("连接成功");
            ble.startNotification(deviceble.id, service_uuid, characteristic_uuid, onData, onFailure);
        }, function(error) {
            console.log(error.errorMessage);
            errorTimes++;
            if(errorTimes === 1){
                connect();
            }else{
                $ionicLoading.hide();
                $scope.showToast("连接失败，请检查设备是否开启或已连接其他手机!");
            }
        });
    }

    var timeInterval = null;
    var errorTimes = 0;
    $scope.bleStatus = "off";
    $scope.time = 30;
    $scope.bleText = "正在连接设备...";
    $scope.connectble = function() {
        ble.isEnabled(
            function() {
                scanble();
            },
            function() {
                if(isAndroid){
                    ble.enable(function() {
                        console.log("用户已允许开启蓝牙");
                        scanble();
                    }, function() {
                        console.log("拒绝开启手机蓝牙");
                    });
                }else{
                    $scope.showToast("请开启手机蓝牙");
                }
            }
        );
    };
    $scope.disconnectble = function() {
        ble.disconnect(deviceble.id, function() {
            $scope.bleStatus = "off";
            $scope.showToast("设备已断开连接");
        }, function() {
            $scope.showToast("断开失败");
        });
    };
    $scope.checkBLE = function() {
        if (deviceble) {
            ble.isEnabled(
                function() {
                    ble.isConnected(
                        deviceble.id,
                        function() {
                            console.log("定时检测：设备已连接");
                            $scope.bleStatus = "on";
                        },
                        function() {
                            console.log("定时检测：设备未连接");
                            $scope.bleStatus = "off";
                            $scope.$apply();
                        }
                    );
                },
                function() {
                    $scope.bleStatus = "off";
                }
            );
        } else {
            $scope.bleStatus = "off";
        }
    };
    var interval_ble = null;
    document.addEventListener('deviceready', function() {
        interval_ble = $interval(function() {
            $scope.checkBLE();
        }, 60000);
        ble.startStateNotifications(
            function(state) {
                console.log("蓝牙状态：" + state);
                if (state === "on") {

                } else if (state === "off") {
                    console.log("监听状态：手机蓝牙已关闭");
                    $scope.bleStatus = "off";
                } else if (state === "turningOff") {
                    $scope.bleStatus = "off";
                }
                $scope.$apply();
            }
        );
    }, false);
    $scope.$on('$ionicView.beforeLeave', function() {
        $scope.disconnectble();
        $interval.cancel(interval_ble);
    });
    // 蓝牙模块
})
//灭失操作控制器
.controller("FarmWipeOutCtrl",function(OutService,$scope, $ionicSlideBoxDelegate ,$ionicTabsDelegate,$state,$interval,$ionicLoading,$cordovaFileTransfer,$cordovaDatePicker){
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    $scope.getDates=function(){
        var options = {
            date: new Date(),
            mode: 'date',
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.getTiem=getDate(res);
            });
        }, false);
    };
    //生成单号
    function getTime(){
        var date = new Date();
        var dan=moment(date).format('YYMMDDhhmmss');
        return dan;
    }
    $scope.danhao=getTime();
    //生成日期
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.getTiem=getDate();
    $scope.wipeOut={};
    $scope.CauseDeath=["应激","猝死","中毒","胸膜性肺炎","腹泻","胀气","压死","急性死亡"];
    $scope.Treatmentmode=["无害处理","深埋","其他"];
    //上传图片
    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                var image = document.getElementById('myImage4');
                image.src = imageURI;
                $scope.uploadFile(imageURI);
            }, function onFail(message){

            },{ quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };
    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: UserMessage.Id
            };
            $cordovaFileTransfer.upload('http://192.168.1.228:1313/app/UploadUFile', imageURI, UploadOptions).then(function(result) {
                $scope.hideLoad();
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
    $scope.wipeOutSave=function(){
        function fn(){
            var OutList=$("#wipeOutListEnter li");
            for(var i=0,n="";i<OutList.length;i++){
                n+=OutList[i].innerHTML+",";
            }
            return n;
        }
        var imageName=document.getElementById("myImage4").getAttribute("src").split("/").pop();
        OutService.wiepOut({
            SysRoleID:UserMessage.RoleId,
            SysDepID:UserMessage.SysDeptId,
            Name:UserMessage.PersonName,
            SysDate:$scope.getTiem,
            DeathObject:fn(),
            CauseDeath:$scope.wipeOut.IsType,
            TreatmenThod:$scope.wipeOut.CauseDeath,
            OrrID:$scope.danhao,
            Remark:"",
            CreatePerson:UserMessage.Name,
            imageName:imageName
        }).success(function(res){
            if(res.Status==true){
                $state.go("tab.farm");
            }else{
                $scope.showToast(res.Message);
            }
        }).error(function(){

        });
    };
    //保存并继续的操作
    $scope.wipeOutSaveContinue=function(){
        function fn(){
            var OutList=$("#wipeOutListEnter li");
            for(var i=0,n="";i<OutList.length;i++){
                n+=OutList[i].innerHTML+",";
            }
            return n;
        }
        var imageName=document.getElementById("myImage4").getAttribute("src").split("/").pop();
        OutService.wiepOut({
            SysRoleID:UserMessage.RoleId,
            SysDepID:UserMessage.SysDeptId,
            Name:UserMessage.PersonName,
            SysDate:$scope.getTiem,
            DeathObject:fn(),
            CauseDeath:$scope.wipeOut.IsType,
            TreatmenThod:$scope.wipeOut.CauseDeath,
            OrrID:$scope.danhao,
            Remark:"",
            CreatePerson:UserMessage.Name,
            imageName:imageName
        }).success(function(res){
            if(res.Status==true){
                $state.go("tab.wipe-out");
            }else{
                $scope.showToast(res.Message);
            }
        }).error(function(){

        });
    }
    // 蓝牙模块
    var notifitime = 0;
    var str1 = [];
    var str2 = [];
    var onData = function(buffer) {
        var result = "";
        var data = new Uint8Array(buffer);
        var array_data = $.map(data, function(value, index) {
            return [value];
        });
        if(array_data.length < 20 && array_data.length > 10){
            for (var k = 0; k < array_data.length; k++) {
                result += String.fromCharCode(array_data[k]);
            }
            result = result.ID64Decode();
            setValue();
        }else{
            if (notifitime % 2 === 0) {
                notifitime = 0;
                str1 = array_data;
            } else {
                str2 = array_data;
                for (var i = 0; i < str2.length; i++) {
                    str1.push(str2[i]);
                }
                for (var j = 0; j < str1.length; j++) {
                    result += String.fromCharCode(str1[j]);
                }
                result = result.rfidDecode();
                makeResTwo(result);
            }
            notifitime++;
        }
    };
    var arr=[];
    var arr1=[];
    function makeResTwo(type){
        arr.push(type);
        $scope.erbiaList=check(arr);
        $scope.enterListLength=arr1.length;
    }
    function check(arg){
        for(var i=0;i<arg.length;i++){
            if(arr1.indexOf(arg[i])<0){
                arr1.push(arg[i]);
                $scope.showToast("扫描成功了");
            }else{
            }
        }
        return arr1;
    }
    var onFailure = function(error) {
        ble.disconnect(deviceble.id, function() {
        }, function() {

        });
    };
    function scanble() {
        $scope.time = 30;
        $ionicLoading.show({
            template: $scope.bleText
        });
        ble.startScan([], function(bledevice) {
            if (bledevice.name !== undefined && bledevice.name !== null && bledevice.name !== "") {
                if (bledevice.name.indexOf("LF") > -1) {
                    var flag = 0;
                    if(mydevices && mydevices.length > 0){
                        for (var i = 0; i < mydevices.length; i++) {
                            if(mydevices[i].name === bledevice.name){
                                ble.stopScan(
                                    function() { console.log("stopScan complete"); },
                                    function() { console.log("stopScan failed"); }
                                );
                                deviceble = bledevice;
                                localStorage.setItem('deviceble', JSON.stringify(bledevice));
                                connect();
                                break;
                            }
                        }
                        if(flag === 0 && i === mydevices.length){
                            $scope.showToast("未发现已绑定设备，请检查设备是否开启");
                            ble.stopScan(
                                function() { console.log("stopScan complete"); },
                                function() { console.log("stopScan failed"); }
                            );
                            $ionicLoading.hide();
                        }
                    }else{
                        ble.stopScan(
                            function() { console.log("stopScan complete"); },
                            function() { console.log("stopScan failed"); }
                        );
                        deviceble = bledevice;
                        localStorage.setItem('deviceble', JSON.stringify(bledevice));
                        connect();
                    }
                }
            }
        }, function() {
            console.log("扫描设备失败");
        });
        setTimeout(function() {
            if(deviceble){
                ble.isConnected(
                    deviceble.id,
                    function() {
                    },
                    function() {
                        ble.stopScan(
                            function() {
                                $scope.showToast("未发现设备");
                                $ionicLoading.hide();
                            },
                            function() { console.log("stopScan failed"); }
                        );
                    }
                );
            }
        }, 30000);
    }
    function connect() {
        console.log("正在连接设备 " + deviceble.name);
        ble.connect(deviceble.id, function(res) {
            errorTimes = 0;
            $ionicLoading.hide();
            $scope.bleStatus = "on";
            console.log("已连接设备" + deviceble.name);
            $scope.showToast("连接成功");
            ble.startNotification(deviceble.id, service_uuid, characteristic_uuid, onData, onFailure);
        }, function(error) {
            console.log(error.errorMessage);
            errorTimes++;
            if(errorTimes === 1){
                connect();
            }else{
                $ionicLoading.hide();
                $scope.showToast("连接失败，请检查设备是否开启或已连接其他手机!");
            }
        });
    }
    var timeInterval = null;
    var errorTimes = 0;
    $scope.bleStatus = "off";
    $scope.time = 30;
    $scope.bleText = "正在连接设备...";
    $scope.connectble = function() {
        ble.isEnabled(
            function() {
                scanble();
            },
            function() {
                if(isAndroid){
                    ble.enable(function() {
                        console.log("用户已允许开启蓝牙");
                        scanble();
                    }, function() {
                        console.log("拒绝开启手机蓝牙");
                    });
                }else{
                    $scope.showToast("请开启手机蓝牙");
                }
            }
        );
    };

    $scope.disconnectble = function() {
        ble.disconnect(deviceble.id, function() {
            $scope.bleStatus = "off";
            $scope.showToast("设备已断开连接");
        }, function() {
            $scope.showToast("断开失败");
        });
    };

    $scope.checkBLE = function() {
        if (deviceble) {
            ble.isEnabled(
                function() {
                    ble.isConnected(
                        deviceble.id,
                        function() {
                            console.log("定时检测：设备已连接");
                            $scope.bleStatus = "on";
                        },
                        function() {
                            console.log("定时检测：设备未连接");
                            $scope.bleStatus = "off";
                            $scope.$apply();
                        }
                    );
                },
                function() {
                    $scope.bleStatus = "off";
                }
            );
        } else {
            $scope.bleStatus = "off";
        }
    };
    var interval_ble = null;
    document.addEventListener('deviceready', function() {
        interval_ble = $interval(function() {
            $scope.checkBLE();
        }, 60000);
        ble.startStateNotifications(
            function(state) {
                console.log("蓝牙状态：" + state);
                if (state === "on") {

                } else if (state === "off") {
                    console.log("监听状态：手机蓝牙已关闭");
                    $scope.bleStatus = "off";
                } else if (state === "turningOff") {
                    $scope.bleStatus = "off";
                }
                $scope.$apply();
            }
        );
    }, false);
    $scope.$on('$ionicView.beforeLeave', function() {
        $scope.disconnectble();
        $interval.cancel(interval_ble);
    });
    // 蓝牙模块
})
//喂养控制器
.controller("FarmFeedCtrl",function(OutService,EnterService,$scope, $ionicSlideBoxDelegate ,$ionicTabsDelegate,$state,$interval,$ionicLoading,$cordovaFileTransfer,$cordovaDatePicker){
    $ionicTabsDelegate.showBar(false);
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    $scope.buttonBar = [{
        name: "批量操作",
        active: 1
    }, {
        name: "按耳号操作",
        active: 0
    }];
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
    $scope.getDates=function(){
        var options = {
            date: new Date(),
            mode: 'date',
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.entry.date=getDate(res);
            });
        }, false);
    };
    $scope.getD=function(){
        var options = {
            date: new Date(),
            mode: 'date',
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.entrys.date=getDate(res);
            });
        }, false);
    };
    var num=0;
    $scope.slideHasChanged = function (chooseIndex) {
        $scope.buttonBar.forEach(function (item, index) {
            if (chooseIndex == index) {
                item.active = 1;
                num=1
            } else {
                item.active = 0;
                num=0;
            }
        });
        $ionicSlideBoxDelegate.slide(chooseIndex);
    };
    $scope.entry={
        JHNO:getTime(),
        date:getDate()
    };
    $scope.entrys={
        JHNO:getTime(),
        date:getDate()
    }
    //生成单号
    function getTime(){
        var date = new Date();
        var dan=moment(date).format('YYMMDDhhmmss');
        return dan;
    }
    //生成日期
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.feed={};
    //上传图片
    $scope.takePhoto = function() {
        document.addEventListener("deviceready", function() {
            navigator.camera.getPicture(function onSuccess(imageURI) {
                $scope.myImage = true;
                if(num==0){
                    var image = document.getElementById('myImage6');
                    image.src = imageURI;
                }else{
                    var image = document.getElementById('myImage7');
                    image.src = imageURI;
                }
                $scope.uploadFile(imageURI);
            }, function onFail(message){

            },{ quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 1000, targetHeight: 1000 });
        }, false);
    };
    $scope.uploadFile = function(imageURI) {
        document.addEventListener('deviceready', function() {
            var UploadOptions = new FileUploadOptions();
            UploadOptions.fileKey = "file";
            UploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            UploadOptions.mimeType = "image/jpeg";
            UploadOptions.params = {
                uid: UserMessage.Id
            };
            $cordovaFileTransfer.upload('http://192.168.1.228:1313/app/UploadUFile', imageURI, UploadOptions).then(function(result) {
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
    // 蓝牙模块
    var notifitime = 0;
    var str1 = [];
    var str2 = [];
    var onData = function(buffer) {
        var result = "";
        var data = new Uint8Array(buffer);
        var array_data = $.map(data, function(value, index) {
            return [value];
        });
        if(array_data.length < 20 && array_data.length > 10){
            for (var k = 0; k < array_data.length; k++) {
                result += String.fromCharCode(array_data[k]);
            }
            result = result.ID64Decode();
            setValue();
        }else{
            if (notifitime % 2 === 0) {
                notifitime = 0;
                str1 = array_data;
            } else {
                str2 = array_data;
                for (var i = 0; i < str2.length; i++) {
                    str1.push(str2[i]);
                }
                for (var j = 0; j < str1.length; j++) {
                    result += String.fromCharCode(str1[j]);
                }
                result = result.rfidDecode();
                if(num==0){
                    makeRes(result);
                }else{
                    makeResTwo(result);
                }
            }
            notifitime++;
        }
    };
    var arr=[];
    var arr1=[];
    function makeRes(type){
        if(arr.length==0){
            arr.push(type);
            $scope.numbers=arr.length;
        }else if(arr.length>0){
            $scope.showToast("只能扫描1个耳标号");
        }
        $scope.saomiao=arr[0];
    }
    function makeResTwo(type){
        arr.push(type);
        $scope.erbiaList=check(arr);
        $scope.enterListLength=arr1.length;
    }
    function check(arg){
        for(var i=0;i<arg.length;i++){
            if(arr1.indexOf(arg[i])<0){
                arr1.push(arg[i]);
                $scope.showToast("扫描成功了");
            }else{
            }
        }
        return arr1;
    }
    var onFailure = function(error) {
        ble.disconnect(deviceble.id, function() {
        }, function() {

        });
    };
    function scanble() {
        console.log("正在扫描外围设备中...");
        $scope.time = 30;
        $ionicLoading.show({
            template: $scope.bleText
        });
        ble.startScan([], function(bledevice) {
            if (bledevice.name !== undefined && bledevice.name !== null && bledevice.name !== "") {
                console.log("扫描到设备" + bledevice.name);
                if (bledevice.name.indexOf("LF") > -1) {
                    var flag = 0;
                    if(mydevices && mydevices.length > 0){
                        for (var i = 0; i < mydevices.length; i++) {
                            if(mydevices[i].name === bledevice.name){
                                ble.stopScan(
                                    function() { console.log("stopScan complete"); },
                                    function() { console.log("stopScan failed"); }
                                );
                                deviceble = bledevice;
                                localStorage.setItem('deviceble', JSON.stringify(bledevice));
                                connect();
                                break;
                            }
                        }
                        if(flag === 0 && i === mydevices.length){
                            $scope.showToast("未发现已绑定设备，请检查设备是否开启");
                            ble.stopScan(
                                function() { console.log("stopScan complete"); },
                                function() { console.log("stopScan failed"); }
                            );
                            $ionicLoading.hide();
                        }
                    }else{
                        ble.stopScan(
                            function() { console.log("stopScan complete"); },
                            function() { console.log("stopScan failed"); }
                        );
                        deviceble = bledevice;
                        localStorage.setItem('deviceble', JSON.stringify(bledevice));
                        connect();
                    }
                }
            }
        }, function() {
            console.log("扫描设备失败");
        });
        setTimeout(function() {
            if(deviceble){
                ble.isConnected(
                    deviceble.id,
                    function() {
                    },
                    function() {
                        ble.stopScan(
                            function() {
                                $scope.showToast("未发现设备");
                                $ionicLoading.hide();
                            },
                            function() { console.log("stopScan failed"); }
                        );
                    }
                );
            }
        }, 30000);
    }
    function connect() {
        console.log("正在连接设备 " + deviceble.name);
        ble.connect(deviceble.id, function(res) {
            errorTimes = 0;
            $ionicLoading.hide();
            $scope.bleStatus = "on";
            console.log("已连接设备" + deviceble.name);
            $scope.showToast("连接成功");
            ble.startNotification(deviceble.id, service_uuid, characteristic_uuid, onData, onFailure);
        }, function(error) {
            console.log(error.errorMessage);
            errorTimes++;
            if(errorTimes === 1){
                connect();
            }else{
                $ionicLoading.hide();
                $scope.showToast("连接失败，请检查设备是否开启或已连接其他手机!");
            }
        });
    }
    var timeInterval = null;
    var errorTimes = 0;
    $scope.bleStatus = "off";
    $scope.time = 30;
    $scope.bleText = "正在连接设备...";
    $scope.connectble = function() {
        ble.isEnabled(
            function() {
                scanble();
            },
            function() {
                if(isAndroid){
                    ble.enable(function() {
                        console.log("用户已允许开启蓝牙");
                        scanble();
                    }, function() {
                        console.log("拒绝开启手机蓝牙");
                    });
                }else{
                    $scope.showToast("请开启手机蓝牙");
                }
            }
        );
    };
    $scope.disconnectble = function() {
        ble.disconnect(deviceble.id, function() {
            $scope.bleStatus = "off";
            // $scope.showToast("设备已断开连接");
        }, function() {
            $scope.showToast("断开失败");
        });
    };
    $scope.checkBLE = function() {
        if (deviceble) {
            ble.isEnabled(
                function() {
                    ble.isConnected(
                        deviceble.id,
                        function() {
                            console.log("定时检测：设备已连接");
                            $scope.bleStatus = "on";
                        },
                        function() {
                            console.log("定时检测：设备未连接");
                            $scope.bleStatus = "off";
                            $scope.$apply();
                        }
                    );
                },
                function() {
                    $scope.bleStatus = "off";
                }
            );
        } else {
            $scope.bleStatus = "off";
        }
    };
    var interval_ble = null;
    document.addEventListener('deviceready', function() {
        interval_ble = $interval(function() {
            $scope.checkBLE();
        }, 60000);
        ble.startStateNotifications(
            function(state) {
                console.log("蓝牙状态：" + state);
                if (state === "on") {

                } else if (state === "off") {
                    console.log("监听状态：手机蓝牙已关闭");
                    $scope.bleStatus = "off";
                } else if (state === "turningOff") {
                    $scope.bleStatus = "off";
                }
                $scope.$apply();
            }
        );
    }, false);
    $scope.$on('$ionicView.beforeLeave', function() {
        $scope.disconnectble();
        $interval.cancel(interval_ble);
    });
    // 蓝牙模块
})
.controller("messageOrdersCtrl",function($scope,$ionicSlideBoxDelegate,$ionicTabsDelegate,$ionicModal,NewMessageService,$state,$timeout,$cordovaDatePicker,EnterService){
    $scope.$on("$ionicView.beforeLeave", function(event, data){
        $ionicTabsDelegate.showBar(true);
    });
    $scope.buttonBar = [{
        name: "发出的预约",
        active: 1
    }, {
        name: "收到的预约",
        active: 0
    }];
    $scope.newMessageOrder={
        uid:UserMessage.Id,
        pubType:1,
        page:1,
        psize:3
    };
    //发出预约的列表
    NewMessageService.GetMySaleOrder($scope.newMessageOrder).success(function(res){
        if(res.Status==true){
            $scope.OrderList=res.MyObject;
        }
    }).error(function(){

    });
    $scope.slideHasChanged = function (chooseIndex) {
        $scope.buttonBar.forEach(function (item, index) {
            if (chooseIndex == index) {
                item.active = 1;
            } else {
                item.active = 0;
            }
        });
        $scope.slider._slideTo(chooseIndex);
        // $scope.slider.activeIndex=chooseIndex;
    };
    $ionicTabsDelegate.showBar(false);
    $scope.options = {
        loop: false,
        effect: 'slide',
        speed: 500,
        pagination:false,
    };
    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
        $scope.activeIndex = data.slider.activeIndex;
    });
    //发起预约列表的下拉刷新
    $scope.page=1;
    $scope.canLoad=true;
    $scope.loadMore=function(){
        NewMessageService.OutOrderXiaLa($scope.page++).success(function(res){
            if(res.Status==true){
                for(var i=0;i<res.MyObject.length;i++){
                    $scope.OrderList.push(res.MyObject[i]);
                }
                if(res.MyObject.length<3){
                    $scope.canLoad=false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }else{

            }
        }).error(function(){

        })
    };

    $scope.loadMore();
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadMore();
    });
    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    });

    //收到预约列表的上拉加载
    $scope.pages=1;
    $scope.canLoads=true;
    $scope.loadMores=function(){
        NewMessageService.getOrderUpLa($scope.pages++).success(function(res){
            if(res.Status==true){
                for(var i=0;i<res.MyObject.length;i++){
                    $scope.ReceivedOrder.push(res.MyObject[i]);
                }
                if(res.MyObject.length<3){
                    $scope.canLoads=false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }else{

            }
        });
    };

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
        // note: the indexes are 0-based
        $scope.activeIndex = data.slider.activeIndex;
        $scope.previousIndex = data.slider.previousIndex;
        $scope.buttonBar.forEach(function (item, index) {
            if ($scope.activeIndex == index) {
                item.active = 1;
            } else {
                item.active = 0;
            }
        });  
        $scope.$apply();
    });
    $scope.gotoSendMessage=function(){
        $ionicModal.fromTemplateUrl('./pages/farm/newMessageOrder.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.searchDetailsModal = modal;
            $scope.searchDetailsModal.show();
        });
        $scope.time=function(){

        }
    };
    //收购方式的下拉请求
    NewMessageService.GetSaleOrderRefDic({}).success(function(res){
        if(res.Status==true){
            $scope.shangmen=res.MyObject;
            $scope.foods=res.AMyObject;
        }
    }).error(function(){
    });
    //预约加工企业的下拉请求
    NewMessageService.GetSlaughterList({}).success(function(res){
        if(res.Status==true){
            $scope.kill=res.MyObject;
        }
    }).error(function(){
    });
    $scope.dan=getTime();
    $scope.date=getDate();
    //生成单号
    function getTime(){
        var date = new Date();
        var dan=moment(date).format('YYMMDDhhmmss');
        return dan;
    }
    //生成日期
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.message={
        OrderTime:$scope.getTiem,
        PublishId:UserMessage.Id,
        OrrId:$scope.dan,
    };
    $scope.sure=function(){
        if($scope.message.IsType==undefined){
            $scope.showToast("请选择销售类型");
        }else if($scope.message.SpeciesId==undefined){
            $scope.showToast("请选择销售品种");
        }else if($scope.message.OrderNum==undefined){
            $scope.showToast("请选择销售数量");
        }else if($scope.message.OrderTime==undefined){
            $scope.showToast("请选择销售时间");
        }else if($scope.message.ReceiveId==undefined){
            $scope.showToast("请选择预约加工企业");
        }else if($scope.message.SaleType==undefined){
            $scope.showToast("请选择收购方式");
        }else if($scope.message.BoardType==undefined){
            $scope.showToast("请选择食宿安排");
        }else{
            NewMessageService.SaleOrder($scope.message).success(function(res){
                if(res.Status==true){
                    $scope.searchDetailsModal.remove();
                }
            });
        }
    };
    //销售品种下拉列表
    EnterService.GetVariety({}).success(function(res){
        if(res.Status==true){
            $scope.enterPing=res.MyObject;
        }
    }).error(function(){

    });
    $scope.canLoad = true;
    //发起的预约列表下拉刷新
    $scope.doRefresh=function(){
        $scope.canLoad=true;
        $scope.page=1;
        NewMessageService.GetMySaleOrder($scope.newMessageOrder).success(function(res){
            if(res.Status==true){
                $scope.OrderList=res.MyObject;
            }
        }).error(function(){

        });
        $scope.$broadcast('scroll.refreshComplete');
    }
    //收到的预约列表下拉刷新
    $scope.doRefreshs=function(){
        $scope.canLoads=true;
        $scope.pages=1;
        NewMessageService.OutOrderXiaLas().success(function(res){
            if(res.Status==true){
                $scope.ReceivedOrder=res.MyObject;
            }
        }).error(function(){

        });
        $scope.$broadcast('scroll.refreshComplete');
    };
    //收到的预约列表
    NewMessageService.GetEnterpriseSaleOrderList({
        uid:UserMessage.Id,
        page:1,
        psize:2
    }).success(function(res){
        if(res.Status==true){
            $scope.ReceivedOrder=res.MyObject;
        }
    });
    $scope.hideModal=function(){
        $scope.searchDetailsModal.remove();
    };
    //获取时间组件
    $scope.getDates=function(){
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function(res){
                function getDate(date){
                    var dan=moment(date).format("YYYY-MM-DD");
                    return dan;
                }
                $scope.message.OrderTime=getDate(res);
            });
        }, false);
    };
    function getDate(){
        var date=new Date();
        var dan=moment(date).format("YYYY-MM-DD");
        return dan;
    }
    $scope.date=getDate();
    //单击去预约消息详情
    $scope.gotoConfirmOrder=function(index){
        $ionicModal.fromTemplateUrl('./pages/farm/SureOrder.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.searchDetailsModal = modal;
            $scope.searchDetailsModal.show();
        });
        $scope.SureOrder=$scope.OrderList[index];
        if($scope.SureOrder.OrderStatus=="待确认"){
            $scope.dis=false;
        }else{
            $scope.dis=true;
        }
    };
    //单击确认预约
    $scope.sreyuyue=function(){
        NewMessageService.ComfirmMyOrder({
            uid:UserMessage.Id,
            id:$scope.SureOrder.Id
        }).success(function(res){
            if(res.Status==true){
                NewMessageService.GetMySaleOrder($scope.newMessageOrder).success(function(res){
                    if(res.Status==true){
                        $scope.OrderList=res.MyObject;
                    }
                }).error(function(){

                });
                $scope.searchDetailsModal.remove();
            }
        }).error(function(){

        })
    }
});
