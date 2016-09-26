/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('PushOrderCtrl', [
    '$scope',
    '$timeout',
    'cafes',
    'cafe',
    'users',
    function($scope, $timeout, cafes, cafe, users){
        $scope.cafe = cafe;
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.curTime = "";
        $scope.orders = [];
        $scope.getYear = function(time) {
            var d = new Date(time);
            return d.getFullYear();
        };
        $scope.getMonth = function(time) {
            var d = new Date(time);
            return d.getMonth() + 1;
        };
        $scope.getDate = function(time) {
            var d = new Date(time);
            return d.getDate();
        };
        $scope.getHour = function(time) {
            var d = new Date(time);
            return d.getHours();
        };
        $scope.getMinute = function(time) {
            var d = new Date(time);
            return d.getMinutes();
        };
        $scope.getSecond = function(time) {
            var d = new Date(time);
            return d.getSeconds();
        };
        $scope.populateCafe = function(){
            var responseCnt = 0;
            for(var i=0; i<cafe.menus.length; i++){
                cafes.getMenu(cafe.menus[i]._id, function(data){
                    var data = data.data;
                    cafe.menus[i] = data;
                    responseCnt++;
                },function(data){
                    responseCnt++;
                });
            }
        };
        $scope.populateCafe();
        $scope.postOrder = function(order){
            if(order.orders.length > 0) {
                isNetworking = true;
                cafes.postOrder($scope.cafe, order, function(data){
                    isNetworking = false;
                }, function(data){
                    isNetworking = false;
                });
            }
        };
        $scope.nextSimulation = function(){
            if($scope.order_list.length <= 0) {
                simulate(curTime);
                curTime += (Math.floor((Math.random() * 300)) + 600) * 1000;
                if(curTime >= endTime) {
                    console.log("clearInterval");
                    clearInterval(intervalId);
                }
                var d = new Date(curTime);
                $scope.curTime = d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + d.getHours() + "시 " + d.getMinutes() + "분 " + d.getSeconds() + "초";
            } else {
                if(isNetworking) {
                    console.log("networking!");
                    return;
                }
                $scope.orders = $scope.order_list.splice(0, 1);
                var order = $scope.orders[0];
                $scope.postOrder(order);
            }
        };
        $scope.initSimulation = function(){
            var d = new Date('2016-' + $scope.startTime);
            var ed = new Date('2016-' + $scope.endTime);
            curTime = d.getTime();
            endTime = ed.getTime();
            $scope.curTime = d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + d.getHours() + "시 " + d.getMinutes() + "분 " + d.getSeconds() + "초";
            intervalId = setInterval(function(){
                $timeout(function(){
                    $scope.nextSimulation();
                });
            }, 10);
        };
        var intervalId;
        var time_prob = {
            9: 0.5,
            10: 0.4,
            11: 0.3,
            12: 0.6,
            13: 0.7,
            14: 0.5,
            15: 0.3,
            16: 0.3,
            17: 0.3,
            18: 0.4,
            19: 0.5,
            20: 0.6,
            21: 0.4,
            22: 0.2
        };
        var client_offset = 11;
        var client_prob = [0.7, 0.5, 0.5, 0.3, 0.5, 0.6, 0.8, 0.4, 0.2, 0.3, 0.2, 0.7, 0.1, 0.7, 0.5, 0.4, 0.6, 0.1];
        var max_count = 4;
        var max_total_count = 10;
        var curTime;
        var endTime;
        var isNetworking = false;
        $scope.order_list = [];

        function simulate(time){
            var d = new Date(time);
            var t_prob = time_prob[d.getHours()];
            if(t_prob != undefined && Math.random() <= t_prob) {
                for(var i=0; i<users.length; i++) {
                    var u_prob = client_prob[i];
                    if(Math.random() <= u_prob) {
                        var order = {
                            createAt: d.toISOString(),
                            updateAt: d.getTime(),
                            user: users[i],
                            orders: [],
                            cost: 0,
                            status: 4
                        };
                        var total_count = Math.floor(Math.random() * max_total_count) + max_count;
                        for(var j=0; j<cafe.menus.length; j++) {
                            var newOrder = {
                                menu: {},
                                options: [],
                                cost: 0,
                                count: 0
                            };
                            var m_prob = cafe.menus[j].prob;
                            if(Math.random() <= m_prob) {
                                newOrder.menu = cafe.menus[j];
                                order.updateAt += (cafe.menus[j].time * 1000);
                                newOrder.cost += cafe.menus[j].cost;
                                for (var k = 0; k < cafe.menus[j].options.length; k++) {
                                    if (cafe.menus[j].options[k].options.length <= 0) {
                                        var o_prob = cafe.menus[j].options[k].prob;
                                        if (Math.random() < o_prob) {
                                            newOrder.options.push(cafe.menus[j].options[k]);
                                            newOrder.cost += cafe.menus[j].options[k].cost;
                                        }
                                    } else {
                                        for (var l = 0; l < cafe.menus[j].options[k].options.length; l++) {
                                            var so_prob = cafe.menus[j].options[k].options[l].prob;
                                            if (Math.random() < so_prob) {
                                                newOrder.options.push(cafe.menus[j].options[k].options[l]);
                                                newOrder.cost += cafe.menus[j].options[k].options[l].cost;
                                                break;
                                            }
                                        }
                                    }
                                }
                                newOrder.count = Math.floor(Math.random() * max_count) + 1;
                                if (newOrder.count >= total_count)
                                    newOrder.count = total_count;
                                total_count -= newOrder.count;
                                order.cost += (newOrder.cost * newOrder.count);
                                order.orders.push(newOrder);
                                if (total_count <= 0)
                                    break;
                            }
                        }
                        order.updateAt = new Date(order.updateAt).toISOString();
                        if(Math.random() <= 0.1)
                            order.status = 2;
                        $scope.order_list.push(order);
                    }
                }
            }
        }
    }
]);