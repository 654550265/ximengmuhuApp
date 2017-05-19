angular.module("app.controllers")
.controller('loginCtrl', function ($scope, LoginService, $timeout, $state, $ionicSlideBoxDelegate, $http, $timeout) {
    $scope.buttonBar = [{
        name: "手机号注册",
        active: 1
    }, {
        name: "用户名注册",
        active: 0
    }];
    //手机注册和帐号注册的切换
    $scope.slideHasChanged = function (chooseIndex) {
        $scope.buttonBar.forEach(function (item, index) {
            if (chooseIndex == index) {
                item.active = 1;
            } else {
                item.active = 0;
            }
        });
        $ionicSlideBoxDelegate.slide(chooseIndex);
    }
    //生成随机数
    $scope.getNumRandom = function (num) {
        var result = "";
        for (var i = 0; i < num; i++) {
            result += parseInt(Math.random() * 10).toString();
        }
        return result;
    }
    //单击获取到验证码
    $scope.time = 60;
    $scope.loginData = {};
    $scope.getCodeText = "获取验证码";
    $scope.dis = false;
    $scope.getCodes = function () {
        var reg = /^1[34578]\d{9}$/;
        if ($scope.loginData.tel == undefined) {
            $scope.showToast('请输入手机号');
        } else if (!reg.test($scope.loginData.tel)) {
            $scope.showToast('请输入正确的手机号');
        } else {
            //倒计时
            var code = $scope.getNumRandom(4);
            timeInterval = setInterval(function () {
                if ($scope.time > 0) {
                    $scope.dis = true;
                    $scope.time--;
                    $scope.getCodeText = $scope.time + "秒后重新获取";
                    $scope.$apply();
                } else {
                    clearInterval(timeInterval);
                    $scope.dis = false;
                    $scope.time = 60;
                    $scope.getCodeText = "重新获取";
                    $scope.$apply();
                }
            }, 1000);
            // $http({
            //   url:appurl+"Api/XmApp/UserRegister",
            //   method:'GET',
            //   params:{
            //     mobile:$scope.loginData.tel,
            //     roleType:3
            //   }
            // }).then(function(res){
            //   $scope.list=res.data.data;
            // },function(){
            // });
        }
    }
    $scope.back = function () {
        $state.go('login');
    }
    $scope.telUpData = function () {

    }
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
