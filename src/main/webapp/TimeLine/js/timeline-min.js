/*

 Licensed under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy
 of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under
 the License.

 Copyright (c) 2011-2014 Almende B.V.

 @author  Jos de Jong, <jos@almende.org>
 @date    2014-01-14
 @version 2.6.1
 */
typeof links === "undefined" && (links = {});
typeof google === "undefined" && (google = void 0);
if (!Array.prototype.indexOf)Array.prototype.indexOf = function (a) {
    for (var b = 0; b < this.length; b++)if (this[b] == a)return b;
    return-1
};
if (!Array.prototype.forEach)Array.prototype.forEach = function (a, b) {
    for (var c = 0, d = this.length; c < d; ++c)a.call(b || this, this[c], c, this)
};
links.Timeline = function (a) {
    if (a) {
        this.dom = {};
        this.conversion = {};
        this.eventParams = {};
        this.groups = [];
        this.groupIndexes = {};
        this.items = [];
        this.renderQueue = {show: [], hide: [], update: []};
        this.renderedItems = [];
        this.clusterGenerator = new links.Timeline.ClusterGenerator(this);
        this.currentClusters = [];
        this.selection = void 0;
        this.listeners = {};
        this.size = {actualHeight: 0, axis: {characterMajorHeight: 0, characterMajorWidth: 0, characterMinorHeight: 0, characterMinorWidth: 0, height: 0, labelMajorTop: 0, labelMinorTop: 0, line: 0, lineMajorWidth: 0,
            lineMinorHeight: 0, lineMinorTop: 0, lineMinorWidth: 0, top: 0}, contentHeight: 0, contentLeft: 0, contentWidth: 0, frameHeight: 0, frameWidth: 0, groupsLeft: 0, groupsWidth: 0, items: {top: 0}};
        this.dom.container = a;
        this.options = {width: "100%", height: "auto", minHeight: 0, autoHeight: !0, eventMargin: 10, eventMarginAxis: 20, dragAreaWidth: 10, min: void 0, max: void 0, zoomMin: 10, zoomMax: 31536E10, moveable: !0, zoomable: !0, selectable: !0, unselectable: !0, editable: !1, snapEvents: !0, groupChangeable: !0, showCurrentTime: !0, showCustomTime: !1, showMajorLabels: !0,
            showMinorLabels: !0, showNavigation: !1, showButtonNew: !1, groupsOnRight: !1, groupsOrder: !0, axisOnTop: !1, stackEvents: !0, animate: !0, animateZoom: !0, cluster: !1, style: "box", customStackOrder: !1, locale: "en", MONTHS: "January,February,March,April,May,June,July,August,September,October,November,December".split(","), MONTHS_SHORT: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","), DAYS: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","), DAYS_SHORT: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
            ZOOM_IN: "Zoom in", ZOOM_OUT: "Zoom out", MOVE_LEFT: "Move left", MOVE_RIGHT: "Move right", NEW: "New", CREATE_NEW_EVENT: "Create new event"};
        this.clientTimeOffset = 0;
        for (a = this.dom; a.container.hasChildNodes();)a.container.removeChild(a.container.firstChild);
        this.step = new links.Timeline.StepDate;
        this.itemTypes = {box: links.Timeline.ItemBox, range: links.Timeline.ItemRange, dot: links.Timeline.ItemDot};
        this.data = [];
        this.firstDraw = !0;
        this.setVisibleChartRange(void 0, void 0, !1);
        this.render();
        var b = this;
        setTimeout(function () {
                b.trigger("ready")
            },
            0)
    }
};
links.Timeline.prototype.draw = function (a, b) {
    this.setOptions(b);
    this.options.selectable && links.Timeline.addClassName(this.dom.frame, "timeline-selectable");
    this.setData(a);
    b && (b.start || b.end) ? this.setVisibleChartRange(b.start, b.end) : this.firstDraw && this.setVisibleChartRangeAuto();
    this.firstDraw = !1
};
links.Timeline.prototype.setOptions = function (a) {
    if (a) {
        for (var b in a)a.hasOwnProperty(b) && (this.options[b] = a[b]);
        if (typeof links.locales !== "undefined" && this.options.locale !== "en" && (b = links.locales[this.options.locale]))for (var c in b)b.hasOwnProperty(c) && (this.options[c] = b[c]);
        if (a.showButtonAdd != void 0)this.options.showButtonNew = a.showButtonAdd, console.log("WARNING: Option showButtonAdd is deprecated. Use showButtonNew instead");
        if (a.intervalMin != void 0)this.options.zoomMin = a.intervalMin, console.log("WARNING: Option intervalMin is deprecated. Use zoomMin instead");
        if (a.intervalMax != void 0)this.options.zoomMax = a.intervalMax, console.log("WARNING: Option intervalMax is deprecated. Use zoomMax instead");
        a.scale && a.step && this.step.setScale(a.scale, a.step)
    }
    this.options.autoHeight = this.options.height === "auto"
};
links.Timeline.prototype.addItemType = function (a, b) {
    this.itemTypes[a] = b
};
links.Timeline.mapColumnIds = function (a) {
    for (var b = {}, c = a.getNumberOfColumns(), d = !0, e = 0; e < c; e++) {
        var f = a.getColumnId(e) || a.getColumnLabel(e);
        b[f] = e;
        if (f == "start" || f == "end" || f == "content" || f == "group" || f == "className" || f == "editable" || f == "type")d = !1
    }
    if (d) {
        b.start = 0;
        b.end = 1;
        b.content = 2;
        if (c > 3)b.group = 3;
        if (c > 4)b.className = 4;
        if (c > 5)b.editable = 5;
        if (c > 6)b.type = 6
    }
    return b
};
links.Timeline.prototype.setData = function (a) {
    this.unselectItem();
    a || (a = []);
    this.stackCancelAnimation();
    this.clearItems();
    this.data = a;
    var b = this.items;
    this.deleteGroups();
    if (google && google.visualization && a instanceof google.visualization.DataTable)for (var c = links.Timeline.mapColumnIds(a), d = 0, e = a.getNumberOfRows(); d < e; d++)b.push(this.createItem({start: c.start != void 0 ? a.getValue(d, c.start) : void 0, end: c.end != void 0 ? a.getValue(d, c.end) : void 0, content: c.content != void 0 ? a.getValue(d, c.content) : void 0, group: c.group != void 0 ? a.getValue(d, c.group) : void 0, className: c.className != void 0 ? a.getValue(d, c.className) : void 0, editable: c.editable != void 0 ? a.getValue(d, c.editable) : void 0, type: c.type != void 0 ? a.getValue(d, c.type) : void 0})); else if (links.Timeline.isArray(a)) {
        d = 0;
        for (e = a.length; d < e; d++)c = this.createItem(a[d]), b.push(c)
    } else throw"Unknown data type. DataTable or Array expected.";
    this.options.cluster && this.clusterGenerator.setData(this.items);
    this.render({animate: !1})
};
links.Timeline.prototype.getData = function () {
    return this.data
};
links.Timeline.prototype.updateData = function (a, b) {
    var c = this.data, d;
    if (google && google.visualization && c instanceof google.visualization.DataTable) {
        var e = a + 1 - c.getNumberOfRows();
        e > 0 && c.addRows(e);
        e = links.Timeline.mapColumnIds(c);
        for (d in b)if (b.hasOwnProperty(d)) {
            var f = e[d];
            if (f == void 0) {
                var f = b[d], g = "string";
                typeof f == "number" ? g = "number" : typeof f == "boolean" ? g = "boolean" : f instanceof Date && (g = "datetime");
                f = c.addColumn(g, d)
            }
            c.setValue(a, f, b[d])
        }
    } else if (links.Timeline.isArray(c))for (d in e = c[a], e == void 0 &&
        (e = {}, c[a] = e), b)b.hasOwnProperty(d) && (e[d] = b[d]); else throw"Cannot update data, unknown type of data";
};
links.Timeline.prototype.getItemIndex = function (a) {
    for (var b = this.dom.items.frame, c = this.items, d = void 0; a.parentNode && a.parentNode !== b;)a = a.parentNode;
    if (a.parentNode === b)for (var b = 0, e = c.length; b < e; b++)if (c[b].dom === a) {
        d = b;
        break
    }
    return d
};
links.Timeline.prototype.setSize = function (a, b) {
    if (a)this.options.width = a, this.dom.frame.style.width = a;
    if (b && (this.options.height = b, this.options.autoHeight = this.options.height === "auto", b !== "auto"))this.dom.frame.style.height = b;
    this.render({animate: !1})
};
links.Timeline.prototype.setVisibleChartRange = function (a, b, c) {
    var d = {};
    if (!a || !b)d = this.getDataRange(!0);
    if (!a)b ? d.min && d.min.valueOf() < b.valueOf() ? a = d.min : (a = new Date(b.valueOf()), a.setDate(a.getDate() - 7)) : (a = new Date, a.setDate(a.getDate() - 3));
    if (!b)d.max ? b = d.max : (b = new Date(a.valueOf()), b.setDate(b.getDate() + 7));
    b <= a && (b = new Date(a.valueOf()), b.setDate(b.getDate() + 7));
    d = this.options.min ? this.options.min : void 0;
    d != void 0 && a.valueOf() < d.valueOf() && (a = new Date(d.valueOf()));
    d = this.options.max ? this.options.max :
        void 0;
    d != void 0 && b.valueOf() > d.valueOf() && (b = new Date(d.valueOf()));
    this.applyRange(a, b);
    c == void 0 || c == !0 ? this.render({animate: !1}) : this.recalcConversion()
};
links.Timeline.prototype.setVisibleChartRangeAuto = function () {
    var a = this.getDataRange(!0);
    this.setVisibleChartRange(a.min, a.max)
};
links.Timeline.prototype.setVisibleChartRangeNow = function () {
    var a = this.end.valueOf() - this.start.valueOf(), b = new Date((new Date).valueOf() - a / 2);
    this.setVisibleChartRange(b, new Date(b.valueOf() + a))
};
links.Timeline.prototype.getVisibleChartRange = function () {
    return{start: new Date(this.start.valueOf()), end: new Date(this.end.valueOf())}
};
links.Timeline.prototype.getDataRange = function (a) {
    var b = this.items, c = void 0, d = void 0;
    if (b)for (var e = 0, f = b.length; e < f; e++) {
        var g = b[e], h = g.start != void 0 ? g.start.valueOf() : void 0, g = g.end != void 0 ? g.end.valueOf() : h;
        h != void 0 && (c = c != void 0 ? Math.min(c.valueOf(), h.valueOf()) : h);
        g != void 0 && (d = d != void 0 ? Math.max(d.valueOf(), g.valueOf()) : g)
    }
    c && d && a && (a = d - c, c -= a * 0.05, d += a * 0.05);
    return{min: c != void 0 ? new Date(c) : void 0, max: d != void 0 ? new Date(d) : void 0}
};
links.Timeline.prototype.render = function (a) {
    this.reflowFrame();
    this.reflowAxis();
    this.reflowGroups();
    this.reflowItems();
    var b = this.options.animate;
    if (a && a.animate != void 0)b = a.animate;
    this.recalcConversion();
    this.clusterItems();
    this.filterItems();
    this.stackItems(b);
    this.recalcItems();
    this.repaint() && (b = a ? a.renderTimesLeft : void 0, b == void 0 && (b = 5), b > 0 && this.render({animate: a ? a.animate : void 0, renderTimesLeft: b - 1}))
};
links.Timeline.prototype.repaint = function () {
    var a = this.repaintFrame(), b = this.repaintAxis(), c = this.repaintGroups(), d = this.repaintItems();
    this.repaintCurrentTime();
    this.repaintCustomTime();
    return a || b || c || d
};
links.Timeline.prototype.reflowFrame = function () {
    var a = this.dom, b = this.size, c = a.frame ? a.frame.offsetWidth : 0, d = a.frame ? a.frame.clientHeight : 0, a = (a = b.frameWidth !== c) || b.frameHeight !== d;
    b.frameWidth = c;
    b.frameHeight = d;
    return a
};
links.Timeline.prototype.repaintFrame = function () {
    var a = !1, b = this.dom, c = this.options, d = this.size;
    if (!b.frame)b.frame = document.createElement("DIV"), b.frame.className = "timeline-frame ui-widget ui-widget-content ui-corner-all", b.container.appendChild(b.frame), a = !0;
    var e = c.autoHeight ? d.actualHeight + "px" : c.height || "100%", c = c.width || "100%", a = (a = a || b.frame.style.height != e) || b.frame.style.width != c;
    b.frame.style.height = e;
    b.frame.style.width = c;
    if (!b.content) {
        b.content = document.createElement("DIV");
        b.content.className =
            "timeline-content";
        b.frame.appendChild(b.content);
        a = document.createElement("DIV");
        a.style.position = "absolute";
        a.style.left = "0px";
        a.style.top = "0px";
        a.style.height = "100%";
        a.style.width = "0px";
        b.content.appendChild(a);
        b.contentTimelines = a;
        var a = this.eventParams, f = this;
        if (!a.onMouseDown)a.onMouseDown = function (a) {
            f.onMouseDown(a)
        }, links.Timeline.addEventListener(b.content, "mousedown", a.onMouseDown);
        if (!a.onTouchStart)a.onTouchStart = function (a) {
            f.onTouchStart(a)
        }, links.Timeline.addEventListener(b.content,
            "touchstart", a.onTouchStart);
        if (!a.onMouseWheel)a.onMouseWheel = function (a) {
            f.onMouseWheel(a)
        }, links.Timeline.addEventListener(b.content, "mousewheel", a.onMouseWheel);
        if (!a.onDblClick)a.onDblClick = function (a) {
            f.onDblClick(a)
        }, links.Timeline.addEventListener(b.content, "dblclick", a.onDblClick);
        a = !0
    }
    b.content.style.left = d.contentLeft + "px";
    b.content.style.top = "0px";
    b.content.style.width = d.contentWidth + "px";
    b.content.style.height = d.frameHeight + "px";
    this.repaintNavigation();
    return a
};
links.Timeline.prototype.reflowAxis = function () {
    var a, b = this.options, c = this.size, d = this.dom.axis, e = d && d.characterMinor ? d.characterMinor.clientWidth : 0, f = d && d.characterMinor ? d.characterMinor.clientHeight : 0, g = d && d.characterMajor ? d.characterMajor.clientWidth : 0, h = d && d.characterMajor ? d.characterMajor.clientHeight : 0, i = (b.showMinorLabels ? f : 0) + (b.showMajorLabels ? h : 0), k = b.axisOnTop ? 0 : c.frameHeight - i, l = b.axisOnTop ? i : k;
    a = (a = (a = c.axis.top !== k) || c.axis.line !== l) || c.axis.height !== i;
    c.axis.top = k;
    c.axis.line = l;
    c.axis.height =
        i;
    c.axis.labelMajorTop = b.axisOnTop ? 0 : l + (b.showMinorLabels ? f : 0);
    c.axis.labelMinorTop = b.axisOnTop ? b.showMajorLabels ? h : 0 : l;
    c.axis.lineMinorTop = b.axisOnTop ? c.axis.labelMinorTop : 0;
    c.axis.lineMinorHeight = b.showMajorLabels ? c.frameHeight - h : c.frameHeight;
    c.axis.lineMinorWidth = d && d.minorLines && d.minorLines.length ? d.minorLines[0].offsetWidth : 1;
    c.axis.lineMajorWidth = d && d.majorLines && d.majorLines.length ? d.majorLines[0].offsetWidth : 1;
    a = (a = (a = (a = a || c.axis.characterMinorWidth !== e) || c.axis.characterMinorHeight !==
        f) || c.axis.characterMajorWidth !== g) || c.axis.characterMajorHeight !== h;
    c.axis.characterMinorWidth = e;
    c.axis.characterMinorHeight = f;
    c.axis.characterMajorWidth = g;
    c.axis.characterMajorHeight = h;
    d = Math.max(c.frameHeight - i, 0);
    c.contentLeft = b.groupsOnRight ? 0 : c.groupsWidth;
    c.contentWidth = Math.max(c.frameWidth - c.groupsWidth, 0);
    c.contentHeight = d;
    return a
};
links.Timeline.prototype.repaintAxis = function () {
    var a = !1, b = this.dom, c = this.options, d = this.size, e = this.step, f = b.axis;
    if (!f)f = {}, b.axis = f;
    if (!d.axis.properties)d.axis.properties = {};
    if (!f.minorTexts)f.minorTexts = [];
    if (!f.minorLines)f.minorLines = [];
    if (!f.majorTexts)f.majorTexts = [];
    if (!f.majorLines)f.majorLines = [];
    if (!f.frame)f.frame = document.createElement("DIV"), f.frame.style.position = "absolute", f.frame.style.left = "0px", f.frame.style.top = "0px", b.content.appendChild(f.frame);
    b.content.removeChild(f.frame);
    f.frame.style.width = d.contentWidth + "px";
    f.frame.style.height = d.axis.height + "px";
    var g = this.screenToTime(0), h = this.screenToTime(d.contentWidth);
    if (d.axis.characterMinorWidth)this.minimumStep = this.screenToTime(d.axis.characterMinorWidth * 6) - this.screenToTime(0), e.setRange(g, h, this.minimumStep);
    g = this.repaintAxisCharacters();
    a = a || g;
    this.repaintAxisStartOverwriting();
    e.start();
    g = void 0;
    for (h = 0; !e.end() && h < 1E3;) {
        h++;
        var i = this.timeToScreen(e.getCurrent()), k = e.isMajor();
        c.showMinorLabels && this.repaintAxisMinorText(i,
            e.getLabelMinor(c));
        k && c.showMajorLabels ? (i > 0 && (g == void 0 && (g = i), this.repaintAxisMajorText(i, e.getLabelMajor(c))), this.repaintAxisMajorLine(i)) : this.repaintAxisMinorLine(i);
        e.next()
    }
    c.showMajorLabels && (e = this.screenToTime(0), c = this.step.getLabelMajor(c, e), d = c.length * d.axis.characterMajorWidth + 10, (g == void 0 || d < g) && this.repaintAxisMajorText(0, c, e));
    this.repaintAxisEndOverwriting();
    this.repaintAxisHorizontal();
    b.content.insertBefore(f.frame, b.content.firstChild);
    return a
};
links.Timeline.prototype.repaintAxisCharacters = function () {
    var a = !1, b = this.dom.axis;
    if (!b.characterMinor) {
        var a = document.createTextNode("0"), c = document.createElement("DIV");
        c.className = "timeline-axis-text timeline-axis-text-minor";
        c.appendChild(a);
        c.style.position = "absolute";
        c.style.visibility = "hidden";
        c.style.paddingLeft = "0px";
        c.style.paddingRight = "0px";
        b.frame.appendChild(c);
        b.characterMinor = c;
        a = !0
    }
    if (!b.characterMajor)a = document.createTextNode("0"), c = document.createElement("DIV"), c.className = "timeline-axis-text timeline-axis-text-major",
        c.appendChild(a), c.style.position = "absolute", c.style.visibility = "hidden", c.style.paddingLeft = "0px", c.style.paddingRight = "0px", b.frame.appendChild(c), b.characterMajor = c, a = !0;
    return a
};
links.Timeline.prototype.repaintAxisStartOverwriting = function () {
    var a = this.size.axis.properties;
    a.minorTextNum = 0;
    a.minorLineNum = 0;
    a.majorTextNum = 0;
    a.majorLineNum = 0
};
links.Timeline.prototype.repaintAxisEndOverwriting = function () {
    var a = this.dom, b = this.size.axis.properties, c = this.dom.axis.frame, d, e = a.axis.minorTexts;
    for (d = b.minorTextNum; e.length > d;)c.removeChild(e[d]), e.splice(d, 1);
    e = a.axis.minorLines;
    for (d = b.minorLineNum; e.length > d;)c.removeChild(e[d]), e.splice(d, 1);
    e = a.axis.majorTexts;
    for (d = b.majorTextNum; e.length > d;)c.removeChild(e[d]), e.splice(d, 1);
    a = a.axis.majorLines;
    for (d = b.majorLineNum; a.length > d;)c.removeChild(a[d]), a.splice(d, 1)
};
links.Timeline.prototype.repaintAxisHorizontal = function () {
    var a = this.dom.axis, b = this.size, c = this.options;
    if (c = c.showMinorLabels || c.showMajorLabels) {
        if (!a.backgroundLine) {
            var d = document.createElement("DIV");
            d.className = "timeline-axis";
            d.style.position = "absolute";
            d.style.left = "0px";
            d.style.width = "100%";
            d.style.border = "none";
            a.frame.insertBefore(d, a.frame.firstChild);
            a.backgroundLine = d
        }
        if (a.backgroundLine)a.backgroundLine.style.top = b.axis.top + "px", a.backgroundLine.style.height = b.axis.height + "px"
    } else a.backgroundLine &&
    (a.frame.removeChild(a.backgroundLine), delete a.backgroundLine);
    c ? (a.line ? (c = a.frame.removeChild(a.line), a.frame.appendChild(c)) : (c = document.createElement("DIV"), c.className = "timeline-axis", c.style.position = "absolute", c.style.left = "0px", c.style.width = "100%", c.style.height = "0px", a.frame.appendChild(c), a.line = c), a.line.style.top = b.axis.line + "px") : a.line && a.line.parentElement && (a.frame.removeChild(a.line), delete a.line)
};
links.Timeline.prototype.repaintAxisMinorText = function (a, b) {
    var c = this.size, d = this.dom, e = c.axis.properties, f = d.axis.frame, d = d.axis.minorTexts, g = e.minorTextNum;
    if (g < d.length)g = d[g]; else {
        var h = document.createTextNode(""), g = document.createElement("DIV");
        g.appendChild(h);
        g.className = "timeline-axis-text timeline-axis-text-minor";
        g.style.position = "absolute";
        f.appendChild(g);
        d.push(g)
    }
    g.childNodes[0].nodeValue = b;
    g.style.left = a + "px";
    g.style.top = c.axis.labelMinorTop + "px";
    e.minorTextNum++
};
links.Timeline.prototype.repaintAxisMinorLine = function (a) {
    var b = this.size.axis, c = this.dom, d = b.properties, e = c.axis.frame, c = c.axis.minorLines, f = d.minorLineNum;
    f < c.length ? f = c[f] : (f = document.createElement("DIV"), f.className = "timeline-axis-grid timeline-axis-grid-minor", f.style.position = "absolute", f.style.width = "0px", e.appendChild(f), c.push(f));
    f.style.top = b.lineMinorTop + "px";
    f.style.height = b.lineMinorHeight + "px";
    f.style.left = a - b.lineMinorWidth / 2 + "px";
    d.minorLineNum++
};
links.Timeline.prototype.repaintAxisMajorText = function (a, b) {
    var c = this.size, d = c.axis.properties, e = this.dom.axis.frame, f = this.dom.axis.majorTexts, g = d.majorTextNum;
    if (g < f.length)g = f[g]; else {
        var h = document.createTextNode(b), g = document.createElement("DIV");
        g.className = "timeline-axis-text timeline-axis-text-major";
        g.appendChild(h);
        g.style.position = "absolute";
        g.style.top = "0px";
        e.appendChild(g);
        f.push(g)
    }
    g.childNodes[0].nodeValue = b;
    g.style.top = c.axis.labelMajorTop + "px";
    g.style.left = a + "px";
    d.majorTextNum++
};
links.Timeline.prototype.repaintAxisMajorLine = function (a) {
    var b = this.size, c = b.axis.properties, d = this.size.axis, e = this.dom.axis.frame, f = this.dom.axis.majorLines, g = c.majorLineNum;
    g < f.length ? g = f[g] : (g = document.createElement("DIV"), g.className = "timeline-axis-grid timeline-axis-grid-major", g.style.position = "absolute", g.style.top = "0px", g.style.width = "0px", e.appendChild(g), f.push(g));
    g.style.left = a - d.lineMajorWidth / 2 + "px";
    g.style.height = b.frameHeight + "px";
    c.majorLineNum++
};
links.Timeline.prototype.reflowItems = function () {
    var a = !1, b, c, d;
    b = this.groups;
    var e = this.renderedItems;
    b && b.forEach(function (a) {
        a.itemsHeight = 0
    });
    for (b = 0, c = e.length; b < c; b++) {
        var f = e[b], g = f.dom;
        d = f.group;
        if (g) {
            var h = g ? g.clientWidth : 0, g = g ? g.clientHeight : 0, a = (a = a || f.width != h) || f.height != g;
            f.width = h;
            f.height = g;
            f.reflow()
        }
        if (d)d.itemsHeight = d.itemsHeight ? Math.max(d.itemsHeight, f.height) : f.height
    }
    return a
};
links.Timeline.prototype.recalcItems = function () {
    var a = !1, b, c, d, e, f;
    d = this.groups;
    var g = this.size, h = this.options;
    f = this.renderedItems;
    var i = 0;
    if (d.length == 0) {
        if (h.autoHeight || h.cluster) {
            var k = i = 0;
            if (this.stack && this.stack.finalItems) {
                d = this.stack.finalItems;
                if ((e = d[0]) && e.top)i = e.top, k = e.top + e.height;
                for (b = 1, c = d.length; b < c; b++)e = d[b], i = Math.min(i, e.top), k = Math.max(k, e.top + e.height)
            } else {
                if ((d = f[0]) && d.top)i = d.top, k = d.top + d.height;
                for (b = 1, c = f.length; b < c; b++)d = f[b], d.top && (i = Math.min(i, d.top), k = Math.max(k,
                    d.top + d.height))
            }
            i = k - i + 2 * h.eventMarginAxis + g.axis.height;
            if (i < h.minHeight)i = h.minHeight;
            if (g.actualHeight != i && h.autoHeight && !h.axisOnTop)if (k = i - g.actualHeight, this.stack && this.stack.finalItems) {
                d = this.stack.finalItems;
                for (b = 0, c = d.length; b < c; b++)d[b].top += k, d[b].item.top += k
            } else for (b = 0, c = f.length; b < c; b++)f[b].top += k
        }
    } else {
        i = g.axis.height + 2 * h.eventMarginAxis;
        for (b = 0, c = d.length; b < c; b++)f = d[b], k = f.itemsHeight, a = a || k != f.height, f.height = k, i += d[b].height + h.eventMargin;
        a = h.eventMargin;
        k = h.axisOnTop ? h.eventMarginAxis +
            a / 2 : g.contentHeight - h.eventMarginAxis + a / 2;
        e = g.axis.height;
        for (b = 0, c = d.length; b < c; b++)f = d[b], h.axisOnTop ? (f.top = k + e, f.labelTop = k + e + (f.height - f.labelHeight) / 2, f.lineTop = k + e + f.height + a / 2, k += f.height + a) : (k -= f.height + a, f.top = k, f.labelTop = k + (f.height - f.labelHeight) / 2, f.lineTop = k - a / 2);
        a = !0
    }
    if (i < h.minHeight)i = h.minHeight;
    a = a || i != g.actualHeight;
    g.actualHeight = i;
    return a
};
links.Timeline.prototype.clearItems = function () {
    var a = this.renderQueue.hide;
    this.renderedItems.forEach(function (b) {
        a.push(b)
    });
    this.clusterGenerator.clear();
    this.items = []
};
links.Timeline.prototype.repaintItems = function () {
    var a, b, c = !1, d = this.dom;
    a = this.size;
    var e = this, f = this.renderedItems;
    if (!d.items)d.items = {};
    var g = d.items.frame;
    if (!g)g = document.createElement("DIV"), g.style.position = "relative", d.content.appendChild(g), d.items.frame = g;
    g.style.left = "0px";
    g.style.top = a.items.top + "px";
    g.style.height = "0px";
    d.content.removeChild(g);
    for (var h = this.renderQueue, i = [], c = c || h.show.length > 0 || h.update.length > 0 || h.hide.length > 0; a = h.show.shift();)a.showDOM(g), a.getImageUrls(i), f.push(a);
    for (; a = h.update.shift();)a.updateDOM(g), a.getImageUrls(i), b = this.renderedItems.indexOf(a), b == -1 && f.push(a);
    for (; a = h.hide.shift();)a.hideDOM(g), b = this.renderedItems.indexOf(a), b != -1 && f.splice(b, 1);
    f.forEach(function (a) {
        a.updatePosition(e)
    });
    this.repaintDeleteButton();
    this.repaintDragAreas();
    d.content.appendChild(g);
    i.length && links.imageloader.loadAll(i, function () {
        e.render()
    }, !1);
    return c
};
links.Timeline.prototype.reflowGroups = function () {
    for (var a = !1, b = this.options, c = this.size, d = this.dom, e = 0, f = this.groups, g = this.dom.groups ? this.dom.groups.labels : [], h = 0, i = f.length; h < i; h++) {
        var k = f[h], l = g[h];
        k.labelWidth = l ? l.clientWidth : 0;
        k.labelHeight = l ? l.clientHeight : 0;
        k.width = k.labelWidth;
        e = Math.max(e, k.width)
    }
    b.groupsWidth !== void 0 && (e = d.groups.frame ? d.groups.frame.clientWidth : 0);
    e += 1;
    b = b.groupsOnRight ? c.frameWidth - e : 0;
    a = (a = a || c.groupsWidth !== e) || c.groupsLeft !== b;
    c.groupsWidth = e;
    c.groupsLeft = b;
    return a
};
links.Timeline.prototype.repaintGroups = function () {
    var a = this.dom, b = this, c = this.options, d = this.size, e = this.groups;
    if (a.groups === void 0)a.groups = {};
    var f = a.groups.labels;
    if (!f)f = [], a.groups.labels = f;
    var g = a.groups.labelLines;
    if (!g)g = [], a.groups.labelLines = g;
    var h = a.groups.itemLines;
    if (!h)h = [], a.groups.itemLines = h;
    var i = a.groups.frame;
    if (!i)i = document.createElement("DIV"), i.className = "timeline-groups-axis", i.style.position = "absolute", i.style.overflow = "hidden", i.style.top = "0px", i.style.height = "100%",
        a.frame.appendChild(i), a.groups.frame = i;
    i.style.left = d.groupsLeft + "px";
    i.style.width = c.groupsWidth !== void 0 ? c.groupsWidth : d.groupsWidth + "px";
    i.style.display = e.length == 0 ? "none" : "";
    for (var k = f.length, l = e.length, m = 0, r = Math.min(k, l); m < r; m++) {
        var q = e[m], n = f[m];
        n.innerHTML = this.getGroupName(q);
        n.style.display = ""
    }
    for (m = k; m < l; m++) {
        q = e[m];
        n = document.createElement("DIV");
        n.className = "timeline-groups-text";
        n.style.position = "absolute";
        if (c.groupsWidth === void 0)n.style.whiteSpace = "nowrap";
        n.innerHTML = this.getGroupName(q);
        i.appendChild(n);
        f[m] = n;
        var p = document.createElement("DIV");
        p.className = "timeline-axis-grid timeline-axis-grid-minor";
        p.style.position = "absolute";
        p.style.left = "0px";
        p.style.width = "100%";
        p.style.height = "0px";
        p.style.borderTopStyle = "solid";
        i.appendChild(p);
        g[m] = p;
        var o = document.createElement("DIV");
        o.className = "timeline-axis-grid timeline-axis-grid-minor";
        o.style.position = "absolute";
        o.style.left = "0px";
        o.style.width = "100%";
        o.style.height = "0px";
        o.style.borderTopStyle = "solid";
        a.content.insertBefore(o,
            a.content.firstChild);
        h[m] = o
    }
    for (m = l; m < k; m++)n = f[m], p = g[m], o = h[m], i.removeChild(n), i.removeChild(p), a.content.removeChild(o);
    f.splice(l, k - l);
    g.splice(l, k - l);
    h.splice(l, k - l);
    links.Timeline.addClassName(i, c.groupsOnRight ? "timeline-groups-axis-onright" : "timeline-groups-axis-onleft");
    m = 0;
    for (r = e.length; m < r; m++)q = e[m], n = f[m], p = g[m], o = h[m], n.style.top = q.labelTop + "px", p.style.top = q.lineTop + "px", o.style.top = q.lineTop + "px", o.style.width = d.contentWidth + "px";
    if (!a.groups.background)c = document.createElement("DIV"),
        c.className = "timeline-axis", c.style.position = "absolute", c.style.left = "0px", c.style.width = "100%", c.style.border = "none", i.appendChild(c), a.groups.background = c;
    a.groups.background.style.top = d.axis.top + "px";
    a.groups.background.style.height = d.axis.height + "px";
    if (!a.groups.line)c = document.createElement("DIV"), c.className = "timeline-axis", c.style.position = "absolute", c.style.left = "0px", c.style.width = "100%", c.style.height = "0px", i.appendChild(c), a.groups.line = c;
    a.groups.line.style.top = d.axis.line + "px";
    a.groups.frame &&
        e.length && (d = [], links.imageloader.filterImageUrls(a.groups.frame, d), d.length && links.imageloader.loadAll(d, function () {
        b.render()
    }, !1))
};
links.Timeline.prototype.repaintCurrentTime = function () {
    var a = this.dom, b = this.size;
    if (this.options.showCurrentTime) {
        if (!a.currentTime) {
            var c = document.createElement("DIV");
            c.className = "timeline-currenttime";
            c.style.position = "absolute";
            c.style.top = "0px";
            c.style.height = "100%";
            a.contentTimelines.appendChild(c);
            a.currentTime = c
        }
        var c = new Date((new Date).valueOf() + this.clientTimeOffset), d = this.timeToScreen(c);
        a.currentTime.style.display = d > -b.contentWidth && d < 2 * b.contentWidth ? "" : "none";
        a.currentTime.style.left =
            d + "px";
        a.currentTime.title = "Current time: " + c;
        this.currentTimeTimer != void 0 && (clearTimeout(this.currentTimeTimer), delete this.currentTimeTimer);
        var e = this, a = 1 / this.conversion.factor / 2;
        a < 30 && (a = 30);
        this.currentTimeTimer = setTimeout(function () {
            e.repaintCurrentTime()
        }, a)
    } else a.currentTime && (a.contentTimelines.removeChild(a.currentTime), delete a.currentTime)
};
links.Timeline.prototype.repaintCustomTime = function () {
    var a = this.dom, b = this.size;
    if (this.options.showCustomTime) {
        if (!a.customTime) {
            var c = document.createElement("DIV");
            c.className = "timeline-customtime";
            c.style.position = "absolute";
            c.style.top = "0px";
            c.style.height = "100%";
            var d = document.createElement("DIV");
            d.style.position = "relative";
            d.style.top = "0px";
            d.style.left = "-10px";
            d.style.height = "100%";
            d.style.width = "20px";
            c.appendChild(d);
            a.contentTimelines.appendChild(c);
            a.customTime = c;
            this.customTime = new Date
        }
        c =
            this.timeToScreen(this.customTime);
        a.customTime.style.display = c > -b.contentWidth && c < 2 * b.contentWidth ? "" : "none";
        a.customTime.style.left = c + "px";
        a.customTime.title = "Time: " + this.customTime
    } else a.customTime && (a.contentTimelines.removeChild(a.customTime), delete a.customTime)
};
links.Timeline.prototype.repaintDeleteButton = function () {
    var a = this.dom, b = a.items.frame, c = a.items.deleteButton;
    if (!c)c = document.createElement("DIV"), c.className = "timeline-navigation-delete", c.style.position = "absolute", b.appendChild(c), a.items.deleteButton = c;
    var a = this.selection ? this.selection.index : -1, d = this.selection ? this.items[a] : void 0;
    d && d.rendered && this.isEditable(d) ? (a = d.getRight(this), d = d.top, c.style.left = a + "px", c.style.top = d + "px", c.style.display = "", b.removeChild(c), b.appendChild(c)) : c.style.display =
        "none"
};
links.Timeline.prototype.repaintDragAreas = function () {
    var a = this.options, b = this.dom, c = this.dom.items.frame, d = b.items.dragLeft;
    if (!d)d = document.createElement("DIV"), d.className = "timeline-event-range-drag-left", d.style.position = "absolute", c.appendChild(d), b.items.dragLeft = d;
    var e = b.items.dragRight;
    if (!e)e = document.createElement("DIV"), e.className = "timeline-event-range-drag-right", e.style.position = "absolute", c.appendChild(e), b.items.dragRight = e;
    var b = this.selection ? this.selection.index : -1, f = this.selection ? this.items[b] :
        void 0;
    if (f && f.rendered && this.isEditable(f) && f instanceof links.Timeline.ItemRange) {
        var b = this.timeToScreen(f.start), g = this.timeToScreen(f.end), h = f.top, f = f.height;
        d.style.left = b + "px";
        d.style.top = h + "px";
        d.style.width = a.dragAreaWidth + "px";
        d.style.height = f + "px";
        d.style.display = "";
        c.removeChild(d);
        c.appendChild(d);
        e.style.left = g - a.dragAreaWidth + "px";
        e.style.top = h + "px";
        e.style.width = a.dragAreaWidth + "px";
        e.style.height = f + "px";
        e.style.display = "";
        c.removeChild(e);
        c.appendChild(e)
    } else d.style.display = "none",
        e.style.display = "none"
};
links.Timeline.prototype.repaintNavigation = function () {
    var a = this, b = this.options, c = this.dom, d = c.frame, e = c.navBar;
    if (!e) {
        var f = b.showButtonNew && b.editable, g = b.showNavigation && (b.zoomable || b.moveable);
        if (g || f)e = document.createElement("DIV"), e.style.position = "absolute", e.className = "timeline-navigation ui-widget ui-state-highlight ui-corner-all", b.groupsOnRight ? e.style.left = "10px" : e.style.right = "10px", b.axisOnTop ? e.style.bottom = "10px" : e.style.top = "10px", c.navBar = e, d.appendChild(e);
        if (f)e.addButton = document.createElement("DIV"),
            e.addButton.className = "timeline-navigation-new", e.addButton.title = b.CREATE_NEW_EVENT, c = document.createElement("SPAN"), c.className = "ui-icon ui-icon-circle-plus", e.addButton.appendChild(c), links.Timeline.addEventListener(e.addButton, "mousedown", function (c) {
            links.Timeline.preventDefault(c);
            links.Timeline.stopPropagation(c);
            var d = a.size.contentWidth, e = d / 2, c = a.screenToTime(e - d / 10), d = a.screenToTime(e + d / 10);
            b.snapEvents && (a.step.snap(c), a.step.snap(d));
            a.addItem({start: c, end: d, content: b.NEW, group: a.groups.length ?
                a.groups[0].content : void 0}, !0);
            c = a.items.length - 1;
            a.selectItem(c);
            a.applyAdd = !0;
            a.trigger("add");
            a.applyAdd ? (a.render({animate: !1}), a.selectItem(c)) : a.deleteItem(c)
        }), e.appendChild(e.addButton);
        f && g && links.Timeline.addClassName(e.addButton, "timeline-navigation-new-line");
        if (g) {
            if (b.zoomable)e.zoomInButton = document.createElement("DIV"), e.zoomInButton.className = "timeline-navigation-zoom-in", e.zoomInButton.title = this.options.ZOOM_IN, f = document.createElement("SPAN"), f.className = "ui-icon ui-icon-circle-zoomin",
                e.zoomInButton.appendChild(f), links.Timeline.addEventListener(e.zoomInButton, "mousedown", function (b) {
                links.Timeline.preventDefault(b);
                links.Timeline.stopPropagation(b);
                a.zoom(0.4);
                a.trigger("rangechange");
                a.trigger("rangechanged")
            }), e.appendChild(e.zoomInButton), e.zoomOutButton = document.createElement("DIV"), e.zoomOutButton.className = "timeline-navigation-zoom-out", e.zoomOutButton.title = this.options.ZOOM_OUT, f = document.createElement("SPAN"), f.className = "ui-icon ui-icon-circle-zoomout", e.zoomOutButton.appendChild(f),
                links.Timeline.addEventListener(e.zoomOutButton, "mousedown", function (b) {
                    links.Timeline.preventDefault(b);
                    links.Timeline.stopPropagation(b);
                    a.zoom(-0.4);
                    a.trigger("rangechange");
                    a.trigger("rangechanged")
                }), e.appendChild(e.zoomOutButton);
            if (b.moveable)e.moveLeftButton = document.createElement("DIV"), e.moveLeftButton.className = "timeline-navigation-move-left", e.moveLeftButton.title = this.options.MOVE_LEFT, f = document.createElement("SPAN"), f.className = "ui-icon ui-icon-circle-arrow-w", e.moveLeftButton.appendChild(f),
                links.Timeline.addEventListener(e.moveLeftButton, "mousedown", function (b) {
                    links.Timeline.preventDefault(b);
                    links.Timeline.stopPropagation(b);
                    a.move(-0.2);
                    a.trigger("rangechange");
                    a.trigger("rangechanged")
                }), e.appendChild(e.moveLeftButton), e.moveRightButton = document.createElement("DIV"), e.moveRightButton.className = "timeline-navigation-move-right", e.moveRightButton.title = this.options.MOVE_RIGHT, f = document.createElement("SPAN"), f.className = "ui-icon ui-icon-circle-arrow-e", e.moveRightButton.appendChild(f),
                links.Timeline.addEventListener(e.moveRightButton, "mousedown", function (b) {
                    links.Timeline.preventDefault(b);
                    links.Timeline.stopPropagation(b);
                    a.move(0.2);
                    a.trigger("rangechange");
                    a.trigger("rangechanged")
                }), e.appendChild(e.moveRightButton)
        }
    }
};
links.Timeline.prototype.setCurrentTime = function (a) {
    this.clientTimeOffset = a.valueOf() - (new Date).valueOf();
    this.repaintCurrentTime()
};
links.Timeline.prototype.getCurrentTime = function () {
    return new Date((new Date).valueOf() + this.clientTimeOffset)
};
links.Timeline.prototype.setCustomTime = function (a) {
    this.customTime = new Date(a.valueOf());
    this.repaintCustomTime()
};
links.Timeline.prototype.getCustomTime = function () {
    return new Date(this.customTime.valueOf())
};
links.Timeline.prototype.setScale = function (a, b) {
    this.step.setScale(a, b);
    this.render()
};
links.Timeline.prototype.setAutoScale = function (a) {
    this.step.setAutoScale(a);
    this.render()
};
links.Timeline.prototype.redraw = function () {
    this.setData(this.data)
};
links.Timeline.prototype.checkResize = function () {
    this.render()
};
links.Timeline.prototype.isEditable = function (a) {
    return a ? a.editable != void 0 ? a.editable : this.options.editable : !1
};
links.Timeline.prototype.recalcConversion = function () {
    this.conversion.offset = this.start.valueOf();
    this.conversion.factor = this.size.contentWidth / (this.end.valueOf() - this.start.valueOf())
};
links.Timeline.prototype.screenToTime = function (a) {
    var b = this.conversion;
    return new Date(a / b.factor + b.offset)
};
links.Timeline.prototype.timeToScreen = function (a) {
    var b = this.conversion;
    return(a.valueOf() - b.offset) * b.factor
};
links.Timeline.prototype.onTouchStart = function (a) {
    var b = this.eventParams, c = this;
    if (!b.touchDown) {
        b.touchDown = !0;
        b.zoomed = !1;
        this.onMouseDown(a);
        if (!b.onTouchMove)b.onTouchMove = function (a) {
            c.onTouchMove(a)
        }, links.Timeline.addEventListener(document, "touchmove", b.onTouchMove);
        if (!b.onTouchEnd)b.onTouchEnd = function (a) {
            c.onTouchEnd(a)
        }, links.Timeline.addEventListener(document, "touchend", b.onTouchEnd);
        var d = this.getItemIndex(links.Timeline.getTarget(a));
        b.doubleTapStartPrev = b.doubleTapStart;
        b.doubleTapStart =
            (new Date).valueOf();
        b.doubleTapItemPrev = b.doubleTapItem;
        b.doubleTapItem = d;
        links.Timeline.preventDefault(a)
    }
};
links.Timeline.prototype.onTouchMove = function (a) {
    var b = this.eventParams;
    if (a.scale && a.scale !== 1)b.zoomed = !0;
    if (b.zoomed) {
        if (this.options.zoomable) {
            b.zoomed = !0;
            var c = b.end.valueOf() - b.start.valueOf(), d = c / a.scale - c, c = new Date(parseInt(b.start.valueOf() - d / 2)), b = new Date(parseInt(b.end.valueOf() + d / 2));
            this.setVisibleChartRange(c, b);
            this.trigger("rangechange")
        }
    } else this.onMouseMove(a);
    links.Timeline.preventDefault(a)
};
links.Timeline.prototype.onTouchEnd = function (a) {
    var b = this.eventParams;
    b.touchDown = !1;
    b.zoomed && this.trigger("rangechanged");
    b.onTouchMove && (links.Timeline.removeEventListener(document, "touchmove", b.onTouchMove), delete b.onTouchMove);
    b.onTouchEnd && (links.Timeline.removeEventListener(document, "touchend", b.onTouchEnd), delete b.onTouchEnd);
    this.onMouseUp(a);
    var c = (new Date).valueOf();
    this.getItemIndex(links.Timeline.getTarget(a));
    if (b.doubleTapStartPrev && c - b.doubleTapStartPrev < 500 && b.doubleTapItem ==
        b.doubleTapItemPrev)b.touchDown = !0, this.onDblClick(a), b.touchDown = !1;
    links.Timeline.preventDefault(a)
};
links.Timeline.prototype.onMouseDown = function (a) {
    var a = a || window.event, b = this.eventParams, c = this.options, d = this.dom;
    if ((a.which ? a.which == 1 : a.button == 1) || b.touchDown) {
        b.mouseX = links.Timeline.getPageX(a);
        b.mouseY = links.Timeline.getPageY(a);
        b.frameLeft = links.Timeline.getAbsoluteLeft(this.dom.content);
        b.frameTop = links.Timeline.getAbsoluteTop(this.dom.content);
        b.previousLeft = 0;
        b.previousOffset = 0;
        b.moved = !1;
        b.start = new Date(this.start.valueOf());
        b.end = new Date(this.end.valueOf());
        b.target = links.Timeline.getTarget(a);
        var e = d.items && d.items.dragRight ? d.items.dragRight : void 0;
        b.itemDragLeft = b.target === (d.items && d.items.dragLeft ? d.items.dragLeft : void 0);
        b.itemDragRight = b.target === e;
        b.itemIndex = b.itemDragLeft || b.itemDragRight ? this.selection ? this.selection.index : void 0 : this.getItemIndex(b.target);
        b.customTime = b.target === d.customTime || b.target.parentNode === d.customTime ? this.customTime : void 0;
        b.addItem = c.editable && a.ctrlKey;
        if (b.addItem) {
            var f = b.mouseY - b.frameTop, d = this.screenToTime(b.mouseX - b.frameLeft);
            c.snapEvents &&
            this.step.snap(d);
            e = new Date(d.valueOf());
            c = c.NEW;
            f = this.getGroupFromHeight(f);
            this.addItem({start: d, end: e, content: c, group: this.getGroupName(f)});
            b.itemIndex = this.items.length - 1;
            this.selectItem(b.itemIndex);
            b.itemDragRight = !0
        }
        c = this.items[b.itemIndex];
        d = this.isSelected(b.itemIndex);
        b.editItem = d && this.isEditable(c);
        b.editItem ? (b.itemStart = c.start, b.itemEnd = c.end, b.itemGroup = c.group, b.itemLeft = c.start ? this.timeToScreen(c.start) : void 0, b.itemRight = c.end ? this.timeToScreen(c.end) : void 0) : this.dom.frame.style.cursor =
            "move";
        if (!b.touchDown) {
            var g = this;
            if (!b.onMouseMove)b.onMouseMove = function (a) {
                g.onMouseMove(a)
            }, links.Timeline.addEventListener(document, "mousemove", b.onMouseMove);
            if (!b.onMouseUp)b.onMouseUp = function (a) {
                g.onMouseUp(a)
            }, links.Timeline.addEventListener(document, "mouseup", b.onMouseUp);
            links.Timeline.preventDefault(a)
        }
    }
};
links.Timeline.prototype.onMouseMove = function (a) {
    var a = a || window.event, b = this.eventParams, c = this.size, d = this.dom, e = this.options, f = links.Timeline.getPageX(a), g = links.Timeline.getPageY(a);
    if (b.mouseX == void 0)b.mouseX = f;
    if (b.mouseY == void 0)b.mouseY = g;
    f -= b.mouseX;
    if (Math.abs(f) >= 1)b.moved = !0;
    if (b.customTime)this.customTime = this.screenToTime(this.timeToScreen(b.customTime) + f), this.repaintCustomTime(), this.trigger("timechange"); else if (b.editItem) {
        var d = this.items[b.itemIndex], h;
        if (b.itemDragLeft) {
            if (c =
                b.itemLeft + f, h = b.itemRight, d.start = this.screenToTime(c), e.snapEvents && (this.step.snap(d.start), c = this.timeToScreen(d.start)), c > h)c = h, d.start = this.screenToTime(c)
        } else if (b.itemDragRight) {
            if (c = b.itemLeft, h = b.itemRight + f, d.end = this.screenToTime(h), e.snapEvents && (this.step.snap(d.end), h = this.timeToScreen(d.end)), h < c)h = c, d.end = this.screenToTime(h)
        } else {
            c = b.itemLeft + f;
            d.start = this.screenToTime(c);
            e.snapEvents && (this.step.snap(d.start), c = this.timeToScreen(d.start));
            if (d.end)h = c + (b.itemRight - b.itemLeft),
                d.end = this.screenToTime(h);
            this.trigger("change")
        }
        d.setPosition(c, h);
        c = b.itemDragLeft || b.itemDragRight;
        this.groups.length && !c ? (b = this.getGroupFromHeight(g - b.frameTop), e.groupsChangeable && d.group !== b ? this.changeItem(this.items.indexOf(d), {group: this.getGroupName(b)}) : (this.repaintDeleteButton(), this.repaintDragAreas())) : this.render()
    } else if (e.moveable)e = b.end.valueOf() - b.start.valueOf(), g = Math.round(-f / c.contentWidth * e), f = new Date(b.start.valueOf() + g), this.applyRange(f, new Date(b.end.valueOf() + g)),
        (f = this.start.valueOf() - f.valueOf()) && (g += f), this.recalcConversion(), f = b.previousLeft || 0, h = parseFloat(d.items.frame.style.left) || 0, f = (b.previousOffset || 0) + (h - f), c = -g / e * c.contentWidth + f, d.items.frame.style.left = c + "px", b.previousOffset = f, b.previousLeft = parseFloat(d.items.frame.style.left) || c, this.repaintCurrentTime(), this.repaintCustomTime(), this.repaintAxis(), this.trigger("rangechange");
    links.Timeline.preventDefault(a)
};
links.Timeline.prototype.onMouseUp = function () {
    var a = this.eventParams, b = this.options;
    this.dom.frame.style.cursor = "auto";
    a.onMouseMove && (links.Timeline.removeEventListener(document, "mousemove", a.onMouseMove), delete a.onMouseMove);
    a.onMouseUp && (links.Timeline.removeEventListener(document, "mouseup", a.onMouseUp), delete a.onMouseUp);
    if (a.customTime)this.trigger("timechanged"); else if (a.editItem) {
        if (b = this.items[a.itemIndex], a.moved || a.addItem)this.applyAdd = this.applyChange = !0, this.updateData(a.itemIndex,
            {start: b.start, end: b.end}), this.trigger(a.addItem ? "add" : "changed"), a.addItem ? this.applyAdd ? this.updateData(a.itemIndex, {start: b.start, end: b.end, content: b.content, group: this.getGroupName(b.group)}) : this.deleteItem(a.itemIndex) : this.applyChange ? this.updateData(a.itemIndex, {start: b.start, end: b.end}) : (delete this.applyChange, delete this.applyAdd, b = this.items[a.itemIndex], b.start = a.itemStart, b.end = a.itemEnd, b.group = a.itemGroup, b.setPosition(a.itemLeft, a.itemRight)), this.options.cluster && this.clusterGenerator.updateData(),
            this.render()
    } else!a.moved && !a.zoomed ? a.target === this.dom.items.deleteButton ? this.selection && this.confirmDeleteItem(this.selection.index) : b.selectable && (a.itemIndex != void 0 ? this.isSelected(a.itemIndex) || (this.selectItem(a.itemIndex), this.trigger("select")) : b.unselectable && (this.unselectItem(), this.trigger("select"))) : (this.render(), (a.moved && b.moveable || a.zoomed && b.zoomable) && this.trigger("rangechanged"))
};
links.Timeline.prototype.onDblClick = function (a) {
    var b = this.eventParams, c = this.options, d = this.dom, e = this.size, a = a || window.event;
    if (b.itemIndex != void 0)(b = this.items[b.itemIndex]) && this.isEditable(b) && this.trigger("edit"); else if (c.editable) {
        b.mouseX = links.Timeline.getPageX(a);
        b.mouseY = links.Timeline.getPageY(a);
        var f = b.mouseX - links.Timeline.getAbsoluteLeft(d.content), g = b.mouseY - links.Timeline.getAbsoluteTop(d.content), d = this.screenToTime(f), e = this.screenToTime(f + e.frameWidth / 10);
        c.snapEvents && (this.step.snap(d),
            this.step.snap(e));
        c = c.NEW;
        g = this.getGroupFromHeight(g);
        this.addItem({start: d, end: e, content: c, group: this.getGroupName(g)}, !0);
        b.itemIndex = this.items.length - 1;
        this.selectItem(b.itemIndex);
        this.applyAdd = !0;
        this.trigger("add");
        this.applyAdd ? (this.render({animate: !1}), this.selectItem(b.itemIndex)) : this.deleteItem(b.itemIndex)
    }
    links.Timeline.preventDefault(a)
};
links.Timeline.prototype.onMouseWheel = function (a) {
    if (this.options.zoomable) {
        if (!a)a = window.event;
        var b = 0;
        a.wheelDelta ? b = a.wheelDelta / 120 : a.detail && (b = -a.detail / 3);
        if (b) {
            var c = this, d = function () {
                var d = b / 5, f = links.Timeline.getAbsoluteLeft(c.dom.content), g = links.Timeline.getPageX(a), f = g != void 0 && f != void 0 ? c.screenToTime(g - f) : void 0;
                c.zoom(d, f);
                c.trigger("rangechange");
                c.trigger("rangechanged")
            };
            a.shiftKey ? (c.move(b * -0.2), c.trigger("rangechange"), c.trigger("rangechanged")) : d()
        }
        links.Timeline.preventDefault(a)
    }
};
links.Timeline.prototype.zoom = function (a, b) {
    b == void 0 && (b = new Date((this.start.valueOf() + this.end.valueOf()) / 2));
    a >= 1 && (a = 0.9);
    a <= -1 && (a = -0.9);
    a < 0 && (a /= 1 + a);
    var c = new Date(this.start.valueOf() - (this.start.valueOf() - b) * a), d = new Date(this.end.valueOf() - (this.end.valueOf() - b) * a), e = d.valueOf() - c.valueOf(), f = Number(this.options.zoomMin) || 10;
    f < 10 && (f = 10);
    e >= f && (this.applyRange(c, d, b), this.render({animate: this.options.animate && this.options.animateZoom}))
};
links.Timeline.prototype.move = function (a) {
    var b = this.end.valueOf() - this.start.valueOf();
    this.applyRange(new Date(this.start.valueOf() + b * a), new Date(this.end.valueOf() + b * a));
    this.render()
};
links.Timeline.prototype.applyRange = function (a, b, c) {
    var a = a.valueOf(), b = b.valueOf(), d = b - a, e = this.options, f = Number(e.zoomMin) || 10;
    f < 10 && (f = 10);
    var g = Number(e.zoomMax) || 31536E10;
    g > 31536E10 && (g = 31536E10);
    g < f && (g = f);
    var h = e.min ? e.min.valueOf() : void 0, e = e.max ? e.max.valueOf() : void 0;
    h != void 0 && e != void 0 && (h >= e && (e = h + 864E5), g > e - h && (g = e - h), f > e - h && (f = e - h));
    a >= b && (b += 864E5);
    if (d < f) {
        f -= d;
        var i = c ? (c.valueOf() - a) / d : 0.5;
        a -= Math.round(f * i);
        b += Math.round(f * (1 - i))
    }
    d > g && (f = d - g, i = c ? (c.valueOf() - a) / d : 0.5, a += Math.round(f *
        i), b -= Math.round(f * (1 - i)));
    h != void 0 && (f = a - h, f < 0 && (a -= f, b -= f));
    e != void 0 && (f = e - b, f < 0 && (a += f, b += f));
    this.start = new Date(a);
    this.end = new Date(b)
};
links.Timeline.prototype.confirmDeleteItem = function (a) {
    this.applyDelete = !0;
    this.isSelected(a) || this.selectItem(a);
    this.trigger("delete");
    this.applyDelete && this.deleteItem(a);
    delete this.applyDelete
};
links.Timeline.prototype.deleteItem = function (a, b) {
    if (a >= this.items.length)throw"Cannot delete row, index out of range";
    this.selection && (this.selection.index == a ? this.unselectItem() : this.selection.index > a && this.selection.index--);
    this.renderQueue.hide.push(this.items.splice(a, 1)[0]);
    if (this.data)if (google && google.visualization && this.data instanceof google.visualization.DataTable)this.data.removeRow(a); else if (links.Timeline.isArray(this.data))this.data.splice(a, 1); else throw"Cannot delete row from data, unknown data type";
    this.options.cluster && this.clusterGenerator.updateData();
    b || this.render()
};
links.Timeline.prototype.deleteAllItems = function () {
    this.unselectItem();
    this.clearItems();
    this.deleteGroups();
    if (this.data)if (google && google.visualization && this.data instanceof google.visualization.DataTable)this.data.removeRows(0, this.data.getNumberOfRows()); else if (links.Timeline.isArray(this.data))this.data.splice(0, this.data.length); else throw"Cannot delete row from data, unknown data type";
    this.options.cluster && this.clusterGenerator.updateData();
    this.render()
};
links.Timeline.prototype.getGroupFromHeight = function (a) {
    var b, c, d = this.groups;
    if (d.length) {
        if (this.options.axisOnTop)for (b = d.length - 1; b >= 0; b--) {
            if (c = d[b], a > c.top)break
        } else for (b = 0; b < d.length; b++)if (c = d[b], a > c.top)break;
        return c
    }
};
links.Timeline.Item = function (a, b) {
    if (a)this.start = a.start, this.end = a.end, this.content = a.content, this.className = a.className, this.editable = a.editable, this.group = a.group, this.type = a.type;
    this.dotHeight = this.dotWidth = this.lineWidth = this.height = this.width = this.left = this.top = 0;
    this.rendered = !1;
    if (b)for (var c in b)b.hasOwnProperty(c) && (this[c] = b[c])
};
links.Timeline.Item.prototype.reflow = function () {
    return!1
};
links.Timeline.Item.prototype.getImageUrls = function (a) {
    this.dom && links.imageloader.filterImageUrls(this.dom, a)
};
links.Timeline.Item.prototype.select = function () {
};
links.Timeline.Item.prototype.unselect = function () {
};
links.Timeline.Item.prototype.createDOM = function () {
};
links.Timeline.Item.prototype.showDOM = function () {
};
links.Timeline.Item.prototype.hideDOM = function () {
};
links.Timeline.Item.prototype.updateDOM = function () {
};
links.Timeline.Item.prototype.updatePosition = function () {
};
links.Timeline.Item.prototype.isRendered = function () {
    return this.rendered
};
links.Timeline.Item.prototype.isVisible = function () {
    return!1
};
links.Timeline.Item.prototype.setPosition = function () {
};
links.Timeline.Item.prototype.getRight = function () {
    return 0
};
links.Timeline.Item.prototype.getWidth = function () {
    return this.width || 0
};
links.Timeline.ItemBox = function (a, b) {
    links.Timeline.Item.call(this, a, b)
};
links.Timeline.ItemBox.prototype = new links.Timeline.Item;
links.Timeline.ItemBox.prototype.reflow = function () {
    var a = this.dom, b = a.dot.offsetHeight, c = a.dot.offsetWidth, a = a.line.offsetWidth, d = this.dotHeight != b || this.dotWidth != c || this.lineWidth != a;
    this.dotHeight = b;
    this.dotWidth = c;
    this.lineWidth = a;
    return d
};
links.Timeline.ItemBox.prototype.select = function () {
    var a = this.dom;
    links.Timeline.addClassName(a, "timeline-event-selected ui-state-active");
    links.Timeline.addClassName(a.line, "timeline-event-selected ui-state-active");
    links.Timeline.addClassName(a.dot, "timeline-event-selected ui-state-active")
};
links.Timeline.ItemBox.prototype.unselect = function () {
    var a = this.dom;
    links.Timeline.removeClassName(a, "timeline-event-selected ui-state-active");
    links.Timeline.removeClassName(a.line, "timeline-event-selected ui-state-active");
    links.Timeline.removeClassName(a.dot, "timeline-event-selected ui-state-active")
};
links.Timeline.ItemBox.prototype.createDOM = function () {
    var a = document.createElement("DIV");
    a.style.position = "absolute";
    a.style.left = this.left + "px";
    a.style.top = this.top + "px";
    var b = document.createElement("DIV");
    b.className = "timeline-event-content";
    b.innerHTML = this.content;
    a.appendChild(b);
    b = document.createElement("DIV");
    b.style.position = "absolute";
    b.style.width = "0px";
    a.line = b;
    b = document.createElement("DIV");
    b.style.position = "absolute";
    b.style.width = "0px";
    b.style.height = "0px";
    a.dot = b;
    this.dom = a;
    this.updateDOM();
    return a
};
links.Timeline.ItemBox.prototype.showDOM = function (a) {
    var b = this.dom;
    b || (b = this.createDOM());
    if (b.parentNode != a)b.parentNode && this.hideDOM(), a.appendChild(b), a.insertBefore(b.line, a.firstChild), a.appendChild(b.dot), this.rendered = !0
};
links.Timeline.ItemBox.prototype.hideDOM = function () {
    var a = this.dom;
    if (a)a.parentNode && a.parentNode.removeChild(a), a.line && a.line.parentNode && a.line.parentNode.removeChild(a.line), a.dot && a.dot.parentNode && a.dot.parentNode.removeChild(a.dot), this.rendered = !1
};
links.Timeline.ItemBox.prototype.updateDOM = function () {
    var a = this.dom;
    if (a) {
        var b = a.line, c = a.dot;
        a.firstChild.innerHTML = this.content;
        a.className = "timeline-event timeline-event-box ui-widget ui-state-default";
        b.className = "timeline-event timeline-event-line ui-widget ui-state-default";
        c.className = "timeline-event timeline-event-dot ui-widget ui-state-default";
        this.isCluster && (links.Timeline.addClassName(a, "timeline-event-cluster ui-widget-header"), links.Timeline.addClassName(b, "timeline-event-cluster ui-widget-header"),
            links.Timeline.addClassName(c, "timeline-event-cluster ui-widget-header"));
        this.className && (links.Timeline.addClassName(a, this.className), links.Timeline.addClassName(b, this.className), links.Timeline.addClassName(c, this.className))
    }
};
links.Timeline.ItemBox.prototype.updatePosition = function (a) {
    var b = this.dom;
    if (b) {
        var c = a.timeToScreen(this.start), d = a.options.axisOnTop, e = a.size.axis.top, f = a.size.axis.height, a = a.options.box && a.options.box.align ? a.options.box.align : void 0;
        b.style.top = this.top + "px";
        b.style.left = a == "right" ? c - this.width + "px" : a == "left" ? c + "px" : c - this.width / 2 + "px";
        a = b.line;
        b = b.dot;
        a.style.left = c - this.lineWidth / 2 + "px";
        b.style.left = c - this.dotWidth / 2 + "px";
        d ? (a.style.top = f + "px", a.style.height = Math.max(this.top - f, 0) + "px", b.style.top =
            f - this.dotHeight / 2 + "px") : (a.style.top = this.top + this.height + "px", a.style.height = Math.max(e - this.top - this.height, 0) + "px", b.style.top = e - this.dotHeight / 2 + "px")
    }
};
links.Timeline.ItemBox.prototype.isVisible = function (a, b) {
    return this.cluster ? !1 : this.start > a && this.start < b
};
links.Timeline.ItemBox.prototype.setPosition = function (a) {
    var b = this.dom;
    b.style.left = a - this.width / 2 + "px";
    b.line.style.left = a - this.lineWidth / 2 + "px";
    b.dot.style.left = a - this.dotWidth / 2 + "px";
    if (this.group)this.top = this.group.top, b.style.top = this.top + "px"
};
links.Timeline.ItemBox.prototype.getRight = function (a) {
    var b = a.options.box && a.options.box.align ? a.options.box.align : void 0, a = a.timeToScreen(this.start);
    return b == "right" ? a : b == "left" ? a + this.width : a + this.width / 2
};
links.Timeline.ItemRange = function (a, b) {
    links.Timeline.Item.call(this, a, b)
};
links.Timeline.ItemRange.prototype = new links.Timeline.Item;
links.Timeline.ItemRange.prototype.select = function () {
    links.Timeline.addClassName(this.dom, "timeline-event-selected ui-state-active")
};
links.Timeline.ItemRange.prototype.unselect = function () {
    links.Timeline.removeClassName(this.dom, "timeline-event-selected ui-state-active")
};
links.Timeline.ItemRange.prototype.createDOM = function () {
    var a = document.createElement("DIV");
    a.style.position = "absolute";
    var b = document.createElement("DIV");
    b.className = "timeline-event-content";
    a.appendChild(b);
    this.dom = a;
    this.updateDOM();
    return a
};
links.Timeline.ItemRange.prototype.showDOM = function (a) {
    var b = this.dom;
    b || (b = this.createDOM());
    if (b.parentNode != a)b.parentNode && this.hideDOM(), a.appendChild(b), this.rendered = !0
};
links.Timeline.ItemRange.prototype.hideDOM = function () {
    var a = this.dom;
    if (a)a.parentNode && a.parentNode.removeChild(a), this.rendered = !1
};
links.Timeline.ItemRange.prototype.updateDOM = function () {
    var a = this.dom;
    if (a)a.firstChild.innerHTML = this.content, a.className = "timeline-event timeline-event-range ui-widget ui-state-default", this.isCluster && links.Timeline.addClassName(a, "timeline-event-cluster ui-widget-header"), this.className && links.Timeline.addClassName(a, this.className)
};
links.Timeline.ItemRange.prototype.updatePosition = function (a) {
    var b = this.dom;
    if (b) {
        var c = a.size.contentWidth, d = a.timeToScreen(this.start), a = a.timeToScreen(this.end);
        d < -c && (d = -c);
        a > 2 * c && (a = 2 * c);
        b.style.top = this.top + "px";
        b.style.left = d + "px";
        b.style.width = Math.max(a - d, 1) + "px"
    }
};
links.Timeline.ItemRange.prototype.isVisible = function (a, b) {
    return this.cluster ? !1 : this.end > a && this.start < b
};
links.Timeline.ItemRange.prototype.setPosition = function (a, b) {
    var c = this.dom;
    c.style.left = a + "px";
    c.style.width = b - a + "px";
    if (this.group)this.top = this.group.top, c.style.top = this.top + "px"
};
links.Timeline.ItemRange.prototype.getRight = function (a) {
    return a.timeToScreen(this.end)
};
links.Timeline.ItemRange.prototype.getWidth = function (a) {
    return a.timeToScreen(this.end) - a.timeToScreen(this.start)
};
links.Timeline.ItemDot = function (a, b) {
    links.Timeline.Item.call(this, a, b)
};
links.Timeline.ItemDot.prototype = new links.Timeline.Item;
links.Timeline.ItemDot.prototype.reflow = function () {
    var a = this.dom, b = a.dot.offsetHeight, c = a.dot.offsetWidth, a = a.content.offsetHeight, d = this.dotHeight != b || this.dotWidth != c || this.contentHeight != a;
    this.dotHeight = b;
    this.dotWidth = c;
    this.contentHeight = a;
    return d
};
links.Timeline.ItemDot.prototype.select = function () {
    links.Timeline.addClassName(this.dom, "timeline-event-selected ui-state-active")
};
links.Timeline.ItemDot.prototype.unselect = function () {
    links.Timeline.removeClassName(this.dom, "timeline-event-selected ui-state-active")
};
links.Timeline.ItemDot.prototype.createDOM = function () {
    var a = document.createElement("DIV");
    a.style.position = "absolute";
    var b = document.createElement("DIV");
    b.className = "timeline-event-content";
    a.appendChild(b);
    var c = document.createElement("DIV");
    c.style.position = "absolute";
    c.style.width = "0px";
    c.style.height = "0px";
    a.appendChild(c);
    a.content = b;
    a.dot = c;
    this.dom = a;
    this.updateDOM();
    return a
};
links.Timeline.ItemDot.prototype.showDOM = function (a) {
    var b = this.dom;
    b || (b = this.createDOM());
    if (b.parentNode != a)b.parentNode && this.hideDOM(), a.appendChild(b), this.rendered = !0
};
links.Timeline.ItemDot.prototype.hideDOM = function () {
    var a = this.dom;
    if (a)a.parentNode && a.parentNode.removeChild(a), this.rendered = !1
};
links.Timeline.ItemDot.prototype.updateDOM = function () {
    if (this.dom) {
        var a = this.dom, b = a.dot;
        a.firstChild.innerHTML = this.content;
        a.className = "timeline-event-dot-container";
        b.className = "timeline-event timeline-event-dot ui-widget ui-state-default";
        this.isCluster && (links.Timeline.addClassName(a, "timeline-event-cluster ui-widget-header"), links.Timeline.addClassName(b, "timeline-event-cluster ui-widget-header"));
        this.className && (links.Timeline.addClassName(a, this.className), links.Timeline.addClassName(b,
            this.className))
    }
};
links.Timeline.ItemDot.prototype.updatePosition = function (a) {
    var b = this.dom;
    if (b)a = a.timeToScreen(this.start), b.style.top = this.top + "px", b.style.left = a - this.dotWidth / 2 + "px", b.content.style.marginLeft = 1.5 * this.dotWidth + "px", b.dot.style.top = (this.height - this.dotHeight) / 2 + "px"
};
links.Timeline.ItemDot.prototype.isVisible = function (a, b) {
    return this.cluster ? !1 : this.start > a && this.start < b
};
links.Timeline.ItemDot.prototype.setPosition = function (a) {
    var b = this.dom;
    b.style.left = a - this.dotWidth / 2 + "px";
    if (this.group)this.top = this.group.top, b.style.top = this.top + "px"
};
links.Timeline.ItemDot.prototype.getRight = function (a) {
    return a.timeToScreen(this.start) + this.width
};
links.Timeline.prototype.getItem = function (a) {
    if (a >= this.items.length)throw"Cannot get item, index out of range";
    var b = this.data;
    if (google && google.visualization && b instanceof google.visualization.DataTable) {
        var c = links.Timeline.mapColumnIds(b), b = {}, d;
        for (d in c)c.hasOwnProperty(d) && (b[d] = this.data.getValue(a, c[d]))
    } else if (links.Timeline.isArray(this.data))b = links.Timeline.clone(this.data[a]); else throw"Unknown data type. DataTable or Array expected.";
    a = this.items[a];
    b.start = new Date(a.start.valueOf());
    if (a.end)b.end = new Date(a.end.valueOf());
    b.content = a.content;
    if (a.group)b.group = this.getGroupName(a.group);
    if (a.className)b.className = a.className;
    if (typeof a.editable !== "undefined")b.editable = a.editable;
    if (a.type)b.type = a.type;
    return b
};
links.Timeline.prototype.addItem = function (a, b) {
    this.addItems([a], b)
};
links.Timeline.prototype.addItems = function (a, b) {
    var c = this, d = this.items;
    a.forEach(function (a) {
        var b = d.length;
        d.push(c.createItem(a));
        c.updateData(b, a)
    });
    this.options.cluster && this.clusterGenerator.updateData();
    b || this.render({animate: !1})
};
links.Timeline.prototype.createItem = function (a) {
    var b = a.type || (a.end ? "range" : this.options.style), c = links.Timeline.clone(a);
    c.type = b;
    c.group = this.getGroup(a.group);
    a = this.options;
    a = a.axisOnTop ? this.size.axis.height + a.eventMarginAxis + a.eventMargin / 2 : this.size.contentHeight - a.eventMarginAxis - a.eventMargin / 2;
    if (b in this.itemTypes)return new this.itemTypes[b](c, {top: a});
    console.log('ERROR: Unknown event style "' + b + '"');
    return new links.Timeline.Item(c, {top: a})
};
links.Timeline.prototype.changeItem = function (a, b, c) {
    var d = this.items[a];
    if (!d)throw"Cannot change item, index out of range";
    var e = this.createItem({start: b.hasOwnProperty("start") ? b.start : d.start, end: b.hasOwnProperty("end") ? b.end : d.end, content: b.hasOwnProperty("content") ? b.content : d.content, group: b.hasOwnProperty("group") ? b.group : this.getGroupName(d.group), className: b.hasOwnProperty("className") ? b.className : d.className, editable: b.hasOwnProperty("editable") ? b.editable : d.editable, type: b.hasOwnProperty("type") ?
        b.type : d.type});
    this.items[a] = e;
    this.renderQueue.hide.push(d);
    this.renderQueue.show.push(e);
    this.updateData(a, b);
    this.options.cluster && this.clusterGenerator.updateData();
    c || (this.render({animate: !1}), this.selection && this.selection.index == a && e.select())
};
links.Timeline.prototype.deleteGroups = function () {
    this.groups = [];
    this.groupIndexes = {}
};
links.Timeline.prototype.getGroup = function (a) {
    var b = this.groups, c = this.groupIndexes, d = void 0, d = c[a];
    if (d == void 0 && a != void 0) {
        d = {content: a, labelTop: 0, lineTop: 0};
        b.push(d);
        this.options.groupsOrder == !0 ? b = b.sort(function (a, b) {
            return a.content > b.content ? 1 : a.content < b.content ? -1 : 0
        }) : typeof this.options.groupsOrder == "function" && (b = b.sort(this.options.groupsOrder));
        for (var a = 0, e = b.length; a < e; a++)c[b[a].content] = a
    } else d = b[d];
    return d
};
links.Timeline.prototype.getGroupName = function (a) {
    return a ? a.content : void 0
};
links.Timeline.prototype.cancelChange = function () {
    this.applyChange = !1
};
links.Timeline.prototype.cancelDelete = function () {
    this.applyDelete = !1
};
links.Timeline.prototype.cancelAdd = function () {
    this.applyAdd = !1
};
links.Timeline.prototype.setSelection = function (a) {
    if (a != void 0 && a.length > 0) {
        if (a[0].row != void 0) {
            var b = a[0].row;
            if (this.items[b])return a = this.items[b], this.selectItem(b), b = a.start, a = a.end, a = a != void 0 ? (a.valueOf() + b.valueOf()) / 2 : b.valueOf(), b = this.end.valueOf() - this.start.valueOf(), this.setVisibleChartRange(new Date(a - b / 2), new Date(a + b / 2)), !0
        }
    } else this.unselectItem();
    return!1
};
links.Timeline.prototype.getSelection = function () {
    var a = [];
    this.selection && a.push({row: this.selection.index});
    return a
};
links.Timeline.prototype.selectItem = function (a) {
    this.unselectItem();
    this.selection = void 0;
    if (this.items[a] != void 0) {
        var b = this.items[a];
        this.selection = {index: a};
        if (b && b.dom) {
            if (this.isEditable(b))b.dom.style.cursor = "move";
            b.select()
        }
        this.repaintDeleteButton();
        this.repaintDragAreas()
    }
};
links.Timeline.prototype.isSelected = function (a) {
    return this.selection && this.selection.index == a
};
links.Timeline.prototype.unselectItem = function () {
    if (this.selection) {
        var a = this.items[this.selection.index];
        if (a && a.dom)a.dom.style.cursor = "", a.unselect();
        this.selection = void 0;
        this.repaintDeleteButton();
        this.repaintDragAreas()
    }
};
links.Timeline.prototype.stackItems = function (a) {
    a == void 0 && (a = !1);
    var b = this.stack;
    if (!b)this.stack = b = {};
    b.sortedItems = this.stackOrder(this.renderedItems);
    b.finalItems = this.stackCalculateFinal(b.sortedItems);
    if (a || b.timer) {
        var c = this, d = function () {
            var a = c.stackMoveOneStep(b.sortedItems, b.finalItems);
            c.repaint();
            a ? delete b.timer : b.timer = setTimeout(d, 30)
        };
        if (!b.timer)b.timer = setTimeout(d, 30)
    } else this.stackMoveToFinal(b.sortedItems, b.finalItems)
};
links.Timeline.prototype.stackCancelAnimation = function () {
    this.stack && this.stack.timer && (clearTimeout(this.stack.timer), delete this.stack.timer)
};
links.Timeline.prototype.getItemsByGroup = function (a) {
    for (var b = {}, c = 0; c < a.length; ++c) {
        var d = a[c], e = "undefined";
        d.group && (e = d.group.content ? d.group.content : d.group);
        b[e] || (b[e] = []);
        b[e].push(d)
    }
    return b
};
links.Timeline.prototype.stackOrder = function (a) {
    a = a.concat([]);
    a.sort(this.options.customStackOrder && typeof this.options.customStackOrder === "function" ? this.options.customStackOrder : function (a, c) {
        return a instanceof links.Timeline.ItemRange && !(c instanceof links.Timeline.ItemRange) ? -1 : !(a instanceof links.Timeline.ItemRange) && c instanceof links.Timeline.ItemRange ? 1 : a.left - c.left
    });
    return a
};
links.Timeline.prototype.stackCalculateFinal = function (a) {
    var b = this.size, c = this.options, d = c.axisOnTop, e = c.eventMargin, c = c.eventMarginAxis, b = d ? b.axis.height + c + e / 2 : b.contentHeight - c - e / 2, f = [], a = this.getItemsByGroup(a);
    for (j = 0; j < this.groups.length; ++j) {
        var g = this.groups[j];
        a[g.content] && (c = this.finalItemsPosition(a[g.content], b, g), c.forEach(function (a) {
            f.push(a)
        }), d ? b += g.itemsHeight + e : b -= g.itemsHeight + e)
    }
    a.undefined && (c = this.finalItemsPosition(a.undefined, b), c.forEach(function (a) {
        f.push(a)
    }));
    return f
};
links.Timeline.prototype.finalItemsPosition = function (a, b, c) {
    var d, e = this.options, f = e.axisOnTop, e = e.eventMargin, g;
    g = this.initialItemsPosition(a, b);
    for (a = 0, d = g.length; a < d; a++) {
        var h = g[a], i = null;
        if (this.options.stackEvents) {
            do if (i = this.stackItemsCheckOverlap(g, a, 0, a - 1), i != null)h.top = f ? i.top + i.height + e : i.top - h.height - e, h.bottom = h.top + h.height; while (i)
        }
        if (c)c.itemsHeight = f ? c.itemsHeight ? Math.max(c.itemsHeight, h.bottom - b) : h.height + e : c.itemsHeight ? Math.max(c.itemsHeight, b - h.top) : h.height + e
    }
    return g
};
links.Timeline.prototype.initialItemsPosition = function (a, b) {
    for (var c = this.options.axisOnTop, d = [], e = 0, f = a.length; e < f; ++e) {
        var g = a[e], h, i = g.height;
        h = g.getWidth(this);
        var k = g.getRight(this), l = k - h;
        h = c ? b : b - i;
        d.push({left: l, top: h, right: k, bottom: h + i, height: i, item: g})
    }
    return d
};
links.Timeline.prototype.stackMoveOneStep = function (a, b) {
    for (var c = !0, d = 0, e = b.length; d < e; d++) {
        var f = b[d], g = f.item, h = parseInt(g.top), i = parseInt(f.top), k = i - h;
        if (k) {
            var l = i == h ? 0 : i > h ? 1 : -1;
            Math.abs(k) > 4 && (l = k / 4);
            h = parseInt(h + l);
            h != i && (c = !1);
            g.top = h;
            g.bottom = g.top + g.height
        } else g.top = f.top, g.bottom = f.bottom;
        g.left = f.left;
        g.right = f.right
    }
    return c
};
links.Timeline.prototype.stackMoveToFinal = function (a, b) {
    for (var c = 0, d = b.length; c < d; c++) {
        var e = b[c], f = e.item;
        f.left = e.left;
        f.top = e.top;
        f.right = e.right;
        f.bottom = e.bottom
    }
};
links.Timeline.prototype.stackItemsCheckOverlap = function (a, b, c, d) {
    for (var e = this.options.eventMargin, f = this.collision, g = a[b]; d >= c; d--) {
        var h = a[d];
        if (f(g, h, e) && d != b)return h
    }
};
links.Timeline.prototype.collision = function (a, b, c) {
    c == void 0 && (c = 0);
    return a.left - c < b.right && a.right + c > b.left && a.top - c < b.bottom && a.bottom + c > b.top
};
links.Timeline.prototype.trigger = function (a) {
    var b = null;
    switch (a) {
        case "rangechange":
        case "rangechanged":
            b = {start: new Date(this.start.valueOf()), end: new Date(this.end.valueOf())};
            break;
        case "timechange":
        case "timechanged":
            b = {time: new Date(this.customTime.valueOf())}
    }
    links.events.trigger(this, a, b);
    google && google.visualization && google.visualization.events.trigger(this, a, b)
};
links.Timeline.prototype.clusterItems = function () {
    if (this.options.cluster) {
        var a = this.clusterGenerator.getClusters(this.conversion.factor);
        if (this.clusters != a) {
            var b = this.renderQueue;
            this.clusters && this.clusters.forEach(function (a) {
                b.hide.push(a);
                a.items.forEach(function (a) {
                    a.cluster = void 0
                })
            });
            a.forEach(function (a) {
                a.items.forEach(function (b) {
                    b.cluster = a
                })
            });
            this.clusters = a
        }
    }
};
links.Timeline.prototype.filterItems = function () {
    function a(a) {
        a.forEach(function (a) {
            var c = a.rendered, f = a.isVisible(d, e);
            c != f && (c && b.hide.push(a), f && b.show.indexOf(a) == -1 && b.show.push(a))
        })
    }

    var b = this.renderQueue, c = this.end - this.start, d = new Date(this.start.valueOf() - c), e = new Date(this.end.valueOf() + c);
    a(this.items);
    this.clusters && a(this.clusters)
};
links.Timeline.ClusterGenerator = function (a) {
    this.timeline = a;
    this.clear()
};
links.Timeline.ClusterGenerator.prototype.clear = function () {
    this.items = [];
    this.groups = {};
    this.clearCache()
};
links.Timeline.ClusterGenerator.prototype.clearCache = function () {
    this.cache = {};
    this.cacheLevel = -1;
    this.cache[this.cacheLevel] = []
};
links.Timeline.ClusterGenerator.prototype.setData = function (a, b) {
    this.items = a || [];
    this.applyOnChangedLevel = this.dataChanged = !0;
    if (b && b.applyOnChangedLevel)this.applyOnChangedLevel = b.applyOnChangedLevel
};
links.Timeline.ClusterGenerator.prototype.updateData = function () {
    this.dataChanged = !0;
    this.applyOnChangedLevel = !1
};
links.Timeline.ClusterGenerator.prototype.filterData = function () {
    var a = this.items || [], b = {};
    this.groups = b;
    a.forEach(function (a) {
        var c = a.group ? a.group.content : "", f = b[c];
        f || (f = [], b[c] = f);
        f.push(a);
        if (a.start)a.center = a.end ? (a.start.valueOf() + a.end.valueOf()) / 2 : a.start.valueOf()
    });
    for (var c in b)b.hasOwnProperty(c) && b[c].sort(function (a, b) {
        return a.center - b.center
    });
    this.dataChanged = !1
};
links.Timeline.ClusterGenerator.prototype.getClusters = function (a) {
    var b = -1, c = 0;
    a > 0 && (b = Math.round(Math.log(100 / a) / Math.log(2)), c = Math.pow(2, b));
    if (this.dataChanged && (a = b != this.cacheLevel, this.applyOnChangedLevel ? a : 1))this.clearCache(), this.filterData();
    this.cacheLevel = b;
    a = this.cache[b];
    if (!a) {
        var a = [], d;
        for (d in this.groups)if (this.groups.hasOwnProperty(d))for (var e = this.groups[d], f = e.length, g = 0; g < f;) {
            for (var h = e[g], i = 1, k = g - 1; k >= 0 && h.center - e[k].center < c / 2;)e[k].cluster || i++, k--;
            for (k = g + 1; k < e.length &&
                e[k].center - h.center < c / 2;)i++, k++;
            for (k = a.length - 1; k >= 0 && h.center - a[k].center < c / 2;)h.group == a[k].group && i++, k--;
            if (i > 5) {
                for (var i = i - 5 + 1, k = [], l = void 0, m = void 0, r = void 0, q = !1, n = 0, p = g; k.length < i && p < e.length;) {
                    var o = e[p], t = o.start.valueOf(), u = o.end ? o.end.valueOf() : o.start.valueOf();
                    k.push(o);
                    l = n ? n / (n + 1) * l + 1 / (n + 1) * o.center : o.center;
                    m = m != void 0 ? Math.min(m, t) : t;
                    r = r != void 0 ? Math.max(r, u) : u;
                    q = q || o instanceof links.Timeline.ItemRange;
                    n++;
                    p++
                }
                var s, n = '<div title="' + ("Cluster containing " + n + " events. Zoom in to see the individual events.") +
                    '">' + n + " events</div>", h = h.group ? h.group.content : void 0;
                s = q ? this.timeline.createItem({start: new Date(m), end: new Date(r), content: n, group: h}) : this.timeline.createItem({start: new Date(l), content: n, group: h});
                s.isCluster = !0;
                s.items = k;
                s.items.forEach(function (a) {
                    a.cluster = s
                });
                a.push(s);
                g += i
            } else delete h.cluster, g += 1
        }
        this.cache[b] = a
    }
    return a
};
links.events = links.events || {listeners: [], indexOf: function (a) {
    for (var b = this.listeners, c = 0, d = this.listeners.length; c < d; c++) {
        var e = b[c];
        if (e && e.object == a)return c
    }
    return-1
}, addListener: function (a, b, c) {
    var d = this.listeners[this.indexOf(a)];
    d || (d = {object: a, events: {}}, this.listeners.push(d));
    a = d.events[b];
    a || (a = [], d.events[b] = a);
    a.indexOf(c) == -1 && a.push(c)
}, removeListener: function (a, b, c) {
    var a = this.indexOf(a), d = this.listeners[a];
    if (d) {
        var e = d.events[b];
        e && (a = e.indexOf(c), a != -1 && e.splice(a, 1), e.length ==
            0 && delete d.events[b]);
        var b = 0, c = d.events, f;
        for (f in c)c.hasOwnProperty(f) && b++;
        b == 0 && delete this.listeners[a]
    }
}, removeAllListeners: function () {
    this.listeners = []
}, trigger: function (a, b, c) {
    if (a = this.listeners[this.indexOf(a)])if (b = a.events[b])for (var a = 0, d = b.length; a < d; a++)b[a](c)
}};
links.Timeline.StepDate = function (a, b, c) {
    this.current = new Date;
    this._start = new Date;
    this._end = new Date;
    this.autoScale = !0;
    this.scale = links.Timeline.StepDate.SCALE.DAY;
    this.step = 1;
    this.setRange(a, b, c)
};
links.Timeline.StepDate.SCALE = {MILLISECOND: 1, SECOND: 2, MINUTE: 3, HOUR: 4, DAY: 5, WEEKDAY: 6, MONTH: 7, YEAR: 8};
links.Timeline.StepDate.prototype.setRange = function (a, b, c) {
    if (a instanceof Date && b instanceof Date)this._start = a != void 0 ? new Date(a.valueOf()) : new Date, this._end = b != void 0 ? new Date(b.valueOf()) : new Date, this.autoScale && this.setMinimumStep(c)
};
links.Timeline.StepDate.prototype.start = function () {
    this.current = new Date(this._start.valueOf());
    this.roundToMinor()
};
links.Timeline.StepDate.prototype.roundToMinor = function () {
    switch (this.scale) {
        case links.Timeline.StepDate.SCALE.YEAR:
            this.current.setFullYear(this.step * Math.floor(this.current.getFullYear() / this.step)), this.current.setMonth(0);
        case links.Timeline.StepDate.SCALE.MONTH:
            this.current.setDate(1);
        case links.Timeline.StepDate.SCALE.DAY:
        case links.Timeline.StepDate.SCALE.WEEKDAY:
            this.current.setHours(0);
        case links.Timeline.StepDate.SCALE.HOUR:
            this.current.setMinutes(0);
        case links.Timeline.StepDate.SCALE.MINUTE:
            this.current.setSeconds(0);
        case links.Timeline.StepDate.SCALE.SECOND:
            this.current.setMilliseconds(0)
    }
    if (this.step != 1)switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            this.current.setMilliseconds(this.current.getMilliseconds() - this.current.getMilliseconds() % this.step);
            break;
        case links.Timeline.StepDate.SCALE.SECOND:
            this.current.setSeconds(this.current.getSeconds() - this.current.getSeconds() % this.step);
            break;
        case links.Timeline.StepDate.SCALE.MINUTE:
            this.current.setMinutes(this.current.getMinutes() - this.current.getMinutes() %
                this.step);
            break;
        case links.Timeline.StepDate.SCALE.HOUR:
            this.current.setHours(this.current.getHours() - this.current.getHours() % this.step);
            break;
        case links.Timeline.StepDate.SCALE.WEEKDAY:
        case links.Timeline.StepDate.SCALE.DAY:
            this.current.setDate(this.current.getDate() - 1 - (this.current.getDate() - 1) % this.step + 1);
            break;
        case links.Timeline.StepDate.SCALE.MONTH:
            this.current.setMonth(this.current.getMonth() - this.current.getMonth() % this.step);
            break;
        case links.Timeline.StepDate.SCALE.YEAR:
            this.current.setFullYear(this.current.getFullYear() -
                this.current.getFullYear() % this.step)
    }
};
links.Timeline.StepDate.prototype.end = function () {
    return this.current.valueOf() > this._end.valueOf()
};
links.Timeline.StepDate.prototype.next = function () {
    var a = this.current.valueOf();
    if (this.current.getMonth() < 6)switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            this.current = new Date(this.current.valueOf() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.SECOND:
            this.current = new Date(this.current.valueOf() + this.step * 1E3);
            break;
        case links.Timeline.StepDate.SCALE.MINUTE:
            this.current = new Date(this.current.valueOf() + this.step * 6E4);
            break;
        case links.Timeline.StepDate.SCALE.HOUR:
            this.current =
                new Date(this.current.valueOf() + this.step * 36E5);
            var b = this.current.getHours();
            this.current.setHours(b - b % this.step);
            break;
        case links.Timeline.StepDate.SCALE.WEEKDAY:
        case links.Timeline.StepDate.SCALE.DAY:
            this.current.setDate(this.current.getDate() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.MONTH:
            this.current.setMonth(this.current.getMonth() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.YEAR:
            this.current.setFullYear(this.current.getFullYear() + this.step)
    } else switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            this.current =
                new Date(this.current.valueOf() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.SECOND:
            this.current.setSeconds(this.current.getSeconds() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.MINUTE:
            this.current.setMinutes(this.current.getMinutes() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.HOUR:
            this.current.setHours(this.current.getHours() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.WEEKDAY:
        case links.Timeline.StepDate.SCALE.DAY:
            this.current.setDate(this.current.getDate() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.MONTH:
            this.current.setMonth(this.current.getMonth() + this.step);
            break;
        case links.Timeline.StepDate.SCALE.YEAR:
            this.current.setFullYear(this.current.getFullYear() + this.step)
    }
    if (this.step != 1)switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            this.current.getMilliseconds() < this.step && this.current.setMilliseconds(0);
            break;
        case links.Timeline.StepDate.SCALE.SECOND:
            this.current.getSeconds() < this.step && this.current.setSeconds(0);
            break;
        case links.Timeline.StepDate.SCALE.MINUTE:
            this.current.getMinutes() <
                this.step && this.current.setMinutes(0);
            break;
        case links.Timeline.StepDate.SCALE.HOUR:
            this.current.getHours() < this.step && this.current.setHours(0);
            break;
        case links.Timeline.StepDate.SCALE.WEEKDAY:
        case links.Timeline.StepDate.SCALE.DAY:
            this.current.getDate() < this.step + 1 && this.current.setDate(1);
            break;
        case links.Timeline.StepDate.SCALE.MONTH:
            this.current.getMonth() < this.step && this.current.setMonth(0)
    }
    if (this.current.valueOf() == a)this.current = new Date(this._end.valueOf())
};
links.Timeline.StepDate.prototype.getCurrent = function () {
    return this.current
};
links.Timeline.StepDate.prototype.setScale = function (a, b) {
    this.scale = a;
    if (b > 0)this.step = b;
    this.autoScale = !1
};
links.Timeline.StepDate.prototype.setAutoScale = function (a) {
    this.autoScale = a
};
links.Timeline.StepDate.prototype.setMinimumStep = function (a) {
    if (a != void 0) {
        if (31104E9 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step = 1E3;
        if (15552E9 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step = 500;
        if (31104E8 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step = 100;
        if (15552E8 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step = 50;
        if (31104E7 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step = 10;
        if (15552E7 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step =
            5;
        if (31104E6 > a)this.scale = links.Timeline.StepDate.SCALE.YEAR, this.step = 1;
        if (7776E6 > a)this.scale = links.Timeline.StepDate.SCALE.MONTH, this.step = 3;
        if (2592E6 > a)this.scale = links.Timeline.StepDate.SCALE.MONTH, this.step = 1;
        if (432E6 > a)this.scale = links.Timeline.StepDate.SCALE.DAY, this.step = 5;
        if (1728E5 > a)this.scale = links.Timeline.StepDate.SCALE.DAY, this.step = 2;
        if (864E5 > a)this.scale = links.Timeline.StepDate.SCALE.DAY, this.step = 1;
        if (432E5 > a)this.scale = links.Timeline.StepDate.SCALE.WEEKDAY, this.step = 1;
        if (144E5 >
            a)this.scale = links.Timeline.StepDate.SCALE.HOUR, this.step = 4;
        if (36E5 > a)this.scale = links.Timeline.StepDate.SCALE.HOUR, this.step = 1;
        if (9E5 > a)this.scale = links.Timeline.StepDate.SCALE.MINUTE, this.step = 15;
        if (6E5 > a)this.scale = links.Timeline.StepDate.SCALE.MINUTE, this.step = 10;
        if (3E5 > a)this.scale = links.Timeline.StepDate.SCALE.MINUTE, this.step = 5;
        if (6E4 > a)this.scale = links.Timeline.StepDate.SCALE.MINUTE, this.step = 1;
        if (15E3 > a)this.scale = links.Timeline.StepDate.SCALE.SECOND, this.step = 15;
        if (1E4 > a)this.scale = links.Timeline.StepDate.SCALE.SECOND,
            this.step = 10;
        if (5E3 > a)this.scale = links.Timeline.StepDate.SCALE.SECOND, this.step = 5;
        if (1E3 > a)this.scale = links.Timeline.StepDate.SCALE.SECOND, this.step = 1;
        if (200 > a)this.scale = links.Timeline.StepDate.SCALE.MILLISECOND, this.step = 200;
        if (100 > a)this.scale = links.Timeline.StepDate.SCALE.MILLISECOND, this.step = 100;
        if (50 > a)this.scale = links.Timeline.StepDate.SCALE.MILLISECOND, this.step = 50;
        if (10 > a)this.scale = links.Timeline.StepDate.SCALE.MILLISECOND, this.step = 10;
        if (5 > a)this.scale = links.Timeline.StepDate.SCALE.MILLISECOND,
            this.step = 5;
        if (1 > a)this.scale = links.Timeline.StepDate.SCALE.MILLISECOND, this.step = 1
    }
};
links.Timeline.StepDate.prototype.snap = function (a) {
    if (this.scale == links.Timeline.StepDate.SCALE.YEAR) {
        var b = a.getFullYear() + Math.round(a.getMonth() / 12);
        a.setFullYear(Math.round(b / this.step) * this.step);
        a.setMonth(0);
        a.setDate(0);
        a.setHours(0);
        a.setMinutes(0);
        a.setSeconds(0);
        a.setMilliseconds(0)
    } else if (this.scale == links.Timeline.StepDate.SCALE.MONTH)a.getDate() > 15 ? (a.setDate(1), a.setMonth(a.getMonth() + 1)) : a.setDate(1), a.setHours(0), a.setMinutes(0), a.setSeconds(0), a.setMilliseconds(0); else if (this.scale ==
        links.Timeline.StepDate.SCALE.DAY || this.scale == links.Timeline.StepDate.SCALE.WEEKDAY) {
        switch (this.step) {
            case 5:
            case 2:
                a.setHours(Math.round(a.getHours() / 24) * 24);
                break;
            default:
                a.setHours(Math.round(a.getHours() / 12) * 12)
        }
        a.setMinutes(0);
        a.setSeconds(0);
        a.setMilliseconds(0)
    } else if (this.scale == links.Timeline.StepDate.SCALE.HOUR) {
        switch (this.step) {
            case 4:
                a.setMinutes(Math.round(a.getMinutes() / 60) * 60);
                break;
            default:
                a.setMinutes(Math.round(a.getMinutes() / 30) * 30)
        }
        a.setSeconds(0);
        a.setMilliseconds(0)
    } else if (this.scale ==
        links.Timeline.StepDate.SCALE.MINUTE) {
        switch (this.step) {
            case 15:
            case 10:
                a.setMinutes(Math.round(a.getMinutes() / 5) * 5);
                a.setSeconds(0);
                break;
            case 5:
                a.setSeconds(Math.round(a.getSeconds() / 60) * 60);
                break;
            default:
                a.setSeconds(Math.round(a.getSeconds() / 30) * 30)
        }
        a.setMilliseconds(0)
    } else if (this.scale == links.Timeline.StepDate.SCALE.SECOND)switch (this.step) {
        case 15:
        case 10:
            a.setSeconds(Math.round(a.getSeconds() / 5) * 5);
            a.setMilliseconds(0);
            break;
        case 5:
            a.setMilliseconds(Math.round(a.getMilliseconds() / 1E3) * 1E3);
            break;
        default:
            a.setMilliseconds(Math.round(a.getMilliseconds() / 500) * 500)
    } else this.scale == links.Timeline.StepDate.SCALE.MILLISECOND && (b = this.step > 5 ? this.step / 2 : 1, a.setMilliseconds(Math.round(a.getMilliseconds() / b) * b))
};
links.Timeline.StepDate.prototype.isMajor = function () {
    switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            return this.current.getMilliseconds() == 0;
        case links.Timeline.StepDate.SCALE.SECOND:
            return this.current.getSeconds() == 0;
        case links.Timeline.StepDate.SCALE.MINUTE:
            return this.current.getHours() == 0 && this.current.getMinutes() == 0;
        case links.Timeline.StepDate.SCALE.HOUR:
            return this.current.getHours() == 0;
        case links.Timeline.StepDate.SCALE.WEEKDAY:
        case links.Timeline.StepDate.SCALE.DAY:
            return this.current.getDate() ==
                1;
        case links.Timeline.StepDate.SCALE.MONTH:
            return this.current.getMonth() == 0;
        case links.Timeline.StepDate.SCALE.YEAR:
            return!1;
        default:
            return!1
    }
};
links.Timeline.StepDate.prototype.getLabelMinor = function (a, b) {
    if (b == void 0)b = this.current;
    switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            return String(b.getMilliseconds());
        case links.Timeline.StepDate.SCALE.SECOND:
            return String(b.getSeconds());
        case links.Timeline.StepDate.SCALE.MINUTE:
            return this.addZeros(b.getHours(), 2) + ":" + this.addZeros(b.getMinutes(), 2);
        case links.Timeline.StepDate.SCALE.HOUR:
            return this.addZeros(b.getHours(), 2) + ":" + this.addZeros(b.getMinutes(), 2);
        case links.Timeline.StepDate.SCALE.WEEKDAY:
            return a.DAYS_SHORT[b.getDay()] +
                " " + b.getDate();
        case links.Timeline.StepDate.SCALE.DAY:
            return String(b.getDate());
        case links.Timeline.StepDate.SCALE.MONTH:
            return a.MONTHS_SHORT[b.getMonth()];
        case links.Timeline.StepDate.SCALE.YEAR:
            return String(b.getFullYear());
        default:
            return""
    }
};
links.Timeline.StepDate.prototype.getLabelMajor = function (a, b) {
    if (b == void 0)b = this.current;
    switch (this.scale) {
        case links.Timeline.StepDate.SCALE.MILLISECOND:
            return this.addZeros(b.getHours(), 2) + ":" + this.addZeros(b.getMinutes(), 2) + ":" + this.addZeros(b.getSeconds(), 2);
        case links.Timeline.StepDate.SCALE.SECOND:
            return b.getDate() + " " + a.MONTHS[b.getMonth()] + " " + this.addZeros(b.getHours(), 2) + ":" + this.addZeros(b.getMinutes(), 2);
        case links.Timeline.StepDate.SCALE.MINUTE:
            return a.DAYS[b.getDay()] + " " + b.getDate() +
                " " + a.MONTHS[b.getMonth()] + " " + b.getFullYear();
        case links.Timeline.StepDate.SCALE.HOUR:
            return a.DAYS[b.getDay()] + " " + b.getDate() + " " + a.MONTHS[b.getMonth()] + " " + b.getFullYear();
        case links.Timeline.StepDate.SCALE.WEEKDAY:
        case links.Timeline.StepDate.SCALE.DAY:
            return a.MONTHS[b.getMonth()] + " " + b.getFullYear();
        case links.Timeline.StepDate.SCALE.MONTH:
            return String(b.getFullYear());
        default:
            return""
    }
};
links.Timeline.StepDate.prototype.addZeros = function (a, b) {
    for (var c = "" + a; c.length < b;)c = "0" + c;
    return c
};
links.imageloader = function () {
    function a(a) {
        if (e[a] == !0)return!0;
        var b = new Image;
        b.src = a;
        return b.complete ? !0 : !1
    }

    function b(a) {
        return f[a] != void 0
    }

    function c(c, d, i) {
        i == void 0 && (i = !0);
        if (a(c))i && d(c); else if (!b(c) || i) {
            var k = f[c];
            if (!k)i = new Image, i.src = c, k = [], f[c] = k, i.onload = function () {
                e[c] = !0;
                delete f[c];
                for (var a = 0; a < k.length; a++)k[a](c)
            };
            k.indexOf(d) == -1 && k.push(d)
        }
    }

    function d(a, b) {
        for (var c = a.firstChild; c;) {
            if (c.tagName == "IMG") {
                var e = c.src;
                b.indexOf(e) == -1 && b.push(e)
            }
            d(c, b);
            c = c.nextSibling
        }
    }

    var e =
    {}, f = {};
    return{isLoaded: a, isLoading: b, load: c, loadAll: function (b, d, e) {
        var f = [];
        b.forEach(function (b) {
            a(b) || f.push(b)
        });
        if (f.length) {
            var l = f.length;
            f.forEach(function (a) {
                c(a, function () {
                    l--;
                    l == 0 && d()
                }, e)
            })
        } else e && d()
    }, filterImageUrls: d}
}();
links.Timeline.addEventListener = function (a, b, c, d) {
    a.addEventListener ? (d === void 0 && (d = !1), b === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0 && (b = "DOMMouseScroll"), a.addEventListener(b, c, d)) : a.attachEvent("on" + b, c)
};
links.Timeline.removeEventListener = function (a, b, c, d) {
    a.removeEventListener ? (d === void 0 && (d = !1), b === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0 && (b = "DOMMouseScroll"), a.removeEventListener(b, c, d)) : a.detachEvent("on" + b, c)
};
links.Timeline.getTarget = function (a) {
    if (!a)a = window.event;
    var b;
    if (a.target)b = a.target; else if (a.srcElement)b = a.srcElement;
    if (b.nodeType != void 0 && b.nodeType == 3)b = b.parentNode;
    return b
};
links.Timeline.stopPropagation = function (a) {
    if (!a)a = window.event;
    a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
};
links.Timeline.preventDefault = function (a) {
    if (!a)a = window.event;
    a.preventDefault ? a.preventDefault() : a.returnValue = !1
};
links.Timeline.getAbsoluteLeft = function (a) {
    for (var b = document.documentElement, c = document.body, d = a.offsetLeft, a = a.offsetParent; a != null && a != c && a != b;)d += a.offsetLeft, d -= a.scrollLeft, a = a.offsetParent;
    return d
};
links.Timeline.getAbsoluteTop = function (a) {
    for (var b = document.documentElement, c = document.body, d = a.offsetTop, a = a.offsetParent; a != null && a != c && a != b;)d += a.offsetTop, d -= a.scrollTop, a = a.offsetParent;
    return d
};
links.Timeline.getPageY = function (a) {
    "targetTouches"in a && a.targetTouches.length && (a = a.targetTouches[0]);
    if ("pageY"in a)return a.pageY;
    var b = document.documentElement, c = document.body;
    return a.clientY + (b && b.scrollTop || c && c.scrollTop || 0) - (b && b.clientTop || c && c.clientTop || 0)
};
links.Timeline.getPageX = function (a) {
    "targetTouches"in a && a.targetTouches.length && (a = a.targetTouches[0]);
    if ("pageX"in a)return a.pageX;
    var b = document.documentElement, c = document.body;
    return a.clientX + (b && b.scrollLeft || c && c.scrollLeft || 0) - (b && b.clientLeft || c && c.clientLeft || 0)
};
links.Timeline.addClassName = function (a, b) {
    for (var c = a.className.split(" "), d = b.split(" "), e = !1, f = 0; f < d.length; f++)c.indexOf(d[f]) == -1 && (c.push(d[f]), e = !0);
    if (e)a.className = c.join(" ")
};
links.Timeline.removeClassName = function (a, b) {
    for (var c = a.className.split(" "), d = b.split(" "), e = !1, f = 0; f < d.length; f++) {
        var g = c.indexOf(d[f]);
        g != -1 && (c.splice(g, 1), e = !0)
    }
    if (e)a.className = c.join(" ")
};
links.Timeline.isArray = function (a) {
    return a instanceof Array ? !0 : Object.prototype.toString.call(a) === "[object Array]"
};
links.Timeline.clone = function (a) {
    var b = {}, c;
    for (c in a)a.hasOwnProperty(c) && (b[c] = a[c]);
    return b
};
links.Timeline.parseJSONDate = function (a) {
    if (a != void 0) {
        if (a instanceof Date)return a;
        var b = a.match(/\/Date\((-?\d+)([-\+]?\d{2})?(\d{2})?\)\//i);
        return b ? (a = b[2] ? 36E5 * b[2] + 6E4 * b[3] * (b[2] / Math.abs(b[2])) : 0, new Date(1 * b[1] + a)) : Date.parse(a)
    }
};
