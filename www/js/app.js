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
                templateUrl: 'templates/tabs.html'
            })
            .state('login', {
              url: "/login",
              templateUrl: 'templates/login/login.html',
              controller: 'loginCtrl'
            })
            .state('tab.message', {
                url: '/message',
                views: {
                    'tab-message': {
                        templateUrl: 'templates/tab-message.html',
                        controller: 'MessageCtrl'
                    }
                }
            })
            .state('tab.farm', {
                url: '/farm',
                views: {
                    'tab-farm': {
                        templateUrl: 'templates/tab-farm.html',
                        controller: 'FarmCtrl'
                    }
                }
            })
            .state('tab.service', {
                url: '/service',
                views: {
                    'tab-service': {
                        templateUrl: 'templates/tab-service.html',
                        controller: 'ServiceCtrl'
                    }
                }
            })
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/farm');

    });
