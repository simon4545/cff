/*!
 * artDialog 4.1.7
 * Date: 2013-03-03 08:04
 * http://code.google.com/p/artdialog/
 * (c) 2009-2012 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
;
(function (d, l, g) {
    d.noop = d.noop || function () {
    };
    var n, b, j, c, s = 0, t = d(l), h = d(document), f = d("html"), m = document.documentElement, a = l.VBArray && !l.XMLHttpRequest, p = "createTouch" in document && !("onmousemove" in m) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent), o = "artDialog" + +new Date;
    var k = function (e, v, y) {
        e = e || {};
        if (typeof e === "string" || e.nodeType === 1) {
            e = {content: e, fixed: !p}
        }
        var w, z = k.defaults, x = e.follow = this.nodeType === 1 && this || e.follow;
        for (var u in z) {
            if (e[u] === g) {
                e[u] = z[u]
            }
        }
        d.each({ok: "yesFn", cancel: "noFn", close: "closeFn", init: "initFn", okVal: "yesText", cancelVal: "noText"}, function (A, B) {
            e[A] = e[A] !== g ? e[A] : e[B]
        });
        if (typeof x === "string") {
            x = d(x)[0]
        }
        e.id = x && x[o + "follow"] || e.id || o + s;
        w = k.list[e.id];
        if (x && w) {
            return w.follow(x).zIndex().focus()
        }
        if (w) {
            return w.zIndex().focus()
        }
        if (p) {
            e.fixed = false
        }
        if (!d.isArray(e.button)) {
            e.button = e.button ? [e.button] : []
        }
        if (v !== g) {
            e.ok = v
        }
        if (y !== g) {
            e.cancel = y
        }
        e.ok && e.button.push({name: e.okVal, callback: e.ok, focus: true});
        e.cancel && e.button.push({name: e.cancelVal, callback: e.cancel});
        k.defaults.zIndex = e.zIndex;
        s++;
        return k.list[e.id] = n ? n._init(e) : new k.fn._init(e)
    };
    var q = k;
    k.fn = k.prototype = {version: "4.1.7", closed: true, _init: function (e) {
        var w = this, v, u = e.icon, x = u && (a ? {png: e.iconPath + "/icon/" + u + ".png"} : {backgroundImage: "url('" + e.iconPath + "/icon/" + u + ".png')"});
        w.closed = false;
        w.config = e;
        w.DOM = v = w.DOM || w._getDOM();
        v.wrap.addClass(e.skin);
        v.close[e.cancel === false ? "hide" : "show"]();
        v.icon[0].style.display = u ? "" : "none";
        v.iconBg.css(x || {background: "none"});
        v.se.css("cursor", e.resize ? "se-resize" : "auto");
        v.title.css("cursor", e.drag ? "move" : "auto");
        v.content.css("padding", e.padding);
        w[e.show ? "show" : "hide"](true);
        w.button(e.button).title(e.title).content(e.content, true).size(e.width, e.height).time(e.time);
        e.follow ? w.follow(e.follow) : w.position(e.left, e.top);
        w.zIndex().focus();
        e.lock && w.lock();
        w._addEvent();
        w._ie6PngFix();
        n = null;
        e.init && e.init.call(w, l);
        return w
    }, content: function (w) {
        var y, z, F, C, A = this, H = A.DOM, v = H.wrap[0], u = v.offsetWidth, G = v.offsetHeight, x = parseInt(v.style.left), D = parseInt(v.style.top), E = v.style.width, e = H.content, B = e[0];
        A._elemBack && A._elemBack();
        v.style.width = "auto";
        if (w === g) {
            return B
        }
        if (typeof w === "string") {
            e.html(w)
        } else {
            if (w && w.nodeType === 1) {
                C = w.style.display;
                y = w.previousSibling;
                z = w.nextSibling;
                F = w.parentNode;
                A._elemBack = function () {
                    if (y && y.parentNode) {
                        y.parentNode.insertBefore(w, y.nextSibling)
                    } else {
                        if (z && z.parentNode) {
                            z.parentNode.insertBefore(w, z)
                        } else {
                            if (F) {
                                F.appendChild(w)
                            }
                        }
                    }
                    w.style.display = C;
                    A._elemBack = null
                };
                e.html("");
                B.appendChild(w);
                w.style.display = "block"
            }
        }
        if (!arguments[1]) {
            if (A.config.follow) {
                A.follow(A.config.follow)
            } else {
                u = v.offsetWidth - u;
                G = v.offsetHeight - G;
                x = x - u / 2;
                D = D - G / 2;
                v.style.left = Math.max(x, 0) + "px";
                v.style.top = Math.max(D, 0) + "px"
            }
            if (E && E !== "auto") {
                v.style.width = v.offsetWidth + "px"
            }
            A._autoPositionType()
        }
        A._ie6SelectFix();
        A._runScript(B);
        return A
    }, title: function (x) {
        var v = this.DOM, u = v.wrap, w = v.title, e = "aui_state_noTitle";
        if (x === g) {
            return w[0]
        }
        if (x === false) {
            w.hide().html("");
            u.addClass(e)
        } else {
            w.show().html(x || "");
            u.removeClass(e)
        }
        return this
    }, position: function (A, G) {
        var F = this, y = F.config, v = F.DOM.wrap[0], B = a ? false : y.fixed, E = a && F.config.fixed, z = h.scrollLeft(), I = h.scrollTop(), D = B ? 0 : z, w = B ? 0 : I, C = t.width(), u = t.height(), x = v.offsetWidth, H = v.offsetHeight, e = v.style;
        if (A || A === 0) {
            F._left = A.toString().indexOf("%") !== -1 ? A : null;
            A = F._toNumber(A, C - x);
            if (typeof A === "number") {
                A = E ? (A += z) : A + D;
                e.left = Math.max(A, D) + "px"
            } else {
                if (typeof A === "string") {
                    e.left = A
                }
            }
        }
        if (G || G === 0) {
            F._top = G.toString().indexOf("%") !== -1 ? G : null;
            G = F._toNumber(G, u - H);
            if (typeof G === "number") {
                G = E ? (G += I) : G + w;
                e.top = Math.max(G, w) + "px"
            } else {
                if (typeof G === "string") {
                    e.top = G
                }
            }
        }
        if (A !== g && G !== g) {
            F._follow = null;
            F._autoPositionType()
        }
        return F
    }, size: function (w, D) {
        var B, C, e, F, z = this, x = z.config, E = z.DOM, v = E.wrap, y = E.main, A = v[0].style, u = y[0].style;
        if (w) {
            z._width = w.toString().indexOf("%") !== -1 ? w : null;
            B = t.width() - v[0].offsetWidth + y[0].offsetWidth;
            e = z._toNumber(w, B);
            w = e;
            if (typeof w === "number") {
                A.width = "auto";
                u.width = Math.max(z.config.minWidth, w) + "px";
                A.width = v[0].offsetWidth + "px"
            } else {
                if (typeof w === "string") {
                    u.width = w;
                    w === "auto" && v.css("width", "auto")
                }
            }
        }
        if (D) {
            z._height = D.toString().indexOf("%") !== -1 ? D : null;
            C = t.height() - v[0].offsetHeight + y[0].offsetHeight;
            F = z._toNumber(D, C);
            D = F;
            if (typeof D === "number") {
                u.height = Math.max(z.config.minHeight, D) + "px"
            } else {
                if (typeof D === "string") {
                    u.height = D
                }
            }
        }
        z._ie6SelectFix();
        return z
    }, follow: function (O) {
        var e, C = this, P = C.config;
        if (typeof O === "string" || O && O.nodeType === 1) {
            e = d(O);
            O = e[0]
        }
        if (!O || !O.offsetWidth && !O.offsetHeight) {
            return C.position(C._left, C._top)
        }
        var A = o + "follow", F = t.width(), v = t.height(), x = h.scrollLeft(), z = h.scrollTop(), y = e.offset(), K = O.offsetWidth, J = O.offsetHeight, B = a ? false : P.fixed, w = B ? y.left - x : y.left, H = B ? y.top - z : y.top, D = C.DOM.wrap[0], N = D.style, u = D.offsetWidth, M = D.offsetHeight, E = w - (u - K) / 2, I = H + J, L = B ? 0 : x, G = B ? 0 : z;
        E = E < L ? w : (E + u > F) && (w - u > L) ? w - u + K : E;
        I = (I + M > v + G) && (H - M > G) ? H - M : I;
        N.left = E + "px";
        N.top = I + "px";
        C._follow && C._follow.removeAttribute(A);
        C._follow = O;
        O[A] = P.id;
        C._autoPositionType();
        return C
    }, button: function () {
        var y = this, A = arguments, x = y.DOM, w = x.buttons, v = w[0], u = "aui_state_highlight", e = y._listeners = y._listeners || {}, z = d.isArray(A[0]) ? A[0] : [].slice.call(A);
        if (A[0] === g) {
            return v
        }
        d.each(z, function (D, F) {
            var B = F.name, E = !e[B], C = !E ? e[B].elem : document.createElement("button");
            if (F.href) {
                var C = !E ? e[B].elem : document.createElement("a");
                if (F.target) {
                    C.target = F.target
                }
                C.setAttribute("href", F.href)
            }
            if (!e[B]) {
                e[B] = {}
            }
            if (F.callback) {
                e[B].callback = F.callback
            }
            if (F.className) {
                C.className = F.className
            }
            if (F.focus) {
                y._focus && y._focus.removeClass(u);
                y._focus = d(C).addClass(u);
                y.focus()
            }
            C.setAttribute("type", "button");
            C[o + "callback"] = B;
            C.disabled = !!F.disabled;
            if (E) {
                C.innerHTML = B;
                e[B].elem = C;
                v.appendChild(C)
            }
        });
        w[0].style.display = z.length ? "" : "none";
        y._ie6SelectFix();
        return y
    }, show: function () {
        this.DOM.wrap.show();
        !arguments[0] && this._lockMaskWrap && this._lockMaskWrap.show();
        return this
    }, hide: function () {
        this.DOM.wrap.hide();
        !arguments[0] && this._lockMaskWrap && this._lockMaskWrap.hide();
        return this
    }, close: function () {
        if (this.closed) {
            return this
        }
        var y = this, x = y.DOM, w = x.wrap, z = k.list, v = y.config.close, e = y.config.follow;
        y.time();
        if (typeof v === "function" && v.call(y, l) === false) {
            return y
        }
        y.unlock();
        y._elemBack && y._elemBack();
        w[0].className = w[0].style.cssText = "";
        x.title.html("");
        x.content.html("");
        x.buttons.html("");
        if (k.focus === y) {
            k.focus = null
        }
        if (e) {
            e.removeAttribute(o + "follow")
        }
        delete z[y.config.id];
        y._removeEvent();
        y.hide(true)._setAbsolute();
        for (var u in y) {
            if (y.hasOwnProperty(u) && u !== "DOM") {
                delete y[u]
            }
        }
        n ? w.remove() : n = y;
        return y
    }, time: function (e) {
        var v = this, u = v.config.cancelVal, w = v._timer;
        w && clearTimeout(w);
        if (e) {
            v._timer = setTimeout(function () {
                v._click(u)
            }, 1000 * e)
        }
        return v
    }, focus: function () {
        try {
            if (this.config.focus) {
                var u = this._focus && this._focus[0] || this.DOM.close[0];
                u && u.focus()
            }
        } catch (v) {
        }
        return this
    }, zIndex: function () {
        var w = this, v = w.DOM, u = v.wrap, x = k.focus, e = k.defaults.zIndex++;
        u.css("zIndex", e);
        w._lockMask && w._lockMask.css("zIndex", e - 1);
        x && x.DOM.wrap.removeClass("aui_state_focus");
        k.focus = w;
        u.addClass("aui_state_focus");
        return w
    }, lock: function () {
        if (this._lock) {
            return this
        }
        var y = this, z = k.defaults.zIndex - 1, v = y.DOM.wrap, x = y.config, A = h.width(), D = h.height(), B = y._lockMaskWrap || d(document.body.appendChild(document.createElement("div"))), w = y._lockMask || d(B[0].appendChild(document.createElement("div"))), u = "(document).documentElement", e = p ? "width:" + A + "px;height:" + D + "px" : "width:100%;height:100%", C = a ? "position:absolute;left:expression(" + u + ".scrollLeft);top:expression(" + u + ".scrollTop);width:expression(" + u + ".clientWidth);height:expression(" + u + ".clientHeight)" : "";
        y.zIndex();
        v.addClass("aui_state_lock");
        B[0].style.cssText = e + ";position:fixed;z-index:" + z + ";top:0;left:0;overflow:hidden;" + C;
        w[0].style.cssText = "height:100%;background:" + x.background + ";filter:alpha(opacity=0);opacity:0";
        if (a) {
            w.html('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>')
        }
        w.stop();
        w.bind("click",function () {
            y._reset()
        }).bind("dblclick", function () {
            y._click(y.config.cancelVal)
        });
        if (x.duration === 0) {
            w.css({opacity: x.opacity})
        } else {
            w.animate({opacity: x.opacity}, x.duration)
        }
        y._lockMaskWrap = B;
        y._lockMask = w;
        y._lock = true;
        return y
    }, unlock: function () {
        var x = this, v = x._lockMaskWrap, e = x._lockMask;
        if (!x._lock) {
            return x
        }
        var w = v[0].style;
        var u = function () {
            if (a) {
                w.removeExpression("width");
                w.removeExpression("height");
                w.removeExpression("left");
                w.removeExpression("top")
            }
            w.cssText = "display:none";
            n && v.remove()
        };
        e.stop().unbind();
        x.DOM.wrap.removeClass("aui_state_lock");
        if (!x.config.duration) {
            u()
        } else {
            e.animate({opacity: 0}, x.config.duration, u)
        }
        x._lock = false;
        return x
    }, _getDOM: function () {
        var y = document.createElement("div"), e = document.body;
        y.style.cssText = "position:absolute;left:0;top:0";
        y.innerHTML = k._templates;
        e.insertBefore(y, e.firstChild);
        var v, x = 0, z = {wrap: d(y)}, w = y.getElementsByTagName("*"), u = w.length;
        for (; x < u; x++) {
            v = w[x].className.split("aui_")[1];
            if (v) {
                z[v] = d(w[x])
            }
        }
        return z
    }, _toNumber: function (e, v) {
        if (!e && e !== 0 || typeof e === "number") {
            return e
        }
        var u = e.length - 1;
        if (e.lastIndexOf("px") === u) {
            e = parseInt(e)
        } else {
            if (e.lastIndexOf("%") === u) {
                e = parseInt(v * e.split("%")[0] / 100)
            }
        }
        return e
    }, _ie6PngFix: a ? function () {
        var u = 0, w, z, v, e, y = k.defaults.iconPath + "/icon/", x = this.DOM.wrap[0].getElementsByTagName("*");
        for (; u < x.length; u++) {
            w = x[u];
            z = w.currentStyle.png;
            if (z) {
                v = z;
                e = w.runtimeStyle;
                e.backgroundImage = "none";
                e.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + v + "',sizingMethod='crop')"
            }
        }
    } : d.noop, _ie6SelectFix: a ? function () {
        var u = this.DOM.wrap, x = u[0], y = o + "iframeMask", w = u[y], v = x.offsetWidth, e = x.offsetHeight;
        v = v + "px";
        e = e + "px";
        if (w) {
            w.style.width = v;
            w.style.height = e
        } else {
            w = x.appendChild(document.createElement("iframe"));
            u[y] = w;
            w.src = "about:blank";
            w.style.cssText = "position:absolute;z-index:-1;left:0;top:0;filter:alpha(opacity=0);width:" + v + ";height:" + e
        }
    } : d.noop, _runScript: function (y) {
        var e, w = 0, z = 0, v = y.getElementsByTagName("script"), x = v.length, u = [];
        for (; w < x; w++) {
            if (v[w].type === "text/dialog") {
                u[z] = v[w].innerHTML;
                z++
            }
        }
        if (u.length) {
            u = u.join("");
            e = new Function(u);
            e.call(this)
        }
    }, _autoPositionType: function () {
        this[this.config.fixed ? "_setFixed" : "_setAbsolute"]()
    }, _setFixed: (function () {
        a && d(function () {
            var e = "backgroundAttachment";
            if (f.css(e) !== "fixed" && d("body").css(e) !== "fixed") {
                f.css({zoom: 1, backgroundImage: "url(about:blank)", backgroundAttachment: "fixed"})
            }
        });
        return function () {
            var w = this.DOM.wrap, x = w[0].style;
            if (a) {
                var z = parseInt(w.css("left")), y = parseInt(w.css("top")), v = h.scrollLeft(), u = h.scrollTop(), e = "(document.documentElement)";
                this._setAbsolute();
                x.setExpression("left", "eval(" + e + ".scrollLeft + " + (z - v) + ') + "px"');
                x.setExpression("top", "eval(" + e + ".scrollTop + " + (y - u) + ') + "px"')
            } else {
                x.position = "fixed"
            }
        }
    }()), _setAbsolute: function () {
        var e = this.DOM.wrap[0].style;
        if (a) {
            e.removeExpression("left");
            e.removeExpression("top")
        }
        e.position = "absolute"
    }, _click: function (e) {
        var v = this, u = v._listeners[e] && v._listeners[e].callback;
        return typeof u !== "function" || u.call(v, l) !== false ? v.close() : v
    }, _reset: function (z) {
        var y, x = this, e = x._winSize || t.width() * t.height(), w = x._follow, u = x._width, B = x._height, v = x._left, A = x._top;
        if (z) {
            y = x._winSize = t.width() * t.height();
            if (e === y) {
                return
            }
        }
        if (u || B) {
            x.size(u, B)
        }
        if (w) {
            x.follow(w)
        } else {
            if (v || A) {
                x.position(v, A)
            }
        }
    }, _addEvent: function () {
        var e, x = this, u = x.config, v = "CollectGarbage" in l, w = x.DOM;
        x._winResize = function () {
            e && clearTimeout(e);
            e = setTimeout(function () {
                x._reset(v)
            }, 40)
        };
        t.bind("resize", x._winResize);
        w.wrap.bind("click",function (z) {
            var A = z.target, y;
            if (A.disabled) {
                return false
            }
            if (A === w.close[0]) {
                x._click(u.cancelVal);
                return false
            } else {
                y = A[o + "callback"];
                y && x._click(y)
            }
            x._ie6SelectFix()
        }).bind("mousedown", function () {
            x.zIndex()
        })
    }, _removeEvent: function () {
        var u = this, e = u.DOM;
        e.wrap.unbind();
        t.unbind("resize", u._winResize)
    }};
    k.fn._init.prototype = k.fn;
    d.fn.dialog = d.fn.artDialog = function () {
        var e = arguments;
        this[this.live ? "live" : "bind"]("click", function () {
            k.apply(this, e);
            return false
        });
        return this
    };
    k.focus = null;
    k.get = function (e) {
        return e === g ? k.list : k.list[e]
    };
    k.list = {};
    h.bind("keydown", function (v) {
        var x = v.target, y = x.nodeName, e = /^INPUT|TEXTAREA$/, u = k.focus, w = v.keyCode;
        if (!u || !u.config.esc || e.test(y)) {
            return
        }
        w === 27 && u._click(u.config.cancelVal)
    });
    c = l._artDialog_path || (function (e, u, v) {
        for (u in e) {
            if (e[u].src && e[u].src.indexOf("artDialog") !== -1) {
                v = e[u]
            }
        }
        b = v || e[e.length - 1];
        v = b.src.replace(/\\/g, "/");
        return v.lastIndexOf("/") < 0 ? "." : v.substring(0, v.lastIndexOf("/"))
    }(document.getElementsByTagName("script")));
    j = b.src.split("skin=")[1];
    if (j) {
        var i = document.createElement("link");
        i.rel = "stylesheet";
        i.href = c + "/skins/" + j + ".css?" + k.fn.version;
        b.parentNode.insertBefore(i, b)
    }
    t.bind("load", function () {
        setTimeout(function () {
            if (s) {
                return
            }
            k({left: "-9999em", time: 9, fixed: false, lock: false, focus: false})
        }, 150)
    });
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch (r) {
    }
    k._templates = '<div class="aui_outer"><table class="aui_border"><tbody><tr><td class="aui_nw"></td><td class="aui_n"></td><td class="aui_ne"></td></tr><tr><td class="aui_w"></td><td class="aui_c"><div class="aui_inner"><table class="aui_dialog"><tbody><tr><td colspan="2" class="aui_header"><div class="aui_titleBar"><div class="aui_title"></div><a class="aui_close" href="javascript:void(0);">\xd7</a></div></td></tr><tr><td class="aui_icon"><div class="aui_iconBg"></div></td><td class="aui_main"><div class="aui_content"></div></td></tr><tr><td colspan="2" class="aui_footer"><div class="aui_buttons"></div></td></tr></tbody></table></div></td><td class="aui_e"></td></tr><tr><td class="aui_sw"></td><td class="aui_s"></td><td class="aui_se"></td></tr></tbody></table></div>';
    k.defaults = {content: '<div class="aui_loading"><span>loading..</span></div>', title: "\u7CFB\u7EDF\u63D0\u793A", button: null, ok: true, cancel: null, init: null, close: null, okVal: "\u786E\u5B9A", cancelVal: "\u53D6\u6D88", width: 420, height: "auto", minWidth: null, minHeight: null, padding: "20px", skin: "", icon: "warning", time: null, esc: true, focus: true, show: true, follow: null, path: c, iconPath: d("#base-url-con").html() + "application/views/static/image/tizi_dialog", lock: true, background: "#000", opacity: 0.4, duration: 300, fixed: true, left: "50%", top: "38.2%", zIndex: 1000, resize: false, drag: true};
    l.artDialog = d.dialog = d.artDialog = d.tiziDialog = k
}(this.art || this.jQuery && (this.art = jQuery), this));
(function (e) {
    var h, b, a = e(window), d = e(document), i = document.documentElement, f = !("minWidth" in i.style), g = "onlosecapture" in i, c = "setCapture" in i;
    artDialog.dragEvent = function () {
        var k = this, j = function (l) {
            var m = k[l];
            k[l] = function () {
                return m.apply(k, arguments)
            }
        };
        j("start");
        j("move");
        j("end")
    };
    artDialog.dragEvent.prototype = {onstart: e.noop, start: function (j) {
        d.bind("mousemove", this.move).bind("mouseup", this.end);
        this._sClientX = j.clientX;
        this._sClientY = j.clientY;
        this.onstart(j.clientX, j.clientY);
        return false
    }, onmove: e.noop, move: function (j) {
        this._mClientX = j.clientX;
        this._mClientY = j.clientY;
        this.onmove(j.clientX - this._sClientX, j.clientY - this._sClientY);
        return false
    }, onend: e.noop, end: function (j) {
        d.unbind("mousemove", this.move).unbind("mouseup", this.end);
        this.onend(j.clientX, j.clientY);
        return false
    }};
    b = function (j) {
        var n, o, u, l, q, s, p = artDialog.focus, v = p.DOM, k = v.wrap, r = v.title, m = v.main;
        var t = "getSelection" in window ? function () {
            window.getSelection().removeAllRanges()
        } : function () {
            try {
                document.selection.empty()
            } catch (w) {
            }
        };
        h.onstart = function (w, z) {
            if (s) {
                o = m[0].offsetWidth;
                u = m[0].offsetHeight
            } else {
                l = k[0].offsetLeft;
                q = k[0].offsetTop
            }
            d.bind("dblclick", h.end);
            !f && g ? r.bind("losecapture", h.end) : a.bind("blur", h.end);
            c && r[0].setCapture();
            k.addClass("aui_state_drag");
            p.focus()
        };
        h.onmove = function (z, F) {
            if (s) {
                var C = k[0].style, B = m[0].style, A = z + o, w = F + u;
                C.width = "auto";
                B.width = Math.max(0, A) + "px";
                C.width = k[0].offsetWidth + "px";
                B.height = Math.max(0, w) + "px"
            } else {
                var B = k[0].style, E = Math.max(n.minX, Math.min(n.maxX, z + l)), D = Math.max(n.minY, Math.min(n.maxY, F + q));
                B.left = E + "px";
                B.top = D + "px"
            }
            t();
            p._ie6SelectFix()
        };
        h.onend = function (w, z) {
            d.unbind("dblclick", h.end);
            !f && g ? r.unbind("losecapture", h.end) : a.unbind("blur", h.end);
            c && r[0].releaseCapture();
            f && !p.closed && p._autoPositionType();
            k.removeClass("aui_state_drag")
        };
        s = j.target === v.se[0] ? true : false;
        n = (function () {
            var x, w, z = p.DOM.wrap[0], C = z.style.position === "fixed", B = z.offsetWidth, F = z.offsetHeight, D = a.width(), y = a.height(), E = C ? 0 : d.scrollLeft(), A = C ? 0 : d.scrollTop(), x = D - B + E;
            w = y - F + A;
            return{minX: E, minY: A, maxX: x, maxY: w}
        })();
        h.start(j)
    };
    d.bind("mousedown", function (m) {
        var k = artDialog.focus;
        if (!k) {
            return
        }
        var n = m.target, j = k.config, l = k.DOM;
        if (j.drag !== false && n === l.title[0] || j.resize !== false && n === l.se[0]) {
            h = h || new artDialog.dragEvent();
            b(m);
            return false
        }
    })
})(this.art || this.jQuery && (this.art = jQuery));