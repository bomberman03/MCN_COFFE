/**
 * Created by pathFinder on 2016-07-12.
 */
app.factory('openApi', ['$http', function($http){
    var o = {};
    o.getCoordinateByAddress = function(address, callback){
        var data = {
            hostname: 'openapi.naver.com',
            path: '/v1/map/geocode?encoding=utf-8&coord=latlng&output=json&query=' + encodeURI(address)
        };
        return $http.post('/getCoordinate', data).success(function(data){
            callback(data);
        });
    };
    o.convertCoordinate = function(latitude, longtitude, callback){
        var urlStr = "https://apis.skplanetx.com/tmap/geo/coordconvert?";
        urlStr += "lon=" + latitude;
        urlStr += "&lat=" + longtitude;
        urlStr += "&fromCoord=WGS84GEO";
        urlStr += "&toCoord=EPSG3857";
        urlStr += "&version=1";
        urlStr += "&appKey=b7224677-d5a3-3c7e-9a1c-33db6ad8e19e";
        return $http.get(urlStr).success(function(data){
            callback(data);
        });
    };
    return o;
}]);