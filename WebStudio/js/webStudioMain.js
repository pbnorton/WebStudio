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
	
	//modal.open({width: 300, height: 300, content: "test"});
});


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
		$modalContent.empty().append(settings.content);
		
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
