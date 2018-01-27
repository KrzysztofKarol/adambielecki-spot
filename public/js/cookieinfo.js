function WHCreateCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
}
function WHReadCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

window.onload = WHCheckCookies;

function WHCheckCookies() {
    if (WHReadCookie('cookies_accepted') != 'T') {
        var url = window.location.href;
        var message_container = document.createElement('div');
        message_container.id = 'cookies-message-container';
        if (url.indexOf("spot") >= 0) {
          var html_code = '<div id="cookies-info" class="righter">Strona korzysta z plików cookies w celu realizacji usług. Możesz określić warunki przechowywania lub dostępu do cookie w Twojej przeglądarce.<a class="closebtn" href="javascript:WHCloseCookiesWindow();" ><img alt="Zamknij" src="css/images/close-button-w.png"></a></div>';
        } else {
          var html_code = '<div id="cookies-info">Strona korzysta z plików cookies w celu realizacji usług. Możesz określić warunki przechowywania lub dostępu do cookie w Twojej przeglądarce.<a class="closebtn" href="javascript:WHCloseCookiesWindow();" ><img alt="Zamknij" src="css/images/close-button-w.png"></a></div>';
        }
        message_container.innerHTML = html_code;
        document.body.appendChild(message_container);
    }
}

function WHCloseCookiesWindow() {
    WHCreateCookie('cookies_accepted', 'T', 365);
    document.getElementById('cookies-message-container').removeChild(document.getElementById('cookies-info'));
}
