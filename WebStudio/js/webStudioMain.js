$(document).ready(function() {
	
	// Event handlers for the slide-out menu 
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
	
	$("#runBtn").on("click", function() {
		var start = lookup("start", "type", data.nodes);
		traversal(data.nodes[start]);
	});
	
	WebStudio.init();
	
});

var traversal = function(p) {
	if(p === null)
		return 0;
	
	if(p instanceof PNode) {
		console.log(p.id + " " + p.type);
		forEach(p.targetPaths, traversal);//traversal(node.targetPaths[i]);
	}
	else if(p instanceof PPath) {
		console.log(p.id + " " + p.type);
		traversal(p.target);
	}
}

/* ************************************************************************************* */
/* Modal -> access node and path settings
/* ************************************************************************************* */
var modal = (function() {
	var $overlay;
	var $modal;
	var $modalContent;
	var $closeBtn;
	
	// render the html
	$overlay = $('<div class="overlay"></div>');
	$modal = $('<div class="modal"></div>');
	$modalContent = $('<div class="modal-content"></div>');
	$closeBtn = $('<div class="closeBtn"></div>');
	
	$modal.hide();
	$overlay.hide();
	$modal.append($modalContent, $closeBtn);
	
	$("document").ready(function() {
		$("body").append($overlay, $modal);
	});
	
	// open the modal
	var open = function(settings) {
		$modalContent.empty();

		if(settings.content instanceof PNode) {
			// dumping source and target info into the modal
			$modalContent.append(settings.content.id + "<br><hr>");
			
			$modalContent.append("<p>Source Paths: </p>");
			for(var i = 0; i < settings.content.sourcePaths.length; ++i)
				$modalContent.append(settings.content.sourcePaths[i].id + "<br>");
			
			$modalContent.append("<br>");
			
			$modalContent.append("<p>Target Paths: </p>");
			for(var i = 0; i < settings.content.targetPaths.length; ++i)
				$modalContent.append(settings.content.targetPaths[i].id + "<br>");
		}
		else {
			$modalContent.append(settings.content.id + "<br><hr>");
			
			$modalContent.append("<p>Source Node: " + settings.content.source.id + "</p>");
			$modalContent.append("<br>");
			$modalContent.append("<p>Target Node: " + settings.content.target.id + "</p>");
		}
		
		$modal.css({
			width: settings.width || 'auto',
			height: settings.height || 'auto'
		});
		
		center();
		
		$(window).bind('resize.modal', center);
		
		$modal.show();
		$overlay.show();
	}
	
	// center the modal
	var center = function() {
		var top, left;

		top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
		left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;
	
		$modal.css({
			top: top + $(window).scrollTop(),
			left: left + $(window).scrollLeft()
		});
	}
	
	// close the modal
	var close = function() {
		$modal.hide();
		$overlay.hide();
		$modalContent.empty();
		$(window).unbind('resize.modal');
	}
	
	$closeBtn.click(function(e) {
		e.preventDefault();
		close();
	});
	
	return {
		open: open,
		center: center,
		close: close
	}
})();
