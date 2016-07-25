/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('RegisterMenuCtrl', [
    '$scope',
    'cafes',
    'cafe',
    function($scope, cafes, cafe) {
        $scope.cafe = cafe;
        $scope.options = [];
        $scope.menu = {
            name: "",
            cost: 0,
            options: $scope.options
        };

        $scope.createOption = function(option){
            if(option == undefined) option = $scope;
            option.options.push({
                name: "",
                cost: 0
            });
        };

        $scope.createOptionGroup = function(){
            $scope.options.push({
                name: "",
                options: [{
                    name:"",
                    cost:""
                }]
            });
        };

        $scope.createMenu = function(){
            cafes.createMenu($scope.cafe._id, $scope.menu);
        };

        $(document).ready(function() {
            $.material.init();

            $('#inputMenuName').get(0).addEventListener('keyup', function() {
                var name = $(this).val();
                if(name.length == 0) name = "새 메뉴 이름";
                $('#base_option').html(name);
            }, false);
        });
    }
]);