$(document).ready(function() {
	var whiteboard = WebStudio.whiteboard;
	
	$(".btn-slide").on("click", function() {
		$(".panel").animate({
			left: parseInt($(".panel").css("left"), 10) == 0 ? -$(".panel").outerWidth() : 0
			//left: "-250px"
		}, "fast");
	});
	
	$(".icon.draggable").draggable();
	$(".icon.draggable").on("mouseup", function(e) { 
		WebStudio.addNode($(this).offset().left, $(this).offset().top);
		$(this).css({"left": "0", "top": "0"});
	});
});

