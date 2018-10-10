jQuery(function($) {
	$('.easy-pie-chart.percentage')
			.each(
					function() {
						var $box = $(this).closest('.infobox');
						var barColor = $(this).data('color')
								|| (!$box.hasClass('infobox-dark') ? $box
										.css('color')
										: 'rgba(255,255,255,0.95)');
						var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)'
								: '#E2E2E2';
						var size = parseInt($(this).data('size')) || 50;
						$(this).easyPieChart({
							barColor : barColor,
							trackColor : trackColor,
							scaleColor : false,
							lineCap : 'butt',
							lineWidth : parseInt(size / 10),
							animate : ace.vars['old_ie'] ? false : 1000,
							size : size
						});
					})

	$('.sparkline').each(
			function() {
				var $box = $(this).closest('.infobox');
				var barColor = !$box.hasClass('infobox-dark') ? $box
						.css('color') : '#FFF';
				$(this).sparkline('html', {
					tagValuesAttribute : 'data-values',
					type : 'bar',
					barColor : barColor,
					chartRangeMin : $(this).data('min') || 0
				});
			});

	var placeholder = $('#piechart-placeholder').css({
		'width' : '90%',
		'min-height' : '150px'
	});
	var data = [ {
		label : "social networks",
		data : 38.7,
		color : "#68BC31"
	}, {
		label : "search engines",
		data : 24.5,
		color : "#2091CF"
	}, {
		label : "ad campaigns",
		data : 8.2,
		color : "#AF4E96"
	}, {
		label : "direct traffic",
		data : 18.6,
		color : "#DA5430"
	}, {
		label : "other",
		data : 10,
		color : "#FEE074"
	} ]

	/**
	 * we saved the drawing function and the data to redraw with different
	 * position later when switching to RTL mode dynamically so that's not
	 * needed actually.
	 */
	placeholder.data('chart', data);
	// placeholder.data('draw', drawPieChart);

	// pie chart tooltip example
	var $tooltip = $(
			"<div class='tooltip top in'><div class='tooltip-inner'></div></div>")
			.hide().appendTo('body');
	var previousPoint = null;

	placeholder.on('plothover', function(event, pos, item) {
		if (item) {
			if (previousPoint != item.seriesIndex) {
				previousPoint = item.seriesIndex;
				var tip = item.series['label'] + " : " + item.series['percent']
						+ '%';
				$tooltip.show().children(0).text(tip);
			}
			$tooltip.css({
				top : pos.pageY + 10,
				left : pos.pageX + 10
			});
		} else {
			$tooltip.hide();
			previousPoint = null;
		}

	});

	// ///////////////////////////////////
	$(document).one('ajaxloadstart.page', function(e) {
		$tooltip.remove();
	});

	var d1 = [];
	for (var i = 0; i < Math.PI * 2; i += 0.5) {
		d1.push([ i, Math.sin(i) ]);
	}

	var d2 = [];
	for (var i = 0; i < Math.PI * 2; i += 0.5) {
		d2.push([ i, Math.cos(i) ]);
	}

	var d3 = [];
	for (var i = 0; i < Math.PI * 2; i += 0.2) {
		d3.push([ i, Math.tan(i) ]);
	}

	// Android's default browser somehow is confused when tapping on label which
	// will lead to dragging the task
	// so disable dragging when clicking on label
	var agent = navigator.userAgent.toLowerCase();
	if (ace.vars['touch'] && ace.vars['android']) {
		$('#tasks').on('touchstart', function(e) {
			var li = $(e.target).closest('#tasks li');
			if (li.length == 0)
				return;
			var label = li.find('label.inline').get(0);
			if (label == e.target || $.contains(label, e.target))
				e.stopImmediatePropagation();
		});
	}
})