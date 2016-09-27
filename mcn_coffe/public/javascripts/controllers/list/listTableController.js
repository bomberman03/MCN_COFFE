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
    function(cafes, cafe, $scope, $timeout, auth, sidebar) {

        $scope.year = 2016;
        $scope.month = 6;
        $scope.date = 20;

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

        function initializeYearData() {
            var year_labels = [];
            var year_data = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                year_data.push([]);
                for (var j = 1; j <= 12; j++) {
                    if(i==0) year_labels.push(j + "월");
                    year_data[year_data.length - 1].push(0);
                }
            }
            cafes.getYearStatistic(cafe._id, $scope.year, function(data){
                var statistics = data.data;
                for(var i=0; i<statistics.length; i++) {
                    var statistic = statistics[i];
                    var menu_idx = menu_map[statistic.menu];
                    year_data[menu_idx][statistic.month-1] = statistic.total_count;
                }
                $scope.year_labels = year_labels;
                $scope.year_data = year_data;
            }, function(data){
                console.log("error!");
            });
        }
        function initializeMonthData() {
            var month_labels = [];
            var month_data = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                month_data.push([]);
                for (var j = 1; j <= 31; j++) {
                    if(i==0) month_labels.push(j + "일");
                    month_data[month_data.length - 1].push(0);
                }
            }
            cafes.getMonthStatistic(cafe._id, $scope.year, $scope.month, function(data){
                var statistics = data.data;
                for(var i=0; i<statistics.length; i++) {
                    var statistic = statistics[i];
                    var menu_idx = menu_map[statistic.menu];
                    month_data[menu_idx][statistic.date-1] = statistic.total_count;
                }
                $scope.month_labels = month_labels;
                $scope.month_data = month_data;
            }, function(data){
                console.log("error!");
            });
            $scope.month_labels = month_labels;
            $scope.month_data = month_data;
        }

        function initializeDateData() {
            var date_labels = [];
            var date_data = [];
            for (var i = 0; i < cafe.menus.length; i++) {
                date_data.push([]);
                for (var j = 0; j <= 23; j++) {
                    if(i==0) date_labels.push(j + "시");
                    date_data[date_data.length - 1].push(0);
                }
            }
            cafes.getDateStatistic(cafe._id, $scope.year, $scope.month, $scope.date, function(data){
                var statistics = data.data;
                for(var i=0; i<statistics.length; i++) {
                    var statistic = statistics[i];
                    var menu_idx = menu_map[statistic.menu];
                    date_data[menu_idx][statistic.hour] = statistic.total_count;
                }
                $scope.date_labels = date_labels;
                $scope.date_data = date_data;
            }, function(data){
                console.log("error!");
            });
        }

        initializeSeries();
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