google.load("visualization", "1");
// Set callback to run when API is loaded
google.setOnLoadCallback(initTimeLine);

function initTimeLine(){
	var timeline = new TimeLine();
}


function TimeLine(){
	this.init();
}

TimeLine.prototype = {
	init: function(){
		var self = this;
		self.loadData(function(items){
			if(items){
				self.prepareData(items);
				self.render()
                self.registerEventListeners(self.timeline);
			}
		});

	},
	loadData: function(callback){
		var self = this;
		
		$.ajax({
			url : '/exercisesDataJson',
			type: 'get',
			dataType:'json',
			success : function(data) {
				if(typeof callback == "function"){
					callback(data);
				}
			},
			error: function(){
				if(typeof callback == "function"){
					callback(null);
				}
			}
		});
	},
	prepareData: function(items){
		// Create and populate a data table.
		var i,
			countItems = items.length;
		this.dataTable = new google.visualization.DataTable()
		this.dataTable.addColumn('datetime', 'start');
		this.dataTable.addColumn('datetime', 'end');
		this.dataTable.addColumn('string', 'content');
		this.dataTable.addColumn('string', 'group');
		this.dataTable.addColumn('string', 'className');
		
		for (i = 0; i < countItems; i++) {
			var start = new Date(items[i]['start']),
				end = new Date(items[i]['end']);

			this.dataTable.addRow([start, end, items[i]['content'], items[i]['group'], items[i]['className']]);
		}
	},
	render: function(){
		// specify options
		var options = {
			width:  "100%",
			height: "auto",
			layout: "box",
			axisOnTop: true,
			eventMargin: 10,  // minimal margin between events
			eventMarginAxis: 0, // minimal margin between events and the axis
			editable: false,
			showNavigation: true
		},
		// Set a customized visible range
		now = new Date(),
		start = new Date(now.getTime() - 12 * 60 * 60 * 1000),
		end = new Date(now.getTime() + 12 * 60 * 60 * 1000);
		
		// Instantiate our timeline object.
		var timeline = new links.Timeline(document.getElementById('mytimeline'));

		// register event listeners commented for making modal dialog appearing
		//this.registerEventListeners(timeline);

		// Draw our timeline with the created data and options
		timeline.draw(this.dataTable, options);

		
		timeline.setVisibleChartRange(start, end);
        this.timeline = timeline;
	},
	registerEventListeners: function(timeline){
	/*
		google.visualization.events.addListener(timeline, 'edit', function(){
			console.log('edit!');
		});
	*/
		$(window).bind('resize', function(){
			timeline.redraw();
		});

        $.each(timeline.items, function(index, item){
            var domEl = item.dom;

            $(domEl).on({
                'mouseenter': function(e){
                    console.log('mouseenter');
                },
                'mouseleave': function(e){
                    console.log('mouseleave');
                },
                'click': function(e){
                    console.log('click')
                    e.preventDefault();
                }
            })
            console.log(item);
        });
	}
}