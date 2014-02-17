var TeacherCommon = {};
if ($(".tree-list").length == 1) {
	$(".tree-list").height($(window).height() - 80 - 32).css("overflow-y", "scroll")
}
TeacherCommon.leftSlidown = function(e) {
	var d = e.id,
		b = e.con,
		c = e.dis,
		a = e.active;
	$(d).hover(function() {
		$(this).find("h2").attr("id", a);
		$(b).addClass(c)
	}, function() {
		$(this).find("h2").attr("id", "");
		$(b).removeClass(c)
	})
};
if ($(".mainContainer").attr("pagename") != undefined) {
    $(".mainMenu li").each(function(a) {
        if ($(".mainContainer").attr("pagename") == $(".mainMenu li").eq(a).attr("name")) {
            $(".mainMenu li").eq(a).find("a").attr("class", "active")
        }
    })
}