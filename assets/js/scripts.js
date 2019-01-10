/* get device */
function getOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        return 'iOS'
    } else if (userAgent.match(/Android/i)) {
        return 'Android'
    } else {
        return 'unknown'
    }
}
/* retrive youtube video */
(function ($) {
    $.fn.setupYoutube = function () {
        iframe = document.createElement("iframe");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("width", this.attr("data-width"));
        iframe.setAttribute("height", this.attr("data-height"));
        iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.attr("data-embed") + "?rel=0&autoplay=1&playsinline=1&enablejsapi=1");
        this.prepend(iframe);
        var videoRatio = (iframe.height / iframe.width) * 100;
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.right = '0';
        iframe.width = '100%';
        iframe.height = '100%';
        var wrap = document.createElement('div');
        wrap.className = 'fluid-vid';
        wrap.style.width = '100%';
        wrap.style.position = 'relative';
        wrap.style.paddingTop = videoRatio + '%';
        var iframeParent = iframe.parentNode;
        iframeParent.insertBefore(wrap, iframe);
        wrap.appendChild(iframe)
    }
})(jQuery);




$(function () {
    ////////////////////////////// lazy load youtube video + thumbnail option
    $(".youtube").each(function () {
        $(this).append('<img alt="youtube thumbnail" class="thumbnail" src="https://img.youtube.com/vi/' + $(this).data('embed') + '/maxresdefault.jpg">');
        $(this).on("click", function () {
            $(this).find(".thumbnail").remove();
            for (var i = 0; i < $('iframe').length; i++) {
                $('iframe')[i].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
            }
            $(this).addClass("active").setupYoutube();
        });
    });
    ////////////////////////////// data-vimeo video
    var video_container = $("[data-vimeo]");
    video_container.each(function () {
        if ($(window).width() > 900) {
            $(this).find(".thumbnail").remove();
            $(this).find("[data-embed]").prepend('<video autoplay="true" muted="muted" loop="true" src="https://player.vimeo.com/external/' + $(this).data('vimeo') + '&profile_id=174"></video>');
				}
			if ($(window).width() <= 900) {
				$(this).find(".play").appendTo("[data-vimeo] [data-embed]");
			}
        $(this).on("click", ".play", function () {
            var video_parent = $(this).parents("[data-vimeo]");
            video_parent.addClass("playing").find("[data-embed]").append('<a class="close"><i class="icon-plus"></i> Close Video</a>').setupYoutube();
            video_parent.find(".play, video, .thumbnail").hide();
            $('html, body').animate({
                scrollTop: video_parent.find("[data-embed]").offset().top - $("header").outerHeight()
            }, 1000);
            for (var i = 0; i < $('iframe').length; i++) {
                $('iframe')[i].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
            }
            return false;
        });
        $(this).on("click", ".close", function () {
            var video_parent = $(this).parents("[data-vimeo]");
            video_parent.removeClass("playing").find(".fluid-vid, iframe, .close").remove();
            video_parent.find(".play, video, .thumbnail").show();
            $('html, body').animate({
                scrollTop: video_parent.offset().top - $("header").outerHeight()
            }, 1000);
            return false;
        });
    });
	
});