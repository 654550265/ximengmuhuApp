describe('loginCtrl', function() {

    var scope,
        controller, 
        deferredLogin,
        loginServiceMock,
        stateMock,
        ionicPopupMock;
    // var ctrl, scope;

    beforeEach(module('app'));
    beforeEach(module('ionic'));
    beforeEach(module('app.controllers'));
    beforeEach(module('app.services'));

    // disable template caching
    beforeEach(module(function($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
    }));

    // inject the $controller and $rootScope services
    // in the beforeEach block
    // beforeEach(inject(function($controller, $rootScope) {

    //     // create a new scope that’s a child of the $rootScope
    //     scope = $rootScope.$new();

    //     // create the controller
    //     controller = $controller('loginCtrl', {
    //         $scope: scope
    //     });
    // }));

    beforeEach(inject(function($controller, $q, $rootScope) {
        deferredLogin = $q.defer();

        // mock dinnerService
        loginServiceMock = {
            login: jasmine.createSpy('login spy').and.returnValue(deferredLogin.promise)
        };

        // mock $state
        stateMock = jasmine.createSpyObj('$state spy', ['go']);

        // mock $ionicPopup
        ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        scope = $rootScope.$new();

        controller = $controller('loginCtrl', {
            $scope: scope,
            '$ionicPopup': ionicPopupMock,
            '$state': stateMock,
            'LoginService': loginServiceMock
        });
    }));

    describe('#doLogin', function() {

        // TODO: Call doLogin on the Controller
        beforeEach(inject(function(_$rootScope_) {
            $rootScope = _$rootScope_;
            scope.loginData.username = '18601581576';
            scope.loginData.pwd = '123123';
            scope.doLogin();
        }));

        it('should call login on LoginService', function() {
            expect(loginServiceMock.login).toHaveBeenCalledWith(scope.loginData);
        });

        // describe('when the login is executed,', function() {
        //     it('if successful, should change state to farm', function() {

        //         // TODO: Mock the login response from DinnerService
        //         deferredLogin.resolve();
        //         $rootScope.$digest();

        //         expect(stateMock.go).toHaveBeenCalledWith('farm');
        //     });

        //     it('if unsuccessful, should show a popup', function() {

        //         // TODO: Mock the login response from DinnerService
        //         deferredLogin.reject();
        //         $rootScope.$digest();

        //         expect(ionicPopupMock.alert).toHaveBeenCalled();
        //     });
        // });
    });
});
