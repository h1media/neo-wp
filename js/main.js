(function ($) {

    "use strict";

    var quite = {};

    /**
     *
     */

    quite.removePreloader = function () {
        var $preloader = $(".body-preloader"),
            $inner = $preloader.find(".loadingspin")
            ;

        $inner.remove();
        $preloader.addClass("animated fadeOut").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            $preloader.remove();
        });
    };

    quite.mobileCheck = function () {
        var ua = navigator.userAgent.toLowerCase();

        this.android = ua.indexOf("android") > -1;
        this.iPhone = navigator.userAgent.match(/iPhone/i);
        this.iPad = navigator.userAgent.match(/iPad/i);
        this.mobile = this.android || this.iPhone || this.iPad;

        this.ie = $("html").hasClass("ie");

        if (!this.mobile) {
            $("body").addClass("desktop");
            $("html").addClass("desktop");
        }
        else {
            $("body").addClass("mobile");
            $("html").addClass("mobile");
        }
    };


    /**
     * Google map section
     */

    window.initMap = function () {

        var _this = quite,
            $contactsPopup = $("#contacts-popup"),
            $cf7 = $("#contact-form-wrap"),
            $map = $("#map_canvas"),
            $markerButton = $(".marker-button"),
            $marker = $(".map-marker"),
            $popupClose = $(".close-popup")
            ;

        $popupClose.on("click", function () {
            $contactsPopup.removeClass("fadeIn").addClass("fadeOut").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $contactsPopup.removeClass("on");
            });
        });

        var mapOptions = {
            zoom: Number($map.attr("data-zoom")) || 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            draggable: !_this.mobile
        };

        var image = templateDirectory + '/img/marker.png',
            tmpImage = new Image(),
            imageHeight = 62;

        tmpImage.src = image;
        $(tmpImage).load(function () {
            console.log($(tmpImage));
            imageHeight = $(tmpImage).prop("naturalHeight");
        });

        var latlng = new google.maps.LatLng($map.attr("data-lat"), $map.attr("data-lng"));

        mapOptions.center = latlng;

        var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var marker = new google.maps.Marker({
            map: map,
            draggable: false,
            position: latlng,
            icon: image
        });

        var overlay = new google.maps.OverlayView();
        overlay.draw = function () {
        };
        overlay.setMap(map);

        $markerButton.on('click', function () {
            $contactsPopup.removeClass("fadeOut").addClass("animated fadeIn on");
        });

        var markerHeight = $marker.outerHeight(true);

        function setMarker() {
            var proj = overlay.getProjection(),
                pos = marker.getPosition(),
                p = proj.fromLatLngToContainerPixel(pos);
            $marker.css({top: p.y - markerHeight - imageHeight - 10 + "px", left: p.x + 10 + "px"});
        }

        $(window).on("debouncedresize", function () {
            google.maps.event.trigger(map, 'resize');
            setTimeout(function () {
                map.panTo(latlng);
                setMarker();
            }, 300);
        });

        google.maps.event.addListener(map, 'center_changed', function () {
            setMarker();
        });

        google.maps.event.addListener(map, 'zoom_changed', function () {
            setMarker();
        });

        google.maps.event.trigger(map, 'resize');

        var onLoadInterval = setInterval(function () {
            if (overlay && overlay.getProjection() && marker) {
                clearInterval(onLoadInterval);
                map.panTo(latlng);
                google.maps.event.trigger(map, 'center_changed');
                setMarker();
            }
        }, 10);
    };

    quite.initSectionGMap = function () {
        var el = $('#map_canvas'),
            $contactsPopup = $("#contacts-popup"),
            $wrap = $(".gmap-wrap"),
            $header = $("#page-header"),
            $footer = $("#page-footer"),
            _this = this;

        if (el.length == 0) return;

        //$("html").css({"overflow": "hidden"});

        function resizeMap() {
            var $adminbar = $("#wpadminbar"),
                offset = $adminbar.length ? $adminbar.height() : 0
                ;

            if ($(window).width() < 768) {
                offset += $header.outerHeight() + $footer.outerHeight();
            }

            $wrap.width($(window).width()).height($(window).height() - offset);
            $contactsPopup.width($(window).width()).height($(window).height() - offset);
        }

        $(window).on("debouncedresize", resizeMap);
        resizeMap();

        /**
         * Asynchronous gmap
         * @type {HTMLElement}
         */

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
        'callback=initMap';
        document.body.appendChild(script);
    };

    /**
     *
     */

    quite.backToTop = function () {
        var backToTop = $("#back-top");
        backToTop.hide();

        if (this.mobile) return;

        $(window).scroll(function () {
            if ($(window).scrollTop() > 100) {
                backToTop.fadeIn();
            } else {
                backToTop.fadeOut();
            }
        });

        $('#back-top a').on("click", function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    };

    quite.detectMac = function () {
        this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    };

    quite.menuToggle = function () {

        var $toggle = $("#main-menu-toggle"),
            menu = $("#main-menu"),
            $menuWrap = $("#menu-wrap"),
            $topParents = menu.find(".menu > li.menu-item-has-children"),
            $offset = 30,
            menuHeight = $menuWrap.height() - $offset - this.adminbarHeight
            ;

        $toggle.on("click", function () {
            if ($(this).hasClass("on")) {
                $topParents.filter(".mouse-over").trigger("click");
                $menuWrap.css({"margin-top": -menuHeight + "px"});
                $(this).find("i").removeClass("icon-arrow-up");
                $(this).find("i").addClass("icon-arrow-down");
                $menuWrap.css({"background": "transparent"});
                $menuWrap.removeClass("visible-menu").addClass("closed-menu");
            }
            else {
                $menuWrap.css({"background": ""});
                $menuWrap.css({"margin-top": ""});
                $(this).find("i").removeClass("icon-arrow-down");
                $(this).find("i").addClass("icon-arrow-up");
                $menuWrap.addClass("visible-menu").removeClass("closed-menu");
            }
            $(this).toggleClass("on");
            menu.toggleClass("on");
        });

        //setTimeout(function () {
            //$toggle.trigger("click");
        //}, 1000);
    };

    quite.initGalleryWooCart = function () {
        $(".add-to-cart-gallery").on("click", function (event) {
            event.preventDefault();
            var $wrap = $(this).parents(".info-block"),
                quantity = $wrap.find("input.quantity").val(),
                product = $wrap.find("input.product_id").val(),
                $variationWrap = $wrap.find(".product-variations"),
                $variation = $variationWrap.find('input[type="radio"]:checked'),
                variation = $variationWrap.length ? $variation.val() : '',
                $messageWindow = $wrap.find(".message-window"),
                messageSuccess = '<i></i><span>Successfully added to <a target="_blank" href="' + window.cartUrl + '">cart</a>!</span>',
                messageError = '<i></i><span>Couldn\'t add to cart.</span>',
                ajaxData = {
                    action: "gallery_add_to_cart",
                    product_id: product,
                    variation_id: variation,
                    variation_html: $variation.attr("data-html"),
                    variation_attributes: $variation.attr("data-attributes"),
                    quantity: quantity
                }
                ;

            $messageWindow.html('');
            $messageWindow.removeClass("success").removeClass("error").removeClass("loading");
            $messageWindow.addClass("loading");
            setTimeout(function () { // wait for animation end
                $messageWindow.html('<div class="loadingspin"></div>');
            }, 300);

            $.ajax({
                type: "POST",
                url: adminAjax,
                data: ajaxData,
                dataType: 'json',
                success: function (response) {
                    $messageWindow.html('');
                    $messageWindow.removeClass("loading");

                    if (response.result) {
                        $messageWindow.html('');
                        $messageWindow.addClass("success");
                        $messageWindow.html(messageSuccess);
                    }
                    else {
                        $messageWindow.html('');
                        $messageWindow.addClass("error");
                        $messageWindow.html(messageError);
                    }
                },
                error: function (response) {
                    console.log("Shop connection error");
                }
            });
        });
    };

    quite.lavaMenu = function () {
        var $menu = $("#menu-wrap").find("ul.menu"),
            $items = $menu.find(">li"),
            dummy = function () {
            }
            ;

        if ($menu.length == 0) {
            return;
        }

        var $lava = $('<span class="lava-menu-box"></span>'),
            curr = $items.eq(0).get(0);

        $menu.append($lava);

        setCurr(curr);

        function move(el) {
            $lava.dequeue();
            $lava.animate({
                width: el.offsetWidth,
                left: el.offsetLeft
            }, 300, "linear");
        };

        function setCurr(el) {
            $lava.css({"left": el.offsetLeft + "px", "width": el.offsetWidth + "px"});
            curr = el;
        };

        $items.each(function () {
            var el = this;
            $(this).hover(function () {
                move(el);
            }, dummy);
        });
    };

    quite.lavaThumbs = function () {
        var $wrap = $("#frame-thumbs"),
            $items = $wrap.find(".photo-thumb"),
            dummy = function () {
            }
            ;

        if ($wrap.length == 0) {
            return;
        }

        var $lava = $('<span class="lava-menu-box"></span>'),
            curr = $items.eq(0).get(0);

        $wrap.append($lava);

        setCurr(curr);

        function move(el) {
            $lava.dequeue();
            $lava.animate({
                width: el.offsetWidth,
                left: el.offsetLeft
            }, 300, "linear");
        };

        function setCurr(el) {
            $lava.css({"left": el.offsetLeft + "px", "width": el.offsetWidth + "px"});
            curr = el;
        };

        $items.each(function () {
            var el = this;
            $(this).hover(function () {
                move(el);
            }, dummy);
        });
    };

    /**
     * Stripes
     */

    quite.maybeInitStripes = function () {
        var $galleryList = $("#gallery-list-scroll-horizontal");

        if ($galleryList.length == 0) return;

        var $window = $(window),

            $listItems = $galleryList.find(".horizontal-list-item"),
            itemWidth = $listItems.eq(0).width(),
            responsiveMode = false,
            stackedMode = false,
            animating = false
            ;

        function resizeList() {
            var $offset = $("#wpadminbar").height();

            $listItems.css({
                "transition-duration": "0s",
                "-webkit-transition-duration": "0s",
                "-moz-transition-duration": "0s"
            });

            if ($(window).width() < 768) { // fullwidth stacked
                responsiveMode = true;
                stackedMode = true;
                itemWidth = $(window).width();
                $listItems.css({"width": $(window).width() + "px"});
            }
            else {
                responsiveMode = false;
                stackedMode = false;
                itemWidth = $listItems.eq(0).width();
                $listItems.css({"width": ""});
            }
            $listItems.css({
                "transition-duration": "",
                "-webkit-transition-duration": "",
                "-moz-transition-duration": ""
            });
            if (!stackedMode) {
                $listItems.css({"height": ""});
                $galleryList.width($listItems.length * itemWidth).height($window.height() - $offset);
                $galleryList.css({"overflow": "hidden"});
            }
            else { // stacked mode
                $listItems.css({"height": "300px"});
                $galleryList.width($(window).width());
                $galleryList.css({height: "auto", "overflow-x": "none", "overflow-y": "auto"});
            }
            $galleryList.css({"margin-left": ""});
        }

        function scrollLeft() {
            var $left = Math.abs(Number($galleryList.css("margin-left").replace("px", "")))
                ;
            if ($left - itemWidth <= 0) {
                $galleryList.css({"margin-left": ""});
            }
            else {
                $galleryList.css({"margin-left": -1 * Number($left - itemWidth) + "px"});
            }
            $(document).trigger("mousemove");
        }

        function scrollRight() {
            var $left = Math.abs(Number($galleryList.css("margin-left").replace("px", "")))
                ;

            if ($galleryList.width() < itemWidth + $left + $window.width()) {
                $galleryList.css({"margin-left": -1 * Number($galleryList.width() - $window.width()) + "px"});
            }
            else {
                $galleryList.css({"margin-left": -1 * Number($left + itemWidth) + "px"});
            }
            $(document).trigger("mousemove");
        }

        $window.on("mousewheel", function (event) {
            if (stackedMode) {
                return true;
            }
            if (event.deltaY == 1) { // left
                scrollLeft();
            }
            else if (event.deltaY == -1) { // right
                scrollRight();
            }
            animating = true;
            setTimeout(function () {
                animating = false;
            }, 500);
        });

        $(window).swipe({
            swipeLeft: function (event, direction, distance, duration, fingerCount) {
                scrollLeft();
            },
            swipeRight: function (event, direction, distance, duration, fingerCount) {
                scrollRight();
            }
        });

        resizeList();

        $("#scroll-left").on("click", function () {
            scrollLeft();
        });

        $("#scroll-right").on("click", function () {
            scrollRight();
        });

        $window.on("debouncedresize", resizeList);
    };

    /**
     * Stripes fixed
     */

    quite.maybeInitStripesFixed = function () {

        var $galleryList = $("#gallery-list-horizontal");

        if ($galleryList.length == 0) return;

        var $window = $(window),
            $offset = $("#wpadminbar").height(),
            $listItems = $galleryList.find(".horizontal-list-item"),
            itemWidth,
            accentedWidth,
            secondaryWidth
            ;

        $listItems.each(function () {
            var $this = $(this);
            if ($this.attr("data-width") && $this.attr("data-height")) {
                $this.data("ratio", $this.attr("data-width") / $this.attr("data-height"));
            }
            else {
                $this.data("ratio", 16 / 9);
            }
        });

        function doTheMath() {
            itemWidth = $window.width() / $listItems.length;
            accentedWidth = ( $window.width() / $listItems.length ) * 2;
            secondaryWidth = ($window.width() - accentedWidth) / ( $listItems.length - 1);
        }

        doTheMath();

        function resetWidth() {
            $("body").css({overflow: "hidden"});
            doTheMath();
            $listItems.css({width: itemWidth + "px", height: "100%"});
        }

        function resetWidthResponsive() {
            var ww = $(window).width();
            $("body").css({overflow: "auto"});
            doTheMath();
            $galleryList.width($window.width());
            $listItems.each(function () {
                var $item = $(this);
                $item.css({width: "100%", height: ww / $item.data("ratio") + "px"});
            });
        }

        function resizeList() {
            var itemWidth = $window.width() / $listItems.length;

            $galleryList.width($window.width() * 2); // this is to fix mozilla bug

            if (itemWidth > 256) {
                resetWidth();
                $galleryList.height($window.height() - $offset);
            }
            else {
                resetWidthResponsive();
                $galleryList.css({height: "auto"});
            }
        }

        resizeList();
        $window.on("debouncedresize", resizeList);

        $listItems.hover(function () {
            if (itemWidth > 256) {
                $listItems.css('width', secondaryWidth + 'px');
                $(this).css('width', accentedWidth + 'px');
            }
        }, function () {
            if (itemWidth > 256) {
                $listItems.css('width', itemWidth + 'px');
            }
        });

    };

    quite.initFSSlider = function () {
        var $fullSlider = $("#fullscreen-slider"),
            $layer = $fullSlider.find(".ls-container");

        if (!$fullSlider.length) return;

        $layer.css({"max-width": "100%important", "max-height": "100%!important"});

        function fitSlider() {
            var $adminBar = $("#wpadminbar"),
                offset = $adminBar.length ? $adminBar.height() : 0
                ;
            $fullSlider.width($(window).width()).height($(window).height() - offset);
        }

        fitSlider();
        $(window).on("resize", fitSlider);
    };

    quite.initThemeKenburns = function () {

        if (!($('#kb-container').length)) {
            return;
        }

        function initKenburns() {
            var $kenburns = $("#kenburns"),
                $canvas = $kenburns.find("canvas"),
                $window = $(window),
                $adminbar = $("#wpadminbar"),
                $footer = $("#page-footer"),
                $header = $("#page-header"),
                $offset = $adminbar.length ? $adminbar.height() : 0,
                displayTime = Number($kenburns.attr("data-speed"));

            try {
                var kb_images = JSON.parse($kenburns.attr("data-images"));
                if ($window.width() < 768) {
                    $canvas.attr('width', $(window).width());
                    $canvas.attr('height', $(window).height() - $header.outerHeight() - $offset + 10);
                }
                else {
                    $canvas.attr('width', $(window).width());
                    $canvas.attr('height', $(window).height() - $offset);
                }

                var kb = $('#kb-container');

                kb.kenburns({
                    images: kb_images,
                    display_time: displayTime,
                    fade_time: 1000,
                    background_color: "#000000",
                    zoom: 1.2
                });
            } catch (e) {
                console.log(e);
            }
        }

        initKenburns();
        $(window).on("debouncedresize", function () {
            $('#kb-container').remove();
            $('#kenburns').append('<canvas id="kb-container"></canvas>');
            initKenburns();
        });
    };

    quite.fixWrapperMinHeight = function () {

        var $footer = $("#page-footer"),
            $adminbar = $("#wpadminbar"),
            adminbarHeight = $adminbar.length ? $adminbar.height() : 0,
            $wrapper = $("#main-wrapper")
            ;

        function fixHeight() {
            $wrapper.css({
                "min-height": $(window).height() - $footer.outerHeight() - adminbarHeight
            });
        }

        if ($('body').hasClass('not-fullscreen')) {
            fixHeight();
            $(window).on("debouncedresize", fixHeight);
        }
    };

    /**
     * New menu levels
     */

    quite.topMenuColumnLevels = function () {

        var mobileMenu = false,
            $window = $(window),
            _this = this,
            $mainWrapper = $("#main-wrapper"),
            $menuWrap = $("#menu-wrap"),
            $header = $("#page-header"),
            header_click = false,
            $topLevelParents = $menuWrap.find(".menu > .menu-item-has-children");

        var $parents = $menuWrap.find(".menu > li.menu-item-has-children"),
            $allParents = $menuWrap.find("li.menu-item-has-children");

        function animateMenuIn(){

        }

        $topLevelParents.each(function(){
            var $item = $(this),
                $child = $item.find(">ul");

            function menuOpen(){
                var $fader = $("<div id=\"bg-fader\"></div>"),
                    $drop = $("<div id=\"menu-dropdown-bg\"></div>");

                $topLevelParents.filter(".mouse-over").each(function(){
                    if($(this) != $item){
                        $(this).trigger("closeitem");
                    }
                });

                if($item.hasClass("columns-block")){
                    $mainWrapper.append($fader);
                    $drop.height($menuWrap.outerHeight() + $child.outerHeight());
                    $mainWrapper.append($drop);
                }
                $child.css("opacity", "0");
                $item.addClass("mouse-over");
                setTimeout(function(){
                    $fader.addClass("shown");
                }, 10);
                $child.animate({
                    "opacity": 1
                }, 200, "linear", function(){

                });
            }

            function menuClose(){
                $mainWrapper.find("#bg-fader").remove();
                $mainWrapper.find("#menu-dropdown-bg").remove();
                $item.removeClass("mouse-over");
            }

            if(window.themeOptions.menuOpenClick == "1"){
                $item.on("click", function(){
                    if($item.hasClass("mouse-over")){
                        menuClose();
                    }
                    else{
                        menuOpen();
                    }
                    return false;
                });
            }
            else{
                $item.hoverIntent(function () {
                        menuOpen();
                    },
                    function () {
                        menuClose()
                    });
            }
            $item.on("closeitem", menuClose);

        });

        function fixLastItems(){
            var $almostLast = $topLevelParents.eq($topLevelParents.length - 2),
                $menu = $menuWrap.find(".menu"),
                $child = $almostLast.find(">ul"),
                childWidth = $child.outerWidth(),
                allowedWidth = $menu.outerWidth() - ( $almostLast.prop("offsetLeft") - $menu.prop("offsetLeft"));

            if(childWidth > allowedWidth){
                $child.addClass("open-left");
            }
        }
        fixLastItems();

        function fixLastItems2(){
            var $almostLast = $topLevelParents.eq($topLevelParents.length - 3),
                $menu = $menuWrap.find(".menu"),
                $child = $almostLast.find(">ul"),
                childWidth = $child.outerWidth(),
                allowedWidth = $menu.outerWidth() - ( $almostLast.prop("offsetLeft") - $menu.prop("offsetLeft"));

            if(childWidth > allowedWidth){
                $child.addClass("open-left");
            }
        }
        fixLastItems2();

        if (header_click) {
            $topLevelParents.on("click", function () {
                if ($(this).hasClass("menu-level-open")) {
                    $topLevelParents.removeClass("menu-level-open");
                }
                else {
                    $topLevelParents.removeClass("menu-level-open");
                    $(this).addClass("menu-level-open");
                }
                return false;
            })
        }

        $("li.columns-block > ul > li > a").on("click", function () {
            if($(window).width() > 767){
                return false;
            }
            else{
                return true;
            }
        });

        $window.on("debouncedresize", function () {
            mobileMenu = !($window.width() > 767);
            setTimeout(function () {
                resetMenuHovers();
            }, 1000);
        });

        mobileMenu = !($window.width() > 767);

        function resetMenuHovers() {

            var headerLeftPadding = Number($header.css("padding-left").replace("px", ""));

            /** clear all hovrIntents */
            $allParents.each(function () {
                var $li = $(this);

                //$li.unbind("mouseenter").unbind("mouseleave");
                //
                //if ($li.prop('hoverIntent_t')) {
                //    clearTimeout($li.prop('hoverIntent_t'));
                //}
                //$li.removeProp('hoverIntent_t');
                //$li.removeProp('hoverIntent_s');

                $li.find(">ul.js-managed").css({
                    "overflow": "",
                    "position": "",
                    "display": "",
                    "opacity": "",
                    "height": "",
                    "max-width": "none"
                }).removeClass("js-managed hov-int");

                $menuWrap.find(".menu > li > ul").css({transform: "none"});
                $menuWrap.find(".menu > li.columns-block > ul").css({position: "absolute"});
            });

            setTimeout(function () {
                /* normal */

                if (!mobileMenu) {
                    $parents.each(function () {
                        var $columnBlock = $(this),
                            holderWidth,
                            $columnBlockUl,
                            parentOffset = $(this).prop("offsetLeft"),
                            menuWrapOffset = $("#menu-wrap").prop("offsetLeft"),
                            blockWidth,
                            offset,
                            $li = $(this).find("li.menu-item-has-children li.menu-item-has-children");

                        if (!$(this).hasClass("columns-block")) {
                            $li = $(this).find("li.menu-item-has-children");
                        }
                        else {
                            /** columns block */

                            $columnBlockUl = $columnBlock.find(">ul");
                            $columnBlockUl.css({
                                width: "",
                                "white-space": "nowrap"
                            });

                            setTimeout(function () {
                                if($columnBlockUl.hasClass("open-left")){
                                    return;
                                }

                                holderWidth = $columnBlock.outerWidth();

                                blockWidth = $columnBlockUl.outerWidth();
                                offset = blockWidth / 2 - holderWidth / 2;

                                if (offset > ( parentOffset + menuWrapOffset + headerLeftPadding ) + holderWidth / 2) {
                                    offset = parentOffset + menuWrapOffset + headerLeftPadding;
                                    $columnBlockUl.css({
                                        "transform": "translateX(-" + offset + "px)"
                                    });

                                    if (blockWidth > $(window).width()) {
                                        $columnBlockUl.css({
                                            width: $(window).width(),
                                            "white-space": "normal"
                                        });
                                    }
                                    else {
                                        $columnBlockUl.css({
                                            width: "",
                                            "white-space": "nowrap"
                                        })
                                    }
                                }
                                else if (offset > ( parentOffset + menuWrapOffset + headerLeftPadding ) + holderWidth / 2) {

                                }
                                else {
                                    $columnBlockUl.css({
                                        "transform": "translateX(-" + offset + "px)"
                                    });
                                }
                            }, 100);
                        }

                        $li.each(function () {
                            var $thisLi = $(this),
                                $ul = $thisLi.find(">.sub-menu");

                            $thisLi.addClass("hov-int");
                            $ul.addClass("js-managed");

                            // init
                            $ul.css({
                                "overflow": "hidden",
                                "position": "absolute",
                                "display": "block",
                                "opacity": 0,
                                "height": "auto"
                            });

                            if (header_click) {
                                $thisLi.on("click", function () {
                                    var $item = $(this);

                                    if (mobileMenu) {
                                        return false;
                                    }

                                    var ulHeight;

                                    if (!$item.hasClass("menu-level-open")) {
                                        $item.addClass("menu-level-open");

                                        $ul.css({
                                            "position": "absolute",
                                            "display": "block",
                                            "opacity": 0,
                                            "height": "auto",
                                            "max-width": 0
                                        });

                                        ulHeight = $ul.height();

                                        $ul.animate({
                                            "max-width": '500px'
                                        }, 150, function () {
                                            $ul.css({
                                                "position": "relative",
                                                "height": 0,
                                                "opacity": 1
                                            });
                                            $ul.animate({
                                                "height": ulHeight + 'px'
                                            }, 250, function () {
                                                $ul.css("height", "auto");
                                            });
                                        });
                                    }
                                    else {
                                        $item.removeClass("menu-level-open");
                                        $ul.animate({
                                            "height": "0"
                                        }, 250, function () {
                                            $ul.animate({
                                                "max-width": '0'
                                            }, 150, function () {
                                                $ul.css("display", "none");
                                            });
                                        });
                                    }
                                    return false;
                                });
                            }
                            else {
                                //$thisLi.find(">a").hoverIntent({
                                //    over: function () {
                                //
                                //        if (mobileMenu) {
                                //            return false;
                                //        }
                                //
                                //        var ulHeight;
                                //
                                //        $thisLi.addClass("mouse-over");
                                //
                                //        $ul.css({
                                //            "position": "absolute",
                                //            "display": "block",
                                //            "opacity": 0,
                                //            "height": "auto",
                                //            "max-width": 0
                                //        });
                                //
                                //        ulHeight = $ul.height();
                                //
                                //        $ul.animate({
                                //            "max-width": '500px'
                                //        }, 150, function () {
                                //            $ul.css({
                                //                "position": "relative",
                                //                "height": 0,
                                //                "opacity": 1
                                //            });
                                //            $ul.animate({
                                //                "height": ulHeight + 'px'
                                //            }, 250, function () {
                                //                $ul.css("height", "auto");
                                //            });
                                //        });
                                //    },
                                //    out: function () {
                                //
                                //        if (mobileMenu) {
                                //            return false;
                                //        }
                                //
                                //        $thisLi.removeClass("mouse-over");
                                //
                                //        $ul.animate({
                                //            "height": "0"
                                //        }, 250, function () {
                                //            $ul.animate({
                                //                "max-width": '0'
                                //            }, 150, function () {
                                //                $ul.css("display", "none");
                                //            });
                                //        });
                                //    },
                                //    sensitivity: 3,
                                //    timeout: 1000
                                //});
                            }
                        });
                    });
                }
                else if (mobileMenu) {
                    /** mobile */

                    $allParents.each(function () {
                        var $li = $(this);

                        $li.each(function () {
                            var $thisLi = $(this),
                                $ul = $thisLi.find(">.sub-menu");

                            $thisLi.addClass("js-managed");
                            $ul.addClass("js-managed");

                            // init
                            if (mobileMenu) {
                                $ul.css({
                                    "overflow": "hidden",
                                    "position": "absolute",
                                    "display": "block",
                                    "opacity": 0,
                                    "height": "auto",
                                    "transform": "none"
                                });
                            }

                            //$thisLi.hoverIntent(function () {
                            //
                            //        if (!mobileMenu) {
                            //            return false;
                            //        }
                            //
                            //        var ulHeight;
                            //
                            //        $thisLi.addClass("mouse-over");
                            //
                            //        $ul.css({
                            //            "position": "absolute",
                            //            "display": "block",
                            //            "opacity": 0,
                            //            "height": "auto",
                            //            "max-width": 0
                            //        });
                            //
                            //        ulHeight = $ul.height();
                            //
                            //        $ul.animate({
                            //            "max-width": '500px'
                            //        }, 250, function () {
                            //            $ul.css({
                            //                "position": "relative",
                            //                "height": 0,
                            //                "opacity": 1
                            //            });
                            //            $ul.animate({
                            //                "height": ulHeight + 'px'
                            //            }, 350, function () {
                            //                $ul.css("height", "auto");
                            //            });
                            //        });
                            //    },
                            //    function () {
                            //
                            //        if (!mobileMenu) {
                            //            return false;
                            //        }
                            //
                            //        $thisLi.removeClass("mouse-over");
                            //
                            //        $ul.animate({
                            //            "height": "0"
                            //        }, 350, function () {
                            //            $ul.animate({
                            //                "max-width": '0'
                            //            }, 250, function () {
                            //                $ul.css("display", "none");
                            //            });
                            //        });
                            //    }, {
                            //        sensitivity: 3
                            //    })
                        });
                    });
                } // endif
            }, 50);

        } // resetMenuHovers
        resetMenuHovers();
    };

    /**
     * Init
     */

    $(document).ready(function () {

        var $adminbar = $("#wpadminbar"),
            adminbarHeight = $adminbar.length ? $adminbar.height() : 0,
            $wrapper = $("#main-wrapper")
            ;

        quite.adminbarHeight = adminbarHeight;

        function resizeWindow() {
            $("#main-wrapper").height($(window).height() - adminbarHeight);
        }

        var $passwordWindow = $(".password-window");
        if ($passwordWindow.length) {
            resizeWindow();
            $(window).on("debouncedresize", resizeWindow);
        }

        $('#mainmenu').slicknav({
            label: '',
            duration: 1000,
            easingOpen: "easeOutBounce", //available with jQuery UI
            prependTo: '#page-header'
        });

        quite.fixWrapperMinHeight();
        quite.initSectionGMap();
        quite.backToTop();
        quite.mobileCheck();
        quite.detectMac();
        quite.initGalleryWooCart();
        quite.maybeInitStripesFixed();
        quite.maybeInitStripes();
        quite.initFSSlider();
        quite.initThemeKenburns();
        quite.topMenuColumnLevels();

        $("article.format-video").fitVids();

        quite.lavaMenu();
        quite.lavaThumbs();

        var $prettyImages = $("article a.prettyphoto");
        $prettyImages.each(function () {
            $(this).attr("rel", $(this).attr("data-rel"));
        });
        $prettyImages.prettyPhoto({default_width: 1920, default_height: 1080});

        /**
         * Info buttons
         * @type {*|HTMLElement}
         */

        $.fn.infoButtons = function () {
            var $container = $(this),
                $infoButtonsWrap = $container.find(".info-buttons-wrap"),
                $infoButtonsBG = $infoButtonsWrap.find(".info-button-bg")
                ;

            function hideAll() {
                $infoButtonsBG.removeClass("on");
            }

            if ($infoButtonsWrap.length) {
                var $infoTitles = $infoButtonsWrap.find(".info-title"),
                    $infoLabels = $infoButtonsWrap.find(".info-label")
                    ;
                $infoLabels.on("click", function () {
                    var $wrap = $(this).parents(".info-button-bg");
                    if ($wrap.hasClass("on")) {
                        $infoButtonsBG.removeClass("on");
                    }
                    else {
                        $infoButtonsBG.removeClass("on");
                        $wrap.addClass("on");
                    }
                    return false;
                });

                $(window).on("hideinfo", hideAll);
            }
        };

        $("body").infoButtons();

        var touch = $('#touch-menu');
        var menu = $('.menu');


        setTimeout(function () {
            quite.removePreloader();
        }, 1000);

        quite.menuToggle();
        $("#social-icons a").tooltip();

        if ($(window).width() <= 1024) {
            setTimeout(function () {
                $(window).trigger("resize");
            }, 500);
        }
    });

})(jQuery);


