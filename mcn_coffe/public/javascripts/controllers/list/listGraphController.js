/**
 * Created by pathFinder on 2016-09-12.
 */
app.controller('ListGraphCtrl', [
    'cafes',
    'cafe',
    'orders',
    '$scope',
    '$timeout',
    'auth',
    'sidebar',
    function(cafes, cafe, orders, $scope, $timeout, auth, sidebar) {
        $scope.cafe = cafe;
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

        $scope.labels = [];
        $scope.series = [];
        $scope.data = [];
        $scope.doughnut_data = [];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $(document).ready(function(e){
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
            sidebar.getCafeList(auth.currentUser()._id);
            convertToMonthData();
        });

        function convertToHourSumData() {
            var menu_map = {};
            var labels = [];
            var series = [];
            var data = [];
            for(var i=0; i<=23; i++) labels.push(i);
            for(var i=0; i<cafe.menus.length; i++) {
                series.push(cafe.menus[i].name);
                menu_map[cafe.menus[i].name] = i;
                var tmp_arr = [];
                for(var j=0; j<labels.length; j++) tmp_arr.push(0);
                data.push(tmp_arr);
            }
            for(var i=0; i<orders.length; i++) {
                var order = orders[i];
                var d = new Date(order.updateAt);
                var date = d.getHours();
                for(var j=0; j<order.orders.length; j++) {
                    var menu = order.orders[j].menu;
                    var idx = menu_map[menu.name];
                    data[idx][date] += order.orders[j].count;
                }
            }
            var new_data = [];
            labels.splice(0,9);
            for(var i=0; i<data.length; i++) {
                data[i].splice(0,9);
            }
            for(var j=0; j<labels.length; j++){
                var sum = 0;
                for(var i=0; i<series.length; i++){
                    sum += data[i][j];
                }
                new_data.push(sum);
            }
            $scope.labels = labels;
            $scope.series = series;
            $scope.data = new_data;
            var doughnut_data = [];
            for(var i=0; i<data.length; i++) {
                var sum = 0;
                for(var j=0; j<data[i].length; j++) {
                    sum += data[i][j];
                }
                doughnut_data.push(sum);
            }
            $scope.doughnut_data = doughnut_data;
        }

        function covertToHourData() {
            var menu_map = {};
            var labels = [];
            var series = [];
            var data = [];
            for(var i=0; i<=23; i++) labels.push(i);
            for(var i=0; i<cafe.menus.length; i++) {
                series.push(cafe.menus[i].name);
                menu_map[cafe.menus[i].name] = i;
                var tmp_arr = [];
                for(var j=0; j<labels.length; j++) tmp_arr.push(0);
                data.push(tmp_arr);
            }
            for(var i=0; i<orders.length; i++) {
                var order = orders[i];
                var d = new Date(order.updateAt);
                var date = d.getHours();
                for(var j=0; j<order.orders.length; j++) {
                    var menu = order.orders[j].menu;
                    var idx = menu_map[menu.name];
                    data[idx][date] += order.orders[j].count;
                }
            }
            labels.splice(0,9);
            for(var i=0; i<data.length; i++) {
                data[i].splice(0,9);
            }
            $scope.labels = labels;
            $scope.series = series;
            $scope.data = data;
            var doughnut_data = [];
            for(var i=0; i<data.length; i++) {
                var sum = 0;
                for(var j=0; j<data[i].length; j++) {
                    sum += data[i][j];
                }
                doughnut_data.push(sum);
            }
            $scope.doughnut_data = doughnut_data;
        }

        function convertToMonthData() {
            var menu_map = {};
            var labels = [];
            var series = [];
            var data = [];
            for(var i=1; i<=11; i++) labels.push(i);
            for(var i=0; i<cafe.menus.length; i++) {
                series.push(cafe.menus[i].name);
                menu_map[cafe.menus[i].name] = i;
                var tmp_arr = [];
                for(var j=0; j<labels.length; j++) tmp_arr.push(0);
                data.push(tmp_arr);
            }
            for(var i=0; i<orders.length; i++) {
                var order = orders[i];
                var d = new Date(order.updateAt);
                var date = d.getDate();
                for(var j=0; j<order.orders.length; j++) {
                    var menu = order.orders[j].menu;
                    var idx = menu_map[menu.name];
                    data[idx][date] += order.orders[j].count;
                }
            }
            $scope.labels = labels;
            $scope.series = series;
            $scope.data = data;
            var doughnut_data = [];
            for(var i=0; i<data.length; i++) {
                var sum = 0;
                for(var j=0; j<data[i].length; j++) {
                    sum += data[i][j];
                }
                doughnut_data.push(sum);
            }
            $scope.doughnut_data = doughnut_data;
        }
    }
]);