var jaaulde = window.jaaulde || {};
jaaulde.utils = jaaulde.utils || {};
jaaulde.utils.cookies = (function () {
    var e, d, c, b, a = {expiresAt: null, path: "/", domain: null, secure: false};
    e = function (g) {
        var h, f;
        if (typeof g !== "object" || g === null) {
            h = a
        } else {
            h = {expiresAt: a.expiresAt, path: a.path, domain: a.domain, secure: a.secure};
            if (typeof g.expiresAt === "object" && g.expiresAt instanceof Date) {
                h.expiresAt = g.expiresAt
            } else {
                if (typeof g.hoursToLive === "number" && g.hoursToLive !== 0) {
                    f = new Date();
                    f.setTime(f.getTime() + (g.hoursToLive * 60 * 60 * 1000));
                    h.expiresAt = f
                }
            }
            if (typeof g.path === "string" && g.path !== "") {
                h.path = g.path
            }
            if (typeof g.domain === "string" && g.domain !== "") {
                h.domain = g.domain
            }
            if (g.secure === true) {
                h.secure = g.secure
            }
        }
        return h
    };
    d = function (f) {
        f = e(f);
        return((typeof f.expiresAt === "object" && f.expiresAt instanceof Date ? "; expires=" + f.expiresAt.toGMTString() : "") + "; path=" + f.path + (typeof f.domain === "string" ? "; domain=" + f.domain : "") + (f.secure === true ? "; secure" : ""))
    };
    c = function () {
        var o = {}, h, g, f, n, k = document.cookie.split(";"), j;
        for (h = 0; h < k.length; h = h + 1) {
            g = k[h].split("=");
            f = g[0].replace(/^\s*/, "").replace(/\s*$/, "");
            try {
                n = decodeURIComponent(g[1])
            } catch (m) {
                n = g[1]
            }
            if (typeof JSON === "object" && JSON !== null && typeof JSON.parse === "function") {
                try {
                    j = n;
                    n = JSON.parse(n)
                } catch (l) {
                    n = j
                }
            }
            o[f] = n
        }
        return o
    };
    b = function () {
    };
    b.prototype.get = function (i) {
        var f, h, g = c();
        if (typeof i === "string") {
            f = (typeof g[i] !== "undefined") ? g[i] : null
        } else {
            if (typeof i === "object" && i !== null) {
                f = {};
                for (h in i) {
                    if (typeof g[i[h]] !== "undefined") {
                        f[i[h]] = g[i[h]]
                    } else {
                        f[i[h]] = null
                    }
                }
            } else {
                f = g
            }
        }
        return f
    };
    b.prototype.filter = function (f) {
        var i, g = {}, h = c();
        if (typeof f === "string") {
            f = new RegExp(f)
        }
        for (i in h) {
            if (i.match(f)) {
                g[i] = h[i]
            }
        }
        return g
    };
    b.prototype.set = function (i, g, f) {
        if (typeof f !== "object" || f === null) {
            f = {}
        }
        if (typeof g === "undefined" || g === null) {
            g = "";
            f.hoursToLive = -8760
        } else {
            if (typeof g !== "string") {
                if (typeof JSON === "object" && JSON !== null && typeof JSON.stringify === "function") {
                    g = JSON.stringify(g)
                } else {
                    throw new Error("cookies.set() received non-string value and could not serialize.")
                }
            }
        }
        var h = d(f);
        document.cookie = i + "=" + encodeURIComponent(g) + h
    };
    b.prototype.del = function (i, h) {
        var f = {}, g;
        if (typeof h !== "object" || h === null) {
            h = {}
        }
        if (typeof i === "boolean" && i === true) {
            f = this.get()
        } else {
            if (typeof i === "string") {
                f[i] = true
            }
        }
        for (g in f) {
            if (typeof g === "string" && g !== "") {
                this.set(g, null, h)
            }
        }
    };
    b.prototype.test = function () {
        var g = false, f = "cT", h = "data";
        this.set(f, h);
        if (this.get(f) === h) {
            this.del(f);
            g = true
        }
        return g
    };
    b.prototype.setOptions = function (f) {
        if (typeof f !== "object") {
            f = null
        }
        a = e(f)
    };
    return new b()
})();
(function () {
    if (window.jQuery) {
        (function (b) {
            b.cookies = jaaulde.utils.cookies;
            var a = {cookify: function (c) {
                return this.each(function () {
                    var e, g = ["name", "id"], d, h = b(this), f;
                    for (e in g) {
                        if (!isNaN(e)) {
                            d = h.attr(g[e]);
                            if (typeof d === "string" && d !== "") {
                                if (h.is(":checkbox, :radio")) {
                                    if (h.attr("checked")) {
                                        f = h.val()
                                    }
                                } else {
                                    if (h.is(":input")) {
                                        f = h.val()
                                    } else {
                                        f = h.html()
                                    }
                                }
                                if (typeof f !== "string" || f === "") {
                                    f = null
                                }
                                b.cookies.set(d, f, c);
                                break
                            }
                        }
                    }
                })
            }, cookieFill: function () {
                return this.each(function () {
                    var h, c, f = ["name", "id"], d, g = b(this), e;
                    c = function () {
                        h = f.pop();
                        return !!h
                    };
                    while (c()) {
                        d = g.attr(h);
                        if (typeof d === "string" && d !== "") {
                            e = b.cookies.get(d);
                            if (e !== null) {
                                if (g.is(":checkbox, :radio")) {
                                    if (g.val() === e) {
                                        g.attr("checked", "checked")
                                    } else {
                                        g.removeAttr("checked")
                                    }
                                } else {
                                    if (g.is(":input")) {
                                        g.val(e)
                                    } else {
                                        g.html(e)
                                    }
                                }
                            }
                            break
                        }
                    }
                })
            }, cookieBind: function (c) {
                return this.each(function () {
                    var d = b(this);
                    d.cookieFill().change(function () {
                        d.cookify(c)
                    })
                })
            }};
            b.each(a, function (c) {
                b.fn[c] = this
            })
        })(window.jQuery)
    }
})();