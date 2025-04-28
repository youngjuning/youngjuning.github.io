function handleScroll() {
    var imgs = document.querySelectorAll('.img-load')
    if (imgs.length > 0) {
        let scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
        for (var i = 0; i < imgs.length; i++) {
            if ((window.innerHeight + scrolltop) > lazyload(imgs[i])) {
                (i => {
                    setTimeout(() => {
                        var temp = new Image()
                        temp.src = imgs[i].getAttribute("data-src")
                        temp.onload = () => {
                            imgs[i].src = imgs[i].getAttribute("data-src")
                            imgs[i].classList.remove('img-load')
                        }
                    }, 100)
                })(i)
            }
        }
    }
}

function lazyload(e) {
    if (e != undefined) {
        return e.getBoundingClientRect().top
    }
}

function debounce(fn, delay) {
    let timer = null
    return function () {
        let that = this
        let args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(that, args)
            clearTimeout(timer)
            timer = null
        }, delay)
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
