angular.module('app.controllers').controller('CommonCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, $cordovaToast, PushService, MessageService, $timeout, VersionService, ServiceService, $interval) {

    $scope.company = "";
    user = JSON.parse(localStorage.getItem('user')) || '';
    $scope.user = user;

    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '消息',
            template: msg,
            okText: '确定'
        });
    };

    $scope.showToast = function(msg) {
        if (window.cordova) {
            $cordovaToast.showShortCenter(msg).then(function(success) {

            }, function(error) {

            });
        } else {
            $scope.showAlert(msg);
        }
    };

    $scope.showLoad = function() {
        $ionicLoading.show({
            template: "<ion-spinner icon='ios'></ion-spinner>"
        });
        $timeout(function() {
            $ionicLoading.hide();
        }, 10000);
    };
    $scope.hideLoad = function() {
        $ionicLoading.hide();
    };

    $scope.login = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("login");
    };

    $scope.logout = function() {
        $ionicPopup.show({
            template: '<div class="content">确定退出？</div>',
            title: '消息',
            scope: $scope,
            buttons: [{
                text: '取消',
                type: 'button-balanced'
            }, {
                text: '<b>确定</b>',
                type: 'button-balanced',
                onTap: function(e) {
                    localStorage.clear();
                    $ionicHistory.clearCache();
                    $state.go("login");
                    localStorage.setItem('runtiems', runtiems);
                    localStorage.setItem('readServiceTimes', readServiceTimes);
                    localStorage.setItem('addFarmTimes', addFarmTimes);
                    localStorage.setItem('weburl', weburl);
                    document.addEventListener('deviceready', function() {
                        window.plugins.jPushPlugin.stopPush();
                    }, false);
                }
            }]
        });
    };

    $scope.savePush = function() {
        if (regID !== '') {
            var pushData = {
                SysDepID: user.PeID,
                SysRoleID: user.RoleId,
                userid: user.Id,
                JGDeviceID: regID,
                Platform: window.device.platform,
                SystemID: window.device.version,
                Version: version,
                AddressID: ''
            };
            PushService.PostPushSystem(pushData).success(function(data) {
                if (data.Status === true) {
                    localStorage.setItem('regID', regID);
                    clearInterval(push);
                }
            }).error(function(data) {
                console.log(data);
            });
        } else {
            var push = window.setTimeout(function() {
                $scope.savePush();
            }, 1000);
        }
    };

    var onOpenNotification = function(event) {
        try {
            var alertContent, type, Id;
            if (device.platform == "Android") {
                alertContent = window.plugins.jPushPlugin.openNotification.alert;
                if (window.plugins.jPushPlugin.openNotification.extras.type) {
                    type = parseInt(window.plugins.jPushPlugin.openNotification.extras.type);
                }
                if (window.plugins.jPushPlugin.openNotification.extras.type) {
                    Id = window.plugins.jPushPlugin.openNotification.extras.Id;
                }
                if (type === 1) { //1表示被邀请后收到的通知类型
                    $ionicPopup.confirm({
                        title: '消息',
                        template: alertContent,
                        buttons: [{
                            text: '拒绝',
                            type: 'button-default',
                            onTap: function(e) {
                                $scope.DoInviter(-1, Id);
                            }
                        }, {
                            text: '加入',
                            type: 'button-positive',
                            onTap: function(e) {
                                $scope.DoInviter(1, Id);
                            }
                        }]
                    });
                } else if (type === 2) { //2 新闻通知

                } else if (type === 3) { //3 申请加入农场
                    $ionicPopup.confirm({
                        title: '消息',
                        template: alertContent,
                        buttons: [{
                            text: '拒绝',
                            type: 'button-default',
                            onTap: function(e) {
                                $scope.DoJoinFarm(-1, Id);
                            }
                        }, {
                            text: '同意',
                            type: 'button-positive',
                            onTap: function(e) {
                                $scope.chooseRole(1, Id);
                            }
                        }]
                    });
                } else if (type === 4) { //4 接收用户同意加入农场
                    $state.go("tab.message");
                }
            } else {
                alertContent = event.aps.alert;
            }

        } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
        }
    };

    $scope.DoInviter = function(type, Id) {
        $scope.showLoad();
        MessageService.DoInviter(type, Id).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast(data.Message);
            } else {
                $scope.showToast(data.Message);
            }
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
                        $scope.DoJoinFarm(type, Id);
                    }
                }
            ]
        });
    };

    $scope.DoJoinFarm = function(type, Id) {
        $scope.showLoad();
        MessageService.DoJoinFarm(type, Id, $scope.cur.role).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast(data.Message);
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    document.addEventListener('deviceready', function() {
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        document.addEventListener('online', function() {
            $scope.hideLoad();
        }, false);
        document.addEventListener('offline', function() {
            $ionicLoading.show({
                template: '无网络连接，请检查网络设置！'
            });
        }, false);
    }, false);

    window.setTimeout(function() {
        if(isAndroid){
            VersionService.get().success(function(data) {
                if (data.Status === true && data.MyObject != null) {
                    var new_version = data.MyObject;
                    if (parseInt(new_version.replace(/\./g, "")) > parseInt(version.replace(/\./g, ""))) {
                        var myPopup = $ionicPopup.show({
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
                        //$scope.showToast("已经是最新版！");
                    }
                }
            }).error(function(data) {
                console.log(data);
            });
        }
    }, 3000);

    $scope.clearHistory = function() {
      $ionicHistory.clearHistory();
    };
    // $scope.goBack = function() {
    //     var v = $ionicHistory.viewHistory();
    //     if(!v.backView){
    //         $state.go('app.account');
    //     }
    //     else{
    //         $ionicHistory.goBack();
    //     }
    // };
    // var notifitime = 0;
    // var str1 = [];
    // var str2 = [];
    // var onData = function(buffer) {
    //     var data = new Uint8Array(buffer);
    //     var array_data = $.map(data, function(value, index) {
    //         return [value];
    //     });
    //     if (notifitime % 2 === 0) {
    //         notifitime = 0;
    //         str1 = array_data;
    //     } else {
    //         str2 = array_data;
    //         for (var i = 0; i < str2.length; i++) {
    //             str1.push(str2[i]);
    //         }
    //         var result = "";
    //         for (var j = 0; j < str1.length; j++) {
    //             result += String.fromCharCode(str1[j]);
    //         }
    //         result = result.rfidDecode();
    //         console.log("发送:"+result);
    //         $scope.$broadcast("result", result);
    //     }
    //     notifitime++;
    // };

    // var onFailure = function(error) {
    //     console.log(error);
    // };

    // function scanble() {
    //     console.log("正在扫描外围设备中...");
    //     ble360 = $interval(function() {
    //         ble.scan([], 5, function(bledevice) {
    //             if (bledevice.name !== undefined && bledevice.name !== null && bledevice.name !== "") {
    //                 console.log("扫描到设备" + bledevice.name);
    //                 if (bledevice.name.indexOf("LF") > -1) {
    //                     $interval.cancel(ble360);
    //                     console.log("扫描到设备" + bledevice.name);
    //                     deviceble = bledevice;
    //                     localStorage.setItem('deviceble', JSON.stringify(bledevice));
    //                     connect();
    //                 }
    //             }
    //         }, function() {
    //             console.log("扫描设备失败");
    //         });
    //     }, 1000);
    // }

    // function connect() {
    //     ble.connect(deviceble.id, function(res) {
    //         console.log("已连接设备" + deviceble.name);
    //         $scope.showToast("设备 "+deviceble.name+" 已连接");
    //         ble.startNotification(deviceble.id, service_uuid, characteristic_uuid, onData, onFailure);
    //     }, function(error) {
    //         console.log("设备连接失败");
    //         $interval.cancel(ble360);
    //         scanble();
    //     });
    // }

    // document.addEventListener('deviceready', function() {
    //     ble.startStateNotifications(
    //         function(state) {
    //             if (state === "on") {
    //                 console.log("监听状态：手机蓝牙已开启");
    //                 if (deviceble) {
    //                     ble.isConnected(
    //                         deviceble.id,
    //                         function() {
    //                             console.log("设备已连接");
    //                         },
    //                         function() {
    //                             console.log("正在连接...");
    //                             connect();
    //                         }
    //                     );
    //                 } else {
    //                     $interval.cancel(ble360);
    //                     scanble();
    //                 }
    //             } else if (state === "off") {
    //                 console.log("监听状态：手机蓝牙已关闭");
    //                 //$interval.cancel(ble360);
    //                 ble.enable(function() {
    //                     console.log("用户已允许开启蓝牙");
    //                     if (deviceble) {
    //                         console.log("正在连接...");
    //                         connect();
    //                     } else {
    //                         interval.cancel(ble360);
    //                         scanble();
    //                     }
    //                 }, function() {
    //                     console.log("拒绝开启手机蓝牙");
    //                     $interval.cancel(ble360);
    //                 });
    //             }
    //         }
    //     );
    // }, false);

});
