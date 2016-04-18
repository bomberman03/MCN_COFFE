/**
 * Created by pathfinder on 16. 4. 6.
 */
var app = angular.module('mcnCoffee', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('cafes', {
                url: '/cafes/{id}',
                templateUrl: '/cafes.html',
                controller: 'CafesCtrl',
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.factory('cafes', [ function(){
    var option_options_dummy = [
        { name: '없음', group: false, cost: 0 },
        { name: '1샷추가', group: false, cost: 500 },
        { name: '2샷추가', group: false, cost: 1000 },
    ]
    var options_dummy = [
        { name: '샷추가', group: true, options: option_options_dummy },
        { name: '크림추가', group: false, cost: 300 },
    ]
    var options_dummy2 = [
        { name: '크림추가', group: false, cost: 300 },
    ]
    var menu_dummy = [
        { name: 'Affogato', cost: 3000, thumbnail: '/images/coffee1.png', wait: 5, options: options_dummy },
        { name: 'Americano', cost: 2000, thumbnail: '/images/coffee2.png', wait: 14, options: options_dummy2 },
        { name: 'Bicerin', cost: 4000, thumbnail: '/images/coffee3.png', wait: 3 , options: options_dummy},
        { name: 'Café Bombón', cost: 5000, thumbnail: '/images/coffee4.png', wait: 23, options: options_dummy2},
        { name: 'Café au lait', cost: 100000, thumbnail: '/images/coffee5.png', wait: 8, options: options_dummy}
    ];
    var o = {
        cafes: [
            { name: 'Dazzle', thumbnail: '/images/cafe1.jpg', menus: menu_dummy },
            { name: 'CoffeBubble', thumbnail: '/images/cafe2.jpg', menus: menu_dummy },
            { name: 'StarBucks', thumbnail: '/images/cafe3.jpg', menus: menu_dummy },
            { name: 'Angelinous', thumbnail: '/images/cafe4.jpg', menus: menu_dummy },
            { name: 'CoolCafe', thumbnail: '/images/cafe5.jpg', menus: menu_dummy }
        ],
        orders: [
            { menu: menu_dummy[0], options: [ option_options_dummy[1], options_dummy[1] ], cost: 3800, count: 12 }
        ]
    };
    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'cafes',
    function($scope, cafes){
        $scope.cafes = cafes.cafes;
    }
]);

app.controller('CafesCtrl', [
    '$scope',
    '$stateParams',
    'cafes',
    function($scope, $stateParams, cafes){
        $scope.cafe = cafes.cafes[$stateParams.id];
        $scope.orders = cafes.orders;
        $scope.selectedMenu = $scope.cafe.menus[0];

        $scope.selectMenu = function(menu){
            $scope.selectedMenu = menu;
        };

        $scope.selectOption = function(option){
            console.log(option);
        }

        $scope.addOrder = function(order){
            for(var o in $scope.orders){
                if(order.name != o.name) continue;
                else if(order.options.length != o.options.length) continue;
                else {
                    var isEqual = true;
                    for(var i=0; i< order.options.length; i++){
                        if(isEqual &= (order.options[i] != o.options[i])) break;
                    }
                    if(!isEqual) continue;
                    else {
                        $scope.increaseOrder(o);
                        return;
                    }
                }
            }
            $scope.createOrder(order);
        };

        $scope.createOrder = function(order){
            $scope.orders.push(order);
        };

        $scope.increaseOrder = function(order){
            order.count++;
        };

        $scope.decreaseOrder = function(order){
            order.count--;
            if(order.count <= 0) $scope.removeOrder(order);
        };

        $scope.removeOrder = function(order){
            var idx = $scope.orders.indexOf(order);
            if(idx >= 0) {
                $scope.orders.splice(idx, idx);
            }
        }
    }
]);

