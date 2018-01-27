function toggle_panel_visibility(a, b, c) {
    a.hasClass("speed-in") ? (a.removeClass("speed-in").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
        var a = parseInt($(".itemView").width());
        $('#menuClose').removeClass('showed');
        $('#menu').show();
        a > 0 ? c.addClass("overflow-hidden") : c.removeClass("overflow-hidden")
    }), b.removeClass("is-visible"), $.post("../php/main/partials/removeDiscout.inc.php")) : ($('#menu').hide(), a.addClass("speed-in").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
        c.addClass("overflow-hidden");

    }), $('#menuClose').addClass('showed'), b.addClass("is-visible"))
}

function move_navigation(a, b) {
    $(window).width() >= b ? (a.detach(), a.appendTo("header")) : (a.detach(), a.insertAfter("header"))
}
jQuery(document).ready(function(a) {
    var b = 1200,
        c = a("#main-nav"),
        d = a("#cd-cart-trigger"),
        e = a("#cd-hamburger-menu"),
        f = a("#cd-cart"),
        g = a("#cd-shadow-layer");
    e.on("click", function(b) {
        b.preventDefault(), f.removeClass("speed-in"), toggle_panel_visibility(c, g, a("body"))
    }), d.on("click", function(b) {
        b.preventDefault(), c.removeClass("speed-in"), toggle_panel_visibility(f, g, a("body")), $("body").css('overflow','hidden'), a(".itemsList").load("../php/main/partials/itemsList.inc.php")
    }), g.on("click", function() {
      $('.infoPopup').removeClass('showed');
      $("#cd-cart-trigger2").removeClass('reopened');
      $("#menubar").removeClass('opened');
      $('body').css('overflow-y', 'auto');
      $('#menu').show();
      $('#menuClose').removeClass('showed');
        g.removeClass("is-visible"), f.hasClass("speed-in") ? (f.removeClass("speed-in").on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
            var b = parseInt(a(".itemView").width());
            b > 0 ? a("body").addClass("overflow-hidden") : a("body").removeClass("overflow-hidden")
        }), c.removeClass("speed-in")) : (c.removeClass("speed-in").on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
            a("body").removeClass("overflow-hidden")
        }), f.removeClass("speed-in"))
    }), move_navigation(c, b), a(window).on("resize", function() {
        move_navigation(c, b), a(window).width() >= b && c.hasClass("speed-in") && (c.removeClass("speed-in"), g.removeClass("is-visible"), a("body").removeClass("overflow-hidden"))
    })
});
