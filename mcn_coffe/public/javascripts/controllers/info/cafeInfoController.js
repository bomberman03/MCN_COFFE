/**
 * Created by blood_000 on 2016-09-07.
 */
app.controller('CafeInfoCtrl', [
    '$scope',
    'cafes',
    'cafe',
    'openApi',
    '$timeout',
    'sidebar',
    'auth',
    function($scope, cafes, cafe, openApi, $timeout, sidebar, auth){
        $scope.cafe = cafe;
        $scope.isNetworking = false;
        $scope.baseResponse = "";
        $scope.geoResponse = "";
        $scope.imageResponse = "";
        $scope.deleteConfirm = "";

        $scope.updateCafeBase = function(){
            if($scope.isNetworking) return;
            $timeout(function() {
                $scope.baseResponse = "";
                $scope.isNetworking = true;
            });
            var data = {
                name: $scope.cafe.name,
                detail: $scope.cafe.detail,
                phone: $scope.cafe.phone
            };
            cafes.updateCafe($scope.cafe._id, data, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.baseResponse = "요청이 정상적으로 처리되었습니다.";
                });
            },function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.baseResponse = "알수 없는 오류가 발생했습니다.";
                });
            });
        };

        $scope.updateCafeGeo = function(){
            if($scope.isNetworking) return;
            $timeout(function() {
                $scope.geoResponse = "";
                $scope.isNetworking = true;
            });
            var data = {
                location: {
                    latitude: $scope.cafe.location.latitude,
                    longitude: $scope.cafe.location.longitude
                },
                address: $scope.cafe.address,
                detailAddress: $scope.cafe.detailAddress
            };
            cafes.updateCafe($scope.cafe._id, data, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.geoResponse = "요청이 정상적으로 처리되었습니다.";
                });
            },function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.geoResponse = "알수 없는 오류가 발생했습니다.";
                });
            });
        };

        $scope.updateCafeImages = function(){
            if($scope.isNetworking) return;
            $timeout(function() {
                $scope.imageResponse = "";
                $scope.isNetworking = true;
            });
            var data = {
                images:[]
            };
            for(var i=0; i<dropzone.files.length; i++) {
                var filename = JSON.parse(dropzone.files[i].xhr.response).filename;
                data.images.push(filename)
            }
            var first_img = $(".flex-active-slide div").css("background-image");
            var from = first_img.lastIndexOf("/") + 1;
            var to = first_img.lastIndexOf("\"");
            var filename = first_img.substring(from, to);
            var idx = data.images.indexOf(filename);
            data.images[idx] = data.images[0];
            data.images[0] = filename;
            cafes.updateCafe($scope.cafe._id, data, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.imageResponse = "요청이 정상적으로 처리되었습니다.";
                });
            },function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.imageResponse = "알수 없는 오류가 발생했습니다.";
                });
            });
        };

        $scope.deleteCafe = function () {
            if($scope.isNetworking) return;
            $timeout(function() {
                $scope.deleteResponse = "";
                $scope.isNetworking = true;
            });
            var data = {
                confirm: $scope.deleteConfirm
            };
            cafes.deleteCafe($scope.cafe, data, function(data){
                location.herf="/dashboard#/main";
            }, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.imageResponse = "알수 없는 오류가 발생했습니다.";
                });
            });
        };

        $(document).ready(function(){
            $.material.init();
            sidebar.getCafeList(auth.currentUser);
            initializeDropzone();
            initializeSlider();
            initializeTMap();
            initializePostCodify();
        });

        var tMap, tMarkerLayer, tMarker;
        var dropzone;

        function initializeSlider() {
            var slideDiv = $("#image_slide");
            slideDiv.empty();
            slideDiv.css("padding-top","60px");
            var loading = "<div class='loader'></div>";
            slideDiv.append(loading);
            setTimeout(function() {
                slideDiv.empty();
                slideDiv.css("padding-top","0");
                var flexSlider =
                    '<div class="flexslider carousel">' +
                    '<ul class="slides">' +
                    '</ul>' +
                    '</div>';
                slideDiv.append(flexSlider);
                for (var i = 0; i < dropzone.files.length; i++) {
                    var filename = JSON.parse(dropzone.files[i].xhr.response).filename;
                    var img = "url('/image/cafe/" + filename + "')";
                    var html = '<li><div style="background-image:' + img + '"></div></li>';
                    $(".flexslider .slides").append(html);
                }
                flexSlider = $('.flexslider').flexslider({
                    animation: "slide",
                    animating: false
                });
                resizeSliderMargin();
            },500);
        }

        function resizeSliderMargin() {
            if(dropzone.files.length < 2) {
                $("#image_slide").css("margin-bottom","0");
                $(".flexslider").css("margin-bottom","0");
            } else {
                $("#image_slide").css("margin-bottom", "60px");
                $(".flexslider").css("margin-bottom", "60px");
            }
        }

        function initializeTMap() {
            tMap = new Tmap.Map({
                div:'tMap',
                width:'100%',
                height:'400px',
                transitionEffect:"resize",
                animation:true
            });
            tMarkerLayer = new Tmap.Layer.Markers();
            tMap.addLayer(tMarkerLayer);
            tMap.events.register("click", tMap, onClickMap);
            function calculateOffset(){
                var sb_margin_left = $("#page-wrapper").css("margin-left");
                var sb_padding_left = $("#page-wrapper").css("padding-left");
                var margin_left = $('#tMap').parent().parent().css('margin-left');
                var padding_left = $('#tMap').parent().parent().css('padding-left');
                sb_margin_left = sb_margin_left.substr(0, sb_margin_left.length - 2) * 1;
                sb_padding_left = sb_padding_left.substr(0, sb_padding_left.length -2) * 1;
                margin_left = margin_left.substr(0, margin_left.length - 2) * 1;
                padding_left = padding_left.substr(0, padding_left.length - 2) * 1;
                var xOffset = sb_margin_left + sb_padding_left + margin_left + padding_left + 1;
                var scrollTop = $("body").scrollTop();
                var yOffset = 605 - scrollTop;
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
            var location = new Tmap.LonLat($scope.cafe.location.longitude, $scope.cafe.location.latitude);
            tMap.setCenter(location);
            moveMarker(location);
        }

        function initializePostCodify() {
            $(".postcodify_address").postcodifyPopUp({
                insertAddress: '.postcodify_address',
                beforeSelect: function(e) {
                    var address = e.context.innerText;
                    address = address.substr(0, address.indexOf('('));
                    openApi.getCoordinateByAddress(address, function(data){
                        var jsonData = JSON.parse(data);
                        var point  = jsonData.result.items[0].point;
                        var location  = {
                            latitude: point.y,
                            longitude: point.x
                        };
                        var method = {
                            from: 'WGS84GEO',
                            to: 'EPSG3857'
                        };
                        openApi.convertCoordinate(location, method, function(data){
                            var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                            tMap.setCenter(tLocation);
                            moveMarker(tLocation);
                            $scope.cafe.location = {
                                latitude: tLocation.lat,
                                longitude: tLocation.lon
                            };
                            $scope.cafe.address  = address;
                        });
                    });
                }
            });
        }

        function moveMarker(location) {
            var size = new Tmap.Size(24,38);
            var offset = new Tmap.Pixel(-(size.w/2), -(size.h));
            var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png', size, offset);
            if(tMarker != undefined )
                tMarkerLayer.removeMarker(tMarker);
            tMarker = new Tmap.Marker(location, icon);
            tMarkerLayer.addMarker(tMarker);
        }

        function initializeDropzone() {
            Dropzone.autoDiscover = false;
            dropzone = new Dropzone("div#dropzone", {
                url: '/upload/cafe/image',
                paramName: "file",
                addRemoveLinks: true,
                dictRemoveFile: "삭제"
            });
            for (var i = 0; i < cafe.images.length; i++) {
                var file = {
                    xhr:{
                        response: JSON.stringify({
                            filename: cafe.images[i],
                            message: 'success'
                        })
                    }
                };
                var url = "/image/cafe/" + cafe.images[i];
                dropzone.emit('addedfile', file);
                dropzone.emit("thumbnail", file, dropzone.createThumbnailFromUrl(file, url));
                dropzone.emit('complete', file);
                dropzone.files.push(file);
            }
            dropzone.on('complete', function(file){
                initializeSlider();
            });
            dropzone.on('removedfile', function(file){
                initializeSlider();
            });
        }
    }
]);