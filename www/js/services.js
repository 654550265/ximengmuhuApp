angular.module('app.services', [])
.factory('LoginService', function ($http, $q) {
    return {
        /*
         *  x = {
         *       a:1,
         *       b:2,
         *  }
         *
         *   a=1&b=2
         *
         *
         *   longinData = {
         *
         *       loginPwd: 123123,
         *
         *   }
         *
         *
         * */
        lhlogin: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'GetLogin', {
                params: data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('数据错误.');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        login: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(weburl + '/Api/XmApp/AppLogin', {
                params: data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('数据错误.');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        SendMessage: function (mobile, code, type) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'SendMessage', {
                params: {
                    mobile: mobile,
                    content: code,
                    istype: type
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('数据错误.');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        UserRegister: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + '/Api/XmApp/UserRegister', {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject('数据错误.');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        UserForget: function (mobile, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get(appurl + 'UserForget', {
                params: {
                    mobile: mobile,
                    password: password
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('数据错误.');
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    };
})
//消息服务模块
.factory("RegisterService", function ($http, $q) {
    return {
        Register: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/UserRegister", {
                params: data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
}).factory("MessageService", function ($http, $q) {
    return {
        init: function () {
            var items = [{
                name: "通知公告",
                icon: "img/alert.png",
                type: 1
            }, {
                name: "新闻",
                icon: "img/news.png",
                type: 2
            }, {
                name: "日常",
                icon: "img/daily.png",
                type: 3
            }];
            return items;
        },
        getMessage: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetNewList", {
                params: data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        list: function (page, newsType) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetNewList", {
                params: {
                    page: page,
                    psize: 20,
                    sysroleId: UserMessage.RoleId,
                    sysDepId: UserMessage.SysDeptId,
                    newsType: newsType
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.resolve("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        GetSaleOrderFeedBack: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetSaleOrderFeedBack", {
                params:data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.resolve("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        GetSaleOrderFeedBackJia:function(page){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetSaleOrderFeedBack", {
                params:{
                    uid:UserMessage.Id,
                    sysroleId:UserMessage.RoleId,
                    sysDepId:UserMessage.SysDeptId,
                    istype:1,
                    page:page,
                    psize:5
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.resolve("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
}).factory("EnterService", function ($http, $q) {
    return {
        getEnter: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/InputPlain", {
                params: data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        getEnters: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/BatchInputPlain", {
                params: data
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        GetVariety:function(data){
            var deferred=$q.defer();
            var promise=deferred.promise;
            $http.get(weburl+"/Api/XmApp/GetVariety",{
                params:data
            }).success(function(data){
                deferred.resolve(data);
            }).error(function(){
                deferred.reject("数据错误");
            });
            promise.success=function(fn){
                promise.then(fn);
                return promise;
            };
            promise.error=function(fn){
                promise.then(null,fn);
                return promise;
            }
            return promise;
        }
    }
}).factory("MessService", function ($http, $q) {
    return {
        getProvince: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetSysAreaList", {}).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getCity: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetSysAreaList", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        PostFarm: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/UpdateRegInfo", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
}).factory("OutService", function ($http, $q) {
    return {
        OutSave: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/OutField", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        wiepOut: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/DieOut", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getFeedList: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetFeedList", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        BuyFeedFood: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetFeedList", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        GetFeedUnit: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetFeedUnit", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
}).factory("NewMessageService", function ($http, $q) {
    return {
        GetMySaleOrder: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetMySaleOrder", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        GetEnterpriseSaleOrderList: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetEnterpriseSaleOrderList", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        SaleOrder: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/SaleOrder", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        GetSlaughterList: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetSlaughterList", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error=function(fn){
                promise.then(null,fn);
                return promise;
            };
            return promise;
        },
        GetSaleOrderRefDic: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetSaleOrderRefDic", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        ComfirmMyOrder:function(data){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/ComfirmMyOrder", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        OutOrderXiaLa:function(page){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetMySaleOrder", {
                params: {
                    uid:UserMessage.Id,
                    pubType:1,
                    page:page,
                    psize:3
                }
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getOrderUpLa:function(page){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetEnterpriseSaleOrderList", {
                params: {
                    uid:UserMessage.Id,
                    pubType:1,
                    page:page,
                    psize:3
                }
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        OutOrderXiaLas:function(){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/GetEnterpriseSaleOrderList", {
                params: {
                    uid:UserMessage.Id,
                    pubType:1,
                    page:1,
                    psize:3
                }
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
}).factory("setFarmService", function ($http, $q) {
    return {
        setFarmSave: function (data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(weburl + "/Api/XmApp/UpdateComInfo", {
                params: data
            }).success(function (res) {
                deferred.resolve(res);
            }).error(function () {
                deferred.reject("数据错误");
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
});
