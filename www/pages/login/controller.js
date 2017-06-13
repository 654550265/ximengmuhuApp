angular.module("app.controllers")
.controller('loginCtrl', function (RegisterService,$scope, LoginService, $timeout, $state, $ionicSlideBoxDelegate, $http) {
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
    };
    //生成随机数
    $scope.getNumRandom = function (num) {
        var result = "";
        for (var i = 0; i < num; i++) {
            result += parseInt(Math.random() * 10).toString();
        }
        return result;
    };
    //单击获取到验证码
    $scope.time = 60;
    $scope.loginData = {};
    $scope.getCodeText = "获取验证码";
    $scope.dis = false;
    $scope.reg = /^1[34578]\d{9}$/;
    $scope.getCodes = function () {
        if ($scope.loginData.tel == undefined) {
            $scope.showToast('请输入手机号');
        } else if (!$scope.reg.test($scope.loginData.tel)) {
            $scope.showToast('请输入正确的手机号');
        } else {
            $http.get(weburl + '/Api/XmApp/SendMessage', {
                params: {
                    mobile: $scope.loginData.tel,
                    content: $scope.code
                }
            }).success(function(data) {
                if(data.Status==false){
                    $scope.showToast(data.Message);
                }else if(data.Status==true){
                    $scope.showToast("验证码发送成功");
                    //倒计时
                    $scope.code = $scope.getNumRandom(4);
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
                }
            }).error(function() {
            });
        }
    }
    $scope.back = function () {
        $state.go('login');
    }
    //手机注册成功
    $scope.telUpData = function () {
        if($scope.loginData.tel==undefined){
            $scope.showToast('手机号不能为空');
        }else if(!$scope.reg.test($scope.loginData.tel)){
            $scope.showToast('请输入正确的手机号');
        }else if($scope.loginData.code==undefined){
            $scope.showToast('验证码不能为空');
        }else if($scope.code!=$scope.loginData.code){
            $scope.showToast('请输入正确的验证码');
        }else if($scope.loginData.pwd.length<6){
            $scope.showToast('密码长度必须大于6位');
        }else if($scope.loginData.pwd.length>32){
            $scope.showToast('密码长度必须小于32位');
        }else if($scope.loginData.pwd!=$scope.loginData.pwdTwo){
            $scope.showToast('两次密码输入不正确');
        }else{
            LoginService.UserRegister({
                mobile: $scope.loginData.tel,
                password: $scope.loginData.pwd,
                roleType:3
            }).success(function(res){
                localStorage.setItem("first","true");
                if(res.Status==true){
                    localStorage.setItem("register","true");
                    localStorage.setItem("tel",$scope.loginData.tel);
                    $scope.back();
                }else if(res.Status==false){
                    $scope.showToast(data.Message);
                }
            }).error(function(){
            });
        }
    }
    //用户登录功能
    $scope.login=function(){
        if($scope.loginData.username==undefined){
            $scope.showToast('请输入手机号');
        }else if($scope.loginData.loginPwd==undefined){
            $scope.showToast('请输入密码');
        }else if($scope.loginData.loginPwd.length<6){
            $scope.showToast('密码必须大于6位');
        }else{
            LoginService.login({
                username: $scope.loginData.username,
                pwd: $scope.loginData.loginPwd,
                roleType:3
            }).success(function(data){
                if(data.Status==true){
                    var userMessage=JSON.stringify(data.MyObject);
                    localStorage.setItem("userMessage",userMessage);
                    UserMessage=userMessage;
                    $scope.showLoad();
                    if(localStorage.getItem("first")=="true"){
                        $timeout(function(){
                            $scope.hideLoad();
                            $state.go("mess");
                        },1000);
                    }else{
                        $timeout(function(){
                            $scope.hideLoad();
                            $state.go("tab.farm");
                        },1000);
                    }
                }else if(data.Status==false){
                    $scope.showToast(data.Message);
                }
            }).error(function(){

            });
        }
    }
    $scope.goto = function (type) {
        $state.go(type);
    };
    //用户名注册
    $scope.UserNameRegister=function(){
        if($scope.loginData.UserName==undefined){
            $scope.showToast('请输入用户名');
        }else if($scope.loginData.Userpwd==undefined){
            $scope.showToast('密码不能为空');
        }else if($scope.loginData.Userpwd.length<6){
            $scope.showToast('密码长度必大于六位');
        }else if($scope.loginData.Userpwd!=$scope.loginData.UserpwdTwo){
            $scope.showToast('两次密码输入不正确');
        }else{
            RegisterService.Register({
                mobile: $scope.loginData.UserName,
                password: $scope.loginData.Userpwd,
                roleType:3
            }).success(function(res){
                localStorage.setItem("first","true");
                if(res.Status==false){
                    $scope.showToast(res.Message);
                }else{
                    $state.go("login");
                }
            })
        }
    }
    $scope.focus=function(){
        document.getElementsByClassName("register-text")[0].style.display="none";
        document.getElementsByClassName("register-box")[0].style.display="none";
    }
    $scope.blur=function(){
        document.getElementsByClassName("register-text")[0].style.display="block";
        document.getElementsByClassName("register-box")[0].style.display="block";
    }
})
