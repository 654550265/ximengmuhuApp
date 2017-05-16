angular.module('app.controllers').controller('farmCtrl', function($scope, $http, $window, $interval, $timeout, $cordovaContacts, $ionicTabsDelegate, $ionicPopup, FarmService,$cordovaFileTransfer, $ionicSlideBoxDelegate, $cordovaDatePicker, $state, $ionicModal, InitService, QQLbsService, $ionicScrollDelegate, ServiceService, SearchService, $ionicLoading, $ionicPlatform, ForemanService, AnalyticsService, $cordovaGeolocation) {

    AnalyticsService.trackView('农场页面');

    $scope.fheight = $window.innerHeight - 48 + 'px';
    $scope.mapheight = $window.innerHeight - 44 + 'px';
    $scope.farms = [];
    $scope.currenrPens = [];
    $scope.farmFeed = {};
    $scope.farmVaccination = {};
    $scope.farmCure = {};
    $scope.farmDeath = {};
    $scope.isShowPen = true;
    $scope.isShowAdd = false;
    $scope.topbtns = false;
    $scope.isShowWeather = false;
    $scope.showHelp1 = false;
    $scope.showHelp2 = true;
    $scope.isSliding = false;
    $scope.switchHeaderNavBar = true;
    $scope.editZrr = true;
    $scope.mangeHasShow = false;
    $scope.showPlainList = [];
    $scope.photoImg = null;    //保存拍好的照片
    if(user.RoleType == 3) {
        $scope.isFarmer = true;
    } else {
        $scope.isFarmer = false;
    }
	var earType = null;
    var farmCurrentIndex = null;

    //检查  是否具有此权限
    function checkHasThisAuthority(superName, subName, subName2) {
        var result = false;
        if($scope.currentAuthority.length >= 1){
            var superAuthority = $scope.currentAuthority[0].Items.filter(function (val, index) {
                return val.Url == superName;
            });
            superAuthority = superAuthority[0].Items.filter(function (val, index) {
                return val.Url == subName;
            });
            result = superAuthority[0].Items.some(function (val) {
                return val.Url == subName2;
            });
        }
        return result;
    }

    //根据第几个农场 返回当前农场数组,且 农场的动物数 大于0
    function returnCurrentPensList(farmCurrentIndex) {
        var currentPensList = [];
        for (var i = 0; i < $scope.farms[farmCurrentIndex].penslist.length; i++) {
            currentPensList = currentPensList.concat($scope.farms[farmCurrentIndex].penslist[i]);
        }
        currentPensList = currentPensList.filter(function(val, index, array) { //$scope.nPlains 当前农场栏位
            return parseInt(val.plannum) > 0;
        });
        return currentPensList;
    }

    /*s获取权限对象*/
    $scope.authoritySendData = {
        userid: user.Id,
        uname: user.Name,
        depId: user.PeID,
        roleId: user.RoleId
    };
    $scope.GetUserFarmRoleList = function () {
        InitService.GetUserFarmRoleList($scope.authoritySendData).success(function (data) {
            authority = data.MyObject == null ? [] : data.MyObject;
            localStorage.setItem('authority', JSON.stringify(authority));
        }).error(function (data) {
            $scope.showToast(data);
        });
    };
    // $scope.GetUserFarmRoleList();
    /*e获取权限对象*/
    /*s-天气*/
    $scope.weather = {};

    function getNewWeatherData(index) {
        //var site = farms[index].CommAddress.slice(0, farms[index].CommAddress.indexOf('市'));
        var site = '锡林浩特';
        FarmService.GetWeather(site).success(function(data) {
            $scope.weather = {};
            $scope.weather.site = site;
            $scope.weather.temperature = data.HeWeather5[0].hourly_forecast[0].tmp + "℃";
            $scope.weather.wData = data.HeWeather5[0].hourly_forecast[0].cond.txt;
            $scope.weather.weatherPic = weatherData[$scope.weather.wData];
        }).error(function() {
            console.log('没有获取天气信息');
        });
    }

    if (farms != null) {
        $timeout(function() {
            $scope.weather.temperature = "12℃";
            $scope.weather.weatherPic = "img/overcast.png";
            $scope.weather.site = "锡林浩特";
            getNewWeatherData(0);
        }, 1000);
    } else {
        $scope.isShowPen = false;
    }

    /*e-天气*/
    /*新手引导页面*/
    if (runtiems <= 1 && $scope.farms.length == 0) { /*<=1 要改*/
        $timeout(function() {
            $scope.topbtns = true;
            $scope.isShowWeather = true;
            /*$scope.newhelpModal.show();*/
            $scope.showHelp1 = true;
            runtiems++;
            localStorage.setItem('runtiems', runtiems);
        }, 500);
    } else {
        $scope.showHelp1 = false;
    }

    $scope.hideHelp1 = function() {
        $scope.showHelp1 = false;
    };

    $scope.step01 = function() {
        $scope.newHelpStep1 = false;
        $scope.newHelpStep2 = true;
        $scope.newHelpStep3 = false;
    };

    $scope.step02 = function() {
        $scope.newHelpStep1 = false;
        $scope.newHelpStep2 = false;
        $scope.newHelpStep3 = true;
    };

    $scope.step03 = function() {
        $scope.newHelp03 = false;
        addFarmTimes++;
        localStorage.setItem('addFarmTimes', addFarmTimes);
        $ionicTabsDelegate.showBar(true);
    };

    /*s-搜索*/
    $scope.editOn = false;
    $scope.sendPNO = {
        PNO: ""
    };
    $scope.showSearch = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/search.html', {                                    //./pages/farm/search.html
            scope: $scope
        }).then(function(modal) {
            $scope.currentPage = "search";
            $scope.searchModal = modal;
            $scope.searchModal.show();
            // $timeout(function() {
            //     document.getElementById('focusme').focus();
            // }, 0);
        });
    };

    $scope.hideSearch = function() {
        $scope.currentPage = "";
        $scope.sendPNO.PNO = "";
        $scope.searchModal.remove();
    };

    $scope.animalInformation = {};
    $scope.searchDetail = false;//标记详情页面是否打开
    $scope.showSearchDetailsModal = function() {
        $scope.showLoad();
        FarmService.SerachPNO($scope.sendPNO).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                if (!!data.MyObject.PNO || !!data.MyObject.PPZ) {
                    $scope.animalInformation = data.MyObject;
                    $ionicModal.fromTemplateUrl('./pages/farm/search-details.html', {
                        scope: $scope
                    }).then(function(modal) {
                        $scope.searchDetailsModal = modal;
                        if(!$scope.searchDetail){
                            $scope.searchDetailsModal.show();
                            $scope.searchDetail = true;
                        }
                    });
                    // if($scope.animalInformation.PFlag === 1){
                    //     $scope.editOn = true;
                    // }else{
                    //     $scope.editOn = false;
                    // }
                } else {
                    $scope.showToast('不存在此号');
                    $scope.results = '';
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
		/*个体 农事 详情!   */
	$scope.showSingleFarmInfo = function () {

		$scope.CheckFarmSendInfo = {
			sysDepId: user.PeID,
			sysRoleId: user.RoleId,
			page: 1,
			psize: 6,
			timeasc: 0,
			intype: 0
		};
		$scope.CheckFarmSendInfo.pno = $scope.sendPNO.PNO;

		$ionicModal.fromTemplateUrl('./pages/farm/single-list.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.searchSingleListModal = modal;
			$scope.searchSingleListModal.show();

			FarmService.GetFarmRecordList($scope.CheckFarmSendInfo).success(function(data) {
				console.log($scope.CheckFarmSendInfo);
				$scope.hideLoad();
				if (data.Status === true) {
					$scope.FarmDetailsList = $scope.FarmDetailsList.concat(data.MyObject);
					$scope.CheckFarmSendInfo.page = ++$scope.CheckFarmSendInfo.page;
				}
				if (data.Status === true && data.MyObject.length < $scope.CheckFarmSendInfo.psize) {
					$scope.farmDetailCanPullDown = false;
				}
			}).error(function(data) {
				$scope.hideLoad();
				$scope.showAlert(data.Message);
			});

		});
	};

		/*退出个体  农事详情页 */
	$scope.singleFarmInfoExit = function () {
		$scope.CheckFarmSendInfo = {
			sysDepId: user.PeID,
			sysRoleId: user.RoleId,
			page: 1,
			psize: 6,
			timeasc: 0,
			intype: 0
		};
		$scope.searchSingleListModal.remove();
		$scope.FarmDetailsList = [];
	};

    $scope.hideSearchDetailsModal = function() {
        $scope.searchDetailsModal.remove();
        $scope.animalInformation = {};
        $scope.editOn = false;
        $scope.searchDetail = false;
    };

    $scope.editSearchDetail = function() {
        $scope.editOn = !$scope.editOn;
    };

    $scope.saveSearchDetail = function() {
        $scope.editOn = !$scope.editOn;
    };

    $scope.getPPZ = function() {
        $scope.PPZs = [];
        SearchService.PPZ($scope.animalInformation.Id, $scope.animalInformation.PType).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                $scope.PPZs = data.MyObject;
                $ionicModal.fromTemplateUrl('./pages/farm/search-PPZ.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.searchPPZModal = modal;
                    $scope.searchPPZModal.show();
                });
            } else {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.setPPZ = function(item) {
        $scope.animalInformation.PPZ = item.SpeciesName;
        $scope.searchPPZModal.remove();
    };

    $scope.hidePPZ = function() {
        $scope.searchPPZModal.remove();
    };

    $scope.getPFather = function() {
        $scope.PFathers = [];
        SearchService.PFather($scope.animalInformation.Id, $scope.animalInformation.PType).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                data.MyObject.map(function(item) {
                    item.checked = false;
                    $scope.PFathers.push(item);
                });
                $ionicModal.fromTemplateUrl('./pages/farm/search-PFather.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.searchPFatherModal = modal;
                    $scope.searchPFatherModal.show();
                });
            } else {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.setPFather = function(item) {
        $scope.animalInformation.PFather = item.GUId;
        $scope.animalInformation.PFatherId = item.Id;
        $scope.searchPFatherModal.remove();
    };

    $scope.hidePFather = function() {
        $scope.searchPFatherModal.remove();
    };

    $scope.getPMohter = function() {
        $scope.PMohters = [];
        SearchService.PMohter($scope.animalInformation.Id, $scope.animalInformation.PType).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                $scope.PMohters = data.MyObject;
                $ionicModal.fromTemplateUrl('./pages/farm/search-PMohter.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.searchPMohterModal = modal;
                    $scope.searchPMohterModal.show();
                });
            } else {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.setPMohter = function(item) {
        $scope.animalInformation.PMohter = item.GUId;
        $scope.animalInformation.PMohterId = item.Id;
        $scope.searchPMohterModal.remove();
    };

    $scope.hidePMohter = function() {
        $scope.searchPMohterModal.remove();
    };

    $scope.update = function() {
        SearchService.update($scope.animalInformation).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                $scope.showToast("保存成功");
                $scope.editOn = false;
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    /*e-搜索*/
    /*s -替换地图功能的单号领取按钮 */
    $scope.getOddNums = function () {
        $scope.showLoad();
        FarmService.GetUserEarTagHistory().success(function (data) {
            $scope.hideLoad();
            if(data.Status === true){
                $scope.oddNumsInfo = data.MyObject;
                $ionicModal.fromTemplateUrl('./pages/farm/get-odds.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.getOddsModal = modal;
                    $scope.getOddsModal.show();
                });
            } else {
                $scope.showToast('没有单号领取记录');
            }
        }).error(function (data) {
            $scope.hideLoad();
            $scope.showToast('没有单号领取记录');
        });
    };

    $scope.exitGetOdds = function () {
        $scope.getOddsModal.remove();
    };

    /*e -替换地图功能的单号领取按钮 */

    /*s-地图*/
    $scope.showMap = function() {
        if(window.cordova && myposition === null){
            var posOptions = { timeout: 10000, enableHighAccuracy: true };
            $scope.showLoad();
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
                QQLbsService.getqqgps(position.coords.latitude + "," + position.coords.longitude).success(function(data) {
                    $scope.hideLoad();
                    if (data.status === 0) {
                        myposition = {
                            latitude: data.locations[0].lat,
                            longitude: data.locations[0].lng
                        };
                        localStorage.setItem('myposition', JSON.stringify(position));
                        $scope.drawMap();
                    }
                }).error(function(data) {
                    $scope.hideLoad();
                    $scope.showAlert(data.Message);
                });
            }, function(err) {
                $scope.hideLoad();
                $scope.showToast("未获取到您的GPS信息，请检查手机是否开启定位服务");
            });
        }else{
            $scope.drawMap();
        }
    };

    $scope.drawMap = function(){
        $ionicModal.fromTemplateUrl('./pages/farm/map.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.mapModal = modal;
            $scope.mapModal.show();
            var center = null;
            if(window.cordova){
                center = new qq.maps.LatLng(myposition.latitude, myposition.longitude);
            }else{
                center = new qq.maps.LatLng(39.916527,116.397128);
            }
            var map = new qq.maps.Map(document.getElementById("container"), {
                zoom: 9,
                center: center
            });
            for (var i = 0; i < $scope.farms.length; i++) {
                if($scope.farms[i].CommGPS){
                    var markerpostion = $scope.farms[i].CommGPS.split(",");
                    var marker = new qq.maps.Marker({
                        position: new qq.maps.LatLng(markerpostion[0],markerpostion[1]),
                        map: map
                    });
                    var info = new qq.maps.InfoWindow({
                        map: map
                    });
                    info.open(); 
                    info.setContent('<div style="text-align:center;white-space:nowrap;'+
                    'margin:10px;">'+$scope.farms[i].CommName+'</div>');
                    info.setPosition(new qq.maps.LatLng(markerpostion[0],markerpostion[1]));
                    qq.maps.event.addListener(marker, 'click', function() {
                    });
                }
            }
        });
    };

    $scope.hideMap = function() {
        $scope.mapModal.remove();
    };

    $scope.updatePMember = function() {
        $scope.PMohters = [];
        SearchService.PMohter($scope.animalInformation.Id, $scope.animalInformation.PType).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                $scope.PMohters = data.MyObject;
                $ionicModal.fromTemplateUrl('./pages/farm/search-PMohter.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.searchPMohterModal = modal;
                    $scope.searchPMohterModal.show();
                });
            } else {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    /*e-地图*/

    /*s-分享*/
    $scope.shareDiv = false;
    $scope.showShare = function() {
        $scope.shareDiv = true;
    };

    $scope.share = function(type) {
        if (type === "wechat") {
            if (window.cordova) {
                Wechat.share({
                    message: {
                        title: "真源智慧农场",
                        description: "打造智慧型农场，助力农牧业信息现代化。",
                        thumb: "www/img/icon.jpg",
                        mediaTagName: "weixin-001",
                        messageExt: "分享",
                        messageAction: "<action>dotalist</action>",
                        media: {
                            type: Wechat.Type.LINK,
                            webpageUrl: weChatUrl + "/share/wechat"
                        }
                    },
                    scene: Wechat.Scene.SESSION
                }, function() {
                    $scope.showToast("分享成功");
                }, function(reason) {
                    $scope.showToast(reason);
                });
            }
        } else if (type === "timeline") {
            if (window.cordova) {
                Wechat.share({
                    message: {
                        title: "真源智慧农场",
                        description: "打造智慧型农场，助力农牧业信息现代化。",
                        thumb: "www/img/icon.jpg",
                        mediaTagName: "weixin-002",
                        messageExt: "朋友圈",
                        messageAction: "<action>dotalist</action>",
                        media: {
                            type: Wechat.Type.LINK,
                            webpageUrl: weChatUrl + "/share/wechat"
                        }
                    },
                    scene: Wechat.Scene.TIMELINE
                }, function() {
                    $scope.showToast("分享成功");
                }, function(reason) {
                    $scope.showToast(reason);
                });
            }
        } else if (type === "weibo") {
            $scope.showToast("暂未开通");
        } else if (type === "qq") {
            $scope.showToast("暂未开通");
        } else if (type === "qzone") {
            $scope.showToast("暂未开通");
        }
    };
    /*e-分享*/
    /*时间插件*/
    $scope.getDate = function(name) {
        var crudate = null;
        if (window.cordova) {
            document.addEventListener("deviceready", function() {
                var options = {
                    date: new Date(),
                    mode: 'date', // or 'time'
                    allowOldDates: true,
                    allowFutureDates: false,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };
                $cordovaDatePicker.show(options).then(function(date) {
                    if (name == "manage") {
                        crudate = moment(date).format('YYYY-MM-DD hh:mm');
                        $scope.manage.NowDate = crudate;
                        $timeout(function() {
                            if ($scope.showA == true) {
                                $scope.manage.ShowDate = moment(date).format('YYYY年MM月DD日');
                            } else if ($scope.showB == true) {
                                $scope.manage.ShowDate = moment(date).format('YYYY年MM月');
                            } else if ($scope.showC == true) {
                                $scope.manage.ShowDate = moment(date).format('YYYY年');
                            }
                        }, 50);
                    } else {
                        crudate = moment(date).format('YYYY-MM-DD');
                        /*MM-DD hh:mm*/
                    }
                    $scope.setDate(name, crudate);
                });
            }, false);
        } else {
            crudate = moment(new Date()).format('YYYY-MM-DD');
            /*MM-DD hh:mm*/
            $scope.setDate(name, crudate);
        }
    };

    $scope.setDate = function(name, crudate) {
        switch (name) {
            case "taotai":
                $timeout(function() {
                    $scope.out.date = crudate;
                }, 50);
                break;
            case "entry":
                $timeout(function() {
                    $scope.entry.date = crudate;
                }, 50);
                break;
            case "purchase":
                $timeout(function() {
                    $scope.purchase.NowDate = crudate;
                }, 50);
                break;
            case "feed":
                $timeout(function() {
                    $scope.farmFeed.SysDate = crudate;
                }, 50);
                break;
            case "vaccination":
                $timeout(function() {
                    $scope.farmVaccination.SysDate = crudate;
                }, 50);
                break;
            case "cure":
                $timeout(function() {
                    $scope.farmCure.SysDate = crudate;
                }, 50);
                break;
            case "sign":
                $timeout(function() {
                    $scope.purchase.SignDate = crudate;
                }, 50);
                break;
            case "market":
                $timeout(function() {
                    $scope.market.NowDate = crudate;
                }, 50);
                break;
            case "PBirth":
                $timeout(function() {
                    $scope.animalInformation.PBirth = crudate;
                }, 50);
                break;
            case "PProDate":
                $timeout(function() {
                    $scope.animalInformation.PProDate = crudate;
                }, 50);
                break;
        }
    };
    var farmIDArray = [];
    /*农场生成！*/
    $scope.getFarms = function(from) {
        $scope.showLoad();
        FarmService.list().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null && data.MyObject.length > 0) {
                    $scope.farmList = data.MyObject;
                    data.MyObject.forEach(function(item, index) {
                        farmIDArray.push(item.CommID);
                        if(from === 'add'){
                            $scope.currentFarmID = farmIDArray[farmIDArray.length-1];
                        }else{
                            $scope.currentFarmID = farmIDArray[0];
                        }
                        item.penslist.forEach(function(val, index) {
                            val.CommName = item.CommName;
                        });
                        $scope.showPlainList = $scope.showPlainList.concat(item.penslist);
                    });
                    InitService.GetUserFarmRoleList($scope.authoritySendData).success(function (data) {
                        authority = data.MyObject == null ? [] : data.MyObject;
                        localStorage.setItem('authority', JSON.stringify(authority));
                        $scope.currentAuthority = authority.filter(function (val, index, array) {
                            return val.FarmId ==  $scope.currentFarmID;
                        });
                    }).error(function (data) {
                        $scope.showToast(data);
                    });
                    $scope.showPlainList = $scope.showPlainList.filter(function(val) {
                        return val.plannum > 0;
                    });
                    $scope.farms = data.MyObject.map(function(item, index) {
                        item.showPlain = false;
                        item.showactions = false;
                        if (index === 0) {
                            $scope.currenrPens = item.penslist;
                        }
                        if (item.CommName.length >= 5) {
                            $scope.isShowCommname = true;
                        } else {
                            $scope.isShowCommname = false;
                        }
                        item.pensLength = item.penslist.length;
                        item.allpens = item.penslist;
                        item.penslist.push({});
                        item.penslist = chunk(item.penslist, 3);
                        return item;
                    });
                    localStorage.setItem('farms', JSON.stringify($scope.farms));
                    localStorage.setItem('farmsNum', $scope.farms.length);
                    farms = $scope.farms;
                    farmsNum = $scope.farms.length;
                    $ionicSlideBoxDelegate.update();
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.getFarms('');

    $scope.options = {
        loop: false,
        effect: 'slide',
        speed: 500
    };
    /*农场界面滑动*/
    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
        $scope.slider = data.slider;
        farmCurrentIndex = data.slider.activeIndex;  //0
    });
    $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
        if (data.slider.activeIndex === $scope.farms.length) {
            $timeout(function() {
                $scope.isShowPen = false;
            }, 0);
        } else {
            $timeout(function() {
                $scope.isShowPen = true;
            }, 0);
        }
        $scope.isSliding = true;

        farmCurrentIndex = data.slider.activeIndex;
        $scope.currentFarmID = farmIDArray[farmCurrentIndex];
        $scope.currentAuthority = authority.filter(function (val, index, array) {
            return val.FarmId ==  $scope.currentFarmID;
        });

        $scope.isDeletePen = false;
        $scope.weather = {
            weatherPic: "",
            temperature: "",
            site: ''
        };
        if (farmCurrentIndex < farms.length) {
            getNewWeatherData(farmCurrentIndex);
        }
    });
    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        $scope.isSliding = false;
    });
    /*生成栋舍*/
    var aniamls = ['', '羊', '猪', '牛'];
    $scope.currentPen = {};
    $scope.Plains = [];
    $scope.LeftPlains = [];
    $scope.RlightPlains = [];
    $scope.nPlains = [];
    $scope.isDeletePen = false;

    $scope.wantToDeletePen = function(subpen) {
        if (!!subpen.PID) {
            $scope.isDeletePen = true;
        }
    };
    $scope.cancelWantToDeletePen = function() {
        $scope.isDeletePen = false;
    };
    $scope.deletePen = function(subpen, $event) {
        $event.stopPropagation();
        var confirmPopup = $ionicPopup.confirm({
            title: '确认是否删除',
            template: '删除之后将无法恢复原先数据，请确认',
            okText: '确认',
            cancelText: '取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                if (subpen.plannum == 0) {
                    $scope.deletedPen = {
                        Id: subpen.PID
                    };
                    $scope.showLoad();
                    FarmService.DeletePen($scope.deletedPen).success(function(data) {
                        if (data.Status === true) {
                            $scope.tmpArray = [];
                            for (var i = 0; i < $scope.farms[farmCurrentIndex].penslist.length; i++) {
                                $scope.tmpArray = $scope.tmpArray.concat($scope.farms[farmCurrentIndex].penslist[i]);
                            }
                            for (var j = 0; j < $scope.tmpArray.length; j++) {
                                if ($scope.tmpArray[j].PID == subpen.PID) {
                                    $scope.tmpArray.splice(j, 1);
                                }
                            }
                            $scope.farms[farmCurrentIndex].penslist = chunk($scope.tmpArray, 3);
                        }
                        $scope.hideLoad();
                    }).error(function(data) {
                        $scope.hideLoad();
                        $scope.showAlert(data.Message);
                    });
                } else {
                    $scope.showToast('此栋舍有牲畜，无法删除!');
                }
            } else {
                return;
            }
        });
    };
/**
 *  item :指 的是农场:
 *  subitem:指 的是栋舍
 *
 *
 * 整个函数的作用是:把栋栋舍　选起来，　展示栏位．
* */
    $scope.GetLWAll = function(item, subitem, $event) {
        if ($scope.isSliding == false) {
            $event.stopPropagation();
            if (!!subitem.PID) {
                $scope.showLoad();
                $scope.currentPen = subitem;
                $scope.chooseItem = null;
                FarmService.GetLWAll(subitem.PID).success(function(data) {
                    $scope.hideLoad();
                    $scope.tablePlains = data.MyObject;
                    $scope.activeName = subitem.PlainName;
                    $scope.activePenID = subitem.PID;
                    $scope.activeType = aniamls[subitem.PType];
                    if (data.Status === true) {
                        if (data.MyObject != null) {
                            $scope.nPlains = data.MyObject;
                            $scope.Plains = chunk(data.MyObject, 2);
                            $scope.Plains = $scope.Plains.map(function(item) {
                                item.choose = false;
                                return item;
                            });
                            var arrayLength = $scope.nPlains.length;
                            var half = Math.ceil(arrayLength / 2);
                            $scope.LeftPlains = data.MyObject.slice(0, half);
                            $scope.RlightPlains = data.MyObject.slice(half, arrayLength);
                            item.showPlain = true;
                            item.showactions = true;
                            $scope.showEntry($scope.farm[0]);
                        }
                    }
                }).error(function(data) {
                    $scope.hideLoad();
                    $scope.showAlert(data.Message);
                });
            } else {
                if (item.IsMy == 1) {
                    $ionicModal.fromTemplateUrl('pages/farm/penAdd.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        $scope.farmAddModal = modal;
                        $scope.farmAddModal.show();
                        $scope.dongshes = [];
                        $scope.addHouse();
                    });
                    $scope.noticePenAdd = true;
                    $scope.currentFarmIndex = farmCurrentIndex;
                } else if (item.IsMy == 0) {
                    return false;
                }
            }
        }
    };

    $scope.backToFarm = function() {
        $scope.farmAddModal.remove();
        $scope.dongshes = [];
    };

    $scope.addNewFarm = function() {
        if ($scope.dongshes.length <= 0) {
            $scope.showToast("请点击左侧添加栋舍按钮进行栋舍添加，取消请点返回键。");
            return false;
        }
        for (var i = 0; i < $scope.dongshes.length; i++) {
            if ($scope.dongshes[i].PlainName === "") {
                $scope.showToast("请输入栋舍名称");
                return false;
            }
            if (parseInt($scope.dongshes[i].plannum) === 0) {
                $scope.showToast("请输入栏位数量");
                return false;
            }
        }
        $scope.showLoad();
        var currentCommID = $scope.farms[farmCurrentIndex].CommID;
        InitService.UserComSystemAllAdd(currentCommID, $scope.dongshes).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.farmAddModal.hide();
                $scope.dongshes = [];

                FarmService.list().success(function(data) {
                    $scope.hideLoad();
                    if (data.Status === true) {
                        if (data.MyObject != null && data.MyObject.length > 0) {
                            $scope.farmList = data.MyObject;
                            $scope.farms = data.MyObject.map(function(item, index) {
                                item.showPlain = false;
                                item.showactions = false;
                                if (index === 0) {
                                    $scope.currenrPens = item.penslist;
                                }
                                if (item.CommName.length >= 5) {
                                    $scope.isShowCommname = true;
                                } else {
                                    $scope.isShowCommname = false;
                                }
                                item.penslist.push({});
                                item.penslist = chunk(item.penslist, 3);
                                return item;
                            });
                            localStorage.setItem('farms', JSON.stringify($scope.farms));
                            localStorage.setItem('farmsNum', $scope.farms.length);
                            farms = $scope.farms;
                            farmsNum = $scope.farms.length;
                            $ionicSlideBoxDelegate.update();
                            $scope.slider._slideTo(farmCurrentIndex);
                            getNewWeatherData(farmCurrentIndex);
                        }
                    }
                }).error(function(data) {
                    $scope.hideLoad();
                    $scope.showAlert(data.Message);
                });
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.showForeman = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/foreman.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.showForemanModal = modal;
            $scope.showForemanModal.show();
        });
    };

    $scope.wantEditZrr = function() {
        $scope.editZrr = !$scope.editZrr;
    };

    $scope.foreman = {
        plainId: "",
        yzName: "",
        yzId: "",
        fyName: "",
        fyId: ""
    };
    $scope.editZrrFunc = function(item) {
        $scope.nPlain = item;
        $scope.foreman.plainId = item.PID;
        if(item.YzyPersonID != null){
            $scope.foreman.yzId = item.YzyPersonID;
            $scope.foreman.yzName = item.YzyPerson;
        }
        if(item.FyyPersonID != null){
            $scope.foreman.fyId = item.FyyPersonID;
            $scope.foreman.fyName = item.FyyPerson;
        }
        // var activeFarm = $scope.farms[farmCurrentIndex];
        $scope.showLoad();
        $ionicModal.fromTemplateUrl('./pages/farm/editForeman.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.editZrrModal = modal;
        });
        $scope.yzPersons = [];
        $scope.fyPersons = [];
        FarmService.GetPlainRolerefUerList().success(function(data) {
            $scope.hideLoad();
            if (data.Status === true && data.MyObject != null) {
                var items = data.MyObject;
                for (var i = 0; i < items.length; i++) {
                    if(items[i].RoleName === "牧户员"){
                        $scope.yzPersons = items[i].UserItems;
                        if(item.YzyPersonID == null && $scope.yzPersons.length > 0){
                            $scope.foreman.yzId = $scope.yzPersons[0].UserId;
                            $scope.foreman.yzName = $scope.yzPersons[0].UserName;
                        }else if(item.YzyPerson === ""){
                            for (var j = 0; j < $scope.yzPersons.length; j++) {
                                if($scope.yzPersons[j].UserId === item.YzyPersonID){
                                    $scope.foreman.yzName = $scope.yzPersons[j].UserName;
                                };
                            }
                        };
                    }else if(items[i].RoleName === "防疫员"){
                        $scope.fyPersons = items[i].UserItems;
                        if(item.FyyPersonID == null && $scope.fyPersons.length > 0){
                            $scope.foreman.fyId = $scope.fyPersons[0].UserId;
                            $scope.foreman.fyName = $scope.fyPersons[0].UserName;
                        }else if(item.YzyPerson === ""){
                            for (var k = 0; k < $scope.fyPersons.length; k++) {
                                if($scope.fyPersons[k].UserId === item.FyyPersonID){
                                    $scope.foreman.yzName = $scope.fyPersons[k].UserName;
                                };
                            }
                        };
                    }
                }
                $scope.editZrrModal.show();
            }else{
                $scope.showToast("获取数据失败！");
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    
    $scope.chooseYz = function(){
        for (var i = 0; i < $scope.yzPersons.length; i++) {
            if($scope.yzPersons[i].UserId === $scope.foreman.yzId){
                $scope.foreman.yzName = $scope.yzPersons[i].UserName;
                return false;
            }
        }
    };

    $scope.chooseFy = function(){
        for (var i = 0; i < $scope.fyPersons.length; i++) {
            if($scope.fyPersons[i].UserId === $scope.foreman.fyId){
                $scope.foreman.fyName = $scope.fyPersons[i].UserName;
                return false;
            }
        }
    };

    $scope.saveForeman = function(){
        $scope.showLoad();
        FarmService.SavePlainChargeData($scope.foreman).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                for (var i = 0; i < $scope.nPlains.length; i++) {
                    if($scope.nPlains[i].PID === $scope.foreman.plainId){
                        $scope.nPlains[i].YzyPersonID = $scope.foreman.yzId;
                        $scope.nPlains[i].YzyPerson = $scope.foreman.yzName;
                        $scope.nPlains[i].FyyPersonID = $scope.foreman.fyId;
                        $scope.nPlains[i].FyyPerson = $scope.foreman.fyName;
                    }
                }
                $scope.showToast("保存成功！");

                $scope.editZrrModal.remove();
            }else{
                $scope.showToast("保存失败！");
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.chooseItem = null;
    $scope.choose = function(Plains, subitem) {   //选中栏位方法
        var change = !subitem.choose; //!
        for (var i = 0; i < Plains.length; i++) {
            var item = Plains[i];
            item.map(function(obj) {
                obj.choose = false;
                return obj;
            });
        }
        subitem.choose = change;
        if (subitem.choose === true) {
            $scope.chooseItem = subitem;
        } else {
            $scope.chooseItem = null;
        }
    };

    /*s-入栏*/
    $scope.PNOs = [];
    $scope.showEntry = function(item) {
        $scope.choose($scope.Plains, $scope.LeftPlains[0]);     //每个方法前加上这个方法, 作为默认点击第一个即可
        $scope.currentPage = "entry";
        $scope.entry = {};
        $scope.farmsLists = [];
        FarmService.GetHerdsmanList().success(function (data) {
            if (data.Status === true) {
                $scope.farmsLists = data.MyObject;
            }
        }).error(function (data) {
            $scope.showToast("没有获取农户列表");
        });
        $ionicModal.fromTemplateUrl('./pages/farm/farm-entry.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.entryModal = modal;
            $scope.showBEnter = true;
            var date = new Date();
            $timeout(function() {
                $scope.entry.date = moment(date).format('YYYY-MM-DD');
            }, 0);
            if ($scope.chooseItem != null) {
                $scope.lanwei = true;
                $scope.entry = {
                    JHNO: 'JH-' + moment(date).format('YYMMDDhhmmss'),
                    IsType: "1",
                    PlainID: $scope.chooseItem.PID,
                    PlainName: $scope.chooseItem.PlainName,
                    PCNO: moment(date).format('YYMMDDhhmmss')
                };
                if ($scope.currentPen.PType > 0) {
                    $scope.PTypeText = $scope.animalArray[$scope.currentPen.PType-1];
                    $scope.entry.IsType = $scope.currentPen.PType;
                }
                $scope.entryModal.show();
            } else {
                $scope.showToast("请选择栏位");
            }
        });
    };

    $scope.hideEntry = function() {
        $scope.PNOs = [];
        $scope.currentPage = "";
        $scope.showAEnter = false;
        $scope.showBEnter = true;
        $scope.photoImg = null;
        $scope.entryModal.remove();
        $timeout(function() {
            $scope.lanwei = false;
        }, 400);
    };

		//需要有个类型的默认值
    $scope.animalArray = ['羊', '猪', '牛'];

    /*选择牧户*/

    $scope.saveEntry = function(type) {
        $scope.entry.ImageName = $scope.photoImg;
        $scope.entry.TaskGps = $scope.gpsStr;
        if ($scope.showAEnter) {
            if ($scope.PNOs.length === 0) {
                $scope.showToast("请扫描耳标");
                return false;
            }
            $scope.entry.PCList = $scope.PNOs.join(";");
            $scope.entry.planlst = $scope.chooseItem.PID + "^" + $scope.PNOs.length + ";";
            $scope.showLoad();
            FarmService.BatchInputPlain($scope.entry).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.chooseItem.plannum = parseInt($scope.chooseItem.plannum) + parseInt($scope.PNOs.length);
                    for (var i = 0; i < $scope.Plains.length; i++) {
                        $scope.currentPen.plannum += $scope.Plains[i].plannum;
                    }
                    if (type == 1) {
                        $scope.showToast("保存成功");
                        $scope.entry.PCNum = '';
                        $scope.activeType = $scope.animalArray[$scope.entry.IsType - 1];
                    } else if (type == 2) {
                        $scope.showToast("保存成功");
                        $scope.activeType = $scope.animalArray[$scope.entry.IsType - 1];
                        $scope.hideEntry();
                    }
                } else if (data.Status === false) {
                    $scope.showToast(data.Message);
                    return false;
                }
            }).error(function(data) {
                $scope.showToast(data.Message);
                $scope.hideLoad();
            });
        }
        if ($scope.showBEnter) {
            if ($scope.isFarmer === false) {
                if($scope.ldj.chooseFarmer == undefined){
                    $scope.showToast('请选择牧户!');
                    return false;
                }
                $scope.entry.personId = $scope.ldj.chooseFarmer.Id;
            }
            if ($scope.PNOs.length === 0) {
                $scope.showToast("请扫描耳标");
                return false;
            }
            $scope.entry.PCList = $scope.PNOs.join(";");
            $scope.entry.planlst = $scope.chooseItem.PID + "^" + $scope.PNOs.length + ";";
            $scope.showLoad();
            FarmService.RLPNOPlainAll($scope.entry).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.chooseItem.plannum = parseInt($scope.chooseItem.plannum) + parseInt($scope.PNOs.length);
                    for (var i = 0; i < $scope.Plains.length; i++) {
                        $scope.currentPen.plannum += $scope.Plains[i].plannum;
                    }
                    if (type == 1) {
                        $scope.showToast("保存成功");
                        $scope.entry.PCNum = '';
                        $scope.activeType = $scope.animalArray[$scope.entry.IsType - 1];
                    } else if (type == 2) {
                        $scope.showToast("保存成功");
                        $scope.activeType = $scope.animalArray[$scope.entry.IsType - 1];
                        $scope.hideEntry();
                    }
                } else if (data.Status === false) {
                    $scope.showToast(data.Message);
                    return false;
                }
            }).error(function(data) {
                $scope.showToast(data.Message);
                $scope.hideLoad();
            });
        }
    };
    /*e-入栏*/

    /*s-喂养*/
    $ionicModal.fromTemplateUrl('./pages/farm/farm-feed.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.feedModal = modal;
    });

    /*有用的信息*/
    /*    console.group('开始打印农场信息');
     console.log($scope.farms);        //农场
     console.log($scope.farms[farmCurrentIndex].penslist[0]);      //当前农场下的 栋舍列表
     console.groupEnd("结束打印农场信息");
     $scope.CurrentPensList = $scope.farms[farmCurrentIndex].penslist[0];  //当前农场下的 栋舍列表
     console.log($scope.CurrentPensList);*/

    $scope.showFeed = function() {
        $scope.ckWY = checkHasThisAuthority('NS','WY','retrieve'); //权限
        $scope.currentPage = "feed";
        $scope.switchHeaderNavBar = true;
        $scope.CurrentPensList = returnCurrentPensList(farmCurrentIndex);
        $scope.noticeFeed = false;
        $scope.showA = true;
        var date = new Date();
        $timeout(function() {
            $scope.farmFeed.SysDate = moment(date).format('YYYY-MM-DD');
        }, 0);
        if ($scope.chooseItem != null) {
            $scope.usefulPlains = $scope.nPlains.filter(function(val, index, array) { //$scope.nPlains 当前农场栏位
                return parseInt(val.plannum) > 0;
            });
            $scope.farmFeed = {
                SysDepID: user.PeID,
                SysRoleID: user.RoleId,
                OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                Name: $scope.uerName,
                /* IsType: "1",*/
                PenID: $scope.activePenID, //栋舍号
                PenName: $scope.activeName, //栋舍名字

                PlainID: $scope.chooseItem.PID, //栏位号 ID
                PlainName: $scope.chooseItem.PlainName, //栏位名字
                NumberOf: $scope.chooseItem.plannum, //当前存栏数
                Freepic: '', //照片
                Remark: '',
                PNO: ''
            };
            $scope.feedModal.show();
        } else {
            $scope.showToast("请选择栏位");
        }
    };

    $scope.showFeedAsPNO = function(animal) {
        $scope.switchHeaderNavBar = false;
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
        $scope.feedModal.show();
        var date = new Date();
        $timeout(function() {
            $scope.farmFeed.SysDate = moment(date).format('YYYY-MM-DD');
        }, 0);
        $scope.farmFeed = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
            Name: $scope.uerName,
            /* IsType: "1",*/
            PenID: animal.PenID, //栋舍号
            PenName: animal.PPen, //栋舍名字
            PlainID: animal.PlainID, //栏位号 ID
            PlainName: animal.PPlain, //栏位名字
            PNO: animal.PNO,
            NumberOf: '', //当前存栏数
            Freepic: '', //照片
            Remark: ''
        };
    };
    $scope.showVaccinationAsPNO = function(animal) {

        $scope.switchHeaderNavBar = false;
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
        $scope.vaccinationModal.show();
        var date = new Date();
        $timeout(function() {
            $scope.farmVaccination.SysDate = moment(date).format('YYYY-MM-DD');
        }, 0);
        $scope.farmVaccination = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
            Name: $scope.uerName,
            /* IsType: "1",*/
            PenID: animal.PenID, //栋舍号
            PenName: animal.PPen, //栋舍名字
            PlainID: animal.PlainID, //栏位号 ID
            PlainName: animal.PPlain, //栏位名字
            PNO: animal.PNO,
            NumberOf: '', //当前存栏数
            Freepic: '', //照片
            Remark: ''
        };
    };
    $scope.showCureAsPNO = function(animal) {
        $scope.switchHeaderNavBar = false;
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
        $scope.cureModal.show();
        var date = new Date();
        $timeout(function() {
            $scope.farmCure.SysDate = moment(date).format('YYYY-MM-DD');
        }, 0);
        $scope.farmCure = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
            Name: $scope.uerName,
            /* IsType: "1",*/
            PenID: animal.PenID, //栋舍号
            PenName: animal.PPen, //栋舍名字
            PlainID: animal.PlainID, //栏位号 ID
            PlainName: animal.PPlain, //栏位名字
            PNO: animal.PNO,
            NumberOf: '', //当前存栏数
            Freepic: '', //照片
            Remark: ''
        };
    };
    $scope.showDeathAsPNO = function(animal) {
        $scope.switchHeaderNavBar = false;
        $scope.showA = false;
        $scope.showB = true;
        $scope.showC = false;
        $scope.deathModal.show();
        var date = new Date();
        $timeout(function() {
            $scope.farmDeath.SysDate = moment(date).format('YYYY-MM-DD');
        }, 0);
        $scope.farmDeath = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
            Name: $scope.uerName,
            /* IsType: "1",*/
            PenID: animal.PenID, //栋舍号
            PenName: animal.PPen, //栋舍名字
            PlainID: animal.PlainID, //栏位号 ID
            PlainName: animal.PPlain, //栏位名字
            DeathObject: animal.PNO,
            NumberOf: '', //当前存栏数
            Freepic: '', //照片
            Remark: ''
        };
    };
    $scope.choosePen = function(type) { //选择栋舍
        var needCurrentPenId = null; //当前栋舍的ID
        var tmpPenName = null; //临时的名字
        switch (type) {
            case 1: //喂养
                tmpPenName = $scope.farmFeed.PenName;
                break;
            case 2: //免疫
                tmpPenName = $scope.farmVaccination.PenName;
                break;
            case 3: //治疗
                tmpPenName = $scope.farmCure.PenName;
                break;
            case 5: //死亡
                tmpPenName = $scope.farmDeath.PenName;
                break;
        }
        for (var i = 0; i < $scope.CurrentPensList.length; i++) {
            if ($scope.CurrentPensList[i].PlainName == tmpPenName) {
                needCurrentPenId = $scope.CurrentPensList[i].PID;
                tmpPenName = $scope.CurrentPensList[i].PlainName;
            }
        }
        switch (type) {
            case 1:
                $scope.farmFeed.PenName = tmpPenName;
                $scope.farmFeed.PenID = needCurrentPenId;
                break;
            case 2:
                $scope.farmVaccination.PenName = tmpPenName;
                $scope.farmVaccination.PenID = needCurrentPenId;
                break;
            case 3:
                $scope.farmCure.PenName = tmpPenName;
                $scope.farmCure.PenID = needCurrentPenId;
                break;
            case 5:
                $scope.farmDeath.PenName = tmpPenName;
                $scope.farmDeath.PenID = needCurrentPenId;
                break;
        }
        FarmService.GetLWAll(needCurrentPenId).success(function(data) {
            if (data.Status === true) {
                if (data.MyObject != null) {
                    $scope.nPlains = data.MyObject;
                    $scope.usefulPlains = $scope.nPlains.filter(function(val, index, array) { //$scope.nPlains 当前农场栏位
                        return parseInt(val.plannum) > 0;
                    });
                    /* $scope.farmFeed.PlainName = $scope.usefulPlains[0].PlainName;
                     $scope.farmFeed.NumberOf =  $scope.usefulPlains[0].plannum;*/
                    switch (type) {
                        case 1:
                            if ($scope.usefulPlains.length > 0) {
                                $scope.farmFeed.PlainName = $scope.usefulPlains[0].PlainName;
                                $scope.farmFeed.NumberOf = $scope.usefulPlains[0].plannum;
                            }
                            break;
                        case 2:
                            if ($scope.usefulPlains.length >= 0) {
                                $scope.farmVaccination.PlainName = $scope.usefulPlains[0].PlainName;
                                $scope.farmVaccination.NumberOf = $scope.usefulPlains[0].plannum;
                            }
                            break;
                        case 3:
                            if ($scope.usefulPlains.length >= 0) {
                                $scope.farmCure.PlainName = $scope.usefulPlains[0].PlainName;
                                $scope.farmCure.NumberOf = $scope.usefulPlains[0].plannum;
                            }
                            break;
                    }
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.choosePlain = function(type) { //选择栏位
        var tmpPlainNmae = null;
        switch (type) {
            case 1: //喂养
                tmpPlainNmae = $scope.farmFeed.PlainName;
                break;
            case 2: //免疫
                tmpPlainNmae = $scope.farmVaccination.PlainName;
                break;
            case 3: //治疗
                tmpPlainNmae = $scope.farmCure.PlainName;
                break;
			case 4: //转栏
				tmpPlainNmae = $scope.farmCure.PlainName;
				break;
        }
        for (var i = 0; i < $scope.usefulPlains.length; i++) {
            if ($scope.usefulPlains[i].PlainName == tmpPlainNmae) {
                switch (type) {
                    case 1: //喂养
                        $scope.farmFeed.PlainID = $scope.usefulPlains[0].PID;
                        $scope.farmFeed.PlainName = $scope.usefulPlains[i].PlainName;
                        $scope.farmFeed.NumberOf = $scope.usefulPlains[i].plannum;
                        break;
                    case 2: //免疫
                        $scope.farmVaccination.PlainID = $scope.usefulPlains[0].PID;
                        $scope.farmVaccination.PlainName = $scope.usefulPlains[i].PlainName;
                        $scope.farmVaccination.NumberOf = $scope.usefulPlains[i].plannum;
                        break;
                    case 3: //治疗
                        $scope.farmCure.PlainID = $scope.usefulPlains[0].PID;
                        $scope.farmCure.PlainName = $scope.usefulPlains[i].PlainName;
                        $scope.farmCure.NumberOf = $scope.usefulPlains[i].plannum;
                        break;
					case 4: //转栏
						$scope.farmCure.PlainID = $scope.usefulPlains[0].PID;
						$scope.farmCure.PlainName = $scope.usefulPlains[i].PlainName;
						$scope.farmCure.NumberOf = $scope.usefulPlains[i].plannum;
						break;

                }
            }
        }

    };


    $scope.DFeeds = [];
    $scope.FeedsShow = [];
    $scope.search = {
        Data: ""
    };

    $scope.closeFeeds = function() {
        $scope.MaterielModal.remove();
    };

    $scope.addFeed = function(type) {
        $ionicModal.fromTemplateUrl('./pages/farm/materiel.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.MaterielModal = modal;
        });

        $scope.Feeds = [];
        $scope.showLoad();
        ServiceService.FeedProsGet(type, $scope.search.Data).success(function(data) {
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
                $scope.MaterielModal.show();
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
        if ($scope.DFeeds.length > 0) {
            $scope.noticeFeed = true;
        } else if ($scope.DFeeds.length == 0) {
            $scope.noticeFeed = false;
        }

    };

    $scope.deleteFeed = function(index) {
        $scope.DFeeds.splice(index, 1);

        if ($scope.DFeeds.length == 0) {
            $scope.noticeFeed = false;
        }
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

    $scope.feddNmuberMinus = function(item, index) {
        if (item.PFNum > 1) {
            item.PFNum = item.PFNum - 1;
        } else {
            $scope.deleteFeed(index);
        }
    };

    $scope.feddNmuberPlus = function(item) {
        item.PFNum = item.PFNum + 1;
    };
    var hasAuthority = false;
    $scope.saveFarmFeed = function(type) {
        if(checkHasThisAuthority('NS','WY','create') == false){
            $scope.showToast('不具有添加农事喂养的权限!');
            return false;
        }
        $scope.farmFeed.Materiel = JSON.stringify($scope.DFeeds);
        if ($scope.farmFeed.Materiel == "[]") {
            $scope.showToast('请选择饲料配方！');
            return false;
        }
        if ($scope.showA == true) {
            $scope.farmFeed.Type = 1;
        } else if ($scope.showC == true) {
            $scope.farmFeed.Type = 3;
            if ($scope.farmFeed.PNO == "" || $scope.farmFeed.PNO == "") {
                $scope.showToast('请扫描或输入耳标号！');
                return false;
            }
        }
        $scope.showLoad();
        $scope.farmFeed.ImageName = $scope.photoImg;
        $scope.farmFeed.TaskGps = $scope.gpsStr;
        FarmService.saveFarmFeed($scope.farmFeed).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                if (type == 1) {
                    var date = new Date();
                    $timeout(function() {
                        $scope.farmFeed.SysDate = moment(date).format('YYYY-MM-DD');
                    }, 0);
                    if ($scope.switchHeaderNavBar == true) {
                        $scope.farmFeed = {
                            SysDepID: user.PeID,
                            SysRoleID: user.RoleId,
                            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                            Name: $scope.uerName,
                            PenID: $scope.activePenID, //栋舍号*!/
                            PenName: $scope.activeName, //栋舍名字
                            PlainID: $scope.chooseItem.PID, //栏位号 ID
                            PlainName: $scope.chooseItem.PlainName, //栏位名字
                            NumberOf: $scope.chooseItem.plannum, //当前存栏数*/
                            Freepic: '', //照片
                            Remark: '',
                            ImageName: null,
                        };
                        $scope.photoImg = null;
                        $scope.myImage =  false;
                        $scope.noticeFeed = false;
                    } else if ($scope.switchHeaderNavBar == false) {
                        $scope.farmFeed = {
                            SysDepID: user.PeID,
                            SysRoleID: user.RoleId,
                            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                            Name: $scope.uerName,
                            PenID: $scope.farmFeed.PenID, //栋舍号
                            PenName: $scope.farmFeed.PenName, //栋舍名字
                            PlainID: $scope.farmFeed.PlainID, //栏位号 ID
                            PlainName: $scope.farmFeed.PlainName, //栏位名字
                            PNO: $scope.farmFeed.PNO,
                            NumberOf: '', //当前存栏数
                            Freepic: '', //照片
                            Remark: '',
                            ImageName: null,
                        };
                        $scope.DFeeds = [];
                        $scope.photoImg = null;
                        $scope.myImage =  false;
                        $scope.noticeFeed = false;
                    }
                } else if (type == 2) {
                    $scope.feedModal.hide();
                    $timeout(function() {
                        $scope.farmFeed = {};
                    }, 800);
                    $scope.DFeeds = [];
                    $scope.photoImg = null;
                    $scope.myImage =  false;
                    $scope.noticeFeed = false;
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };


    $scope.hideFeed = function() {
        $scope.feedModal.hide();
        $scope.photoImg = null;
        $scope.myImage =  false;
        $timeout(function() {
            $scope.farmFeed = {};
        }, 800);
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
    };
    /*e-喂养*/
    /*s-免疫*/


    $scope.ImmunionList = ["口蹄疫", "蓝耳病", "伪狂犬", "圆环", "支原体", "细小病毒", "乙型脑炎病毒", "传染性胃肠炎", "腹泻"];
    $scope.showVaccination = function() {
        $scope.ckMY = checkHasThisAuthority('NS','MY','retrieve');
        $scope.currentPage = "Vaccination";

		$ionicModal.fromTemplateUrl('./pages/farm/farm-vaccination.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.vaccinationModal = modal;
			$scope.CurrentPensList = returnCurrentPensList(farmCurrentIndex);
			$scope.noticeFeed = false;
			$scope.showA = true;
			var date = new Date();
			$timeout(function() {
				$scope.farmVaccination.SysDate = moment(date).format('YYYY-MM-DD');
			}, 0);
			if ($scope.chooseItem != null) {
				$scope.usefulPlains = $scope.nPlains.filter(function(val, index, array) { //$scope.nPlains 当前农场栏位
					return parseInt(val.plannum) > 0;
				});
				$scope.farmVaccination = {
					SysDepID: user.PeID,
					SysRoleID: user.RoleId,
					OrrID: moment(date).format('YYMMDDhhmmss'), //单号
					BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
					Name: $scope.uerName,
					Immunion: "口蹄疫",
					/* IsType: "1",*/
					PenID: $scope.activePenID, //栋舍号
					PenName: $scope.activeName, //栋舍名字
					PlainID: $scope.chooseItem.PID, //栏位号 ID
					PlainName: $scope.chooseItem.PlainName, //栏位名字

					NumberOf: $scope.chooseItem.plannum, //当前存栏数
					Freepic: '', //照片
					Remark: '',
					Type: '',
					PNO: ''
				};

				$scope.vaccinationModal.show();
			} else {
				$scope.showToast("请选择栏位");
			}
		});
    };


    $scope.saveFarmVaccination = function(type) {
        if(checkHasThisAuthority('NS','MY','create') == false){
            $scope.showToast('不具有添加农事免疫的权限!');
            return false;
        }
        $scope.farmVaccination.Materiel = JSON.stringify($scope.DFeeds);
        if ($scope.farmVaccination.Materiel == "[]") {
            $scope.showToast('请选择免疫药品！');
            return false;
        }
        if ($scope.farmVaccination.Immunion == "" || $scope.farmVaccination.Immunion == null) {
            $scope.showToast('请选择免疫项目！');
            return false;
        }
        if ($scope.showA == true) {
            $scope.farmVaccination.Type = 1;
        } else if ($scope.showC == true) {
            $scope.farmVaccination.Type = 3;
            if ($scope.farmVaccination.PNO == "" || $scope.farmVaccination.PNO == "") {
                $scope.showToast('请扫描或输入耳标号！');
                return false;
            }
        }
        $scope.showLoad();
        $scope.farmVaccination.ImageName = $scope.photoImg;
        $scope.farmVaccination.TaskGps = $scope.gpsStr;
        FarmService.saveFarmVaccination($scope.farmVaccination).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                if (type == 1) {
                    var date = new Date();
                    $timeout(function() {
                        $scope.farmVaccination.SysDate = moment(date).format('YYYY-MM-DD');
                    }, 0);
                    if ($scope.switchHeaderNavBar == true) {
                        $scope.farmVaccination = {
                            SysDepID: user.PeID,
                            SysRoleID: user.RoleId,
                            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                            Name: $scope.uerName,
                            PenID: $scope.activePenID, //栋舍号*!/
                            PenName: $scope.activeName, //栋舍名字
                            Immunion: "口蹄疫",
                            PlainID: $scope.chooseItem.PID, //栏位号 ID
                            PlainName: $scope.chooseItem.PlainName, //栏位名字
                            NumberOf: $scope.chooseItem.plannum, //当前存栏数*/
                            Freepic: '', //照片
                            Remark: '',
                            Type: '',
                            PNO: '',
                            ImageName: null,
                        };
                        $scope.photoImg = null;
                        $scope.myImage =  false;
                        $scope.noticeFeed = false;
                    } else if ($scope.switchHeaderNavBar == false) {
                        $scope.farmVaccination = {
                            SysDepID: user.PeID,
                            SysRoleID: user.RoleId,
                            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                            Name: $scope.uerName,
                            PenID: $scope.farmVaccination.PenID, //栋舍号*!/
                            PenName: $scope.farmVaccination.PenName, //栋舍名字
                            Immunion: $scope.farmVaccination.Immunion,
                            PlainID: $scope.farmVaccination.PlainID, //栏位号 ID
                            PlainName: $scope.farmVaccination.PlainName, //栏位名字
                            Freepic: '', //照片
                            Remark: '',
                            Type: '',
                            PNO: $scope.farmVaccination.PNO,
                            ImageName: null,
                        };
                        $scope.photoImg = null;
                        $scope.myImage =  false;
                        $scope.DFeeds = [];
                        $scope.noticeFeed = false;
                    }
                } else if (type == 2) {
                    $scope.DFeeds = [];
                    $scope.hideVaccination();
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.hideVaccination = function() {
        $scope.vaccinationModal.remove();
        $scope.photoImg = null;
        $scope.myImage =  false;
        $timeout(function() {
            $scope.farmVaccination = {};
        }, 800);
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
    };

    /*e-免疫*/
    /*s-治疗*/
    $ionicModal.fromTemplateUrl('./pages/farm/farm-cure.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.cureModal = modal;
    });
    $scope.cureResultList = ['正常', '产后厌食', '催胎', '低温', '发热', '肺炎', '腹泻', '感染', '关节炎', '咳嗽', '拉血', '链球菌', '螨虫', '难产', '内出血', '皮肤病', '驱虫', '神经', '呕吐', '脱肛', '脱宫', '哮喘', '增生性肠炎', '子宫炎', '其他'];
    $scope.TreatmentList = ['无需措施', '隔离', '未隔离'];
    $scope.showCure = function() {
        $scope.ckZLiao = checkHasThisAuthority('NS','ZLiao','retrieve');
        $scope.currentPage = "Cure";
        $scope.CurrentPensList = returnCurrentPensList(farmCurrentIndex);
        $scope.noticeFeed = false;
        $scope.showA = true;
        var date = new Date();
        $timeout(function() {
            $scope.farmCure.SysDate = moment(date).format('YYYY-MM-DD');
        }, 0);
        if ($scope.chooseItem != null) {
            $scope.usefulPlains = $scope.nPlains.filter(function(val, index, array) { //$scope.nPlains 当前农场栏位
                return parseInt(val.plannum) > 0;
            });
            $scope.farmCure = {
                SysDepID: user.PeID,
                SysRoleID: user.RoleId,
                OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                Name: $scope.uerName,
                InspectResult: "正常",
                Treatment: "无需措施",
                /* IsType: "1",*/
                PenID: $scope.activePenID, //栋舍号
                PenName: $scope.activeName, //栋舍名字
                PlainID: $scope.chooseItem.PID, //栏位号 ID
                PlainName: $scope.chooseItem.PlainName, //栏位名字
                NumberOf: $scope.chooseItem.plannum, //当前存栏数
                Freepic: '', //照片
                Remark: '',
                Type: '',
                PNO: ''
            };

            $scope.cureModal.show();
        } else {
            $scope.showToast("请选择栏位");
        }
    };


    $scope.saveFarmCure = function(type) {
        if(checkHasThisAuthority('NS','ZLiao','create') == false){
            $scope.showToast('不具有添加农事治疗的权限!');
            return false;
        }
        $scope.farmCure.Materiel = JSON.stringify($scope.DFeeds);
        if ($scope.farmCure.Materiel == "[]") {
            $scope.showToast('请选择治疗药品！');
            return false;
        }
        if ($scope.farmCure.InspectResult == "" || $scope.farmCure.InspectResult == null) {
            $scope.showToast('请选择检查结果！');
            return false;
        }
        if ($scope.farmCure.Treatment == "" || $scope.farmCure.Treatment == null) {
            $scope.showToast('请选择治疗措施！');
            return false;
        }
        if ($scope.showA == true) {
            $scope.farmCure.Type = 1;
        } else if ($scope.showC == true) {
            $scope.farmCure.Type = 3;
            if ($scope.farmCure.PNO == "" || $scope.farmCure.PNO == "") {
                $scope.showToast('请扫描或输入耳标号！');
                return false;
            }
        }
        $scope.showLoad();
        $scope.farmCure.ImageName = $scope.photoImg;
        $scope.farmCure.TaskGps = $scope.gpsStr;
        FarmService.saveFarmCure($scope.farmCure).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                if (type == 1) {
                    var date = new Date();
                    $timeout(function() {
                        $scope.farmCure.SysDate = moment(date).format('YYYY-MM-DD');
                    }, 0);
                    if ($scope.switchHeaderNavBar == true) {
                        $scope.farmCure = {
                            SysDepID: user.PeID,
                            SysRoleID: user.RoleId,
                            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                            Name: $scope.uerName,
                            PenID: $scope.activePenID, //栋舍号*!/
                            PenName: $scope.activeName, //栋舍名字
                            InspectResult: "正常",
                            Treatment: "无需措施",
                            PlainID: $scope.chooseItem.PID, //栏位号 ID
                            PlainName: $scope.chooseItem.PlainName, //栏位名字
                            NumberOf: $scope.chooseItem.plannum, //当前存栏数*/
                            Freepic: '', //照片
                            Remark: '',
                            Type: '',
                            PNO: '',
                            ImageName: null,
                        };
                        $scope.photoImg = null;
                        $scope.myImage =  false;
                        $scope.noticeFeed = false;
                    } else if ($scope.switchHeaderNavBar == false) {
                        $scope.farmCure = {
                            SysDepID: user.PeID,
                            SysRoleID: user.RoleId,
                            OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                            BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                            Name: $scope.uerName,
                            PenID: $scope.farmCure.PenID, //栋舍号*!/
                            PenName: $scope.farmCure.PenName, //栋舍名字
                            InspectResult: $scope.farmCure.InspectResult,
                            Treatment: $scope.farmCure.Treatment,
                            PlainID: $scope.farmCure.PlainID, //栏位号 ID
                            PlainName: $scope.farmCure.PlainName, //栏位名字
                            Freepic: '', //照片
                            Remark: '',
                            Type: '',
                            PNO: $scope.farmCure.PNO,
                            ImageName: null,
                        };
                        $scope.photoImg = null;
                        $scope.myImage =  false;
                        $scope.DFeeds = [];
                        $scope.noticeFeed = false;
                    }
                } else if (type == 2) {
                    $scope.DFeeds = [];
                    $scope.hideCure();
                }
            } else {
                console.log('后台异常');
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.hideCure = function() {
        $scope.cureModal.hide();
        $scope.photoImg = null;
        $scope.myImage =  false;
        $timeout(function() {
            $scope.farmCure = {};
        }, 800);
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
    };

    /*e-治疗*/
    /*s-死亡*/
    $scope.CauseDeathList = ['应激', '猝死', '中毒', '胸膜性肺炎', '腹泻', '胀气', '压死', '急性死亡'];
    $scope.TreatmenThodList = ['无害化处理', '深埋', '其它'];
    $scope.showDeath = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/farm-death.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.deathModal = modal;
            $scope.ckSW = checkHasThisAuthority('NS','SW','retrieve');
            $scope.currentPage = "Death";
            /*$scope.farmDeath */
            $scope.showA = true;
            $scope.showB = false;
            $scope.CurrentPensList = returnCurrentPensList(farmCurrentIndex);
            var date = new Date();
            $timeout(function() {
                $scope.farmDeath.SysDate = moment(date).format('YYYY-MM-DD');
            }, 0);
            if ($scope.chooseItem != null) {
                $scope.usefulPlains = $scope.nPlains.filter(function(val, index, array) { //$scope.nPlains 当前农场栏位
                    return parseInt(val.plannum) > 0;
                });
                $scope.farmDeath = {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                    Name: $scope.uerName,
                    PenID: $scope.activePenID, //栋舍号
                    PenName: $scope.activeName, //栋舍名字
                    PlainID: $scope.chooseItem.PID, //栏位号 ID
                    PlainName: $scope.chooseItem.PlainName, //栏位名字
                    /* NumberOf: $scope.chooseItem.plannum,                      //当前存栏数*!/*/
                    NumberOf: '',
                    /* DeathObject:'',                                          //死亡对象*/
                    CauseDeath: '应激', //死亡原因
                    TreatmenThod: '无害化处理', //处理方式
                    SuperviseName: '', //监管方兽医名字
                    AcceptanceTime: '', //验收日期
                    Freepic: '' //照片
                };
                $scope.deathModal.show();
            } else {
                $scope.showToast("请选择栏位");
            }
        });
    };
    $scope.saveFarmDeath = function(type) {
        if(checkHasThisAuthority('NS','SW','create') == false){
            $scope.showToast('不具有添加农事死亡的权限!');
            return false;
        }
        if ($scope.farmDeath.PCNum > $scope.chooseItem.plannum) {
            $scope.showToast('死亡数量超出,请重新输入!');
            return false;
        }
        $scope.showLoad();
        $scope.farmDeath.ImageName = $scope.photoImg;
        $scope.farmDeath.TaskGps = $scope.gpsStr;
        if($scope.showA){
            FarmService.saveDeathAll($scope.farmDeath, $scope.farmDeath.PCNum).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.chooseItem.plannum = $scope.chooseItem.plannum - $scope.farmDeath.PCNum;
                    $scope.showToast("保存成功");
                    if (type == 1) {
                        var date = new Date();
                        $timeout(function() {
                            $scope.farmDeath.SysDate = moment(date).format('YYYY-MM-DD');
                        }, 0);
                        if ($scope.switchHeaderNavBar == true) {
                            $scope.farmDeath = {
                                SysDepID: user.PeID,
                                SysRoleID: user.RoleId,
                                OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                                BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                                Name: $scope.uerName,
                                PenID: $scope.activePenID, //栋舍号*!/
                                PenName: $scope.activeName, //栋舍名字
                                NumberOf: '',
                                /* DeathObject:'',                                          //死亡对象*/
                                CauseDeath: '应激', //死亡原因
                                TreatmenThod: '无害化处理', //处理方式
                                SuperviseName: '', //监管方兽医名字
                                AcceptanceTime: '', //验收日期
                                Freepic: '', //照片
                                Remark: '',
                                ImageName: null,
                            };
                            $scope.DFeeds = [];
                            $scope.noticeFeed = false;
                        } else if ($scope.switchHeaderNavBar == false) {
                            $scope.farmDeath = {
                                SysDepID: user.PeID,
                                SysRoleID: user.RoleId,
                                OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                                BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                                Name: $scope.uerName,
                                PenID: $scope.farmDeath.PenID, //栋舍号*!/
                                PenName: $scope.farmDeath.PenName, //栋舍名字
                                CauseDeath: $scope.farmDeath.CauseDeath, //死亡原因
                                TreatmenThod: $scope.farmDeath.TreatmenThod, //处理方式
                                SuperviseName: '', //监管方兽医名字
                                AcceptanceTime: '', //验收日期
                                Freepic: '', //照片
                                Remark: '',
                                ImageName: null,
                            };
                        }
                    } else if (type == 2) {
                        $scope.deathModal.remove();
                        $timeout(function() {
                            $scope.farmDeath = {};
                        }, 800);
                    }
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            });
        }else{
            FarmService.saveFarmDeath($scope.farmDeath).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    // $scope.getFarms();
                    $scope.chooseItem.plannum--;
                    $scope.showToast("保存成功");
                    if (type == 1) {
                        var date = new Date();
                        $timeout(function() {
                            $scope.farmDeath.SysDate = moment(date).format('YYYY-MM-DD');
                        }, 0);
                        if ($scope.switchHeaderNavBar == true) {
                            $scope.farmDeath = {
                                SysDepID: user.PeID,
                                SysRoleID: user.RoleId,
                                OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                                BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                                Name: $scope.uerName,
                                PenID: $scope.activePenID, //栋舍号*!/
                                PenName: $scope.activeName, //栋舍名字
                                NumberOf: '',
                                /* DeathObject:'',                                          //死亡对象*/
                                CauseDeath: '应激', //死亡原因
                                TreatmenThod: '无害化处理', //处理方式
                                SuperviseName: '', //监管方兽医名字
                                AcceptanceTime: '', //验收日期
                                Freepic: '', //照片
                                Remark: ''
                            };
                            $scope.DFeeds = [];
                            $scope.photoImg = null;
                            $scope.myImage =  false;
                            $scope.noticeFeed = false;
                        } else if ($scope.switchHeaderNavBar == false) {
                            $scope.farmDeath = {
                                SysDepID: user.PeID,
                                SysRoleID: user.RoleId,
                                OrrID: moment(date).format('YYMMDDhhmmss'), //单号
                                BathID: moment(date).format('YYMMDDhhmmss'), //批次号号
                                Name: $scope.uerName,
                                PenID: $scope.farmDeath.PenID, //栋舍号*!/
                                PenName: $scope.farmDeath.PenName, //栋舍名字
                                CauseDeath: $scope.farmDeath.CauseDeath, //死亡原因
                                TreatmenThod: $scope.farmDeath.TreatmenThod, //处理方式
                                SuperviseName: '', //监管方兽医名字
                                AcceptanceTime: '', //验收日期
                                Freepic: '', //照片
                                Remark: ''
                            };
                            $scope.photoImg = null;
                            $scope.myImage =  false;
                        }
                    } else if (type == 2) {
                        $scope.deathModal.remove();
                        $timeout(function() {
                            $scope.farmDeath = {};
                        }, 800);
                    }
                } else {
                    $scope.showAlert('网络错误!');
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            });
        }
    };

    $scope.exitFarmDeath = function () {
        $scope.deathModal.remove();
        $scope.photoImg = null;
        $scope.myImage =  false;
        $scope.showA = true;
        $scope.showB = false;
    };
    /*e-死亡*/

    /*-s 查看功能按钮*/
    $scope.farmShowArray = ['喂养', '免疫', '治疗', '死亡', '淘汰', '任务'];

    $scope.showWhatContentList = ['全部', '喂养记录', '免疫记录', '治疗记录', '死亡记录', '淘汰记录','入栏记录','转栏记录'];

   /* $scope.ckWY = checkHasThisAuthority('NS','WY','retrieve');
    $scope.ckMY = checkHasThisAuthority('NS','MY','retrieve');
    $scope.ckZLiao = checkHasThisAuthority('NS','ZLiao','retrieve');
    $scope.ckSW = checkHasThisAuthority('NS','SW','retrieve');
    $scope.ckTT = checkHasThisAuthority('NS','TT','retrieve');*/


    $scope.showTimeTypeList = ['由近到远', '由远到近'];
    $scope.FarmDetailsList = [];
    $scope.farmDetailCanPullDown = true;

    $scope.getFarmList = function() {
        FarmService.GetFarmRecordList($scope.CheckFarmSendInfo).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.FarmDetailsList = $scope.FarmDetailsList.concat(data.MyObject);
                $scope.CheckFarmSendInfo.page = ++$scope.CheckFarmSendInfo.page;
            }
            if (data.Status === true && data.MyObject.length < $scope.CheckFarmSendInfo.psize) {
                $scope.farmDetailCanPullDown = false;
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.showDetails = function(type) {
        $ionicModal.fromTemplateUrl('./pages/farm/show-farm-details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.ckWY = checkHasThisAuthority('NS','WY','retrieve');
            $scope.ckMY = checkHasThisAuthority('NS','MY','retrieve');
            $scope.ckZLiao = checkHasThisAuthority('NS','ZLiao','retrieve');
            $scope.ckSW = checkHasThisAuthority('NS','SW','retrieve');
            $scope.ckTT = checkHasThisAuthority('NS','TT','retrieve');
            $scope.showFarmDetailModal = modal;
            $scope.showFarmDetailModal.show();
        });
        $scope.showLoad();
        $scope.CheckFarmSendInfo = {
            sysDepId: user.PeID,
            sysRoleId: user.RoleId,
            page: 1,
            psize: 6,
            timeasc: 0
        };
        $scope.CheckFarmSendInfo.intype = type;
        $scope.getFarmList();
    };

    $scope.loadMore2 = function() {
        $timeout(function() {
            if (!$scope.manageCanPullDown) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            $scope.getFarmList();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
    };

    $scope.chooseAsType = [false, false];
    $scope.showWhatContent = function(x) {
        $scope.chooseAsType.forEach(function(val, index) {
            if (index != x || $scope.chooseAsType[index] == true) {
                $scope.chooseAsType[index] = false;
            } else if (index == x) {
                $scope.chooseAsType[x] = !$scope.chooseAsType[x];
            }
        });
    };
    $scope.chooseContentF = [false, false, false, false, false, false, false];
    $scope.whichFarmContent = function(x) {
        $scope.chooseContentF.forEach(function(val, index) {
            if (index != x || $scope.chooseContentF[index] == true) {
                $scope.chooseContentF[index] = false;
            } else if (index == x) {
                $scope.chooseContentF[x] = !$scope.chooseContentF[x];
            }
        });
        $scope.showLoad();
        $scope.CheckFarmSendInfo.page = 1;
        $scope.FarmDetailsList = [];
        $scope.farmDetailCanPullDown = true;
        $scope.CheckFarmSendInfo.intype = x;
        $scope.getFarmList();
        $timeout(function() {
            $scope.chooseAsType[0] = false;
        }, 600);
    };
    $scope.chooseTimeF = [false, false];
    $scope.timeTypeF = function(x) {
        $scope.chooseTimeF.forEach(function(val, index) {
            if (index != x || $scope.chooseTimeF[index] == true) {
                $scope.chooseTimeF[index] = false;
            } else if (index == x) {
                $scope.chooseTimeF[x] = !$scope.chooseTimeF[x];
            }
        });
        $scope.CheckFarmSendInfo.page = 1;
        $scope.FarmDetailsList = [];
        $scope.farmDetailCanPullDown = true;
        $scope.CheckFarmSendInfo.timeasc = x;
        $scope.getFarmList();
        $timeout(function() {
            $scope.chooseAsType[1] = false;
        }, 600);
    };

    $scope.removeDetail = function() {
        $scope.chooseAsType = [false, false];
        $scope.chooseContentF = [false, false, false, false, false, false, false];
        $scope.chooseTimeF = [false, false];
        $scope.showFarmDetailModal.remove();
        $scope.FarmDetailsList = [];
        $scope.farmDetailCanPullDown = true;
    };

    $scope.showConfirm1 = function(item, $event, $index) {
        switch (item.IsType) {
            case '1' :
                if(checkHasThisAuthority('NS','WY','delete') == true){
                    break;
                } else {
                    $scope.showToast('不具有删除农事记录的权限');
                    return false;
                }
            case '2':
                if(checkHasThisAuthority('NS','MY','delete') == true){
                    break;
                } else {
                     $scope.showToast('不具有删除免疫记录的权限');
                    return false;
                }
            case '3':
                if(checkHasThisAuthority('NS','ZLiao','delete') == true){
                    break;
                } else {
                     $scope.showToast('不具有删除治疗记录的权限');
                    return false;
                }
            case '4':
                if(checkHasThisAuthority('NS','SW','delete') == true){
                    break;
                } else {
                     $scope.showToast('不具有删除死亡记录的权限');
                    return false;
                }
            case '5':
                if(checkHasThisAuthority('NS','TT','delete') == true){
                    break;
                } else {
                     $scope.showToast('不具有删除淘汰记录的权限');
                    return false;
                }
        }
        $event.stopPropagation();
        var confirmPopup = $ionicPopup.confirm({
            title: '你确定要删除此农事信息吗？',
            template: '删除此条农事信息后，之后将不会出现此条农事信息',
            cancelText: "不删除",
            okText: '确定删除'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.deleteThisFarmDetail(item, $event, $index);
            } else {
                return false;
            }
        });
    };

    $scope.deleteThisFarmDetail = function(item, $event, $index) {
        $event.stopPropagation();
        var sendData = {
            id: item.Id,
            intype: item.IsType
        };
        FarmService.DelFarmRecordById(sendData).success(function(data) {
            if (data.Status == true) {
                $scope.FarmDetailsList.splice($index, 1);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };

    $scope.showFarmDetailInner = function(item) {
        if(item.IsType < 6){
            $ionicModal.fromTemplateUrl('./pages/farm/show-farm-details-inner.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.farmWorkeDetailModal = modal;
                $scope.farmWorkeDetailModal.show();
            });
            $scope.infoItemInfo = {
                Id: item.Id,
                Type: item.IsType
            };
            FarmService.GetNSDetail($scope.infoItemInfo).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.farmWorkDetail = data.MyObject;
                    $scope.farmWorkShowDate = moment(data.MyObject.Sysdate).format('YYYY-MM-DD');
                    $scope.materialDtailList = data.UMyObject;
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showAlert(data.Message);
            });
        }
    };

    /*s-转栏*/
    $scope.feildChange = {};
    $scope.showEarNos = [];
    $scope.showfeildChange = function() {
		$scope.currentPage = "feildChange";
		$scope.saveFeildChangeAsEarNoArray = [];
		$scope.currenrPens2 = $scope.farmList[farmCurrentIndex].allpens;
        $scope.showA = true;
        if ($scope.chooseItem != null) {
            $scope.feildChange = {
                PlainID: $scope.chooseItem.PID,
                PlainName: $scope.chooseItem.PlainName,
                PenID: $scope.currentPen.PID,
                intType: $scope.currentPen.PType
            };
            $ionicModal.fromTemplateUrl('./pages/farm/farm-feildChange.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.feildChangeModal = modal;
                $scope.feildChangeModal.show();
            });
        } else {
            $scope.showToast("请选择栏位");
        }
    };

    $scope.hidefeildChange = function() {
        $scope.feildChangeModal.remove();
		$scope.saveFeildChangeAsEarNoArray = [];
        $scope.showEarNos = [];
        $scope.photoImg = null;
        $scope.myImage =  false;
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
    };

    $scope.showChooseEarNu = function(num) {
		earType = num;
        $ionicModal.fromTemplateUrl('./pages/farm/choose-animals-earNo.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.chooseEarNuModal = modal;
            $scope.sendChooseEarNuData = {
                plainId: $scope.chooseItem.PID,
                intType: $scope.currentPen.PType,
                page: 1,
                psize: 8
            };
            $scope.animalEarNoList = [];

            FarmService.GetPlainCattleList($scope.sendChooseEarNuData).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    console.log(data);
                    for (var i = 0; i< data.MyObject.length ; i++) {
                        $scope.animalEarNoList.push({
                            EarTag:data.MyObject[i].EarTag,
                            CattleId:data.MyObject[i].CattleId,
                            checked: false
                        });
                    }
                    $scope.chooseEarNuModal.show();
                } else {
                    $scope.showToast(data.Message);
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            });
        });
    };

    $scope.confirmEarArray = function () {
        $scope.temArray = $scope.animalEarNoList.filter(function (value, index, arr) {
            return value.checked == true;
        });
		for (var i = 0; i <  $scope.temArray.length ; i++) {
			if(!$scope.showEarNos.in_array($scope.temArray[i].EarTag)){
                $scope.showEarNos.push($scope.temArray[i].EarTag);
                $scope.saveFeildChangeAsEarNoArray.push($scope.temArray[i].EarTag);
			}
		}
		if(earType == 1){
			$scope.out.EarNo = $scope.saveFeildChangeAsEarNoArray.join(',');
		} else if (earType == 2) {
			$scope.feildChange.earTags = $scope.saveFeildChangeAsEarNoArray.join(',');
		}
        $scope.chooseEarNuModal.remove();
    };

    $scope.exitChooseEarNu = function () {
        $scope.chooseEarNuModal.remove();
    };

    $scope.savefeildChange = function() {
        if(checkHasThisAuthority('NS','ZL','create') == false){
            $scope.showToast('不具有添加农事转栏的权限!');
            return false;
        }
        if($scope.feildChange.ZRPenID === undefined){
            $scope.showToast('请选择目标栋舍');
            return false;
        }
        if($scope.feildChange.ZRPlainID === undefined){
            $scope.showToast('请选择目标栏位');
            return false;
        }
        $scope.showLoad();
        $scope.feildChange.ImageName = $scope.photoImg;
        $scope.feildChange.TaskGps = $scope.gpsStr;
        if ($scope.showA == true) {
            FarmService.CLPlainAll($scope.feildChange).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.getFarms('');
                    $scope.showToast("保存成功");
                    $scope.photoImg = null;
                    $scope.myImage =  false;
                    $scope.feildChange.ImageName = null;
                    $scope.hidefeildChange();
                } else {
                    $scope.showToast(data.Message);
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            });
        } else {
            $scope.feildChange.earTags = $scope.saveFeildChangeAsEarNoArray.join(',');
            FarmService.TrunFieldByearTag($scope.feildChange).success(function(data) {
                $scope.hideLoad();
                if (data.Status === true) {
                    $scope.getFarms('');
                    $scope.showToast("保存成功");
                    $scope.hidefeildChange();
                    $scope.photoImg = null;
                    $scope.myImage =  false;
                    $scope.feildChange.ImageName = null;
                } else {
                    $scope.showToast(data.Message);
                }
            }).error(function(data) {
                $scope.hideLoad();
                $scope.showToast(data.Message);
            });
        }

    };

    $scope.NPlains = [];
    $scope.getNPlains = function() {
        $scope.showLoad();
        FarmService.GetLWAll($scope.feildChange.ZRPenID).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null) {
                    $scope.NPlains = data.MyObject;
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };
    /*e-转栏*/

    /*s-淘汰*/
    $scope.out = {};
    $ionicModal.fromTemplateUrl('./pages/farm/farm-out.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.outModal = modal;
    });

    $scope.showout = function() {
        $scope.ckTT = checkHasThisAuthority('NS','TT','retrieve');
		$scope.saveFeildChangeAsEarNoArray = [];
        $scope.showEarNos = [];
		$scope.currentPage = "out";
		$scope.showA = true;
		$scope.showB = false;
        if ($scope.chooseItem != null) {
            $scope.out = {
				ppName: $scope.activeName,
                PlainID: $scope.chooseItem.PID,
                PlainName: $scope.chooseItem.PlainName,
                PenID: $scope.currentPen.PID,
				IsType: $scope.currentPen.PType,
                TTNo: 'TT-' + moment(new Date()).format('YYMMDDhhmmss'),
                DJTime: '',
                EarNo: '',
                TTMore: '',
                date: moment(new Date()).format('YYYY-MM-DD')
            };
            $scope.outModal.show();
        } else {
            $scope.showToast("请选择栏位");
        }
    };

    $scope.hideout = function() {
		$scope.showA = true;
		$scope.showB = false;
        $scope.photoImg = null;
        $scope.myImage =  false;
        $scope.outModal.hide();
		$scope.saveFeildChangeAsEarNoArray = [];
        $scope.showEarNos = [];
	};

    $scope.saveout = function() {
        if(checkHasThisAuthority('NS','TT','create') == false){
            $scope.showToast('不具有添加农事淘汰的权限!');
            return false;
        }
        if ($scope.out.ttCount > $scope.chooseItem.plannum) {
            $scope.showToast('淘汰数量超出,请重新输入!');
            return false;
        }
        $scope.showLoad();
        $scope.out.EarNo = $scope.saveFeildChangeAsEarNoArray.join(',');
        $scope.out.ImageName = $scope.photoImg;
        $scope.out.TaskGps = $scope.gpsStr;
        FarmService.TaotaiAll($scope.out).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.getFarms('');
                $scope.showToast("保存成功");
                $scope.hideout();
                $scope.photoImg = null;
                $scope.myImage =  false;
                $scope.out.ImageName = null;
            } else {
                $scope.showToast(data.Message);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.EarNos = [];
    $scope.getEarNos = function() {
        FarmService.GetDWCSAll($scope.chooseItem.PID).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                if (data.MyObject != null) {
                    $scope.EarNos = data.MyObject;
                    localStorage.setItem('EarNos', JSON.stringify($scope.EarNos));
                }
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $ionicModal.fromTemplateUrl('./pages/farm/searchEarNo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.EarNoModal = modal;
    });

    $scope.showEarNo = function() {
        $scope.getEarNos();
        $scope.EarNoModal.show();
    };

    $scope.hideEarNo = function() {
        $scope.search.data = "";
        $scope.EarNoModal.hide();
    };

    $scope.search = {};
    $scope.searchEarNo = function() {
        var EarNos = JSON.parse(localStorage.getItem('EarNos'));
        if ($scope.search.data) {
            var temp = [];
            for (var i = 0; i < EarNos.length; i++) {
                var DWNo = EarNos[i].DWNo;
                if (DWNo.indexOf($scope.search.data) > 0) {
                    temp.push(EarNos[i]);
                }
            }
            $scope.EarNos = temp;
        } else {
            $scope.EarNos = EarNos;
        }
    };
    /*e-淘汰*/
    /*s-更多*/
    $scope.chooseWhatBt = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/chooseWhatBt.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.chooseBtModal = modal;
            $scope.chooseBtModal.show();
        });
    };
    $scope.hideWhatBt = function() {
        $scope.chooseBtModal.remove();
    };
    $scope.saveWhatBt = function() {
        $scope.showLoad();
    };
    /*e-更多*/
    /*按钮组背景*/
    $scope.hideBT = function(item) {
        item.showPlain = false;
        item.showactions = false;
    };
    $scope.hideBT2 = function() {
        $scope.showBts = false;
        $scope.shareDiv = false;
    };
    /*流水账*/
    $scope.showpen = function() {
        $scope.showBts = true;
    };

    var userName2 = window.localStorage.getItem('user');
    $scope.uerName = JSON.parse(userName2).PersonName; //暂时无， 先用 Nmae  代替  $scope.uerName = JSON.parse(userName2).PersonName;

    $scope.purchase = {};
    $scope.pen = [{
        name: '采购饲料',
        pic: "img/pur-fodder.png"
    }, {
        name: '采购药品',
        pic: "img/pur-drug.png"
    }, {
        name: '采购牲畜',
        pic: "img/pur-aniamls.png"
    }, {
        name: '采购物资',
        pic: "img/pur-things.png"

    }, {
        name: '人工',
        pic: "img/manpower.png"
    }, {
        name: '出库',
        pic: "img/out-warehouse.png"
    }];
    $scope.picArray = ['img/pur-fodder.png', 'img/pur-drug.png', 'img/pur-aniamls.png', 'img/pur-things.png', "img/manpower.png"];
    $scope.showDayAccout = function($index) {
        var date = new Date();
        $scope.purchase = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            NowDate: moment(date).format('MM-DD hh:mm'),
            SignDate: moment(date).format('YYYY-MM-DD'),
            PensSpaceId: moment(date).format('YYMMDDhhmmss'),
            MaterialID: moment(date).format('YYMMDDhhmmss'),
            IsType: $index + 1,
            FarmID: farmIDArray[farmCurrentIndex],
        };
        switch ($index) {
            case 0:
                $scope.purFodderModal.show();
                break;
            case 1:
                $scope.purDrugModal.show();
                break;
            case 2:
                $scope.purAniamlsModal.show();
                break;
            case 3:
                $scope.purThingsModal.show();
                break;
            case 4:
                $scope.manpowerModal.show();
                break;
            case 5:
                $scope.outWarehouseModal.show();
                break;
        }
    };

    $scope.showPay = function() {
        $scope.purchase.Pay = ($scope.purchase.PurchaseNmuber * $scope.purchase.Price).toFixed(2);
    };
    $scope.showManPowerPay = function() {
        $scope.purchase.Pay = ($scope.purchase.PurchaseNmuber * $scope.purchase.Price).toFixed(2);
    };


    $scope.saveDayAccout = function(type) {
        if ($scope.purchase.IsType == 0 || $scope.purchase.IsType == 1 || $scope.purchase.IsType == 2 || $scope.purchase.IsType == 3 || $scope.purchase.IsType == 4) {
            if ($scope.purchase.payfile2 == undefined || $scope.purchase.payfile2 == "") {
                $scope.showToast('请输入供应商名称');
                return false;
            }
            if ($scope.purchase.PurchaseNmuber == undefined || $scope.purchase.PurchaseNmuber == "") {
                $scope.showToast('请输入数量');
                return false;
            }
            if ($scope.purchase.Unit == undefined || $scope.purchase.Unit == "") {
                $scope.showToast('请输入单位');
                return false;
            }
            if ($scope.purchase.Price == undefined || $scope.purchase.Price == "") {
                $scope.showToast('请输入单价');
                return false;
            }
            if ($scope.purchase.Pay == undefined || $scope.purchase.Pay == "") {
                $scope.showToast('请输入总金额');
                return false;
            }
        } else if ($scope.purchase.IsType == 5) {
            if ($scope.purchase.Payee == undefined || $scope.purchase.Payee == "") {
                $scope.showToast('请输入收款人');
                return false;
            }
        } else if ($scope.purchase.IsType == 6) {
            if ($scope.purchase.Payname == undefined || $scope.purchase.Payname == "") {
                $scope.showToast('请输入物资名称');
                return false;
            }
            if ($scope.purchase.Affiliations == undefined || $scope.purchase.Affiliations == "") {
                $scope.showToast('请输入领用单位');
                return false;
            }
            if ($scope.purchase.Recipient == undefined || $scope.purchase.Recipient == "") {
                $scope.showToast('请输入领用人');
                return false;
            }
            if ($scope.purchase.PurchaseNmuber == undefined || $scope.purchase.PurchaseNmuber == "") {
                $scope.showToast('请输入数量');
                return false;
            }
            if ($scope.purchase.Unit == undefined || $scope.purchase.Unit == "") {
                $scope.showToast('请输入单位');
                return false;
            }
        }

        $scope.showLoad();
        FarmService.Purchase($scope.purchase).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                $scope.showToast("保存成功");
                if (type == 1) {
                    switch ($scope.purchase.IsType) {
                        case 1:
                            $scope.hidePurFodder();
                            break;
                        case 2:
                            $scope.hidePurDrug();
                            break;
                        case 3:
                            $scope.hidePurAniamls();
                            break;
                        case 4:
                            $scope.hidePurThings();
                            break;
                        case 5:
                            $scope.hideManpower();
                            break;
                        case 6:
                            $scope.hideOutWarehouse();
                            break;
                    }
                } else {
                    var tempIndex = $scope.purchase.IsType;
                    var date = new Date();
                    $scope.purchase = {
                        SysDepID: user.PeID,
                        SysRoleID: user.RoleId,
                        NowDate: moment(date).format('YYYY-MM-DD'),
                        PensSpaceId: moment(date).format('YYMMDDhhmmss'),
                        MaterialID: moment(date).format('YYMMDDhhmmss'),
                        IsType: tempIndex,
                        FarmID: farmCurrentIndex,
                        Unit: "",
                        Remark: '',
                        payfile2: "",
                        Payname: "",
                        PurchaseNmuber: null,
                        Price: null,
                        Pay: $scope.purchase.PurchaseNmuber * $scope.purchase.Price,
                        Affiliations: '',
                        Recipient: '',
                        SignDate: ''
                    };
                }
            } else {
                console.log("错误");
            }
        }).error(function(data) {
            $scope.hideLoad();
            console.log("后台错误");
            $scope.showToast(data.Message);
        });
    };
    /*采购饲料*/
    $ionicModal.fromTemplateUrl('./pages/farm/purchase-fodder.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.purFodderModal = modal;
    });

    $scope.hidePurFodder = function() {
        $scope.purFodderModal.hide();
        $scope.showBts = false;
    };

    $scope.userInofromation = {
        SysDepID: user.PeID,
        SysRoleID: user.RoleId,
        farmId: farmIDArray[farmCurrentIndex],
    };
    /*供应商列表*/
    $scope.showSuppliersList = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/suppliers-list.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.suppliersListModal = modal;
            $scope.suppliersListModal.show();
            $scope.userInofromation = {
                SysDepID: user.PeID,
                SysRoleID: user.RoleId,
                farmId: farmIDArray[farmCurrentIndex],
            };
            FarmService.GetSupplierAll($scope.userInofromation).success(
                function(data) {
                    if (data.Status == true) {
                        if (data.MyObject != null) {
                            $scope.suppliersList = data.MyObject;
                            $scope.showSuppliersListContent = true;
                        } else {
                            $scope.suppliersList = [];
                            $scope.showSuppliersListContent = false;
                        }
                    }
                }
            ).error(
                function(data) {
                    console.log(data + "后台错误");
                }
            );
        });
    };
    $scope.selectData = {
        clientSide: '请选择'
    };

    $scope.chooseSupplier = function() {
        $scope.purchase.payfile2 = $scope.selectData.clientSide;
        $scope.purchase.payfile2 = $scope.selectData.clientSide;
        if ($scope.showSuppliersListContent == true && $scope.selectData.clientSide == '请选择') {
            $scope.showToast("请选择供应商");
            return false;
        }
        $scope.suppliersListModal.remove();
        $scope.selectData = {
            clientSide: '请选择'
        };
    };

    /*物料列表*/

    $scope.showMaterialList = function(type) {
        $ionicModal.fromTemplateUrl('./pages/farm/material-list.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.materialListModal = modal;
            $scope.materialListModal.show();
            $scope.userInofromation = {
                SysDepID: user.PeID,
                SysRoleID: user.RoleId,
                farmId: farmIDArray[farmCurrentIndex],
            };
            FarmService.GetWLAll(type, $scope.userInofromation).success(
                function(data) {
                    if (data.Status == true) {
                        if (data.MyObject != null && data.MyObject.length > 0) {
                            $scope.materialList = data.MyObject;
                            $scope.showSuppliersListContent = true;
                        } else {
                            $scope.materialList = [];
                            $scope.showSuppliersListContent = false;
                        }
                    }
                }
            ).error(
                function(data) {
                    console.log(data + "后台错误");
                }
            );
        });

    };

    $scope.chooseMaterial = function(item) {
        $scope.purchase.Payname = $scope.selectData.clientSide;
        if ($scope.showSuppliersListContent == true && $scope.selectData.clientSide == '请选择') {
            $scope.showToast("请选择供应商");
            return false;
        }
        $scope.materialListModal.remove();
        $scope.selectData = {
            clientSide: '请选择'
        };
        $scope.purchase.Unit = item.FeedUnits;
    };
    /*单位列表*/

    $scope.showUnitList = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/units-list.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.unitsListModal = modal;
            $scope.unitsListModal.show();
            FarmService.GetFeedUnits().success(
                function(data) {
                    if (data.Status == true) {
                        if (data.MyObject != null && data.MyObject.length > 0) {
                            $scope.unitsList = data.MyObject;
                        } else {
                            $scope.unitsList = [];
                        }
                    }
                }
            ).error(
                function(data) {
                    console.log(data + "后台错误");
                }
            );
        });

    };

    $scope.chooseUnit = function(item) {
        $scope.purchase.Unit = $scope.selectData.clientSide;
        if ($scope.selectData.clientSide == '请选择') {
            $scope.showToast("请选择单位");
            return false;
        }
        $scope.unitsListModal.remove();
        $scope.selectData = {
            clientSide: '请选择'
        };
    };

    /*采购药品*/
    $ionicModal.fromTemplateUrl('./pages/farm/purchase-drug.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.purDrugModal = modal;
    });
    $scope.hidePurDrug = function() {
        $scope.purDrugModal.hide();
        $scope.showBts = false;
    };
    /*采购牲畜*/
    $ionicModal.fromTemplateUrl('./pages/farm/purchase-animals.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.purAniamlsModal = modal;
    });
    $scope.hidePurAniamls = function() {
        $scope.purAniamlsModal.hide();
        $scope.showBts = false;
    };
    /*采购物质*/
    $ionicModal.fromTemplateUrl('./pages/farm/purchase-things.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.purThingsModal = modal;
    });
    $scope.hidePurThings = function() {
        $scope.purThingsModal.hide();
        $scope.showBts = false;
    };
    /*s出库*/
    $ionicModal.fromTemplateUrl('./pages/farm/outWarehouse.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.outWarehouseModal = modal;
    });
    $scope.hideOutWarehouse = function() {
        $scope.outWarehouseModal.hide();
        $scope.showBts = false;
    };
    /*e出库*/
    /*s人工*/
    $ionicModal.fromTemplateUrl('./pages/farm/manpower.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.manpowerModal = modal;
    });
    $scope.hideManpower = function() {
        $scope.manpowerModal.hide();
        $scope.showBts = false;
    };
    $scope.asWhat = 0;
    $scope.changervar = function(data) {
        $scope.asWhat = data;
    };
    $scope.showNum = function(num) {
        $scope.chineseUpcase = Arabia_to_Chinese(num);
    };
    $scope.showNum2 = function() {
        var pay = $scope.purchase.PurchaseNmuber * $scope.purchase.Price;
        var payStr = pay.toString();
        $scope.chineseUpcase = Arabia_to_Chinese(payStr);
    };

    /*e人工*/
    /*销售*/

    $scope.hideMarket = function() {
        $scope.marketModal.remove();
        $scope.showBts = false;
    };
    $scope.market = {};
    $scope.showMarket = function() {
        var date = new Date();
        $scope.market = {
            SysDepID: user.PeID,
            SysRoleID: user.RoleId,
            NowDate: moment(date).format('YYYY-MM-DD'),
            PensSpaceId: moment(date).format('YYMMDDhhmmss'),
            PCnumber: moment(date).format('YYMMDDhhmmss'),
            farmId:  farmIDArray[farmCurrentIndex],
        };
        $ionicModal.fromTemplateUrl('./pages/farm/market.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.showA = true;
            $scope.marketModal = modal;
            $scope.marketModal.show();
        });
    };

    $scope.choosePlainFun = function(showPlain) {
        $scope.cls = $scope.showPlainList.filter(function(val) {
            return val.PID == $scope.market.Homes;
        })[0];
    };

    $scope.saveMarket = function(type) {
        if ($scope.market.Homes == undefined || $scope.market.Homes == "") {
            $scope.showToast('请输入栋舍');
            return false;
        }
        if ($scope.market.Salemode == undefined || $scope.market.Salemode == "") {
            $scope.showToast('请选择销售方式');
            return false;
        }
        if ($scope.market.Homes == undefined || $scope.market.Homes == "") {
            $scope.showToast('请输入栋舍');
            return false;
        }
        if ($scope.market.Income == undefined || $scope.market.Income == "") {
            $scope.showToast('请确定总金额');
            return false;
        }
        $scope.showLoad();
        FarmService.Market($scope.market).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {
                /* var choosetype = $scope.market.Salemode;*/
                var chooseintype = $scope.market.InType;
                $scope.showToast("保存成功");
                if (type == 1) {
                    $scope.marketModal.hide();
                } else {
                    var date = new Date();
                    $scope.market = {
                        SysDepID: user.PeID,
                        SysRoleID: user.RoleId,
                        NowDate: moment(date).format('YYYY-MM-DD'),
                        PensSpaceId: moment(date).format('YYMMDDhhmmss'),
                        FarmID: farmCurrentIndex,
                        PCnumber: "",
                        InType: chooseintype,
                        Remark: '',
                        Salemode: '1',
                        Price: null,
                        Amount: null,
                        Weiight: null,
                        Income: null
                    };
                }
            } else {
                console.log("错误");
            }
        }).error(function(data) {
            $scope.hideLoad();
            console.log("后台错误");
            $scope.showAlert(data.Message);
        });
    };
    $scope.addChooseType = function(data) {
        $scope.market.Salemode = data;
    };
    $scope.showIncome = function() {
        if ($scope.market.Salemode == '1') {
            $scope.market.Income = $scope.market.Price * $scope.market.Amount;
        } else if ($scope.market.Salemode == '2') {
            $scope.market.Income = $scope.market.Price * $scope.market.Weiight;
        }
    };
    /*销售*/
    /*管理*/
    function sumExpenditureTotal(arry) {
        var s = 0;
        for (var i = 0; i < arry.length - 1; i++) {
            s += arry[i];
        }
        return s;
    }
    var manageToday = new Date();
    $scope.manage = {
        sysDepId: user.PeID,
        sysRoleId: user.RoleId,
        date: moment(manageToday).format('YYYY-MM-DD'),
        ShowDate: moment(manageToday).format('YYYY年MM月DD日'),
        page: 1,
        psize: 8,
        //farmId: farmIDArray[farmCurrentIndex],
    };
    $scope.manageList = [];
    $scope.manageCanPullDown = true;

    $scope.data = [];
    $scope.weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    /*数据图*/
    $scope.labels = ["采购饲料", "采购药品", "采购牲畜", "采购物资", "人工", "销售"];

    function manageFunc(sendData) { //上分图表对应的列表
        sendData.farmId = farmIDArray[farmCurrentIndex];
        FarmService.GetPaymentCount(sendData).success(function(data) {
            $scope.hideLoad();
            if (data.Status == true) {
                $scope.data[0] = data.MyObject.FodderCount;
                $scope.data[1] = data.MyObject.DrugCount;
                $scope.data[2] = data.MyObject.CattleCount;
                $scope.data[3] = data.MyObject.SuppliesCount;
                $scope.data[4] = data.MyObject.LaborCount;
                $scope.data[5] = Math.round(data.MyObject.SaleCount);
            }
            $scope.expenditureTotal = Math.round(sumExpenditureTotal($scope.data));
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    }

    function manageFunc2(sendData) { //下方显示列表
        sendData.farmId = farmIDArray[farmCurrentIndex];
        FarmService.GetPaymentList(sendData).success(function(data) {
            if (data.Status === true && data.MyObject.length > 0) {
                $scope.manageList = $scope.manageList.concat(data.MyObject.filter(function(item) {
                    return item.intype != 6;
                }));
                $scope.manageList.forEach(function(val) {
                    val.newdate = (moment(val.date).format('MM月DD日'));
                    val.weekend = (moment(val.date).format('E'));
                });
                $scope.manage.page = ++$scope.manage.page;
            } else if (data.Status === true && data.MyObject.length < $scope.manage.psize) {
                $scope.manageCanPullDown = false;
            } else {
                $scope.manageCanPullDown = false;
                console.log("错误");
            }
        }).error(function(data) {
            $scope.manageCanPullDown = false;
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    }
    var nowDay = null;
    $scope.createAndShowManageAsDay = function() {
        $ionicModal.fromTemplateUrl('./pages/farm/manage.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.manageModal = modal;
            $scope.manageModal.show();
        });
        $scope.showMangeAsDay();
    };
    $scope.initPullMenu = function() {
        $scope.chooseContent = [false, false, false, false, false, false, false];
        $scope.chooseAsType2 = [false, false, false];
        $scope.chooseTime = [false, false];
    };

    $scope.initManageUI = function() {
        $scope.manage.page = 1;
        $scope.manageCanPullDown = true;
        $scope.manageList = [];
    };
    $scope.showMangeAsDay = function() {
        $scope.mangeHasShow = true;
        $scope.showLoad();
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
        $scope.manage.isDate = 1;
        $scope.initManageUI();
        $scope.initPullMenu();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        $scope.manage.ShowDate = moment(manageToday).format('YYYY年MM月DD日');
        nowDay = manageToday;
    };
    $scope.showMangeAsMonth = function() {
        $scope.showLoad();
        $scope.showA = false;
        $scope.showB = true;
        $scope.showC = false;
        $scope.initPullMenu();
        $scope.manage.isDate = 2;
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        $scope.manage.ShowDate = moment(nowDay).format('YYYY年MM月');
        nowDay = manageToday;
    };
    $scope.showMangeAsYear = function() {
        $scope.showLoad();
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
        $scope.initPullMenu();
        $scope.manage.isDate = 3;
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        $scope.manage.ShowDate = moment(nowDay).format('YYYY年');
        nowDay = manageToday;
    };
    $scope.prevDay = function() {
        $scope.showLoad();
        $scope.data = [];
        $scope.manage.date = moment(nowDay).subtract(1, "d").format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).subtract(1, "d").format('YYYY年MM月DD日');
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        nowDay = $scope.manage.date;
    };
    $scope.nextDay = function() {
        $scope.showLoad();
        $scope.data = [];
        $scope.manage.date = moment(nowDay).add(1, "d").format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).add(1, "d").format('YYYY年MM月DD日');
        /*$scope.manage.page = 1;*/
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        nowDay = $scope.manage.date;
    };
    $scope.chooseAsDay = function() {
        $scope.showLoad();
        $scope.manage.isDate = 1;
        $scope.initManageUI();
        $scope.getDate("manage");
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
    };
    $scope.prevMouth = function() {
        $scope.showLoad();
        $scope.data = [];
        $scope.manage.date = moment(nowDay).subtract(1, "M").format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).subtract(1, "M").format('YYYY年MM月');
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        nowDay = $scope.manage.date;
    };
    $scope.nextMouth = function() {
        $scope.showLoad();
        $scope.data = [];
        $scope.manage.date = moment(nowDay).add(1, "M").format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).add(1, "M").format('YYYY年MM月');
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        nowDay = $scope.manage.date;
    };
    $scope.chooseAsMouth = function() {
        $scope.showLoad();
        $scope.manage.isDate = 2;
        $scope.initManageUI();
        $scope.getDate("manage");
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
    };
    $scope.prevYear = function() {
        $scope.showLoad();
        $scope.data = [];
        $scope.manage.date = moment(nowDay).subtract(1, "y").format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).subtract(1, "y").format('YYYY年');
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        nowDay = $scope.manage.date;
    };
    $scope.nextYear = function() {
        $scope.showLoad();
        $scope.data = [];
        $scope.manage.date = moment(nowDay).add(1, "y").format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).add(1, "y").format('YYYY年');
        $scope.initManageUI();
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
        nowDay = $scope.manage.date;
    };
    $scope.chooseAsYear = function() {
        $scope.showLoad();
        $scope.manage.isDate = 3;
        $scope.initManageUI();
        $scope.getDate("manage");
        manageFunc($scope.manage);
        manageFunc2($scope.manage);
    };
    $scope.hideManage = function() {
        $scope.manageModal.hide();
        $scope.mangeHasShow = false;
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
        $scope.showBts = false;
        $scope.initManageUI();
        $scope.data = [];
        $scope.manage.date = moment(manageToday).format('YYYY-MM-DD');
        $scope.manage.ShowDate = moment(nowDay).subtract(1, "days").format('YYYY年MM月DD日');
    };
    $scope.ldj = function(item) {
        console.log(item);
        console.log('按了');
    };
    $scope.showConfirm2 = function(item, $index) {
        var confirmPopup = $ionicPopup.confirm({
            title: '你确定要删除此流水账信息吗？',
            template: '删除此条流水账信息后，之后将不会再出现此条信息。',
            cancelText: "不删除",
            okText: '确定删除'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.deleteThisLSZMessage(item, $index);
            } else {
                return false;
            }
        });
    };
    $scope.deleteThisLSZMessage = function(item, $index) {
        FarmService.DelPaymentById(item).success(function(data) {
            if (data.Status == true) {
                $scope.showToast('删除成功');
                $scope.manageList.splice($index, 1);
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    $scope.ldj2 = function(item) {
        console.log('短按');
    };

    /*选择显示内容*/
    $scope.asWhichContent = '显示内容';
    $scope.asTimeType = '按时间排序';
    $scope.asMoneyType = '按金额排序';
    $scope.chooseAsType2 = [false, false, false];
    $scope.showWhatContent2 = function(x) {
        $scope.chooseAsType2.forEach(function(val, index) {
            if (index != x || $scope.chooseAsType2[index] == true) {
                $scope.chooseAsType2[index] = false;
            } else if (index == x) {
                $scope.chooseAsType2[x] = !$scope.chooseAsType2[x];
            }
        });
    };
    $scope.chooseContent = [false, false, false, false, false, false, false];
    $scope.whichContent = function(x) {
        $scope.chooseContent.forEach(function(val, index) {
            if (index != x || $scope.chooseContent[index] == true) {
                $scope.chooseContent[index] = false;
            } else if (index == x) {
                $scope.chooseContent[x] = !$scope.chooseContent[x];
            }
        });
        $scope.manageList = [];
        if (x != 0) {
            $scope.manage.intype = x;
        } else {
            $scope.manage.intype = '';
        }
        $scope.initManageUI();
        manageFunc2($scope.manage);
        switch (x) {
            case 0:
                $scope.asWhichContent = '全部';
                break;
            case 1:
                $scope.asWhichContent = '采购饲料';
                break;
            case 2:
                $scope.asWhichContent = '采购药品';
                break;
            case 3:
                $scope.asWhichContent = '采购牲畜';
                break;
            case 4:
                $scope.asWhichContent = '采购物资';
                break;
            case 5:
                $scope.asWhichContent = '人工';
                break;
            case 6:
                $scope.asWhichContent = '销售';
                break;
        }
        $timeout(function() {
            $scope.chooseAsType2[0] = false;
        }, 120);
    };

    $scope.chooseTime = [false, false];
    $scope.timeType = function(x) {
        $scope.chooseTime.forEach(function(val, index) {
            if (index != x || $scope.chooseTime[index] == true) {
                $scope.chooseTime[index] = false;
            } else if (index == x) {
                $scope.chooseTime[x] = !$scope.chooseTime[x];
            }
        });
        $scope.initManageUI();
        if (x == 0) {
            $scope.manage.timeasc = 0;
            $timeout(function() {
                $scope.asTimeType = '由近到远';
            });
        } else if (x == 1) {
            $scope.manage.timeasc = 1;
            $timeout(function() {
                $scope.asTimeType = '由远到近';
            });
        }
        manageFunc2($scope.manage);
        $timeout(function() {
            $scope.chooseAsType2[1] = false;
        }, 120);
    };

    $scope.chooseMoney = [false, false];
    $scope.moneyType = function(x) {
        $scope.chooseMoney.forEach(function(val, index) {
            if (index != x || $scope.chooseMoney[index] == true) {
                $scope.chooseMoney[index] = false;
            } else if (index == x) {
                $scope.chooseMoney[x] = !$scope.chooseMoney[x];
            }
        });
        $scope.initManageUI();
        if (x == 0) {
            $scope.manage.moneyasc = 0;
            $timeout(function() {
                $scope.asMoneyType = '由小到大';
            });
        } else if (x == 1) {
            $scope.manage.moneyasc = 1;
            $timeout(function() {
                $scope.asMoneyType = '由大到小';
            });
        }
        manageFunc2($scope.manage);
        $timeout(function() {
            $scope.chooseAsType2[2] = false;
        }, 120);
    };

    $scope.loadMore = function() {
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function() {
            if (!$scope.manageCanPullDown) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            manageFunc2($scope.manage);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
    };


    /*e管理*/

    /*多栏切换控件*/
    $scope.showAModul = function() {
        $scope.showA = true;
        $scope.showB = false;
        $scope.showC = false;
    };
    $scope.showBModul = function() {
        $scope.showA = false;
        $scope.showB = true;
        $scope.showC = false;
    };
    $scope.showCModul = function() {
        $scope.showA = false;
        $scope.showB = false;
        $scope.showC = true;
    };

    $scope.showAModulEnter = function() {
        $scope.showAEnter = true;
        $scope.showBEnter = false;
        $scope.PNOs = [];
    };
    $scope.showBModulEnter = function() {
        $scope.showAEnter = false;
        $scope.showBEnter = true;
        $scope.PNOs = [];
    };

    $scope.serchBlu = function(type) {
        switch (type) {
            case 1:
                $scope.searchBluType = 1;
                break;
            case 2:
                $scope.searchBluType = 2;
                break;
            case 3:
                $scope.searchBluType = 3;
                break;
            case 4:
                $scope.searchBluType = 4;
                break;
            case 5:
                $scope.searchBluType = 5;
                break;
        }
        // $scope.blescan();
    };

    /*新增栋舍*/
    $ionicModal.fromTemplateUrl('pages/farm/penAdd.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.farmAddModal = modal;
    });

    /*新增农场*/
    $scope.farmsAdd = [];
    $scope.farm = {
        penslist: []
    };
    var phonereg = /^1[0-9]{10}$/;
    $scope.showfarmAdd = function() {
        $ionicModal.fromTemplateUrl('pages/farm/farmAdd.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.farmAddModal = modal;
            $scope.farmAddModal.show();
            $scope.addHouse();
        });
        $scope.farm.CommTel = user.Name;
    };

    $scope.hidefarmAdd = function() {
        $scope.farmAddModal.remove();
        $scope.farm = {
            penslist: []
        };
        $scope.dongshes = [];
    };

    $scope.types = [];
    $scope.getTypes = function() {
        $scope.showLoad();
        var IsType = localStorage.getItem('IsType');
        InitService.PlainTypeAll(user.IsType).success(function(data) { /*InitService*/
            $scope.hideLoad();
            $scope.types = data.MyObject;
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showAlert(data.Message);
        });
    };
    $scope.getTypes();

    $scope.dongshes = [];
    $scope.canClick = false;
    $scope.addHouse = function() {
        if ($scope.noticePenAdd == true) {
            $scope.noticePenAdd = false;
        }
        $scope.canClick = true;
        var date = new Date();
        $scope.dongshe = {
            PlainNO: moment(date).format('YYMMDDhhmmss'),
            PlainName: "",
            Status: "",
            plannum: 1
        };
        $scope.dongshes.push($scope.dongshe);
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        }, 100);
        $timeout(function() {
            $scope.canClick = false;
        }, 800);
    };

    $scope.minus = function(dongshe) {
        if (dongshe.plannum > 1) {
            dongshe.plannum = dongshe.plannum - 1;
        }
    };
    $scope.plus = function(dongshe) {
        dongshe.plannum = dongshe.plannum + 1;
    };

    $scope.deleteDongshe = function(index) {
        if ($scope.dongshes.length == 1) {
            $scope.noticePenAdd = true;
        }
        $scope.dongshes.splice(index, 1);
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBy(0, -215, true);
        }, 100);
    };


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
        $ionicModal.fromTemplateUrl('./pages/farm/mudi.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mudiModal = modal;
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
        $scope.mudiModal.remove();
    };

    $scope.addFarm = function() {
        $scope.farmsAdd = [];
        if ($scope.farm.CommName == undefined || $scope.farm.CommName == "") {
            $scope.showToast('请输入农场名称');
            return false;
        }
        if ($scope.mudi.provinceName == undefined || $scope.mudi.provinceName == "") {
            $scope.showToast('请选择所在城市');
            return false;
        }
        if ($scope.mudi.cityName == undefined || $scope.mudi.cityName == "") {
            $scope.showToast('请选择所在城市');
            return false;
        }
        if ($scope.farm.CommAddress == undefined || $scope.farm.CommAddress == "") {
            $scope.showToast('请输入农场地址');
            return false;
        }
        if ($scope.farm.CreatePerson == undefined || $scope.farm.CreatePerson == "") {
            $scope.showToast('请输入联系人');
            return false;
        }
        if ($scope.farm.CommTel == undefined || $scope.farm.CommTel == "") {
            $scope.showToast('请输入联系电话');
            return false;
        }
        if (!phonereg.test($scope.farm.CommTel)) {
            $scope.showToast('手机号格式有误');
            return false;
        }
        for (var i = 0; i < $scope.dongshes.length; i++) {
            if ($scope.dongshes[i].PlainName === "") {
                $scope.showToast("请输入栋舍名称");
                return false;
            }
            if (parseInt($scope.dongshes[i].plannum) === 0) {
                $scope.showToast("请输入栏位数量");
                return false;
            }
        }
        if ($scope.mudi.provinceName.indexOf("市") == -1) {
            $scope.farm.CommAddress = $scope.mudi.cityName + $scope.farm.CommAddress;
        } else {
            $scope.farm.CommAddress = $scope.mudi.provinceName + $scope.mudi.cityName + $scope.farm.CommAddress;
        }
        $scope.farm.penslist = $scope.dongshes;
        if(myposition && myposition != ""){
            $scope.farm.CommGPS = myposition.latitude + "," + myposition.longitude;
        }
        $scope.farmsAdd.push($scope.farm);
        $scope.showLoad();
        InitService.UserComSystemAll($scope.farmsAdd).success(function(data) {
            $scope.hideLoad();
            if (data.Status === true) {

                if (addFarmTimes <= 1) {
                    $scope.newHelp03 = true;
                    $scope.isShowPen = false;
                    $ionicTabsDelegate.showBar(false);
                    $scope.newHelpStep1 = true;
                } else {
                    $scope.newHelp03 = false;
                }

                addFarmTimes++;
                localStorage.setItem('addFarmTimes', addFarmTimes);

                $scope.getFarms('add');
                $scope.dongshes = [];

                var site = $scope.farm.CommAddress.slice(0, $scope.farm.CommAddress.indexOf('市'));
                FarmService.GetWeather(site).success(function(data) {
                    $scope.weather = {};
                    $scope.weather.site = site;
                    $scope.weather.temperature = data.HeWeather5[0].hourly_forecast[0].tmp + "℃";
                    $scope.weather.wData = data.HeWeather5[0].hourly_forecast[0].cond.txt;
                    $scope.weather.weatherPic = weatherData[$scope.weather.wData];
                }).error(function() {
                    console.log('没有获取天气信息');
                });
                $scope.hidefarmAdd();
            } else if (data.Status === false) {
                $scope.showToast(data.Message);
                $scope.farm.CommAddress = null;
            }
        }).error(function(data) {
            $scope.hideLoad();
            $scope.showToast(data.Message);
        });
    };

    $scope.notwork = function() {
        $scope.showToast("此功能暂未开通！");
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
                setValue();
            }
            notifitime++;
        }

        function setValue(){
            if ($scope.currentPage === "feed") {
                $scope.farmFeed.PNO = result;
            } else if ($scope.currentPage === "search") {
                $scope.sendPNO.PNO = result;
                $scope.showSearchDetailsModal();
            } else if ($scope.currentPage === "entry") {
                if($scope.showAEnter) {
                    $scope.PNOs = [result];
                } else {
                    if (!$scope.PNOs.in_array(result)) {
                        $scope.PNOs.push(result);
                    } else {
                        $scope.showToast("耳标已存在");
                    }
                }
            } else if ($scope.currentPage === "Vaccination") {
                $scope.farmVaccination.PNO = result;
            } else if ($scope.currentPage === "Cure") {
                $scope.farmCure.PNO = result;
            } else if ($scope.currentPage === "Death") {
                $scope.farmDeath.DeathObject = result;
            } else if ($scope.currentPage === "feildChange" || $scope.currentPage === "out") {
                if (!$scope.saveFeildChangeAsEarNoArray.in_array(result)) {
                    $scope.saveFeildChangeAsEarNoArray.push(result);
                    $scope.showEarNos.push(result);
                } else {
                    $scope.showToast("耳标已存在");
                }
            }
            $scope.$apply();
        }
    };


    var onFailure = function(error) {
        console.log(error);
        ble.disconnect(deviceble.id, function() {
            // scanble();
        }, function() {
            
        });
    };

    function scanble() {
        console.log("正在扫描外围设备中...");
        $scope.time = 30;
        $ionicLoading.show({
            template: $scope.bleText
        });
        // timeInterval = $interval(function() {
        //     if($scope.time>0){
        //         $scope.time--;
        //     }else{
        //         $interval.cancel(timeInterval);
        //         $scope.time = 30;
        //         $scope.showToast("未发现设备，请检查设备是否开启或已连接其他手机！");
        //         ble.stopScan(
        //             function() { console.log("stopScan complete"); },
        //             function() { console.log("stopScan failed"); }
        //         );
        //         $ionicLoading.hide();
        //     }
        // }, 1000);
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
            // $interval.cancel(timeInterval);
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
                // $interval.cancel(timeInterval);
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
                // if (deviceble) {
                //     ble.isConnected(
                //         deviceble.id,
                //         function() {
                //             ble.disconnect(deviceble.id, function() {
                //                 scanble();
                //             }, function() {
                                
                //             });
                //         },
                //         function() {
                //             console.log("设备未连接");
                //             scanble();
                //         }
                //     );
                // } else {
                //     scanble();
                // }
                scanble();
            },
            function() {
                if(isAndroid){
                    ble.enable(function() {
                        console.log("用户已允许开启蓝牙");
                        // if (deviceble) {
                        //     console.log("正在连接...");
                        //     // connect();
                        //     $scope.connectble();
                        // } else {
                        //     scanble();
                        // }
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

    $scope.$on('modal.hidden', function() {
        if($scope.searchDetailsModal != undefined && !$scope.searchDetailsModal._isShown){
            $scope.searchDetail = false;
            $scope.searchDetailsModal.remove();
        }else if($scope.searchModal != undefined && !$scope.searchModal._isShown){
            $scope.hideSearch();
        }else if($scope.mapModal != undefined && !$scope.mapModal._isShown){
            $scope.mapModal.remove();
        }else{
            $scope.topbtns = false;
            $scope.isShowWeather = false;
        }
    });

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
                $scope.photoImg = UploadOptions.fileName;      // 保存成功的相片
            }, function(err) {
                $scope.hideLoad();
                $scope.showToast("上传失败，请检查网络连接是否正常！");
            }, function(progress) {
                var intProgress = (progress.loaded / progress.loaded ) * 100;
                if(progress.loaded  < progress.loaded ){
                    $ionicLoading.show({
                        template: '上传中：' + parseInt(intProgress) + '%'
                    });
                }else{
                    $scope.hideLoad();
                }
            });
        }, false);
    };

    /* 测试 geolocation 插件返回的数据*/
    $scope.gpsStr = '';
    function getGPS() {
        if(window.cordova){
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat  = position.coords.latitude;
                    var long = position.coords.longitude;
                    $scope.gpsStr = lat + ',' + long;
                    console.log($scope.gpsStr);
                }, function(err) {
                    console.log('错误');
                });
        }
    }
    getGPS();
});