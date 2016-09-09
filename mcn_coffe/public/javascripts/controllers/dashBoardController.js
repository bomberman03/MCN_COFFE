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
            cafes.getUserCafe(auth.currentUser()._id, function(data){
                $scope.cafes = data.data;
                for(var i=0; i<$scope.cafes.length; i++)
                    addCafeList($scope.cafes[i]);
            }, function(data) {

            });
        });

        function getCafeHtml(cafe) {
            return  '<li>' +
                '<a href="#/main"><i class="fa fa-bar-chart-o fa-fw"></i>' + cafe.name + '<span class="fa arrow"></span></a>' +
                '<ul class="nav nav-second-level collapse" aria-expanded="false" style="height: 0px;">' +
                '<li><a href="#/info/cafe/' + cafe._id + '">카페 관리</a></li>' +
                '<li><a href="#/list/cafes/' + cafe._id + '/menu">메뉴 관리</a></li>' +
                '<li><a href="#">이벤트 관리</a></li>' +
                '<li><a href="#">주문 현황</a></li>' +
                '</ul>' +
                '</li>';
        }

        function addCafeList(cafe){
            console.log(cafe);
            var html = getCafeHtml(cafe);
            var sideMenu = $("#side-menu");
            sideMenu.append(html);
            sideMenu.metisMenu();
        }
    }
]);