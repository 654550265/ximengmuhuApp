angular.module('app.services', [])
  .factory('LoginService', function($http, $q) {

    return {
      login: function(data) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(appurl + 'GetLogin', {
          params: data
        }).success(function(data) {
          deferred.resolve(data);
        }).error(function() {
          deferred.reject('数据错误.');
        });

        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      SendMessage: function(mobile, code, type) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(appurl + 'SendMessage', {
          params: {
            mobile: mobile,
            content: code,
            istype: type
          }
        }).success(function(data) {
          deferred.resolve(data);
        }).error(function() {
          deferred.reject('数据错误.');
        });

        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      UserRegister: function(mobile, password ,roleType ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(weburl + '/Api/XmApp/UserRegister', {
          params: {
            mobile: mobile,
            password: password,
            roleType: roleType,
          }
        }).success(function(data) {
          deferred.resolve(data);
        }).error(function() {
          deferred.reject('数据错误.');
        });

        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      },
      UserForget: function(mobile, password) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(appurl + 'UserForget', {
          params: {
            mobile: mobile,
            password: password
          }
        }).success(function(data) {
          deferred.resolve(data);
        }).error(function() {
          deferred.reject('数据错误.');
        });

        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    };
  })
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
