angular.module("app.controllers")
    .controller('FarmCtrl', function ($scope, $ionicTabsDelegate) {

//        if (window.localStorage.firstrun === "false" ||window.localStorage.firstrun===undefined) {
//            $state.go("login");
//        }
    })
    .controller('FarmEnterCtrl', function ($scope, $ionicSlideBoxDelegate ,$ionicTabsDelegate) {
        $ionicTabsDelegate.showBar(false);
        $scope.buttonBar = [{
            name: "批量操作",
            active: 1
        }, {
            name: "按耳号操作",
            active: 0
        }];

        $scope.slideHasChanged = function (chooseIndex) {
            $scope.buttonBar.forEach(function (item, index) {
                if (chooseIndex == index) {
                    item.active = 1;
                } else {
                    item.active = 0;
                }
            });
            $ionicSlideBoxDelegate.slide(chooseIndex);
        };
        $scope.$on("$ionicView.beforeLeave", function(event, data){
            $ionicTabsDelegate.showBar(true);
        });

    })

;
