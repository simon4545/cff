var baseUrlName='';
var common = {
    ErrorNoQuestion: "您还没有添加题目",
    number_change: function(a) {
        $(a).each(function() {
            switch ($(this).text()) {
                case "1":
                    $(this).text("一");
                    break;
                case "2":
                    $(this).text("二");
                    break;
                case "3":
                    $(this).text("三");
                    break;
                case "4":
                    $(this).text("四");
                    break;
                case "5":
                    $(this).text("五");
                    break;
                case "6":
                    $(this).text("六");
                    break;
                case "7":
                    $(this).text("七");
                    break;
                case "8":
                    $(this).text("八");
                    break;
                case "9":
                    $(this).text("九");
                    break;
                case "10":
                    $(this).text("十");
                    break;
                case "11":
                    $(this).text("十一");
                    break;
                case "12":
                    $(this).text("十二");
                    break;
                case "13":
                    $(this).text("十三");
                    break;
                case "14":
                    $(this).text("十四");
                    break;
                case "15":
                    $(this).text("十五");
                    break;
                case "16":
                    $(this).text("十六");
                    break;
                case "17":
                    $(this).text("十七");
                    break;
                case "18":
                    $(this).text("十八");
                    break;
                case "19":
                    $(this).text("十九");
                    break;
                case "20":
                    $(this).text("二十");
                    break;
                default:
                    return
            }
        })
    },
    auth: function(a) {
        $.tizi_ajax({
            url: baseUrlName + "user/user_info/auth_download",
            type: "GET",
            dataType: "json",
            data: {
                ver: (new Date).valueOf()
            },
            success: function(b) {
                if (b.errorcode == true) {
                    if (b.show_phone == false) {
                        a()
                    } else {
                        $.tiziDialog({
                            id: "bindPhoneID",
                            title: "绑定手机号码",
                            content: b.html,
                            icon: null,
                            ok: function() {
                                $(".phoneSubmit input").click();
                                return false
                            },
                            cancel: true
                        });
                        Common.sendCaptap.sms.init($(".modifyPhone").val(), 4, ".modifyPhone");
                        Common.valid.teacherModifyMyInfo.init()
                    }
                } else {
                    $.tiziDialog({
                        content: b.error
                    })
                }
            }
        })
    }
};
var paper_common = {
    questionCart: $(".question-cart"),
    hiddenArrow: $(".hidden-arrow a"),
    menuLink: $(".menu a"),
    subjectBox: $(".subject-box"),
    subjectLink: $(".subject-chose"),
    subjectList: $(".subject-list"),
    mainMenu: $(".main-menu"),
    mainWrap: $(".main-wrap"),
    mainContainer: $(".preview-content"),
    childMenu: $(".child-menu"),
    init: function() {
        var that=this;
        this.initBase();
        //Teacher.paper.paper_common.get_question_cart(this.subjectLink.data("subject"));
        $(window).resize(function() {
            that.initBase()
        });
        this.menuLink.click(function() {
            var a = this;
            this.menuLink.removeClass("active");
            $(a).addClass("active")
        });
        this.subjectBox.hover(function() {
            var a = this;
            a.subjectLink.addClass("subject-active");
            a.subjectList.show()
        }, function() {
            var a = this;
            a.subjectLink.removeClass("subject-active");
            a.subjectList.hide()
        });
        this.hiddenArrow.click(function() {
            var a = this;
            this.hiddenArrowClick(a)
        });
        
    },
    hiddenArrowClick: function(b) {
        var a = $(b).attr("class");
        switch (a) {
            case "hide-menu":
                this.mainMenu.hide();
                this.mainWrap.addClass("full-width");
                $(b).attr("class", "show-menu");
                break;
            case "show-menu":
                this.mainMenu.show();
                this.mainWrap.removeClass("full-width");
                $(b).attr("class", "hide-menu");
                break
        }
    },
    initBase: function() {
        Common.getLeftBar({
            id: "#leftBar"
        });
        Common.headerNav({
            id: "#navSlidown",
            ul: "ul",
            dis: "dis"
        });
        var c = $(window).height() - $(".header").height() - $(".footer").height();
        $(".mainContainer").css("height", c);
        $(".mainContainer .content").css("height", c).css("overflow-y", "scroll");
        $(".preview-content").css("height", c - 60);
        $(".drag-line").css("height", c);
        $(".drag-line a").css("margin-top", c / 2 + "px");
        $(".ui-resizable-eu").css("height", c + 10);
        $(".child-menu").css("height", c - 10);
        var b = $(window).height();
        var a = $(window).width();
        var c = b - 80;
        $(".main-menu,.hidden-arrow,iframe").height(c);
        this.hiddenArrow.css("margin-top", c / 2 - 8 + "px")
    }
    
};
var testpaper = {
    typeCur: $(".current-type"),
    treeList: $(".tree-list"),
    questionList: $(".question-list"),
    typeOption: $(".type-list ul"),
    typeItem: $(".type-list a"),
    typeList: $(".type-list"),
    mainMenu: $(".child-menu"),
    filterLink: $(".filter-box a"),
    mainContent: $(".child-content .content-wrap"),
    init: function() {
        this.page(1);
        this.get_category(this.typeCur.data("cselect"));
        var that=this;
        paper_common.randerQuestion = this.randerQuestion;
        this.treeList.on("click", ".item", function() {
            var a = this;
            that.treeItemClick(a)
        });
        this.treeList.on("click", ".icon", function() {
            var a = this;
            that.treeListClick(a)
        });
        this.questionList.on("click", ".question-content", function() {
            var a = this;
            $(a).find(".answer").toggle()
        });
        this.questionList.on("click", ".all_in", function(b) {
            var a = this;
            b.stopPropagation();
            that.addQuestionsClick(a);
            return false
        });
        this.questionList.on("click", ".control-btn", function() {
            var a = this;
            that.addQuestionClick(a)
        });
        this.typeItem.click(function() {
            var a = this;
            var b = $(a).text();
            $(a).parent().parent().siblings("a").children("span").text(b)
        });
        this.typeOption.click(function() {
            that.typeOption.hide()
        });
        this.typeList.hover(function() {
            var a = this;
            $(a).children(".current-type").addClass("hover");
            if ($(a).children("ul").children().length > 0) {
                $(a).children("ul").show()
            } else {
                $(a).children("ul").hide()
            }
        }, function() {
            var a = this;
            $(a).children(".current-type").removeClass("hover");
            $(a).children("ul").hide()
        });
        /*this.mainMenu.resizable({
            handles: "e",
            maxWidth: 390,
            minWidth: 190,
            resize: function() {
                var b = that;
                var a = b.mainMenu.width() + 20;
                b.mainContent.css("margin-left", a + "px")
            }
        });*/
        this.filterLink.click(function() {
            var a = this;
            that.filterQuestionClick(a)
        })
    },
    getUrlData: function(c) {
        c = c || 1;
        var b = $(".tree-list .active").data() || {
            nselect: $(".current-type").data("cselect")
        };
        var a = $.extend({
            page: c
        }, b, $(".current-type").data(), $(".filter-box .active").eq(0).data(), $(".filter-box .active").eq(1).data());
        return a
    },
    randerQuestion: function() {
        this_a = this;
        var a = this_a.getUrlData($(".pages").attr("data-page"));
        this_a.get_question(a, true)
    },
    treeItemClick: function(b) {
        if ($(b).hasClass("active")) {
            return false
        }
        this.treeList.find("a").removeClass("active");
        $(b).addClass("active");
        var a = this.getUrlData();
        this.get_question(a)
    },
    treeListClick: function(e) {
        var b = $(e).data("url_id");
        var c = $(e).attr("class");
        var a = c.split(" ")[1];
        var f = $(e).parent("div").siblings("ul");
        var g = a.split("-");
        var d = function() {
            if (g[1] == "plus") {
                return g[0] + "-subtract"
            } else {
                if (g[1] == "subtract") {
                    return g[0] + "-plus"
                }
            }
        };
        if (g[1] == "plus" && f.length == 0) {
            this.get_category(b, $(e).parent("div"))
        }
        if (g[1] != "item") {
            $(e).removeClass(a).addClass(d());
            f.toggle()
        }
    },
    addQuestionClick: function(d) {
        var e = $(d).data("question_id");
        var a = this.typeCur.data("sid");
        var c = $(d).data("question_origin");
        if (c == undefined) {
            c = 0
        }
        var b = $(".control-btn").index(d);
        if ($(d).children("span:visible").length > 0) {
            $(".control-btn").eq(b).removeClass("control-btn").addClass("control-btn-2");
            this.add_question(e, a, c, b, function() {
                $(".control-btn-2").removeClass("control-btn-2").addClass("control-btn")
            })
        } else {
            $(".control-btn").eq(b).removeClass("control-btn").addClass("control-btn-2");
            this.remove_question(e, a, c, b, function() {
                $(".control-btn-2").removeClass("control-btn-2").addClass("control-btn")
            })
        }
    },
    addQuestionsClick: function(d) {
        var a = this.typeCur.data("sid");
        var c = $(".control-btn").index(this);
        var e = "";
        var b = $(d).data("question_origin");
        if (b == undefined) {
            b = 0
        }
        $(".question-list .question-box").each(function() {
            var f = $(this).attr("data-question_id");
            e += "," + f
        });
        e = e.substr(1);
        this.add_questions(e, a, b, c, function() {
            $(".all_in_2").removeClass("all_in_2").addClass("all_in")
        })
    },
    filterQuestionClick: function(b) {
        if ($(b).attr("class") == "active") {
            return false
        }
        $(b).parents("ul").find("a").removeClass("active");
        $(b).addClass("active");
        var a = this.getUrlData();
        this.get_question(a)
    },
    get_question: function(a, b) {
        if (b != true) {
            $(".all_in").removeClass("all_in").addClass("all_in_2");
            Common.floatLoading.showLoading()
        }
        a.ver = (new Date).valueOf();
        $.tizi_ajax({
            url: baseUrlName + "paper/question/get_question",
            type: "GET",
            dataType: "json",
            data: a,
            success: function(c) {
                $(".all_in_2").removeClass("all_in_2").addClass("all_in");
                Common.floatLoading.hideLoading();
                if (c.errorcode == true) {
                    $(".question-list").html(c.html);
                    if ($(".question-box").length < 1) {
                        $(".all_in").hide()
                    } else {
                        $(".all_in").show()
                    }
                    $(".mainContainer .content").css("height", $(".mainContainer .content").height()).css("overflow-y", "scroll");
                    $(".question-list .question-box").first().find("a.control-btn").find(".cBtnNormal").addClass("fl");
                    $(".question-list .question-box").first().find("a.control-btn").find("em").addClass("fl");
                    $(".question-list .question-box").first().find("a.control-btn").prepend('<div class="all_in cBtnNormal fl" style="margin-right:5px;"><a class="addAllPaper"><i>将本页题目全部加入试卷</i></a></div>')
                } else {
                    $.tiziDialog({
                        content: c.error
                    })
                }
            }
        })
    },
    get_category: function(a, b) {
        $.tizi_ajax({
            url: baseUrlName + "paper/question/get_category",
            type: "GET",
            dataType: "json",
            data: {
                cnselect: a,
                ver: (new Date).valueOf()
            },
            success: function(g) {
                if (g.errorcode == true) {
                    var c = g.category.length;
                    var f = g.category;
                    for (var e = 0; e < c; e++) {
                        if (f[e].is_leaf == 0) {
                            switch (e) {
                                case c - 1:
                                    f[e].is_leaf = "bottom-plus";
                                    break;
                                default:
                                    f[e].is_leaf = "top-plus";
                                    break
                            }
                        } else {
                            switch (e) {
                                case c - 1:
                                    f[e].is_leaf = "bottom-item";
                                    break;
                                default:
                                    f[e].is_leaf = "normal-item";
                                    break
                            }
                        }
                    }
                    var d = $("#tree-list-content").html();
                    var h = Mustache.to_html(d, g);
                    if (b) {
                        b.after(h)
                    } else {
                        $(".tree-list").html(h)
                    }
                } else {
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    add_question: function(d, a, c, b, e) {
        $.tizi_ajax({
            url: baseUrlName + "paper/question/add_question_to_paper",
            type: "POST",
            dataType: "json",
            data: {
                qid: d,
                sid: a,
                qorigin: c
            },
            success: function(f) {
                e();
                if (f.errorcode == true) {
                    $(".control-btn").eq(b).addClass("add-true");
                    $(".control-btn").eq(b).removeClass("add-false");
                    paper_common.randerCart(f.question_cart)
                } else {
                    $.tiziDialog({
                        content: f.error
                    })
                }
            }
        })
    },
    add_questions: function(d, a, c, b, f) {
        var e = {
            qids: d,
            sid: a,
            qorigin: c
        };
        $.tizi_ajax({
            url: baseUrlName + "paper/question/add_questions_to_paper",
            type: "POST",
            dataType: "json",
            data: e,
            success: function(g) {
                f();
                if (g.errorcode == true) {
                    $(".add-false").addClass("add-true").removeClass("add-false");
                    paper_common.randerCart(g.question_cart)
                } else {
                    paper_common.randerCart(g.question_cart);
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    remove_question: function(d, a, c, b, e) {
        $.tizi_ajax({
            url: baseUrlName + "paper/question/remove_question_from_paper",
            type: "POST",
            dataType: "json",
            data: {
                qid: d,
                sid: a,
                qorigin: c
            },
            success: function(f) {
                e();
                if (f.errorcode == true) {
                    $(".control-btn").eq(b).addClass("add-false");
                    $(".control-btn").eq(b).removeClass("add-true");
                    paper_common.randerCart(f.question_cart)
                } else {
                    $.tiziDialog({
                        content: f.error
                    })
                }
            }
        })
    },
    page: function(a) {
        this.get_question(this.getUrlData(a))
    }
};


/*$('body').append(__template1__({}));
$('#template1').remove();*/

paper_common.init();
$('.tempSubject').hide();
testpaper.init();