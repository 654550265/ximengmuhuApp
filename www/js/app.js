angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
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
