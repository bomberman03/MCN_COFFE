/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('OrderCtrl', [
    '$scope',
    '$compile',
    '$timeout',
    'cafes',
    'cafe',
    function($scope, $compile, $timeout, cafes, cafe){
        $scope.cafe = cafe;
        $scope.orders = cafes.orders;
        $scope.mappedOrders = [];
        $scope.selectedOrders = [];
        var $grid, socket;
        var socket_ip = '192.168.0.58';
        var socket_port = 8080;

        var WAIT = 0;
        var COMPLETE = 1;
        var CANCEL = 2;
        var RECEIVE = 4;

        $(document).ready(function(){
            // activate tooltip on right coner
            initializeTooltip();
            initializeMasonry();
            initializeSocket();
        });

        function initializeTooltip(){
            if($('[data-toggle="tooltip"]').length > 0)
                $('[data-toggle="tooltip"]').tooltip();
            else
                setTimeout(initializeTooltip, 100);
        }

        function initializeMasonry() {
            $grid = $("#order_list").masonry({
                itemSelector: '.grid-item',
                columnWidth: 100
            });
        }
        function initializeSocket() {
            // localhost로 연결한다.
            socket = io.connect('http://' + socket_ip + ':' + socket_port, {query: 'id=' + $scope.cafe._id});
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
        }

        $scope.getSelectionClass = function(order_id){
            if($scope.selectedIndex(order_id) == -1){
                return "panel panel-primary";
            }
            else return "panel panel-success";
        };
        $scope.getStatusLabel = function(order_id){
            var order = $scope.mappedOrders[order_id];
            if(order == undefined) return -1;
            var ret = "신규 주문";
            switch($scope.mappedOrders[order_id].status){
                case COMPLETE:
                    ret = "수령 대기";
                    break;
                case CANCEL:
                    ret = "주문 취소";
                    break;
                case RECEIVE:
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
                case COMPLETE:
                    ret = "label-info";
                    break;
                case CANCEL:
                    ret = "label-warning";
                    break;
                case RECEIVE:
                    ret = "label-success";
                    break;
            }
            return ret;
        };
        $scope.selectedIndex = function(order_id){
            var ret = -1;
            for(var i=0; i<$scope.selectedOrders.length; i++) {
                if($scope.selectedOrders[i]._id == order_id) {
                    return ret = i;
                }
            }
            return ret;
        };
        $scope.selectOrder = function(order_id) {
            var selected_idx = $scope.selectedIndex(order_id);
            if( selected_idx != -1)
                $scope.selectedOrders.splice(selected_idx, 1);
            else
                $scope.selectedOrders.push($scope.mappedOrders[order_id]);
        };
        $scope.generateOrderItem = function(order, i){
            var order_id = "'" + order._id + "'";
            var h = '<div style="width:300px" class="grid-item">';
            h += '<div class="top-half-margin left-half-margin right-half-margin" id=' + order_id + 'ng-class="getSelectionClass(' + order_id + ')" ng-click="selectOrder('
                + order_id +')" class="panel">';
            h += '<div class="panel-heading">';
            h += '주문번호 ' + (order.order_idx);
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
            var $items = $scope.generateOrderItem(order, i);
            $grid.append($items).masonry( 'prepended', $items );
            $grid.masonry('layout');
        };
        $scope.removeOrder = function(order_id) {
            var order_div = $("div[id=" + order_id + "]").parent();
            if(order_div != undefined) {
                $grid.masonry('remove', order_div);
                $grid.masonry('layout');
            }
            if($scope.mappedOrders[order_id] != undefined)
                delete $scope.mappedOrders[order_id];
        };
        $scope.updateOrder = function(order){
            if($scope.mappedOrders[order._id] != undefined) {
                // cheating just compare status changed
                if($scope.mappedOrders[order._id].status != order.status) {
                    $timeout(function () {
                        $scope.mappedOrders[order._id] = order;
                    });
                    if(order.status == CANCEL || order.status == RECEIVE) {
                        $scope.removeOrder(order._id);
                    }
                }
            }
        };
        $scope.cancelOrder = function(){
            for(var i=0; i<$scope.selectedOrders.length; i++)
                cafes.cancelOrder($scope.selectedOrders[i], $scope.removeOrder);
            $scope.selectedOrders = [];
        };
        $scope.deleteOrder = function(){
            for(var i=0; i<$scope.selectedOrders.length; i++)
                cafes.deleteOrder($scope.selectedOrders[i], $scope.removeOrder);
            $scope.selectedOrders = [];
        };
        $scope.completeOrder = function(){
            for(var i=0; i<$scope.selectedOrders.length; i++){
                if($scope.selectedOrders[i].status == 0)
                    cafes.completeOrder($scope.selectedOrders[i], $scope.updateOrder);
            }
            $scope.selectedOrders = [];
        };

        $scope.getOrders();
    }
]);