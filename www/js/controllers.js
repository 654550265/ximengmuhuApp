angular.module('starter.controllers', [])
    .controller('CommonCtrl', function ($scope) {

    })
    .controller('MessageCtrl', function ($scope) {

    })
    .controller('loginCtrl', function ($scope, LoginService, $timeout, $state) {
        $scope.buttonBar = [{
            name: "手机号注册",
            active: 1
        }, {
            name: "用户名注册",
            active: 0
        }];
        $scope.gotoLogin = function () {
            $state.go("login");
        };
        $scope.loginData = {
            username: '',
            pwd: ''
        };
        $scope.doLogin = function () {
            firstrun = false;
            localStorage.setItem('firstrun', firstrun);
            if ($scope.loginData.username == undefined) {
                $scope.showToast('请输入用户名');
                return false;
            }
            if ($scope.loginData.pwd == undefined) {
                $scope.showToast('请输入密码');
                return false;
            } else if ($scope.loginData.pwd.length < 6) {
                $scope.showToast('密码必须大于6位');
                return false;
            }
            $scope.showLoad();
            LoginService.login($scope.loginData).success(function (data) {
                if (data.Status === true && data.Message == "登陆成功") {
                    user = data.MyObject;
                    authority = data.AMyObject == null ? [] : data.AMyObject;
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('authority', JSON.stringify(authority));
                    if (regID !== '') {
                        $scope.savePush();
                    }
                    $timeout(function () {
                        $scope.hideLoad();
                        $state.go("tab.farm");
                        document.addEventListener("deviceready", onDeviceReady, false);
                        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
                        document.addEventListener('deviceready', function () {
                            window.plugins.jPushPlugin.isPushStopped(function (data) {
                                if (data === 1) {
                                    window.plugins.jPushPlugin.resumePush();
                                }
                            });
                        }, false);
                    }, 1000);
                } else {
                    // $scope.hideLoad();
                    // $scope.showToast(data.Message);
                }
            }).error(function (data) {
                // $scope.hideLoad();
                // $scope.showToast(data.Message);
            });
        };
        $scope.goto = function (type) {
            $state.go(type);
        };
    })
    .controller('ServiceCtrl', function ($scope) {

    })
    .controller('AccountCtrl', function ($scope) {

    })
    .controller('FarmCtrl', function ($scope, $state) {
       /* if (window.localStorage.firstrun === "false") {
            $state.go("login");
        }*/
    });



