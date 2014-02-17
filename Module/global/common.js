var baseUrlName = $("#base-url-con").html();
var Common = {
    defaultIndexHeight: function(c) {
        var b = $(window).height() - 85;
        if ($(c).height() < b) {
            $(c).height(b)
        }
    },
    getLeftBar: function(b) {
        $(b.id).css("height", $(document).height() - 80)
    },
    headerNav: function(d) {
        var c = d.id,
            e = d.ul,
            b = d.dis;
        $(c).hover(function() {
            $(this).find(e).addClass(b)
        }, function() {
            $(this).find(e).removeClass(b)
        })
    },
    selects: function(c, b) {
        $(c).click(function() {
            if ($(this).offset().top > 340) {
                $(this).find("ul").show().css("top", "-241px")
            }
            $(this).find("ul").show();
            $(this).parent().parent().css("z-index", "2").siblings().css("z-index", "1").find("ul").hide();
            return false
        });
        $("body").live("click", function() {
            $(c).find("ul").hide()
        });
        $(c).each(function() {
            $(this).find("li").click(function(g) {
                g.stopPropagation();
                var d = $(this).text();
                if ($(this).find("a").attr("data-id")) {
                    var f = $(this).find("a").attr("data-id");
                    $(this).parent().prev("input").attr("data-id", f)
                }
                $(this).parent().prev("input").val(d);
                $(this).parent().hide();
                if (b != undefined) {
                    b()
                }
            })
        })
    },
    hoverSelects: function(b) {
        $(b).each(function() {
            $(this).hover(function() {
                $(this).find("ul").show()
            }, function() {
                $(this).find("ul").hide()
            })
        });
        $(b).each(function() {
            $(this).find("li").click(function(f) {
                f.stopPropagation();
                var c = $(this).text();
                if ($(this).find("a").attr("data-id")) {
                    var d = $(this).find("a").attr("data-id");
                    $(this).parent().prev("input").attr("data-id", d)
                }
                $(this).parent().prev("input").val(c);
                $(this).parent().hide()
            })
        })
    },
    inputTips: function(c) {
        var b = $(c).val();
        $(c).focus(function() {
            if ($(c).val() == "请输入关键字") {
                $(c).val("")
            }
        });
        $(c).blur(function() {
            if ($(c).val() == "") {
                $(c).val(b)
            }
        })
    },
    aboutUs: function() {
        this.cReturnTopfn();
        if ($(".aboutUs .content").attr("pagename") != undefined) {
            $(".aboutUs li").each(function(b) {
                if ($(".aboutUs .content").attr("pagename") == $(".aboutUs li").eq(b).attr("name")) {
                    $(".aboutUs li").eq(b).find("a").attr("class", "active")
                }
            })
        }
        if ($(".aboutUs .content").height() < $(window).height() - 110) {
            $(".aboutUs .content").css("height", $(window).height() - 110)
        }
    },
    cReturnTopfn: function() {
        if ($(".cReturnTop").length < 1) {
            $("body").append('<div class="cReturnTop">返回顶部</div>')
        }
        $(window).scroll(function() {
            if ($(window).scrollTop() > 300) {
                $(".cReturnTop").fadeIn(1500)
            } else {
                $(".cReturnTop").fadeOut(1500)
            }
        });
        $(".cReturnTop").click(function() {
            $("body,html").animate({
                scrollTop: 0
            }, 1000);
            return false
        })
    }
};
Common.LoadScript = function(d, g) {
    var e = arguments.callee;
    if (!("queue" in e)) {
        e.queue = {}
    }
    var b = e.queue;
    if (d in b) {
        if (g) {
            if (b[d]) {
                b[d].push(g)
            } else {
                g()
            }
        }
        return
    }
    b[d] = g ? [g] : [];
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.onload = c.onreadystatechange = function() {
        if (c.readyState && c.readyState != "loaded" && c.readyState != "complete") {
            return
        }
        c.onreadystatechange = c.onload = null;
        while (b[d].length) {
            b[d].shift()()
        }
        b[d] = null
    };
    c.src = d;
    document.getElementsByTagName("head")[0].appendChild(c)
};
Common.floatLoading = {
    showLoading: function() {
        if ($(".paperDetails .page").siblings(".question-box")) {
            $(".paperDetails .page").siblings(".question-box").remove()
        }
        if ($(".paperDetails .page").length == 0) {
            if ($(".cTextLoading").length < 1) {
                $(".question-list").html('<div class="cTextLoading"></div>')
            }
        }
        if ($(".paperDetails .page").length == 2) {
            if ($(".cTextLoading").length < 1) {
                $(".paperDetails .page").first().after('<div class="cTextLoading"></div>')
            }
        }
    },
    hideLoading: function() {
        $(".floatLoadingCover").hide();
        $(".cTextLoading").hide()
    },
    showFloatLoading: function() {
        if ($(".floatLoadingCover").length < 1) {
            $("body").append('<div class="floatLoadingCover"></div><div class="cFloatLoadingGif"><span></span><p class="return undis"><a href="javascript:void(0)">返回上页</a></p></div>')
        }
        $(".return").hide();
        this.loadingDivShow();
        this.returnPre()
    },
    hideFloatLoading: function() {
        $(".floatLoadingCover").hide();
        $(".cFloatLoadingGif").hide();
        clearInterval(this.timers);
        clearInterval(this.timerID);
        $(".return").hide()
    },
    loadingDivShow: function() {
        $(".floatLoadingCover").css("height", $(window).height()).show();
        $(".cFloatLoadingGif").show()
    },
    returnPre: function() {
        $(".return").show();
        $(".return").click(function() {
            Common.floatLoading.hideFloatLoading()
        })
    }
};
Common.Overlay = {
    show: function(b) {
        if (b != "" || b != undefined) {
            $(b).addClass("cover_dialog")
        }
        if ($(".cover_layer").length < 1) {
            $("body").append('<div class="cover_layer"></div>');
            $("body").append('<iframe rameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" class="cover_layer" style="display:none"></iframe>');
            $(".cover_layer").height($(document).height()).show()
        }
        $(window).resize(function() {
            if ($(".cover_layer").length > 0) {
                $(".cover_layer").height($(document).height())
            }
        })
    },
    hide: function(b) {
        if (b != "" || b != undefined) {
            $(b).removeClass("cover_dialog")
        }
        if ($(".cover_dialog").length <= 1) {
            $(".cover_layer").remove()
        }
    },
    fadeOut: function(b) {
        if (b != "" || b != undefined) {
            $(b).removeClass("cover_dialog")
        }
        if ($(".cover_dialog").length <= 1) {
            $(".cover_layer").fadeOut(function() {
                $(".cover_layer").remove()
            })
        }
    }
};
Common.Msg = {
    ErrorMsg: $("#errormsg"),
    errormsg: function() {
        if (this.ErrorMsg.html() != undefined && this.ErrorMsg.html() != "") {
            $.tiziDialog({
                content: this.ErrorMsg.html()
            })
        }
    }
};
Common.Download = {
    force_download: function(c, e, b) {
        var d = this.ie_version();
        if (b == true || d == 6 || d == 7 || d == 8) {
            if (e == "" || e == undefined) {
                e = "是否下载？"
            } else {
                e = "是否下载《" + e + "》？"
            }
            $.tiziDialog({
                content: e,
                ok: false,
                icon: null,
                button: [{
                    name: "点击下载",
                    href: c,
                    className: "aui_state_highlight",
                    target: "_self"
                }]
            });
            return false
        }
        window.location.href = c
    },
    ie_version: function() {
        var c = $.browser.msie;
        var b = $.browser.version;
        if (c) {
            return b
        } else {
            return false
        }
    }
};
Common.tips = {
    flag: true,
    status: function(c, b) {
        if (b == undefined) {
            b = 0
        }
        var d = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + "login/tips/get_tips",
            data: {
                tips_name: c,
                with_cookie: b,
                ver: (new Date).valueOf()
            },
            success: function(e) {
                if (e.status === false) {
                    d.show()
                }
            }
        })
    },
    close: function(c, b) {
        if (b == undefined) {
            b = 0
        }
        $.tizi_ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + "login/tips/close_tips",
            data: {
                tips_name: c,
                with_cookie: b,
                ver: (new Date).valueOf()
            },
            success: function(d) {}
        })
    },
    show: function() {
        Common.Overlay.show();
        this.thisPage()
    },
    thisPage: function() {
        var b = $(".mainContainer").attr("status") || $(".preview-title").attr("status") || $(".reg-container").attr("status");
        var c = $(".aReturnParent").length;
        switch (b) {
            case "paper_question":
                Common.tips.teacher.paperQuestion.step1();
                break;
            case "create_class":
                Common.tips.teacher.createClass.step1();
                break;
            case "paper_preview":
                Common.tips.teacher.paperPreview.step1();
                break;
            case "studentHomepage":
                if (c > 0) {
                    Common.tips.student.homePage.step1()
                } else {
                    Common.Overlay.hide()
                }
                break;
            case "parentsHomepage":
                Common.tips.parents.homePage.step1();
                break;
            case "regNoticeTips":
                Common.tips.login.regNotice.shows();
                Common.Overlay.hide();
                break
        }
    },
    headerfollow: function() {
        var b = $(".mainContainer").attr("status") || $(".preview-title").attr("status");
        if (b == "paper_question" || b == "create_class" || b == "paper_preview") {
            $(".headerFollow").removeClass("undis").click(function() {
                Common.tips.show()
            })
        }
    }
};
Common.tipsInfo = {
    status: function(c, b) {
        if (b == undefined) {
            b = 0
        }
        var d = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + "login/tips/get_tips",
            data: {
                tips_name: c,
                with_cookie: b,
                ver: (new Date).valueOf()
            },
            success: function(e) {
                if (e.status === false) {
                    d.show()
                }
            }
        })
    },
    close: function(c, b) {
        if (b == undefined) {
            b = 0
        }
        $.tizi_ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + "login/tips/close_tips",
            data: {
                tips_name: c,
                with_cookie: b,
                ver: (new Date).valueOf()
            },
            success: function(d) {}
        })
    },
    show: function() {
        var b = $(".mainContainer").attr("status") || $(".preview-title").attr("status") || $(".reg-container").attr("status");
        switch (b) {
            case "paper_question":
                $(".paperQuestionTips").show();
                $(".paperQuestionTips .close").click(function() {
                    $(this).parent().hide();
                    Common.tipsInfo.close("paperQuestionTips")
                });
                break;
            case "lessonStatus":
                $(".lessonTips").show();
                $(".lessonTips .close").click(function() {
                    $(this).parent().hide();
                    Common.tipsInfo.close("lessonTips")
                });
                break;
            case "homeworkStatus":
                $(".homeworkQuestionTips").show();
                $(".homeworkQuestionTips .close").click(function() {
                    $(this).parent().hide();
                    Common.tipsInfo.close("homeworkQuestionTips")
                });
                break
        }
    }
};
Common.tips.headerfollow();
Common.tips.login = {};
Common.tips.login.regNotice = {
    shows: function() {
        var b = this;
        $(".regNoticeTips").show();
        $(".regNoticeTipsClose").click(function() {
            $(".regNoticeTips").hide();
            b.close()
        })
    },
    close: function() {
        Common.tips.close("regNoticeTips", 1)
    }
};
Common.tips.teacher = {};
Common.tips.teacher.paperQuestion = {
    step1: function() {
        $("body").append('<div class="paperQuestionStep1"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeStep2();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperQuestionStep1").show().css("left", $(".subject-chose").offset().left).css("top", $(".subject-chose").offset().top)
    },
    step2: function() {
        $("body").append('<div class="paperQuestionStep2"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeStep3();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperQuestionStep2").show().css("left", $(".type-list").offset().left).css("top", $(".type-list").offset().top - 3)
    },
    step3: function() {
        $("body").append('<div class="paperQuestionStep3"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeStep4();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperQuestionStep3").show().css("left", $(".tree-list").offset().left - 2).css("top", $(".tree-list").offset().top + 3)
    },
    step4: function() {
        $("body").append('<div class="paperQuestionStep4"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeStep5();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperQuestionStep4").show().css("left", $(".filter-box").offset().left - 10).css("top", $(".filter-box").offset().top - 9)
    },
    step5: function() {
        $("body").append('<div class="paperQuestionStep5"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeStep6();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperQuestionStep5").show().css("left", $(window).width() - $(".question-list").offset().left + 286).css("top", $(".question-list").offset().top + 36)
    },
    step6: function() {
        $("body").append('<div class="paperQuestionStep6"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperQuestion.followMeEnd();" class="aFollowOver">引导结束，立即体验</a></div></div>');
        $(".paperQuestionStep6").show().css("left", $(".preview-btn").offset().left).css("top", $(".preview-btn").offset().top + 3)
    },
    followMeStep2: function() {
        $(".paperQuestionStep1").remove();
        this.step2()
    },
    followMeStep3: function() {
        $(".paperQuestionStep2").remove();
        this.step3()
    },
    followMeStep4: function() {
        $(".paperQuestionStep3").remove();
        this.step4()
    },
    followMeStep5: function() {
        $(".paperQuestionStep4").remove();
        this.step5()
    },
    followMeStep6: function() {
        $(".paperQuestionStep5").remove();
        this.step6()
    },
    followMeOver: function() {
        Common.tips.close("paper_question");
        $(".paperQuestionStep1,.paperQuestionStep2,.paperQuestionStep3,.paperQuestionStep4,.paperQuestionStep5,.paperQuestionStep6").remove();
        Common.Overlay.hide()
    },
    followMeEnd: function() {
        Common.tips.close("paper_question");
        $(".paperQuestionStep1,.paperQuestionStep2,.paperQuestionStep3,.paperQuestionStep4,.paperQuestionStep5,.paperQuestionStep6").remove();
        Common.Overlay.hide()
    }
};
Common.tips.teacher.createClass = {
    step1: function() {
        $("body").append('<div class="createClassStep1"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.createClass.followMeStep2();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.createClass.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".createClassStep1").show().css("left", $("#area").offset().left + 1).css("top", $("#area").offset().top + 1)
    },
    step2: function() {
        $("body").append('<div class="createClassStep2"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.createClass.followMeEnd();" class="closeFollow">再不提示</a></div></div>');
        $(".createClassStep2").show().css("left", $(".class_box").eq(2).offset().left + 1).css("top", $(".class_box").eq(2).offset().top + 1)
    },
    followMeStep2: function() {
        $(".createClassStep1").remove();
        this.step2()
    },
    followMeOver: function() {
        Common.tips.close("create_class");
        $(".createClassStep1,.createClassStep2").remove();
        Common.Overlay.hide()
    },
    followMeEnd: function() {
        Common.tips.close("create_class");
        $(".createClassStep1,.createClassStep2").remove();
        Common.Overlay.hide()
    }
};
Common.tips.teacher.paperPreview = {
    step1: function() {
        $("body").append('<div class="paperPreviewStep1"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeStep2();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperPreviewStep1").show().css("left", $("#paper-type1").offset().left + ($(".contentSecWrap").width() - $(".paperPreviewStep1 p").width()) / 2 - 80).css("top", $("#paper-type1").offset().top - 250);
        if ($("#paper-type1").offset().top - 100 <= 0) {
            $(".paperPreviewStep1").show().css("left", $("#paper-type1").offset().left - 15 + 87).css("top", "100px")
        }
    },
    step2: function() {
        $("body").append('<div class="paperPreviewStep2"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeStep3();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperPreviewStep2").show().css("left", $(".defaulte-set-box").offset().left - 2).css("top", $(".defaulte-set-box").offset().top + 3)
    },
    step3: function() {
        $("body").append('<div class="paperPreviewStep3"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeStep4();" class="nextStep">继续引导</a><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeOver();" class="closeFollow">再不提示</a></div></div>');
        $(".paperPreviewStep3").show().css("left", $("#paper-type1").first().offset().left).css("top", $("#paper-type1").first().offset().top - 3);
        if ($("#paper-type1").offset().top - 100 <= 0) {
            $(".paperPreviewStep3").show().css("left", $("#paper-type1").first().offset().left).css("top", "230px")
        }
    },
    step4: function() {
        $("body").append('<div class="paperPreviewStep4"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.teacher.paperPreview.followMeEnd();" class="closeFollow">再不提示</a></div></div>');
        $(".paperPreviewStep4").show().css("left", $("#down-card-btn").offset().left - 2).css("top", $("#down-card-btn").offset().top - 3)
    },
    followMeStep2: function() {
        $(".paperPreviewStep1").remove();
        this.step2()
    },
    followMeStep3: function() {
        $(".paperPreviewStep2").remove();
        this.step3()
    },
    followMeStep4: function() {
        $(".paperPreviewStep3").remove();
        this.step4()
    },
    followMeOver: function() {
        Common.tips.close("paper_preview");
        $(".paperPreviewStep1,.paperPreviewStep2,.paperPreviewStep3,.paperPreviewStep4").remove();
        Common.Overlay.hide()
    },
    followMeEnd: function() {
        Common.tips.close("paper_preview");
        $(".paperPreviewStep1,.paperPreviewStep2,.paperPreviewStep3,.paperPreviewStep4").remove();
        Common.Overlay.hide()
    }
};
Common.tips.student = {};
Common.tips.student.homePage = {
    step1: function() {
        $("body").append('<div class="studentIndexStep1"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.student.homePage.followMeEnd();" class="closeFollow">再不提示</a></div></div>');
        $(".studentIndexStep1").show().css("left", $(".aReturnParent").offset().left).css("top", $(".aReturnParent").offset().top)
    },
    followMeOver: function() {
        $(".studentIndexStep1").remove();
        Common.Overlay.hide()
    },
    followMeEnd: function() {
        Common.tips.close("studentHomepage");
        $(".studentIndexStep1").remove();
        Common.Overlay.hide()
    }
};
Common.tips.parents = {};
Common.tips.parents.homePage = {
    step1: function() {
        $("body").append('<div class="parentsIndexStep1"><p></p><div><a href="javascript:void(0);" onclick="Common.tips.parents.homePage.followMeEnd();" class="closeFollow">再不提示</a></div></div>');
        $(".parentsIndexStep1").show().css("left", $(".aReturnParent").offset().left).css("top", $(".aReturnParent").offset().top)
    },
    followMeOver: function() {
        $(".parentsIndexStep1").remove();
        Common.Overlay.hide()
    },
    followMeEnd: function() {
        Common.tips.close("parentsHomepage");
        $(".parentsIndexStep1").remove();
        Common.Overlay.hide()
    }
};
Common.pagination = function(b) {
    $(b).parent().find("a").attr("onclick", "")
};
Common.calendar = {
    calendarDate: function(d, b) {
        var c = {
            divId: b,
            needTime: true,
            yearRange: [1970, 2030],
            week: ["日", "一", "二", "三", "四", "五", "六"],
            month: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
            format: "yyyy-MM-dd hh时"
        };
        canva1 = $.createGooCalendar(d, c)
    },
    calendarTime: function() {
        var i = new Date();
        var e = i.getFullYear();
        var j = i.getMonth() + 1;
        var g = i.getDate();
        var c = i.getHours();
        var b = i.getMinutes();
        var f = i.getSeconds();
        s = e + "-" + (j < 10 ? "0" + j : j) + "-" + (g < 10 ? "0" + g : g) + "-" + (c < 10 ? "0" + c : c) + "-" + (b < 10 ? "0" + b : b) + "-" + (f < 10 ? "0" + f : f);
        return s
    }
};
(function($) {
    var baseUrlName = $("#base-url-con").html();
    $.tizi_ajax = function(options) {
        var defaults = {
            url: "",
            type: "POST",
            data: {},
            dataType: "json",
            success: function() {},
            error: function() {}
        };
        var options = $.extend(defaults, options);
        options.data["token"] = $(".token").attr("id");
        options.data["page_name"] = $(".pname").attr("id");
        options.data["ver"] = (new Date).valueOf();
        $.ajax({
            url: options.url,
            type: "POST",
            data: options.data,
            dataType: "json",
            success: [
                function(data) {
                    $.reflash(data.token)
                },
                options.success
            ],
            error: options.error
        })
    };
    $.tizi_post = function(url, data, func, dataType, serialize) {
        if (serialize === true) {
            data += "&token=" + $(".token").attr("id") + "&page_name=" + $(".pname").attr("id") + "&ver=" + (new Date).valueOf()
        } else {
            data.token = $(".token").attr("id");
            data.page_name = $(".pname").attr("id");
            data.ver = (new Date).valueOf()
        }
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: "json",
            success: [
                function(data) {
                    $.reflash(data.token)
                },
                func
            ]
        })
    };
    $.tizi_send = function(options) {
        var defaults = {
            url: "",
            type: "POST",
            data: {},
            dataType: "text",
            success: function() {},
            error: function() {}
        };
        var options = $.extend(defaults, options);
        if (options.data != "") {
            options.data += "&"
        }
        options.data += "token=" + $(".token").attr("id") + "&page_name=" + $(".pname").attr("id") + "&ver=" + (new Date).valueOf();
        $.ajax({
            url: options.url,
            type: "POST",
            data: options.data,
            dataType: options.dataType,
            success: [
                function(data) {
                    data = eval("(" + data + ")");
                    $.reflash(data.token)
                },
                options.success
            ],
            error: options.error
        })
    };
    $.reflash = function(token) {
        if (token == "" || token == undefined) {} else {
            $(".token").attr("id", token)
        }
    }
})(jQuery);

function getNotifyNews() {
    $.ajax({
        type: "POST",
        url: baseUrlName + "Notify_Controller/getNewNotifyCount",
        dataType: "json",
        success: function(b) {
            if (b.status == 99) {
                if (b.msg != "0") {
                    $("#head_name_name").append("<b></b><em class='dot'></em>")
                } else {
                    $("#head_name_name b").remove();
                    $("#head_name_name .dot").remove()
                }
                $(".newwork").find(".num1").html(b.msg)
            }
            setNextNews()
        }
    })
}

function setNextNews() {
    setTimeout("getNotifyNews()", 120000)
}
//getNotifyNews();
var baseUrlName = $("#base-url-con").html();
$(function() {
    var tiziFb = {
        outsideLayer: $(".tizi_fb_blackbg"),
        innerLayer: $(".tizi_fb_nr"),
        closeLayer: $(".tizi_fb_title_close"),
        contact: $(".tizi_fb_contact"),
        button: $(".tizi_fb_bt"),
        loginYN: $(".loginYN"),
        neirong: $(".tizi_fb_atc_content")
    };
    $(".nameN").live("focus", function() {
        if ($(this).val("姓名/昵称")) {
            $(this).val("")
        }
    });

    function ifIE6is(id) {
        var isIE = !! window.ActiveXObject;
        var isIE6 = isIE && !window.XMLHttpRequest;
        if (isIE6) {
            setTimeout(function() {
                change_check_image(id)
            }, 300)
        } else {
            change_check_image(id)
        }
    }

    tiziFb.innerLayer.css("top", $(window).scrollTop() + 60 + "px");
    $(".loginpop").click(function() {
        $.tiziDialog({
            title: "用户反馈",
            content: $(".feedBackContent").html(),
            icon: null,
            width: 500,
            okVal: "确定",
            ok: function() {
                var inPhone = $(".nameP").val();
                if (inPhone) {
                    if (!checkPhone(inPhone)) {
                        return false
                    }
                }
                var inEmail = $(".nameE").val();
                if (inEmail) {
                    if (!CheckMail(inEmail)) {
                        return false
                    }
                }
                var Checkcode = $("#check-code-feedback").val();
                var checkcode_alert = "";
                if (tiziFb.neirong.html() == "") {
                    $(".error1").html("反馈内容不能为空");
                    return false
                } else {
                    if ($(".unloginpop").length > 0 || $(".unloginpopS").length > 0) {
                        $(".error1").html("");
                        var d = {
                            content: $(".tizi_fb_atc_content").text(),
                            name: $(".nameN").val(),
                            phone: inPhone,
                            email: inEmail
                        };
                        vc = $("#check-code-feedback").val();
                        if (vc && vc != "验证码") {
                            sendCheck({
                                checkcode: Checkcode,
                                checkcode_alert: checkcode_alert
                            }, d, true)
                        } else {
                            $(".error5").show().text("验证码不能为空")
                        }
                    } else {
                        $(".error1").html("");
                        var d = {
                            content: $(".tizi_fb_atc_content").text()
                        };
                        vc = $("#check-code-feedback").val();
                        if (vc && vc != "验证码") {
                            if ($(".loginpop").length > 0) {
                                sendCheck({
                                    checkcode: Checkcode,
                                    checkcode_alert: checkcode_alert
                                }, d, true)
                            } else {
                                sendCheck({
                                    checkcode: Checkcode,
                                    checkcode_alert: checkcode_alert
                                }, d, false)
                            }
                        } else {
                            $(".error5").show().text("验证码不能为空");
                            return false
                        }
                    }
                }
            }
        });
        $(".click-to-change-feedback").click(function() {
            var this_a = $(this).parent().parent().parent().find("#captcha");
            var url = baseUrlName + "captcha?ver=" + (new Date).valueOf();
            this_a.find("img").attr("src", url)
        });
        var this_a = $(".tizi_fb_nr").find("#captcha");
        tiziFeedback(1);
        feedbackTea();
        ifIE6is(this_a)
    });
    $(".unloginpop").click(function() {
        $.tiziDialog({
            content: $(".feedBackContent").html()
        });
        var this_a = $(".tizi_fb_nr").find("#captcha");
        tiziFeedback(0);
        feedbackTea();
        ifIE6is(this_a)
    });
    $(".loginpopS").click(function() {
        $.tiziDialog({
            content: $(".feedBackContent").html()
        });
        var this_a = $(".tizi_fb_nr").find("#captcha");
        tiziFeedback(1);
        feedbackStu();
        ifIE6is(this_a)
    });
    tiziFb.closeLayer.click(function() {
        $.tiziDialog({
            content: $(".feedBackContent").html()
        });
        tiziFb.innerLayer.hide()
    });

    function sendCheck(info, d, role) {
        var url = baseUrlName + "login/cap/validate";
        $.get(url, {
            check_code: info.checkcode,
            ver: (new Date).valueOf()
        }, function(data) {
            if (data.errorcode) {
                send_to_server(d, role)
            } else {
                $(".error5").show().text(data.error)
            }
        }, "json")
    }

    function send_to_server(d, role) {
        url = baseUrlName + "send_feedback";
        $.post(url, d, function(data, status) {
            jsonData = eval("(" + data + ")");
            if (role) {
                $.tizi({
                    content: jsonData.error
                })
            } else {
                showpop(jsonData.error)
            }
            tiziFb.closeLayer.click()
        })
    }

    $(".click-to-change-feedback").click(function() {
        var this_a = $(this).parent().parent().parent().find("#captcha");
        var url = baseUrlName + "captcha?ver=" + (new Date).valueOf();
        this_a.find("img").attr("src", url)
    });

    function change_check_image(obj) {
        var url = baseUrlName + "captcha?ver=" + (new Date).valueOf();
        obj.find("img").attr("src", url)
    }

    function tiziFeedback(obj) {
        tiziFb.innerLayer.centerShow = function() {
            $(this).show()
        };
        var unlogin = '<div class="tizi_fb_cta_title">您的联系方式：（请填写真实有效的信息，以便我们及时为您答复）</div><div class="tizi_fb_cta_cell"><span class="tizi_fb_cta_cell_name">姓名：</span><input class="nameN" type="text" value="" /><span class="tizi_fb_cta_cell_error error2"></span></div><div class="tizi_fb_cta_cell"><span class="tizi_fb_cta_cell_name">手机：</span><input class="nameP" type="text"  /><span class="tizi_fb_cta_cell_error error3"></span></div><div class="tizi_fb_cta_cell"><span class="tizi_fb_cta_cell_name">邮箱：</span><input class="nameE" type="text"  /><span class="tizi_fb_cta_cell_error error4"></span></div>';
        var login = "";
        tiziFb.outsideLayer.show();
        tiziFb.innerLayer.centerShow();
        if (obj) {
            tiziFb.contact.html(login);
            tiziFb.loginYN.removeClass("tizi_fb_size_unlogin");
            tiziFb.loginYN.addClass("tizi_fb_size_login");
            $("#check-code-feedback").css("margin-left", "0px")
        } else {
            tiziFb.contact.html(unlogin);
            tiziFb.loginYN.removeClass("tizi_fb_size_login");
            tiziFb.loginYN.addClass("tizi_fb_size_unlogin")
        }
    }

    function CheckMail(mail) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(mail)) {
            $(".error4").html("");
            return true
        } else {
            $(".error4").html("请填写正确的邮箱！！");
            return false
        }
    }

    function checkPhone(phoneNumber) {
        var filter = /^1[3|4|5|8][0-9]\d{8}$/;
        if (filter.test(phoneNumber)) {
            $(".error3").html("");
            return true
        } else {
            $(".error3").html("请填写正确的手机号！！");
            return false
        }
    }

    function feedbackStu() {
        $(".tizi_fb_nr").removeClass("tizi_fb_nr_border")
    }

    function feedbackTea() {}
});
(function(b) {
    b.tizi = function(m, l) {
        var d = {
            title: "系统提示",
            cancel: "取消",
            okay: "确定",
            okaya: "",
            content: "",
            okaybutton: true,
            okayabutton: false,
            cancelbutton: false,
            buttons: true,
            okayclass: "cBtnNormal",
            cancelclass: "cBtnGrey",
            okayenter: true,
            opacity: 0.3,
            fadeout: true,
            overlayclose: true,
            modaltop: "30%",
            modalwidth: "400",
            okc: function() {},
            cancelc: function() {}
        };
        var m = b.extend(d, m);
        if (m.okayabutton) {
            var i = '<a href="' + m.okaya + '"><span class="' + m.okayclass + '"><i id="okay">' + m.okay + "</i></span></a>"
        } else {
            var i = '<span class="' + m.okayclass + '"><i id="okay">' + m.okay + "</i></span>"
        }
        var f = '<span class="' + m.cancelclass + '"><i id="cancel">' + m.cancel + "</i></span>";
        if (m.okaybutton == false || m.buttons == false) {
            i = ""
        }
        if (m.cancelbutton == false || m.buttons == false) {
            f = ""
        }
        if (m.okayabutton == true) {
            m.okayenter = false
        }
        var e = '<div id="tizi_dialogs" class="tizi_dialogs cover_dialog" style="top:' + m.modaltop + ';left:50%;margin-left:-217px;"><table><tbody><tr><td class="b"/><td class="body"><div class="title">' + m.title + '<a href="javascript:;" id="tizi_x_close"><img class="fr closed" src="/application/views/static/image/cancle_bg.png" /></a></div><div class="container"><div class="content" style="width:' + m.modalwidth + 'px">' + m.content + '</div><div class="footer_fbmodel"><div class="right"><div class="hd_button" id="ok">' + i + '</div><div class="hd_button" id="close">' + f + '</div></div><div class="clear"></div></div></div></td><td class="b"/></tr></tbody></table></div>';
        var h = [new Image(), new Image()];
        b("#tizi_dialogs").find(".b:first, .bl, .br, .tl, .tr").each(function() {
            h.push(new Image());
            h.slice(-1).src = b(this).css("background-image").replace(/url\((.+)\)/, "$1")
        });
        if (b("#tizi_dialogs").length > 0) {
            setTimeout(function() {
                g()
            }, 300)
        } else {
            g()
        }
        b(window).bind("resize", function() {
            c()
        });

        function c() {
            var n = b(window).width();
            var p = b("#tizi_dialogs").width();
            var o = n / 2 - p / 2
        }

        function g() {
            b("body").append(e);
            Common.Overlay.show();
            c();
            j()
        }

        function k() {
            if (m.fadeout == true) {
                b("#tizi_dialogs").fadeOut(function() {
                    b("#tizi_dialogs").remove()
                })
            } else {
                b("#tizi_dialogs").remove()
            }
            if (b(".tizi_dialogs").length == 1) {
                Common.Overlay.fadeOut()
            }
        }

        function j() {
            b("#tizi_dialogs #ok").click(function() {
                k();
                b("#tizi_dialogs #ok").remove();
                m.okc()
            });
            b("#tizi_dialogs #close").click(function() {
                k();
                m.cancelc()
            });
            b("#tizi_dialogs #tizi_x_close").click(function() {
                k()
            });
            var n = function() {};
            document.onkeydown = function(p) {
                b("a").blur();
                if (m.okayenter == true) {
                    var o = document.all ? window.event : p;
                    if (o.keyCode == 13) {
                        if (b("#tizi_dialogs #ok").length > 0) {
                            b("#tizi_dialogs #ok").click()
                        }
                    }
                }
            }
        }
    }
})(jQuery);

function showpop(c, b) {
    if (($(".center_layer").length < 1) && ($(".center_layer").length < 1)) {
        $("body").append("<div class='center_layer'></div><div class='center_window'><h5>提示<span class='cancel'></span></h5><div class='win_box'></div></div>")
    }
    height = document.body.scrollHeight;
    var d = {
        cancel: $(".center_window .cancel"),
        cen_win: $(".center_window"),
        layer: $(".center_layer"),
        inner: $(".win_box"),
        Body: $("body"),
        infor: $("#student_info")
    };
    d.layer.show();
    d.cen_win.show();
    d.inner.html(c);
    d.layer.height(height);
    if (b !== undefined) {
        if (b.timeout != undefined) {
            setTimeout(function() {
                d.layer.hide();
                d.cen_win.hide()
            }, b.timeout)
        }
        if (b.url != undefined) {
            if (b.timeout != undefined) {
                setTimeout(function() {
                    window.location.href = b.url
                }, b.timeout)
            } else {
                window.location.href = b.url
            }
        }
        if (b.backup != undefined) {
            b.backup()
        }
    }
    $(".center_window .cancel").live("click", function(f) {
        f.preventDefault();
        d.layer.hide();
        d.cen_win.hide()
    })
}
Common.Msg.errormsg();

function load_js(b) {
    setTimeout(function() {
        a = document.createElement("script");
        a.type = "text/javascript";
        a.src = baseUrlName + "application/views/static/js/" + b + "?ver=" + (new Date).valueOf();
        document.body.appendChild(a)
    }, 300)
}
Common.Feedback = {
    flag: false,
    init: function() {
        $(".cBtnFeedback").click(function(b) {
            b.preventDefault();
            Common.Feedback.dialog()
        })
    },
    dialog: function() {
        $.tiziDialog({
            title: "用户反馈",
            content: $(".includeFeedback").html().replace("feedbackForm1", "feedbackForm"),
            icon: null,
            ok: false,
            width: 680,
            height: 390,
            init: function() {
                Common.LoadScript("http://wpa.b.qq.com/cgi/wpa.php?" + (new Date).valueOf(), function() {
                    function c() {
                        if (window.BizQQWPA != undefined) {
                            BizQQWPA.add({
                                aty: "0",
                                type: "10",
                                fsty: "1",
                                fposX: "2",
                                fposY: "2",
                                ws: "www.tizi.com",
                                nameAccount: "800068391",
                                parent: "qq2"
                            })
                        }
                    }

                    c()
                })
            },
            button: [{
                name: "提交反馈",
                className: "aui_state_highlight alignLeft",
                focus: false,
                callback: function() {
                    $(".Validform_wrong,.Validform_right").show();
                    var c = this;
                    $(".feedbackForm").Validform().check();
                    if ($(".Validform_wrong:visible").length < 1) {
                        Common.Feedback.captchaCheck({
                            checkcode: $(".imgCaptcha").val(),
                            checkcode_alert: ""
                        }, {
                            content: $(".imgCaptcha").val()
                        }, function() {
                            if ($(".contentTextarea").val() !== "" && $(".imgCaptcha").val() !== "") {
                                var d = $(".QQText").val();
                                if (d == undefined) {
                                    d = $(".QQTextUnlogin").val()
                                }
                                Common.Feedback.send_to_server({
                                    content: $(".contentTextarea").val(),
                                    qq: d
                                });
                                c.close()
                            } else {
                                return false
                            }
                        });
                        return false
                    } else {
                        return false
                    }
                }
            }],
            close: function() {
                $(".aui_buttons").removeClass("buttonAalignLeft");
                var c = $(".qq_tip_about");
                c.length > -1 ? c.show() : ""
            }
        });
        var b = $(".qq_tip_about");
        b.length > -1 ? b.hide() : "";
        Common.Feedback.changeCaptcha();
        if ($(".aui_buttons button.alignLeft").length > 0) {
            $(".aui_buttons").addClass("buttonAalignLeft")
        }
        $(".changeCaptcha").live("click", function(c) {
            c.preventDefault();
            Common.Feedback.changeCaptcha()
        });
        Common.Feedback.FeedbackCheck()
    },
    FeedbackCheck: function() {
        var b = $(".feedbackForm").Validform({
            tiptype: 3,
            showAllError: true,
            datatype: {
                "zh1-6": /^[\u4E00-\u9FA5\uf900-\ufa2d]{1,6}$/
            }
        });
        b.addRule([{
            ele: ".contentTextarea",
            datatype: "*5-1000",
            nullmsg: "请填写反馈内容！",
            errormsg: "反馈内容5-1000个字符之间！"
        }, {
            ele: ".QQText",
            datatype: "n5-12 | /^w{0}$/",
            errormsg: "请输入正确的QQ号码！"
        }, {
            ele: ".QQTextUnlogin",
            datatype: "n5-12",
            nullmsg: "请输入QQ号码！",
            errormsg: "请输入正确的QQ号码！"
        }, {
            ele: ".imgCaptcha",
            datatype: /^\w{4}$/,
            nullmsg: "请输入验证码！",
            errormsg: "请输入4位验证码！"
        }])
    },
    changeCaptcha: function() {
        var c = $(".changeCaptcha").parents().find("#captcha");
        var b = baseUrlName + "captcha?ver=" + (new Date).valueOf();
        c.find("img").attr("src", b)
    },
    captchaCheck: function(e, f, c) {
        if (c == undefined) {
            c = function() {}
        }
        var b = baseUrlName + "login/cap/validate";
        $.get(b, {
            check_code: e.checkcode,
            ver: (new Date).valueOf()
        }, function(d) {
            if (d.errorcode) {
                d.error = "&nbsp";
                $(".imgCaptcha").siblings(".Validform_checktip").text(d.error).attr("class", "Validform_checktip Validform_right");
                c();
                return false
            } else {
                $(".imgCaptcha").siblings(".Validform_checktip").text(d.error).attr("class", "Validform_checktip Validform_wrong");
                return false
            }
        }, "json")
    },
    send_to_server: function(c) {
        var b = baseUrlName + "send_feedback";
        c.ver = (new Date).valueOf();
        $.post(b, c, function(e, d) {
            if (e.errorcode) {
                $.tiziDialog({
                    content: e.error,
                    time: 3,
                    lock: true,
                    icon: "succeed"
                })
            } else {
                $.tiziDialog({
                    content: e.error,
                    time: 3,
                    lock: true,
                    icon: "error"
                })
            }
        }, "json")
    }
};
Common.Feedback.init();