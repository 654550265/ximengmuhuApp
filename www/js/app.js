var version = "1.0.5";
var user = JSON.parse(localStorage.getItem('user')) || null;
var authority = JSON.parse(localStorage.getItem('authority')) || [];
var weather = localStorage.getItem('weather') || '';
var firstrun = JSON.parse(localStorage.getItem('firstrun')) || true;
var lastpage = localStorage.getItem('lastpage') || null;
var regID = localStorage.getItem('regID') || '';

var farms = JSON.parse(localStorage.getItem('farms')) || null;
var farmsNum = localStorage.getItem('farmsNum') || null;

var isIOS = ionic.Platform.isIOS();
var isAndroid = ionic.Platform.isAndroid();

var db = null;
var runtiems = localStorage.getItem('runtiems') || 0;
var addFarmTimes = localStorage.getItem('addFarmTimes') || 0;
var readServiceTimes = localStorage.getItem('readServiceTimes') || 0;
var weChatUrl = "http://nc.realidfarm.com";
var ble360 = null;
var deviceble = JSON.parse(localStorage.getItem('deviceble')) || '';
var myposition = JSON.parse(localStorage.getItem('myposition')) || null;
var service_uuid = "0003cdd0-0000-1000-8000-00805f9b0131";
var characteristic_uuid = "0003cdd1-0000-1000-8000-00805f9b0131";
var mydevices = JSON.parse(localStorage.getItem('mydevices')) || [];
var weatherData = {
    "晴": "img/sunny.png",
    "未知": "img/sunny.png",
    "热": "img/sunny.png",
    "平静": "img/sunny.png",
    "晴间多云": "img/overcast.png",
    "阴": "img/overcast.png",
    "薄雾": "img/overcast.png",
    "雾": "img/overcast.png",
    "霾": "img/overcast.png",
    "多云": "img/cloudy.png",
    "少云": "img/cloudy.png",
    "阵雨": "img/drizzle.png",
    "毛毛雨": "img/drizzle.png",
    "毛毛雨/细雨": "img/drizzle.png",
    "细雨": "img/drizzle.png",
    "小雨": "img/drizzle.png",
    "雨夹雪": "img/rainy.png",
    "中雨": "img/rainy.png",
    "冻雨": "img/heavy-rain.png",
    "大雨": "img/heavy-rain.png",
    "极端降雨": "img/heavy-rain.png",
    "暴雨": "img/heavy-rain.png",
    "大暴雨": "img/heavy-rain.png",
    "特大暴雨": "img/heavy-rain.png",
    "强阵雨": "img/thundershower.png",
    "雷阵雨": "img/thundershower.png",
    "强雷阵雨": "img/thundershower.png",
    "雷阵雨伴有冰雹": "img/thundershower.png",
    "小雪": "img/snowy.png",
    "阵雨夹雪": "img/snowy.png",
    "阵雪": "img/snowy.png",
    "中雪": "img/heavy-snowy.png",
    "雨雪天气": "img/heavy-snowy.png",
    "有风": "img/sand-storm.png",
    "和风": "img/sand-storm.png",
    "清风": "img/sand-storm.png",
    "大风": "img/sand-storm.png",
    "烈风": "img/sand-storm.png",
    "龙卷风": "img/sand-storm.png",
    "热带风暴": "img/sand-storm.png",
    "大雪": "img/heavy-snowy.png",
    "冷": "img/heavy-snowy.png",
    "暴雪": "img/heavy-snowy.png",
    "冰雹": "img/hail.png",
    "沙尘暴": "img/sand-storm.png",
    "浮尘": "img/sand-storm.png",
    "扬沙": "img/sand-storm.png",
    "强沙尘暴": "img/sand-storm.png"
};

var realidfarm = angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.services', "chart.js", 'ngRap'])

.run(function($rootScope, $ionicPlatform, $ionicHistory, $ionicLoading, $cordovaGeolocation, QQLbsService, $cordovaKeyboard) {

    $ionicPlatform.registerBackButtonAction(function(e) {
        if (($ionicHistory.currentView().stateId == 'login' || $ionicHistory.currentView().stateId == 'tab.message' || $ionicHistory.currentView().stateId == 'tab.farm' || $ionicHistory.currentView().stateId == 'tab.service' || $ionicHistory.currentView().stateId == 'tab.account') && $rootScope.backButtonPressedOnceToExit) {
            // localStorage.setItem('lastpage', $ionicHistory.currentView().stateId);
            ionic.Platform.exitApp();
        } else if ($ionicHistory.backView() && $ionicHistory.currentView().stateId !== 'login' && $ionicHistory.currentView().stateId !== 'tab.message' && $ionicHistory.currentView().stateId !== 'tab.farm' && $ionicHistory.currentView().stateId !== 'tab.service' && $ionicHistory.currentView().stateId !== 'tab.account') {
            $ionicLoading.hide();
            $ionicHistory.goBack();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            window.plugins.toast.showShortCenter(
                "再按一次退出",
                function(a) {},
                function(b) {}
            );
            setTimeout(function() {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 3000);
            // $ionicLoading.hide();
            // $ionicHistory.goBack();
        }
        e.preventDefault();
        return false;
    }, 101);

    $ionicPlatform.ready(function() {


        if (window.cordova && window.cordova.plugins.Keyboard) {
            window.ga.startTrackerWithId('UA-92403913-1', 30);
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            //cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.cordova && $cordovaKeyboard) {
            //$cordovaKeyboard.hideAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
            if (isAndroid) {
                // StatusBar.backgroundColorByHexString("#2DCC86");
            } else {
                //StatusBar.overlaysWebView(true);
            }
        }

        if (window.cordova) {
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 300);

            runtiems++;
            localStorage.setItem('runtiems', runtiems);
        }

        var posOptions = { timeout: 10000, enableHighAccuracy: true };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
            QQLbsService.getqqgps(position.coords.latitude + "," + position.coords.longitude).success(function(data) {
                if (data.status === 0) {
                    myposition = {
                        latitude: data.locations[0].lat,
                        longitude: data.locations[0].lng
                    };
                    localStorage.setItem('myposition', JSON.stringify(position));
                }
            }).error(function(data) {
                $scope.showAlert(data.Message);
            });
        }, function(err) {
            // error
        });

    });
});

angular.module('app.controllers', []);