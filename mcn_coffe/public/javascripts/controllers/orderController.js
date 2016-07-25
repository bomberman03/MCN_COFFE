/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('OrderCtrl', [
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
            var socket = io.connect('http://210.118.64.165:8080', {query: 'id=' + $scope.cafe._id});
            // 서버에서 news 이벤트가 일어날 때 데이터를 받는다.
            socket.on($scope.cafe._id, function (data) {
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