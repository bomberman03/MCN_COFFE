/**
 * Created by blood_000 on 2016-09-07.
 */
app.controller('DashBoardCtrl', [
    '$scope',
    'cafes',
    'auth',
    function($scope, cafes, auth){
        $scope.cafes = undefined;

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
]);