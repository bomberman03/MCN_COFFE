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

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };

        $(document).ready(function(e){
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
]);