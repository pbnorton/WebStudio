$(document).ready(function() {

/* Event handlers for the slide-out menu **************************************************/
	$(".btn-slide").on("click", function() {
		$(".panel").animate({
			left: parseInt($(".panel").css("left"), 10) == 0 ? -$(".panel").outerWidth() : 0
		}, "fast");
	});
	
	$(".icon.draggable").draggable({
		cursor: "move",
		opacity: .5,
		revert: true,
		revertDuration: 0,
		start: function() {
			WebStudio.moduleSource = $(this).parent().attr("id");
		}
	});
});

