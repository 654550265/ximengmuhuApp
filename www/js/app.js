angular.module('app', ['ionic', 'app.controllers','app.services'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab', {
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
            .state('tab.message', {
                url: '/message',
                views: {
                    'tab-message': {
                        templateUrl: 'pages/message/message.html',
                        controller: 'MessageCtrl'
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
            .state('tab.enter', {
                url: '/farm/enter',
                views: {
                    'tab-farm': {
                        templateUrl:  'pages/farm/enter.html',
                        controller:'FarmEnterCtrl',
                    }
                }
            })
            .state('tab.out', {
                url: '/farm/out',
                views: {
                    'tab-farm': {
                        templateUrl:  'pages/farm/out.html',
                        controller:'FarmEnterCtrl',
                    }
                }
            })
            .state('tab.feed', {
                url: '/farm/feed',
                views: {
                    'tab-farm': {
                        templateUrl:  'pages/farm/feed.html',
                        controller:'FarmEnterCtrl',
                    }
                }
            })
            .state('tab.wipe-out', {
                url: '/farm/wipe-out',
                views: {
                    'tab-farm': {
                        templateUrl:  'pages/farm/wipe-out.html',
                        controller:'FarmEnterCtrl',
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
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'pages/account/account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/farm');

    });
angular.module('app.controllers', []);
