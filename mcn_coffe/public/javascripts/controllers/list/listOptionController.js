/**
 * Created by pathFinder on 2016-08-16.
 */
/**
 * Created by pathFinder on 2016-08-15.
 */
/**
 * Created by pathFinder on 2016-08-11.
 */

app.controller('ListOptionCtrl', [
    'cafes',
    'options',
    '$scope',
    function(cafes, options, $scope){
        $scope.options = [];
        $scope.categories = ['단일 옵션', "옵션 그룹"];
        $scope.category_filter = "단일 옵션";
        $scope.search_term = '';

        $(document).ready(function(e){
            $('[data-toggle="tooltip"]').tooltip();
            console.log(options.data);
            
            for(var idx in options.data) {
                var option = options.data[idx];
                $scope.options.push(option);
            }
            console.log($scope.options);
        });

        $scope.selectFilter = function(category){
            $scope.category_filter = category;
        };

        $scope.makeQuery = function() {
            var search_term  = $("#search_term").val();
            $scope.options.length = 0;
            for(var idx in options) {
                var option = options[idx];
                if(option.name.match(search_term) == null)
                    continue;
                $scope.options.push(option);
            }
        }
    }
]);

