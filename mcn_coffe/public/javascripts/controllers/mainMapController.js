/**
 * Created by blood_000 on 2016-09-22.
 */
app.controller('MainMapCtrl', [
    '$scope',
    'cafes',
    'openApi',
    function($scope, cafes, openApi){
        $scope.cafes = cafes.cafes;
        $scope.categories = ['500m', '1Km', '5Km'];
        $scope.category_filter = '500m';
        $scope.cafe = {
            location:{
                latitude:0,
                longitude:0
            },
            address:""
        };
        $scope.cafe_list = [];
        $scope.icon_map = [
            'a','b','c','d','e',
            'f','g','h','i','j',
            'k','l','m','n','o',
            'p','q','r','s','t',
            'u','v','w','x','y',
            'z','0','1','2','3',
            '4','5','6','7','8',
            '9'
        ];

        $scope.selectFilter = function(category){
            $scope.category_filter = category;
        };

        $scope.makeQuery = function(dist) {
            $scope.cafe_list.length = 0;
            for(var i=0; i<marker_list.length; i++) {
                tMarkerLayer.removeMarker(marker_list[i]);
            }
            marker_list.length = 0;
            marker_map = {};
            var size = new Tmap.Size(24,38);
            var offset = new Tmap.Pixel(-(size.w/2), -(size.h));
            var from = new Tmap.Geometry.Point($scope.cafe.location.latitude, $scope.cafe.location.longitude);
            var tmp_cafe_list = []
            for(var i=0; i<$scope.cafes.length; i++)
            {
                var to = new Tmap.Geometry.Point($scope.cafes[i].location.latitude, $scope.cafes[i].location.longitude);
                var _dist = from.distanceTo(to);
                if(_dist <= dist) {
                    tmp_cafe_list.push($scope.cafes[i]);
                    tmp_cafe_list[tmp_cafe_list.length-1]["dist"] = parseInt(_dist);
                    var dist_str = parseInt(_dist);
                    if(dist_str > 1000) {
                        dist_str = (dist_str / 1000).toFixed(1);
                        dist_str = dist_str + "km";
                    } else {
                        dist_str = dist_str + "m";
                    }
                    tmp_cafe_list[tmp_cafe_list.length-1]["dist_str"] = dist_str;
                }
            }
            tmp_cafe_list.sort(function(a, b){
                return a.dist - b.dist;
            });
            for(var i=0; i<tmp_cafe_list.length; i++){
                $scope.cafe_list.push(tmp_cafe_list[i]);
                var location = new Tmap.LonLat(tmp_cafe_list[i].location.longitude, tmp_cafe_list[i].location.latitude);
                var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_' + $scope.icon_map[i] + '.png', size, offset);
                var html = "<span class='label label-primary'>" + tmp_cafe_list[i].name + "</span>";
                var label = new Tmap.Label(html);
                var markers = new Tmap.Markers(location, icon, label);
                marker_map[icon.imageDiv.id] = markers;
                $(icon.imageDiv).mouseenter(function(evt){
                    marker_map[evt.currentTarget.id].popup.show();
                }).mouseleave(function(evt){
                    marker_map[evt.currentTarget.id].popup.hide();
                });
                marker_list.push(markers);
                tMarkerLayer.addMarker(markers);
            }
            getCafesByDistance($scope.cafe.location.latitude, $scope.cafe.location.longitude, dist);
        };

        $scope.showPath = function($event, cafe, transportation) {
            $event.stopPropagation();
            searchRoute(cafe, transportation);
        };

        $scope.focusCafe = function(cafe) {
            var tLocation = new Tmap.LonLat(cafe.location.longitude, cafe.location.latitude);
            tMap.setCenter(tLocation);
        };

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
            initializeTMap();
            initializePostCodify();
        });

        var tMap, tMarkerLayer, tMarker;
        var kmlLayer;
        var marker_list = [];
        var marker_map = {};


        function initializeTMap() {
            var height = $(window).height() - 50;
            $("#cafe_list").css("height",(height - 104 - 15)+"px");
            tMap = new Tmap.Map({
                div:'tMap',
                width:'100%',
                height:height,
                transitionEffect:"resize",
                animation:true
            });
            kmlLayer = new Tmap.Layer.Vector("kmlLayer");
            tMap.addLayer(kmlLayer);
            tMarkerLayer = new Tmap.Layer.Markers();
            tMap.addLayer(tMarkerLayer);
            tMap.events.register("click", tMap, onClickMap);
            function calculateOffset(){
                var sb_margin_left = $("#page-wrapper").css("margin-left");
                var xOffset = 0;
                var scrollTop = $("body").scrollTop();
                var yOffset = 50 - scrollTop;
                if(sb_margin_left == 0) {
                    var sb_height = $(".sidebar").height();
                    yOffset += (sb_height + 50);
                }
                return {
                    x: xOffset,
                    y: yOffset
                };
            }
            function onClickMap(evt){
                var offset = calculateOffset();
                var pixel = new Tmap.Pixel(evt.clientX - offset.x , evt.clientY - offset.y);
                var location = tMap.getLonLatFromPixel(pixel);
                moveMarker(location);
                $scope.cafe.location = location = {
                    latitude: location.lat,
                    longitude: location.lon
                };
                var method = {
                    from: 'EPSG3857',
                    to: 'WGS84GEO'
                };
                openApi.convertCoordinate(location, method, function(data){
                    var location = {
                        latitude: data.coordinate.lat,
                        longitude: data.coordinate.lon
                    };
                    openApi.getAddressByCoordinate(location, function(data) {
                        var jsonData = JSON.parse(data);
                        var result = jsonData.result;
                        if(result.total > 0) {
                            var items = result.items;
                            for (var idx in items){
                                if(items[idx].isRoadAddress) {
                                    $(".postcodify_address").val(items[idx].address);
                                    break;
                                }
                            }
                        }
                    });
                });
            }
        }

        function initializePostCodify() {
            $(".postcodify_address").postcodifyPopUp({
                insertAddress: '.postcodify_address',
                beforeSelect: function (e) {
                    var address = e.context.innerText;
                    address = address.substr(0, address.indexOf('('));
                    openApi.getCoordinateByAddress(address, function (data) {
                        var jsonData = JSON.parse(data);
                        var point = jsonData.result.items[0].point;
                        var location = {
                            latitude: point.y,
                            longitude: point.x
                        };
                        var method = {
                            from: 'WGS84GEO',
                            to: 'EPSG3857'
                        };
                        openApi.convertCoordinate(location, method, function (data) {
                            var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                            tMap.setCenter(tLocation);
                            moveMarker(tLocation);
                            $scope.cafe.location = {
                                latitude: tLocation.lat,
                                longitude: tLocation.lon
                            };
                            $scope.cafe.address = address;
                        });
                    });
                }
            });
        }

        function moveMarker(location) {
            var size = new Tmap.Size(24,38);
            var offset = new Tmap.Pixel(-(size.w/2), -(size.h));
            var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_r_m_m.png', size, offset);
            if(tMarker != undefined )
                tMarkerLayer.removeMarker(tMarker);
            tMarker = new Tmap.Marker(location, icon);
            tMarkerLayer.addMarker(tMarker);
        }

        function searchRoute(cafe, transportation){
            var routeFormat = new Tmap.Format.KML({extractStyles:true, extractAttributes:true});
            var startX = $scope.cafe.location.longitude;
            var startY = $scope.cafe.location.latitude;
            var endX = cafe.location.longitude;
            var endY = cafe.location.latitude;
            var startName = "내 위치";
            var endName = cafe.name;
            var urlStr = "https://apis.skplanetx.com/tmap/routes/" + transportation + "?version=1&format=xml";
            urlStr += "&startX="+startX;
            urlStr += "&startY="+startY;
            urlStr += "&endX="+endX;
            urlStr += "&endY="+endY;
            urlStr += "&startName="+encodeURIComponent(startName);
            urlStr += "&endName="+encodeURIComponent(endName);
            urlStr += "&appKey=b7224677-d5a3-3c7e-9a1c-33db6ad8e19e";
            var prtcl = new Tmap.Protocol.HTTP({
                url: urlStr,
                format:routeFormat
            });
            if(kmlLayer!=undefined)
                tMap.removeLayer(kmlLayer);
            kmlLayer = new Tmap.Layer.Vector("route", {protocol:prtcl, strategies:[new Tmap.Strategy.Fixed()]});
            kmlLayer.events.register("featuresadded", kmlLayer, onDrawnFeatures);
            tMap.addLayer(kmlLayer);
            if(tMarkerLayer != undefined)
                tMap.removeLayer(tMarkerLayer);
            tMap.addLayer(tMarkerLayer);
        }

        function onDrawnFeatures(e){
            tMap.zoomToExtent(this.getDataExtent());
        }

        function getCafesByDistance(latitude, longitude, dist){
            cafes.getCafesByDistance(latitude, longitude, dist, function(data){
            }, function(data){
            });
        }
    }
]);