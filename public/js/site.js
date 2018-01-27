'use strict';

function reloadIsotope() {
  $(".grid").imagesLoaded(function() {
    $(".gridLoader").stop().fadeOut(), $(".grid li").css("visibility", "visible"), $(".videoLinker").css("visibility", "visible");
  });
  $(".grid").isotope({
    layoutMode: "packery",
    percentPosition: !0
  })
}



function resizeSelect() {
  parseInt($("[name=firstName]").css("width")) - 3;
  if($(window).height() <= 800){
    $(".itemsList").css("max-height", parseInt($(window).height()) - 53);
  } else {
    $(".itemsList").css("max-height", parseInt($(window).height()) - 135);
  }
}

function validateEmail(a) {
  var b = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return b.test(a)
}

function makePayment() {
  $("#itemsContainer").hide(), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $("#shopList").stop().animate({
    width: "100%"
  }, 300, function() {
    $("#paymentContainer").show(), $("#openMenu").show(), resizeSelect()
  })
}

function redirect(a, b) {
  a = a.match(/^(?:http:\/\/|www)/) ? a : "http://" + a, 0 == b ? window.location.href = a : window.open(a, "_blank")
}

function loadItemslist(a) {
  $("#paymentContainer").hide();
  var b = $("#shopList").attr("class");
  a && "noclose" == a ? "opened" == b ? $(".itemsList").load("../php/main/partials/itemsList.inc.php") : ($("#cd-cart").addClass("speed-in"), $("body").addClass("overflow-hidden"), $("#cd-shadow-layer").addClass("is-visible"), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $("#cd-cart-trigger2").removeClass("opened"), $("#cd-cart-trigger2").addClass("reopened")) : "opened" == b ? ($("#itemsContainer").show(), $(".itemsList").hide(), $("#shopList").stop().animate({
    width: "0"
  }), $("#shopList").removeClass("opened"), Cookies.set("menuStatus", 0, {
    expires: 1
  })) : ($("#itemsContainer").show(), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $("#shopList").stop().animate({
    width: "300px"
  }, 300, function() {
    $(".itemsList").show()
  }), $("#shopList").addClass("opened"), Cookies.set("menuStatus", 1, {
    expires: 1
  }))
}

function addAmount(a) {
  var valueitem = $("#item"+a).find('.cd-qty').data('val');
  if(valueitem < 3){
    $.post("../php/main/partials/updateAmount.inc.php", "item=" + a.toString() + "&type=up", function(a) {
      var a = a.split("/");
      "added" == a[0] && (loadItems(), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $(".itemView").load("php/sklep/produkt.inc.php", {
        produkt: 3
      }), $(".itemView").load("php/sklep/produkt.inc.php", {
        produkt: 3
      }))
    })
  }
}

function removeAmount(a) {
  $.post("../php/main/partials/updateAmount.inc.php", "item=" + a.toString() + "&type=down", function(a) {
    var a = a.split("/");
    "removed" == a[0] && (loadItems(), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $(".itemView").load("php/sklep/produkt.inc.php", {
      produkt: 3
    }), $(".itemView").load("php/sklep/produkt.inc.php", {
      produkt: 3
    }))
  })
}

function loadItems() {
  $("#itemsContainer").load("../php/main/partials/items.inc.php"), $("#cd-cart-trigger2 span").load("../php/main/partials/loadCart.inc.php"), $("#cd-cart-trigger span").load("../php/main/partials/loadCart.inc.php")
}

function addCart(a) {
  $.post("../php/main/partials/addCart.inc.php", "item=" + a.toString(), function(a) {
    if(a === 'maxitems'){
      alert();
      $(".itemView").load("php/sklep/produkt.inc.php", {
        produkt: 3
      });
    }
    "added" == a ? (loadItems(), loadItemslist("noclose"), $('#menu').hide(), $('#menuClose').addClass('showed'), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $(".itemView").load("php/sklep/produkt.inc.php", {
      produkt: 3
    })) : "noitem" == a && $(".itemView").load("php/sklep/produkt.inc.php", {
      produkt: 3
    })
  })
}

function removeCart(a) {
  $(".removeCart").attr("disabled", !0), $.post("../php/main/partials/removeCart.inc.php", "item=" + a.toString(), function(a) {
    "removed" == a && (loadItems(), loadItemslist("noclose"), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $(".itemView").load("php/sklep/produkt.inc.php", {
      produkt: 3
    }))
  })
}

function removeCart2(a) {
  $(".listRemove").attr("disabled", !0), $.post("../php/main/partials/removeCart.inc.php", "item=" + a.toString(), function(b) {
    "removed" == b && ($("#paymentContainer").hide(), loadItems(), $(".cd-cart-items li[id=item" + a.toString() + "]").css("position", "relative"), $(".cd-cart-items li[id=item" + a.toString() + "]").stop().animate({
      right: "-1000px"
    }, 100, function() {
      $(".itemsList").load("../php/main/partials/itemsList.inc.php")
    }), window.location.href = "/sklep/spod-zamarznietych-powiek")
  })
}
$(window).resize(function() {
  resizeSelect(), reloadIsotope()
}), $(document).ready(function() {
  function a(a) {
    null === a && location.reload()
  }

  $('form#checkStatus').submit(function() {
    $('.formError').hide();
    $('#formErrorold').remove();
    var code = $('[name=ordercode]');
    code.removeClass('pleaseFill');
    var isNumber =  /^\d+$/.test(code.val());
    if(code.val().length == 0){
      code.addClass('pleaseFill');
      code.focus();
      $('.formError').fadeIn();
      return false;
    }
    if(!isNumber){
      code.addClass('pleaseFill');
      $('.formError').fadeIn();
      code.focus();
      return false;
    }
    $.post("../php/order/getStatus.inc.php", $("form#checkStatus").serialize(), function(data) {
      if(data === '0'){
        $('.formError').fadeIn();
        code.focus();
      } else if(data.indexOf("success") >= 0){
        var data = data.split("/");
        code.focus();
        var pageurl = location.protocol + '//' + location.host;
        window.location.href = pageurl+"/status/"+data[1];
      }
    })
    return false;
  });
  $('#clearBasket').click(function() {
    $.post("../php/main/partials/removeCart.inc.php", "item=0", function(result) {
    });
  });
  $(".sponsorgrid").mouseenter(function() {
    $(this).find(".sponsorname").addClass("showup");
  });
  $(".sponsorgrid").mouseleave(function() {
    $(this).find(".sponsorname").removeClass("showup");
  });
  $("#menu").click(function() {
    $('body').css('overflow-y', 'hidden');
    $("#menubar").addClass("opened");
    $("#cd-shadow-layer").addClass("is-visible");
    $("#cd-cart").removeClass("speed-in");
  });
  $(".menubarClose").click(function() {
    $("#menubar").removeClass("opened");
    $('body').css('overflow-y', 'auto');
    $("#cd-shadow-layer").removeClass("is-visible");
  });

  function k(a, b, c, d) {
    a.removeClass("selected from-left from-right").addClass("is-moving").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
      a.removeClass("is-moving")
    }), b.children("li").eq(d).addClass("selected from-right").prevAll().addClass("move-left"), q(a, b, d)
  }

  function l(a, b, c, d) {
    a.removeClass("selected from-left from-right").addClass("is-moving").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
      a.removeClass("is-moving")
    }), b.children("li").eq(d).addClass("selected from-left").removeClass("move-left").nextAll().removeClass("move-left"), q(a, b, d)
  }

  function m(a, c) {
    var d = a.find(".selected");
    d.removeClass("selected"), a.find("li").eq(c).addClass("selected"), $(".selectedBorder").hide(), $(".owl-wrapper").find(".owl-item").eq(c).find(".selectedBorder").show(), b.trigger("to.owl.carousel", [3, 0])
  }

  function n(a, b, c) {
    a.hasClass("autoplay") && (clearInterval(i), i = window.setInterval(function() {
      o(b)
    }, c))
  }

  function o(a) {
    h < a - 1 ? (k(c.find(".selected"), c, e, h + 1), h += 1) : (l(c.find(".selected"), c, e, 0), h = 0), r(f, h + 1), m(e, h)
  }

  function p(a) {
    a.find(".cd-bg-video-wrapper").each(function() {
      var a = $(this);
      if (a.is(":visible")) {
        var b = a.data("video"),
          c = $('<video loop><source src="' + b + '.mp4" type="video/mp4" /><source src="' + b + '.webm" type="video/webm" /></video>');
        c.appendTo(a), a.parent(".cd-bg-video.selected").length > 0 && c.get(0).play()
      }
    })
  }

  function q(a, b, c) {
    var d = a.find("video");
    d.length > 0 && d.get(0).pause();
    var e = b.children("li").eq(c).find("video");
    e.length > 0 && e.get(0).play()
  }

  function r(a, b) {
    a.removeClassPrefix("item").addClass("item-" + b)
  }
  loadItems(), resizeSelect(), reloadIsotope(), $(window).on("popstate", function(b) {
      a(b.originalEvent.state)
    }),
    function(b) {
      history.pushState = function(c) {
        return a(c), b.apply(this, arguments)
      }
    }(history.pushState), $("#grid li").click(function() {
      $("html, body").hide()
    }), $("#paymentMethod li").not(".disabled").click(function() {
      "choosedMethod" == $(this).attr("class") ? ($("#paymentMethod li").removeClass("choosedMethod"), $("[name=paymentType]").val("x")) : ($(this).addClass("choosedMethod"), $("[name=paymentType]").val($(this).index()))
    });
    $("#cd-cart-trigger2").click(function() {

      var a = $(this).attr("class");
      if ("opened" == a) $("#cd-cart").addClass("speed-in"), $('#menu').hide(), $('#menuClose').addClass('showed'), $("#cd-shadow-layer").addClass("is-visible"), $(".itemsList").load("../php/main/partials/itemsList.inc.php"), $(this).removeClass("opened"), $(this).addClass("reopened");
      else if ("reopened" == a) $("#cd-shadow-layer").removeClass("is-visible"), $("#cd-cart").removeClass("speed-in"), $(this).removeClass("reopened"), $('#menu').hide(), $('#menuClose').addClass('showed');
      else {

        var b = parseInt($(".itemView").width());
        b > 0 ? ($("#logo").hide(), $("#logoResponsive").show(), $("#cd-shadow-layer").addClass("is-visible"), $("#cd-cart").addClass("speed-in"), $('#menu').hide(), $('#menuClose').addClass('showed'), $(this).removeClass("opened"), $(this).addClass("reopened")) : (window.history.pushState("Sklep", "Spod zamarzniętych powiek", "/sklep/spod-zamarznietych-powiek"), $("#logo").hide(), $("html, body").css("overflow", "hidden"), $(".itemView").css("right", 0), $(".itemView").css("left", "auto"), $(".itemView").load("php/sklep/produkt.inc.php", {
          produkt: 3
        }), $(".itemView").stop().animate({
          width: "100%"
        }, 500), $(this).addClass("opened"), $("#backPage").show())
      }
    }), $(".goPrev").on("click", function() {
      var a = $(this).data("sliderid"),
        b = $(a);
      b.owlCarousel(), b.trigger("owl.prev")
    }), $(".goNext").on("click", function() {
      var a = $(this).data("sliderid"),
        b = $(a);
      b.owlCarousel(), b.trigger("owl.next")
    }), $("html").easeScroll({
      frameRate: 60,
      animationTime: 1e3,
      stepSize: 120,
      pulseAlgorithm: 1,
      pulseScale: 8,
      pulseNormalize: 1,
      accelerationDelta: 20,
      accelerationMax: 1,
      keyboardSupport: !0,
      arrowScroll: 50,
      touchpadSupport: !0,
      fixedBackground: !0
    });
  var b = $(".mainSlider");
  b.owlCarousel({
    slideSpeed: 500,
    navigation: !1,
    loop: !0,
    center: !0,
    mouseDrag: !1,
    responsiveClass: !0,
    autoplay: !1,
    responsive: {
      0: {
        items: 1,
        nav: !0
      },
      600: {
        items: 3,
        nav: !1
      },
      1e3: {
        items: 5,
        nav: !0,
        loop: !1
      }
    }
  }), $(".mainSlider").length > 0 && setInterval(function() {
    var a = $(".mainSlider").data("owlCarousel");
    a.updateVars()
  }, 1), $(".owl-wrapper").find(".owl-item").eq(0).find(".selectedBorder").show();
  var c = $(".cd-hero-slider");
  if (c.length > 0) {
    var i, d = $(".cd-primary-nav"),
      e = $(".owl-wrapper"),
      f = $(".cd-marker"),
      g = c.children("li").length,
      h = 0,
      j = 5e3;
    p(c), n(c, g, j), d.on("click", function(a) {
      $(a.target).is(".cd-primary-nav") && $(this).children("ul").toggleClass("is-visible")
    }), e.on("click", ".owl-item", function(a) {
      a.preventDefault();
      var b = $(this);
      if (!b.hasClass("selected")) {
        var d = b.index(),
          i = c.find("li.selected").index();
        i < d ? k(c.find(".selected"), c, e, d) : l(c.find(".selected"), c, e, d), h = d, m(e, d), r(f, d + 1), n(c, g, j)
      }
    })
  }
  $.fn.removeClassPrefix = function(a) {
    return this.each(function(b, c) {
      var d = c.className.split(" ").filter(function(b) {
        return 0 !== b.lastIndexOf(a, 0)
      });
      c.className = $.trim(d.join(" "))
    }), this
  }, $("[name=country]").change(function() {
    var a = $(this).val();
    $.post("../php/main/partials/shipmentInfo.inc.php", "country=" + a, function(a) {
      $(".shipmentContainer").html(a)
    })
  }), $("[name=checkRabat]").click(function() {
    var a = $("[name=rabat]").val();
    return a.length < 6 ? ($("[name=rabat]").focus(), !1) : void $.post("../php/main/partials/checkDiscount.inc.php", "code=" + a, function(b) {
      "wrngcode" != b ? ($("#discountResponse").html("Sukces, przydzielono rabat w wysokości -" + b + "%"), $("[name=checkRabat]").attr("disabled", !0), $("[name=discount]").val(a), $(".itemsList").load("../php/main/partials/itemsList.inc.php")) : $("[name=rabat]").focus()
    })
  }), $(".grid li").on({
    mouseenter: function() {
      $(this).find(".shadowGrid").stop().fadeIn()
    },
    mouseleave: function() {
      $(this).find(".shadowGrid").stop().fadeOut()
    }
  }), $("[name=samedata2]").iCheck("check"), $("[name=samedata]").iCheck("check"), $("[name=firstNameSend]").hide(), $("[name=lastNameSend]").hide(), $("[name=phoneSend]").hide(), $("[name=addressSend1]").hide(), $("[name=addressSend2]").hide(), $("[name=addressSend3]").hide(), $("[name=emailSend]").hide(), $("#shopContainer").click(function() {
    loadItemslist("")
  }), $(document).on("icheck", function() {
    $("input[type=checkbox], input[type=radio]").iCheck({
      checkboxClass: "icheckbox_flat-orange",
      radioClass: "iradio_flat-orange"
    })
  }).trigger("icheck"), $(".cancelPayment").click(function() {
    window.location.href = "/sklep/spod-zamarznietych-powiek"
  }), $("[name=invoice]").on("ifChecked", function(a) {
    $("#invoiceContainer").show()
  }), $("[name=invoice]").on("ifUnchecked", function(a) {
    $("#invoiceContainer").hide()
  }), $("[name=copydata]").on("ifChecked", function(a) {
    $("[name=firstNameInvoice]").val($("[name=firstName]").val()), $("[name=lastNameInvoice]").val($("[name=lastName]").val()), $("[name=addressInvoice1]").val($("[name=address1]").val()), $("[name=addressInvoice2]").val($("[name=address2]").val()), $("[name=addressInvoice3]").val($("[name=address3]").val())
  }), $("[name=copydata]").on("ifUnchecked", function(a) {
    $("[name=firstNameInvoice]").val(""), $("[name=lastNameInvoice]").val(""), $("[name=addressInvoice1]").val(""), $("[name=addressInvoice2]").val(""), $("[name=addressInvoice3]").val("")
  }), $("[name=samedata]").on("ifChecked", function(a) {
    $("[name=firstNameInvoice]").val(""), $("[name=firstNameInvoice]").hide(), $("[name=lastNameInvoice]").val(""), $("[name=lastNameInvoice]").hide(), $("[name=phoneInvoice]").val(""), $("[name=phoneInvoice]").hide(), $("[name=emailInvoice]").val(""), $("[name=emailInvoice]").hide(), $("[name=addressInvoice1]").val(""), $("[name=addressInvoice1]").hide(), $("[name=addressInvoice2]").val(""), $("[name=addressInvoice2]").hide(), $("[name=addressInvoice3]").val(""), $("[name=addressInvoice3]").hide(), $("#country2").hide()
  }), $("[name=samedata]").on("ifUnchecked", function(a) {
    $("[name=firstNameInvoice]").show(), $("[name=lastNameInvoice]").show(), $("[name=phoneInvoice]").show(), $("[name=emailInvoice]").show(), $("[name=addressInvoice1]").show(), $("[name=addressInvoice2]").show(), $("[name=addressInvoice3]").show(), $("#country2").show()
  }), $("[name=samedata2]").on("ifChecked", function(a) {
    $("[name=firstNameSend]").val(""), $("[name=firstNameSend]").hide(), $("[name=lastNameSend]").val(""), $("[name=lastNameSend]").hide(), $("[name=phoneSend]").val(""), $("[name=phoneSend]").hide(), $("[name=addressSend1]").val(""), $("[name=addressSend1]").hide(), $("[name=addressSend2]").val(""), $("[name=addressSend2]").hide(), $("[name=addressSend3]").val(""), $("[name=addressSend3]").hide(), $("[name=sendCountry]").val(""), $("[name=emailSend]").val(""), $("[name=emailSend]").hide()
  }), $("[name=samedata2]").on("ifUnchecked", function(a) {
    $("[name=firstNameSend]").show(), $("[name=lastNameSend]").show(), $("[name=phoneSend]").show(), $("[name=addressSend1]").show(), $("[name=addressSend2]").show(), $("[name=addressSend3]").show(), $("[name=emailSend]").show()
  }), $("#openMenu").click(function() {
    $("#paymentContainer").hide(), $("#shopList").css("width", "300px"), $(this).hide()
  });
  $('#menuClose').click(function() {
    $('#cd-cart').removeClass('speed-in');
    $("#menuClose").removeClass('showed');
    $('#cd-shadow-layer').removeClass('is-visible');
    $('#menu').show();
    $("#cd-cart-trigger2").removeClass('reopened');
    $("#menubar").removeClass('opened');
    $('.inpost-map').remove();
    $('.checkout-btn').attr('id', 'disabled');
    $('.paczkomat-select').show();
    if($('body').hasClass('overflow-hidden')){ } else { $('body').addClass('overflow-hidden'); }
  });
  var s = !1;
  $("form#payment").submit(function(a) {
    if (s) return !1;
    $("input[type=text]").removeClass("pleaseFill");
    var b = $("[name=firstName]"),
      c = $("[name=lastName]"),
      d = $("[name=firstNameInvoice]"),
      e = $("[name=lastNameInvoice]"),
      f = $("[name=email]"),
      g = $("[name=phone]"),
      h = $("[name=address1]"),
      i = $("[name=address2]"),
      j = $("[name=address3]"),
      k = $("[name=countryInvoice]"),
      l = $("[name=invoice]"),
      n = ($("[name=shipment]"), $("[name=paymentType]")),
      o = $("[name=accept]"),
      p = $("[name=company]"),
      q = $("[name=tin]"),
      r = $("[name=addressInvoice1]"),
      t = $("[name=addressInvoice2]"),
      u = $("[name=addressInvoice3]"),
      v = $("[name=country]");
    if ($("#shipmentError").hide(), $("#choosePainmentmethod").hide(), $("#chooseCountry").hide(), $("#chooseAccept").hide(), 0 == b.val().length || b.val().length < 2) return b.focus(), b.addClass("pleaseFill"), !1;
    if (0 == c.val().length || c.val().length < 2) return c.focus(), c.addClass("pleaseFill"), !1;
    if (0 == f.val().length || f.val().length < 5 || !validateEmail(f.val())) return f.focus(), f.addClass("pleaseFill"), !1;
    if (0 == g.val().length || g.val().length < 9) return g.focus(), g.addClass("pleaseFill"), !1;
    if (0 == h.val().length || h.val().length < 4) return h.focus(), h.addClass("pleaseFill"), !1;
    if (0 == i.val().length || i.val().length < 5) return i.focus(), i.addClass("pleaseFill"), !1;
    if (0 == j.val().length || j.val().length < 5) return j.focus(), j.addClass("pleaseFill"), !1;
    if ("" == v.val()) return $(".shipmentContainer").html("Proszę wybrać jedną opcję."), !1;
    if (l.iCheck("update")[0].checked) {
      if (p.val().length > 0) var w = !1;
      else {
        if (0 == d.val().length || d.val().length < 2) {
          d.focus(), d.addClass("pleaseFill");
          var w = !1;
          return !1
        }
        var w = !0;
        if (0 == e.val().length || e.val().length < 2) {
          e.focus(), e.addClass("pleaseFill");
          var w = !1;
          return !1
        }
        var w = !0
      }
      if (0 == w && (0 == p.val().length || p.val().length < 2)) return p.focus(), p.addClass("pleaseFill"), !1;
      if (0 == q.val().length || q.val().length < 2) return q.focus(), !1;
      if (0 == r.val().length || r.val().length < 4) return r.focus(), !1;
      if (0 == t.val().length || t.val().length < 5) return t.focus(), !1;
      if (0 == u.val().length || u.val().length < 5) return u.focus(), !1;
      if ("" == k.val()) return $("#chooseCountry").css("display", "block"), !1
    }
    return o.iCheck("update")[0].checked ? "x" == n.val() ? ($("#choosePainmentmethod").css("display", "block"), !1) : (s = !0, $.post("../php/main/partials/OrderCreate.php", $("form#payment").serialize(), function(a) {
      if ($("#shipmentError").hide(), $("#choosePainmentmethod").hide(), $("#chooseAccept").hide(), $("#chooseCountry").hide(), a.indexOf("nowarehouse") !== -1){
        $('.infoPopup').addClass('showed'), $('.infoPopup span').html('<h2>Brak produktu!</h2>Przepraszamy, aktualnie brak produktu w magazynie. Zapraszamy ponownie wkrótce.');
        $('#cd-shadow-layer2').addClass('is-visible');
      }
      else if (a.indexOf("success") !== -1) {
        var b = a.split("#");
        $.post("../php/main/partials/clearBasket.inc.php", function(a) {
          $("#cd-cart-trigger span").html(0), $("#paymentContainer").load("../php/order/thanks.inc.php", {
            order: b[1]
          })
        })
      }
    }), s = !1, !1) : ($("#chooseAccept").css("display", "block"), !1)
  })
});
