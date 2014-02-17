var Teacher = {};
Teacher.hiddenArrowHeight = function(b, a) {
    $(b).height($(window).height() - 80);
    $(a).css("margin-top", ($(window).height() - 80) / 2)
};
Teacher.tableStyleFn = function() {
    $(".tableStyle tr").hover(function() {
        $(this).addClass("tdf1").siblings().removeClass("tdf1")
    }, function() {
        $(".tableStyle tr").removeClass("tdf1")
    })
};
Teacher.tableStyleFn();
if (screen.width == 1024 && $.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
    $(".question-list").css("width", "97%").css("overflow", "hidden")
}
Teacher.typeListUlHeight = function() {
    var a = $(".child-menu .type-box .type-list");
    if (a.length > 0) {
        a.each(function(b) {
            $(this).find("ul").css("width", "178px");
            if (b == 1) {
                $(this).find("ul").css("margin-left", "-92px")
            }
            if ($(this).find("ul").height() > 300) {
                $(this).find("ul").css("height", "300px")
            } else {
                $(this).find("ul").css("height", "auto")
            }
        })
    }
    if (a.length == 1) {
        a.find("ul").css("width", "138px")
    }
};
Teacher.typeListUlHeight();
Teacher.commonHeight = function() {
    var b = $(window).height();
    var a = $(window).width();
    var c = b - 80;
    $(".child-content .content-wrap").height(c);
    $(".child-menu").height(c);
    $(".drag-line").height(c);
    $(".hidden-arrow").height(c);
    $(".hidden-arrow a").css("margin-top", c / 2 - 10 + "px");
    $(".drag-handle").css("margin-top", c / 2 - 10 + "px");
    $(".main-menu").find(".tree-list").height(c - 32);
    Teacher.commonHiddenArrow()
};
Teacher.NewClassManage = {
    NewClassManageDialog: function() {
        $(".classTableHeight").height($(window).height() - 415).css("overflow-y", "scroll");
        var a = null;
        $(".class_manage_btn li").click(function() {
            $(this).addClass("active").siblings().removeClass("active");
            $(".classTableHeight").height($(window).height() - 415).css("overflow-y", "scroll");
            var b = $(".class_manage_btn li").index(this);
            $(".class_manage_con .cont").eq(b).show().siblings().hide()
        });
        $("#add_new_class").live("click", function() {
            $.tiziDialog({
                title: "加入已有班级",
                content: $("#inVislbleClass").html().replace("inVislbleClassForm_beta", "inVislbleClassForm"),
                icon: null,
                width: 400,
                ok: function() {
                    $(".inVislbleClassForm").submit();
                    return false
                },
                cancel: true
            });
            Common.valid.classManage.invite()
        });
        $("#create_new_class").live("click", function() {
            $.ajax({
                url: baseUrlName + "class/create/ms",
                type: "GET",
                dataType: "json",
                success: function(c, b) {
                    if (c.subject_type > 0) {
                        $("#teacher_subject").val(c.subject_type)
                    }
                }
            });
            $.tiziDialog({
                id: "create_new_classId",
                title: "创建新班级",
                content: $("#creatNewClass").html().replace("creatNewClassForm_beta", "creatNewClassForm"),
                icon: null,
                width: 400,
                ok: function() {
                    $(".creatNewClassForm").submit();
                    return false
                },
                cancel: true
            });
            Common.valid.classManage.creat()
        });
        $(".quitClass").live("click", function() {
            var c = $(this);
            var d = $(this).attr("name");
            var b = $(this).attr("data-id");
            $.tiziDialog({
                title: "退出班级",
                content: $("#quitClassPop").html().replace("%classname%", d),
                icon: null,
                width: 400,
                ok: function() {
                    $.tizi_ajax({
                        url: baseUrlName + "class/leave/teacher",
                        type: "POST",
                        dataType: "json",
                        data: {
                            class_id: b
                        },
                        success: function(e) {
                            if (e.code == 1) {
                                $.tiziDialog({
                                    content: e.msg,
                                    icon: "succeed",
                                    ok: function() {
                                        window.location.reload()
                                    }
                                })
                            } else {
                                if (e.code == -999) {
                                    Teacher.NewClassManage.show_login()
                                } else {
                                    $.tiziDialog({
                                        content: e.msg
                                    })
                                }
                            }
                        },
                        error: function() {
                            $.tiziDialog({
                                content: "系统忙，请稍后再试"
                            })
                        }
                    })
                },
                cancel: true
            })
        });
        $(".deleteClass").live("click", function() {
            var c = $(this);
            var d = $(this).attr("name");
            var b = $(this).attr("data-id");
            $.tiziDialog({
                id: "deleteClassId",
                title: "解散班级",
                content: $("#deleteClassPop").html().replace("%classname%", d).replace("deleteClassPopForm_beta", "deleteClassPopForm"),
                icon: null,
                width: 400,
                ok: function() {
                    $(".deleteClassPopForm").submit();
                    return false
                },
                cancel: true
            });
            Common.valid.classManage.deleteClass(b)
        });
        $("#applyIn").live("click", function() {
            var b = $("#teacher_subject").val();
            var d = $("#realname").val();
            var c = $("#class_id").val();
            if (b == 0) {
                $.tiziDialog({
                    content: "请选择学科."
                })
            }
            if ($.trim(d) == "") {
                $.tiziDialog({
                    content: "请输入您的真实姓名."
                })
            }
            if (b > 0 && $.trim(d) !== "") {
                $.tizi_ajax({
                    url: baseUrlName + "class/apply/dot",
                    type: "POST",
                    dataType: "json",
                    data: {
                        subject_id: b,
                        realname: d,
                        class_id: c
                    },
                    success: function(e) {
                        if (e.code == 1) {
                            $.tiziDialog({
                                content: e.msg,
                                icon: "succeed",
                                ok: function() {
                                    window.location.href = e.redirect
                                }
                            })
                        } else {
                            if (e.code == -999) {
                                Teacher.NewClassManage.show_login()
                            } else {
                                $.tiziDialog({
                                    content: e.msg
                                })
                            }
                        }
                    },
                    error: function() {
                        $.tiziDialog({
                            content: "系统忙，请稍后再试"
                        })
                    }
                })
            }
        });
        $(".iapp .ratify").live("click", function() {
            var b = $(this);
            var c = $(this).parent().parent().attr("data-id");
            $.tizi_ajax({
                url: baseUrlName + "class/apply/accept",
                type: "POST",
                dataType: "json",
                data: {
                    apply_id: c
                },
                success: function(d) {
                    if (d.code == 1) {
                        $.tiziDialog({
                            content: d.msg,
                            icon: "succeed",
                            ok: function() {
                                b.parent().parent().remove()
                            }
                        })
                    } else {
                        if (d.code == -999) {
                            Teacher.NewClassManage.show_login()
                        } else {
                            $.tiziDialog({
                                content: d.msg
                            })
                        }
                    }
                },
                error: function() {
                    $.tiziDialog({
                        content: "系统忙，请稍后再试"
                    })
                }
            })
        });
        $(".iapp .refuse").live("click", function() {
            var b = $(this);
            var c = b.parent().parent().attr("data-id");
            $.tizi_ajax({
                url: baseUrlName + "class/apply/refuse",
                type: "POST",
                dataType: "json",
                data: {
                    apply_id: c
                },
                success: function(d) {
                    if (d.code == 1) {
                        $.tiziDialog({
                            content: d.msg,
                            icon: "succeed",
                            ok: function() {
                                b.parent().parent().remove()
                            }
                        })
                    } else {
                        if (d.code == -999) {
                            Teacher.NewClassManage.show_login()
                        } else {
                            $.tiziDialog({
                                content: d.msg
                            })
                        }
                    }
                },
                error: function() {
                    $.tiziDialog({
                        content: "系统忙，请稍后再试"
                    })
                }
            })
        });
        $("#alterClassGrade").live("click", function() {
            var b = $("#ClassGrade").text();
            $.tiziDialog({
                id: "alterClassGradeId",
                title: "修改班级名称",
                content: $("#alterClassGradePop").html().replace("alterClassGradePopForm_beta", "alterClassGradePopForm"),
                icon: null,
                width: 400,
                ok: function() {
                    $(".alterClassGradePopForm").submit()
                },
                cancel: true
            });
            $(".newClassGrade").val(b);
            Common.valid.classManage.alterClassGrade()
        });
        $(".province li").live("click", function() {
            var b = $(this).attr("data-id") == 2 || $(this).attr("data-id") == 25 || $(this).attr("data-id") == 27 || $(this).attr("data-id") == 32 || $(this).attr("data-id") == 33 || $(this).attr("data-id") == 34 || $(this).attr("data-id") == 35;
            if (b) {
                $(".city,.sctype,.school").hide()
            } else {
                $(".county,.school").hide()
            }
            if ($(this).attr("class") !== "active") {
                var d = $(this).attr("data-id");
                var c = $(this).attr("ismunicipality");
                $.ajax({
                    url: baseUrlName + "class/area?id=" + d,
                    type: "GET",
                    dataType: "json",
                    success: function(h, f) {
                        var e = "";
                        for (var g = 0; g < h.length; ++g) {
                            e += '<li data-id="' + h[g].id + '">' + h[g].name + "</li>"
                        }
                        if (c == 1) {
                            $(".county").html(e);
                            $(".county").fadeIn()
                        } else {
                            $(".city").html(e);
                            $(".city").fadeIn()
                        }
                    }
                })
            }
        });
        $(".city li").live("click", function() {
            if ($(this).attr("class") !== "active") {
                var b = $(this).attr("data-id");
                $.ajax({
                    url: baseUrlName + "class/area?id=" + b,
                    type: "GET",
                    dataType: "json",
                    success: function(f, d) {
                        var c = "";
                        for (var e = 0; e < f.length; ++e) {
                            c += '<li data-id="' + f[e].id + '">' + f[e].name + "</li>"
                        }
                        $(".county").html(c);
                        $(".county").css("display", "block")
                    }
                })
            }
        });
        $(".county li").live("click", function() {
            var b = '<li data-id="1">小学</li><li data-id="2">中学</li>';
            $(".sctype").html(b);
            $(".sctype").fadeIn()
        });
        $(".sctype li").live("click", function() {
            if ($(this).attr("class") !== "active") {
                var b = $(this).attr("data-id");
                var c = $(".aui_content .county li.active").attr("data-id");
                $.ajax({
                    url: baseUrlName + "class/schools?id=" + c + "&sctype=" + b,
                    type: "GET",
                    dataType: "json",
                    success: function(g, e) {
                        var d = "";
                        for (var f = 0; f < g.length; ++f) {
                            d += '<li data-id="' + g[f].id + '">' + g[f].schoolname + "</li>"
                        }
                        $(".school").html(d);
                        $(".school").css("display", "block")
                    }
                })
            }
        });
        $(".schooLocation li").live("click", function() {
            $(this).addClass("active").siblings().removeClass("active")
        });
        $("#resetSchool").live("click", function() {
            $.ajax({
                url: baseUrlName + "class/area?id=1",
                type: "GET",
                dataType: "json",
                success: function(e, c) {
                    var b = "";
                    for (var d = 0; d < e.length - 2; ++d) {
                        b += '<li data-id="' + e[d].id + '" ismunicipality="' + e[d].ismunicipality + '">' + e[d].name + "</li>"
                    }
                    $(".province").html(b);
                    $(".province").fadeIn()
                }
            });
            $.tiziDialog({
                title: "选择学校",
                top: 100,
                content: $("#resetSchoolPop").html().replace("resetSchoolPopCon_beta", "resetSchoolPopCon"),
                icon: null,
                width: 800,
                ok: function() {
                    if ($(".school li.active").length < 1) {
                        return
                    }
                    var c = $(".aui_content .school li.active").attr("data-id");
                    var b = $("#class_id").val();
                    $.tizi_ajax({
                        url: baseUrlName + "class/update_info/school",
                        type: "POST",
                        dataType: "json",
                        data: {
                            class_id: b,
                            school_id: c
                        },
                        success: function(e, d) {
                            if ($(".school").text() == "") {
                                return false
                            }
                            if (e.code == 1) {
                                $.tiziDialog({
                                    content: e.msg,
                                    icon: "succeed",
                                    ok: function() {
                                        $("#school").html(e.fullname);
                                        $("#lft_" + b).attr("title", e.school + $("#ClassGrade").html())
                                    }
                                })
                            } else {
                                if (e.code == -999) {
                                    Teacher.NewClassManage.show_login()
                                } else {
                                    $.tiziDialog({
                                        content: e.msg
                                    })
                                }
                            }
                        },
                        error: function() {
                            $.tiziDialog({
                                content: "系统忙，请稍后再试"
                            })
                        }
                    })
                },
                cancel: true,
                close: function() {
                    $(".city,.county,.sctype,.school").hide()
                }
            })
        });
        $("#resetSchoolYear").live("click", function() {
            $.tiziDialog({
                title: "选择学校",
                content: $("#resetSchoolYearPop").html(),
                icon: null,
                width: 400,
                ok: function() {
                    var c = $("#set_year").val();
                    var b = $("#set_year").attr("classid");
                    if ($("#class_year").html() == c) {
                        $.tiziDialog({
                            content: "班级入学年份修改成功.",
                            icon: "succeed"
                        })
                    } else {
                        $.tizi_ajax({
                            url: baseUrlName + "class/update_info/year",
                            type: "POST",
                            dataType: "json",
                            data: {
                                year: c,
                                class_id: b
                            },
                            success: function(e, d) {
                                if (e.code == 1) {
                                    $.tiziDialog({
                                        content: e.msg,
                                        icon: "succeed",
                                        ok: function() {
                                            $("#class_year").html(c)
                                        }
                                    })
                                } else {
                                    if (e.code == -999) {
                                        Teacher.NewClassManage.show_login()
                                    } else {
                                        $.tiziDialog({
                                            content: e.msg
                                        })
                                    }
                                }
                            },
                            error: function() {
                                $.tiziDialog({
                                    content: "系统忙，请稍后再试"
                                })
                            }
                        })
                    }
                },
                cancel: true
            })
        });
        $("#create_student_count").live("click", function() {
            $.tiziDialog({
                id: "create_student_countId",
                title: "创建账号",
                content: $("#createStudentCountPop").html().replace("createStudentCountPopForm_beta", "createStudentCountPopForm"),
                icon: null,
                width: 400,
                ok: function() {
                    $(".createStudentCountPopForm").submit();
                    return false
                },
                cancel: true
            });
            Common.valid.classManage.createStudent(class_id)
        });
        $("#create_student_menu").live("click", function() {
            var b = $.tiziDialog({
                id: "uploadStudentList",
                title: "生成账号",
                content: $("#createStudentBillPop").html().replace("fileField_beta", "fileField"),
                icon: null,
                width: 400,
                cancel: true,
                close: function() {
                    $("#fileField").uploadify("destroy");
                    $(".choseFile .error").remove()
                }
            });
            Teacher.NewClassManage.xls_student()
        });
        $(".rms").live("click", function() {
            var d = $(this);
            var c = $(this).attr("name");
            var b = $(this).attr("csid");
            $.tiziDialog({
                title: "请离本班",
                content: $("#kickonePop").html().replace("%role%", "学生").replace("%name%", c),
                icon: null,
                width: 400,
                ok: function() {
                    $.tizi_ajax({
                        url: baseUrlName + "class/remove/student",
                        type: "POST",
                        dataType: "json",
                        data: {
                            csid: b
                        },
                        success: function(f, e) {
                            if (f.code == 1) {
                                $.tiziDialog({
                                    content: f.msg,
                                    icon: "succeed",
                                    ok: function() {
                                        d.parent().parent().css("display", "none");
                                        var g = $("#student_total").html();
                                        $("#student_total").html(g - 1)
                                    }
                                })
                            } else {
                                if (f.code == -999) {
                                    Teacher.NewClassManage.show_login()
                                } else {
                                    $.tiziDialog({
                                        content: f.msg
                                    })
                                }
                            }
                        },
                        error: function() {
                            $.tiziDialog({
                                content: "系统忙，请稍后再试"
                            })
                        }
                    })
                },
                cancel: true
            })
        });
        $(".kickout").live("click", function() {
            var c = $(this);
            var b = $(this).attr("name");
            var d = $(this).attr("ctid");
            $.tiziDialog({
                title: "请离本班",
                content: $("#kickonePop").html().replace("%role%", "老师").replace("%name%", b),
                icon: null,
                width: 400,
                ok: function() {
                    $.tizi_ajax({
                        url: baseUrlName + "class/remove/teacher",
                        type: "POST",
                        dataType: "json",
                        data: {
                            ctid: d
                        },
                        success: function(f, e) {
                            if (f.code == 1) {
                                $.tiziDialog({
                                    content: f.msg,
                                    icon: "succeed",
                                    ok: function() {
                                        c.parent().parent().css("display", "none");
                                        var g = $("#teacher_total").html();
                                        $("#teacher_total").html(g - 1)
                                    }
                                })
                            } else {
                                if (f.code == -999) {
                                    Teacher.NewClassManage.show_login()
                                } else {
                                    $.tiziDialog({
                                        content: f.msg
                                    })
                                }
                            }
                        },
                        error: function() {
                            $.tiziDialog({
                                content: "系统忙，请稍后再试"
                            })
                        }
                    })
                },
                cancel: true
            })
        });
        $(".reset_password").live("click", function() {
            var c = $(this).attr("name");
            var b = $(this).attr("uid");
            var d = $("#class_id").val();
            var e = $(this);
            $.tiziDialog({
                title: "重置密码",
                content: $("#resetPasswordPop").html().replace("%name%", c),
                icon: null,
                width: 400,
                ok: function() {
                    $.tizi_ajax({
                        url: baseUrlName + "class/update_info/reset_password",
                        type: "POST",
                        dataType: "json",
                        data: {
                            user_id: b,
                            class_id: d
                        },
                        success: function(g, f) {
                            if (g.code == 1) {
                                $.tiziDialog({
                                    content: g.msg,
                                    icon: "succeed",
                                    ok: function() {
                                        $("#pwd_" + b).html(g.password)
                                    }
                                })
                            } else {
                                if (g.code == -999) {
                                    Teacher.NewClassManage.show_login()
                                } else {
                                    $.tiziDialog({
                                        content: g.msg
                                    })
                                }
                            }
                        },
                        error: function() {
                            $.tiziDialog({
                                content: "系统忙，请稍后再试"
                            })
                        }
                    })
                },
                cancel: true
            })
        });
        $(".rmcreate").live("click", function() {
            var b = $(this).attr("sid");
            var c = $(this);
            $.tiziDialog({
                title: "删除帐号",
                content: "是否删除该帐号?",
                icon: "question",
                width: 400,
                ok: function() {
                    $.tizi_ajax({
                        url: baseUrlName + "class/create_students/remove",
                        type: "POST",
                        dataType: "json",
                        data: {
                            sid: b
                        },
                        success: function(e, d) {
                            if (e.code == 1) {
                                $.tiziDialog({
                                    content: e.msg,
                                    icon: "succeed",
                                    ok: function() {
                                        c.parent().parent().remove();
                                        var f = $("#student_total").html();
                                        $("#student_total").html(f - 1)
                                    }
                                })
                            } else {
                                if (e.code == -999) {
                                    Teacher.NewClassManage.show_login()
                                } else {
                                    $.tiziDialog({
                                        content: e.msg
                                    })
                                }
                            }
                        },
                        error: function() {
                            $.tiziDialog({
                                content: "系统忙，请稍后再试"
                            })
                        }
                    })
                },
                cancel: true
            })
        });
        $(".parent_phone_mask").live("click", function() {
            var b = $(this).attr("uid");
            var d = $(this).attr("hash");
            var c = $(this);
            c.attr("class", "none");
            $.tizi_ajax({
                url: baseUrlName + "class/details/phone_mask",
                type: "POST",
                dataType: "json",
                data: {
                    uid: b,
                    hash: d
                },
                success: function(f, e) {
                    if (f.code == 1) {
                        c.html(f.phone)
                    } else {
                        $.tiziDialog({
                            content: "系统忙，请稍后再试"
                        });
                        c.attr("class", "parent_phone_mask")
                    }
                },
                error: function() {
                    $.tiziDialog({
                        content: "系统忙，请稍后再试"
                    })
                }
            })
        });
        $(".notify .ratify").live("click", function() {
            var c = $(this).attr("data-id");
            var b = $(this);
            $.tizi_ajax({
                url: baseUrlName + "class/notify/close",
                type: "POST",
                dataType: "json",
                data: {
                    notify_id: c
                },
                success: function(e, d) {
                    b.parent().parent().remove();
                    if ($(".inform li").length < 1) {
                        $("#notify_h2").css("display", "none")
                    }
                },
                error: function() {
                    $.tiziDialog({
                        content: "系统忙，请稍后再试"
                    })
                }
            })
        })
    },
    show_login: function() {
        $.tiziDialog({
            content: json.msg,
            icon: "question",
            ok: function() {
                window.location.href = baseUrlName + "login"
            },
            cancel: true
        })
    },
    xls_student: function() {
        var c = $("#class_id").val();
        var d = this;
        var b = [];
        var a = false;
        $("#fileField").uploadify({
            formData: $.tizi_token({
                class_id: c,
                session_id: $.cookies.get(baseSessID)
            }, "post"),
            swf: baseUrlName + "application/views/static/js/tools/upload_flash/uploadify.swf",
            uploader: baseUrlName + "upload/csxls?class_id=" + c,
            buttonClass: "choseFileBtn",
            button_image_url: false,
            buttonText: "上传文件",
            fileTypeExts: "*.xls; *.xlsx;",
            fileSizeLimit: "20MB",
            fileObjName: "fileField",
            multi: false,
            width: 115,
            height: 28,
            uploadLimit: 2,
            overrideEvents: ["onSelectError", "onDialogClose"],
            onSWFReady: function() {},
            onFallback: function() {
                $(".choseFile").html(noflash)
            },
            onSelectError: function(e, g, f) {
                switch (g) {
                    case -100:
                        $(".choseFile").find(".error").remove();
                        $.tiziDialog({
                            content: "每次最多上传5份文档"
                        });
                        break;
                    case -110:
                        $(".choseFile").find(".error").remove();
                        $.tiziDialog({
                            content: "文件 [" + e.name + "] 过大！每份文档不能超过20M"
                        });
                        break;
                    case -120:
                        $(".choseFile").find(".error").remove();
                        $.tiziDialog({
                            content: "文件 [" + e.name + "] 大小异常！不可以上传大小为0的文件"
                        });
                        break;
                    case -130:
                        $(".choseFile").find(".error").remove();
                        $.tiziDialog({
                            content: "文件 [" + e.name + "] 类型不正确！不可以上传错误的文件格式"
                        });
                        break
                }
                return false
            },
            onUploadSuccess: function(g, j, e) {
                var f = JSON.parse(j);
                $("#fileField").attr("disabled", true);
                $(".aui_footer button").attr("disabled", true);
                $(".choseFile").append('<img src="' + baseUrlName + 'application/views/static/image/tizi_dialog/icon/loading.gif"/>');
                if (f.code == 1) {
                    student_prepare = f.data;
                    $("#fileField").removeAttr("disabled");
                    $(".aui_footer button").removeAttr("disabled");
                    $(".choseFile").find("img").remove();
                    a = true
                } else {
                    $(".aui_footer button").removeAttr("disabled");
                    $("#fileField").removeAttr("disabled");
                    $(".choseFile").find("img").remove();
                    $(".choseFile").find(".error").remove();
                    var h = '<div class="error">' + g.name + f.msg + "</div>";
                    $(".choseFile").append(h)
                }
            },
            onUploadComplete: function(e) {
                if (a) {
                    $.tiziDialog.list.uploadStudentList.close();
                    $.tiziDialog({
                        content: "导入成功",
                        ok: function() {
                            window.location.reload()
                        },
                        close: function() {
                            window.location.reload()
                        }
                    })
                }
            }
        })
    },
    init: function() {
        Teacher.NewClassManage.NewClassManageDialog()
    }
};
$(function() {
    Teacher.NewClassManage.init()
});
Teacher.commonHiddenArrow = function() {
    $(".hidden-arrow a").click(function() {
        var a = $(this).attr("class");
        switch (a) {
            case "hide-menu":
                $(".main-menu").hide();
                $(".main-wrap").addClass("full-width");
                $(this).attr("class", "show-menu");
                break;
            case "show-menu":
                $(".main-menu").show();
                $(".main-wrap").removeClass("full-width");
                $(this).attr("class", "hide-menu");
                break
        }
    })
};
$(window).resize(function() {
    Teacher.commonHeight()
});
var TeacherAq = {};
TeacherAq.answerAdmin = {
    claimQuestionFn: function() {
        $(".claimQuestion input").click(function() {
            var a = $("#base-url-con").html();
            $.tizi_ajax({
                url: a + "teacher/aq_teacher/take_question",
                type: "POST",
                dataType: "json",
                data: {
                    question_id: $("#question_id").val()
                },
                success: function(c, b) {
                    if (c.errorcode == 1) {
                        window.location = a + "aq_teacher/aq_teacher/question_detail/" + $("#question_id").val()
                    } else {
                        $.tizi({
                            content: c.error
                        });
                        $.tizi({
                            content: c.error,
                            okc: function() {
                                window.location.reload()
                            }
                        })
                    }
                },
                error: function() {
                    $.tizi({
                        content: "系统忙，请稍后再试"
                    })
                }
            })
        })
    },
    aq_questionListFn: function() {
        $(".aq_questionList .box").click(function() {
            window.location.href = $(this).attr("url")
        });
        $(".aq_questionList .box").hover(function() {
            $(this).find(".bd").css("color", "#298d6a")
        }, function() {
            $(this).find(".bd").css("color", "")
        })
    },
    aq_my_questionListFn: function() {
        $(".aQuestionCon .cf").click(function() {
            window.open($(this).attr("url"))
        });
        $(".aQuestionCon li").hover(function() {
            $(this).find("p").css("color", "#298d6a").css("cursor", "pointer")
        }, function() {
            $(this).find("p").css("color", "").css("cursor", "default")
        })
    },
    aq_comment_pagination: function(b) {
        var a = $("#base-url-con").html();
        urls = a + "aq_teacher/aq_teacher/comments";
        if (b == "" || b == null || b == undefined) {
            b = ""
        }
        content = "";
        $.ajax({
            type: "GET",
            dataType: "text",
            url: urls,
            async: false,
            data: {
                rf: true,
                offset: b
            },
            success: function(c) {
                content = c;
                if (c != "") {
                    $(".comment_content").html(content)
                }
            }
        })
    },
    aq_my_question_pagination: function(b) {
        var a = $("#base-url-con").html();
        urls = a + "aq_teacher/aq_teacher/my_question";
        if (b == "" || b == null || b == undefined) {
            b = ""
        }
        content = "";
        $.ajax({
            type: "GET",
            dataType: "text",
            url: urls,
            async: false,
            data: {
                rf: true,
                offset: b,
                is_resolved: $("#is_resolved").val()
            },
            success: function(c) {
                content = c;
                if (c != "") {
                    $(".aQuestionCon").html(content)
                }
            }
        })
    },
    aq_upload_pic_answer: function() {
        var a = this;
        $(".aqupload").each(function() {
            var b = $(this);
            var d = baseUrlName + "application/views/static/image/answerquestion/loading.gif";
            var c = b.attr("id");
            $("#" + c).uploadify({
                formData: $.tizi_token({
                    session_id: $.cookies.get(baseSessID)
                }, "post"),
                swf: baseUrlName + "application/views/static/js/tools/upload_flash/uploadify.swf",
                uploader: baseUrlName + "aq_teacher/aq_teacher/upload?id=" + c,
                multi: false,
                buttonClass: "choseFileBtn",
                buttonText: "上传文件",
                fileTypeExts: "*.jpg; *.png;*.gif;*.bmp",
                fileSizeLimit: "512KB",
                fileObjName: c,
                width: 102,
                height: 28,
                overrideEvents: ["onSelectError", "onDialogClose"],
                onUploadStart: function(e) {
                    $("." + c).html('<img src="' + d + '" class="imgloading"/>')
                },
                onSWFReady: function() {},
                onFallback: function() {
                    $(".imgTips").html(noflash)
                },
                onSelectError: function(e, g, f) {
                    switch (g) {
                        case -110:
                            $.tiziDialog({
                                content: "文件 [" + e.name + "] 过大！每张图片不能超过0.5M"
                            });
                            break;
                        case -120:
                            $.tiziDialog({
                                content: "文件 [" + e.name + "] 大小异常！不可以上传大小为0的文件"
                            });
                            break;
                        case -130:
                            $.tiziDialog({
                                content: "文件 [" + e.name + "] 类型不正确！不可以上传错误的文件格式"
                            });
                            break
                    }
                    return false
                },
                onUploadSuccess: function(g, h, e) {
                    var f = JSON.parse(h);
                    if (f.code == 1) {
                        $("." + c).removeClass("red");
                        $("." + c).html('<img src="' + f.img_path + '" class="picture_urls"/>');
                        $("#_picture").val(f.img_path)
                    } else {
                        $("." + c).html("<b>" + f.msg + "</b>");
                        $("." + c).addClass("red")
                    }
                    $("." + c).siblings(".clearpic").show();
                    $("." + c).siblings(".clearpic").on("click", function() {
                        $("." + c).find("img").remove();
                        $("." + c).siblings(".clearpic").hide();
                        $("." + c).removeClass("red")
                    })
                },
                onUploadComplete: function(e) {}
            })
        })
    },
    aq_teacher_avatar: function() {
        var a = this;
        $(".aqupload").each(function() {
            var b = $(this);
            var d = baseUrlName + "application/views/static/image/answerquestion/loading.gif";
            var c = b.attr("id");
            $("#" + c).uploadify({
                formData: $.tizi_token({
                    session_id: $.cookies.get(baseSessID)
                }, "post"),
                swf: baseUrlName + "application/views/static/js/tools/upload_flash/uploadify.swf",
                uploader: baseUrlName + "aq_teacher/aq_teacher/upload?id=" + c,
                multi: false,
                buttonClass: "choseFileBtn",
                buttonText: "更换头像",
                fileTypeExts: "*.jpg; *.png;*.gif;*.bmp",
                fileSizeLimit: "512KB",
                fileObjName: c,
                width: 102,
                height: 28,
                overrideEvents: ["onSelectError", "onDialogClose"],
                onUploadStart: function(e) {},
                onSWFReady: function() {},
                onFallback: function() {
                    $(".imgTips").html(noflash)
                },
                onSelectError: function(e, g, f) {
                    switch (g) {
                        case -110:
                            $.tiziDialog({
                                content: "文件 [" + e.name + "] 过大！每张图片不能超过0.5M"
                            });
                            break;
                        case -120:
                            $.tiziDialog({
                                content: "文件 [" + e.name + "] 大小异常！不可以上传大小为0的文件"
                            });
                            break;
                        case -130:
                            $.tiziDialog({
                                content: "文件 [" + e.name + "] 类型不正确！不可以上传错误的文件格式"
                            });
                            break
                    }
                    return false
                },
                onUploadSuccess: function(g, h, e) {
                    var f = JSON.parse(h);
                    var j = "";
                    if (f.code == 1) {
                        j = f.img_path;
                        $("#_picture").val(j);
                        $.tizi_ajax({
                            url: baseUrlName + "aq_teacher/aq_teacher/edit_avatar",
                            type: "POST",
                            dataType: "json",
                            data: {
                                url: j
                            },
                            success: function(l, k) {
                                $("." + c).html('<img src="' + j + '" class="picture_urls"/>')
                            },
                            error: function() {}
                        })
                    } else {
                        $("." + c).html("<b>" + f.msg + "</b>");
                        $("." + c).addClass("red")
                    }
                },
                onUploadComplete: function(e) {}
            })
        })
    },
    aq_teacher_bindCheckInput: function() {
        var b = this;
        var a = 0;
        $("#subject_point input").click(function() {
            var c = $("#subject_point input");
            b.aq_teacher_point_input_checked();
            $(this).attr("checked") ? (a += 1) : (a -= 1);
            if (a > 3) {
                this.checked = "";
                a -= 1;
                b.aq_teacher_point_input_checked()
            } else {
                if (a == 3) {
                    b.aq_teacher_point_input_checked()
                } else {
                    for (var d = 0; d < c.length; d++) {
                        c[d].parentNode.style.color = "#000"
                    }
                }
            }
        })
    },
    aq_teacher_point_input_checked: function() {
        var e = 0;
        var d = $("#subject_point input");
        for (var c = 0; c < d.length; c++) {
            var a = [];
            if (d[c].checked == "") {
                a.push(d[c])
            } else {
                e += 1
            }
            for (var b = 0; b < a.length; a++) {
                a[b].checked = "";
                a[b].parentNode.style.color = "#ccc"
            }
        }
    },
    aq_teacher_add_answer: function() {
        $(".writedownanswer").click(function() {
            var a = $("#base-url-con").html();
            var b = "";
            $("input[name='checkbox']:checked").each(function() {
                b += $(this).val() + ","
            });
            TeacherAq.answerAdmin.setBtnClear($(this));
            $.tizi_ajax({
                url: a + "aq_teacher/aq_teacher/add_answer",
                type: "POST",
                dataType: "json",
                data: {
                    question_id: $("#question_id").val(),
                    text_answer: $("#content").html(),
                    picture_url: $("#_picture").val(),
                    diff: $('input[name="radio_diff"]:checked').val(),
                    points: b
                },
                success: function(d, c) {
                    if (d.errorcode == 1) {
                        alert("操作成功");
                        window.location.reload()
                    } else {
                        alert(d.error);
                        window.location.reload()
                    }
                },
                error: function() {
                    $.tizi({
                        content: "系统忙，请稍后再试",
                        okc: function() {
                            window.location.reload()
                        }
                    })
                }
            })
        })
    },
    setBtnClear: function(a) {
        var a = a;
        a.css({
            background: "#eee",
            color: "#2a8d6a",
            border: "1px solid #ddd"
        });
        a.attr("disabled", true)
    },
    scrollTitleMsgFn: function() {
        var b = "[新问题]有新的题目，请查看... ";
        var a;

        function c() {
            clearTimeout(a);
            document.title = b.substring(1, b.length) + b.substring(0, 1);
            b = document.title.substring(0, b.length);
            a = setTimeout(c, 1000)
        }

        c()
    }
};
Teacher.checkBoxDL = function(b) {
    var a = $(b).find("dt input");
    a.click(function() {
        var c = $(this).parent().parent().next().find("input");
        if ($(this).attr("checked") == "checked") {
            c.attr("checked", true)
        } else {
            c.attr("checked", false)
        }
    })
};
var isScrolled = false;
var startX = 0,
    startLevel = 0;
$("#diy_dot").mousedown(function(a) {
    if (!isScrolled) {
        isScrolled = true;
        startX = a.clientX;
        startLevel = a.target.offsetLeft + 5
    }
});
$("#diy_dot").mouseup(function(a) {
    isScrolled = false;
    startLevel = a.target.offsetLeft + 5
});
$(document).mousemove(function(b) {
    if (isScrolled) {
        var a = b.clientX - startX;
        var c = startLevel + a;
        c = c > 100 ? 100 : c;
        c = c < 0 ? 0 : c;
        if (c <= 100 && c >= 0) {
            $("#diy_scroll_left").width(c + "px");
            $("#diy_scroll_right").width(100 - c + "px");
            $("#diy_dot").attr("style", "left:" + (c - 5) + "px")
        }
        $("#selectDifNum").html((c / 100).toFixed(2))
    }
});
$(document).mouseup(function(a) {
    isScrolled = false
});
$(document).mouseup(function(a) {
    isScrolled = false
});
$(".deletestudent").click(function() {
    $("#del").show();
    $(".center_layer").show();
    $(this).attr("id")
});
$(".addstudent").click(function() {
    $("#add").show();
    $(".center_layer").show()
});
$(".invistudent").click(function() {
    $("#invi").show();
    $(".center_layer").show()
});
$(".modifypw").click(function() {
    $("#pw").show();
    $(".center_layer").show()
});
$(".closed").click(function() {
    $("#pw").hide();
    $("#del").hide();
    $("#add").hide();
    $("#invi").hide();
    $("#studentinfo").hide();
    $(".center_layer").hide()
});
$(".center_layer").height($(document).height());
$("#check1").click(function() {
    if ($("#check1").attr("checked") == false) {
        $(".checkn").attr("checked", "")
    } else {
        $(".checkn").attr("checked", "checked")
    }
});
$(".info_check").click(function() {
    if ($(".inner_check").attr("checked") == false) {
        $(".inner_check").attr("checked", "checked")
    } else {
        $(".inner_check").attr("checked", "")
    }
});
$(".copy1").click(function() {
    copyUrl2($(".copytext1"))
});
$(".copy2").click(function() {
    copyUrl2($(".copytext2"))
});

function copyUrl2(a) {
    a.select();
    document.execCommand("Copy");
    alert("已复制好，可贴粘。")
}
$(".copy1").click(function() {
    copyUrl2($(".copytext1"))
});
$(".copy2").click(function() {
    copyUrl2($(".copytext2"))
});

function copyUrl2(a) {
    a.select();
    document.execCommand("Copy");
    alert("已复制好，可贴粘。")
}
$(".ll_teacher_operation li a").each(function() {
    var b = $(".ll_teacher_operation li");
    for (var a = 0; a < b.length; a++) {
        b[a].index = a
    }
    $(this).click(function() {
        var c = $(".ll_teacher li").eq($(this).parent().attr("index")).attr("id");
        $(".center_layer").show();
        $(".classdel").show();
        $(".classdel_content p").html("这位老师的id是" + c);
        $(".ll_teacher li").eq($(this).parent().attr("index")).html('<a href="javascript:invi();">邀请</a>');
        $(this).html("")
    })
});
$(".closed").click(function() {
    $("#pw").hide();
    $("#del").hide();
    $("#add").hide();
    $("#invi").hide();
    $(".center_layer").hide()
});
$(".center_layer").height($(document).height());
$(".invistudent").click(function() {
    $("#invi").show();
    $(".center_layer").show()
});
$(".sub_wrong_win").hide();
$("#detials li").click(function() {
    $(".sub_wrong_win").show()
});
$(".sub_wrong_win h5 span").click(function() {
    $(".sub_wrong_win").hide()
});
$(".sub_wrong_win").hide();
$(".wrong_tree li span").click(function() {
    $(".sub_wrong_win").show()
});
$(".sub_wrong_win h5 span").click(function() {
    $(".sub_wrong_win").hide()
});
$(".classApply2 ul li").click(function() {
    $(this).addClass("on").siblings().removeClass("on");
    var a = $(".classApply ul li").index(this);
    $(".classmanage_table").eq(a).show().siblings().hide()
});

Teacher.paper = {};
Teacher.paper.common = {
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
Teacher.paper.paper_common = {
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
        Teacher.paper.paper_common.initBase();
        //Teacher.paper.paper_common.get_question_cart(this.subjectLink.data("subject"));
        $(window).resize(function() {
            Teacher.paper.paper_common.initBase()
        });
        this.menuLink.click(function() {
            var a = this;
            this.menuLink.removeClass("active");
            $(a).addClass("active")
        });
        this.subjectBox.hover(function() {
            var a = Teacher.paper.paper_common;
            a.subjectLink.addClass("subject-active");
            a.subjectList.show()
        }, function() {
            var a = Teacher.paper.paper_common;
            a.subjectLink.removeClass("subject-active");
            a.subjectList.hide()
        });
        this.hiddenArrow.click(function() {
            var a = this;
            Teacher.paper.paper_common.hiddenArrowClick(a)
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
Teacher.paper.homework_common = {
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
        Teacher.paper.homework_common.initBase();
        Teacher.paper.homework_common.get_question_cart(this.subjectLink.data("subject"));
        $(window).resize(function() {
            Teacher.paper.homework_common.initBase()
        });
        this.menuLink.click(function() {
            var a = this;
            this.menuLink.removeClass("active");
            $(a).addClass("active")
        });
        this.subjectBox.hover(function() {
            var a = Teacher.paper.homework_common;
            a.subjectLink.addClass("subject-active");
            a.subjectList.show()
        }, function() {
            var a = Teacher.paper.homework_common;
            a.subjectLink.removeClass("subject-active");
            a.subjectList.hide()
        });
        this.hiddenArrow.click(function() {
            var a = this;
            Teacher.paper.homework_common.hiddenArrowClick(a)
        });
        this.questionCart.on("click", "a.del-btn", function() {
            var a = this;
            Teacher.paper.homework_common.delQuestionCartClick(a)
        });
        this.questionCart.on("click", "a.empty-btn", function() {
            Teacher.paper.homework_common.emptyQuestionCartClick()
        })
    },
    randerQuestion: function() {
        return
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
    delQuestionCartClick: function(a) {
        var c = $(a).data("id");
        var b = this.subjectLink.data("subject");
        var a = $(a);
        if ($(a).parent().parent().children(".second-col").text() == "0") {
            return false
        } else {
            $.tiziDialog({
                content: "确定清空当前题型？",
                cancel: true,
                ok: function() {
                    var d = Teacher.paper.homework_common;
                    d.remove_question_from_cart(c, b, function() {
                        $("#question-type" + c).find(".question-item-box").remove();
                        $("#menu-outer-ul-question-type" + c).find(".question-item").remove();
                        var e = a.attr("data-id");
                        $("#question-type" + e).remove();
                        $("#menu-type-li-questiontype" + e).remove();
                        d.get_item_count();
                        d.orderSort();
                        d.orderType()
                    }, function() {})
                }
            })
        }
    },
    emptyQuestionCartClick: function() {
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
                content: "确定清空全部？",
                cancel: true,
                ok: function() {
                    var d = Teacher.paper.homework_common;
                    d.remove_question_from_cart(c, b, function() {
                        $(".paper-body").find(".ui-sortable").empty();
                        $(".preview-content").find(".question-type-box").find(".question-item-box").remove();
                        $(".child-list").remove();
                        d.get_item_count();
                        d.orderSort();
                        d.orderType()
                    }, function() {})
                }
            })
        }
    },
    get_question_cart: function(a) {
        $(".preview-btn").hide();
        $.tizi_ajax({
            url: baseUrlName + "paper/homework_question/get_question_cart",
            type: "GET",
            dataType: "json",
            data: {
                sid: a,
                ver: (new Date).valueOf()
            },
            success: function(b) {
                if (b.errorcode == true) {
                    Teacher.paper.homework_common.randerCart(b.question_cart);
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
        var c = Teacher.paper.homework_common;
        $.tizi_ajax({
            url: baseUrlName + "paper/homework_question/remove_question_from_cart",
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
                    })
                }
            }
        })
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
        $(".mainContainer").css("height", c).css("overflow-y", "auto");
        $(".mainContainer .content").css("height", c).css("overflow-y", "scroll");
        $(".preview-content").css("height", c - 80);
        $(".drag-line").css("height", c);
        $(".drag-line a").css("margin-top", c / 2 + "px");
        $(".ui-resizable-eu").css("height", c + 10);
        $(".child-menu").css("height", c - 10);
        var b = $(window).height();
        var a = $(window).width();
        var c = b - 80;
        $(".main-menu,.hidden-arrow,iframe").height(c);
        this.hiddenArrow.css("margin-top", c / 2 - 8 + "px")
    },
    percentShow: function() {
        var b = parseInt(this.mainMenu.find("h4").children("span").text());
        var a = [];
        $(".second-col").each(function(d, e) {
            a.push(parseInt($(this).text()))
        });
        var c = $.map(a, function(d) {
            if (b == 0) {
                return 0
            } else {
                return Math.round(d * 100 / b)
            }
        });
        $(".percent-text span").each(function(d, e) {
            $(this).text(c[d])
        });
        $(".percent-line").each(function(d, e) {
            $(this).width(Math.round(c[d] / 2))
        })
    },
    randerCart: function(b) {
        if (b != undefined) {
            var a = $("#question-cart-content").html();
            var c = Mustache.to_html(a, b);
            this.questionCart.html(c);
            this.percentShow()
        }
    },
    orderSort: function(a) {
        $(".child-list").each(function() {
            $(this).find(".menu-questiontype-nu").each(function(b, c) {
                $(c).text(b + 1)
            })
        });
        $(".child-list").each(function() {
            $(this).find(".list-order").each(function(b, c) {
                $(c).text(b + 1)
            })
        });
        $(".paper-type-box").each(function() {
            $(this).find(".question-index").each(function(b, c) {
                $(c).text(b + 1 + "、")
            })
        });
        Teacher.paper.common.number_change(".menu-questiontype-nu")
    },
    orderType: function() {
        var a = $(".preview-content").find(".type-title-nu:visible");
        a.each(function(b, c) {
            $(c).text(b + 1)
        })
    },
    get_item_count: function() {
        var a = $("#paper-type1 .question-item-box").length;
        var b = $("#paper-type2 .question-item-box").length;
        $("#paper-type1 .dd3").text("共" + a + "道");
        $("#paper-type2 .dd3").text("共" + b + "道")
    }
};
Teacher.paper.testpaper = {
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
        Teacher.paper.testpaper.page(1);
        Teacher.paper.testpaper.get_category(this.typeCur.data("cselect"));
        Teacher.paper.paper_common.randerQuestion = Teacher.paper.testpaper.randerQuestion;
        this.treeList.on("click", ".item", function() {
            var a = this;
            Teacher.paper.testpaper.treeItemClick(a)
        });
        this.treeList.on("click", ".icon", function() {
            var a = this;
            Teacher.paper.testpaper.treeListClick(a)
        });
        this.questionList.on("click", ".question-content", function() {
            var a = this;
            $(a).find(".answer").toggle()
        });
        this.questionList.on("click", ".all_in", function(b) {
            var a = this;
            b.stopPropagation();
            Teacher.paper.testpaper.addQuestionsClick(a);
            return false
        });
        this.questionList.on("click", ".control-btn", function() {
            var a = this;
            Teacher.paper.testpaper.addQuestionClick(a)
        });
        this.typeItem.click(function() {
            var a = this;
            var b = $(a).text();
            $(a).parent().parent().siblings("a").children("span").text(b)
        });
        this.typeOption.click(function() {
            Teacher.paper.testpaper.typeOption.hide()
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
        this.mainMenu.resizable({
            handles: "e",
            maxWidth: 390,
            minWidth: 190,
            resize: function() {
                var b = Teacher.paper.testpaper;
                var a = b.mainMenu.width() + 20;
                b.mainContent.css("margin-left", a + "px")
            }
        });
        this.filterLink.click(function() {
            var a = this;
            Teacher.paper.testpaper.filterQuestionClick(a)
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
        this_a = Teacher.paper.testpaper;
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
                    Teacher.paper.paper_common.randerCart(f.question_cart)
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
                    Teacher.paper.paper_common.randerCart(g.question_cart)
                } else {
                    Teacher.paper.paper_common.randerCart(g.question_cart);
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
                    Teacher.paper.paper_common.randerCart(f.question_cart)
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
Teacher.paper.homework = {
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
        Teacher.paper.homework.page(1);
        Teacher.paper.homework.get_category(this.typeCur.data("cselect"));
        Teacher.paper.homework_common.randerQuestion = Teacher.paper.homework.randerQuestion;
        this.treeList.on("click", ".item", function() {
            var a = this;
            Teacher.paper.homework.treeItemClick(a)
        });
        this.treeList.on("click", ".icon", function() {
            var a = this;
            Teacher.paper.homework.treeListClick(a)
        });
        this.questionList.on("click", ".all_in", function(a) {
            a.stopPropagation();
            Teacher.paper.homework.addQuestionsClick();
            return false
        });
        this.questionList.on("click", ".question-content", function() {
            var a = this;
            $(a).find(".answer").toggle()
        });
        this.questionList.on("click", ".control-btn", function() {
            var a = this;
            Teacher.paper.homework.addQuestionClick(a)
        });
        this.typeItem.click(function() {
            var a = this;
            var b = $(a).text();
            $(a).parent().parent().siblings("a").children("span").text(b)
        });
        this.typeOption.click(function() {
            Teacher.paper.testpaper.typeOption.hide()
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
        this.mainMenu.resizable({
            handles: "e",
            maxWidth: 390,
            minWidth: 190,
            resize: function() {
                var b = Teacher.paper.homework;
                var a = b.mainMenu.width() + 20;
                b.mainContent.css("margin-left", a + "px")
            }
        });
        this.filterLink.click(function() {
            var a = this;
            Teacher.paper.homework.filterQuestionClick(a)
        })
    },
    getBaseUrl: function() {
        var b = $(".mainContainer").attr("pagename");
        var a = [];
        a.homework_question = "paper/homework_question/";
        a.homework_exercise = "paper/homework_exercise/";
        return a[b]
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
        this_a = Teacher.paper.homework;
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
        $(".all_in").removeClass("all_in").addClass("all_in_2");
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
        var c = this.getBaseUrl();
        a.ver = (new Date).valueOf();
        $.tizi_ajax({
            url: baseUrlName + c + "get_question",
            type: "GET",
            dataType: "json",
            data: a,
            success: function(d) {
                $(".all_in_2").removeClass("all_in_2").addClass("all_in");
                Common.floatLoading.hideLoading();
                if (d.errorcode == true) {
                    $(".question-list").html(d.html);
                    if ($(".question-box").length < 1) {
                        $(".all_in").hide()
                    } else {
                        $(".all_in").show()
                    }
                    $(".mainContainer .content").css("height", $(".mainContainer .content").height() + "px").css("overflow-y", "scroll")
                } else {
                    $.tiziDialog({
                        content: d.error
                    })
                }
            }
        })
    },
    get_category: function(a, b) {
        var c = this.getBaseUrl();
        $.tizi_ajax({
            url: baseUrlName + c + "get_category",
            type: "GET",
            dataType: "json",
            data: {
                cnselect: a,
                ver: (new Date).valueOf()
            },
            success: function(h) {
                if (h.errorcode == true) {
                    var d = h.category.length;
                    var g = h.category;
                    for (var f = 0; f < d; f++) {
                        if (g[f].is_leaf == 0) {
                            switch (f) {
                                case d - 1:
                                    g[f].is_leaf = "bottom-plus";
                                    break;
                                default:
                                    g[f].is_leaf = "top-plus";
                                    break
                            }
                        } else {
                            switch (f) {
                                case d - 1:
                                    g[f].is_leaf = "bottom-item";
                                    break;
                                default:
                                    g[f].is_leaf = "normal-item";
                                    break
                            }
                        }
                    }
                    var e = $("#tree-list-content").html();
                    var j = Mustache.to_html(e, h);
                    if (b) {
                        b.after(j)
                    } else {
                        $(".tree-list").html(j)
                    }
                } else {
                    $.tiziDialog({
                        content: h.error
                    })
                }
            }
        })
    },
    add_question: function(d, a, c, b, f) {
        var e = this.getBaseUrl();
        $.tizi_ajax({
            url: baseUrlName + e + "add_question_to_paper",
            type: "POST",
            dataType: "json",
            data: {
                qid: d,
                sid: a,
                qorigin: c
            },
            success: function(g) {
                f();
                if (g.errorcode == true) {
                    $(".control-btn").eq(b).addClass("add-true");
                    $(".control-btn").eq(b).removeClass("add-false");
                    Teacher.paper.homework_common.randerCart(g.question_cart)
                } else {
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    add_questions: function(d, a, c, b, g) {
        var f = this.getBaseUrl();
        var e = {
            qids: d,
            sid: a,
            qorigin: c
        };
        $.tizi_ajax({
            url: baseUrlName + f + "add_questions_to_paper",
            type: "POST",
            dataType: "json",
            data: e,
            success: function(h) {
                g();
                if (h.errorcode == true) {
                    $(".add-false").addClass("add-true").removeClass("add-false");
                    Teacher.paper.homework_common.randerCart(h.question_cart)
                } else {
                    Teacher.paper.homework_common.randerCart(h.question_cart);
                    $.tiziDialog({
                        content: h.error
                    })
                }
            }
        })
    },
    remove_question: function(d, a, c, b, f) {
        var e = this.getBaseUrl();
        $.tizi_ajax({
            url: baseUrlName + e + "remove_question_from_paper",
            type: "POST",
            dataType: "json",
            data: {
                qid: d,
                sid: a,
                qorigin: c
            },
            success: function(g) {
                f();
                if (g.errorcode == true) {
                    $(".control-btn").eq(b).addClass("add-false");
                    $(".control-btn").eq(b).removeClass("add-true");
                    Teacher.paper.homework_common.randerCart(g.question_cart)
                } else {
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    page: function(a) {
        this.get_question(this.getUrlData(a))
    }
};
Teacher.paper.intelligent = {
    submitBtn: $("#intelligent_submit"),
    questionList: $(".question-list"),
    typeList: $(".typelist"),
    init: function() {
        this.submitBtn.click(function() {
            Teacher.paper.intelligent.submit_select()
        });
        this.questionList.on("click", ".question-content", function() {
            var a = this;
            $(a).find(".answer").toggle()
        });
        this.questionList.on("click", ".control-btn", function() {
            var a = this;
            Teacher.paper.testpaper.addQuestionClick(a)
        });
        this.questionList.on("click", ".all_in", function(a) {
            a.stopPropagation();
            Teacher.paper.testpaper.addQuestionsClick();
            return false
        });
        Teacher.paper.paper_common.randerQuestion = Teacher.paper.intelligent.randerQuestion;
        Teacher.paper.intelligent.selects(".typelist")
    },
    randerQuestion: function() {
        if ($(".question-box").length > 0) {
            this_a = Teacher.paper.intelligent;
            var a = $(".page").find(".active").html();
            if (a == undefined) {
                a = 1
            }
            this_a.page(a, true)
        }
    },
    selects: function(a) {
        Common.valid.intelligent.selects(a, function() {
            var b = 0;
            $(".paperValSum").each(function() {
                b += parseInt($(this).val())
            });
            if (b > 99) {
                $.tiziDialog({
                    content: "一张试卷只能加入99道题目，请控制题目数量。"
                });
                $("#intelligent_submit").addClass("BtnDisabled")
            } else {
                $("#intelligent_submit").removeClass("BtnDisabled")
            }
        })
    },
    submit_select: function() {
        if ($("#intelligent_submit").attr("class").indexOf("BtnDisabled") != -1) {
            return false
        }
        var b = $(".subject-chose").data("subject");
        var e = this.get_typeList();
        var c = this.get_categoryList();
        var f = $(".category_root").find("input").attr("data-id");
        var a = $("#selectDifNum").html();
        var d = $(".paperValSum").val();
        if (d > 99) {
            $.tiziDialog({
                content: "一张试卷只能加入99道题目，请控制题目数量。"
            })
        } else {
            if (e == "") {
                $.tiziDialog({
                    content: "请选择题型数量,题型数量不能为0"
                })
            } else {
                if (c == "") {
                    $.tiziDialog({
                        content: "请选择知识点，知识点不能为空"
                    })
                } else {
                    Common.floatLoading.showFloatLoading();
                    $.tizi_ajax({
                        type: "GET",
                        dataType: "json",
                        url: baseUrlName + "teacher/paper/intelligent/question",
                        data: {
                            sid: b,
                            typelist: e,
                            cids: c,
                            cid: f,
                            diff: a,
                            ver: (new Date).valueOf()
                        },
                        success: function(g) {
                            Common.floatLoading.hideFloatLoading();
                            if (g.errorcode == true) {
                                $(".question-list").html(g.html);
                                Teacher.paper.intelligent.auto_height()
                            } else {
                                $.tiziDialog({
                                    content: g.error
                                })
                            }
                        }
                    })
                }
            }
        }
    },
    get_typeList: function() {
        var a = "";
        $(".typelist").each(function() {
            if ($(this).find("input").val() != 0) {
                a += "," + $(this).find("select").attr("id") + "-" + $(this).find("input").val()
            }
        });
        a = a.substr(1);
        return a
    },
    get_categoryList: function() {
        var a = "";
        $("input[name='categorylist']:checkbox:checked").each(function() {
            a += "," + $(this).val()
        });
        a = a.substr(1);
        return a
    },
    page: function(c, b) {
        if (b != true) {
            $(".all_in").removeClass("all_in").addClass("all_in_2");
            Common.floatLoading.showLoading()
        }
        var a = $(".subject-chose").data("subject");
        $.tizi_ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + "paper/paper_intelligent/get_question",
            data: {
                sid: a,
                page: c,
                ver: (new Date).valueOf()
            },
            success: function(d) {
                $(".all_in_2").removeClass("all_in_2").addClass("all_in");
                Common.floatLoading.hideLoading();
                if (d.errorcode == true) {
                    $(".mainContainer").html(d.html);
                    Teacher.paper.intelligent.auto_height()
                } else {
                    $.tiziDialog({
                        content: d.error
                    })
                }
            }
        })
    },
    auto_height: function() {
        $(".question-list .question-box").first().find("a.control-btn").find(".cBtnNormal").addClass("fl");
        $(".question-list .question-box").first().find("a.control-btn").find("em").addClass("fl");
        $(".question-list .question-box").first().find("a.control-btn").prepend('<div class="all_in cBtnNormal fl" style="margin-right:5px;"><a class="addAllPaper"><i>将本页题目全部加入试卷</i></a></div>');
        $(".paperDetails").css("height", $(window).height() - $(".allPaper .path").height() - ($(".page").height()) - 92).css("overflow", "auto");
        $(".mainContainer").css("height", $(window).height() - $(".allPaper .path").height() - ($(".page").height()) - 42).css("overflow-y", "hidden")
    }
};
Teacher.paper.archive = {
    init: function() {
        Teacher.paper.archive.page()
    },
    getBaseUrl: function() {
        var b = $(".mainContainer").attr("pagename");
        var a = [];
        a.paper_archive = "paper/paper_archive/";
        a.homework_archive = "paper/homework_archive/";
        return a[b]
    },
    page: function(b) {
        var a = $("#filter_type").attr("data_type");
        this.randerPage(b, a)
    },
    randerPage: function(c, b) {
        var d = this.getBaseUrl();
        var a = $(".subject-chose").data("subject");
        if (c == "" || c == null || c == undefined) {
            c = ""
        }
        content = "";
        $.tizi_ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + d,
            async: false,
            data: {
                sid: a,
                rf: true,
                type: b,
                page: c,
                ver: (new Date).valueOf()
            },
            success: function(e) {
                if (e.errorcode) {
                    if (e != "") {
                        $(".archive_list").html(e.html)
                    }
                } else {
                    $.tiziDialog({
                        content: e.error
                    })
                }
            }
        })
    },
    delete_log: function(d, c, b) {
        var e = this.getBaseUrl();
        var a = $(".subject-chose").data("subject");
        if (d == "" || d == null || d == undefined) {
            d = ""
        }
        content = "";
        $.tizi_ajax({
            type: "POST",
            dataType: "json",
            url: baseUrlName + e + "delete_save_log",
            async: false,
            data: {
                sid: a,
                slid: b
            },
            success: function(f) {
                if (f.errorcode == true) {
                    Teacher.paper.archive.randerPage(1, c)
                }
                $.tiziDialog({
                    content: f.error
                })
            }
        })
    }
};
Teacher.paper.history = {
    init: function() {
        Teacher.paper.history.page()
    },
    getBaseUrl: function() {
        var b = $(".mainContainer").attr("pagename");
        var a = [];
        a.paper_history = "paper/paper_history/";
        a.homework_history = "paper/homework_history/";
        return a[b]
    },
    page: function(b) {
        var a = $("#filter_type").attr("data_type");
        this.randerPage(b, a)
    },
    randerPage: function(c, b) {
        var d = this.getBaseUrl();
        var a = $(".subject-chose").data("subject");
        if (c == "" || c == null || c == undefined) {
            c = ""
        }
        content = "";
        $.ajax({
            type: "GET",
            dataType: "text",
            url: baseUrlName + d,
            async: false,
            data: {
                sid: a,
                rf: true,
                type: b,
                page: c,
                ver: (new Date).valueOf()
            },
            success: function(e) {
                content = e;
                if (e != "") {
                    $(".download_list").html(content)
                }
            }
        })
    },
    download_log: function(b) {
        var c = this.getBaseUrl();
        var a = $(".subject-chose").data("subject");
        window.location.href = baseUrlName + c + "download?slid=" + b + "&sid=" + a
    }
};
Teacher.paper.homework_preview = {
    mainMenu: $(".child-menu"),
    mainContent: $(".child-content .content-wrap"),
    menuContainer: $(".paper-list-container"),
    mainContainer: $(".preview-content"),
    questionHandle: ".question-handle-box",
    questionItemBox: ".question-item-box",
    unitBox: ".unit-box",
    homework_demo: $("#demo a"),
    item_save_btn: $("#item_save_btn"),
    savePaper: $("#save-btn"),
    item_download_btn: $("#item_download_btn"),
    downAll: $("#down-all-btn"),
    typeHandle: ".type-handle-box",
    questionHandle: ".question-handle-box",
    questionItemBox: ".question-item-box",
    unitBox: ".unit-box",
    init: function() {
        Teacher.paper.homework_preview.boxInit();
        Teacher.paper.homework_preview.orderSort();
        $(window).resize(function() {
            Teacher.paper.homework_preview.boxInit()
        });
        Teacher.paper.homework_preview.init_homework_assign();
        $("body").on("click", "#assign-btn", function() {
            if ($(".question-type-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            Teacher.paper.homework_preview.get_teacher_classes()
        });
        $(".edit_btn1").click(function() {
            $("#download_title").attr("disabled", false);
            $(this).hide();
            $(".edit_btn2").show()
        });
        $(".edit_btn2").click(function() {
            $("#download_title").attr("disabled", true);
            $(this).hide();
            $(".edit_btn1").show()
        });
        this.homework_demo.click(function() {
            if ($(".question-type-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            var a = $("#demo").find("a").attr("id");
            $(this).attr("href", baseUrlName + "student/homework/demo/" + a)
        });
        this.item_save_btn.click(function() {
            Teacher.paper.homework_preview.saveBtnClick()
        });
        this.savePaper.click(function() {
            if ($(".question-type-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            $.tiziDialog({
                title: "题目归档",
                content: $(".saveHomeworkContent").html(),
                icon: null,
                width: 400,
                ok: function() {
                    Teacher.paper.homework_preview.saveBtnClick()
                },
                cancel: true
            });
            Teacher.paper.homework_preview.get_date()
        });
        this.item_download_btn.click(function() {
            Teacher.paper.homework_preview.downloadBtnClick()
        });
        this.downAll.click(function() {
            if ($(".question-type-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            Teacher.paper.homework_preview.downAllClick()
        });
        this.mainContainer.on("click", "a", function(b) {
            var a = this;
            Teacher.paper.homework_preview.nBtnClick(b, a)
        });
        this.mainMenu.on("click", ".menu-item-title", function() {
            var b = $(this);
            var a = "#" + b.parent().data("id");
            if ($(a).children(".handle-box").length > 0) {
                Teacher.paper.homework_preview.flashMask($(a).children(".handle-box"))
            } else {
                Teacher.paper.homework_preview.flashMask($(a))
            }
            Teacher.paper.homework_preview.goPosition($(a))
        });
        this.mainMenu.on("click", ".question-item", function() {
            var b = $(this);
            var a = "#" + b.data("id");
            Teacher.paper.homework_preview.flashMask($(a));
            Teacher.paper.homework_preview.goPosition($(a))
        });
        this.mainContent.on("click", ".question-item-box", function() {
            var b = $(this);
            var a = "#menu-" + b.attr("id");
            Teacher.paper.homework_preview.flashMask($(a), 171, 21)
        });
        this.mainContainer.on({
            mouseenter: function() {
                var a = $(this);
                $(this).parent(".paper-type-box").addClass("paper-type-hover")
            },
            mouseleave: function() {
                $(this).parent(".paper-type-box").removeClass("paper-type-hover")
            }
        }, Teacher.paper.homework_preview.typeHandle);
        this.mainContainer.on({
            mouseenter: function() {
                var b = $(this);
                $(this).parent(".question-type-box").addClass("question-type-hover");
                var a = $(this).parent(".question-type-box").find(".question-item-box").length;
                if (a == 0) {
                    $(this).parent(".question-type-box").find(".control-box").find(".text-icon").css("color", "grey")
                }
            },
            mouseleave: function() {
                $(this).parent(".question-type-box").removeClass("question-type-hover")
            }
        }, Teacher.paper.homework_preview.questionHandle);
        this.mainContainer.on({
            mouseenter: function() {
                $(this).addClass("question-item-hover")
            },
            mouseleave: function() {
                $(this).removeClass("question-item-hover")
            }
        }, Teacher.paper.homework_preview.questionItemBox);
        this.mainContainer.on({
            mouseenter: function() {
                $(this).addClass("hover")
            },
            mouseleave: function() {
                $(this).removeClass("hover")
            }
        }, Teacher.paper.homework_preview.unitBox);
        $(".set_cancle").click(function() {
            $(this).parent().parent().hide();
            $(".center_layer").hide();
            $(".ll_tip").hide();
            $(".Calendar").hide()
        });
        $(".closed").click(function() {
            $("#del").hide();
            $(".center_layer").hide()
        });
        $(".homeworkPaperChildMenu").height($(window).height() - 95);
        $(".homeworkPaperChildMenu .paper-list-container").height($(window).height() - 140);
        $(".previewContentPaper").height($(window).height() - 130).css("padding", "0").css("margin", "10px 0");
        $(".previewWrapWind").css("padding-right", "0px");
        $(".previewWrapWind .preview-content").height($(window).height() - 120).css("padding-top", "0px").css("margin-top", "10px")
    },
    nBtnClick: function(d, a) {
        this_a = $(a).find("span");
        if (this_a.attr("class") == "del-icon") {
            if (this_a.attr("opt") == "inner") {
                var f = "#q" + this_a.data("qid");
                var g = "#menu-q" + this_a.data("qid");
                $.tiziDialog({
                    content: "确定删除当前题目？",
                    cancel: true,
                    ok: function() {
                        var e = 0;
                        Teacher.paper.homework_preview.del_inner_question(this_a.data("qid"), e, function() {
                            $(f).remove();
                            $(g).remove();
                            Teacher.paper.homework_preview.orderSort();
                            Teacher.paper.homework_common.get_item_count()
                        }, function() {})
                    }
                })
            }
        }
        if (this_a.attr("class") == "up-icon") {
            if (this_a.attr("opt") == "inner") {
                var c = this_a.parent().parent().parent().parent().attr("id");
                var b = this.isFirstEle("#q" + this_a.data("qid"), "#" + c, ".question-item-box");
                if (b == 1 || b == 0) {
                    return
                }
                this.moveQuestion("#" + c, "#" + this_a.parent().parent().parent().attr("id"), "up", ".question-item-box");
                this.moveQuestion("#menu-outer-ul-" + c, "#menu-q" + this_a.data("qid"), "up", ".question-item");
                this.orderSort();
                $(".up-icon").removeClass("up-icon").addClass("up-icon-2");
                this.up_inner_question(c, function() {
                    $(".up-icon-2").addClass("up-icon").removeClass("up-icon-2")
                })
            }
        }
        if (this_a.attr("class") == "down-icon") {
            if (this_a.attr("opt") == "inner") {
                var c = this_a.parent().parent().parent().parent().attr("id");
                var b = this.isFirstEle("#q" + this_a.data("qid"), "#" + c, ".question-item-box");
                if (b == 1 || b == 2) {
                    return
                }
                this.moveQuestion("#" + c, "#" + this_a.parent().parent().parent().attr("id"), "down", ".question-item-box");
                this.moveQuestion("#menu-outer-ul-" + c, "#menu-q" + this_a.data("qid"), "down", ".question-item");
                this.orderSort();
                $(".down-icon").removeClass("down-icon").addClass("down-icon-2");
                this.up_inner_question(c, function() {
                    $(".down-icon-2").addClass("down-icon").removeClass("down-icon-2")
                })
            }
        }
        d.stopPropagation()
    },
    downAllClick: function() {
        if (this.downAll.attr("disabled") == "disabled") {
            return false
        }
        Teacher.paper.common.auth(function() {
            $.tiziDialog({
                title: "下载全部作业",
                content: $(".downloadBoxContent").html(),
                icon: null,
                width: 787,
                ok: function() {
                    Teacher.paper.homework_preview.downloadBtnClick()
                },
                cancel: true
            });
            $(".edit_btn1").click(function() {
                $("#download_title").attr("disabled", false);
                $(this).hide();
                $(".edit_btn2").show()
            });
            $(".edit_btn2").click(function() {
                $("#download_title").attr("disabled", true);
                $(this).hide();
                $(".edit_btn1").show()
            });
            Teacher.paper.homework_preview.get_date()
        })
    },
    downloadBtnClick: function() {
        var a = true;
        if ($(".download_box .homework_title").val() == "") {
            $(".download_box .set_box").append(title);
            a = false
        }
        if (a) {
            this_a = Teacher.paper.homework_preview;
            var c = $(".subject-chose").data("subject");
            var b = $("#download_title").val();
            this_a.downAll.removeAttr("id");
            this_a.downAll.find("i").html("下载中...");
            this_a.downAll.attr("disabled", "disabled");
            this.download(c, b, "all", function() {
                this_a = Teacher.paper.homework_preview;
                this_a.downAll.find("i").html("下载作业");
                this_a.downAll.attr("id", "down-all-btn");
                this_a.downAll.removeAttr("disabled")
            });
            $(".set_cancle").click()
        }
    },
    saveBtnClick: function() {
        var a = true;
        if ($(".item_save .homework_title").val() == "") {
            $(".item_save .set_box").append(title);
            a = false
        }
        if (a) {
            var c = $(".subject-chose").data("subject");
            var b = $("#save_title").val();
            $.tizi_ajax({
                url: baseUrlName + "paper/homework_archive/save",
                type: "POST",
                data: {
                    subject_id: c,
                    title: b
                },
                dataType: "json",
                success: function(d) {
                    $(".set_cancle").click();
                    $.tiziDialog({
                        content: d.error
                    })
                }
            })
        }
    },
    del_inner_question: function(g, d, f, e) {
        var c = baseUrlName + "paper/homework_question/remove_question_from_paper";
        var b = $(".subject-chose").data("subject");
        var a = {
            qid: g,
            sid: b,
            qorigin: d
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(h) {
                if (h.errorcode == true) {
                    f();
                    Teacher.paper.homework_common.randerCart(h.question_cart)
                } else {
                    e();
                    $.tiziDialog({
                        content: h.error
                    })
                }
            }
        })
    },
    up_inner_question: function(e, g) {
        var d = $("#" + e);
        var f = new Array();
        e = e.substr(13);
        d.find(".question-item-box").each(function(h, j) {
            f.push($(j).data("pqid"))
        });
        var c = baseUrlName + "paper/homework_paper/save_question_order";
        var b = $(".subject-chose").data("subject");
        var a = {
            qtype: e,
            sid: b,
            qorder: f.toString()
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(h) {
                if (h.errorcode == false) {
                    $.tiziDialog({
                        content: h.error
                    })
                }
                g()
            }
        })
    },
    assign_homework: function() {
        if ($(".publicBtnOver").hasClass("disabled")) {
            return false
        }
        $(".publicBtnOver").addClass("disabled");
        var a = baseUrlName + "paper/homework_archive/assign";
        var b = $(".subject-chose").data("subject");
        var g = $("#homework_title").val();
        var e = $("#calen1").val();
        var h = $("#calen2").val();
        var d = $('input[name="get"]:checked').attr("id").substr(3);
        var f = $("#homework_note").val();
        var c = "";
        $("input[name='get0']:checkbox:checked").each(function() {
            c += "," + $(this).attr("id").substr(5)
        });
        c = c.substr(1);
        var j = {
            sid: b,
            title: g,
            start_time: e,
            deadline: h,
            gaw: d,
            desc: f,
            cids: c
        };
        $.tizi_ajax({
            url: a,
            type: "post",
            dataType: "json",
            data: j,
            success: function(k) {
                $(".publicBtnOver").removeClass("disabled");
                if (k.errorcode) {
                    $.tiziDialog.list.assignHomework.close();
                    $.tiziDialog({
                        content: k.error,
                        ok: function() {
                            window.location.href = baseUrlName + "teacher/homework/center"
                        }
                    })
                } else {
                    $.tiziDialog({
                        content: k.error
                    })
                }
            }
        })
    },
    get_teacher_classes: function() {
        var c = baseUrlName + "homework/homework/get_teacher_classes";
        var b = $(".subject-chose").data("subject");
        var a = {
            sid: b,
            ver: (new Date).valueOf()
        };
        $.get(c, a, function(j) {
            if (j.errorcode) {
                var l = "";
                for (var k = 0; k < j.class_info.length; k++) {
                    var m = j.class_info[k].class_id;
                    var f = j.class_info[k].classname;
                    l += '<label class="checkBox" for="class' + m + '"><input type="checkbox" id="class' + m + '" name="get0" />' + f + "</label>"
                }
                $("#class_info").html(l);
                var n = '<div class="ll_tip ll_tip_title">请输入作业标题<span></span></div>';
                var d = '<div class="ll_tip ll_tip_start">请输入开始时间<span></span></div>';
                var h = '<div class="ll_tip ll_tip_end">请输入结束时间<span></span></div>';
                var o = '<div class="ll_tip ll_tip_answer">请输入答案解析<span></span></div>';
                var g = '<div class="ll_tip ll_tip_class">请输入布置班级<span></span></div>';
                var e = '<div class="ll_tip ll_tip_info">请输入作业说明<span></span></div>';
                $(".Calendar").remove();
                $.tiziDialog({
                    id: "assignHomework",
                    title: "布置作业",
                    content: $(".setHomeworkContent").html(),
                    icon: null,
                    width: 661,
                    ok: false,
                    cancel: true,
                    close: function() {
                        $(".Calendar").hide()
                    },
                    button: [{
                        name: "发布",
                        className: "publicBtnOver aui_state_highlight",
                        callback: function() {
                            var p = true;
                            if ($(".homework_title").val() == "") {
                                $(".set_box").append(n);
                                p = false
                            }
                            if ($(".homework_time").eq(0).val() == "") {
                                $(".set_box").append(d);
                                p = false
                            }
                            if ($(".homework_time").eq(1).val() == "") {
                                $(".set_box").append(h);
                                p = false
                            }
                            if ($(".homework_time").val() == "") {
                                $(".set_box").append(d);
                                p = false
                            }
                            if ($("#get1").attr("checked") == false && $("#get2").attr("checked") == false && $("#get3").attr("checked") == false) {
                                $(".set_box").append(o);
                                p = false
                            }
                            var q = "";
                            $("input[name='get0']:checkbox:checked").each(function() {
                                q += "," + $(this).attr("id").substr(5)
                            });
                            if (q == "") {
                                $(".set_box").append(g);
                                p = false
                            }
                            if (p) {
                                Teacher.paper.homework_preview.assign_homework()
                            }
                            return false
                        }
                    }]
                });
                if ($(".Calendar").length < 1) {
                    Common.calendar.calendarDate("calen1", "demo1");
                    Common.calendar.calendarDate("calen2", "demo2");
                    CalendarUnclick();
                    Teacher.paper.homework_preview.get_date()
                }
            } else {
                $(".set_cancle").click();
                if (j.class_info == "") {
                    $.tiziDialog({
                        okVal: "点此创建或加入班级",
                        ok: function() {
                            location.href = baseUrlName + "teacher/class/create"
                        },
                        content: j.error
                    })
                } else {
                    $.tiziDialog({
                        content: j.error
                    })
                }
            }
        }, "json")
    },
    download: function(g, j, c, b) {
        var h = baseUrlName + "paper/download/homework";
        var e = $("input[type=radio][name=page-size]:checked").val();
        var a = $("input[type=radio][name=paper-type]:checked").val();
        var d = $("input[type=radio][name=word]:checked").val();
        var f = {
            subject_id: g,
            title: j,
            download_type: c,
            paper_size: e,
            paper_version: d,
            paper_type: a
        };
        $.tizi_ajax({
            url: h,
            type: "POST",
            data: f,
            dataType: "json",
            success: function(l) {
                if (l.errorcode == false) {
                    $.tiziDialog({
                        content: l.error
                    })
                } else {
                    var k = baseUrlName + "download/paper?url=" + l.url + "&file_name=" + l.file_name + "&download_type=homework";
                    ga("send", "event", "Download-Homework", "Download", l.fname);
                    Common.Download.force_download(k, l.fname)
                }
                b()
            }
        })
    },
    moveQuestion: function(c, d, b, a) {
        var g = $(c).find(a).index($(d));
        var e = (b == "up") ? (g - 1) : (g);
        if (b == "up" && g == 0) {
            return
        }
        if (b == "down" && g == $(c).find(a).length - 1) {
            return
        }
        var f = $(d).clone();
        $(d).remove();
        if (b == "up") {
            $(c).find(a).eq(e).before(f)
        }
        if (b == "down") {
            $(c).find(a).eq(e).after(f)
        }
    },
    isFirstEle: function(d, b, e) {
        var c = $(b).find(e).index($(d));
        var a = $(b).find(e).length;
        if (a == 1) {
            return 1
        }
        if (c == 0) {
            return 0
        }
        if (c == $(b).find(e).length - 1) {
            return 2
        }
    },
    orderSort: function(a) {
        Teacher.paper.homework_common.orderSort(a);
        this.number_change()
    },
    orderType: function() {
        Teacher.paper.homework_common.orderType()
    },
    number_change: function() {
        Teacher.paper.common.number_change(".menu-questiontype-nu")
    },
    boxInit: function() {
        var a = $(window).height() - $(".header").height() - $(".footer").height();
        $(".child-menu").css("height", a + 20);
        $(".drag-line").css("height", a);
        $(".ui-resizable-e").css("height", a + 10);
        $(".drag-line a").css("margin-top", a / 2 + "px");
        $(".mainContainer").css("height", a);
        $(".mainContainer .content").css("height", a).css("overflow-y", "scroll");
        $(".mainContainer .preview-content").css("height", a - 50);
        this.menuContainer.height(this.mainMenu.height() - 50);
        this.mainContainer.height(this.mainContent.height() - 70)
    },
    flashMask: function(e, d, a) {
        var b = d || e.width();
        var c = a || e.height();
        e.prepend('<div class="mask"></div>');
        $(".mask").css({
            width: b,
            height: c
        }).fadeIn("fast", function() {
            $(".mask").fadeOut("fast", function() {
                $(".mask").remove()
            })
        })
    },
    goPosition: function(a) {
        this.mainContainer.scrollTop(0);
        this.mainContainer.scrollTop(a.offset().top - 90);
        return a
    },
    goPosWin: function(a) {
        $(a).addClass("active");
        $(".paper-set-win").scrollTop(0);
        $(".paper-set-win").scrollTop($(a).position().top - 40)
    },
    init_homework_assign: function() {
        $(".homework_time,.set_homework input,.textArea,.item_save input").click(function() {
            $(".ll_tip").hide()
        });
        $(".preview-title2 span").click(function() {
            $("#download_title").attr("disabled", true);
            $(".edit_btn2").hide();
            $(".edit_btn1").show();
            Teacher.paper.homework_preview.get_date()
        })
    },
    get_date: function() {
        var c = $("#navSlidown").find("span").text();
        var g = $(".subject-box .subject-chose").find("a").html();
        var d = g.replace(/ /g, "");
        var b = new Date();
        var a = b.getDate();
        var e = b.getMonth() + 1;
        var f = b.getFullYear();
        if (a < 10) {
            a = "0" + a
        }
        if (e < 10) {
            e = "0" + e
        }
        b = f + "-" + e + "-" + a;
        $("#homework_title").val("布置作业-" + c + "-" + d + "作业-" + Common.calendar.calendarTime());
        $("#download_title").val("下载作业-" + Common.calendar.calendarTime());
        $("#save_title").val("题目归档-" + Common.calendar.calendarTime())
    }
};
Teacher.paper.paper_preview = {
    mainMenu: $(".child-menu"),
    mainContent: $(".child-content .content-wrap"),
    menuContainer: $(".paper-list-container"),
    mainContainer: $(".preview-content"),
    typeList: $(".type-list"),
    typeCur: $(".current-type"),
    typeOption: $(".type-list ul"),
    typeItem: $(".type-list select"),
    typeHandle: ".type-handle-box",
    questionHandle: ".question-handle-box",
    questionItemBox: ".question-item-box",
    unitBox: ".unit-box",
    downWord: $("#down-word-btn"),
    downCard: $("#down-card-btn"),
    savePaper: $("#save-btn"),
    userUnit: $(".user-unit"),
    requestBtn: $("a.request-btn"),
    init: function() {
        Teacher.paper.paper_preview.boxInit();
        Teacher.paper.paper_preview.orderSort();
        Teacher.paper.paper_preview.initStyle();
        Teacher.paper.paper_preview.number_change();
        Teacher.paper.paper_preview.sortable_zujuan();
        $(window).resize(function() {
            Teacher.paper.paper_preview.boxInit()
        });
        this.mainContainer.on({
            mouseenter: function() {
                var a = $(this);
                $(this).parent(".paper-type-box").addClass("paper-type-hover")
            },
            mouseleave: function() {
                $(this).parent(".paper-type-box").removeClass("paper-type-hover")
            }
        }, Teacher.paper.paper_preview.typeHandle);
        this.mainContainer.on({
            mouseenter: function() {
                var b = $(this);
                $(this).parent(".question-type-box").addClass("question-type-hover");
                var a = $(this).parent(".question-type-box").find(".question-item-box").length;
                if (a == 0) {
                    $(this).parent(".question-type-box").find(".control-box").find(".text-icon").css("color", "grey")
                }
            },
            mouseleave: function() {
                $(this).parent(".question-type-box").removeClass("question-type-hover")
            }
        }, Teacher.paper.paper_preview.questionHandle);
        this.mainContainer.on({
            mouseenter: function() {
                $(this).addClass("question-item-hover")
            },
            mouseleave: function() {
                $(this).removeClass("question-item-hover")
            }
        }, Teacher.paper.paper_preview.questionItemBox);
        this.mainContainer.on({
            mouseenter: function() {
                $(this).addClass("hover")
            },
            mouseleave: function() {
                $(this).removeClass("hover")
            }
        }, Teacher.paper.paper_preview.unitBox);
        this.typeList.hover(function() {
            var a = Teacher.paper.paper_preview;
            a.typeOption.show()
        }, function() {
            var a = Teacher.paper.paper_preview;
            a.typeOption.hide()
        });
        this.typeItem.change(function() {
            var b = Teacher.paper.paper_preview;
            var a = $(this).val();
            $(".current-type").attr("sty", $(this).attr("sty"));
            switch (a) {
                case "default":
                    $(".icon-view").removeClass("hide");
                    $(".fn-hide").removeClass("fn-hide");
                    $(".current-type").attr("sty", "1");
                    break;
                case "static":
                    $(".icon-view").removeClass("hide");
                    $(".fn-hide").removeClass("fn-hide");
                    $("#menu-secret-mark .icon-view,#menu-student-info .icon-view,#menu-cent-box .icon-view").addClass("hide");
                    $("#secret-mark,#student-info,#cent-box").addClass("fn-hide");
                    $(".current-type").attr("sty", "2");
                    break;
                case "test":
                    $(".icon-view").removeClass("hide");
                    $(".fn-hide").removeClass("fn-hide");
                    $("#menu-paper-prititle .icon-view,#menu-separate-line .icon-view,#menu-secret-mark .icon-view,#menu-paper-info .icon-view,#menu-cent-box .icon-view,#menu-alert-info .icon-view,.list-type-title>.icon-view").addClass("hide");
                    $("#paper-prititle,#separate-line,#secret-mark,#paper-info,#cent-box,#alert-info,.paper-type-box>.handle-box,.deco-box").addClass("fn-hide");
                    $(".current-type").attr("sty", "3");
                    break;
                case "homework":
                    $("#menu-paper-prititle .icon-view,#menu-separate-line .icon-view,#menu-secret-mark .icon-view,#menu-paper-info .icon-view,#menu-cent-box .icon-view,#menu-alert-info .icon-view,#menu-student-info .icon-view,.list-title>.icon-view").addClass("hide");
                    $("#paper-prititle,#student-info,#separate-line,#secret-mark,#paper-info,#cent-box,#alert-info,.handle-box").addClass("fn-hide");
                    $(".current-type").attr("sty", "4");
                    break
            }
            b.typeOption.hide();
            b.ajax_struction()
        });
        this.mainMenu.on("click", ".icon-view", function() {
            if ($(".icon-view").attr("class").indexOf("disabled") > 0) {
                return false
            }
            $(".icon-view").addClass("disabled");
            var b = Teacher.paper.paper_preview;
            var d = $(this);
            var a = "#" + d.parent().data("id");
            var c;
            d.toggleClass("hide");
            if ($(a).children(".handle-box").length > 0) {
                c = $(a).children(".handle-box")
            } else {
                c = $(a)
            }
            c.toggleClass("fn-hide");
            if (c.is(":visible")) {
                b.flashMask(c);
                b.goPosition(c)
            }
            b.ajax_left_select()
        });
        this.mainMenu.on("click", ".menu-item-title", function() {
            var b = Teacher.paper.paper_preview;
            var c = $(this);
            var a = "#" + c.parent().data("id");
            if ($(a).children(".handle-box").length > 0) {
                b.flashMask($(a).children(".handle-box"))
            } else {
                b.flashMask($(a))
            }
            b.goPosition($(a))
        });
        this.mainMenu.on("click", ".question-item", function() {
            var b = Teacher.paper.paper_preview;
            var c = $(this);
            var a = "#" + c.data("id");
            b.flashMask($(a));
            b.goPosition($(a))
        });
        this.mainContent.on("click", ".question-item-box", function() {
            var b = Teacher.paper.paper_preview;
            var c = $(this);
            var a = "#menu-" + c.attr("id");
            b.flashMask($(a), 171, 16)
        });
        this.mainContainer.on("click", "a", function(b) {
            var a = this;
            Teacher.paper.paper_preview.nBtnClick(b, a)
        });
        this.mainMenu.on("click", ".set-btn", function() {
            var a = this;
            Teacher.paper.paper_preview.setBtnClick(a)
        });
        this.mainMenu.on("click", ".icon-set", function() {
            var a = this;
            Teacher.paper.paper_preview.setIcoBtnClick(a)
        });
        this.mainContainer.on("click", ".unit-box", function() {
            var a = this;
            Teacher.paper.paper_preview.setUnitBtnClick(a)
        });
        this.mainContainer.on("click", ".handle-box", function() {
            var a = this;
            Teacher.paper.paper_preview.setHandleBtnClick(a)
        });
        this.downWord.click(function() {
            if ($(".question-item-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            var a = this;
            Teacher.paper.paper_preview.downWordClick(a)
        });
        this.downCard.click(function() {
            if ($(".question-item-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            var a = this;
            Teacher.paper.paper_preview.open_downcard(a)
        });
        this.savePaper.click(function() {
            if ($(".question-item-box").length <= 0) {
                $.tiziDialog({
                    content: Teacher.paper.common.ErrorNoQuestion
                });
                return false
            }
            Teacher.paper.paper_preview.saveBtnClick()
        });
        this.mainMenu.on("click", ".reset-btn", function() {
            $.tiziDialog({
                content: "确定清空所有已选试题，并重置试卷结构？",
                cancel: true,
                ok: function() {
                    Teacher.paper.paper_preview.reset_paper()
                }
            })
        })
    },
    saveBtnClick: function() {
        if ($("#save-btn").attr("class").indexOf("disabled") > 0) {
            return false
        }
        $("#save-btn").addClass("disabled");
        var a = $(".subject-chose").data("subject");
        $.tizi_ajax({
            url: baseUrlName + "paper/paper_archive/save",
            type: "POST",
            data: {
                subject_id: a
            },
            dataType: "json",
            success: function(b) {
                $.tiziDialog({
                    content: b.error
                });
                $("#save-btn").removeClass("disabled")
            }
        })
    },
    downWordClick: function(a) {
        if (this.downWord.attr("disabled") == "disabled") {
            return false
        }
        Teacher.paper.common.auth(function() {
            Teacher.paper.paper_preview.open_download(a)
        })
    },
    open_download: function(a) {
        $.tiziDialog({
            title: "下载Word试卷",
            content: $("#down-paper-content").html().replace("downWin_tpl", "downWin"),
            icon: null,
            width: 787,
            ok: function() {
                a = Teacher.paper.paper_preview;
                a.downWord.removeAttr("id");
                a.downWord.find("i").html("下载中...");
                a.downWord.attr("disabled", "disabled");
                a.download("paper", function() {
                    a = Teacher.paper.paper_preview;
                    $(".down-word-btn").attr("id", "down-word-btn");
                    a.downWord.find("i").html("下载试卷");
                    a.downWord.removeAttr("disabled")
                })
            },
            cancel: true
        })
    },
    open_downcard: function(a) {
        if (this.downCard.attr("disabled") == "disabled") {
            return false
        }
        $.tiziDialog({
            title: "下载答题卡",
            content: $("#down-card-content").html().replace("downWin_tpl", "downWin"),
            icon: null,
            width: 787,
            ok: function() {
                a = Teacher.paper.paper_preview;
                a.downCard.removeAttr("id");
                a.downCard.find("i").html("下载中...");
                a.downCard.attr("disabled", "disabled");
                a.download("card", function() {
                    a = Teacher.paper.paper_preview;
                    $(".down-card-btn").attr("id", "down-card-btn");
                    a.downCard.find("i").html("下载答题卡");
                    a.downCard.removeAttr("disabled")
                })
            },
            cancel: true
        })
    },
    setHandleBtnClick: function(b) {
        var a = "#win-" + $(b).parent().attr("id");
        this.randerConfigBox(b);
        this.renderAlertBox();
        this.goPosWin(a);
        this.radio_render(".openwin-box")
    },
    setUnitBtnClick: function(b) {
        var a = "#win-" + $(b).attr("id");
        this.randerConfigBox(b);
        this.renderAlertBox();
        this.goPosWin(a);
        this.radio_render(".openwin-box")
    },
    setIcoBtnClick: function(b) {
        var a = "#win-" + $(b).parent().data("id");
        this.randerConfigBox(b);
        this.renderAlertBox();
        this.goPosWin(a);
        this.radio_render(".openwin-box")
    },
    setBtnClick: function(a) {
        this.randerConfigBox(a);
        this.renderAlertBox();
        this.radio_render(".openwin-box")
    },
    randerConfigBox: function(a) {
        $.tiziDialog({
            icon: null,
            width: 700,
            title: "试卷设置",
            cancel: true,
            content: '<div class="openwin-box">' + $("#setting-content").html() + "</div>",
            ok: function() {
                var d = Teacher.paper.paper_preview;
                var e = d.getOption($(".openwin-box"));
                var b = $(".subject-chose").data("subject");
                var c = baseUrlName + "paper/paper/save_paper_config";
                $.tizi_ajax({
                    url: c,
                    type: "POST",
                    dataType: "json",
                    data: {
                        config: e,
                        sid: b
                    },
                    success: function(g) {
                        if (g.errorcode == false) {
                            $.tiziDialog({
                                content: g.error
                            })
                        }
                    }
                });
                var f = new Function("return " + d.getOption($(".openwin-box"), "id"))();
                d.reRenderPage(f)
            }
        })
    },
    nBtnClick: function(g, b) {
        this_a = $(b).find("span");
        if (this_a.attr("class") == "del-icon") {
            if (this_a.attr("opt") == "inner") {
                var h = "#q" + this_a.data("qid");
                var j = "#menu-q" + this_a.data("qid");
                $.tiziDialog({
                    content: "确定删除当前题目？",
                    cancel: true,
                    ok: function() {
                        var e = this_a.data("qorigin");
                        Teacher.paper.paper_preview.del_inner_question(this_a.data("qid"), e, function() {
                            $(h).remove();
                            $(j).remove();
                            Teacher.paper.paper_preview.orderSort();
                            Teacher.paper.paper_preview.orderType()
                        }, function() {})
                    }
                })
            } else {
                var f = this_a.attr("refer");
                $.tiziDialog({
                    content: "确定清空并删除当前题型？",
                    cancel: true,
                    ok: function() {
                        Teacher.paper.paper_preview.del_question_type(this_a.attr("refer"), function() {
                            $("#question-type" + f).remove();
                            $("#menu-type-li-questiontype" + f).remove();
                            Teacher.paper.paper_preview.orderType();
                            Teacher.paper.paper_preview.orderSort()
                        }, function() {})
                    }
                })
            }
            this.orderType();
            this.orderSort()
        }
        if (this_a.attr("class") == "up-icon") {
            if (this_a.attr("opt") == "inner") {
                var d = this_a.parent().parent().parent().parent().attr("id");
                var c = this.isFirstEle("#q" + this_a.data("qid"), "#" + d, ".question-item-box");
                if (c == 1 || c == 0) {
                    return
                }
                this.moveQuestion("#" + d, "#" + this_a.parent().parent().parent().attr("id"), "up", ".question-item-box");
                this.moveQuestion("#menu-outer-ul-" + d, "#menu-q" + this_a.data("qid"), "up", ".question-item");
                this.orderSort();
                $(".up-icon").removeClass("up-icon").addClass("up-icon-2");
                this.up_inner_question(d, function() {
                    $(".up-icon-2").addClass("up-icon").removeClass("up-icon-2")
                })
            } else {
                var d = "#question-type" + this_a.attr("refer");
                if (this_a.attr("papertype") == "1") {
                    var c = this.isFirstEle(d, "#paper-type1", ".question-type-box");
                    if (c == 1 || c == 0) {
                        g.stopPropagation();
                        return
                    }
                    this.moveQuestion("#paper-type1", d, "up", ".question-type-box");
                    this.moveQuestion("#menu-paper1-con", "#menu-type-li-questiontype" + this_a.attr("refer"), "up", ".menu-type-li");
                    $(".up-icon").removeClass("up-icon").addClass("up-icon-2");
                    this.up_question_type("paper-type1", function() {
                        $(".up-icon-2").addClass("up-icon").removeClass("up-icon-2")
                    })
                } else {
                    var c = this.isFirstEle(d, "#paper-type2", ".question-type-box");
                    if (c == 1 || c == 0) {
                        g.stopPropagation();
                        return
                    }
                    this.moveQuestion("#paper-type2", d, "up", ".question-type-box");
                    this.moveQuestion("#menu-paper2-con", "#menu-type-li-questiontype" + this_a.attr("refer"), "up", ".menu-type-li");
                    this.sortable_zujuan();
                    $(".up-icon").removeClass("up-icon").addClass("up-icon-2");
                    this.up_question_type("paper-type2", function() {
                        $(".up-icon-2").addClass("up-icon").removeClass("up-icon-2")
                    })
                }
                this.orderType();
                this.orderSort()
            }
        }
        if (this_a.attr("class") == "down-icon") {
            if (this_a.attr("opt") == "inner") {
                var d = this_a.parent().parent().parent().parent().attr("id");
                var c = this.isFirstEle("#q" + this_a.data("qid"), "#" + d, ".question-item-box");
                if (c == 1 || c == 2) {
                    return
                }
                this.moveQuestion("#" + d, "#" + this_a.parent().parent().parent().attr("id"), "down", ".question-item-box");
                this.moveQuestion("#menu-outer-ul-" + d, "#menu-q" + this_a.data("qid"), "down", ".question-item");
                this.orderSort();
                $(".down-icon").removeClass("down-icon").addClass("down-icon-2");
                this.up_inner_question(d, function() {
                    $(".down-icon-2").addClass("down-icon").removeClass("down-icon-2")
                })
            } else {
                var d = "#question-type" + this_a.attr("refer");
                if (this_a.attr("papertype") == "1") {
                    var c = this.isFirstEle(d, "#paper-type1", ".question-type-box");
                    if (c == 1 || c == 2) {
                        g.stopPropagation();
                        return
                    }
                    this.moveQuestion("#paper-type1", d, "down", ".question-type-box");
                    this.moveQuestion("#menu-paper1-con", "#menu-type-li-questiontype" + this_a.attr("refer"), "down", ".menu-type-li");
                    $(".down-icon").removeClass("down-icon").addClass("down-icon-2");
                    this.up_question_type("paper-type1", function() {
                        $(".down-icon-2").addClass("down-icon").removeClass("down-icon-2")
                    })
                } else {
                    var c = this.isFirstEle(d, "#paper-type2", ".question-type-box");
                    if (c == 1 || c == 2) {
                        g.stopPropagation();
                        return
                    }
                    this.moveQuestion("#paper-type2", d, "down", ".question-type-box");
                    this.moveQuestion("#menu-paper2-con", "#menu-type-li-questiontype" + this_a.attr("refer"), "down", ".menu-type-li");
                    this.sortable_zujuan();
                    $(".down-icon").removeClass("down-icon").addClass("down-icon-2");
                    this.up_question_type("paper-type2", function() {
                        $(".down-icon-2").addClass("down-icon").removeClass("down-icon-2")
                    })
                }
                this.orderType();
                this.orderSort()
            }
        }
        if (this_a.attr("class") == "set-icon") {
            var a = "#win-" + $(b).parent().parent().parent().attr("id");
            $.tiziDialog({
                icon: null,
                width: 700,
                title: "试卷设置",
                cancel: true,
                content: '<div class="openwin-box">' + $("#setting-content").html() + "</div>",
                ok: function() {
                    var l = Teacher.paper.paper_preview;
                    var m = l.getOption($(".openwin-box"));
                    var e = $(".subject-chose").data("subject");
                    var k = baseUrlName + "paper/paper/save_paper_config";
                    $.tizi_ajax({
                        url: k,
                        type: "POST",
                        dataType: "json",
                        data: {
                            config: m,
                            sid: e
                        },
                        success: function(o) {
                            if (o.errorcode == false) {
                                $.tiziDialog({
                                    content: o.error
                                })
                            }
                        }
                    });
                    var n = new Function("return " + l.getOption($(".openwin-box"), "id"))();
                    l.reRenderPage(n)
                }
            });
            this.renderAlertBox();
            this.goPosWin(a);
            this.radio_render(".openwin-box")
        }
        if (this_a.attr("class") == "text-icon") {
            if (this_a.html() == "清空") {
                var f = this_a.attr("refer");
                $.tiziDialog({
                    content: "确定清空当前题型？",
                    cancel: true,
                    ok: function() {
                        Teacher.paper.paper_preview.clean_question_type(this_a.attr("refer"), function() {
                            $("#question-type" + f).find(".question-item-box").remove();
                            $("#menu-outer-ul-question-type" + f).find(".question-item").remove();
                            Teacher.paper.paper_preview.orderType();
                            Teacher.paper.paper_preview.orderSort()
                        }, function() {})
                    }
                })
            }
        }
        g.stopPropagation()
    },
    del_inner_question: function(g, d, f, e) {
        var c = baseUrlName + "paper/question/remove_question_from_paper";
        var b = $(".subject-chose").data("subject");
        var a = {
            qid: g,
            sid: b,
            qorigin: d
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(h) {
                if (h.errorcode == true) {
                    f();
                    Teacher.paper.paper_common.randerCart(h.question_cart)
                } else {
                    e();
                    $.tiziDialog({
                        content: h.error
                    })
                }
            }
        })
    },
    del_question_type: function(d, f, e) {
        var c = baseUrlName + "paper/paper/delete_question_type";
        var b = $(".subject-chose").data("subject");
        var a = {
            qtype: d,
            sid: b
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(g) {
                if (g.errorcode == true) {
                    f();
                    Teacher.paper.paper_common.randerCart(g.question_cart)
                } else {
                    e();
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    up_inner_question: function(e, g) {
        var d = $("#" + e);
        var f = new Array();
        e = e.substr(13);
        d.find(".question-item-box").each(function(h, j) {
            f.push($(j).data("pqid"))
        });
        var c = baseUrlName + "paper/paper/save_question_order";
        var b = $(".subject-chose").data("subject");
        var a = {
            qtype: e,
            sid: b,
            qorder: f.toString()
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(h) {
                if (h.errorcode == false) {
                    $.tiziDialog({
                        content: h.error
                    })
                }
                g()
            }
        })
    },
    up_question_type: function(e, g) {
        var d = $("#" + e);
        var f = new Array();
        d.find(".question-type-box").each(function(h, j) {
            f.push($(j).attr("id").substr(13))
        });
        var c = baseUrlName + "paper/paper/save_question_type_order";
        var b = $(".subject-chose").data("subject");
        var a = {
            sectiontype: e.substr(10),
            sid: b,
            qtorder: f.toString()
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(h) {
                if (h.errorcode == false) {
                    $.tiziDialog({
                        content: h.error
                    })
                }
                g()
            }
        })
    },
    ajax_move_question: function(f, e) {
        var d = $("#" + e).find(".question-item");
        var g = new Array();
        d.each(function(h, k) {
            var j = $(k).data("pqid");
            g.push(j)
        });
        var b = $(".subject-chose").data("subject");
        var c = baseUrlName + "paper/paper/move_question";
        var a = {
            qorder: g.toString(),
            pqid: f,
            qtype: e.substr(27),
            sid: b
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(h) {
                Teacher.paper.paper_common.randerCart(h.question_cart);
                if (h.errorcode == false) {
                    $.tiziDialog({
                        content: h.error
                    })
                }
            }
        })
    },
    clean_question_type: function(d, f, e) {
        var c = baseUrlName + "paper/question/remove_question_from_cart";
        var b = $(".subject-chose").data("subject");
        var a = {
            qtype: d,
            sid: b
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(g) {
                if (g.errorcode == true) {
                    f();
                    Teacher.paper.paper_common.randerCart(g.question_cart)
                } else {
                    e();
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    ajax_struction: function() {
        $("body").find("#temp-con-div").remove();
        $("body").append("<div id='temp-con-div' class='fn-hide'></div>");
        var e = Mustache.to_html($("#setting-content").html(), {});
        $("#temp-con-div").html(e);
        this.renderAlertBox("#temp-con-div");
        $("#temp-con-div").find(".radio-render-cent-verify").html("1");
        this.radio_render("#temp-con-div");
        var d = this.getOption($("#temp-con-div"));
        $("body").find("#temp-con-div").remove();
        switch (this.getStruc()) {
            case "3":
                d = this.changeIsCheckScore(d);
                break;
            case "4":
                d = this.changeIsCheckScore(d);
                break
        }
        var c = baseUrlName + "paper/paper/save_paper_config";
        var b = $(".subject-chose").data("subject");
        var a = {
            config: d,
            sid: b,
            type: this.getStruc()
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(f) {
                if (f.errorcode == false) {
                    $.tiziDialog({
                        content: f.error
                    })
                }
            }
        })
    },
    changeIsCheckScore: function(b) {
        var a = new Function("return " + b)();
        for (i in a) {
            if (a[i]["ischeckedscore"]) {
                a[i]["ischeckedscore"] = 0
            }
        }
        return JSON.stringify(a)
    },
    ajax_left_select: function() {
        $("body").find("#temp-con-div").remove();
        $("body").append("<div id='temp-con-div' class='fn-hide'></div>");
        var e = Mustache.to_html($("#setting-content").html(), {});
        $("#temp-con-div").html(e);
        this.renderAlertBox("#temp-con-div");
        this.radio_render("#temp-con-div");
        var d = this.getOption($("#temp-con-div"));
        $("body").find("#temp-con-div").remove();
        var c = baseUrlName + "paper/paper/save_paper_config";
        var b = $(".subject-chose").data("subject");
        var a = {
            config: d,
            sid: b
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(f) {
                $(".icon-view").removeClass("disabled");
                if (f.errorcode == false) {
                    $.tiziDialog({
                        content: f.error
                    })
                }
            }
        })
    },
    getStruc: function() {
        var a = $(".current-type").attr("sty");
        return a
    },
    reset_paper: function() {
        var c = baseUrlName + "paper/question/reset_paper";
        var b = $(".subject-chose").data("subject");
        var a = {
            sid: b
        };
        $.tizi_ajax({
            url: c,
            type: "POST",
            dataType: "json",
            data: a,
            success: function(d) {
                if (d.errorcode == true) {
                    $.tiziDialog({
                        ok: false,
                        content: d.error
                    });
                    location.href = baseUrlName + "teacher/paper/preview/" + b
                } else {
                    $.tiziDialog({
                        content: d.error
                    })
                }
            }
        })
    },
    setDownloadChecked: function(f, b, d) {
        var a = $("#down-" + f + "-content").find("input[type=radio][name=" + f + "_" + b + "]").length;
        for (var c = 0; c < a; c++) {
            var e = $("#down-" + f + "-content").find("input[type=radio][name=" + f + "_" + b + "]").eq(c);
            if (e.val() == d) {
                e.attr("checked", true)
            } else {
                e.attr("checked", false)
            }
        }
    },
    download: function(c, g) {
        var f = $(".downWin").find("input[type=radio][name=" + c + "_version]:checked").val();
        this.setDownloadChecked(c, "version", f);
        var b = $(".downWin").find("input[type=radio][name=" + c + "_type]:checked").val();
        this.setDownloadChecked(c, "type", b);
        var e = $(".subject-chose").data("subject");
        var d = {
            paper_version: f,
            paper_type: b,
            subject_id: e,
            download_type: c
        };
        if (c == "paper") {
            var a = $(".downWin").find("input[type=radio][name=paper_size]:checked").val();
            this.setDownloadChecked(c, "size", a);
            d.paper_style = "default";
            d.paper_size = a;
            baseuri = baseUrlName + "paper/download/paper"
        }
        if (c == "card") {
            baseuri = baseUrlName + "paper/download/card"
        }
        $.tizi_ajax({
            url: baseuri,
            type: "POST",
            data: d,
            dataType: "json",
            success: function(j) {
                g();
                if (j.errorcode == false) {
                    $.tiziDialog({
                        content: j.error
                    })
                } else {
                    var h = baseUrlName + "download/paper?url=" + j.url + "&file_name=" + j.file_name + "&download_type=" + c;
                    ga("send", "event", "Download-Paper-" + c, "Download", j.fname);
                    Common.Download.force_download(h, j.fname)
                }
            }
        })
    },
    reRenderPage: function(c) {
        for (i in c) {
            var e = i.substr(4);
            var g = c[i]["ischecked"];
            var a = c[i]["ischeckedscore"];
            var b = ["separate-line", "secret-mark", "paper-title", "paper-prititle", "paper-info", "student-info", "cent-box", "alert-info"];
            b = b.toString();
            if (g) {
                $("#menu-" + e).find(".icon-view").removeClass("hide");
                if (b.indexOf(e) != -1) {
                    $("#" + e).removeClass("fn-hide")
                } else {
                    $("#" + e).find(".question-handle-box").removeClass("fn-hide")
                }
            } else {
                $("#menu-" + e).find(".icon-view").addClass("hide");
                if (b.indexOf(e) != -1) {
                    $("#" + e).addClass("fn-hide")
                } else {
                    $("#" + e).find(".question-handle-box").addClass("fn-hide")
                }
            }
            if (a != undefined) {
                if (a == 0) {
                    $("#" + e).find(".deco-box").addClass("fn-hide")
                } else {
                    $("#" + e).find(".deco-box").removeClass("fn-hide")
                }
            }
            if (i.substr(0, 17) == "win-question-type") {
                var f = c[i].title;
                var d = c[i].content;
                $("#" + i.substr(4)).find(".change-inner-title").html(f);
                $("#" + i.substr(4)).find(".change-inner-des").html(d);
                $("#left-question-cart-name" + i.substr(17)).html(c[i].title);
                $(".menu-render-type-name" + i.substr(17)).html(c[i].title)
            }
            if ("secret-mark,paper-title,paper-prititle,paper-info,student-info".indexOf(i.substr(4)) != -1) {
                $("#" + i.substr(4)).html(c[i].title)
            }
            if (i == "win-alert-info") {
                $("#alert-info").find("dd").html(c[i].content)
            }
            if (i == "win-paper-type1" || i == "win-paper-type2") {
                if (g) {
                    $("#" + i.substr(4)).find(".type-handle-box").removeClass("fn-hide")
                } else {
                    $("#" + i.substr(4)).find(".type-handle-box").addClass("fn-hide")
                }
                var f = c[i].title;
                var d = c[i].content;
                $("#" + i.substr(4)).find(".type-handle-box").find("dt").html(f);
                $("#" + i.substr(4)).find(".type-handle-box").find("dd").html(d)
            }
        }
    },
    radio_render: function(a) {
        var d = $(a).find("table");
        for (var c = 0; c < d.length; c++) {
            var f = d.eq(c);
            var h = d.find(".radio-render");
            if (h.length != 0) {
                for (var b = 0; b < h.length; b++) {
                    var e = h.eq(b).attr("name");
                    var g = parseInt(h.eq(b).html());
                    g = g == 0 ? 1 : 0;
                    $('input[name="' + e + '"]').eq(g).attr("checked", true)
                }
            }
        }
    },
    moveQuestion: function(c, d, b, a) {
        var g = $(c).find(a).index($(d));
        var e = (b == "up") ? (g - 1) : (g);
        if (b == "up" && g == 0) {
            return
        }
        if (b == "down" && g == $(c).find(a).length - 1) {
            return
        }
        var f = $(d).clone();
        $(d).remove();
        if (b == "up") {
            $(c).find(a).eq(e).before(f)
        }
        if (b == "down") {
            $(c).find(a).eq(e).after(f)
        }
    },
    isFirstEle: function(d, b, e) {
        var c = $(b).find(e).index($(d));
        var a = $(b).find(e).length;
        if (a == 1) {
            return 1
        }
        if (c == 0) {
            return 0
        }
        if (c == $(b).find(e).length - 1) {
            return 2
        }
    },
    getOption: function(k, c) {
        var g = "pos";
        if (c != null) {
            g = c
        }
        var l = k.find("table");
        var d = "{";
        for (var f = 0; f < l.length; f++) {
            if (l.eq(f).attr(g).substr(0, 14) == "win-paper-type") {
                d += '"' + l.eq(f).attr(g).substr(0, 17) + '":'
            } else {
                d += '"' + l.eq(f).attr(g) + '":'
            }
            d += "{";
            if (l.eq(f).attr(g).replace(/[^0-9]/ig, "") != "") {
                d += '"id":' + l.eq(f).attr(g).replace(/[^0-9]/ig, "") + ","
            }
            if (l.eq(f).attr(g).substr(0, 17) == "win-paper-typeone") {
                d += '"type":1,'
            }
            if (l.eq(f).attr(g).substr(0, 17) == "win-paper-typetwo") {
                d += '"type":2,'
            }
            var h = l.eq(f).find("input,textarea");
            var b = false;
            for (var e = 0; e < h.length; e++) {
                if (h.eq(e).attr("type") == "radio") {
                    var a = $('input[name="' + h.eq(e).attr("name") + '"]:checked').val();
                    if (e == 0) {
                        if (e == h.length - 2) {
                            d += '"ischecked":' + a
                        } else {
                            d += '"ischecked":' + a + ","
                        }
                    }
                    if (e == 1) {}
                    if (e == 2) {
                        if (e == h.length - 2) {
                            d += '"ischecked":' + a
                        } else {
                            d += '"ischeckedscore":' + a + ","
                        }
                    }
                    if (e == 3) {}
                } else {
                    if (h.eq(e).attr("class") == "text-input") {
                        if (e == h.length - 1) {
                            d += '"title":"' + h.eq(e).val().replace(/"/g, "'") + '"'
                        } else {
                            d += '"title":"' + h.eq(e).val() + '",'
                        }
                    } else {
                        if (e == h.length - 1) {
                            d += '"content":"' + h.eq(e).val().replace(/"/g, "'").replace(/\n/g, "<br />") + '"'
                        } else {
                            d += '"content":"' + h.eq(e).val() + '",'
                        }
                    }
                }
            }
            if (f == l.length - 1) {
                d += "}"
            } else {
                d += "},"
            }
        }
        d += "}";
        return d
    },
    renderAlertBox: function(b) {
        var j = ".openwin-box";
        if (b != undefined) {
            j = b
        }
        var k = $(".paper-header").find("li");
        for (var g = 0; g < k.length; g++) {
            var m = k.eq(g).find(".icon-view");
            if (m.length != 0) {
                if (m.eq(0).attr("class").indexOf("hide") == -1) {
                    var o = k.eq(g).data("id");
                    $(j).find("#win-" + o).find('span[name="' + o + '"]').html(1)
                } else {
                    var o = k.eq(g).data("id");
                    $(j).find("#win-" + o).find('span[name="' + o + '"]').html(0)
                }
            }
        }
        var f = $(".paper-list-container").find(".child-list");
        $(".paper-set-win").find('table[id^="win-question-type"]').hide();
        var d = $(".paper-set-win").find('table[id^="win-question-type"]').length;
        for (var c = 0; c < f.length; c++) {
            var h = f.eq(c).find(".menu-type-li");
            for (var g = 0; g < h.length; g++) {
                var m = h.eq(g).find(".icon-view");
                if (m.length != 0) {
                    if (m.eq(0).attr("class").indexOf("hide") == -1) {
                        var o = "question-type" + h.eq(g).attr("id").replace(/[^0-9]/ig, "");
                        $(j).find("#win-" + o).find('span[name="' + o + '"]').html(1)
                    } else {
                        var o = "question-type" + h.eq(g).attr("id").replace(/[^0-9]/ig, "");
                        $(j).find("#win-" + o).find('span[name="' + o + '"]').html(0)
                    }
                    $('.paper-set-win table[id="win-' + o + '"]').show();
                    $(".paper-set-win").find('table[id^="win-question-type"]').eq(d - 1).show();
                    var l = $(".paper-set-win").find('table[id^="win-question-type"]:visible').find(".title-td");
                    this.renderNum(l)
                }
            }
        }
        var a = $(".paper-list-container").find(".list-type-title");
        for (var g = 0; g < a.length; g++) {
            var e = a.eq(g).find(".icon-view");
            if (e.length != 0) {
                if (e.eq(0).attr("class").indexOf("hide") == -1) {
                    var o = a.eq(g).data("id");
                    $(j).find("#win-" + o).find('span[name="' + o + '"]').html(1)
                } else {
                    var o = a.eq(g).data("id");
                    $(j).find("#win-" + o).find('span[name="' + o + '"]').html(0)
                }
            }
        }
        $(".preview-content").find(".unit-box").each(function(n, p) {
            var q = $(p).attr("id");
            if ("secret-mark,paper-title,paper-prititle,paper-info,student-info".indexOf(q) != -1) {
                $("#win-" + q).find('input[type="text"]').val($(p).text())
            }
            if (q == "alert-info") {
                $("#win-alert-info").find("textarea").val($(p).find("dd").html().replace(/<br>/g, "\n"))
            }
        });
        $(".preview-content").find(".paper-type-box").find(".type-handle-box").each(function(n, r) {
            var q = $(r).find("dt").text();
            var p = $(r).find("dd").html();
            var u = $(r).parent().attr("id");
            $("#win-" + u).find('input[type="text"]').val(q);
            $("#win-" + u).find("textarea").val(p.replace(/<br>/g, "\n"))
        });
        $(".preview-content").find(".question-type-box").find(".question-handle-box").each(function(p, u) {
            var r = $(u).find(".change-inner-title").text();
            var q = $(u).find(".change-inner-des").html();
            var w = $(u).parent().attr("id");
            $("#win-" + w).find('input[type="text"]').val(r);
            $("#win-" + w).find("textarea").val(q.replace(/<br>/g, "\n"));
            var v = $(u).find(".deco-box");
            if (v.attr("class").indexOf("hide") == -1) {
                var n = $("#win-" + w).find('input[type="radio"]').eq(3).attr("name");
                $(j).find("#win-" + w).find('span[name="' + n + '"]').html(1)
            } else {
                var n = $("#win-" + w).find('input[type="radio"]').eq(3).attr("name");
                $(j).find("#win-" + w).find('span[name="' + n + '"]').html(0)
            }
        })
    },
    flashMask: function(e, d, a) {
        var b = d || e.width();
        var c = a || e.height();
        e.prepend('<div class="mask"></div>');
        $(".mask").css({
            width: b,
            height: c
        }).fadeIn("fast", function() {
            $(".mask").fadeOut("fast", function() {
                $(".mask").remove()
            })
        })
    },
    renderNum: function(a) {
        a.each(function(b, c) {
            $(c).text("题型" + (b + 1) + "头部");
            switch ($(c).text().substr(2, 1)) {
                case "1":
                    $(c).text("题型一头部");
                    break;
                case "2":
                    $(c).text("题型二头部");
                    break;
                case "3":
                    $(c).text("题型三头部");
                    break;
                case "4":
                    $(c).text("题型四头部");
                    break;
                case "5":
                    $(c).text("题型五头部");
                    break;
                case "6":
                    $(c).text("题型六头部");
                    break;
                case "7":
                    $(c).text("题型七头部");
                    break;
                case "8":
                    $(c).text("题型八头部");
                    break;
                case "9":
                    $(c).text("题型九头部");
                    break;
                case "10":
                    $(c).text("题型十头部");
                    break;
                case "11":
                    $(c).text("题型十一头部");
                    break;
                case "12":
                    $(c).text("题型十二头部");
                    break;
                case "13":
                    $(c).text("题型十三头部");
                    break;
                case "14":
                    $(c).text("题型十四头部");
                    break;
                case "15":
                    $(c).text("题型十五头部");
                    break;
                case "16":
                    $(c).text("题型十六头部");
                    break;
                case "17":
                    $(c).text("题型十七头部");
                    break;
                case "18":
                    $(c).text("题型十八头部");
                    break;
                case "19":
                    $(c).text("题型十九头部");
                    break;
                case "20":
                    $(c).text("题型二十头部");
                    break;
                default:
                    return
            }
        })
    },
    goPosition: function(a) {
        this.mainContainer.scrollTop(0);
        this.mainContainer.scrollTop(a.offset().top - 90);
        return a
    },
    goPosWin: function(a) {
        $(a).addClass("active");
        $(".paper-set-win").scrollTop(0);
        $(".paper-set-win").scrollTop($(a).position().top - 60)
    },
    initStyle: function() {
        var a = $(".current-type").attr("sty");
        switch (a) {
            case "1":
                $(".current-type").find("span").html("默认结构");
                break;
            case "2":
                $(".current-type").find("span").html("标准结构");
                break;
            case "3":
                $(".current-type").find("span").html("测验结构");
                break;
            case "4":
                $(".current-type").find("span").html("作业结构");
                break
        }
    },
    orderSort: function(a) {
        Teacher.paper.paper_common.orderSort()
    },
    orderType: function() {
        Teacher.paper.paper_common.orderType()
    },
    number_change: function() {
        Teacher.paper.common.number_change(".type-title-nu");
        Teacher.paper.common.number_change(".menu-questiontype-nu")
    },
    contentSort: function(c, d, b) {
        var a = $(d).clone();
        $(d).remove();
        if (b == "append") {
            $(c).append(a)
        } else {
            $(c).children().eq(b).after(a)
        }
    },
    boxInit: function() {
        this.menuContainer.height(this.mainMenu.height() - 51);
        this.mainContainer.height(this.mainContent.height() - 60)
    },
    sortable_zujuan: function() {
        this.mainMenu.find(".question-box").sortable({
            axis: "y",
            connectWith: ".question-box",
            stop: function(f, g) {
                var b = Teacher.paper.paper_preview;
                var h = "#" + g.item.data("id");
                var e = g.item.siblings().length;
                var c = "#" + g.item.parent().siblings(".list-title").data("id");
                var d = g.item.index();
                var a;
                if (e == 0) {
                    a = "append"
                } else {
                    a = d
                }
                b.contentSort(c, h, a);
                b.orderSort();
                b.flashMask($(h));
                b.goPosition($(h));
                b.ajax_move_question(g.item.data("pqid"), g.item.parent().attr("id"))
            }
        })
    }
};
Teacher.ClassManage = {};
Teacher.ClassManage.homework_center_ajax = function(a) {
    var a = a;
    var b = "/teacher/homework/center/";
    if ($("#class_id").val()) {
        b = b + $("#class_id").val()
    }
    if (a == "" || a == null || a == undefined) {
        a = ""
    }
    $.ajax({
        type: "GET",
        dataType: "text",
        url: b,
        async: false,
        data: {
            rf: true,
            page: a,
            ver: (new Date).valueOf()
        },
        success: function(d) {
            var c = d;
            if (d != "") {
                $(".homework_center").html(c)
            }
        }
    })
};
Teacher.ClassManage.check_homework = {
    init: function() {
        $(".sub_wrong_win").hide();
        $(".sub_wrong_win h5 span").click(function() {
            $(".sub_wrong_win").hide()
        })
    },
    get_ques: function(id, order) {
        $.get("/homework/homework/get_question", {
            id: id,
            ver: (new Date).valueOf()
        }, function(data, status) {
            jsonData = eval("(" + data + ")");
            $("#order_label").text("第" + order + "题");
            $("#q_title").html(jsonData.body);
            $(".sub_wrong_win").show()
        })
    },
    question_hide: function() {
        $(".sub_wrong_win").hide()
    },
    check_student_result_by_time: function(time) {
        var id = $(".homework_id").val();
        $.get("/homework/homework/getbytime", {
            time: time,
            id: id,
            ver: (new Date).valueOf()
        }, function(data, status) {
            $(".time").removeClass("active");
            $(".ttt" + time).addClass("active");
            var jsonData = eval("(" + data + ")");
            var text = "<table><tr><td>姓名</td><td>性别</td><td>作业完成状态</td>";
            text += "<td>做对题数/总题数</td>";
            text += " <td>分数</td>";
            text += "  <td>完成时间</td>";
            text += " <td>检查题目</td></tr>";
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].expend_time > 60) {
                    jsonData[i].expend_time = "大于60"
                }
                text += "<tr><td>" + jsonData[i].name + "</td><td>" + jsonData[i].sex + "</td>";
                text += "<td>" + jsonData[i].is_completed + "</td><td>" + jsonData[i].correct_num + "/" + jsonData[i].hw_q_count;
                text += "<td>" + jsonData[i].condition.score + "</td><td>" + jsonData[i].expend_time + "分钟</td>";
                text += "<td>";
                if (jsonData[i].url) {
                    text += "<span><a class='green' href='" + jsonData[i].url + "'>作业详情</a></span></td></tr>"
                } else {
                    text += "作业未完成</td></tr>"
                }
            }
            text += "</table>";
            $(".classcenter_table").html(text)
        })
    }
};
Teacher.ClassManage.update_homework = {
    init: function() {
        $(".set_cancle").click(function() {
            $(this).parent().parent().hide();
            $(".center_layer").hide();
            $(".ll_tip").hide()
        });
        if ($(".is_over").val() == 0) {
            Common.calendar.calendarDate("cal_date", "demo1");
            $(".Calendar").css("top", "140px");
            var a = $(".get_date");
            if (a.val() != "") {
                $("#cal_date").val(a.val())
            }
        }
        $("#downloadpaper").click(function() {
            Teacher.paper.common.auth(function() {
                $.tiziDialog({
                    title: "下载全部作业",
                    content: $(".downloadBoxContent").html(),
                    icon: null,
                    width: 787,
                    ok: function() {
                        var b = true;
                        if ($(".download_box .homework_title").val() == "") {
                            $(".download_box .set_box").append(title);
                            b = false
                        }
                        if (b) {
                            var d = $(".subject-chose").data("subject");
                            var c = $("#download_title").val();
                            if ($(".onlinetype").val() == 1) {
                                Teacher.ClassManage.update_homework.reviewhw_download(d, c, "part_one")
                            } else {
                                Teacher.ClassManage.update_homework.reviewhw_download(d, c, "part_two")
                            }
                        }
                    },
                    cancel: true
                });
                $(".edit_btn1").click(function() {
                    $("#download_title").attr("disabled", false);
                    $(this).hide();
                    $(".edit_btn2").show()
                });
                $(".edit_btn2").click(function() {
                    $("#download_title").attr("disabled", true);
                    $(this).hide();
                    $(".edit_btn1").show()
                })
            })
        });
        $(".md01_pos03_bg").click(function() {
            $("#download_title").attr("disabled", true);
            $(".edit_btn2").hide();
            $(".edit_btn1").show()
        })
    },
    makeachange: function() {
        var c = $(".unix_start_time").val();
        var b = $(".onlinetype").val();
        var a = $("#cal_date").val();
        if (a == "") {
            $.tiziDialog({
                content: "请选择截止时间，再提交"
            })
        } else {
            id = $(".my_id").val();
            $.tizi_ajax({
                url: "/homework/homework/update_homework_time",
                type: "POST",
                data: {
                    id: id,
                    deadline: a,
                    start_time: c,
                    onoffline: b
                },
                dataType: "json",
                success: function(d) {
                    $.tiziDialog({
                        content: d.error
                    })
                },
                error: function(d) {
                    $.tiziDialog({
                        content: d.error
                    })
                }
            })
        }
    },
    reviewhw_download: function(h, g, d) {
        var a = "/paper/download/homework";
        var b = $("input[type=radio][name=page-size]:checked").val();
        var c = $("input[type=radio][name=paper-type]:checked").val();
        var f = $("input[type=radio][name=word]:checked").val();
        var e = {
            subject_id: h,
            title: g,
            download_type: d,
            paper_size: b,
            paper_version: f,
            paper_type: c,
            assign_id: $(".my_id").val()
        };
        $.tizi_ajax({
            url: a,
            type: "POST",
            data: e,
            dataType: "json",
            success: function(k) {
                if (k.errorcode == false) {
                    $.tiziDialog({
                        content: k.error
                    })
                } else {
                    var j = "download/paper?url=" + k.url + "&file_name=" + k.file_name + "&download_type=homework_review";
                    ga("send", "event", "Download-Homework-review", "Download", k.fname);
                    Common.Download.force_download(j, k.fname)
                }
            }
        })
    },
    get_date: function() {
        $("#download_title").val("下载作业-" + Common.calendar.calendarTime())
    }
};
Teacher.lesson = {};
Teacher.lesson.prepareMenuLi = function(a) {
    $(a).each(function() {
        var b = $(this);
        b.find("li").each(function() {
            var c = $(this).index();
            if (c % 2 == 1) {
                b.find("li").eq(c).addClass("three")
            }
        })
    })
};
Teacher.lesson.prepare = {
    typeCur: $(".current-type"),
    treeList: $(".tree-list"),
    docList: $(".doc-list"),
    typeOption: $(".type-list ul"),
    typeItem: $(".type-list a"),
    typeList: $(".type-list"),
    mainMenu: $(".child-menu"),
    filterLink: $(".hd a"),
    subjectBox: $(".subject-box"),
    downDoc: $(".down"),
    subjectLink: $(".subject-chose"),
    subjectList: $(".subject-list"),
    mainContent: $(".child-content .content-wrap"),
    init: function() {
        Teacher.paper.paper_common.initBase();
        Teacher.lesson.prepare.page(1);
        Teacher.lesson.prepare.get_category(this.typeCur.data("cselect"));
        this.treeList.on("click", ".item", function() {
            var a = this;
            Teacher.lesson.prepare.treeItemClick(a)
        });
        this.treeList.on("click", ".icon", function() {
            var a = this;
            Teacher.lesson.prepare.treeListClick(a)
        });
        this.typeItem.click(function() {
            var a = this;
            var b = $(a).text();
            $(a).parent().parent().siblings("a").children("span").text(b)
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
        this.filterLink.click(function() {
            var a = this;
            Teacher.lesson.prepare.filterQuestionClick(a)
        });
        this.downDoc.live("click", function() {
            var a = this;
            Teacher.lesson.prepare.doc_down_auth(a, null, null)
        })
    },
    getBaseUrl: function() {
        return "lesson/lesson_prepare/"
    },
    getUrlData: function(c) {
        c = c || 1;
        var b = $(".tree-list .active").data() || {
            nselect: $(".current-type").data("cselect")
        };
        var a = $.extend({
            page: c
        }, b, $(".current-type").data(), $(".hd .active").eq(0).data());
        return a
    },
    randerQuestion: function() {
        this_a = Teacher.lesson.prepare;
        var a = this_a.getUrlData($(".pages").attr("data-page"));
        this_a.get_document(a)
    },
    treeItemClick: function(b) {
        if ($(b).hasClass("active")) {
            return false
        }
        this.treeList.find("a").removeClass("active");
        $(b).addClass("active");
        var a = this.getUrlData();
        this.get_document(a)
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
    filterQuestionClick: function(b) {
        if ($(b).attr("class") == "active") {
            return false
        }
        $(b).parent().find("a").removeClass("active");
        $(b).addClass("active");
        var a = this.getUrlData();
        this.get_document(a)
    },
    get_document: function(a) {
        var b = this.getBaseUrl();
        a.ver = (new Date).valueOf();
        $.tizi_ajax({
            url: baseUrlName + b + "get_document",
            type: "GET",
            data: a,
            dataType: "json",
            success: function(c) {
                if (c.errorcode == true) {
                    $(".doc-list").html(c.html);
                    Teacher.tableStyleFn()
                } else {
                    $.tiziDialog({
                        content: c.error
                    })
                }
            }
        })
    },
    get_category: function(a, b) {
        var c = this.getBaseUrl();
        $.tizi_ajax({
            url: baseUrlName + c + "get_category",
            type: "GET",
            data: {
                cnselect: a,
                ver: (new Date).valueOf()
            },
            dataType: "json",
            success: function(h) {
                if (h.errorcode == true) {
                    var d = h.category.length;
                    var g = h.category;
                    for (var f = 0; f < d; f++) {
                        if (g[f].is_leaf == 0) {
                            switch (f) {
                                case d - 1:
                                    g[f].is_leaf = "bottom-plus";
                                    break;
                                default:
                                    g[f].is_leaf = "top-plus";
                                    break
                            }
                        } else {
                            switch (f) {
                                case d - 1:
                                    g[f].is_leaf = "bottom-item";
                                    break;
                                default:
                                    g[f].is_leaf = "normal-item";
                                    break
                            }
                        }
                    }
                    var e = $("#tree-list-content").html();
                    var j = Mustache.to_html(e, h);
                    if (b) {
                        b.after(j)
                    } else {
                        $(".tree-list").html(j)
                    }
                } else {
                    $.tiziDialog({
                        content: h.error
                    })
                }
            }
        })
    },
    page: function(a) {
        this.get_document(this.getUrlData(a))
    },
    flash_init: function() {
        var b = $("#docnum").html();
        var a = new Array();
        a[0] = baseUrlName + "lesson/lesson_document/flash_get_json";
        a[1] = baseUrlName + "application/views/static/js/tools/lesson_flash/";
        a[2] = b;
        a[3] = $(".token").attr("id");
        a[4] = $(".pname").attr("id");
        a[5] = 1000;
        a[6] = flash_height;
        return a
    },
    doc_down_status: function(b) {
        if ($(b).attr("disabled") == "disabled") {
            return false
        }
        $(b).html("下载中...");
        $(b).attr("disabled", "disabled");
        var d = $(".down");
        for (var c = 0; c < d.length; c++) {
            $(d[c]).attr("disabled", "disabled")
        }
        var a = $(b).data("num");
        Teacher.lesson.prepare.document_download(a, function() {
            for (var e = 0; e < d.length; e++) {
                $(d[e]).removeAttr("disabled")
            }
            $(b).html("下载");
            $(b).removeAttr("disabled")
        })
    },
    doc_down_auth: function(a, b, c) {
        Teacher.paper.common.auth(function() {
            if (c == null && b == null) {
                Teacher.lesson.prepare.doc_down_status(a)
            } else {
                Teacher.lesson.prepare.document_download(b, c)
            }
        })
    },
    document_download: function(b, e) {
        var a = baseUrlName + "lesson/lesson_document/download_verify";
        var d = $(".subject-chose").data("subject");
        var c = {
            subject_id: d,
            file_id: b
        };
        $.tizi_ajax({
            url: a,
            type: "POST",
            data: c,
            dataType: "json",
            success: function(f) {
                if (f.errorcode == false) {
                    $.tiziDialog({
                        content: f.error
                    })
                } else {
                    var g = baseUrlName + "download/doc?url=" + f.file_path + "&file_name=" + f.file_name;
                    ga("send", "event", "Download-Lesson-doc", "Download", f.fname);
                    Common.Download.force_download(g, f.fname, true)
                }
                if (e != null) {
                    e()
                }
            }
        })
    }
};
Teacher.lesson.search = {
    submitBtn: $("#search_submit"),
    downDoc: $(".down"),
    init: function() {
        Teacher.paper.paper_common.initBase();
        $(".child-menu").css("height", $(window).height() - $(".header").height() - $(".footer").height());
        this.submitBtn.click(function() {
            Teacher.lesson.search.submitSearch(1)
        });
        $(".seachBoxInput").keypress(function(a) {
            if (a.keyCode == 13) {
                $(".seachBoxInput").blur();
                Teacher.lesson.search.submitSearch(1)
            }
        });
        this.downDoc.live("click", function() {
            var a = this;
            Teacher.lesson.prepare.doc_down_auth(a, null, null)
        })
    },
    submitSearch: function(c, d) {
        var a = $(".subject-chose").data("subject");
        if (typeof(d) != "undefined") {
            var b = d
        } else {
            var b = $(".seachBoxInput").val();
            if (b == "请输入关键字") {
                b = ""
            }
            if (b == "") {
                $.tiziDialog({
                    content: "请输入关键字"
                });
                return false
            }
            ga("send", "event", "Search-Lesson", "Search", b)
        }
        $(this.submitBtn).addClass("disabled");
        $.tizi_ajax({
            url: baseUrlName + "lesson/lesson_prepare/lesson_search",
            type: "GET",
            data: {
                sid: a,
                skeyword: b,
                page: c,
                ver: (new Date).valueOf()
            },
            dataType: "json",
            success: function(e) {
                $(this.submitBtn).removeClass("disabled");
                $(".mainContainer").css("overflow-y", "scroll");
                if (e.errorcode == true) {
                    $(".search-data").html(e.html);
                    Teacher.tableStyleFn()
                } else {
                    $.tiziDialog({
                        content: e.error
                    })
                }
            }
        })
    },
    page: function(a) {
        var b = $(".seachResult").find("em").text();
        Teacher.lesson.search.submitSearch(a, b)
    }
};
Teacher.paper.search = {
    submitBtn: $("#search_submit"),
    questionList: $(".question-list"),
    init: function() {
        this.submitBtn.click(function() {
            Teacher.paper.search.submit_select()
        });
        $(".seachBoxInput").keypress(function(a) {
            if (a.keyCode == 13) {
                $(".seachBoxInput").blur();
                Teacher.paper.search.submit_select()
            }
        });
        this.questionList.on("click", ".question-content", function() {
            var a = this;
            $(a).find(".answer").toggle()
        });
        this.questionList.on("click", ".control-btn", function() {
            var a = this;
            Teacher.paper.testpaper.addQuestionClick(a)
        });
        this.questionList.on("click", ".all_in", function(a) {
            a.stopPropagation();
            Teacher.paper.testpaper.addQuestionsClick();
            return false
        });
        Teacher.paper.paper_common.randerQuestion = Teacher.paper.search.randerQuestion;
        Teacher.paper.search.selects(".paperType .posr")
    },
    randerQuestion: function() {
        if ($(".question-box").length > 0) {
            this_a = Teacher.paper.search;
            var c = $(".page").find(".active").html();
            if (c == undefined) {
                c = 1
            }
            var b = $(".seachResult").attr("stype");
            var d = $(".seachResult").attr("slevel");
            var a = $(".seachResult").find("em").text();
            this_a.page(c, b, d, a, true)
        }
    },
    selects: function(a) {
        Common.hoverSelects(a)
    },
    submit_select: function() {
        if ($("#search_submit").attr("class").indexOf("disabled") != -1) {
            return false
        }
        var a = $(".subject-chose").data("subject");
        var c = $("#qtype").find("input").attr("data-id");
        var d = $("#qlevel").find("input").attr("data-id");
        var b = $("#qkeyword").find("input").val();
        if (c < 0) {
            $.tiziDialog({
                content: "请选择题型"
            })
        } else {
            if (d < 0) {
                $.tiziDialog({
                    content: "请选择难度"
                })
            } else {
                if (b == "" || b == "请输入关键字") {
                    $.tiziDialog({
                        content: "请输入关键字"
                    })
                } else {
                    ga("send", "event", "Search-Paper", "Search", b);
                    this.page(1, c, d, b, true)
                }
            }
        }
    },
    page: function(f, d, e, c, b) {
        if (b != true) {
            $(".all_in").removeClass("all_in").addClass("all_in_2");
            Common.floatLoading.showLoading()
        }
        $("#search_submit").addClass("disabled");
        var a = $(".subject-chose").data("subject");
        $.tizi_ajax({
            type: "GET",
            dataType: "json",
            url: baseUrlName + "paper/paper_search/get_question",
            data: {
                sid: a,
                stype: d,
                slevel: e,
                skeyword: c,
                page: f,
                ver: (new Date).valueOf()
            },
            success: function(g) {
                $(".all_in_2").removeClass("all_in_2").addClass("all_in");
                Common.floatLoading.hideLoading();
                $("#search_submit").removeClass("disabled");
                if (g.errorcode == true) {
                    $(".question-list").html(g.html);
                    Teacher.paper.search.auto_height();
                    Teacher.paper.search.add_BtnPaper()
                } else {
                    $.tiziDialog({
                        content: g.error
                    })
                }
            }
        })
    },
    auto_height: function() {
        $(".paperDetails").css("height", $(window).height() - $(".allPaper .path").height() - ($(".page").height()) - 165).css("overflow", "auto");
        $(".mainContainer").css("height", $(window).height() - $(".allPaper .path").height() - ($(".page").height()) - 33).css("overflow-y", "hidden")
    },
    add_BtnPaper: function() {
        $(".question-list .question-box").first().find("a.control-btn").prepend('<div class="all_in cBtnNormal fl" style="margin-right:5px;"><a class="addAllPaper"><i>将本页题目全部加入试卷</i></a></div>')
    }
};
Teacher.UserCenter = {
    UploadAq: {
        appletUrl: "",
        init: function() {
            if ($.browser.msie && $.browser.version < 8) {
                $(".ckEd").prepend('<p class="ieTip">温馨提示：您的浏览器版本较低，将无法上传图片或者公式，建议您安装并使用谷歌、火狐或ie8以上浏览器，若使用360浏览器请切换为“极速模式”</p>');
                $("#question_content").addClass("ieTxtArea");
                $("#analysis").addClass("ieTxtArea");
                $("#option_answer").addClass("ieTxtArea")
            } else {
                $("#question_content").ckeditor();
                $("#analysis").ckeditor();
                $("#option_answer").ckeditor();
                var a = this.checkOS();
                if (a) {
                    $(".Tip").show();
                    this.addPlugin()
                }
            }
            Teacher.UserCenter.my_question_ajax.init();
            this.openGroupInfo()
        },
        addPlugin: function() {
            var a = baseUrlName + "upload/uques";
            var b = new WordImageUploader(a, this.appletUrl);
            CKEDITOR.instances.question_content.on("change", function() {
                b.uploadWordImagesFromCKEditor(CKEDITOR.instances.question_content)
            });
            CKEDITOR.instances.analysis.on("change", function() {
                b.uploadWordImagesFromCKEditor(CKEDITOR.instances.analysis)
            });
            CKEDITOR.instances.option_answer.on("change", function() {
                b.uploadWordImagesFromCKEditor(CKEDITOR.instances.option_answer)
            })
        },
        checkOS: function() {
            var a = "";
            windows = (navigator.userAgent.indexOf("Windows", 0) != -1) ? 1 : 0;
            if (windows) {
                return 1
            } else {
                return 0
            }
        },
        openGroupInfo: function() {
            var d = $(".openGroupInfo");
            var c = "";
            var b = $(".s_newSubject option").size();
            for (var a = 0; a < b; a++) {
                $(".dataStore").data($(".s_newSubject option").eq(a).text(), $(".s_newSubject option").eq(a).val())
            }
            d.on("click", function() {
                var f = $(this);
                $(".s_newSubject option").removeAttr("selected");
                var g = f.parents("ul").find(".s_subject option:selected").text();
                var e = $(".dataStore").data(g);
                $(".s_newSubject option").eq(e).attr("selected", true);
                c = $(".tmpGroupTip").html();
                $.tiziDialog({
                    id: "tmpGroupTipId",
                    content: c,
                    icon: false,
                    ok: function() {
                        $(".myGroupTipForm").submit();
                        return false
                    },
                    cancel: true,
                    init: function() {
                        Common.valid.uploadQuesValid.myGroupTipForm(f)
                    }
                })
            })
        }
    },
    UploadING: {
        static_url: "",
        init: function() {
            $("#file_upload").uploadify({
                formData: $.tizi_token({
                    session_id: $.cookies.get(baseSessID)
                }, "post"),
                swf: this.static_url + "js/tools/upload_flash/uploadify.swf",
                uploader: baseUrlName + "upload/udoc",
                buttonImage: this.static_url + "js/tools/upload_flash/icon_org.png",
                buttonClass: "uploadify_oragne",
                fileTypeExts: "*.doc; *.docx; *.ppt; *.pptx; *.xls; *.xlsx; *.wps; *.et; *.dps; *.pdf; *.txt",
                fileSizeLimit: "20MB",
                fileObjName: "documents",
                width: 94,
                "text-indent": 10,
                uploadLimit: 5,
                overrideEvents: ["onSelectError", "onDialogClose", "onUploadError"],
                onSelectError: function(a, c, b) {
                    switch (c) {
                        case -100:
                            $.tiziDialog({
                                content: "每次最多上传5份文档"
                            });
                            break;
                        case -110:
                            $.tiziDialog({
                                content: "文件 [" + a.name + "] 过大！每份文档不能超过20M"
                            });
                            break;
                        case -120:
                            $.tiziDialog({
                                content: "文件 [" + a.name + "] 大小异常！不可以上传大小为0的文件"
                            });
                            break;
                        case -130:
                            $.tiziDialog({
                                content: "文件 [" + a.name + "] 类型不正确！不可以上传错误的文件格式"
                            });
                            break
                    }
                    return false
                },
                onSWFReady: function() {},
                onFallback: function() {
                    $(".uploadDoc").html(noflash)
                },
                onUploadError: function(a, d, c, b) {
                    if (d == -280 || d == -290) {
                        return
                    }
                    $.tiziDialog({
                        content: "文件 [" + a.name + "] 上传失败"
                    });
                    return false
                },
                onQueueComplete: function(a) {
                    top.location.href = baseUrlName + "teacher/user/mydocument/perfect"
                }
            })
        }
    },
    UploadOver: {
        init: function() {
            this.addOverInfo();
            this.delOverInfo();
            this.delSynInfo()
        },
        addOverInfo: function() {
            var a = $(".addBtn_message");
            a.eq(0).on("click", function() {
                var b = $(".add_knows").eq(0).clone();
                $(".add_knows").parent().append(b)
            });
            a.eq(1).on("click", function() {
                var b = $(".add_ansyInfo").eq(0).clone();
                $(".add_ansyInfo").parent().append(b)
            })
        },
        delOverInfo: function() {
            var a = $(".del_message");
            a.on("click", function() {
                var b = $(this).index();
                $(this).parent().remove()
            })
        },
        delSynInfo: function() {
            var a = $(".del_syncInfo");
            a.on("click", function() {
                var b = $(this).index();
                $(".md_filesList").eq(b).slideUp("slow", function() {
                    $(this).remove()
                })
            })
        }
    },
    my_question_ajax: {
        init: function() {
            this.subjecType();
            this.getVersion();
            $(".add_course").on("click", function() {
                objConfirm = $(this);
                Teacher.UserCenter.my_question_ajax.confirmCourseMsg(objConfirm)
            });
            $(".add_category").on("click", function() {
                objConfirm = $(this);
                Teacher.UserCenter.my_question_ajax.confirmCategoryMsg(objConfirm)
            });
            this.add_option();
            this.del_option();
            this.answer_panel()
        },
        add_option: function() {
            $("#myadd_option").on("click", function() {
                var a = Teacher.UserCenter.my_question_ajax.getNextOption();
                if (a) {
                    str = '<label class="labelr"> <input class="radior" type="checkbox" name="option_answer[]" ';
                    str += 'value="' + a + '">';
                    str += a + "</label>";
                    $("#answer_row").append(str)
                }
                Teacher.UserCenter.my_question_ajax.setLastOption()
            })
        },
        del_option: function() {
            $("#mydel_option").on("click", function() {
                var a = $(".pickList").find("input").last();
                if (a.val() == "A") {
                    $.tiziDialog({
                        content: "不能再减少了"
                    })
                } else {
                    var b = a.closest("label");
                    b.remove()
                }
                Teacher.UserCenter.my_question_ajax.setLastOption()
            })
        },
        getNextOption: function() {
            var b = this.getLastOption(),
                a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                d = a.indexOf(b);
            if (d == a.length - 1) {
                $.tiziDialog({
                    content: "选项不能再多了"
                });
                return false
            } else {
                var c = 0;
                if (d > parseInt(a.length)) {
                    c = a.length
                } else {
                    c = d + 1
                }
                return a[c]
            }
        },
        setLastOption: function() {
            var b = $(".pickList").find("input").last();
            var a = b.val();
            $("#last_option").attr("value", a)
        },
        getLastOption: function() {
            var c = $(".pickList").find("input").last();
            var b = c.val(),
                a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return b
        },
        answer_panel: function() {
            $(".s_qtype").on("change", function() {
                var b = $(this);
                var a = b.val();
                if (a >= 2 && a <= 7) {
                    $("#qestion_unselect").hide();
                    $("#qestion_select").show()
                } else {
                    $("#qestion_unselect").show();
                    $("#qestion_select").hide()
                }
            })
        },
        getBaseUrl: function() {
            return "user/user_question/"
        },
        unCheck: function(a) {
            if ("请选择" == a || "请选择版本" == a) {
                $.tiziDialog({
                    content: "您有未选择的项！"
                });
                return true
            }
            return false
        },
        delCourseSelect: function(c, a) {
            var b = $(a);
            $("#category_id").val("");
            $("p#" + c).remove()
        },
        delCategorySelect: function(g) {
            var d = $("#knowledge_id");
            var a = d.val(),
                f = a.split("|");
            var c = f.indexOf(g);
            if (c != -1) {
                f.splice(c, 1)
            }
            try {
                kid_str = f.join("|")
            } catch (b) {
                console.log(b)
            }
            d.attr("value", kid_str);
            $("p#" + g).remove()
        },
        confirmCategoryMsg: function(j) {
            var a = j;
            var f = "";
            var b = "";
            var e = $("#knowledge_id");
            var k = $(".knowlage_name");
            var d = e.val();
            var h;
            a.prev().find(".tree-item").each(function(m) {
                var n = $(this).find("option:selected").val();
                var l = $(this).find("option:selected").html();
                h = Teacher.UserCenter.my_question_ajax.unCheck(l);
                if (h) {
                    return false
                }
                if (l != "") {
                    f += l + "--"
                }
                if (n != "") {
                    b += n + "-"
                }
            });
            if (h) {
                return h
            }
            var c = d.split("|");
            var g = c.indexOf(b);
            if (g != -1) {
                $.tiziDialog({
                    content: "您已经添加了该知识点信息"
                });
                return
            }
            b += "|";
            if (d) {
                e.attr("value", d + b)
            } else {
                e.attr("value", b)
            }
            b = b.substr(0, b.length - 1);
            k.append('<p id="' + b + '">' + f + '<a href="javascript:void(0);" onclick="Teacher.UserCenter.my_question_ajax.delCategorySelect(\'' + b + '\',this);" class="del_message">删除</a></p>')
        },
        confirmCourseMsg: function(e) {
            var d = e;
            var h = "";
            var a = "";
            var f = $("#category_id");
            var c = $(".category_name");
            var g = f.val();
            if (g != "") {
                $.tiziDialog({
                    content: "您已经添加了教材同步信息！"
                });
                return false
            }
            var b;
            d.prev().find(".tree-item").each(function(k) {
                var l = $(this).find("option:selected").val();
                var j = $(this).find("option:selected").html();
                b = Teacher.UserCenter.my_question_ajax.unCheck(j);
                if (b) {
                    return false
                }
                if (j != "") {
                    h += j + "--"
                }
                if (l != "") {
                    a += l + "-"
                }
            });
            if (b) {
                return b
            }
            f.attr("value", a);
            a = a.substr(0, a.length - 1);
            c.append('<p id="' + a + '">' + h + '<a href="javascript:void(0);" onclick="Teacher.UserCenter.my_question_ajax.delCourseSelect(\'' + a + '\',this);" class="del_message">删除</a></p>')
        },
        subjecType: function() {
            $(".s_grade").on("change", function() {
                var d = $(this);
                var e = Teacher.UserCenter.my_question_ajax;
                var c = d.val();
                var b = baseUrlName + e.getBaseUrl() + "ajax_subject";
                var a = {
                    grade_id: c,
                    ver: (new Date).valueOf()
                };
                $.tizi_ajax({
                    url: b,
                    type: "GET",
                    data: a,
                    dataType: "json",
                    success: function(f) {
                        if (f.error_code == true) {
                            $(".s_subject").html(f.error)
                        } else {
                            $.tiziDialog({
                                content: f.error
                            })
                        }
                    }
                })
            })
        },
        getVersion: function() {
            $(".s_subject").on("change", function() {
                var d = $(this);
                var e = Teacher.UserCenter.my_question_ajax;
                var c = d.val();
                var b = baseUrlName + e.getBaseUrl() + "subject_ajax_select";
                var a = {
                    subject_id: c,
                    ver: (new Date).valueOf()
                };
                $.tizi_ajax({
                    url: b,
                    type: "GET",
                    data: a,
                    dataType: "json",
                    success: function(f) {
                        if (f.error_code == true) {
                            $(".s_qtype").html(f.qtype);
                            $(".s-knowlage").html(f.category);
                            $(".s-version").html(f.course);
                            $(".s_Group").html(f.groups)
                        } else {
                            $.tiziDialog({
                                content: f.error
                            })
                        }
                    }
                })
            })
        },
        delAfter: function(b) {
            var a = b;
            a.nextAll(".tree-item").remove()
        },
        treeItemClick: function(b) {
            var a = $(b).val();
            if (a == "") {
                this.delAfter($(b));
                return false
            }
            var c = $(b).find("option:selected").data("type");
            if (c == "selplus") {
                this.ajax_node_data(a, $(b))
            } else {
                this.delAfter($(b))
            }
        },
        ajax_node_data: function(a, b) {
            var c = this.getBaseUrl();
            $.get(baseUrlName + c + "ajax_cate_node", {
                cnselect: a,
                ver: (new Date).valueOf()
            }, function(d) {
                if (d.error_code == true) {
                    if (b) {
                        Teacher.UserCenter.my_question_ajax.delAfter(b);
                        b.after(d.error)
                    } else {}
                } else {
                    $.tiziDialog({
                        content: d.error
                    })
                }
            }, "json")
        }
    },
    ajax_select: {
        init: function() {
            this.subjecType();
            this.getVersion();
            $(".btn_gray_add").on("click", function() {
                objConfirm = $(this);
                Teacher.UserCenter.ajax_select.confirmMsg(objConfirm)
            })
        },
        getBaseUrl: function() {
            return "user/user_document/"
        },
        unCheck: function(a) {
            if ("请选择" == a || "请选择版本" == a) {
                $.tiziDialog({
                    content: "您有未选择的项！"
                });
                return true
            }
            return false
        },
        delSelect: function(c, a) {
            var b = $(a);
            b.parents(".md_syncInfo").find("input[type='hidden']").val("");
            $("span#" + c).remove()
        },
        confirmMsg: function(e) {
            var d = e;
            var h = "";
            var a = "";
            var f = d.next("input[type='hidden']");
            var c = d.parents(".md_syncInfo").find(".category_name");
            var g = f.val();
            if (g != "") {
                $.tiziDialog({
                    content: "您已经添加了教材同步信息！"
                });
                return false
            }
            var b;
            d.prev().find(".tree-item").each(function(k) {
                var l = $(this).find("option:selected").val();
                var j = $(this).find("option:selected").html();
                b = Teacher.UserCenter.ajax_select.unCheck(j);
                if (b) {
                    return false
                }
                if (j != "") {
                    h += j + "--"
                }
                if (l != "") {
                    a += l + "-"
                }
            });
            if (b) {
                return b
            }
            f.attr("value", a);
            a = a.substr(0, a.length - 1);
            c.append('<span id="' + a + '">' + h + '<a href="javascript:void(0);" onclick="Teacher.UserCenter.ajax_select.delSelect(\'' + a + '\',this);" class="del_message">删除</a></span>')
        },
        subjecType: function() {
            $(".s_grade").on("change", function() {
                var d = $(this);
                var e = Teacher.UserCenter.ajax_select;
                var c = d.val();
                var b = baseUrlName + e.getBaseUrl() + "ajax_subject";
                var a = {
                    grade_id: c,
                    ver: (new Date).valueOf()
                };
                $.tizi_ajax({
                    url: b,
                    type: "GET",
                    data: a,
                    dataType: "json",
                    success: function(f) {
                        if (f.error_code == true) {
                            d.parent("li").next("li").find(".s_subject").html(f.error)
                        } else {
                            $.tiziDialog({
                                content: f.error
                            })
                        }
                    }
                })
            })
        },
        getVersion: function() {
            $(".s_subject").on("change", function() {
                var d = $(this);
                var e = Teacher.UserCenter.ajax_select;
                var c = d.val();
                var b = baseUrlName + e.getBaseUrl() + "ajax_version_msg";
                var a = {
                    subject_id: c,
                    ver: (new Date).valueOf()
                };
                $.tizi_ajax({
                    url: b,
                    type: "GET",
                    data: a,
                    dataType: "json",
                    success: function(f) {
                        if (f.error_code == true) {
                            d.parent().parent().find(".s-version").html(f.course);
                            d.parent().parent().find(".s_Group").html(f.groups)
                        } else {
                            $.tiziDialog({
                                content: f.error
                            })
                        }
                    }
                })
            })
        },
        delAfter: function(b) {
            var a = b;
            a.nextAll(".tree-item").remove()
        },
        treeItemClick: function(b) {
            var a = $(b).val();
            if (a == "") {
                this.delAfter($(b));
                return false
            }
            var c = $(b).find("option:selected").data("type");
            if (c == "selplus") {
                this.ajax_node_data(a, $(b))
            } else {
                this.delAfter($(b))
            }
        },
        ajax_node_data: function(a, b) {
            var c = this.getBaseUrl();
            $.get(baseUrlName + c + "ajax_node_select", {
                cnselect: a,
                ver: (new Date).valueOf()
            }, function(d) {
                if (d.error_code == true) {
                    if (b) {
                        Teacher.UserCenter.ajax_select.delAfter(b);
                        b.after(d.error)
                    } else {}
                } else {
                    $.tiziDialog({
                        content: d.error
                    })
                }
            }, "json")
        }
    },
    docLib: {
        init: function() {
            this.changTab();
            this.changGroup();
            this.delTxt();
            this.addGroup();
            this.editGroup();
            this.delGroup();
            this.page(1);
            $(".down").live("click", function() {
                var a = this;
                Teacher.UserCenter.docLib.doc_down_status(a)
            })
        },
        changTab: function() {
            var a = $(".md_docBox .md_hd");
            a.find("a").on("click", function() {
                a.find("a").removeClass("active");
                $(this).addClass("active");
                var b = Teacher.UserCenter.docLib.getUrlData();
                Teacher.UserCenter.docLib.get_teacher_doc(b)
            })
        },
        changGroup: function() {
            var a = $(".doc_group ul");
            a.find("span.group_txt").live("mouseenter", function() {
                $(this).addClass("cur")
            }).live("mouseleave", function() {
                $(this).removeClass("cur")
            });
            a.find(".filter-group").live("click", function() {
                if ($(this).attr("class").indexOf("w_orange") > -1) {
                    return false
                }
                $(this).addClass("w_orange").parents("li").siblings().find("a").removeClass("w_orange");
                $(".doc_group").find("span.group_txt").removeClass("highcur");
                $(this).parents("span.group_txt").addClass("highcur");
                var b = Teacher.UserCenter.docLib.getUrlData();
                Teacher.UserCenter.docLib.get_teacher_doc(b)
            })
        },
        delTxt: function() {
            var a = '<div class="md_docText"><h2>是否确定删除此文档?</h2></div>';
            $(".del_txt").live("click", function() {
                var d = $(this);
                if (d.attr("disabled") == "disabled") {
                    return false
                }
                d.attr("disabled", "disabled");
                var f = Teacher.UserCenter.docLib.getBaseUrl();
                var e = $(".subject-chose").data("subject");
                var b = {
                    doc_id: d.data("num"),
                    sid: e,
                    ver: (new Date).valueOf()
                };
                var c = $.tiziDialog({
                    content: a,
                    icon: null,
                    title: "删除文档",
                    ok: function() {
                        $.tizi_ajax({
                            url: baseUrlName + f + "del_doc",
                            type: "GET",
                            data: b,
                            dataType: "json",
                            success: function(h) {
                                if (h.error_code == true) {
                                    d.parents("tr").remove();
                                    var g = parseInt($("#doc_total").text());
                                    --g;
                                    if (g < 0) {
                                        g = 0
                                    }
                                    $("#doc_total").text(g);
                                    Teacher.UserCenter.docLib.get_doc_group()
                                } else {
                                    $.tiziDialog({
                                        content: h.error
                                    })
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        get_doc_group: function() {
            var c = $(".subject-chose").data("subject");
            var b = $(".doc_group .w_orange").data() || {
                gid: ""
            };
            var a = $.extend({
                sid: c
            }, b);
            $.tizi_ajax({
                url: baseUrlName + this.getBaseUrl() + "ajax_get_doc_groups",
                type: "GET",
                data: a,
                dataType: "json",
                success: function(d) {
                    if (d.error_code == true) {
                        $(".doc_group").html(d.html)
                    } else {
                        $.tiziDialog({
                            content: d.error
                        })
                    }
                }
            })
        },
        fileInfoDel: function() {
            $(".del_syncInfo").on("click", function() {
                var d = $(this);
                if (d.attr("disabled") == "disabled") {
                    return false
                }
                d.attr("disabled", "disabled");
                var g = d.data("id");
                var b = $("#file_info_" + g);
                var f = $(".subject-chose").data("subject");
                var a = {
                    doc_id: g,
                    sid: f,
                    ver: (new Date).valueOf()
                };
                var c = parseInt($("#total").text());
                var e = Teacher.UserCenter.docLib.getBaseUrl();
                $.tizi_ajax({
                    url: baseUrlName + e + "del_doc",
                    type: "GET",
                    data: a,
                    dataType: "json",
                    success: function(h) {
                        if (h.error_code == true) {
                            b.slideUp("slow", function() {
                                b.remove()
                            });
                            --c;
                            if (c == 0) {
                                $("#total").text(c);
                                window.location.href = baseUrlName + "user/user_document"
                            } else {
                                $("#total").text(c)
                            }
                        } else {
                            $.tiziDialog({
                                content: h.error
                            })
                        }
                    }
                })
            })
        },
        doc_down_status: function(b) {
            if ($(b).attr("disabled") == "disabled") {
                return false
            }
            $(b).html("下载中...");
            $(b).attr("disabled", "disabled");
            var d = $(".down");
            for (var c = 0; c < d.length; c++) {
                $(d[c]).attr("disabled", "disabled")
            }
            var a = $(b).data("num");
            this.document_download(a, function() {
                for (var e = 0; e < d.length; e++) {
                    $(d[e]).removeAttr("disabled")
                }
                $(b).html("下载");
                $(b).removeAttr("disabled")
            })
        },
        document_download: function(b, e) {
            var a = baseUrlName + "question/question_files/download_verify";
            var d = {
                file_id: b
            };
            var c = this.getBaseUrl();
            $.tizi_ajax({
                url: baseUrlName + c + "download_verify",
                type: "POST",
                data: d,
                dataType: "json",
                success: function(f) {
                    if (f.errorcode == false) {
                        $.tiziDialog({
                            content: f.error
                        })
                    } else {
                        var g = baseUrlName + "download/udoc?url=" + f.file_path + "&file_name=" + f.file_name;
                        Common.Download.force_download(g, f.fname, true)
                    }
                    if (e != null) {
                        e()
                    }
                }
            })
        },
        getBaseUrl: function() {
            return "user/user_document/"
        },
        getUrlData: function(c) {
            c = c || 1;
            var b = $(".doc_group .w_orange").data() || {
                gid: ""
            };
            var a = $.extend({
                page: c
            }, b, $(".subject-chose").data(), $(".doc-type .active").eq(0).data());
            return a
        },
        get_teacher_doc: function(a) {
            var b = this.getBaseUrl();
            a.ver = (new Date).valueOf();
            $.tizi_ajax({
                url: baseUrlName + b + "get_teacher_document",
                type: "GET",
                data: a,
                dataType: "json",
                success: function(c) {
                    if (c.errorcode == true) {
                        $(".doc-list").html(c.html)
                    } else {
                        $.tiziDialog({
                            content: c.error
                        })
                    }
                }
            })
        },
        page: function(a) {
            this.get_teacher_doc(this.getUrlData(a))
        },
        addGroup: function() {
            var e = $(".new_doc");
            var d = "";
            var b = $(".mdBox_beta").html();
            var a = baseUrlName + this.getBaseUrl() + "new_group";
            var c = $(".subject-chose").data("subject");
            e.live("click", function() {
                var f = $.tiziDialog({
                    content: b,
                    icon: null,
                    title: "新建文档分组",
                    ok: function() {
                        var g = "";
                        var j = $.trim($(".md_docText").find("input[name=group_name]").attr("value"));
                        if (!j) {
                            $.tiziDialog({
                                content: "请输入分组名称"
                            });
                            return false
                        }
                        if (j.length > 9) {
                            g = j.substr(0, 9) + ".."
                        } else {
                            g = j
                        }
                        var h = {
                            sid: c,
                            group_name: j
                        };
                        $.tizi_ajax({
                            url: a,
                            type: "POST",
                            data: h,
                            dataType: "json",
                            success: function(l) {
                                if (l.error_code == false) {
                                    $.tiziDialog({
                                        content: l.error
                                    })
                                } else {
                                    var k = '<li><span class="group_txt"><a href="javascript:void(0);" title="' + j + '" class="filter-group" data-gid="' + l.error + '">' + g + '</a><b>(0)</b></span><a href="javascript:void(0);" data-group="' + l.error + '" class="fr del_doc">删</a><a href="javascript:void(0);" data-group="' + l.error + '" class="fr edit_doc">编</a></li>';
                                    $(".doc_group ul").append(k)
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        editGroup: function() {
            var b = $(".new_doc");
            var a = "";
            $(".edit_doc").live("click", function() {
                var e = $(this).parents("li").find(".group_txt").find("a");
                var f = $(this);
                var h = e.text();
                var j = h.lastIndexOf("..");
                if (j > -1) {
                    h = e.attr("title")
                }
                $(".md_docText").find("h2").html("编辑文档分组");
                $(".md_docText").find("input[name=group_name]").attr("value", h);
                a = $(".mdBox_beta").html();
                var c = baseUrlName + Teacher.UserCenter.docLib.getBaseUrl() + "update_group";
                var g = $(".subject-chose").data("subject");
                var d = $.tiziDialog({
                    content: a,
                    icon: null,
                    title: "编辑文档分组",
                    ok: function() {
                        var l = $.trim($(".md_docText").find("input[name=group_name]").attr("value"));
                        if (!l) {
                            $.tiziDialog({
                                content: "请输入分组名称"
                            });
                            return false
                        }
                        var k = {
                            sid: g,
                            gid: f.data("group"),
                            op_type: "update",
                            new_name: l
                        };
                        $.tizi_ajax({
                            url: c,
                            type: "POST",
                            data: k,
                            dataType: "json",
                            success: function(m) {
                                if (m.error_code == false) {
                                    $.tiziDialog({
                                        content: m.error
                                    })
                                } else {
                                    f.parents("li").find(".group_txt").find("a").text(l)
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        delGroup: function() {
            $(".del_doc").live("click", function() {
                var c = $(".doc_group li").eq(1);
                var e = $(this);
                if (e.attr("disabled") == "disabled") {
                    return false
                }
                e.attr("disabled", "disabled");
                var g = $(this).parents("li").find(".group_txt").find("a").attr("title");
                var d = '<div class="md_docText"><h2>是否确定删除分组：<b style="color: #ff6600;">' + g + "</b>？</h2><h2>删除分组后，该分组中的文档将标记为未分组。</h2></div>";
                var a = baseUrlName + Teacher.UserCenter.docLib.getBaseUrl() + "update_group";
                var f = $(".subject-chose").data("subject");
                var b = $.tiziDialog({
                    content: d,
                    icon: null,
                    title: "删除文档分组",
                    ok: function() {
                        var h = {
                            sid: f,
                            gid: e.data("group"),
                            op_type: "delete"
                        };
                        $.tizi_ajax({
                            url: a,
                            type: "POST",
                            data: h,
                            dataType: "json",
                            success: function(j) {
                                if (j.error_code == false) {
                                    $.tiziDialog({
                                        content: j.error
                                    })
                                } else {
                                    e.parents("li").remove();
                                    c.removeClass("gray_li");
                                    c.html('<span class="group_txt"><a href="javascript:void(0);" class="filter-group" data-gid="0">未选分组</a><b>(' + j.count + ")</b></span>")
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        }
    },
    itemLib: {
        filterLink: $(".md_itemBox .md_hd a"),
        init: function() {
            this.changTab();
            this.changTpl();
            this.changGroup();
            this.delTxt();
            this.addGroup();
            this.editGroup();
            this.delGroup();
            this.btnDel();
            this.page(1)
        },
        changTab: function() {
            this.filterLink.on("click", function() {
                if ($(this).attr("class") == "active") {
                    return false
                }
                $(this).parents("ul").find("a").removeClass("active");
                $(this).addClass("active");
                var a = Teacher.UserCenter.itemLib.getUrlData();
                Teacher.UserCenter.itemLib.get_question(a)
            })
        },
        changTpl: function() {
            var a = true;
            $(".md_paperCard ul").live("click", function() {
                if (a) {
                    $(this).parent().find(".tpl_answer").show();
                    a = false
                } else {
                    $(this).parent().find(".tpl_answer").hide();
                    a = true
                }
            })
        },
        changGroup: function() {
            var a = $(".doc_group ul");
            a.find("span.group_txt").live("mouseenter", function() {
                $(this).addClass("cur")
            }).live("mouseleave", function() {
                $(this).removeClass("cur")
            });
            a.find(".filter-group").live("click", function() {
                if ($(this).attr("class").indexOf("w_orange") > -1) {
                    return false
                }
                $(this).addClass("w_orange").parents("li").siblings().find("a").removeClass("w_orange");
                $(".doc_group").find("span.group_txt").removeClass("highcur");
                $(this).parents("span.group_txt").addClass("highcur");
                var b = Teacher.UserCenter.itemLib.getUrlData();
                Teacher.UserCenter.itemLib.get_question(b)
            })
        },
        getBaseUrl: function() {
            return "user/user_question/"
        },
        getUrlData: function(c) {
            c = c || 1;
            var b = $(".doc_group .w_orange").data() || {
                gid: ""
            };
            var a = $.extend({
                page: c
            }, b, $(".subject-chose").data(), $(".md_itemBox .md_hd .active").eq(0).data(), $(".md_itemBox .md_hd .active").eq(1).data());
            return a
        },
        get_question: function(a) {
            var b = this.getBaseUrl();
            a.ver = (new Date).valueOf();
            $.tizi_ajax({
                url: baseUrlName + b + "get_teacher_question",
                type: "GET",
                data: a,
                dataType: "json",
                success: function(c) {
                    if (c.errorcode == true) {
                        $(".ques-list").html(c.html)
                    } else {
                        $.tiziDialog({
                            content: c.error
                        })
                    }
                }
            })
        },
        page: function(a) {
            this.get_question(this.getUrlData(a))
        },
        delTxt: function() {
            var a = '<div class="md_docText"><h2>是否确定删除此题目?</h2></div>';
            $(".btnDel").live("click", function() {
                var d = $(this);
                if (d.attr("disabled") == "disabled") {
                    return false
                }
                d.attr("disabled", "disabled");
                var f = Teacher.UserCenter.itemLib.getBaseUrl();
                var e = $(".subject-chose").data("subject");
                var b = {
                    qid: d.data("num"),
                    sid: e,
                    ver: (new Date).valueOf()
                };
                var c = $.tiziDialog({
                    content: a,
                    icon: null,
                    title: "删除题目",
                    ok: function() {
                        $.tizi_ajax({
                            url: baseUrlName + f + "del_question",
                            type: "GET",
                            data: b,
                            dataType: "json",
                            success: function(h) {
                                if (h.error_code == true) {
                                    d.parents(".md_paperCard").remove();
                                    var g = parseInt($("#q_total").text());
                                    --g;
                                    if (g < 0) {
                                        g = 0
                                    }
                                    $("#q_total").text(g);
                                    Teacher.UserCenter.itemLib.get_ques_group()
                                } else {
                                    $.tiziDialog({
                                        content: h.error
                                    })
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        get_ques_group: function() {
            var c = $(".subject-chose").data("subject");
            var b = $(".doc_group .w_orange").data() || {
                gid: ""
            };
            var a = $.extend({
                sid: c
            }, b);
            $.tizi_ajax({
                url: baseUrlName + this.getBaseUrl() + "ajax_get_ques_groups",
                type: "GET",
                data: a,
                dataType: "json",
                success: function(d) {
                    if (d.error_code == true) {
                        $(".doc_group").html(d.html)
                    } else {
                        $.tiziDialog({
                            content: d.error
                        })
                    }
                }
            })
        },
        addGroup: function() {
            var e = $(".new_doc");
            var d = "";
            var b = $(".mdBox_beta").html();
            var a = baseUrlName + this.getBaseUrl() + "new_group";
            var c = $(".subject-chose").data("subject");
            e.live("click", function() {
                var f = $.tiziDialog({
                    content: b,
                    icon: null,
                    title: "新建试题分组",
                    ok: function() {
                        var g = "";
                        var j = $.trim($(".md_docText").find("input[name=group_name]").attr("value"));
                        if (!j) {
                            $.tiziDialog({
                                content: "请输入分组名称"
                            });
                            return false
                        }
                        if (j.length > 9) {
                            g = j.substr(0, 9) + ".."
                        } else {
                            g = j
                        }
                        var h = {
                            sid: c,
                            group_name: j
                        };
                        $.tizi_ajax({
                            url: a,
                            type: "POST",
                            data: h,
                            dataType: "json",
                            success: function(l) {
                                if (l.error_code == false) {
                                    $.tiziDialog({
                                        content: l.error
                                    })
                                } else {
                                    var k = '<li><span class="group_txt"><a href="javascript:void(0);" title="' + j + '" class="filter-group" data-gid="' + l.error + '">' + g + '</a><b>(0)</b></span><a href="javascript:void(0);" data-group="' + l.error + '" class="fr del_doc">删</a><a href="javascript:void(0);" data-group="' + l.error + '" class="fr edit_doc">编</a></li>';
                                    $(".doc_group ul").append(k)
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        editGroup: function() {
            var b = $(".new_doc");
            var a = "";
            $(".edit_doc").live("click", function() {
                var e = $(this).parents("li").find(".group_txt").find("a");
                var f = $(this);
                var h = e.text();
                var j = h.lastIndexOf("..");
                if (j > -1) {
                    h = e.attr("title")
                }
                $(".md_docText").find("h2").html("编辑试题分组");
                $(".md_docText").find("input[name=group_name]").attr("value", h);
                a = $(".mdBox_beta").html();
                var c = baseUrlName + Teacher.UserCenter.itemLib.getBaseUrl() + "update_group";
                var g = $(".subject-chose").data("subject");
                var d = $.tiziDialog({
                    content: a,
                    icon: null,
                    title: "编辑试题分组",
                    ok: function() {
                        var l = $.trim($(".md_docText").find("input[name=group_name]").attr("value"));
                        if (!l) {
                            $.tiziDialog({
                                content: "请输入分组名称"
                            });
                            return false
                        }
                        var k = {
                            sid: g,
                            gid: f.data("group"),
                            op_type: "update",
                            new_name: l
                        };
                        $.tizi_ajax({
                            url: c,
                            type: "POST",
                            data: k,
                            dataType: "json",
                            success: function(m) {
                                if (m.error_code == false) {
                                    $.tiziDialog({
                                        content: m.error
                                    })
                                } else {
                                    f.parents("li").find(".group_txt").find("a").text(l)
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        delGroup: function() {
            $(".del_doc").live("click", function() {
                var c = $(".doc_group li").eq(1);
                var e = $(this);
                if (e.attr("disabled") == "disabled") {
                    return false
                }
                e.attr("disabled", "disabled");
                var g = $(this).parents("li").find(".group_txt").find("a").attr("title");
                var d = '<div class="md_docText"><h2>是否确定删除分组：<b style="color: #ff6600;">' + g + "</b>？</h2><h2>删除分组后，该分组中的文档将标记为未分组。</h2></div>";
                var a = baseUrlName + Teacher.UserCenter.itemLib.getBaseUrl() + "update_group";
                var f = $(".subject-chose").data("subject");
                var b = $.tiziDialog({
                    content: d,
                    icon: null,
                    title: "删除试题分组",
                    ok: function() {
                        var h = {
                            sid: f,
                            gid: e.data("group"),
                            op_type: "delete"
                        };
                        $.tizi_ajax({
                            url: a,
                            type: "POST",
                            data: h,
                            dataType: "json",
                            success: function(j) {
                                if (j.error_code == false) {
                                    $.tiziDialog({
                                        content: j.error
                                    })
                                } else {
                                    e.parents("li").remove();
                                    c.removeClass("gray_li");
                                    c.html('<span class="group_txt"><a href="javascript:void(0);" class="filter-group" data-gid="0">未选分组</a><b>(' + j.count + ")</b></span>")
                                }
                            }
                        })
                    },
                    cancel: true
                })
            })
        },
        btnDel: function() {
            var b = $(".md_paperCard");
            var a = $(".btnDel");
            a.on("click", function() {
                $(this).parents(".md_paperCard").remove()
            })
        }
    },
    pageHeight: function() {
        $(".ucHeight").height($(window).height() - 80).css("overflow-y", "scroll");
        $(".child-menu").height($(window).height() - 90)
    },
    resizableFn: function() {
        var b = $(window).height();
        var a = $(window).width();
        var c = b - 80;
        $(".child-menu").height(c);
        $(".drag-line").height(c);
        $(".drag-handle").css("margin-top", c / 2 - 10 + "px");
        $(".child-menu").resizable({
            handles: "e",
            maxWidth: 390,
            minWidth: 190,
            resize: function() {
                var d = $(".child-menu").width() + 20;
                $(".userCenter .content-wrap").css("margin-left", d + "px")
            }
        })
    },
    modifyMyInfo: {
        init: function() {
            Common.valid.teacherModifyMyInfo.init();
            this.modifyTrueName();
            this.modifyEmail();
            this.modifyMyPhone();
            this.toggle();
            this.cancelDd();
            Common.sendCaptap.sms.init($(".modifyPhone").val(), 4, ".modifyPhone");
            Common.sendCaptap.email.init($(".aSendEmailInput").attr("data-mail_address"), 3)
        },
        toggle: function() {
            $(".modifyMyInfo dl").hover(function() {
                $(this).addClass("addBg")
            }, function() {
                if ($(this).find("dd").css("display") == "block") {
                    return false
                } else {
                    $(this).removeClass("addBg")
                }
            }).click(function() {
                $(this).siblings().removeClass("addBg");
                $(this).siblings().find("dd").removeClass("activeDiv");
                $(this).find("dd").addClass("activeDiv")
            })
        },
        cancelDd: function() {
            $(".cancelBtn").click(function(a) {
                a.stopPropagation();
                $(this).parent().parent().parent().parent().removeClass("activeDiv")
            })
        },
        modifyTrueName: function() {
            $(".nameSubmit input").click(function() {
                Common.valid.teacherModifyMyInfo.init()
            })
        },
        modifyEmail: function() {
            $(".mailSubmit input").click(function() {
                Common.valid.teacherModifyMyInfo.init()
            })
        },
        modifyMyPhone: function() {
            $(".phoneSubmit input").click(function() {
                Common.valid.teacherModifyMyInfo.init()
            })
        },
        modifyMyPassword: function() {
            $(".passwordSubmit input").click(function() {
                Common.valid.teacherModifyMyInfo.init()
            })
        }
    }
};
Teacher.homeworkCenter = {
    getCalendar: function() {
        var b = $(".Wdate");
        var e = new Date();
        var j = e.getFullYear();
        var a = e.getMonth() + 1;
        var g = e.getDate();
        var f = j + "-" + a + "-" + g;
        if (a < 10) {
            a = "0" + a
        } else {
            a = a
        }
        if (g < 10) {
            g = "0" + g
        } else {
            g = g
        }
        var c = j + "-" + a + "-" + g;
        b.attr("value", c)
    },
    selectClassGrade: function() {
        $(".classGrade").find("input").each(function() {
            if ($(this).attr("checked") == "checked") {
                var c = $(this).attr("class-id");
                $(this).addClass("checked");
                $("#chooseTextbook").show();
                var b = $("#chooseTextbook").find("li");
                b.each(function() {
                    if ($(this).attr("text-id") == c) {
                        $(this).show()
                    }
                })
            }
            a();
            $(this).live("click", function() {
                if ($(".chooseTextbook").find(".active").length > 0) {
                    if ($(this).attr("checked") == "checked") {
                        var e = $(this).attr("class-id");
                        $(this).addClass("checked")
                    } else {
                        var e = $(this).attr("class-id");
                        $(this).removeClass("checked")
                    }
                    return true
                } else {
                    $("#chooseTextbook").find("li").hide();
                    $(".classGrade").find("input").each(function() {
                        if ($(this).attr("checked") == "checked") {
                            var g = $(this).attr("class-id");
                            $(this).addClass("checked");
                            $("#chooseTextbook").show();
                            var f = $("#chooseTextbook").find("li");
                            f.each(function() {
                                if ($(this).attr("text-id") == g) {
                                    $(this).show()
                                }
                            })
                        }
                    });
                    if ($(this).attr("checked") == "checked") {
                        var e = $(this).attr("class-id");
                        $(this).addClass("checked");
                        $("#chooseTextbook").show();
                        var d = $("#chooseTextbook").find("li");
                        d.each(function() {
                            if ($(this).attr("text-id") == e) {
                                $(this).show()
                            }
                        })
                    } else {
                        var e = $(this).attr("class-id");
                        $(this).removeClass("checked");
                        var d = $("#chooseTextbook").find("li");
                        d.each(function() {
                            if ($(this).attr("text-id") == e) {
                                $(this).hide()
                            }
                        });
                        $("#chooseUint,#chooseUnitChild,#remarks,.sum,.controlBtn,.wormNotice,.changeTextbook").hide()
                    }
                    a()
                }
                Teacher.homeworkCenter.distinct_textbook()
            })
        });

        function a() {
            var b = $(".classGrade").find(".checked").length;
            if (b == 0) {
                $("#chooseTextbook").hide()
            } else {
                if (b == 1) {
                    $("#chooseTextbook .addTextbook").show()
                } else {
                    if (b > 1) {
                        $("#chooseTextbook .addTextbook").hide()
                    }
                }
            }
        }
    },
    changeTextbook: function() {
        $(".changeTextbook").live("click", function() {
            $("#chooseUint,#chooseUnitChild,#remarks,.sum,.controlBtn,.wormNotice,.changeTextbook").hide();
            $(".chooseTextbook").children("li").removeClass("active");
            $("#chooseTextbook").find("li").hide();
            $(".classGrade").find("input").each(function() {
                if ($(this).attr("checked") == "checked") {
                    var c = $(this).attr("class-id");
                    $(this).addClass("checked");
                    var b = $("#chooseTextbook").find("li");
                    b.each(function() {
                        if ($(this).attr("text-id") == c) {
                            $(this).show()
                        }
                    })
                }
                if ($(this).attr("checked") == false) {
                    var c = $(this).attr("class-id");
                    $(this).removeClass("checked");
                    var b = $("#chooseTextbook").find("li");
                    b.each(function() {
                        if ($(this).attr("text-id") == c) {
                            $(this).hide()
                        }
                    })
                }
            });
            if ($(".classGrade").find(".checked").length < 1) {
                $(".chooseTextbook").children("li").show().removeClass("active")
            }
            var a = $(".classGrade").find(".checked").length;
            if (a == 1) {
                $("#chooseTextbook .addTextbook").show()
            } else {
                $("#chooseTextbook .addTextbook").hide()
            }
            Teacher.homeworkCenter.distinct_textbook()
        })
    },
    selectTextbook: function() {
        $(".chooseTextbook").find(".textbook").each(function() {
            $(this).live("click", function() {
                $(this).addClass("active");
                $(this).siblings().hide();
                $(".changeTextbook,.wormNotice").show();
                var c = $(this).find(".dep2id").attr("value");
                var b = $(this).find(".dep2id").attr("t-name");
                $(".text_book_id").val(c);
                $(".text_book_name").val(b);
                $.tizi_ajax({
                    url: "/ep/ep/get_question_types",
                    type: "GET",
                    data: {
                        id: c
                    },
                    dataType: "json",
                    success: function(d) {
                        $(".question_types").html(d.html);
                        $.tizi_ajax({
                            url: "/ep/ep/get_34_category",
                            type: "GET",
                            data: {
                                id: c
                            },
                            dataType: "json",
                            success: function(h) {
                                t = '<h3><span class="greenCircle">4</span>选择教材同步单元（请点击单元名称）</h3>';
                                t += '<ul class="chooseUint m_l_30 cf">';
                                t4 = '<h3><span class="greenCircle">5</span>选择子单元</h3><div class="chooseUnitChild m_l_30">';
                                var g = "";
                                var k = false;
                                for (var f = 0; f < h.length; f++) {
                                    t += "<li d3-id=" + h[f].id + '><a href="javascript:;">' + h[f].name + "</a><span></span></li>";
                                    if (h[f].d4) {
                                        k = true;
                                        for (var e = 0; e < h[f].d4.length; e++) {
                                            t4 += "<dl dep3-id=" + h[f].id + ' dep3-name="' + h[f].name + '"" dep4-id=' + h[f].d4[e].id + ' dep4-name="' + h[f].d4[e].name + '""><dt class="title"><a href="javascript:;"></a>';
                                            t4 += h[f].d4[e].name + "</dt>" + $(".question_types").html() + "</dl>"
                                        }
                                    } else {
                                        g += '<dl class="m_l_30" dep3-id=' + h[f].id + ' dep3-name="' + h[f].name + '" dep4-id="' + h[f].id + '" dep4-name="' + h[f].name + '" >';
                                        g += $(".question_types").html() + "</dl>"
                                    }
                                }
                                t += "</ul>";
                                if (g.length > 1) {
                                    if (k == false) {
                                        t4 = '<h3><span class="greenCircle">5</span>选择题目数量：</h3><div class="chooseUnitChild">'
                                    }
                                    t4 += g
                                }
                                t4 += "</div>";
                                $("#chooseUint").html(t);
                                $("#chooseUnitChild").html(t4);
                                Teacher.homeworkCenter.chooseUint()
                            }
                        })
                    }
                });
                $("#chooseUint").show();
                var a = $("#chooseTextbook").offset().top - 50;
                setTimeout(function() {
                    if (a == 0) {
                        return false
                    } else {
                        $(".mainContainer").scrollTop(a)
                    }
                }, 300)
            })
        })
    },
    addTextbook: function() {
        $("#addTextbookBox").find("a").each(function() {
            $(this).live("click", function() {
                var a = $(this).next().children().children("input");
                if (a.attr("checked") == "checked") {
                    a.attr("checked", false);
                    $(this).parent().removeClass("active")
                } else {
                    a.attr("checked", "checked");
                    $(this).parent().addClass("active")
                }
            })
        });
        $("#addTextbookBox").find("label").each(function() {
            $(this).live("click", function() {
                if ($(this).children("input").attr("checked") == "checked") {
                    $(this).parent().parent().addClass("active")
                } else {
                    $(this).parent().parent().removeClass("active")
                }
            })
        })
    },
    exercise_plan_intel_index: function() {
        $(".saveCenterHomework").each(function() {
            if ($(this).attr("id") == "saveCenterHomework") {
                $("#saveCenterHomework").live("click", function() {
                    $(this).removeAttr("id");
                    var e = "";
                    $("input[name='classgrade']:checked").each(function() {
                        e += $(this).attr("class-id") + ","
                    });
                    if (e.length < 1) {
                        $.tiziDialog({
                            content: "请至少选择一个班级"
                        });
                        $(".saveCenterHomework").attr("id", "saveCenterHomework");
                        return false
                    }
                    var o = "";
                    $("input[name='classgrade']:checked").each(function() {
                        o += $(this).attr("class-name") + ","
                    });
                    var h = $(".remarks").find("textarea").val();
                    var g = $(".start_day").val();
                    var m = $(".end_day").val();
                    if (g.length < 1 || m.length < 1) {
                        $.tiziDialog({
                            content: "请选择合适的起始和截止时间"
                        });
                        $(".saveCenterHomework").attr("id", "saveCenterHomework");
                        return false
                    }
                    var c = g.split("-");
                    var p = m.split("-");
                    if (c[0] > p[0]) {
                        $.tiziDialog({
                            content: "开始时间必须早于截止时间"
                        });
                        $(".saveCenterHomework").attr("id", "saveCenterHomework");
                        return false
                    } else {
                        if (c[0] == p[0] && c[1] > p[1]) {
                            $.tiziDialog({
                                content: "开始时间必须早于截止时间"
                            });
                            $(".saveCenterHomework").attr("id", "saveCenterHomework");
                            return false
                        } else {
                            if (c[0] == p[0] && c[1] == p[1] && c[2] > p[2]) {
                                $.tiziDialog({
                                    content: "开始时间必须早于截止时间"
                                });
                                $(".saveCenterHomework").attr("id", "saveCenterHomework");
                                return false
                            }
                        }
                    }
                    var d = $(".end_hour").val();
                    var f = $(".end_min").val();
                    var l = $("#selectDifNum").html();
                    var k = $("#chooseUnitChild").find("dl");
                    var n = "";
                    k.each(function() {
                        d3_course_id = $(this).attr("dep3-id");
                        d3_course_name = $(this).attr("dep3-name");
                        course_id = $(this).attr("dep4-id");
                        course_name = $(this).attr("dep4-name");
                        var a = $(this).find("._select");
                        var b = "";
                        a.each(function() {
                            var r = $(this).attr("q-type-id");
                            var q = $(this).val();
                            if (q > 0) {
                                b = r + "-" + q;
                                n += d3_course_id + "-" + course_id + "-" + b + "-" + d3_course_name + "-" + course_name + ","
                            }
                        })
                    });
                    var j = 0;
                    $(".chooseUnitChild select").each(function() {
                        j += parseInt($(this).val())
                    });
                    if (isNaN(j) || j < 1) {
                        $.tiziDialog({
                            content: "请至少选择一道题"
                        });
                        $(".saveCenterHomework").attr("id", "saveCenterHomework");
                        return false
                    }
                    Common.floatLoading.showFloatLoading();
                    $.tizi_ajax({
                        url: "/ep/epi/index",
                        type: "GET",
                        data: {
                            d: n,
                            text_book_id: $(".text_book_id").val(),
                            text_book_name: $(".text_book_name").val(),
                            diff: l,
                            class_ids: e,
                            class_names: o,
                            remark: h,
                            start: g,
                            end: m,
                            end_hour: d,
                            end_min: f,
                            ver: (new Date).valueOf()
                        },
                        dataType: "json",
                        success: function(a) {
                            Common.floatLoading.hideFloatLoading();
                            if (a.errorcode == true) {
                                $(".homeworkCenter").html(a.html)
                            } else {
                                $("dl[dep4-id=" + a.course_id + "]").find("td[q-type-id]").html("");
                                if (a.all == false) {
                                    $("dl[dep4-id=" + a.course_id + "]").find("td[q-type-id=" + a.type + "]").html("题目不足").css("color", "#f00")
                                } else {
                                    if (a.all == true) {
                                        for (i = 0; i < a.types.length; i++) {
                                            $("dl[dep4-id=" + a.course_id + "]").find("td[q-type-id=" + a.types[i] + "]").html("题目不足").css("color", "#f00")
                                        }
                                    }
                                }
                                $.tiziDialog({
                                    content: a.error
                                });
                                $(".saveCenterHomework").attr("id", "saveCenterHomework")
                            }
                        }
                    })
                })
            }
        })
    },
    distinct_textbook: function() {
        var b = $(".chooseTextbook").find("li");
        var a = new Array();
        b.each(function() {
            if ($(this).attr("style") == "display: list-item;" && $(this).attr("text-id")) {
                var c = $(this).attr("dep2id");
                if ($.inArray(c, a) != -1) {
                    $(this).hide()
                } else {
                    a.push(c)
                }
            }
        })
    },
    addTextbookToClass: function() {
        $(".addTextbook").click(function() {
            var a = $("input[name='classgrade']:checked").attr("id");
            var c = $(".subject_type_id").val();
            var b = "/ep/ep/ct?s=" + c + "&class_id=" + a;
            window.location.href = b
        })
    },
    change_sum: function() {
        $(".chooseUnitChild select").live("click", function() {
            var b = 0;
            var a = 0;
            $(".chooseUnitChild select").each(function() {
                var c = $(this).attr("q-type-id");
                if (c == 3) {
                    b += parseInt($(this).val())
                } else {
                    a += parseInt($(this).val())
                }
            });
            $(".sum-online").val(b);
            $(".sum-offline").val(a);
            $(".sum-online").html("电脑题目:" + b);
            $(".sum-offline").html("纸上题目:" + a)
        })
    },
    saveStatus: function() {
        if ($(".re").val() == 1) {
            $(".wormNotice,.changeTextbook,#chooseTextbook li,#chooseUint,.selectBox").show();
            $("#remarks, .homeworkCenter .sum").show();
            $(".homeworkCenter .controlBtn,.homeworkCenter ").show();
            $(".chooseUint li span").show();
            $("#chooseUnitChild").hide();
            t = $("._set_typs_list").val();
            var a = t.split(",");
            for (i = 0; i < a.length; i++) {
                tmp = a[i].split("-");
                if (tmp.length > 1) {
                    $("dl[dep4-id=" + tmp[0] + "] select").each(function() {
                        if ($(this).attr("q-type-id") == tmp[1]) {
                            $(this).val(tmp[2])
                        }
                    })
                }
            }
        }
    },
    inspectHomework: function() {
        var a = $(".inspectHomework");
        a.each(function() {
            if ($(this).hasClass("centerGrayMax")) {
                $(this).hover(function() {
                    var d = '<div id="inspectHomeworkNotice">提示：<br />所有学生全部交作业，或者到达作业截止时间后才可以检查作业。</div>';
                    var b = $(this).offset().left;
                    var c = $(this).offset().top;
                    $("body").append(d);
                    var f = $("#inspectHomeworkNotice");
                    var e = f.height();
                    f.show().css({
                        left: b + "px",
                        top: c - e - 45 + 23 + "px"
                    })
                }, function() {
                    $("#inspectHomeworkNotice").remove()
                })
            }
        })
    },
    unitChildSelect: function(a) {
        $(".chooseUnitChild dl select").each(function() {
            $(this).live("change", function() {
                var c = $(this).parents("dl").attr("dep3-id");
                var b = 0;
                $(".chooseUnitChild dl[dep3-id=" + a + "] select").each(function() {
                    b += parseInt($(this).val())
                });
                $(".chooseUint li").each(function() {
                    if ($(this).attr("d3-id") == c) {
                        s = $(this).children("span");
                        s.html(b).show();
                        if (s.html() == "0") {
                            s.hide()
                        }
                    }
                })
            })
        })
    },
    make_paper_and_assign_to_class: function() {
        $("#previewConfirm").click(function() {
            if ($(this).attr("id") == "previewConfirm") {
                $(this).removeAttr("id");
                var a = $("#class-ids").val();
                var b = $("#subject_id").val();
                if (a.length > 0 && b > 0) {
                    Common.floatLoading.showFloatLoading();
                    $.tizi_ajax({
                        url: "/paper/homework_question/add_exercise_plan_to_paper",
                        type: "POST",
                        data: {
                            sid: b,
                            class_ids: a,
                            ver: (new Date).valueOf()
                        },
                        dataType: "json",
                        success: function(e) {
                            if (e.errorcode == true) {
                                var d = e.paper_id;
                                var h = $(".start").val();
                                var c = $(".end").val();
                                var f = $(".diff").val();
                                var g = $(".remark").val();
                                $.tizi_ajax({
                                    url: "/ep/ep/invoke_assign",
                                    type: "POST",
                                    data: {
                                        subject_id: b,
                                        class_ids: a,
                                        paper_id: d,
                                        start: h,
                                        end: c,
                                        diff: f,
                                        remark: g,
                                        ver: (new Date).valueOf()
                                    },
                                    dataType: "json",
                                    success: function(j) {
                                        Common.floatLoading.hideFloatLoading();
                                        if (j.errorcode == true) {
                                            $.tiziDialog({
                                                content: "布置成功",
                                                ok: function() {
                                                    window.location.href = "/teacher/homework/center"
                                                }
                                            })
                                        } else {
                                            $.tiziDialog({
                                                content: j.error,
                                                ok: function() {
                                                    $(".saveCenterHomework").attr("id", "previewConfirm")
                                                }
                                            })
                                        }
                                    }
                                })
                            } else {
                                Common.floatLoading.hideFloatLoading();
                                $.tiziDialog({
                                    content: e.error,
                                    ok: function() {
                                        $(".saveCenterHomework").attr("id", "previewConfirm")
                                    }
                                })
                            }
                        }
                    })
                } else {
                    $.tiziDialog({
                        content: "班级或科目不合法",
                        ok: function() {
                            $(".saveCenterHomework").attr("id", "previewConfirm")
                        }
                    })
                }
            }
        })
    },
    delhw: function() {
        $(".deleteHomework").click(function() {
            var a = $(this).attr("ass-id");
            $.tiziDialog({
                content: "确定要删除么?",
                ok: function() {
                    $.tizi_ajax({
                        url: "/ep/ep/del/" + a,
                        type: "POST",
                        data: {},
                        dataType: "json",
                        success: function(b) {
                            $.tiziDialog({
                                content: b.error,
                                ok: function() {
                                    if (b.errorcode == true) {
                                        location.reload()
                                    }
                                }
                            })
                        }
                    })
                },
                cancel: true
            })
        })
    },
    chooseUint: function() {
        $(".chooseUint").find("li").each(function() {
            $(this).live("click", function() {
                $(this).addClass("active").siblings().removeClass("active");
                $(this).parent().next().show();
                $("#chooseUnitChild,#remarks,.homeworkCenter .sum,.homeworkCenter .controlBtn,.wormNotice").show();
                var e = $(this).attr("d3-id");
                var b = $("#chooseUnitChild").find("dl");
                b.each(function() {
                    if ($(this).attr("dep3-id") == e) {
                        $(this).show();
                        $(this).children("dt").show();
                        if ($(this).children("dt").length == 0) {
                            $(this).children("dd").show()
                        }
                    } else {
                        $(this).hide()
                    }
                });
                Teacher.homeworkCenter.unitChildSelect(e);
                var d = $(this).offset().top - 50;
                var c = $(".mainContainer").scrollTop();
                setTimeout(function() {
                    if (d == 0) {
                        return false
                    } else {
                        $(".mainContainer").scrollTop(c + d)
                    }
                }, 300)
            })
        });
        Teacher.homeworkCenter.chooseUnitChild()
    },
    display_save_btn: function() {
        $(".controlBtn").show()
    },
    chooseUnitChild: function() {
        $(".chooseUnitChild .title a").each(function() {
            $(this).live("click", function() {
                var d = $(this).parent();
                var e = $(this).parent().siblings("dd");
                var a = $(this).next().children("input");
                var c = $(this).parent().parent().siblings().children("dd");
                if (e.css("display") == "none") {
                    d.addClass("active");
                    e.show();
                    c.hide();
                    c.siblings("dt").removeClass("active");
                    c.siblings("dt").children().children("input").attr("checked", false);
                    a.attr("checked", true)
                } else {
                    d.removeClass("active");
                    e.hide();
                    a.attr("checked", false)
                }
            });
            $("#remarks,.homeworkCenter .sum,.homeworkCenter .controlBtn").show()
        })
    },
    homeworkTab: function(c, a, b) {
        $(b).each(function() {
            $(this).children().eq(0).show().siblings().hide()
        });
        $(c).each(function() {
            $(this).children().eq(0).addClass(a)
        });
        $(c).children().click(function() {
            $(this).addClass(a).siblings().removeClass(a);
            var d = $(c).children().index(this);
            $(b).children().eq(d).show().siblings().hide()
        })
    },
    checkCourse: function() {
        $(".checkCourse").live("click", function() {
            var a = $(this).attr("q-ids");
            $.tizi_ajax({
                url: "/ep/ep/check_questions_before_assign",
                type: "GET",
                data: {
                    q_ids: a
                },
                dataType: "json",
                success: function(e) {
                    if (e.errorcode) {
                        var d = e.error;
                        var b = 0;
                        var f = '<div class="pop_main"><ul class="courseForm courseForm3 cf"></ul>';
                        f += '<div class="courseNameBox courseNameBox3"><div class="courseName">';
                        f += "<p>共计" + d.length + '小题</p><div class="courseBpx">';
                        for (var c = 0; c < d.length; c++) {
                            b = c + 1;
                            f += '<div class="courseList"><span class="order">' + b + ".</span>" + d[c].body + "</div>"
                        }
                        f += "</div></div></div>";
                        $("#checkCourseWin").html(f)
                    } else {
                        var f = e.error
                    }
                    $.tiziDialog({
                        title: "查看题目",
                        content: f,
                        icon: null,
                        width: 800,
                        ok: function() {}
                    })
                }
            });
            Teacher.homeworkCenter.homeworkTab(".courseForm3", "active", ".courseNameBox3")
        })
    },
    change_suite: function() {
        $(".changeCourse").live("click", function() {
            var e = $(".diff").val();
            var b = $("#class-ids").val();
            var a = $(this).attr("dthree-id");
            var d = $(this).attr("dfour-id");
            var f = $(this).attr("typelist");
            var c = $(this);
            $.tizi_ajax({
                url: "/ep/epi/change_suite",
                type: "POST",
                data: {
                    diff: e,
                    class_ids: b,
                    d3_id: a,
                    d4_id: d,
                    typelist: f,
                    ver: (new Date).valueOf()
                },
                dataType: "json",
                success: function(g) {
                    if (g.errorcode == true) {
                        var h = "更换成功";
                        c.parents("tr").find(".col2 a").attr("q-ids", g.error)
                    } else {
                        var h = g.error
                    }
                    $.tiziDialog({
                        content: h,
                        ok: function() {}
                    })
                }
            })
        })
    },
    courseDetial: function() {
        $(".courseDetial").live("click", function() {
            var a = $(this).text();
            $.tiziDialog({
                title: a,
                content: $("#courseDetialWin").html(),
                icon: null,
                width: 800,
                ok: function() {}
            })
        })
    },
    checkAll: function() {
        $("#checkAll").live("click", function() {
            if (this.checked) {
                $(".commentName input[name='checkbox']").each(function() {
                    this.checked = true
                })
            } else {
                $(".commentName input[name='checkbox']").each(function() {
                    this.checked = false
                })
            }
        })
    },
    comment: function() {
        $(".writeComment").live("click", function() {
            var a = $(this).text();
            var b = $(".assignment_id").val();
            $.tizi_ajax({
                url: "/ep/ep/give_cmt_preview",
                type: "GET",
                data: {
                    ass_id: b,
                    ver: (new Date).valueOf()
                },
                dataType: "json",
                success: function(e) {
                    if (e.errorcode == true) {
                        var c = '<div class="pop_main"><div class="commentBpx"><div class="commentName fl"><div class="m_b_5">选择学生</div><ul>';
                        for (var d = 0; d < e.stu.length; d++) {
                            c += '<li><label for="' + e.stu[d].student_id + '">';
                            c += '<input type="checkbox" name="checkbox" id="' + e.stu[d].student_id + '" value="' + e.stu[d].student_id + '" />';
                            c += e.stu[d].name + "</label></li>"
                        }
                        c += '</ul><div class="checkAll"><label for="checkAll"><input id="checkAll" type="checkbox" name="name" />全选</label></div></div><div class="commentDetial fl"><div class="m_b_5">评论内容</div><textarea class="cmt_content"></textarea></div></div></div>';
                        $.tiziDialog({
                            title: a,
                            content: c,
                            icon: null,
                            width: 800,
                            ok: function() {
                                var g = "";
                                $("input[name='checkbox']:checked").each(function() {
                                    g += $(this).val() + ","
                                });
                                if (g.length < 1) {
                                    $.tiziDialog({
                                        content: "请选择至少一个学生"
                                    });
                                    return false
                                }
                                var f = $(".cmt_content").val();
                                if (f.replace(/(^\s*)|(\s*$)/g, "").length < 1) {
                                    $.tiziDialog({
                                        content: "评语内容不能为空"
                                    });
                                    return false
                                }
                                $.tizi_ajax({
                                    url: "/ep/ep/insert_cmt",
                                    type: "POST",
                                    data: {
                                        stu_ids: g,
                                        ass_id: b,
                                        cmt: f,
                                        ver: (new Date).valueOf()
                                    },
                                    dataType: "json",
                                    success: function(h) {
                                        if (h == 1) {
                                            $.tiziDialog({
                                                content: "添加成功"
                                            });
                                            location.reload()
                                        } else {
                                            $.tiziDialog({
                                                content: h.error
                                            })
                                        }
                                    }
                                })
                            }
                        });
                        Teacher.homeworkCenter.checkAll()
                    } else {
                        $.tiziDialog({
                            content: e.error
                        })
                    }
                }
            })
        })
    },
    save_textbook: function() {
        $(".save_tb").live("click", function() {
            var b = $(".subject_type_id").val();
            var d = "";
            $("input[name='course_id']:checked").each(function() {
                d += $(this).attr("id") + ","
            });
            var c = $(".class_id").attr("value");
            var a = {
                id: d,
                ver: (new Date).valueOf(),
                class_id: c,
                subject_type_id: b
            };
            $.tizi_ajax({
                url: "/ep/ep/save_textbook",
                type: "POST",
                data: a,
                dataType: "json",
                success: function(e) {
                    if (e.errorcode == true) {
                        e = "教材添加成功！"
                    } else {
                        e = e.error
                    }
                    $.tiziDialog({
                        content: e,
                        ok: function() {
                            window.location.href = "/teacher/homework/pre_assign?s=" + b + "&c=" + c
                        }
                    })
                }
            })
        })
    },
    courseAnswer: function() {
        $(".coursecardBox li").live("click", function() {
            var e = $(this).attr("value");
            var c = $(".assignment_id").val();
            var b = $(".stu_id").val();
            var a = {
                id: e,
                ver: (new Date).valueOf(),
                assignment_id: c,
                stu_id: b
            };
            var d = $(this);
            $.tizi_ajax({
                url: "/ep/ep/get_question_and_answer",
                type: "GET",
                data: a,
                dataType: "json",
                success: function(g) {
                    $(".imagecontent").html(g.body);
                    $(".rightAnswer").html("正确答案：" + g.asw);
                    $("#student_answer_color").html("学生答案：" + g.stuanswer);
                    if (g.asw == g.stuanswer) {
                        $("#student_answer_color").attr("class", "rightAnswer")
                    } else {
                        $("#student_answer_color").attr("class", "wrongAnswer")
                    }
                    var f = d.find("a").html();
                    $.tiziDialog({
                        title: "第" + f + "题",
                        content: $("#courseAnswerWin").html(),
                        icon: null,
                        width: 800,
                        ok: function() {}
                    })
                }
            })
        })
    },
    history_hw_pagination: function() {
        $(".next_his_hw").click(function() {
            var c = $(this).parent().siblings("input[class=page]").val();
            var a = $(this).parent().siblings("input[class=page]").attr("class-id");
            var b = $(this);
            $.tizi_ajax({
                url: "/ep/ep/get_history_hw",
                type: "GET",
                data: {
                    page: c,
                    class_id: a,
                    ver: (new Date).valueOf
                },
                dataType: "json",
                success: function(d) {
                    if (d.errorcode == true) {
                        b.parent().parent().html(d.html)
                    } else {}
                }
            })
        });
        $(".pre_his_hw").click(function() {
            var c = $(this).parent().siblings("input[class=page]").val();
            c = c - 2;
            var a = $(this).parent().siblings("input[class=page]").attr("class-id");
            var b = $(this);
            $.tizi_ajax({
                url: "/ep/ep/get_history_hw",
                type: "GET",
                data: {
                    page: c,
                    class_id: a,
                    ver: (new Date).valueOf
                },
                dataType: "json",
                success: function(d) {
                    if (d.errorcode == true) {
                        b.parent().parent().html(d.html)
                    } else {}
                }
            })
        })
    },
    textareaLimit: function() {
        var b = document.getElementById("textareaBox");

        function a() {
            if (d(b) > 200) {
                sum = 0;
                for (i = 0; i < b.value.length; i++) {
                    sum += c(b.value.substr(i, 1));
                    if (sum > 200) {
                        b.value = b.value.substr(0, i)
                    }
                }
            }
        }

        b.onkeyup = a;

        function c(f) {
            var e = f;
            var g = 0;
            var g = e.match(/[^ -~]/g) == null ? e.length : e.length + e.match(/[^ -~]/g).length;
            return g
        }

        function d(g) {
            var e = g.value;
            var f = 0;
            e.replace(/\n*\s*/, "") == "" ? f = 0 : f = e.match(/[^ -~]/g) == null ? e.length : e.length + e.match(/[^ -~]/g).length;
            return f
        }
    }
};
Teacher.paper.myquestion = {
    questionList: $(".question-list"),
    typeList: $(".typelist"),
    init: function() {
        this.questionList.on("click", ".question-content", function() {
            var a = this;
            $(a).find(".answer").toggle()
        });
        this.questionList.on("click", ".control-btn", function() {
            var a = this;
            Teacher.paper.testpaper.addQuestionClick(a)
        });
        this.questionList.on("click", ".all_in", function(b) {
            var a = this;
            b.stopPropagation();
            Teacher.paper.testpaper.addQuestionsClick(a);
            return false
        });
        Teacher.paper.paper_common.randerQuestion = Teacher.paper.myquestion.randerQuestion;
        Teacher.UserCenter.itemLib.get_question = Teacher.paper.myquestion.get_question;
        Teacher.UserCenter.itemLib.init()
    },
    randerQuestion: function() {
        if ($(".question-box").length > 0) {
            this_a = Teacher.paper.myquestion;
            var a = $(".page").find(".active").html();
            if (a == undefined) {
                a = 1
            }
            this_a.get_question(Teacher.UserCenter.itemLib.getUrlData(a), true)
        }
    },
    get_question: function(a, b) {
        if (b != true) {
            $(".all_in").removeClass("all_in").addClass("all_in_2");
            Common.floatLoading.showLoading()
        }
        a.ver = (new Date).valueOf();
        $.tizi_ajax({
            url: baseUrlName + "paper/myquestion/get_myquestion",
            type: "GET",
            data: a,
            dataType: "json",
            success: function(c) {
                $(".all_in_2").removeClass("all_in_2").addClass("all_in");
                Common.floatLoading.hideLoading();
                if (c.errorcode == true) {
                    $(".question-list").html(c.html);
                    $(".mainContainer .content").css("height", $(".mainContainer .content").height()).css("overflow-y", "scroll");
                    $(".question-list .question-box").first().find("a.control-btn").find(".cBtnNormal").addClass("fl");
                    $(".question-list .question-box").first().find("a.control-btn").find("em").addClass("fl");
                    $(".question-list .question-box").first().find("a.control-btn").prepend('<div class="all_in cBtnNormal fl" data-question_origin="1" style="margin-right:5px;"><a class="addAllPaper"><i>将本页题目全部加入试卷</i></a></div>')
                } else {
                    $.tiziDialog({
                        content: c.error
                    })
                }
            }
        })
    }
};
Teacher.ZeroClipboard_v123 = function() {
    var a = false;
    var b = new ZeroClipboard($("#inviteId"), {
        moviePath: baseUrlName + "application/views/static/js/tools/ZeroClipboard/ZeroClipboard.1.2.3.swf",
        forceHandCursor: true
    });
    b.on("load", function(c) {
        b.on("dataRequested", function(d, e) {
            b.setText($("#inviteCode").text())
        });
        b.on("complete", function() {
            $.tiziDialog({
                id: "copyClipID",
                content: "复制成功啦！赶快发送给你身边的老师或学生吧：）",
                icon: "succeed"
            })
        })
    });
    b.on("noflash", function() {
        if (!a) {
            a = true;
            $("#inviteId").html("")
        }
    });
    b.on("wrongflash", function() {
        if (!a) {
            a = true;
            $("#inviteId").html("")
        }
    })
};
Teacher.ZeroClipboard = function() {
    ZeroClipboard.setMoviePath(baseUrlName + "application/views/static/js/tools/ZeroClipboard/ZeroClipboard.1.0.7.swf");
    var a = new ZeroClipboard.Client();
    a.setHandCursor(true);
    a.setText($("#inviteCode").text());
    a.glue("inviteId");
    a.addEventListener("complete", function() {
        $.tiziDialog({
            id: "copyClipID",
            content: "复制成功啦！赶快发送给你身边的老师或学生吧：）",
            icon: "succeed"
        })
    })
};