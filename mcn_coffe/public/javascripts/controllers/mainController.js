app.controller('MainCtrl', [
    '$scope',
    'cafes',
    function($scope, cafes){
        $scope.cafes = cafes.cafes;

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
            console.log($scope.cafes);
            for(var i=0; i<$scope.cafes.length; i++) {
                getWaitOrders($scope.cafes[i]);
            }
        });

        function getWaitOrders(cafe) {
            cafes.getWaitOrders(cafe._id, function(data){
                var orders = data.data;
                cafe["wait"] = orders.length;
            }, function(data){
                console.log("error");
            });
        }

    }
]);