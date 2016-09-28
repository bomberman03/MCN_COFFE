app.factory('sidebar', [ 'cafes', function(cafes) {
    var o = {};
    o.removeCafeList = function(){
        if(!hasCafeList()) return;
        $("#cafe_list").empty();
    };
    o.getCafeList = function(user_id) {
        if(!hasCafeList()) return;
        o.removeCafeList();
        cafes.getUserCafe(user_id, function(data){
            var cafes = data.data;
            for(var i=0; i<cafes.length; i++)
                addCafeList(cafes[i]);
        }, function(data) {
            console.log(data);
        });
    };
    function hasCafeList() {
        return ($("#cafe_list") != undefined)
    }
    function getCafeHtml(cafe) {
        return  '<li>' +
            '<a href="#/main"><i class="fa fa-bar-chart-o fa-fw"></i>' + cafe.name + '<span class="fa arrow"></span></a>' +
            '<ul class="nav nav-second-level collapse" aria-expanded="false" style="height: 0px;">' +
            '<li><a href="#/info/cafe/' + cafe._id + '">카페 관리</a></li>' +
            '<li><a href="#/list/cafes/' + cafe._id + '/menu">메뉴 관리</a></li>' +
            '<li><a href="#/list/cafes/' + cafe._id + '/graph">주문 현황</a></li>' +
            '<li><a href="#/list/cafes/' + cafe._id + '/table">메뉴 분석</a></li>' +
            '</ul>' +
            '</li>';
    }
    function addCafeList(cafe){
        var html = getCafeHtml(cafe);
        var cafe_list = $("#cafe_list");
        cafe_list.append(html);
        cafe_list.metisMenu();
    }
    return o;
}]);
