;!function(){
var Login = {};
var baseUrlName = $("#base-url-con").html();
var htmlResult = __template1__({});
$('body').append(htmlResult);
Login.regSelect = function() {
    var c = {
        notice_layer: $(".notice_layer")
    };
    $(".change-reg-tab").click(function() {
        this_a = $(this);
        $(".reg-content").css("min-height", "800px");
        $(".hidden-reg-div").slideUp("fast");
        $(".reg-select-con h1").css("color", "#298d6a");
        $(this).next().css("color", "#000");
        var d = $(this).next().next();
        if (d.is(":hidden")) {
            d.slideDown("fast");
            b(this_a);
            if ($("#reg-style-teacher-select input").length == 2) {
                $("#reg-style-teacher-select input").first().attr("checked", "checked").siblings().attr("checked");
                $("#teacher-email").show();
                $("#teacher-mobile").hide()
            }
            if ($("#reg-style-parent-select input").length == 2) {
                $("#reg-style-parent-select input").first().attr("checked", "checked").siblings().attr("checked");
                $("#parent-email").show();
                $("#parent-mobile").hide()
            }
        } else {
            d.slideUp("fast")
        }
        $(".change-reg-tab").removeClass("reg-teacher-reg-select");
        $(".change-reg-tab").removeClass("reg-student-reg-select");
        $(".change-reg-tab").removeClass("reg-parent-reg-select");
        switch ($(this).attr("class").substr(0, 5)) {
            case "reg-t":
                $(this).addClass("reg-teacher-reg-select");
                break;
            case "reg-s":
                $(this).addClass("reg-student-reg-select");
                break;
            case "reg-p":
                $(this).addClass("reg-parent-reg-select");
                break
        }
        $("#already-reg").hide()
    });
    $(".reg-style-teacher").click(function() {
        if ($(".reg-style-teacher:checked").val() == "mobile") {
            $("#teacher-mobile").show();
            $("#teacher-email").hide()
        } else {
            $("#teacher-mobile").hide();
            $("#teacher-email").show()
        }
    });
    c.notice_layer.each(function() {
        $(this).focus(function() {
            $(this).hide();
            $(this).prev().focus()
        })
    });
    c.notice_layer.prev().blur(function() {
        if ($(this).val() == "") {
            $(this).next().show()
        }
    });

    function b(e) {
        e = e.parent().find("#captcha");
        var d = baseUrlName + "captcha?ver=" + (new Date).valueOf();
        e.find("img").attr("src", d);
        e.find("img").attr("width", 111)
    }

    var a = $("#user_status").attr("df");
    if (a == "teacher") {
        $(".reg-teacher-reg").click()
    }
    if (a == "student") {
        $(".reg-student-reg").click()
    }
    $(".text-input").each(function() {
        $(this).focus(function() {
            $(this).next().hide()
        })
    })
};
Login.regSelectFormCheck = function() {
    $.Placeholder.init();
    var baseUrlName = $("#base-url-con").html();
    $("a.request-btn").click(function() {
        var _this = $(this);
        var now_sel_tab = _this.parent().parent().parent().parent();
        var regForm, mobile_alert_check;
        switch (now_sel_tab.attr("id").substr(now_sel_tab.attr("id").length - 4)) {
            case "-one":
                mobile_alert_check = "#mobile-alert-teacher-one";
                regForm = $("#register-form-teacher-one");
                break;
            case "aone":
                mobile_alert_check = "#mobile-alert-parent-one";
                regForm = $("#register-form-paone");
                break
        }
        var defaultText = "获取验证码";
        var waitText = "秒后重新发送";
        var countTime = null;
        var checkcodeInfo = now_sel_tab.find("#checkbtn-alert");
        var setCode = function() {
            var waittime = 90;
            var postUrl = baseUrlName + "send_phone_code";
            var postData = {
                phone: now_sel_tab.find("#username").val(),
                code_type: 1,
                ver: (new Date).valueOf()
            };
            clickeAble = false;
            $.post(postUrl, postData, function(data) {
                if (data.errorcode === false) {
                    now_sel_tab.find(mobile_alert_check).show();
                    now_sel_tab.find(mobile_alert_check).find(".info-box").text(data.error)
                } else {
                    checkcodeInfo.width(110).show();
                    _this.addClass("request-wait");
                    countTime = setInterval(function() {
                        if (waittime > 0) {
                            _this.text(waittime + waitText);
                            waittime--
                        } else {
                            clearInterval(countTime);
                            _this.text(defaultText);
                            _this.removeClass("request-wait");
                            checkcodeInfo.hide()
                        }
                    }, 1000)
                }
            }, "json")
        };
        regForm.find("input").click(function() {
            if (checkcodeInfo.is(":visible")) {
                checkcodeInfo.fadeOut()
            }
        });
        regForm.find("#username").loginValidator({
            defaultError: "请输入手机号码",
            alertElement: mobile_alert_check,
            errContainer: ".info-box",
            alertWidth: eval(parseInt(regForm.find(".form-line").css("width")) + 2),
            mobile: "手机号码不正确",
            success: function() {
                $("#teacher-mobile .validator-alert").eq(0).hide();
                if (_this.attr("class").indexOf("wait") < 0) {
                    setCode()
                }
            }
        })
    });
    $(".reg-form").find(".reg-submit-btn").click(function(event) {
        event.preventDefault();
        var this_a = $(this).parent().parent();
        var now_tab = this_a.attr("id");
        var first_input_alert = "";
        var password_alert = "";
        var confirm_password_contract = "";
        var confirm_password_alert = "";
        var checkcode_alert = "";
        var agreement_alert = "";
        var isStudent = false;
        var check_style = "";
        switch (now_tab.substr(now_tab.length - 4)) {
            case "-one":
                confirm_password_contract = "#password-teacher-one";
                first_input_alert = "#mobile-alert-teacher-one";
                password_alert = "#password-alert-teacher-one";
                confirm_password_alert = "#confirm-password-alert-teacher-one";
                checkcode_alert = "#checkcode-alert-teacher-one";
                agreement_alert = "#agreement-alert-teacher-one";
                regForm = $("#register-form-teacher-one");
                isStudent = false;
                check_style = "mobile";
                break;
            case "-two":
                confirm_password_contract = "#password-teacher-two";
                first_input_alert = "#mobile-alert-teacher-two";
                password_alert = "#password-alert-teacher-two";
                confirm_password_alert = "#confirm-password-alert-teacher-two";
                checkcode_alert = "#checkcode-alert-teacher-two";
                agreement_alert = "#agreement-alert-teacher-two";
                regForm = $("#register-form-teacher-two");
                isStudent = false;
                check_style = "email";
                break;
            case "dent":
                confirm_password_contract = "#password-student";
                first_input_alert = "#mobile-alert-student";
                password_alert = "#password-alert-student";
                confirm_password_alert = "#confirm-password-alert-student";
                checkcode_alert = "#checkcode-alert-student";
                agreement_alert = "#agreement-alert-student";
                regForm = $("#register-form-student");
                isStudent = true;
                break;
            case "aone":
                confirm_password_contract = "#password-parent-one";
                first_input_alert = "#mobile-alert-parent-one";
                password_alert = "#password-alert-parent-one";
                confirm_password_alert = "#confirm-password-alert-parent-one";
                checkcode_alert = "#checkcode-alert-parent-one";
                agreement_alert = "#agreement-alert-parent-one";
                regForm = $("#register-form-paone");
                isStudent = false;
                check_style = "mobile";
                break;
            case "atwo":
                confirm_password_contract = "#password-parent-two";
                first_input_alert = "#mobile-alert-parent-two";
                password_alert = "#password-alert-parent-two";
                confirm_password_alert = "#confirm-password-alert-parent-two";
                checkcode_alert = "#checkcode-alert-parent-two";
                agreement_alert = "#agreement-alert-parent-two";
                regForm = $("#register-form-patwo");
                isStudent = false;
                check_style = "email";
                break
        }
        if (!isStudent) {
            if (check_style == "mobile") {
                this_a.find("#username").loginValidator({
                    defaultError: "请输入手机号码",
                    alertElement: first_input_alert,
                    errContainer: ".info-box",
                    alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                    mobile: "手机号码不正确",
                    success: function() {
                        this_a.find(confirm_password_contract).loginValidator({
                            defaultError: "请输入密码",
                            alertElement: password_alert,
                            errContainer: ".info-box",
                            alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                            min: {
                                len: 6,
                                err: "密码应为6-20位"
                            },
                            max: {
                                len: 20,
                                err: "密码应为6-20位"
                            },
                            success: function() {
                                this_a.find("#confirm-password").loginValidator({
                                    defaultError: "请输入确认密码",
                                    alertElement: confirm_password_alert,
                                    errContainer: ".info-box",
                                    alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                                    equal: {
                                        element: confirm_password_contract,
                                        err: "两次输入密码不一致"
                                    },
                                    hideAction: "click",
                                    success: function() {
                                        this_a.find("#mobile-code").loginValidator({
                                            defaultError: "请输入验证码",
                                            alertElement: checkcode_alert,
                                            errContainer: ".info-box",
                                            alertWidth: parseInt(this_a.find(".li-two").css("width")),
                                            min: {
                                                len: 6,
                                                err: "验证码不正确"
                                            },
                                            max: {
                                                len: 6,
                                                err: "验证码不正确"
                                            },
                                            number: "验证码不正确",
                                            success: function() {
                                                sendCheck({
                                                    mobile: this_a.find("#username").val(),
                                                    checkcode: this_a.find("#mobile-code").val(),
                                                    style: check_style,
                                                    checkcode_alert: checkcode_alert,
                                                    this_a: this_a,
                                                    agreement_alert: agreement_alert,
                                                    regForm: regForm
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                this_a.find("#username").loginValidator({
                    defaultError: "请输入注册邮箱",
                    alertElement: first_input_alert,
                    errContainer: ".info-box",
                    alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                    email: "邮箱格式不正确",
                    success: function() {
                        this_a.find(confirm_password_contract).loginValidator({
                            defaultError: "请输入密码",
                            alertElement: password_alert,
                            errContainer: ".info-box",
                            alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                            min: {
                                len: 6,
                                err: "密码应为6-20位"
                            },
                            max: {
                                len: 20,
                                err: "密码应为6-20位"
                            },
                            success: function() {
                                this_a.find("#confirm-password").loginValidator({
                                    defaultError: "请输入确认密码",
                                    alertElement: confirm_password_alert,
                                    errContainer: ".info-box",
                                    alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                                    equal: {
                                        element: confirm_password_contract,
                                        err: "两次输入密码不一致"
                                    },
                                    hideAction: "click",
                                    success: function() {
                                        this_a.find("#check-code").loginValidator({
                                            defaultError: "请输入验证码",
                                            alertElement: checkcode_alert,
                                            errContainer: ".info-box",
                                            alertWidth: parseInt(this_a.find(".li-one").css("width")),
                                            success: function() {
                                                sendCheck({
                                                    mobile: this_a.find("#username").val(),
                                                    checkcode: this_a.find("#check-code").val(),
                                                    style: check_style,
                                                    checkcode_alert: checkcode_alert,
                                                    this_a: this_a,
                                                    agreement_alert: agreement_alert,
                                                    regForm: regForm
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
        if (isStudent) {
            this_a.find("#username").loginValidator({
                defaultError: "请输入姓名",
                alertElement: first_input_alert,
                errContainer: ".info-box",
                alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                success: function() {
                    this_a.find(confirm_password_contract).loginValidator({
                        defaultError: "请输入密码",
                        alertElement: password_alert,
                        errContainer: ".info-box",
                        alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                        min: {
                            len: 6,
                            err: "密码应为6-20位"
                        },
                        max: {
                            len: 20,
                            err: "密码应为6-20位"
                        },
                        success: function() {
                            this_a.find("#confirm-password").loginValidator({
                                defaultError: "请输入确认密码",
                                alertElement: confirm_password_alert,
                                errContainer: ".info-box",
                                alertWidth: eval(parseInt(this_a.find(".form-line").css("width")) + 2),
                                equal: {
                                    element: confirm_password_contract,
                                    err: "两次输入密码不一致"
                                },
                                hideAction: "click",
                                success: function() {
                                    this_a.find("#check-code").loginValidator({
                                        defaultError: "请输入验证码",
                                        alertElement: checkcode_alert,
                                        errContainer: ".info-box",
                                        alertWidth: parseInt(this_a.find(".li-one").css("width")),
                                        success: function() {
                                            sendCheck({
                                                mobile: this_a.find("#username").val(),
                                                checkcode: this_a.find("#check-code").val(),
                                                style: "schoolId",
                                                checkcode_alert: checkcode_alert,
                                                this_a: this_a,
                                                agreement_alert: agreement_alert,
                                                regForm: regForm
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });

    function sendCheck(info) {
        if (info.style == "schoolId") {
            var url = baseUrlName + "login/cap/validate";
            $.get(url, {
                schoolId: info.mobile,
                check_code: info.checkcode,
                ver: (new Date).valueOf()
            }, function(data) {
                if (data.errorcode) {
                    insistCheck(info)
                } else {
                    $(info.checkcode_alert).show();
                    $(info.checkcode_alert).find(".info-box").text(data.error)
                }
            }, "json")
        }
        if (info.style == "email") {
            var url = baseUrlName + "login/cap/validate";
            $.get(url, {
                email: info.mobile,
                check_code: info.checkcode,
                ver: (new Date).valueOf()
            }, function(data) {
                if (data.errorcode) {
                    insistCheck(info)
                } else {
                    $(info.checkcode_alert).show();
                    $(info.checkcode_alert).find(".info-box").text(data.error)
                }
            }, "json")
        }
        if (info.style == "mobile") {
            var url = baseUrlName + "check_code";
            $.post(url, {
                phone: info.mobile,
                check_code: info.checkcode,
                code_type: 1,
                ver: (new Date).valueOf()
            }, function(data) {
                if (data.errorcode) {
                    insistCheck(info)
                } else {
                    $(info.checkcode_alert).show();
                    $(info.checkcode_alert).find(".info-box").text(data.error)
                }
            }, "json")
        }
    }

    function insistCheck(info) {
        info.this_a.find("#agreement").loginValidator({
            defaultError: "请勾选同意91外教服务使用协议",
            alertElement: info.agreement_alert,
            errContainer: ".info-box",
            alertWidth: eval(parseInt(info.this_a.find(".form-line").css("width")) + 2),
            hideAction: "click",
            success: function() {
                Login.common.md5(info.regForm);
                info.regForm.submit()
            }
        })
    }

    $(".click-to-change").click(function() {
        var this_a = $(this).parent().parent().parent().find("#captcha");
        var url = baseUrlName + "captcha?ver=" + (new Date).valueOf();
        this_a.find("img").attr("src", url)
    })
};
}();