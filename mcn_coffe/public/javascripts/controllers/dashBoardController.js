/**
 * Created by blood_000 on 2016-09-07.
 */
app.controller('DashBoardCtrl', [
    '$scope',
    'cafes',
    'auth',
    'sidebar',
    function($scope, cafes, auth, sidebar){
        $scope.cafes = cafes;

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
            sidebar.getCafeList(auth.currentUser()._id);
        });
    }
]);