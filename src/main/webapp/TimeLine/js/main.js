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
                self.render();
                // register event listeners
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
        this.dataTable = new google.visualization.DataTable();
        this.dataTable.addColumn({type: 'datetime', name: 'start'});
        this.dataTable.addColumn({type: 'datetime', name: 'end'});
        this.dataTable.addColumn({type: 'string', name: 'content'});
        this.dataTable.addColumn({type: 'string', name: 'group'});
        this.dataTable.addColumn({type: 'string', name: 'className'});

        for (i = 0; i < countItems; i++) {
            var start = new Date(items[i]['start']),
                end = new Date(items[i]['end']);

            this.dataTable.addRow([start, end, this.createItemHtml(items[i]), items[i]['group'], items[i]['className']]);
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

        // register event listeners
        //this.registerEventListeners(timeline);

        // Draw our timeline with the created data and options
        timeline.draw(this.dataTable, options);
        timeline.setVisibleChartRange(start, end);
        this.timeline = timeline;
    },
    createItemHtml: function(itemData){
        var itemHtml = $('<div><div class="timeline-item" data-id="' + itemData.id + '"><span class="ttl">' + itemData.content + '</span></div></div>');

        if(typeof itemData.info == 'string' && itemData.info != ''){
            itemHtml.find('.timeline-item').attr({
                'data-content': itemData.info,
                'data-trigger': 'hover',
                'data-placement': 'bottom',
                'data-title': itemData.content,
                'data-container': 'body',
                'data-toggle': 'popover'
            });
        }

        return itemHtml.html();
    },
    registerEventListeners: function(timeline){
        $.each(timeline.items, function(index, obj){
            var domEl = obj.dom,
                item = $(domEl).find('.timeline-item');

            item.popover({
                container: item.data('container'),
                content: item.data('content'),
                placement: item.data('placement'),
                title: item.data('title'),
                trigger: item.data('hover')
            });

            item.on({
                'click': function(e){
                    var hiddenField = $('#myModal').find('input:hidden[name=id]');
                    var dateEdit = $('#myModal').find('input[name=dateEdit]');
                    var startTimeEdit = $('#myModal').find('input[name=startTimeEdit]');
                    var endTimeEdit = $('#myModal').find('input[name=endTimeEdit]');
                    document.getElementById('title').innerHTML = obj.content;

                    if(hiddenField){
                        hiddenField.val(item.data('id'));
                    }
                    var dateYearMonthDay = obj.start.getFullYear();
                    day = obj.start.getDate();
                    month = obj.start.getMonth() + 1;
                    dateYearMonthDay += '-' + (month < 10 ? '0' + month : month);
                    dateYearMonthDay += '-' + (day < 10 ? '0' + day : day);

                    if(dateEdit){
                        dateEdit.val(dateYearMonthDay);
                    }
                    hoursStart = obj.start.getHours();
                    minutesStart = obj.start.getMinutes();
                    if(startTimeEdit){
                        startTimeEdit.val((hoursStart < 10 ? '0' + hoursStart : hoursStart) + ':' + (minutesStart < 10 ? '0' + minutesStart : minutesStart));
                    }
                    hoursEnd = obj.end.getHours();
                    minutesEnd = obj.end.getMinutes();
                    if(endTimeEdit){
                        endTimeEdit.val((hoursEnd < 10 ? '0' + hoursEnd : hoursEnd) + ':' + (minutesEnd < 10 ? '0' + minutesEnd : minutesEnd));
                    }


                    var trainer = document.getElementById('trainerEdit');
                    trainer.selectedIndex = 0;
                    if(obj.group.content == 'Massage') {
                        trainer.selectedIndex = 8;
                    }
                    if(obj.group.content == 'Consultation') {
                        trainer.selectedIndex = 9;
                    }
                    var trainerText = obj.group.content;
                    if(trainerText.substring(0,7) == 'Trainer') {
                        trainer.selectedIndex = trainerText.substring(8,9) - 1;
                    }

                    // Manually opens a modal
                    $('#myModal').modal('show');

                    e.preventDefault();
                }
            });
        });


        $(window).bind('resize', function(){
            timeline.redraw();
        });
    }
}