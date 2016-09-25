/**
 * Created by pathFinder on 2016-09-12.
 */
app.controller('ListGraphCtrl', [
    'cafes',
    'cafe',
    'orders',
    '$scope',
    '$timeout',
    function(cafes, cafe, orders, $scope, $timeout) {
        $scope.cafe = cafe;
        for(var i=0; i<orders.length; i++) orders[i]['updateStamp'] = new Date(orders[i].updateAt).getTime();
        orders.sort(function(a, b){
            return b.updateStamp - a.updateStamp;
        });
        $scope.orders = orders;

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

        $(document).ready(function(e){
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
            setInterval(function(){
                $timeout(function(){
                    updateOrders();
                })
            }, 5000)
        });

        function updateOrders(){
            cafes.getAllOrders(cafe._id, function(data){
                var orders = data.data;
                for(var i=0; i<orders.length; i++) orders[i]['updateStamp'] = new Date(orders[i].updateAt).getTime();
                orders.sort(function(a, b){
                    return b.updateStamp - a.updateStamp;
                });
                $scope.orders = orders;
            }, function(data){
                // error handling
            });
        }
    }
]);