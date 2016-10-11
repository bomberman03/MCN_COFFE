/**
 * Created by pathFinder on 2016-09-12.
 */
app.controller('ListTableCtrl', [
    'cafes',
    'cafe',
    '$scope',
    '$timeout',
    'auth',
    'sidebar',
    'orders',
    function(cafes, cafe, $scope, $timeout, auth, sidebar, orders) {

        var data = {};

        $scope.year = 2016;
        $scope.month = 8;
        $scope.date = 15;

        $scope.prevYear = function() {
            if($scope.year == 0) return;
            $scope.year--;
            initializeYearData();
            initializeMonthData();
            initializeDateData();
        };
        $scope.nextYear = function() {
            $scope.year++;
            initializeYearData();
            initializeMonthData();
            initializeDateData();
        };
        $scope.prevMonth = function() {
            if($scope.month == 0) return;
            $scope.month--;
            initializeMonthData();
            initializeDateData();
        };
        $scope.nextMonth = function() {
            if($scope.month == 12) return;
            $scope.month++;
            initializeMonthData();
            initializeDateData();
        };
        $scope.prevDate = function(){
            if($scope.date == 0) return;
            $scope.date--;
            initializeDateData();
        };
        $scope.nextDate = function(){
            if($scope.date == 31) return;
            $scope.date++;
            initializeDateData();
        };

        var menu_map = {};

        function initializeSeries() {
            menu_map = {};
            var series = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                series.push(cafe.menus[i].name);
                menu_map[cafe.menus[i]._id] = i;
            }
            $scope.series = series;
        }

        function initializeData() {
            data = {};
            for(var i=0; i<orders.length; i++) {
                var order = orders[i];
                var d = new Date(order.updateAt);
                var year = d.getFullYear();
                var month = d.getMonth() + 1;
                var date = d.getDate();
                var hour = d.getHours();
                for(var j=0; j<order.orders.length; j++) {
                    var item = order.orders[j];
                    var menu_id = item.menu._id;
                    if(data[menu_id] == undefined)
                        data[menu_id] = {};
                    if(data[menu_id][year] == undefined)
                        data[menu_id][year] = {
                            total_count: 0,
                            total_cost: 0
                        };
                    data[menu_id][year].total_count += item.count;
                    data[menu_id][year].total_cost += (item.cost * item.count);
                    if(data[menu_id][year][month] == undefined)
                        data[menu_id][year][month] = {
                            total_count: 0,
                            total_cost: 0
                        };
                    data[menu_id][year][month].total_count += item.count;
                    data[menu_id][year][month].total_cost += (item.cost * item.count);
                    if(data[menu_id][year][month][date] == undefined)
                        data[menu_id][year][month][date] = {
                            total_count: 0,
                            total_cost: 0
                        };
                    data[menu_id][year][month][date].total_count += item.count;
                    data[menu_id][year][month][date].total_cost += (item.cost * item.count);
                    if(data[menu_id][year][month][date][hour] == undefined)
                        data[menu_id][year][month][date][hour] = {
                            total_count:0,
                            total_cost: 0
                        };
                    data[menu_id][year][month][date][hour].total_count += item.count;
                    data[menu_id][year][month][date][hour].total_cost += (item.cost * item.count);
                }
            }
        }

        function initializeYearData() {
            var year_labels = [];
            var year_data = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                var menu = cafe.menus[i];
                year_data.push([]);
                for (var j = 1; j <= 12; j++) {
                    if(i==0) year_labels.push(j + "월");
                    if(data[menu._id] == undefined ||
                        data[menu._id][$scope.year] == undefined ||
                        data[menu._id][$scope.year][j] == undefined)
                        year_data[year_data.length - 1].push(0);
                    else
                        year_data[year_data.length-1].push(data[menu._id][$scope.year][j].total_count);
                }
            }
            for(var j=11; j>=0; j--) {
                var sum = 0;
                for (var i = 0; i < cafe.menus.length; i++) {
                    sum += year_data[i][j];
                }
                if(sum == 0) {
                    for (var i = 0; i < cafe.menus.length; i++) {
                        year_data[i].splice(j, 1);
                    }
                    year_labels.splice(j, 1);
                }
            }
            $scope.year_labels = year_labels;
            $scope.year_data = year_data;
        }

        function initializeMonthData() {
            var month_labels = [];
            var month_data = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                var menu = cafe.menus[i];
                month_data.push([]);
                for (var j = 1; j <= 31; j++) {
                    if(i==0) month_labels.push(j + "일");
                    if(data[menu._id] == undefined ||
                        data[menu._id][$scope.year] == undefined ||
                        data[menu._id][$scope.year][$scope.month] == undefined ||
                        data[menu._id][$scope.year][$scope.month][j] == undefined)
                        month_data[month_data.length - 1].push(0);
                    else
                        month_data[month_data.length -1].push(data[menu._id][$scope.year][$scope.month][j].total_count);
                }
            }
            for(var j=31; j>=0; j--) {
                var sum = 0;
                for (var i = 0; i < cafe.menus.length; i++) {
                    sum += month_data[i][j];
                }
                if(sum == 0) {
                    for (var i = 0; i < cafe.menus.length; i++) {
                        month_data[i].splice(j, 1);
                    }
                    month_labels.splice(j, 1);
                }
            }
            $scope.month_labels = month_labels;
            $scope.month_data = month_data;
        }

        function initializeDateData() {
            var date_labels = [];
            var date_data = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                var menu = cafe.menus[i];
                date_data.push([]);
                for (var j = 0; j <= 23; j++) {
                    if(i==0) date_labels.push(j + "시");
                    if(data[menu._id] == undefined ||
                        data[menu._id][$scope.year] == undefined ||
                        data[menu._id][$scope.year][$scope.month] == undefined ||
                        data[menu._id][$scope.year][$scope.month][$scope.date] == undefined ||
                        data[menu._id][$scope.year][$scope.month][$scope.date][j] == undefined)
                        date_data[date_data.length - 1].push(0);
                    else
                        date_data[date_data.length - 1].push(data[menu._id][$scope.year][$scope.month][$scope.date][j].total_count);
                }
            }
            for(var j=23; j>=0; j--) {
                var sum = 0;
                for (var i = 0; i < cafe.menus.length; i++) {
                    sum += date_data[i][j];
                }
                if(sum == 0) {
                    for (var i = 0; i < cafe.menus.length; i++) {
                        date_data[i].splice(j, 1);
                    }
                    date_labels.splice(j, 1);
                }
            }
            $scope.date_labels = date_labels;
            $scope.date_data = date_data;
        }

        initializeSeries();
        initializeData();
        initializeYearData();
        initializeMonthData();
        initializeDateData();

        $(document).ready(function(e) {
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
            $("#start_picker").datepicker();
            $("#finish_picker").datepicker();
            sidebar.getCafeList(auth.currentUser()._id);
        });
    }
]);