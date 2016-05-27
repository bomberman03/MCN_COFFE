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
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
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
            .state('orders', {
                url: '/cafes/{id}/orders',
                templateUrl: '/orders.html',
                controller: 'OrdersCtrl',
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }],
                    postPromise: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getOrders($stateParams.id);
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

app.factory('auth', ['$http', '$window', function($http, $window){

    var auth = {};

    auth.saveToken = function(token){
        $window.localStorage['mcn-coffee-token'] = token;
    };

    auth.getToken = function() {
        return $window.localStorage['mcn-coffee-token'];
    };

    auth.isLoggedIn = function() {
        var token = auth.getToken();

        if(token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp = Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function() {
        if(auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload;
        }
    };

    auth.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function() {
        $window.localStorage.removeItem('mcn-coffee-token');
    };

    return auth;
}]);

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){
        $scope.user = {};

        $(document).ready(function() {
            $.material.init();
        });

        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        }
    }
]);

app.factory('cafes', ['$http', function($http){
    var o = {
        cafes: [],
        orders: []
    };
    o.getAll = function(){
        return $http.get('/cafes').success(function(data){
            angular.copy(data, o.cafes);
        });
    };
    o.createCafe = function(cafe) {
        return $http.post('/cafes', cafe).success(function(data){
            console.log("new cafe is successfully registered");
        });
    };
    o.deleteCafe = function(cafe) {
        return $http.delete('/cafes/' + cafe._id).success(function(data){
            console.log("deleted", data);
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
    o.deleteMenu = function(cafe_id, menu){
        return $http.delete('/cafes/' + cafe_id + '/menus/' + menu._id).success(function(data){
            console.log(data);
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
    o.getOrders = function(cafe_id){
        return $http.get('/cafes/' + cafe_id + '/orders').success(function(data){
            angular.copy(data, o.orders);
        });
    };
    o.getMenu = function(cafe, menu_id){
        return $http.get('/menus/' + menu_id).then(function(data){
            for(var i=0; i<cafe.menus.length; i++){
                if(cafe.menus[i]._id == menu_id) {
                    cafe.menus[i] = data.data;
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
                    break;
                }
            }
        });
    };
    o.postOrder = function(cafe, order){
        return $http.post('/cafes/' + cafe._id + '/orders', order).success(function(data){
            console.log("order is successfully created");
        });
    };
    o.deleteOrder = function(order, next){
        return $http.delete('/orders/' + order._id).success(function(data){
            console.log("order is successfully deleted");
            next(data.id);
        });
    };
    o.completeOrder = function(order, next){
        return $http.put('/orders/' + order._id + '/complete/').success(function(data){
            console.log("order is successfully updated");
            next(data);
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
            cafes.createCafe({
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

app.controller('OrdersCtrl', [
    '$scope',
    '$compile',
    'cafes',
    'cafe',
    function($scope, $compile, cafes, cafe){
        $scope.cafe = cafe;
        $scope.orders = cafes.orders;
        $scope.mappedOrders = [];
        $scope.selectedOrders = [];

        $(document).ready(function(){
            // activate tooltip on right coner
            $('[data-toggle="tooltip"]').tooltip();

            // copy salvattore template from bottom
            var container = $(".container")[0];
            var order_list = $("#order_list");
            order_list.html($(container).html());
            order_list.find(".container").attr("style","");

            // activate copied template
            var grid = document.querySelector('#order_list > #columns');
            salvattore['register_grid'](grid);

            // localhost로 연결한다.
            var socket = io.connect('http://218.150.181.81:8080', {query: 'id=' + $scope.cafe._id});
            socket.emit($scope.cafe._id, "hello world!");
            // 서버에서 news 이벤트가 일어날 때 데이터를 받는다.
            socket.on($scope.cafe._id, function (data) {
                console.log(data);
                switch(data.method) {
                    case 'delete':
                        $scope.removeOrder(data.id);
                        break;
                    case 'put':
                        $scope.updateOrder(data.data);
                        break;
                    case 'post':
                        $scope.newOrder(data.data);
                        break;
                }
            });
        });
        $scope.getSelectionClass = function(order_id){
            if($scope.selectedIndex(order_id) == -1){
                /*
                if($scope.mappedOrders[order_id].status==0) return "panel-primary";
                else return "panel-default";
                */
                return "panel-primary";
            }
            else return "panel-success";
        };
        $scope.getStatusLabel = function(order_id){
            var order = $scope.mappedOrders[order_id];
            if(order == undefined) return -1;
            var ret = "신규 주문";
            switch($scope.mappedOrders[order_id].status){
                case 1:
                    ret = "수령 대기";
                    break;
                case 2:
                    ret = "주문 취소";
                    break;
                case 3:
                    ret = "수령 완료";
                    break;
            }
            return ret;
        };
        $scope.getStatusClass = function(order_id){
            var order = $scope.mappedOrders[order_id];
            if(order == undefined) return -1;
            var ret = "label-default";
            switch($scope.mappedOrders[order_id].status){
                case 1:
                    ret = "label-info";
                    break;
                case 2:
                    ret = "label-warning";
                    break;
                case 3:
                    ret = "label-success";
                    break;
            }
            return ret;
        };
        $scope.selectedIndex = function(order_id){
            function findById(order){
                return order._id == order_id;
            }
            return $scope.selectedOrders.findIndex(findById);
        };
        $scope.selectOrder = function(order_id) {
            function findById(order){
                return order._id == order_id;
            }
            var order = $scope.orders.find(findById);
            var selected_idx = $scope.selectedIndex(order_id);
            if( selected_idx != -1) {
                $scope.selectedOrders.splice(selected_idx, 1);
            } else{
                $scope.selectedOrders.push(order);
            }
        };
        $scope.generateOrderItem = function(order, i){
            var order_id = "'" + order._id + "'";
            var h = '<div id=' + order_id + 'ng-class="getSelectionClass(' + order_id + ')" ng-click="selectOrder('
                + order_id +')" class="panel">';
            h += '<div class="panel-heading">';
            h += '주문번호 ' + i;
            h += '<span ng-class="getStatusClass(' + order_id + ')" class="right label right-half-margin">{{getStatusLabel(' + order_id + ')}}</span>';
            h += '</div>';
            h += '<div class="panel-body">';
            for(var i=0; i<order.orders.length; i++) {
                h += '<div class="right-half-margin bottom-half-margin">';
                h += '<div class="right-half-margin">';
                h += '<span class="right-half-margin">' + order.orders[i].menu.name + '</span>';
                h += '<span class="right-half-margin">' + order.orders[i].count + '개</span>';
                h += '</div>';
                h += '<div class="right-half-margin">';
                for (var j=0; j < order.orders[i].options.length; j++) {
                    h += '<span class="label label-default right-half-margin">' + order.orders[i].options[j].name + '</span>';
                }
                h += '</div>';
                h += '</div>';
            }
            h += '</div>';
            h += '<div class="panel-footer">';
            h += order.cost + '원';
            h += '</div>';
            h += '</div>';
            h = $compile(h)($scope);
            return h;
        };
        $scope.getOrders = function(){
            for(var i=0; i<$scope.orders.length; i++){
                $scope.mappedOrders[$scope.orders[i]._id] = $scope.orders[i];
                $scope.appendOrder($scope.orders[i], i);
            }
        };
        $scope.getOrderLength = function(){
            return Object.keys($scope.mappedOrders).length;
        };
        $scope.newOrder = function(order){
            $scope.mappedOrders[order._id] = order;
            $scope.appendOrder(order, Object.keys($scope.mappedOrders).length);
        };
        $scope.appendOrder = function(order, i){
            var query = "#order_list > #columns";
            var grid = document.querySelector(query);
            var item = document.createElement('div');
            salvattore['append_elements'](grid, [item]);
            $(item).html($scope.generateOrderItem(order, i));
        };
        $scope.getOrders();
        $scope.removeOrder = function(order_id){
            var order_div = $("div[id=" + order_id + "]");
            if(order_div != undefined)
                order_div.remove();
            if($scope.mappedOrders[order_id] != undefined)
                delete $scope.mappedOrders[order_id];
        };
        $scope.updateOrder = function(order){
            if($scope.mappedOrders[order._id] != undefined) {
                // cheating just compare status changed
                if($scope.mappedOrders[order._id].status != order.status) {
                    $scope.$apply(function () {
                        $scope.mappedOrders[order._id] = order;
                    });
                }
            }
            console.log($scope.mappedOrders[order._id]);
        };
        $scope.deleteOrder = function(){
            for(var i=0; i<$scope.selectedOrders.length; i++) {
                cafes.deleteOrder($scope.selectedOrders[i], $scope.removeOrder);
            }
            $scope.selectedOrders = [];
        };
        $scope.completeOrder = function(){
            for(var i=0; i<$scope.selectedOrders.length; i++){
                if($scope.selectedOrders[i].status == 0) cafes.completeOrder($scope.selectedOrders[i], $scope.updateOrder);
            }
            $scope.selectedOrders = [];
        };
    }
]);

app.controller('CafesCtrl', [
    '$scope',
    'cafes',
    'auth',
    'cafe',
    function($scope, cafes, auth, cafe){
        $scope.cafe = cafe;
        $scope.order = {
            cafe: $scope.cafe,
            user: auth.currentUser(),
            orders:[],
            cost: 0
        };
        $scope.newOrder = {};

        $scope.populateCafe = function(){
            for(var i=0; i<cafe.menus.length; i++){
                cafes.getMenu(cafe, cafe.menus[i]._id);
            }
        };
        $scope.populateCafe();

        $scope.selectMenu = function(menu){
            $scope.newOrder = {
                menu: menu,
                options: {},
                cost: menu.cost,
                count: 1
            };
            $('#selectMenuModal').on('shown.bs.modal', function() {
                var options = $(".modal-body > .form-group .option-block");
                for (var i=0; i<options.size(); i++){
                    var option = $(options[i]);
                    var default_radio = $(option.find("input[type=radio]")[0]);
                    default_radio.click();
                    var default_check = $(option.find("input[type=checkbox]")[0]);
                    default_check.prop("checked",false);
                }
            });
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
            $scope.order.orders.push(order);
            $scope.order.cost += order.cost;
        };

        $scope.increaseOrder = function(order){
            order.count++;
            $scope.order.cost += order.cost;
        };

        $scope.decreaseOrder = function(order){
            order.count--;
            $scope.order.cost -= order.cost;
            if(order.count <= 0)
                $scope.removeOrder(order);
        };

        $scope.removeOrder = function(order){
            var idx = $scope.orders.indexOf(order);
            if(idx >= 0)
                $scope.orders.splice(idx, 1);
            if(order.count > 0) $scope.order.cost -= (order.cost * order.count);
        };

        $scope.deleteMenu = function(menu) {
            cafes.deleteMenu($scope.cafe._id, menu);
        };

        $scope.deleteCafe = function() {
            cafes.deleteCafe($scope.cafe);
        };

        $scope.postOrder = function(){
            $scope.order.user = auth.currentUser();
            cafes.postOrder($scope.cafe, $scope.order);
        };
    }
]);

