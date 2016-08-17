/**
 * Created by pathFinder on 2016-08-15.
 */
/**
 * Created by pathFinder on 2016-08-11.
 */

app.controller('ListMenuCtrl', [
    'cafes',
    'cafe',
    '$scope',
    function(cafes, cafe, $scope){
        $scope.cafe = cafe;
        $scope.menus = [];
        $scope.categories = ['전체'];
        $scope.category_filter = "전체";
        $scope.search_term = '';

        $(document).ready(function(e){
            $('[data-toggle="tooltip"]').tooltip();
            initialize();
            console.log($scope.menus);
        });

        function initialize() {
            for(var idx in $scope.cafe.menus) {
                var menu = $scope.cafe.menus[idx];
                if($scope.categories.indexOf(menu.category) == -1) {
                    $scope.categories.push(menu.category);
                }
                $scope.menus.push(menu);
            }
        }

        $scope.selectFilter = function(category){
            $scope.category_filter = category;
        };

        $scope.makeQuery = function() {
            var search_term  = $("#search_term").val();
            $scope.menus.length = 0;
            for(var idx in $scope.cafe.menus) {
                var menu = $scope.cafe.menus[idx];
                if($scope.category_filter == "전체" || $scope.category_filter == menu.category) {
                    if(menu.name.match(search_term) == null)
                        continue;
                    $scope.menus.push(menu);
                }
            }
        }
    }
]);

