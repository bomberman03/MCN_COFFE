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
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['cafes', function(cafes){
                        return cafes.getAll();
                    }]
                }
            })
            .state('registerCafes', {
                url: '/register/cafes',
                templateUrl: '/register/cafes.html',
                controller: 'RegisterCafesCtrl'
            })
            .state('cafes', {
                url: '/cafes/{id}',
                templateUrl: '/cafes.html',
                controller: 'CafesCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.factory('cafes', ['$http', function($http){
    var option_options_dummy = [
        { name: '없음', cost: 0 },
        { name: '1샷추가', cost: 500 },
        { name: '2샷추가', cost: 1000 }
    ];
    var options_dummy = [
        { name: '샷추가', options: option_options_dummy },
        { name: '크림추가', cost: 300 }
    ];
    var options_dummy2 = [
        { name: '크림추가', cost: 300 }
    ];
    var menu_dummy = [
        { name: 'Affogato', cost: 3000, thumbnail: '/images/coffee1.png', wait: 5, options: options_dummy },
        { name: 'Americano', cost: 2000, thumbnail: '/images/coffee2.png', wait: 14, options: options_dummy2 },
        { name: 'Bicerin', cost: 4000, thumbnail: '/images/coffee3.png', wait: 3 , options: options_dummy},
        { name: 'Café Bombón', cost: 5000, thumbnail: '/images/coffee4.png', wait: 23, options: options_dummy2},
        { name: 'Café au lait', cost: 100000, thumbnail: '/images/coffee5.png', wait: 8, options: options_dummy}
    ];
    var o = {
        cafes: [
        ],
        orders: [
        ]
    };
    o.getAll = function(){
        return $http.get('/cafes').success(function(data){
            angular.copy(data, o.cafes);
        });
    };
    o.create = function(cafe) {
        return $http.post('/cafes', cafe).success(function(data){
            console.log("new cafe is successfully registered")
        });
    };
    return o;
}]);

app.controller('RegisterCafesCtrl', [
    '$scope',
    'cafes',
    function($scope, cafes){
        $(document).ready(function() {
            $.material.init();

            var $element = $('#textArea').get(0);

            $element.addEventListener('keyup', function() {
                this.style.overflow = 'hidden';
                this.style.height = 0;
                this.style.height = this.scrollHeight + 'px';
            }, false);
        });

        $scope.createCafe = function(){
            if($scope.name == '' || $scope.detail == '') return;
            cafes.create({
                name: $scope.name,
                detail: $scope.detail
            });
            $scope.name = '';
            $scope.detail = '';
        }
    }
]);

app.controller('MainCtrl', [
    '$scope',
    'cafes',
    function($scope, cafes){
        $scope.cafes = cafes.cafes;

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();

            $('#myModal').on('shown.bs.modal', function() {
                var options = $(".modal-body > .form-group .option-block");
                for (var i=0; i<options.size(); i++){
                    var option = $(options[i]);
                    var default_radio = $(option.find("input[type=radio]")[0]);
                    default_radio.click();
                    var default_check = $(option.find("input[type=checkbox]")[0]);
                    default_check.prop("checked",false);
                }
            })
        });
    }
]);

app.controller('CafesCtrl', [
    '$scope',
    '$stateParams',
    'cafes',
    function($scope, $stateParams, cafes){
        $scope.cafe = cafes.cafes[$stateParams.id];
        $scope.orders = cafes.orders;
        $scope.newOrder = {};
        $scope.totalCost = 0;

        $scope.selectMenu = function(menu){
            $scope.newOrder = {
                menu: menu,
                options: {},
                cost: menu.cost,
                count: 1
            };
        };

        $scope.selectRadioOption = function(option, radio){
            if($scope.newOrder.options[option.name]) {
                $scope.newOrder.cost -= $scope.newOrder.options[option.name].cost;
            }
            $scope.newOrder.options[option.name] = radio;
            $scope.newOrder.cost += radio.cost;
        };

        $scope.selectOption = function(option){
            if($scope.newOrder.options[option.name]) {
                $scope.newOrder.options[option.name] = undefined;
                $scope.newOrder.cost -= option.cost;
            }
            else {
                $scope.newOrder.options[option.name] = option;
                $scope.newOrder.cost += option.cost;
            }
        };

        $scope.requestOrder = function(){
            var options = [];
            for(var key in $scope.newOrder.options) {
                var option = $scope.newOrder.options[key];
                if(!option) continue;
                options.push(option);
            }
            $scope.newOrder.options = options;
            $scope.addOrder($scope.newOrder);
        };

        $scope.addOrder = function(order){
            for(var idx in $scope.orders){
                console.log(idx);
                var _order = $scope.orders[idx];
                console.log(order.menu.name);
                console.log(_order.menu.name);
                console.log((order.menu.name != _order.menu.name));
                if(order.menu.name != _order.menu.name) {
                    continue;
                }
                else if(order.options.length != _order.options.length){
                    continue;
                }
                else {
                    var isEqual = true;
                    for(var i=0; i< order.options.length; i++){
                        console.log(order.options[i]);
                        console.log(_order.options[i]);
                        console.log((order.options[i] == _order.options[i]));
                        if(isEqual &= (order.options[i] == _order.options[i])) break;
                    }
                    if(!isEqual) continue;
                    else {
                        $scope.increaseOrder(_order);
                        return;
                    }
                }
            }
            $scope.createOrder(order);
        };

        $scope.createOrder = function(order){
            $scope.orders.push(order);
            $scope.totalCost += order.cost;
        };

        $scope.increaseOrder = function(order){
            order.count++;
            $scope.totalCost += order.cost;
        };

        $scope.decreaseOrder = function(order){
            order.count--;
            $scope.totalCost -= order.cost;
            if(order.count <= 0)
                $scope.removeOrder(order);
        };

        $scope.removeOrder = function(order){
            var idx = $scope.orders.indexOf(order);
            if(idx >= 0)
                $scope.orders.splice(idx, idx+1);
            if(order.count > 0) $scope.totalCost -= (order.cost * order.count);
        }
    }
]);

