/**
 * Created by pathFinder on 2016-09-12.
 */
app.controller('ListGraphCtrl', [
    'cafes',
    'cafe',
    '$scope',
    '$timeout',
    function(cafes, cafe, $scope, $timeout) {
        $(document).ready(function(e){
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
            var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var randomScalingFactor = function() {
                return Math.round(Math.random() * 100);
                //return 0;
            };
            var randomColorFactor = function() {
                return Math.round(Math.random() * 255);
            };
            var randomColor = function(opacity) {
                return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
            };
            var config = {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                        fill: false,
                        borderDash: [5, 5],
                    }, {
                        hidden: true,
                        label: 'hidden dataset',
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                    }, {
                        label: "My Second dataset",
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                    }]
                },
                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:'Chart.js Line Chart'
                    },
                    tooltips: {
                        mode: 'label',
                        callbacks: {
                        }
                    },
                    hover: {
                        mode: 'dataset'
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            },
                            ticks: {
                                suggestedMin: -10,
                                suggestedMax: 250,
                            }
                        }]
                    }
                }
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            window.myLine = new Chart(ctx, config);
            console.log(myChart);
        });
    }
]);