angular.module('app.controllers')

.controller('loginCtrl', function($scope, $timeout, $state, LoginService, $ionicModal, $ionicPlatform) {

    $scope.gotoLogin = function(){
        $state.go("login");
    };

    $scope.loginData = {
        username: '',
        pwd: ''
    };

    $scope.doLogin = function() {
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
        LoginService.login($scope.loginData).success(function(data) {
            if (data.Status === true && data.Message == "登陆成功") {
                user = data.MyObject;
                authority = data.AMyObject == null ? [] : data.AMyObject ;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('authority', JSON.stringify(authority));
                if (regID !== '') {
                    $scope.savePush();
                }
                $timeout(function() {
                    $scope.hideLoad();
                    $state.go("tab.farm");
                    document.addEventListener("deviceready", onDeviceReady, false);
                    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
                    document.addEventListener('deviceready', function() {
                        window.plugins.jPushPlugin.isPushStopped(function(data){
                            if(data === 1){
                                window.plugins.jPushPlugin.resumePush();
                            }
                        }); 
                    }, false);
                }, 1000);
            } else {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.goto = function(type){
        $state.go(type);
    };

    $scope.regData = {};
    $scope.time = 60;
    $scope.isSend = false; 
    $scope.SendMessage = function(type){
        var timeInterval = null;
        if ($scope.regData.mobile == undefined) {
            $scope.showToast('请输入手机号');
            return false;
        }
        var reg = /^1[0-9]{10}$/;
        if (!reg.test($scope.regData.mobile)) {
            $scope.showToast('您输入的手机号有误');
            return false;
        }
        $scope.showLoad();
        var code = getNumRandom(4);
        localStorage.setItem('code', JSON.stringify(code));
        LoginService.SendMessage($scope.regData.mobile, code, type).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.isSend = true;
                timeInterval = setInterval(function() {
                    if($scope.time>0){
                        $scope.time--;
                        $scope.$apply();
                    }else{
                        clearInterval(timeInterval);
                        $scope.isSend = false;
                        $scope.time = 60;
                        $scope.$apply();
                    }
                }, 1000);
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.isAgree = true;
    $ionicModal.fromTemplateUrl('./pages/login/protocol.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.protocolModal = modal;
    });

    $scope.viewProtocol = function(){
        $scope.protocolModal.show();
    };

    $scope.agree = function(){
        $scope.isAgree = true;
        $scope.protocolModal.hide();
    };

    $scope.doReg = function() {
        var reg = /^1[0-9]{10}$/;
        var code =  JSON.parse(localStorage.getItem('code'));
        if (!reg.test($scope.regData.mobile)) {
            $scope.showToast('您输入的手机号有误');
            return false;
        }
        if(code != $scope.regData.code){
            $scope.showToast('验证码输入有误，请重新获取');
            return false;
        }
        if (!$scope.regData.roleType) {
            $scope.showToast('请选择你的职位');
            return false;
        }
        if ($scope.regData.pwd.length < 6) {
            $scope.showToast('密码必须大于6位');
            return false;
        } else if ($scope.regData.pwd  != $scope.regData.pwdtwo) {
            $scope.showToast('两次密码输入不一致');
            return false;
        }
        $scope.showLoad();
        LoginService.UserRegister($scope.regData.mobile, $scope.regData.pwd, $scope.regData.roleType).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast('注册成功');
                $state.go("login");
            } else {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.doForget = function() {
        var reg = /^1[0-9]{10}$/;
        var code =  JSON.parse(localStorage.getItem('code'));
        if ($scope.regData.mobile == undefined) {
            $scope.showToast('请输入手机号');
            return false;
        }
        if (!reg.test($scope.regData.mobile)) {
            $scope.showToast('您输入的手机号有误');
            return false;
        }
        if(code != $scope.regData.code){
            $scope.showToast('验证码输入有误，请重新获取');
            return false;
        }
        if ($scope.regData.pwd == undefined) {
            $scope.showToast('请输入密码');
            return false;
        } else if ($scope.regData.pwd.length < 6) {
            $scope.showToast('密码必须大于6位');
            return false;
        } else if ($scope.regData.pwd  != $scope.regData.pwdtwo) {
            $scope.showToast('两次密码输入不一致');
            return false;
        }
        $scope.showLoad();
        LoginService.UserForget($scope.regData.mobile, $scope.regData.pwd).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast('重置成功');
                $state.go("login");
            } else {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
});