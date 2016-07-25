/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('RegisterCafeCtrl', [
    '$scope',
    'cafes',
    function($scope, cafes){
        $(document).ready(function() {
            $.material.init();
        });
        
        $scope.createCafe = function(){
            if($scope.name == '' || $scope.detail == '') return;
            cafes.createCafe({
                name: $scope.name,
                detail: $scope.detail
            });
            $scope.name = '';
            $scope.detail = '';
        };
    }
]);