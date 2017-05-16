angular.module('app.controllers').controller('myCardCtrl', function($scope, $ionicTabsDelegate, AccountService, $state, $ionicModal, MessageService, QQLbsService, $cordovaActionSheet, $cordovaFileTransfer, $ionicLoading) {
    /*我的名片界面*/
    $scope.userInofromation = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        Id: user.Id
    };
    var useInfo = null;
    $scope.goToMyCard = function() {
        AccountService.getPersonalinformation($scope.userInofromation).success(function(data) {
            useInfo = data.MyObject;
            $scope.showMyInformation = {
                avatar: uploadurl + useInfo.pRemark,
                sex: useInfo.psex,
                phoneNumber: useInfo.pMobilePhoneNumber,
                name: useInfo.pname,
                myname: useInfo.pmyname,
                email: useInfo.pEmailAddress,
                location: useInfo.pProvince + useInfo.pCity
            };
            if(useInfo.pRemark == null){
                $scope.showMyInformation.avatar = "img/user.png";
            }
        }).error(function() {
            console.log("没获取到信息");
        });
        $ionicTabsDelegate.showBar(false);
    };
    $scope.goToMyCard();

    $scope.backToAccount = function() {
        $state.go('tab.account');
        $ionicTabsDelegate.showBar(true);
    };

    /*我的名片设置界面*/

    $scope.getMyInformation = function(sendData) {
        AccountService.getPersonalinformation(sendData).success(function(data) {
            useInfo = data.MyObject;
            $scope.showMyInformation = {
                avatar: uploadurl + useInfo.pRemark,
                sex: useInfo.psex,
                phoneNumber: useInfo.pMobilePhoneNumber,
                myname: useInfo.pmyname,
                email: useInfo.pEmailAddress,
                Province: useInfo.pProvince,
                City: useInfo.pCity,
                location: useInfo.pProvince + useInfo.pCity
            };
            if(useInfo.pRemark == null){
                $scope.showMyInformation.avatar = "img/user.png";
            }
        }).error(function() {
            console.log("设置失败");
        });
    };

    $scope.showSetMyCard = function() {
        $ionicModal.fromTemplateUrl('./pages/account/my-card/set-my-card.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.setMyCardModal = modal;
            $scope.setMyCardModal.show();
            $scope.member = {
                avatar: uploadurl + useInfo.pRemark,
                SysDepID: user.PeID,
                SysRoleID: user.RoleId,
                Id: user.Id,
                MyName: $scope.showMyInformation.myname,
                Sex: $scope.showMyInformation.sex,
                MobilePhoneNumber: $scope.showMyInformation.phoneNumber,
                Province: useInfo.pProvince,
                City: useInfo.pCity,
                EmailAddress: $scope.showMyInformation.email
            };
            if(useInfo.pRemark == null){
                $scope.member.avatar = "img/user.png";
            }
        });
    };

    $scope.saveMyInfo = function() {
        $scope.showLoad();
        AccountService.getModifypersonalinformation($scope.member).success(function(data) {

            if (data.Status == true) {
                $scope.showToast("保存成功");
                $scope.setMyCardModal.hide();
                $scope.getMyInformation($scope.member);
            }
            $scope.hideLoad();
        }).error(function() {
            $scope.hideLoad();
            $scope.showToast("保存失败");
        });
    };


    /*城市选择*/
    $ionicModal.fromTemplateUrl('./pages/account/my-card/mudi.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mudiModal = modal;
    });

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
                $scope.mudiModal.show();
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
        $scope.member.Province = $scope.mudi.provinceName;
        $scope.member.City = $scope.mudi.cityName;
        $scope.mudiModal.hide();
    };
    /*我的二维码*/

    $ionicModal.fromTemplateUrl('./pages/account/my-card/my-qr-card.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.myQRCodeModal = modal;
    });

    $scope.showMyQRCode = function() {
        $scope.user = user;
        $scope.mycard = "";
        $scope.showLoad();
        MessageService.GetUserQR(user.Name).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null) {
                    $scope.mycard = uploadurl + user.Name + ".jpg";
                }
            }
            $scope.myQRCodeModal.show();
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
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
            }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, targetWidth: 500, targetHeight: 500 });
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
                $scope.member.Remark = UploadOptions.fileName;
            }, function(err) {
                $scope.hideLoad();
                $scope.showToast("上传失败，请检查网络连接是否正常！");
            }, function(progress) {
                var intProgress = (progress.loaded / progress.total) * 100;
                $ionicLoading.show({
                    template: '上传中：' + parseInt(intProgress) + '%'
                });
                if(intProgress > 99){
                    $scope.hideLoad();
                }
            });
        }, false);
    };

    // $scope.changeAvatar = function() {
    //     var options = {
    //         title: '请选择',
    //         buttonLabels: ['拍照', '相册'],
    //         addCancelButtonWithLabel: '取消',
    //         androidEnableCancelButton: true,
    //     };
    //     document.addEventListener("deviceready", function() {
    //         $cordovaActionSheet.show(options)
    //             .then(function(btnIndex) {
    //                 var index = btnIndex;
    //             });
    //     }, false);
    // };



});
