/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('CafeCtrl', [
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
            cafes.deleteCafe($scope.cafe, function(){
                
            });
        };
        $scope.postOrder = function(){
            $scope.order.user = auth.currentUser();
            cafes.postOrder($scope.cafe, $scope.order);
        };
    }
]);