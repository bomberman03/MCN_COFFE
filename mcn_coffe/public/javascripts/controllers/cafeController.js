/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('CafeCtrl', [
    '$scope',
    '$timeout',
    'cafes',
    'auth',
    'cafe',
    function($scope, $timeout, cafes, auth, cafe){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.cafe = cafe;
        $scope.order = {
            cafe: $scope.cafe,
            user: auth.currentUser(),
            orders:[],
            cost: 0,
            time: 0
        };
        $scope.networkStatus = "failure";
        $scope.networkResponse = "";
        $scope.category_filter = "전체";
        $scope.categories = ["전체"];
        $scope.menus = [];
        $scope.clearOrder = function() {
            $scope.order.orders.length = $scope.order.cost = 0;
        };
        $scope.makeQuery = function() {
            var search_term  = $("#search_term").val();
            $scope.menus.length = 0;
            for(var idx in $scope.cafe.menus) {
                var menu = $scope.cafe.menus[idx];
                if($scope.category_filter == "전체" || $scope.category_filter == menu.category) {
                    if(menu.name.match(search_term) == null)
                        continue;
                    $scope.menus.push(menu);
                }
            }
        };
        $scope.selectFilter = function(category){
            var update = ($scope.category_filter != category);
            $scope.category_filter = category;
            if(update) $scope.makeQuery();
        };
        $scope.newOrder = {};
        $scope.populateCafe = function(){
            var responseCnt = 0;
            var length = cafe.menus.length;
            for(var i=0; i<cafe.menus.length; i++){
                cafes.getMenu(cafe.menus[i]._id, function(data){
                    var data = data.data;
                    if($scope.categories.indexOf(data.category) == -1) $scope.categories.push(data.category);
                    cafe.menus[i] = data;
                    responseCnt++;
                    if(responseCnt==length) {
                        console.log("menus load complete!");
                        $scope.makeQuery();
                    }
                },function(data){
                    responseCnt++;
                    if(responseCnt==length) {
                        console.log("menus load complete!");
                        $scope.makeQuery();
                    }
                });
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
            $('#confirmMenuModal').on('shown.bs.modal', function() {
                $timeout(function(){
                    $scope.networkResponse = "";
                    $scope.networkStatus = "failure";
                });
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
            for(var idx in $scope.order.orders){
                var _order = $scope.order.orders[idx];
                if(order.menu.name != _order.menu.name) {continue;}
                else if(order.options.length != _order.options.length){continue;}
                else {
                    var isEqual = true;
                    for(var i=0; i< order.options.length; i++){
                        if(isEqual &= (order.options[i].name === _order.options[i].name))
                            break;
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
            calculateTime();
        };
        $scope.increaseOrder = function(order){
            order.count++;
            $scope.order.cost += order.cost;
            calculateTime();
        };
        $scope.decreaseOrder = function(order){
            order.count--;
            $scope.order.cost -= order.cost;
            if(order.count <= 0)
                $scope.removeOrder(order);
            calculateTime();
        };
        $scope.removeOrder = function(order){
            var idx = $scope.order.orders.indexOf(order);
            if(idx >= 0)
                $scope.order.orders.splice(idx, 1);
            if(order.count > 0) $scope.order.cost -= (order.cost * order.count);
            calculateTime();
        };
        $scope.postOrder = function(){
            if($scope.order.orders.length > 0) {
                $scope.networkResponse = "";
                $scope.networkStatus = "networking";
                $scope.order.user = auth.currentUser();
                cafes.postOrder($scope.cafe, $scope.order, function(data){
                    $scope.networkResponse = "결제가 성공적으로 처리되었습니다.";
                    $scope.networkStatus  = "success";
                }, function(data){
                    $scope.networkResponse = "알수 없는 이유로 결제가 실패하였습니다.";
                    $scope.networkStatus  = "failure";
                });
            }
        };

        function calculateTime() {
            var interval = 15;
            var time = 0;
            for(var i=0; i<$scope.order.orders.length; i++){
                var order = $scope.order.orders[i];
                for(var j=0, mul=1; j<order.count; j++, mul *= 0.5) {
                    time += order.menu.time * mul;
                }
                time += interval;
            }
            var time_str = "";
            if(time > 3600) {
                time_str += Math.floor(time / 3600);
                time_str += "시간 ";
                time %= 3600
            }
            if(time > 60) {
                time_str += Math.floor(time / 60);
                time_str += "분 ";
                time %= 60;
            }
            if(time > 0) {
                time_str += Math.floor(time);
                time_str += "초 ";
            }
            $scope.order.time = time_str;
        }
    }
]);