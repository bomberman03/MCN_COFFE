/**
 * Created by pathFinder on 2016-08-11.
 */

app.controller('CreateCafeCtrl', [
    '$scope',
    'auth',
    'cafes',
    'terms',
    'openApi',
    function($scope, auth, cafes, terms, openApi){
        $scope.terms = terms.terms;
        $scope.cafe  = {
            agree: [],
            name: '',
            detail: '',
            phone: '',
            location: {
                latitude: '0.0',
                longitude: '0.0'
            },
            address: '',
            detailAddress: '',
            locationConfirm: false,
            images: []
        };
        $scope.error = {
            agree: [],
            name: '',
            detail: '',
            phone: '',
            address: '',
            detailAddress: '',
            locationConfirm: '',
            images: ''
        };
        $scope.agreeAction = function(index){
            initAgree(index);
            $scope.error.agree[index] = false;
        };
        $scope.initForm = function(index) {
            if($scope.error[index]) {
                $scope.cafe[index] = $scope.error[index] = '';
                if(index == 'locationConfirm')
                    $scope.cafe[index] = true;
            }
        };

        var currentPage = 0;
        var tMap, tMarkerLayer, tMarker;
        var rMap, rMarkerLayer, rMarker;
        var dropzone, rDropzone;
        var thumbs = [];

        var validationCheck = [
            function(src, cb, err){
                initAgree(-1);
                var ret = true;
                for(var idx in $scope.cafe.agree) {
                    $scope.error.agree[idx] = !$scope.cafe.agree[idx];
                    ret &= $scope.cafe.agree[idx];
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            },
            function(src, cb, err){
                var ret = true;
                if($scope.cafe.name.trim().length == 0) { // 카페 이름 검사
                    $scope.error.name = "카페의 이름을 반드시 입력하세요";
                    ret = false;
                }
                if($scope.cafe.detail.trim().length == 0) { // 카페 설명 검사
                    $scope.error.detail = "카페에 대한 설명을 반드시 입력하세요";
                    ret = false;
                }
                if($scope.cafe.phone.trim().length == 0) { // 카페 전화번호 검사
                    $scope.error.phone = "카페 전화번호를 반드시 입력하세요";
                    ret = false
                }
                else if(!/\d{3}-\d{4}-\d{4}/.test($scope.cafe.phone.trim())) {
                    $scope.error.phone = "전화번호 양식이 맞지 않습니다.";
                    ret = false;
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            },
            function(src, cb, err) {
                var ret = true;
                if($scope.cafe.address.trim().length == 0) {
                    $scope.error.address = "카페의 주소를 반드시 입력하세요";
                    ret = false;
                }
                if(!$scope.cafe.locationConfirm){
                    $scope.error.locationConfirm = "지도의 표시된 위치가 맞는지 확인해주세요";
                    ret = false;
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            },
            function(src, cb, err) {
                var ret = true;
                var files = dropzone.files;
                if(files.length <= 0) {
                    $scope.error.images = "이미지는 1개 이상 필수입니다.";
                    ret = false;
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            },
            function(src, cb){
                cb(src);
                return true;
            },
            function(src, cb) {
                cb(src);
                return true;
            }
        ];

        $(document).ready(function() {
            $.material.init();
            initialize();
            initializeWizard();
            initializeTMap();
            initializePostCodify();
            initializeDropzone();
        });

        function initialize(){
            var lies = $("ul#progressbar li");
            lies.css("width", (100 / lies.length) + "%");
        }
        function initializeRDropzone() {
            Dropzone.autoDiscover = false;
            if(rDropzone ==  undefined) {
                rDropzone = new Dropzone("div#rDropzone", {
                    url: '/upload/cafe/image',
                    paramName: "file",
                    clickable: false,
                    dictRemoveFile: "삭제"
                });
            }
            var files = dropzone.files;
            while(thumbs.length) {
                var file = thumbs[thumbs.length - 1];
                rDropzone.emit('removedfile', file);
                thumbs.length--;
            }
            for(var idx in files){
                var file = $.extend({}, files[idx]);
                thumbs.push(file);
                rDropzone.emit('addedfile', file);
                rDropzone.emit("thumbnail", file, file.thumbnailUrl);
                rDropzone.emit('complete', file);
            }
        }
        function initializeDropzone() {
            Dropzone.autoDiscover = false;
            dropzone = new Dropzone("div#dropzone", {
                url: '/upload/cafe/image',
                paramName: "file",
                addRemoveLinks: true,
                dictRemoveFile: "삭제"
            });
        }
        function initAgree(index) {
            var agree = $(".agree");
            if($scope.cafe.agree.length == agree.length)
                return;
            $scope.cafe.agree.length = agree.length;
            $scope.cafe.agree.fill(false);
            if(index >= 0)
                $scope.cafe.agree[index] = true;
        }
        function initializeWizard() {
            var current_fs, next_fs, previous_fs;
            var left, opacity, scale;
            var animating;

            function toNextPage (src) {

                if(animating) return false;
                animating = true;

                currentPage++;

                current_fs = $(src).parent();
                next_fs = $(src).parent().next();

                $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                next_fs.show();
                current_fs.animate({opacity: 0}, {
                    step: function(now, mx) {
                        scale = 1 - (1 - now) * 0.2;
                        left = (now * 50)+"%";
                        opacity = 1 - now;
                        current_fs.css({
                            'transform': 'scale('+ scale +')',
                            'position': 'absolute'
                        });
                        next_fs.css({'left': left, 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function(){
                        current_fs.hide();
                        animating = false;
                        tMap.updateSize();
                        rMap.updateSize();
                        if(currentPage == 4) {
                            var location = new Tmap.LonLat($scope.cafe.location.longitude, $scope.cafe.location.latitude);
                            tMap.setCenter(location);
                            rMap.setCenter(location);
                            moveRMarker(location);
                            initializeRDropzone();
                        }
                        if(currentPage == 5) {
                            createCafe(function(data){
                                $scope.cafe = data.data;
                                toNextPage(next_fs.children()[0]);
                            }, function(data){
                                toPrevPage(next_fs.children()[0]);
                            });
                        }
                    },
                    easing: 'easeInOutBack'
                });
            }
            function toPrevPage (src) {
                if(animating) return false;
                animating = true;

                currentPage--;

                current_fs = $(src).parent();
                previous_fs = $(src).parent().prev();

                $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

                previous_fs.show();
                current_fs.animate({opacity: 0}, {
                    step: function (now, mx) {
                        scale = 0.8 + (1 - now) * 0.2;
                        left = ((1 - now) * 50) + "%";
                        opacity = 1 - now;
                        current_fs.css({'left': left});
                        previous_fs.css({'transform': 'scale(' + scale + ')', 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function () {
                        current_fs.hide();
                        animating = false;
                        tMap.updateSize();
                        rMap.updateSize();
                        if(currentPage == 4) {
                            var location = new Tmap.LonLat($scope.cafe.location.longitude, $scope.cafe.location.latitude);
                            tMap.setCenter(location);
                            rMap.setCenter(location);
                            moveRMarker(location);
                            initializeRDropzone();
                        }
                    },
                    easing: 'easeInOutBack'
                });
            }

            $(".next").click(function(){
                validationCheck[currentPage](this, toNextPage, function () {
                    console.log("validation error!");
                });
            });
            $(".previous").click(function(){
                toPrevPage(this);
            });
            $(".submit").click(function(){
                if($scope.cafe._id == undefined) return;
                location.href = "/#/cafes/" + $scope.cafe._id;
            });
        }

        function createCafe(cb, err) {
            $scope.cafe.images.length = 0;
            var files = dropzone.files;
            for(var idx in files) {
                var file = files[idx];
                var response = JSON.parse(file.xhr.responseText);
                $scope.cafe.images.push(response.filename);
            }
            $scope.cafe.owner = auth.currentUser();
            cafes.createCafe($scope.cafe, function(data){
                cb(data);
            }, function(data) {
                err(data);
            });
        }

        function initializeTMap() {

            rMap = new Tmap.Map({
                div:'rMap',
                width:'100%',
                height:'400px',
                transitionEffect:"resize",
                animation:true
            });
            rMarkerLayer = new Tmap.Layer.Markers();
            rMap.addLayer(rMarkerLayer);

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
                var yOffset = 249 - scrollTop;
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
                beforeSelect: function(e) {
                    var address = e.context.innerText;
                    address = address.substr(0, address.indexOf('('));
                    // address = address.substring(address.indexOf('(') + 1, address.indexOf(')'));
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
                            rMap.setCenter(tLocation);
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
        function moveRMarker(location) {
            var size = new Tmap.Size(24,38);
            var offset = new Tmap.Pixel(-(size.w/2), -(size.h));
            var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png', size, offset);

            if(rMarker != undefined)
                rMarkerLayer.removeMarker(rMarker);
            rMarker = new Tmap.Marker(location, icon);
            rMarkerLayer.addMarker(rMarker);
        }

    }
]);

