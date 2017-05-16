angular.module('app.controllers')
	.controller('generalSetCtrl', function ($scope, $state, $ionicTabsDelegate) {

		$ionicTabsDelegate.showBar(false);

		$scope.backToAccount = function () {
			$state.go('tab.account');
			$ionicTabsDelegate.showBar(true);
		};
		$scope.checkNetwork = {};
		if(!!localStorage.getItem('networkURL')){
			$scope.checkNetwork.name = JSON.parse(localStorage.getItem('networkURL')).name;
		}
		$scope.networks = [
			{
				name:"正式网络版",
				url:'http://61.177.139.219:14803',
				value: 1
			},
			{
				name:"测试网络版",
				url: 'http://61.177.139.219:14806',
				value: 2
			},
			{
				name:"公司内网",
				url:'http://192.168.5.228:1312',
				value: 3
			}
		];

		$scope.checkNetworkChange = function (item) {
			console.log(item);
			weburl = item.url;    //吴工的电脑
			appurl = weburl + '/app/';
			uploadurl = weburl + '/up/';
			network = JSON.stringify(item);
			localStorage.setItem('networkURL',network);
		}
	});