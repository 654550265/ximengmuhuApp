realidfarm.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $provide, $httpProvider, ngRapProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|geo|mailto|tel|chrome-extension):/);
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
	
	// ngRapProvider.script = 'http://rapapi.org/rap.plugin.js?projectId=16807';
	// ngRapProvider.enable({
	// 	mode: 0,
	// 	disableLog: true
	// });
	// $httpProvider.interceptors.push('rapMockInterceptor');

    $stateProvider.state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: 'pages/tabs.html'
    })

    .state('tab.message', {
        url: '/message',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/message.html',
                controller: 'messageCtrl'
            }
        }
    })

    .state('tab.messageList', {
        url: '/message/list-:id',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/message-list.html',
                controller: 'messageListCtrl'
            }
        }
    })

    .state('tab.makeMsg', {
        url: '/message/make-msg',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/make-msg.html',
                controller: 'makeMsgCtrl'
            }
        }
    })

    .state('tab.messageView', {
        url: '/message/list-:typeId/:id',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/message-view.html',
                controller: 'messageViewCtrl'
            }
        }
    })

    .state('tab.contacts', {
        url: '/message/contacts',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/contacts/index.html',
                controller: 'contactsCtrl'
            }
        }
    })

    .state('tab.mycard', {
        url: '/message/contacts/mycard',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/contacts/mycard.html',
                controller: 'mycardCtrl'
            }
        }
    })

    .state('tab.invite', {
        url: '/message/contacts/invite',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/contacts/invite.html',
                controller: 'inviteCtrl'
            }
        }
    })

    .state('tab.team', {
        url: '/message/contacts/team',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/contacts/team.html',
                controller: 'TeamCtrl'
            }
        }
    })

    .state('tab.serviceGov', {
        url: '/message/service-gov',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/service-gov.html',
                controller: 'serviceGovCtrl'
            }
        }
    })

    .state('tab.serviceBank', {
        url: '/message/service-bank',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/service-bank.html',
                controller: 'serviceBankCtrl'
            }
        }
    })

    .state('tab.serviceSafe', {
        url: '/message/service-safe',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/service-safe.html',
                controller: 'serviceSafeCtrl'
            }
        }
    })

    .state('tab.chat', {
        url: '/message/chat',
        views: {
            'tab-message': {
                templateUrl: 'pages/message/chat.html',
                controller: 'chatCtrl'
            }
        }
    })

    .state('tab.farm', {
        url: '/farm',
        views: {
            'tab-farm': {
                templateUrl: 'pages/farm/farm.html',
                controller: 'farmCtrl'
            }
        }
    })

    .state('tab.farm-entry', {
        url: '/farm/entry',
        views: {
            'tab-farm': {
                templateUrl: 'pages/farm/farm-entry.html',
                controller: 'farmCtrl'
            }
        }
    })

    .state('tab.service', {
        url: '/service',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/service.html',
                controller: 'serviceCtrl'
            }
        }
    })

    .state('tab.standard', {
        url: '/service/standard',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/standard/list.html',
                controller: 'StandardCtrl'
            }
        }
    })

    .state('tab.standard-add', {
        url: '/service/standard/add',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/standard/add.html',
                controller: 'StandardAddCtrl'
            }
        }
    })

    .state('tab.standard-edit', {
        url: '/service/standard/:Id',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/standard/edit.html',
                controller: 'StandardEditCtrl'
            }
        }
    })

    .state('tab.service-task', {
        url: '/service/task',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/task/list.html',
                controller: 'TaskCtrl'
            }
        }
    })

    .state('tab.task-add', {
        url: '/service/task/add',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/task/add.html',
                controller: 'TaskAddCtrl'
            }
        }
    })

    .state('tab.task-view', {
        url: '/service/task/:id',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/task/view.html',
                controller: 'TaskViewCtrl'
            }
        }
    })

    .state('tab.task-review', {
        url: '/service/review/:id',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/task/review.html',
                controller: 'TaskReviewCtrl'
            }
        }
    })

    .state('tab.task-my', {
        url: '/service/mytask/:id',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/task/mytask.html',
                controller: 'MyTaskCtrl'
            }
        }
    })

    .state('tab.video', {
        url: '/service/video',
        views: {
            'tab-service': {
                templateUrl: 'pages/service/video/list.html',
                controller: 'videoCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/account.html',
                controller: 'accountCtrl'
            }
        }
    })

    .state('tab.account-mycard', {
        url: '/account/my-card',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/my-card/my-card.html',
                controller: 'myCardCtrl'
            }
        }
    })

    .state('tab.account-farm-info', {
        url: '/account/farm-info',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/farm-set-up/farm-set-up.html',
                controller: 'farmSetCtrl'
            }
        }
    })

    .state('tab.account-feedback', {
        url: '/account/feedback',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/feedback/feedback.html',
                controller: 'feedBackCtrl'
            }
        }
    })

    .state('tab.account-general-set', {
        url: '/account/general-set',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/general-settings/general-set.html',
                controller: 'generalSetCtrl'
            }
        }
    })

    .state('tab.aboutus', {
        url: '/account/aboutus',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/aboutus.html',
                controller: 'aboutusCtrl'
            }
        }
    })

    .state('tab.newhelp', {
        url: '/account/newhelp',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/newhelp.html',
                controller: 'newhelpCtrl'
            }
        }
    })

    .state('tab.mydevice', {
        url: '/account/mydevice',
        views: {
            'tab-account': {
                templateUrl: 'pages/account/mydevice.html',
                controller: 'mydeviceCtrl'
            }
        }
    })

    .state('welcome', {
        url: "/welcome",
        templateUrl: 'pages/login/welcome.html',
        controller: 'loginCtrl'
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

    .state('forget', {
        url: "/forget",
        templateUrl: 'pages/login/forget.html',
        controller: 'loginCtrl'
    });
    if (runtiems < 1) {
        $urlRouterProvider.otherwise('/welcome');
    } else {
        if(user === null){
            $urlRouterProvider.otherwise('/login');
        }else{
            $urlRouterProvider.otherwise('/tab/farm');
        }
    }

});

angular.module('app.controllers', []);
