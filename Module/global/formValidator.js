$.fn.loginValidator = function (f) {
    var e = $(this);
    var d = this.get(0);
    var c = $(f.alertElement);
    var b = d.type;
    if (f.alertWidth) {
        c.width(f.alertWidth)
    }
    if (f.hideAction) {
        e.bind(f.hideAction, function () {
            c.hide();
            c.find(f.errContainer).empty()
        })
    } else {
        e.parents("form").find("input,textarea,select").focus(function () {
            c.hide();
            c.find(f.errContainer).empty()
        })
    }
    var a = function (h) {
        if (f.errContainer) {
            c.find(f.errContainer).text(h)
        } else {
            c.text(h)
        }
        c.show()
    };
    if (f.normalAlert) {
        c.addClass(f.normalAlert)
    }
    if (f.defaultError) {
        if (b === "checkbox" || b === "radio") {
            if (!e.is(":checked")) {
                a(f.defaultError);
                return false
            }
        } else {
            if (e.val() === "" || e.val() === e.attr("placeholder")) {
                a(f.defaultError);
                return false
            }
        }
    }
    if (f.selectCheck) {
        if (e.val() === f.selectCheck.val) {
            a(f.selectCheck.err);
            return false
        }
    }
    if (f.mobile) {
        if (!(/^1(3|4|5|8)\d{9}$/.exec(e.val()))) {
            a(f.mobile);
            return false
        }
    }
    if (f.min) {
        if (e.val().length < f.min.len) {
            a(f.min.err);
            return false
        }
    }
    if (f.max) {
        if (e.val().length > f.max.len) {
            a(f.max.err);
            return false
        }
    }
    if (f.number) {
        if (!(/^[0-9]*$/.exec(e.val()))) {
            a(f.number);
            return false
        }
    }
    if (f.email) {
        var g = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9_]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (e.val() != "") {
            if (!g.test(e.val())) {
                a(f.email);
                return false
            }
        }
    }
    if (f.equal) {
        if (e.val() !== $(f.equal.element).val()) {
            a(f.equal.err);
            return false
        }
    }
    if (f.unequal) {
        if (e.val() == f.unequal.element) {
            a(f.unequal.err);
            return false
        }
    }
    if (f.success) {
        f.success()
    }
};