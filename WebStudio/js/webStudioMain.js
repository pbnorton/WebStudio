$(document).ready(function() {
	
	// Event handlers for the slide-out menu 
	$(".btn-slide").on("click", function() {
		$(".panel").animate({
			left: parseInt($(".panel").css("left"), 10) == 0 ? -$(".panel").outerWidth() : 0
		}, "fast");
	});
	
	// drag-drop handler for the tool box
	$(".icon.draggable").draggable({
		cursor: "move",
		opacity: .5,
		revert: true,
		revertDuration: 0,
		start: function() {
			WebStudio.moduleSource = $(this).parent().attr("id");
		}
	});
	
	// event handler for the action controls
	$("#runBtn").on("click", function() {
		var start = lookup("type", "start", data.nodes);
		traversal(data.nodes[start]);
	});
	
	WebStudio.init();
	
});

function traversal(p) {
	if(p === null)
		return 0;
	
	if(p instanceof PNode) {
		//if(p.type === "twitter")
		//	console.log("value = " + p.adaptor());
		console.log(p.id + " " + p.type);
		forEach(p.targetPaths, traversal);//traversal(node.targetPaths[i]);
	}
	else if(p instanceof PPath) {
		console.log(p.id + " " + p.condition);
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
	
	var settings;
	
	// render the html
	$overlay = $('<div class="overlay"></div>');
	$modal = $('<div class="modal"></div>');
	$modalContent = $('<div class="modal-content"></div>');
	$closeBtn = $('<div class="closeBtn"></div>');
	
	$modal.hide();
	$overlay.hide();
	$modal.append($modalContent);
	
	$("document").ready(function() {
		$("body").append($overlay, $modal);
	});
	
	// open the modal
	function open(_settings) {
		$modalContent.empty();
		
		settings = _settings;

		if(settings instanceof PNode) 
			nodeModal($modalContent, settings);
		else 
			pathModal($modalContent, settings);
		
		$modal.css({
			width: 'auto',
			height: 'auto'
		});
		
		center();
		
		$(window).bind('resize.modal', center);
		
		$modal.show();
		$overlay.show();
	}
	
	// center the modal
	function center() {
		var top, left;

		top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
		left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;
	
		$modal.css({
			top: top + $(window).scrollTop(),
			left: left + $(window).scrollLeft()
		});
	}
	
	function getSetting() {
		var selected = $(".modal-content input[type='radio'][name='group1']:checked").val();

		if(selected !== undefined) {
			settings.condition = selected;
			console.log(settings.condition);
			d3.select("#" + settings.id).data()[0].updateCondition(settings.condition);
		}
	}
	
	// close the modal
	function close() {
		getSetting();
		$modal.hide();
		$overlay.hide();
		$modalContent.empty();
		$(window).unbind('resize.modal');
	}
	
	$overlay.click(function(e) {
		e.preventDefault();
		close();
	});
	
	return {
		open: open,
		center: center,
		close: close
	}
})();

// PLACEHOLDERS. Should think about using Handlebars or Mustache to serve up the modal contents
function nodeModal($modal, content) {
	var nodeDivOpen = '<div class="nodeDiv" style="padding: 10px; width: 400px; height: 200px; margin-bottom: 3px; border: 1px solid black; border-radius: 4px"></div>'
	$modal.append(nodeDivOpen);
	$(".nodeDiv").append(content.id + "<br><hr>");
	
	$(".nodeDiv").append("Source Paths:<ul>");
	for(var i = 0; i < content.sourcePaths.length; ++i)
		$(".nodeDiv").append('<li style="margin-left: 20px">' + content.sourcePaths[i].id);
	$(".nodeDiv").append("</ul>");
	
	$(".nodeDiv").append("<br>");
	
	$(".nodeDiv").append("Target Paths:<ul>");
	for(var i = 0; i < content.targetPaths.length; ++i)
		$(".nodeDiv").append('<li style="margin-left: 20px">' + content.targetPaths[i].id);
	$(".nodeDiv").append("</ul>");
}

function pathModal($modal, content) {
	var expDiv = '<div class="expressionDiv" style="padding: 10px; margin-bottom: 3px; border: 1px solid black; border-radius: 4px">\
					<input type="radio" id="expression" name="group1" value="expression">Matches the expression:<br>\
					<input id="expression" type="text" size="20">\
				 </div>';
	$modal.append(expDiv);
	
	var conditions = '<div class="specialDiv" style="padding: 10px; margin-bottom: 3px; border: 1px solid black; border-radius: 4px">\
						<p>Special Conditions</p>\
						<input type="radio" id="goto" name="group1" value="goto">Goto\
						<input type="radio" id="else" name="group1" value="else">Else\
						<input type="radio" id="error" name="group1" value="error">On Error\
					 </div>';
	$modal.append(conditions);
	
	if(content.condition.length !== 0)
		$("#" + content.condition).prop('checked', true);
	
	$modal.append("<hr>");
	$modal.append("<p>Source Node: " + content.source.id + "</p>");
	$modal.append("<br>");
	$modal.append("<p>Target Node: " + content.target.id + "</p>");
}
