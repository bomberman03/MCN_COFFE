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
            .state('registerMenus', {
                url: '/cafes/{id}/register/menus',
                templateUrl: '/register/menus.html',
                controller: 'RegisterMenuCtrl',
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }]
                }
            })
            .state('cafes', {
                url: '/cafes/{id}',
                templateUrl: '/cafes.html',
                controller: 'CafesCtrl',
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.factory('cafes', ['$http', function($http){
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
            console.log("new cafe is successfully registered");
        });
    };

    o.createMenu = function(cafe_id, menu) {
        return $http.post('/cafes/' + cafe_id + '/menus', menu).success(function(data){
            console.log("new menu is successfully registered");
            for(var i=0; i<menu.options.length; i++){
                console.log('/menus/' + data._id + '/options');
                o.createMenuOption(data._id, menu.options[i]);
            }
        });
    };
    o.createMenuOption = function(menu_id, option) {
        return $http.post('/menus/' + menu_id + '/options', option).success(function(data){
            console.log("new menuOption is successfully registered");
            for(var i=0; i<option.options.length; i++){
                console.log('/options/' + data._id + 'options');
                o.createOptionOption(data._id, option.options[i]);
            }
        });
    };
    o.createOptionOption = function(option_id, option) {
        return $http.post('/options/' + option_id + '/options', option).success(function(data){
            console.log("new optionOption is successfully registered");
        })
    };

    o.getCafe = function(cafe_id){
        return $http.get('/cafes/' + cafe_id).then(function(data){
            return data.data;
        });
    };
    o.getMenu = function(cafe, menu_id){
        return $http.get('/menus/' + menu_id).then(function(data){
            for(var i=0; i<cafe.menus.length; i++){
                if(cafe.menus[i]._id == menu_id) {
                    cafe.menus[i] = data.data;
                    console.log(data.data);
                    for(var j=0; j<cafe.menus[i].options.length; j++){
                        o.getOption(cafe.menus[i], cafe.menus[i].options[j]._id);
                    }
                    break;
                }
            }
        });
    };
    o.getOption = function(menu, option_id){
        return $http.get('/options/' + option_id).then(function(data){
            for(var i=0; i<menu.options.length; i++){
                if(menu.options[i]._id == option_id){
                    menu.options[i] = data.data;
                    console.log(data.data);
                    break;
                }
            }
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
        };
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

app.controller('RegisterMenuCtrl', [
    '$scope',
    'cafes',
    'cafe',
    function($scope, cafes, cafe) {
        $scope.cafe = cafe;
        $scope.options = [];
        $scope.menu = {
            name: "",
            cost: 0,
            options: $scope.options
        };

        $scope.createOption = function(option){
            if(option == undefined) option = $scope;
            option.options.push({
                name: "",
                cost: 0
            });
        };

        $scope.createOptionGroup = function(){
            $scope.options.push({
                name: "",
                options: [{
                    name:"",
                    cost:""
                }]
            });
        };

        $scope.createMenu = function(){
            cafes.createMenu($scope.cafe._id, $scope.menu);
        };

        $(document).ready(function() {
            $.material.init();

            $('#inputMenuName').get(0).addEventListener('keyup', function() {
                var name = $(this).val();
                if(name.length == 0) name = "새 메뉴 이름";
                $('#base_option').html(name);
            }, false);
        });
    }
]);

app.controller('CafesCtrl', [
    '$scope',
    'cafes',
    'cafe',
    function($scope, cafes, cafe){
        $scope.cafe = cafe;
        $scope.orders = cafes.orders;
        $scope.newOrder = {};
        $scope.totalCost = 0;

        $scope.populateCafe = function(){
            for(var i=0; i<cafe.menus.length; i++){
                cafes.getMenu(cafe, cafe.menus[i]._id);
            }
        };
        $scope.populateCafe();

        $scope.selectMenu = function(menu){
            console.log($scope.cafe);
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
                var _order = $scope.orders[idx];
                if(order.menu.name != _order.menu.name) {continue;}
                else if(order.options.length != _order.options.length){continue;}
                else {
                    var isEqual = true;
                    for(var i=0; i< order.options.length; i++){
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

