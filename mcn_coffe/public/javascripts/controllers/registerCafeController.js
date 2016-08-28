/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('RegisterCafeCtrl', [
    '$scope',
    'cafes',
    'openApi',
    function($scope, cafes, openApi){
        $(document).ready(function() {
            $.material.init();

            // T map
            var tMap = new Tmap.Map({
                div:'tMap',
                width:'100%',
                height:'400px',
                transitionEffect:"resize",
                animation:true
            });
            //경로 정보 로드
            function searchRoute(start, end){
                var routeFormat = new Tmap.Format.KML({extractStyles:true, extractAttributes:true});
                var urlStr = "https://apis.skplanetx.com/tmap/routes?version=1&format=xml";
                urlStr += "&startX=" + start.x;
                urlStr += "&startY="+ start.y;
                urlStr += "&endX="+ end.x;
                urlStr += "&endY="+ end.y;
                urlStr += "&appKey=b7224677-d5a3-3c7e-9a1c-33db6ad8e19e";
                console.log(urlStr);
                var prtcl = new Tmap.Protocol.HTTP({
                    url: urlStr,
                    format:routeFormat
                });
                var routeLayer = new Tmap.Layer.Vector("route", {protocol:prtcl, strategies:[new Tmap.Strategy.Fixed()]});
                routeLayer.events.register("featuresadded", routeLayer, onDrawnFeatures);
                tMap.addLayer(routeLayer);
            }
            //경로 그리기 후 해당영역으로 줌
            function onDrawnFeatures(e){
                tMap.zoomToExtent(this.getDataExtent());
            }
            var start = {x:0, y:0};
            var end = {x:0, y:0};
            $(".postcodify_address").postcodifyPopUp({
               insertAddress: '.postcodify_address',
               beforeSelect: function(e){
                    var address = e.context.innerText;
                    openApi.getCoordinateByAddress(address, function(data){
                        var jsonData = JSON.parse(data);
                        var point  = jsonData.result.items[0].point;
                        openApi.convertCoordinate(point.x, point.y, function(data){
                            start.x = data.coordinate.lon;
                            start.y = data.coordinate.lat;
                            if($('.postcodify_details').val().length > 0)
                                searchRoute(start, end);
                            else {
                                var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                                tMap.setCenter(tLocation);
                            }
                        });
                    });
                }
            });
            $(".postcodify_details").postcodifyPopUp({
                insertAddress: '.postcodify_details',
                beforeSelect: function(e){
                    var address = e.context.innerText;
                    openApi.getCoordinateByAddress(address, function(data){
                        var jsonData = JSON.parse(data);
                        var point  = jsonData.result.items[0].point;
                        openApi.convertCoordinate(point.x, point.y, function(data){
                            end.x = data.coordinate.lon;
                            end.y = data.coordinate.lat;
                            if($('.postcodify_address').val().length > 0) {
                                searchRoute(start, end);
                            }
                            else {
                                var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                                tMap.setCenter(tLocation);
                            }
                        });
                    });
                }
            });
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

        function initializeGoogleMap(){
            // google Map
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();

            var mapProp = {
                center: new google.maps.LatLng(36.6144268, 127.4740712),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var googleMap = new google.maps.Map(document.getElementById("googleMap"),mapProp);
            directionsDisplay.setMap(googleMap);

            var start = new google.maps.LatLng(36.6144268, 127.4740712);
            var end  = new google.maps.LatLng(36.3518898, 127.3782516);

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT
            };

            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                }
            });
        }

        function initializeNaverMap()
        {
            // naver Map
            var mapOptions = {
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: naver.maps.MapTypeControlStyle.BUTTON,
                    position: naver.maps.Position.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.SMALL,
                    position: naver.maps.Position.RIGHT_CENTER
                },
                scaleControl: true,
                scaleControlOptions: {
                    position: naver.maps.Position.BOTTOM_RIGHT
                },
                logoControl: true,
                logoControlOptions: {
                    position: naver.maps.Position.TOP_LEFT
                },
                mapDataControl: true,
                mapDataControlOptions: {
                    position: naver.maps.Position.BOTTOM_LEFT
                },
                center: new naver.maps.LatLng(40.577280, 77.544221),
                zoom: 10
            };

            var map = new naver.maps.Map('map', mapOptions);

            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(37.3595704, 127.105399),
                map: map
            });

            naver.maps.Event.addListener(map, 'click', function(e) {
                marker.setPosition(e.latlng);
            });
        }

    }
]);