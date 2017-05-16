angular.module('app.services', [])

.factory('AnalyticsService', function() {

    return {
        trackView: function(title) {
            document.addEventListener('deviceready', function() {
                window.ga.trackView(title);
            }, false);
        }
    };
})

.factory('PushService', function($http, $q) {

    return {
        PostPushSystem: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'PostPushSystem', {
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
        }
    };
})

.factory('VersionService', function($http, $q) {

    return {
        get: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'version').success(function(data) {
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

.factory('InitService', function($http, $q) {

    return {
        UserComSystem: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'UserComSystem', {
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
        GetUserFarmRoleList: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetUserFarmRoleList', {
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
        UserComSystemAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http({
                method: 'POST',
                url: appurl + 'UserComSystemAll',
                data: $.param({
                    userid: user.Id,
                    CommunMemberList: JSON.stringify(data)
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
        UserComSystemAllAdd: function(id,data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http({
                method: 'POST',
                url: appurl + 'UserComSystemAllAdd',
                data: $.param({
                    userid:  user.Id,
                    ID:id,
                    CommunMemberList: angular.toJson(data)
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
        PlainTypeAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'PlainTypeAll', {
                params: {
                    IsType: data
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

.factory('MessageService', function($http, $q) {

    return {
        NewsTypeAll: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'NewsTypeAll', {
                params: {
                    userid: user.Id
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
        NewsTypeList: function(istype, page) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'NewsTypeList', {
                params: {
                    userid: user.Id,
                    istype: istype,
                    page: page
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
        NewsTypeDetail: function(istype, pushid) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'NewsTypeDetail', {
                params: {
                    userid: user.Id,
                    istype: istype,
                    pushid: pushid
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
        PublicNews: function(message) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
                method: 'POST',
                url: appurl + 'PublicNews',
                data: $.param({
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    userid: user.Id,
                    username: user.Name,
                    title_name: message.title_name,
                    title_type: message.title_type,
                    theContent: message.theContent,
                    userlist: message.userlist
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
        GetPersonAll: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetPersonAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId
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
        Community: function(CommName) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'Community', {
                params: {
                    CommName: CommName
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
        GetUserQR: function(phone) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetUserQR', {
                params: {
                    phone: phone
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
        Inviter: function(Inviter) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'Inviter', {
                Inviter: Inviter
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
                return promise;
            };
            return promise;
        },
        DoInviter: function(type, Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.put(appurl + 'Inviter', {
                type: type,
                Id: Id
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
        JoinFarm: function(Inviter) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'JoinFarm', {
                Inviter: Inviter
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
        DoJoinFarm: function(type, Id, RoleId) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.put(appurl + 'JoinFarm', {
                type: type,
                Id: Id,
                RoleId: RoleId
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
        getTeams: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'Team', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    userid: user.Id
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

.factory('FarmService', function($http, $q) {

    return {
        list: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetCommAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    userid: user.Id
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
        GetHerdsmanList : function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/Api/XmApp/GetHerdsmanList', {
                params: {
                    vetId: user.Id
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
        listByPhone: function(phone) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetOtherCommAll', {
                params: {
                    phone: phone
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
        GetLWAll: function(penid) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetLWAll', {
                params: {
                    penid: penid,
                    IsType: user.IsType
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
        DeletePen: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'DeltePen', {
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
        DelPaymentById: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/payincomeapp/DelPaymentById', {
                params:{
                    id: data.Id,
                    intype: data.intype
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
        RLPlainAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'RLPlainAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    username: user.Name,
                    IsType: data.IsType,
                    PCNO: data.PCNO,
                    PCNum: data.PCNum,
                    planlst: data.planlst
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
        RLPNOPlainAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/Api/XmApp/RLPNOPlainAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    username: user.Name,
                    IsType: data.IsType,
                    PCNO: data.PCNO,
                    PCNum: data.PCNum,
                    planlst: data.planlst,
                    PCList: data.PCList,
                    personId: data.personId,
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
        BatchInputPlain: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/Api/XmApp/BatchInputPlain', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    username: user.Name,
                    IsType: data.IsType,
                    PCNO: data.PCNO,
                    PCNum: data.PCNum,
                    planlst: data.planlst,
                    PCList: data.PCList
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
        GetUserEarTagHistory: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/Api/XmApp/GetUserEarTagHistory', {
                params: {
                    username:user.Name,
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
        GetPlainCattleList: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetPlainCattleList', {
                params:data
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
        TrunFieldByearTag : function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http({
                method: 'POST',
                url: appurl + 'TrunFieldByearTag',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
        CLPlainAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'CLPlainAll', {
                params:{
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    username: user.Name,
                    PlainID: data.PlainID,
                    ZRPlainID: data.ZRPlainID,
                    PCNum: data.PCNum,
                    PenID: data.PenID,
                    intType: data.intType,
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
        TaotaiAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'TaotaiAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    username: user.PersonName,
                    IsType: data.IsType,
                    TTNo: data.TTNo,
                    DJTime: data.DJTime,
                    EarNo: data.EarNo,
                    PlainID: data.PlainID,
                    PlainName: data.PlainName,
                    PensID : data.PenID,
                    TTMore: data.TTMore,
					ttCount:data.ttCount
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
        GetDWCSAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetDWCSAll', {
                params: {
                    IsType: user.IsType,
                    plainid: data
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
        GetWeather: function (CommAddress) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get("https://free-api.heweather.com/v5/hourly",{
                    params: {
                        key: "84f4807c2b9c4796b1c7caead7123013",
                        city: CommAddress
                    }
                }
            ).success(function(data) {
                deferred.resolve(data);
            }).error(function(reason) {
                deferred.reject(reason);
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
        Purchase: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/PayIncomeApp/getExpenditure', {
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
        Market: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/PayIncomeApp/getIncomeData', {
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
        Manage: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/PayIncomeApp/getAdministration', {
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
        GetPaymentCount: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/PayIncomeApp/GetPaymentCount', {
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
        GetPaymentList: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/PayIncomeApp/GetPaymentList', {
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
        saveFarmFeed: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'Feedingrecord', {
                "Feedingrecord": data,
                "Materiel": data.Materiel
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
        DelFarmRecordById: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/DelFarmRecordById', {
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
        saveFarmVaccination: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'Immuntionrecord', {
                "Immuntionrecord": data,
                "Materiel": data.Materiel
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
        saveFarmCure: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'Treatrecord', {
                "Treatrecord": data,
                "Materiel": data.Materiel
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
        saveFarmDeath: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'Obituary', {
                Obituary: data
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
        saveDeathAll: function (data, PCNum) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'ObituaryAll', {
                Obituary: data,
                PCNum: PCNum
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
        showFarmDetails: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/GetNSAll', {
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
        GetFarmRecordList: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/GetFarmRecordList', {
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
        SerachPNO: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/SearchPNO', {
                params: {
                    PNO: data.PNO,
                    userid: user.Id
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
        GetSupplierAll: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/GetSupplierAll', {
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
        GetWLAll: function (type,user) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/GetWLAll', {
                params:{
                    SysDepID: user.SysDepID,
                    SysRoleID: user.SysRoleID,
                    FeedType: type,
                    farmId: user.farmId,
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
        GetFeedUnits: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/app/GetFeedUnits').success(function(data) {
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
        GetNSDetail: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + '/app/GetNSDetail', {
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
        GetPlainRolerefUerList: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetPlainRolerefUerList', {
                params: {
                    sysdepId: user.PeID,
                    sysroleId: user.RoleId
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
        SavePlainChargeData : function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'SavePlainChargeData ', data).success(function(data) {
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

.factory('SearchService', function($http, $q) {

    return {
        PPZ: function(Id, PType) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetSpeciesAll', {
                params: {
                    Id: Id,
                    PType: PType
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
        PFather: function(Id, PType) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetFatherAll', {
                params: {
                    Id: Id,
                    PType: PType
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
        PMohter: function(Id, PType) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetMotherAll', {
                params: {
                    Id: Id,
                    PType: PType
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
        update: function(PMember) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'SavePNOAll', {
                PMember: PMember
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function() {
                deferred.reject('数据错误.');
            });

            // $http.get(appurl + 'SavePNOAll', {
            //     params: PMember
            // }).success(function(data) {
            //     deferred.resolve(data);
            // }).error(function() {
            //     deferred.reject('数据错误.');
            // });

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

.factory('ServiceService', function($http, $q) {

    return {
        AddOrderAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/AddOrderAll', {
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
        one: function(Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/GetOrderAll', {
                params: {
                    Id: Id
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
        GetDepartment: function(Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/GetDepartment', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    Id: Id
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
        GetPreOrderAll: function(OrderZID) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/GetPreOrderAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    OrderZID: OrderZID
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
        list: function(IsType) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/GetOrderzAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    page: 1,
                    IsType: IsType
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
        FeedProsGet: function(istype, FeedName) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/FeedProsGet', {
                params: {
                    istype: istype,
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    FeedName: FeedName
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
        saveWork: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/SavePreOrderAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    OrderZID: data.OrderZID,
                    Daylist: data.Daylist,
                    PFList: data.PFList,
                    TaskName: data.TaskName,
                    TXTime: data.TXTime,
                    Id: data.Id,
                    TaskID: data.TaskID,
                    OrderID: data.OrderID,
                    TaskBID: data.TaskBID,
                    TaskCID: data.TaskCID
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
        saveRelated: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/SaveOrderPlainAll', {
                params: {
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    TaskID: data.standardId,
                    ComID: data.farmId,
                    PenID: data.houseId,
                    PlainID: data.columnId
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
        deleteStandard: function(Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/DeleteOrderAll', {
                params: {
                    Id: Id
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
        GetMyOrderAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/GetMyOrderAll', {
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
        ReadMyOrder: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/ReadMyOrder', {
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
        SaveOrderAll: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/SaveOrderAll', {
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
        saveCancel: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/DeleteOrderPlainAll', {
                params: {
                    TaskID: data.standardId,
                    OrderPlainList: data.columns
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
        DeleteOrderPlain: function(Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/DeleteOrderPlain', {
                params: {
                    Id: Id
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

.factory('AccountService', function($http, $q) {

        return {
            getPersonalinformation: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/getPersonalinformation', {
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
            getModifypersonalinformation: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/getModifypersonalinformation', {
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
            farmInfo: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/FarmSet', {
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
            setFarm: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/SetFarm', {
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
            getFarmPesronInfo: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/GetAppFarmWorkers', {
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
            getFarmPesronList: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/GetAppFarmWorkersList', {
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
            getFarmPesronInformation: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/getinformation', {
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
            setFarmPesronInformation : function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/setinformation', {
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
            getCorporationInformation : function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/getCompanyinformation', {
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
            setCorporationInformation : function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/setCompanyinformation', {
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
            deleteOtherFarm : function(user,FarmId) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/deleteOtherFarm', {
                    params:{
                        SysDepID: user.SysDepID,
                        SysRoleID: user.SysRoleID,
                        Id: user.Id,
                        FarmId: FarmId
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
            deleteWorker : function(workerId,FarmId) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/MyApp/deleteWorker', {
                    params:{
                        WorkerId: workerId,
                        FarmId: FarmId
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
            GetAppMenuList: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get(weburl + '/SysAppMenu/GetAppMenuList', {
                    params:data
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
            SaveAppRolePermission: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http({
                    method: 'POST',
                    url: weburl + '/SysAppMenu/SaveAppRolePermission',
                    data: $.param(data),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
            SaveCommentData: function(data) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post(weburl  + '/F_Comment/SaveCommentData',
                           data
                ).success(function(data) {
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
        }
})

.factory('HerdsmanService', function($http, $q) {

    return {
        list: function(searchData) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'Suppliers', {
                params: {
                    userid: user.Id,
                    Rank: user.Rank,
                    RoleNameAll: user.RoleNameAll,
                    searchData: searchData
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
        one: function(Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'Supplier', {
                params: {
                    userid: user.Id,
                    Rank: user.Rank,
                    Id: Id
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
        save: function(Supplier, SupplierMembers) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post(appurl + 'Supplier', {
                userid: user.Id,
                Rank: user.Rank,
                Supplier: Supplier,
                SupplierMembers: SupplierMembers
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
        edit: function(Supplier, SupplierMembers) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.put(appurl + 'Supplier', {
                userid: user.Id,
                Rank: user.Rank,
                Supplier: Supplier,
                SupplierMembers: SupplierMembers
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
        delete: function(Id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.delete(appurl + 'Supplier', {
                params:{
                    userid: user.Id,
                    Id: Id
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

.factory('MemberService', function($http, $q) {

    return {
        GetInfo: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetSupplierMember').success(function(data) {
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
        GetPerson: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetPerson', {
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
        SavePerson: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'SavePerson', {
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
        }
    };
})

.factory('TaskService', function($http, $q) {

    return {
        save: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/AddOrderPlain', {
                params: {
                    userid: user.Id,
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId,
                    PFList: data.PFList,
                    TaskName: data.TaskName,
                    TaskDate: data.TaskDate,
                    TaskTime: data.TaskTime,
                    TaskBID: data.TaskBID,
                    TaskCID: data.TaskCID,
                    ComID: data.ComID,
                    PenID: data.PenID,
                    PlainID: data.PlainID
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

.factory('QQLbsService', function($http, $q) {

    return {
        getDistrict: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get('http://apis.map.qq.com/ws/district/v1/list', {
                params: {
                    key: 'KM2BZ-O4YC5-ZOJIA-QUKH7-ZX547-VZF3Y'
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
        getChildren: function(id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get('http://apis.map.qq.com/ws/district/v1/getchildren', {
                params: {
                    id: id,
                    key: 'KM2BZ-O4YC5-ZOJIA-QUKH7-ZX547-VZF3Y'
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
        getqqgps: function(locations) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get('http://apis.map.qq.com/ws/coord/v1/translate', {
                params: {
                    locations: locations,
                    type: 1,
                    key: 'KM2BZ-O4YC5-ZOJIA-QUKH7-ZX547-VZF3Y',
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

.factory('ForemanService', function($http, $q) {
    return {
        list: function(CommID) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetForemans', {
                params: {
                    CommID: CommID
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
        save: function(id) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get('http://apis.map.qq.com/ws/district/v1/getchildren', {
                params: {
                    id: id,
                    key: 'KM2BZ-O4YC5-ZOJIA-QUKH7-ZX547-VZF3Y'
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

.factory('VideoService', function($http, $q) {
    return {
        list: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/GetCommunityVideos', {
                params: {
                    userid: user.Id,
                    SysDepID: user.PeID,
                    SysRoleID: user.RoleId
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
        setVideoInfo: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/ServiceApp/setVideoInfo', {
                params: {
                    id: user.Id,
                    cameraId: data.CameraId,
                    alias: data.Alias,
                    devType: data.CameraType,
                    PenId: data.PenId
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

.directive('select',function(){ //same as "ngSelect"
    return {
        restrict: 'E',
        scope: false,
        link: function (scope, ele) {
            ele.on('touchmove touchstart',function(e){
                e.stopPropagation();
            });
        }
    };
})

.directive('starRating', function() {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function(scope, elem, attrs) {

            var updateStars = function() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function(index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function(oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
})

.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return val != null ? parseInt(val, 10) : null;
      });
      ngModel.$formatters.push(function(val) {
        return val != null ? '' + val : null;
      });
    }
  };
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
;
