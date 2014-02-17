var subjectSlidown = function() {
    $(".currentSubject").hover(function() {
        $(this).find(".bd").show()
    }, function() {
        $(this).find(".bd").hide()
    })
};
subjectSlidown();
var siderBar = {
    init: function() {
        var that = this;
        this.questionCart = $(".question-cart");
        this.subjectLink = $(".subject-chose"),
        this.questionCart.on("click", "a.del-btn", function() {
            var a = this;
            that.delQuestionCartClick(a)
        });
        this.questionCart.on("click", "a.empty-btn", function() {
            that.emptyQuestionCartClick()
        });

    },
    randerCart: function(b) {
        if (b != undefined) {
            var cart =new NC.reMarker().proc($('#question_cart_content').html(),b);

            this.questionCart.html(cart);
            this.percentShow();
        }
    },
    randerQuestion: function() {
        return
    },
    delQuestionCartClick: function(a) {
        var that = this;
        var c = $(a).data("id");
        var b = this.subjectLink.data("subject");
        if ($(a).parent().parent().children(".second-col").text() == "0") {
            return false
        } else {
            $.tiziDialog({
                content: "确定清空当前题型？",
                ok: function() {
                    var d = that;
                    d.remove_question_from_cart(c, b, function() {
                        $("#question-type" + c).find(".question-item-box").remove();
                        $("#menu-outer-ul-question-type" + c).find(".question-item").remove();
                        d.orderSort();
                        d.orderType()
                    }, function() {})
                },
                cancel: true
            })
        }
    },
    emptyQuestionCartClick: function() {
        var that = this;
        var c = 0;
        var b = $(".subject-chose").data("subject");
        var a = 0;
        $(".question-table").find(".second-col").each(function(d) {
            a = a + parseInt($(this).text())
        });
        if (a == "0") {
            return false
        } else {
            $.tiziDialog({
                content: "确定清空全部题型？",
                ok: function() {
                    var d = that;
                    d.remove_question_from_cart(c, b, function() {
                        $(".paper-body").find(".ui-sortable").empty();
                        $(".preview-content").find(".question-type-box").find(".question-item-box").remove();
                        d.orderSort();
                        d.orderType()
                    }, function() {})
                },
                cancel: true
            })
        }
    },
    get_question_cart: function(a) {
        $(".preview-btn").hide();
        var that = this;
        var a = {
            "question_cart": {
                "question_list": [],
                "question_type_list": [{
                    "name": "a",
                    "count": 0,
                    "id": 432604
                }, {
                    "name": "b",
                    "count": 0,
                    "id": 432605
                }, {
                    "name": "c",
                    "count": 0,
                    "id": 432606
                }],
                "question_total": 0,
                "question_section_total": {
                    "1": 0,
                    "2": 0
                }
            },
            "errorcode": true,
            "token": ""
        };

        that.randerCart(a.question_cart);
        $(".preview-btn").show()
        return;
        $.tizi_ajax({
            url: baseUrlName + "paper/question/get_question_cart",
            type: "GET",
            dataType: "json",
            data: {
                sid: a,
                ver: (new Date).valueOf()
            },
            success: function(b) {
                if (b.errorcode == true) {
                    that.randerCart(b.question_cart);
                    $(".preview-btn").show()
                } else {
                    $.tiziDialog({
                        content: b.error
                    })
                }
            }
        })
    },
    remove_question_from_cart: function(b, a, e, d) {
        var c = that;
        $.tizi_ajax({
            url: baseUrlName + "paper/question/remove_question_from_cart",
            type: "POST",
            dataType: "json",
            data: {
                qtype: b,
                sid: a
            },
            success: function(f) {
                if (f.errorcode == true) {
                    e();
                    c.randerCart(f.question_cart);
                    c.randerQuestion()
                } else {
                    d();
                    $.tiziDialog({
                        content: f.error
                    });
                }
            }
        })
    },
    percentShow: function() {
        var b = parseInt($(".memberCenter").find('h4').children("span").text());
        var a = [];
        $(".second-col").each(function(d, e) {
            a.push(parseInt($(this).text()));
        });
        var c = $.map(a, function(d) {
            if (b === 0) {
                return 0;
            } else {
                return Math.round(d * 100 / b);
            }
        });
        $(".percent-text span").each(function(d, e) {
            $(this).text(c[d]);
        });
        $(".percent-line").each(function(d, e) {
            $(this).width(Math.round(c[d] / 2));
        });
    },
    orderSort: function(b) {
        var a = this.mainContainer.find(".question-index");
        var b = this.childMenu.find(".list-order");
        b.each(function(c, d) {
            $(d).text(c + 1)
        });
        a.each(function(c, d) {
            $(d).text(c + 1 + "、")
        })
    },
    orderType: function() {
        var a = $(".preview-content").find(".type-title-nu");
        var b = $(".child-menu").find(".menu-questiontype-nu");
        a.each(function(c, d) {
            $(d).text(c + 1)
        });
        b.each(function(c, d) {
            $(d).text(c + 1)
        });
        Teacher.paper.common.number_change(".type-title-nu");
        Teacher.paper.common.number_change(".menu-questiontype-nu")
    }
};
siderBar.init();

siderBar.get_question_cart(siderBar.subjectLink.data("subject"));

//Teacher.paper.paper_common.init();
//Teacher.paper.testpaper.init();
//Common.tips.status('paper_question');
//Common.tipsInfo.status('paperQuestionTips');