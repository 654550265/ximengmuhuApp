var user = JSON.parse(localStorage.getItem('userMessage')) || null;
var UserMessage = JSON.parse(localStorage.getItem('userMessage')) || null;
var ble360 = null;
var deviceble = JSON.parse(localStorage.getItem('deviceble')) || '';
var service_uuid = "0003cdd0-0000-1000-8000-00805f9b0131";
var characteristic_uuid = "0003cdd1-0000-1000-8000-00805f9b0131";
var mydevices = JSON.parse(localStorage.getItem('mydevices')) || [];
angular.module('app', ['ionic', 'app.controllers', 'app.services', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

})

.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|geo|mailto|tel|chrome-extension):/);
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $stateProvider.state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'pages/tabs.html'
        })
        .state('login', {
            url: "/login",
            templateUrl: 'pages/login/login.html',
            controller: 'loginCtrl'
        })
        .state('mess', {
            url: "/mess",
            templateUrl: 'pages/mess/mess.html',
            controller: 'messCtrl'
        })
        .state('register', {
            url: "/register",
            templateUrl: 'pages/login/register.html',
            controller: 'loginCtrl'
        })
        .state('forget', {
            url: "/forget",
            templateUrl: 'pages/login/forget.html',
            controller: 'loginCtrl'
        })
        .state('tab.message', {
            url: '/message',
            views: {
                'tab-message': {
                    templateUrl: 'pages/message/message.html',
                    controller: 'MessageCtrl'
                }
            }
        })
        .state('tab.messageList', {
            url: '/message/messageList:type:name',
            views: {
                'tab-message': {
                    templateUrl: 'pages/message/messageList.html',
                    controller: 'MessageListCtrl'
                }
            }
        })
        .state('tab.messageOrder', {
            url: '/message/messageOrder',
            views: {
                'tab-message': {
                    templateUrl: 'pages/message/messageOrder.html',
                    controller: 'MessageOrdersCtrl'
                }
            }
        })
        .state('tab.OrderMessageList', {
            url: '/message/OrderMessageList',
            views: {
                'tab-message': {
                    templateUrl: 'pages/message/OrderMessageList.html',
                    controller: 'MessageOrderCtrl'
                }
            }
        })
        .state('tab.farm', {
            url: '/farm',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/farm.html',
                    controller: 'FarmCtrl'
                }
            }
        })
        .state('tab.service', {
            url: '/service',
            views: {
                'tab-service': {
                    templateUrl: 'pages/service/service.html',
                    controller: 'ServiceCtrl'
                }
            }
        })
        .state('tab.buyFeed', {
            url: '/service/buy-feed',
            views: {
                'tab-service': {
                    templateUrl: 'pages/service/buy-feed.html',
                    controller: 'ServiceSunCtrl'
                }
            }
        })
        .state('tab.buy-drugs', {
            url: '/service/buy-drugs',
            views: {
                'tab-service': {
                    templateUrl: 'pages/service/buy-drugs.html',
                    controller: 'ServiceSunCtrl'
                }
            }
        })
        .state('tab.vaccination', {
            url: '/farm/vaccination',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/vaccination.html',
                    controller: 'FarmSubCtrl'
                }
            }
        })
        .state('tab.add-vaccination', {
            url: '/farm/add-vaccination',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/add-vaccination.html',
                    controller: 'FarmAddCtrl'
                }
            }
        })
        .state('tab.quarantine', {
            url: '/farm/quarantine',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/quarantine.html',
                    controller: 'FarmSubCtrl'
                }
            }
        })
        .state('tab.add-quarantine', {
            url: '/farm/add-quarantine',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/add-quarantine.html',
                    controller: 'FarmAddCtrl'
                }
            }
        })
        .state('tab.cure', {
            url: '/farm/cure',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/cure.html',
                    controller: 'FarmSubCtrl'
                }
            }
        })
        .state('tab.add-cure', {
            url: '/farm/add-cure',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/add-cure.html',
                    controller: 'FarmAddCtrl'
                }
            }
        })
        .state('tab.order', {
            url: '/farm/order',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/order.html',
                    controller: 'FarmOrderCtrl'
                }
            }
        })
        .state('tab.wipe-out', {
            url: '/farm/wipe-out',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/wipe-out.html',
                    controller: 'FarmWipeOutCtrl'
                }
            }
        })
        .state('tab.enter', {
            url: '/farm/enter',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/enter.html',
                    controller: 'FarmEnterCtrl'
                }
            }
        })
        .state('tab.messageOrders', {
            url: '/farm/messageOrder',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/messageOrder.html',
                    controller: 'messageOrdersCtrl'
                }
            }
        })
        .state('tab.out', {
            url: '/farm/out',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/out.html',
                    controller: 'FarmOutCtrl'
                }
            }
        })
        .state('tab.feed', {
            url: '/farm/feed',
            views: {
                'tab-farm': {
                    templateUrl: 'pages/farm/feed.html',
                    controller: 'FarmFeedCtrl'
                }
            }
        })
        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'pages/account/account.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        .state('tab.giveUsMess', {
            url: '/account/giveUsMess',
            views: {
                'tab-account': {
                    templateUrl: 'pages/account/giveUsMess.html',
                    controller: 'AccountSubCtrl'
                }

            }
        })
        .state('tab.setFarm', {
            url: '/account/setFarm',
            views: {
                'tab-account': {
                    templateUrl: 'pages/account/setFarm.html',
                    controller: 'AccountSubCtrl'
                }
            }
        })
        .state('tab.aboutMe', {
            url: '/account/aboutMe',
            views: {
                'tab-account': {
                    templateUrl: 'pages/account/aboutMe.html',
                    controller: 'AccountSubCtrl'
                }
            }
        })
        .state('tab.feedback', {
            url: '/account/feedback',
            views: {
                'tab-account': {
                    templateUrl: 'pages/account/feedback.html',
                    controller: 'AccountFeedCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise('/tab/farm');
});
angular.module('app.controllers', []);
