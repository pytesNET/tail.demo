/*
 |  tail.DateTime - A pure, vanilla JavaScript DateTime Picker
 |  @author        SamBrishes <https://github.com/pytesNET/tail.DateTime/>
 |                 MrGuiseppe <https://github.com/MrGuiseppe/pureJSCalendar/>
 |  @version       0.3.4 [0.1.0] - Alpha
 |
 |  @license       X11 / MIT License
 |  @copyright     Copyright © 2018 - SamBrishes, pytesNET <pytes@gmx.net>
 |                 Copyright © 2018 - MrGuiseppe <https://github.com/MrGuiseppe>
 */
;(function(window){
    "use strict";
    var w = window, d = window.document;

    /*
     |  HELPER METHODs
     */
    var tail = {
        hasClass: function(element, name){
            return (new RegExp("(|\s+)" + name + "(\s+|)")).test(element.className);
        },
        addClass: function(element, name){
            if(!(new RegExp("(|\s+)" + name + "(\s+|)")).test(element.className)){
                element.className = (element.className.trim() + " " + name.trim()).trim();
            }
            return element;
        },
        removeClass: function(element, name){
            var regex = new RegExp("(|\s+)(" + name + ")(\s+|)");
            if(regex.test(element.className)){
                element.className = (element.className.replace(regex, "$1$3")).trim();
            }
            return element;
        },
        trigger: function(element, event, options){
            if(CustomEvent && CustomEvent.name){
                var e = new CustomEvent(event, options);
                return element.dispatchEvent(e);
            }
            var e = d.createEvent("CustomEvent");
            e.initCustomEvent(event, ((options.bubbles)? true: false), ((options.cancelable)? true: false), options.detail);
            return element.dispatchEvent(e);
        },
        clone: function(object, replace){
            replace = (typeof(replace) == "object")? replace: {};
            var clone = object.constructor();
            for(var key in object){
                if(replace.hasOwnProperty(key)){
                    clone[key] = replace[key];
                } else if(object.hasOwnProperty(key)){
                    clone[key] = object[key];
                }
            }
            return clone;
        }
    };
    tail.IE = (w.navigator.userAgent.indexOf("MSIE") > -1 || w.navigator.userAgent.indexOf("Edge") > -1);

    /*
     |  CONSTRUCTOR
     |  @since  0.1.0
     |  @update 0.3.4
     */
    var tailDateTime = function(element, config){
        if(typeof(element) == "string"){
            element = d.querySelectorAll(element);
        }
        if(element instanceof NodeList || element instanceof HTMLCollection){
            if(element.length == 0){
                return false;
            }
            var _return = new Array();
            for(var i = 0; i < element.length; i++){
                _return.push(new tailDateTime(element[i], config));
            }
            return (_return.length == 1)? _return[0]: _return;
        }
        if(typeof(this) == "undefined"){
            return new tailDateTime(element, config);
        }

        // Check Element
        if(!(element instanceof Element)){
            return false;
        }
        if(element.hasAttribute("data-tail-calendar") && tailDateTime.instances[element.getAttribute("data-tail-calendar")]){
            return tailDateTime.instances[element.getAttribute("data-tail-calendar")];
        }

        // Vaildate DateRange
        if(config.dateRanges && config.dateRanges.length > 0){
            for(var t, i = 0; i < config.dateRanges.length; i++){
                t = config.dateRanges[i];

                // Week-Day
                if(typeof(t[0]) == "string" && __("shorts").indexOf(t[0]) >= 0){
                    t[0] = __("shorts").indexOf(t[0]);
                    t[1] = (t.length >= 2 && __("shorts").indexOf(t[1]) >= 0)? __("shorts").indexOf(t[1]): 6;
                    continue;
                }

                // Date Object
                if(typeof(t[0]) == "string"){
                    t[0] = new Date(Date.parse(t[0]));
                    if(t.length == 2 && typeof(t[1]) == "string"){
                        t[1] = new Date(Date.parse(t[1]));
                    } else if(t.length == 1){
                        t[1] = new Date(t[0].getFullYear(), t[0].getMonth(), 0);
                    }
                }
                if(!(t[0] instanceof Date && !isNaN(t[0].getDate()))){
                    t[0] = new Date();
                }
                if(t.length < 2 || !(t[1] instanceof Date && !isNaN(t[1].getDate()))){
                    t[1] = new Date(t[0].getFullYear(), t[0].getMonth(), 0);
                }
            }
        }

        // Init Prototype Instance
        this.e = element;
        config = (typeof(config) == "object")? config: {};
        if(Object.assign){
            this.con = Object.assign({}, tailDateTime.defaults, config);
        } else {
            this.con = tail.clone(tailDateTime.defaults, config);
        }
        return this.init();
    };
    tailDateTime.version = "0.3.4";
    tailDateTime.status = "alpha";
    tailDateTime.count = 0;
    tailDateTime.isIE11 = !!w.MSInputMethodContext && !!d.documentMode;
    tailDateTime.cache = {};
    tailDateTime.instances = {};

    /*
     |  STORAGE :: DEFAULT OPTIONS
     */
    tailDateTime.defaults = {
        static: null,
        position: "bottom",
        classNames: "",
        dateFormat: "YYYY-mm-dd",
        timeFormat: "HH:ii:ss",
        dateRanges: [],
        weekStart: "SUN",
        startOpen: false,
        stayOpen: false,
        zeroSeconds: false
    };

    /*
     |  STORAGE :: STRINGS
     */
    tailDateTime.strings = {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days:   ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shorts: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        time:   ["Hours", "Minutes", "Seconds"],
        header: ["Select a Month", "Select a Year", "Select a Time"],
    };
    var __ = function(string, number){
        if(string in w.tail.DateTime.strings){
            if(number !== undefined){
                return w.tail.DateTime.strings[string][number];
            }
            return w.tail.DateTime.strings[string];
        }
        return false;
    }

    /*
     |  METHODS
     */
    tailDateTime.prototype = {
        e: null,                // The Input Element
        dt: null,               // The DateTime Picker
        con: {},                // The Configuration Object
        view: {},               // The current DateTime View
        select: null,           // The current selected Date (Object)

        /*
         |  HANDLE :: INIT CALENDAR
         |  @since  0.1.0
         |  @update 0.3.3
         */
        init: function(){
            if(this.dt){
                return this.dt;
            }
            var _static = d.querySelector(this.con.static);

            // Create DateTime Picker
            this.dt = d.createElement("DIV");
            this.dt.id = "data-tail-calendar-" + ++tailDateTime.count;
            this.dt.className = "tail-datetime-calendar calendar-close" + ((_static)? " calendar-static": "");
            if(this.con.stayOpen){
                this.dt.className += " calendar-stay";
            }
            if(this.con.classNames){
                this.dt.className += " " + ((this.con.classNames instanceof Array)? this.con.classNames.join(" "): this.con.classNames);
            }

            // Create Calendar Structure
            if(this.con.dateFormat){
                this.dt.innerHTML = '' +
                    '<div class="calendar-navi">' +
                    '    <span data-tail-navi="prev" class="calendar-button button-prev"></span>' +
                    '    <span data-tail-navi="switch" class="calendar-label"></span>' +
                    '    <span data-tail-navi="next" class="calendar-button button-next"></span>' +
                    '</div>' +
                    '<div class="calendar-date"></div>' +
                    ((this.con.timeFormat)? '<div class="calendar-time">' + this.renderTime() + '</div>': '');
            } else {
                this.dt.innerHTML = '' +
                    '<div class="calendar-navi">' +
                    '    <span data-tail-navi="check" class="calendar-button button-check"></span>' +
                    '    <span data-tail-navi="switch" class="calendar-label">' + __("header", 2) + '</span>' +
                    '    <span data-tail-navi="close" class="calendar-button button-close"></span>' +
                    '</div>' +
                    ((this.con.timeFormat)? '<div class="calendar-time">' + this.renderTime() + '</div>': '');
            }

            // Set Calendar Data
            var select = new Date(Date.parse(this.e.getAttribute("data-tail-value") || this.e.value));
            this.view = {
                type: "date",
                date: new Date(),
                content: "",
                render: function(){ return this.content.querySelector("tbody").innerHTML; }
            };
            if(!isNaN(select.getDate())){
                this.select = select;
                if(this.con.zeroSeconds){
                    this.select.setSeconds(0);
                }
                this.view.date = new Date(this.select.getTime());
            }
            if(this.con.timeFormat){
                this.dt.querySelector(".calendar-field-h > input").value = this.view.date.getHours();
                this.dt.querySelector(".calendar-field-m > input").value = this.view.date.getMinutes();
                this.dt.querySelector(".calendar-field-s > input").value = this.view.date.getSeconds();
            }

            this.switchMonth(this.view.date.getMonth(), this.view.date.getFullYear());
            if(this.e.hasAttribute("data-tail-value")){
                this.selectDate();
            } else {
                this.e.setAttribute("data-tail-value", this.convertDate(this.view.date, "YYYY-mm-dd HH:ii:ss"));
            }

            // Configure Calendar Widget
            this.dt.style.top = 0;
            this.dt.style.left = 0;
            this.dt.style.zIndex = 99;
            this.dt.style.position = (_static)? "static": "absolute";
            this.dt.style.visibility = (_static)? "visible": "hidden";
            if(_static){
                _static.appendChild(this.dt);
            } else {
                d.getElementsByTagName("body")[0].appendChild(this.dt);
            }

            // Listen Header
            var self = this, navi = this.dt.querySelectorAll("[data-tail-navi]");
            if(navi.length > 0){
                for(var i = 0; i < navi.length; i++){
                    navi[i].addEventListener("click", function(event){
                        var action = this.getAttribute("data-tail-navi");

                        if(self.con.dateFormat){
                            if(self.view.type == "month"){
                                if(action == "prev" || action == "next"){
                                    self.switchYear.call(self, action);
                                } else {
                                    self.switchView.call(self, "day");
                                }
                            } else {
                                if(action == "prev" || action == "next"){
                                    self.switchMonth.call(self, action);
                                } else {
                                    self.switchView.call(self, "month");
                                }
                            }
                        } else if(self.con.timeFormat){
                            if(action == "check"){
                                self.selectTime.call(self,
                                    parseInt(self.dt.querySelector(".calendar-field-h > input").value),
                                    parseInt(self.dt.querySelector(".calendar-field-m > input").value),
                                    parseInt(self.dt.querySelector(".calendar-field-s > input").value)
                                );
                            }
                            if(!self.con.stayOpen){
                                self.close.call(self);
                            }
                        }
                    });
                }
            }

            // Listen Input
            this.e.addEventListener("focusin", function(event){
                self.open.call(self);
            });
            this.e.addEventListener("focusout", function(event){
                var select = new Date(Date.parse(this.value));
                if(!isNaN(select.getDate())){
                    self.selectDate.call(self,
                        select.getFullYear(), select.getMonth(), select.getDate(),
                        select.getHours(), select.getMinutes(), select.getSeconds()
                    );
                    self.switchMonth.call(self, select.getMonth(), select.getFullYear());
                }
            });
            this.e.addEventListener("keyup", function(event){
                if(event.keyCode == 13){
                    var select = new Date(Date.parse(this.value));
                    if(!isNaN(select.getDate())){
                        self.selectDate.call(self,
                            select.getFullYear(), select.getMonth(), select.getDate(),
                            select.getHours(), select.getMinutes(), select.getSeconds()
                        );
                        self.switchMonth.call(self, select.getMonth(), select.getFullYear());
                    }
                    event.stopPropagation();
                }
            });
            d.addEventListener("keyup", function(event){
                if(tail.hasClass(self.dt, "calendar-open") && event.keyCode == 27){
                    if(!self.con.stayOpen){
                        self.close.call(self);
                    }
                    self.e.blur();
                }
                if(tail.hasClass(self.dt, "calendar-open") && event.keyCode == 13){
                    if(self.con.dateFormat){
                        var day = self.dt.children[1].querySelector("td.today") || self.dt.children[1].querySelector("td:not(.empty)"),
                            time = !!self.con.timeFormat;
                        if(!tail.hasClass(day, "disabled")){
                            self.selectDate.call(self,
                                self.view.year, self.view.month, parseInt(day.value),
                                (time)? parseInt(self.dt.querySelector(".calendar-field-h > input").value): 0,
                                (time)? parseInt(self.dt.querySelector(".calendar-field-m > input").value): 0,
                                (time)? parseInt(self.dt.querySelector(".calendar-field-s > input").value): 0
                            );
                        }
                    } else {
                        self.selectTime.call(self,
                            parseInt(self.dt.querySelector(".calendar-field-h > input").value),
                            parseInt(self.dt.querySelector(".calendar-field-m > input").value),
                            parseInt(self.dt.querySelector(".calendar-field-s > input").value)
                        );
                    }
                    if(!self.con.stayOpen){
                        self.close.call(self);
                    }
                    self.e.blur();
                }
            });
            d.addEventListener("click", function(event){
                if(!tail.hasClass(self.dt, "calendar-open")){
                    return;
                }
                if(!self.dt.contains(event.target) && !self.e.contains(event.target)){
                    if(event.target != self.dt && event.target != self.e){
                        if(!self.con.stayOpen){
                            self.close.call(self);
                        }
                    }
                }
            });

            // Store Instance and Return
            this.e.setAttribute("data-tail-calendar", "tail-" + tailDateTime.count);
            if(this.con.startOpen){
                this.open();
            }
            tailDateTime.instances["tail-" + tailDateTime.count] = this;
            return this;
        },

        /*
         |  HANDLE :: CALCULATE POSITION
         |  @since  0.3.1
         */
        calcPosition: function(){
            if(tail.hasClass(this.dt, "calendar-static")){
                return this;
            }
            var style = w.getComputedStyle(this.dt),
                marginX = parseInt(style.marginLeft)+parseInt(style.marginRight),
                marginY = parseInt(style.marginTop)+parseInt(style.marginBottom),
                position = (function(element){
                var position = {
                    top:    element.offsetTop    || 0,
                    left:   element.offsetLeft   || 0,
                    width:  element.offsetWidth  || 0,
                    height: element.offsetHeight || 0
                };
                while(element = element.offsetParent){
                    position.top  += element.offsetTop;
                    position.left += element.offsetLeft;
                }
                return position;
            })(this.e);

            // Set Position
            this.dt.style.visibility = "hidden";
            switch(this.con.position){
                case "top":
                    this.dt.style.top = position.top - (this.dt.offsetHeight + marginY) + "px";
                    this.dt.style.left = (position.left + (position.width / 2)) - (this.dt.offsetWidth / 2 + marginX / 2) + "px";
                    break;
                case "left":
                    this.dt.style.top = (position.top + position.height/2) - (this.dt.offsetHeight / 2 + marginY) + "px";
                    this.dt.style.left = position.left - (this.dt.offsetWidth + marginX) + "px";
                    break;
                case "right":
                    this.dt.style.top = (position.top + position.height/2) - (this.dt.offsetHeight / 2 + marginY) + "px";
                    this.dt.style.left = position.left + position.width + "px";
                    break;
                default:
                    this.dt.style.top = position.top + position.height + "px";
                    this.dt.style.left = (position.left + (position.width / 2)) - (this.dt.offsetWidth / 2 + marginX / 2) + "px";
                    break;
            }
            this.dt.style.visibility = "visible";
            return this;
        },

        /*
         |  HANDLE :: SWITCH VIEW
         |  @since  0.1.0
         |  @update 0.3.3
         */
        switchView: function(view){
            if(!this.con.dateFormat){
                return false;
            }

            // Render View
            this.view.type = view;
            if(view == "month"){
                this.dt.children[1].innerHTML = "";
                this.dt.children[1].insertAdjacentHTML("afterbegin", this.renderMonth());
                this.dt.querySelector(".calendar-label").innerText = this.view.date.getFullYear();
            } else {
                this.dt.children[1].innerHTML = this.renderDay();
                this.dt.querySelector(".calendar-label").innerText = __("months", this.view.date.getMonth()) + " " + this.view.date.getFullYear();

                // Disable on Ranges
                var ranges = this.con.dateRanges, current = this.view.date,
                    fields = this.dt.querySelectorAll("tbody td:not(.empty)"),
                    compare = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 0, 0, 0);
                if(ranges.length > 0){
                    for(var enable = [], i = 0; i < ranges.length; i++){
                        if(ranges[i][0] instanceof Date){
                            if(current.getYear() >= ranges[i][0].getYear() && current.getYear() <= ranges[i][1].getYear()){
                                if(current.getMonth() >= ranges[i][0].getMonth() && current.getMonth() <= ranges[i][1].getMonth()){
                                    for(var f = 0; f < fields.length; f++){
                                        compare.setDate(parseInt(fields[f].innerText));
                                        if(compare >= ranges[i][0] && compare <= ranges[i][1]){
                                            enable.push(fields[f].innerText);
                                        }
                                    }
                                }
                            }
                        } else {
                            for(var f = 0; f < fields.length; f++){
                                compare.setDate(parseInt(fields[f].innerText));
                                if(ranges[i].length == 3 && ranges[i][3] == true){
                                    if(compare.getDay() >= ranges[i][0] && compare.getDay() <= ranges[i][1]){
                                        if(enable.indexOf(fields[f].innerText) == -1){
                                            enable.push(fields[f].innerText);
                                        }
                                    }
                                }
                                if(compare.getDay() < ranges[i][0] || compare.getDay() > ranges[i][1]){
                                    if(enable.indexOf(fields[f].innerText) >= 0){
                                        enable.splice(enable.indexOf(fields[f].innerText), 1);
                                    }
                                }
                            }
                        }
                    }
                    for(var f = 0; f < fields.length; f++){
                        if(enable.indexOf(fields[f].innerText) == -1){
                            tail.addClass(fields[f], "disable");
                        }
                    }
                }

                // Select Current
                if(this.select instanceof Date && this.select.getYear() == this.view.date.getYear() && this.select.getMonth() == this.view.date.getMonth()){
                    tail.addClass(this.dt.querySelectorAll("tbody td:not(.empty)")[this.select.getDate()-1], "current");
                } else {
                    if(this.dt.querySelector("tbody td.current")){
                        tail.removeClass(this.dt.querySelector("tbody td.current"), "current");
                    }
                }
            }

            // Handle View
            var self = this;
            if(this.con.dateFormat){
                var listen = this.dt.querySelectorAll("tbody td:not(.empty)");
                for(var i = 0; i < listen.length; i++){
                    listen[i].addEventListener("click", function(event){
                        event.preventDefault();
                        event.stopPropagation();

                        if(tail.hasClass(this, "disable")){
                            return false;
                        }
                        var time = !!self.con.timeFormat;

                        if(self.view.type == "month"){
                            self.switchMonth.call(self, parseInt(this.getAttribute("data-tail-month")), self.view.date.getFullYear());
                        } else {
                            self.selectDate.call(self,
                                self.view.date.getFullYear(), self.view.date.getMonth(), parseInt(this.innerText),
                                (time)? parseInt(self.dt.querySelector(".calendar-field-h > input").value): 0,
                                (time)? parseInt(self.dt.querySelector(".calendar-field-m > input").value): 0,
                                (time)? parseInt(self.dt.querySelector(".calendar-field-s > input").value): 0
                            );
                            if(!self.con.stayOpen){
                                self.close.call(self);
                            }
                        }
                    });
                }
            }
        },

        /*
         |  RENDER :: DAY VIEW
         |  @since  0.1.0
         |  @update 0.3.3
         */
        renderDay: function(){
            var start = __("shorts").indexOf(this.con.weekStart),
                week  = __("shorts").slice(start);
                week  = week.concat(__("shorts").slice(0, start));

            var content = '<table class="calendar-day"><thead><tr>';
            for(var i = 0; i < 7; i++){
                content += '<th data-tail-day="' + __("shorts").indexOf(week[i]) + '">' + week[i] + '</th>';
            }
            content += "</tr></thead><tbody>";
            content += this.createCalendar(this.view.date.getMonth(), this.view.date.getFullYear()).render();
            content += "</tbody></table>";
            return content;
        },

        /*
         |  RENDER :: MONTH VIEW
         |  @since  0.1.0
         |  @update 0.3.3
         */
        renderMonth: function(){
            var strings = __("months");
            var content = '<table class="calendar-month"><thead><tr><th colspan="4">' + __("header", 0) + '</th></tr></thead><tbody>';
            for(var i = 0; i < 12; i++){
                content += '<tr>';
                content += '<td class="calendar-month" data-tail-month="0"><span>' + strings[i++] + '</span></td>';
                content += '<td class="calendar-month" data-tail-month="1"><span>' + strings[i++] + '</span></td>';
                content += '<td class="calendar-month" data-tail-month="2"><span>' + strings[i] + '</span></td>';
                content += '</tr>';
            }
            content += "</tbody></table>";
            return content;
        },

        /*
         |  RENDER :: TIME VIEW
         |  @since  0.1.0
         |  @update 0.3.3
         */
        renderTime: function(){
            return '' +
                '<div class="calendar-field calendar-field-h">' +
                '    <input type="number" value="' + new Date().getHours() + '" min="00" max="23" step="1" />' +
                '    <label>' + __("time", 0) + '</label>' +
                '</div>' +
                '<div class="calendar-field calendar-field-m">' +
                '    <input type="number" value="' + new Date().getMinutes() + '" min="00" max="59" step="1" />' +
                '    <label>' + __("time", 1) + '</label>' +
                '</div>' +
                '<div class="calendar-field calendar-field-s">' +
                '    <input type="number" value="' + new Date().getSeconds() + '" min="00" max="59" step="1" />' +
                '    <label>' + __("time", 2) + '</label>' +
                '</div>';
        },

        /*
         |  ACTION :: ADD EVENT LISTENER
         |  @since  0.3.0
         */
        on: function(event, func){
            this.dt.addEventListener(event, func);
        },

        /*
         |  ACTION :: OPEN CALENDAR
         |  @since  0.1.0
         |  @update 0.3.4
         */
        open: function(){
            if(!tail.hasClass(this.dt, "calendar-close")){
                return this;
            }
            tail.removeClass(this.dt, "calendar-close");
            tail.addClass(this.dt, "calendar-idle");

            this.dt.style.opacity = 0;
            this.dt.style.display = "block";
            this.calcPosition();
            (function(self){
                self.animate = setInterval(function(){
                    self.dt.style.opacity = parseFloat(self.dt.style.opacity) + 0.1;
                    if(parseFloat(self.dt.style.opacity) >= 1){
                        tail.removeClass(self.dt, "calendar-idle");
                        tail.addClass(self.dt, "calendar-open");
                        tail.trigger(self.dt, "tail.DateTime::open", {
                            bubbles: false,
                            cancelable: true,
                            detail: self
                        });
                        clearInterval(self.animate);
                    }
                }, 10);
            })(this);
            return this;
        },

        /*
         |  ACTION :: CLOSE CALENDAR
         |  @since  0.1.0
         |  @update 0.3.4
         */
        close: function(){
            if(!tail.hasClass(this.dt, "calendar-open")){
                return this;
            }
            tail.removeClass(this.dt, "calendar-open");
            tail.addClass(this.dt, "calendar-idle");
            (function(self){
                self.animate = setInterval(function(){
                    self.dt.style.opacity = parseFloat(self.dt.style.opacity) - 0.1;
                    if(parseFloat(self.dt.style.opacity) <= 0){
                        tail.removeClass(self.dt, "calendar-idle");
                        tail.addClass(self.dt, "calendar-close");
                        tail.trigger(self.dt, "tail.DateTime::close", {
                            bubbles: false,
                            cancelable: true,
                            detail: self
                        });
                        self.dt.style.display = "none";
                        clearInterval(self.animate);
                    }
                }, 10);
            })(this);
            return this;
        },

        /*
         |  ACTION :: CLOSE CALENDAR
         |  @since  0.1.0
         |  @update 0.3.0
         */
        toggle: function(){
            if(tail.hasClass(this.dt, "calendar-open")){
                return this.close();
            } else if(tail.hasClass(this.dt, "calendar-close")){
                return this.open();
            }
            return this;
        },

        /*
         |  ACTION :: REMOVE CALENDAR
         |  @since  0.3.0
         */
        remove: function(){
            this.e.removeAttribute("data-tail-calendar");
            this.e.removeAttribute("data-tail-value");
            this.dt.parentElement.removeChild(this.dt);
            return null;
        },

        /*
         |  ACTION :: REMOVE CALENDAR
         |  @since  0.3.3
         */
        reload: function(){
            this.remove();
            return new tailDateTime(this.e, this.con);
        },

        /*
         |  ACTION :: SWITCH MONTH
         |  @since  0.1.0
         |  @update 0.1.2
         */
        switchMonth: function(month, year){
            if(month == "prev"){
                this.view.date.setMonth(this.view.date.getMonth()-1)
            } else if(month == "next"){
                this.view.date.setMonth(this.view.date.getMonth()+1);
            } else {
                this.view.date.setMonth(month);
                this.view.date.setFullYear(year);
            }
            this.switchView("day");
            return this;
        },

        /*
         |  ACTION :: SWITCH YEAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        switchYear: function(year){
            if(year == "prev"){
                this.view.date.setFullYear(this.view.date.getFullYear()-1);
            } else if(year == "next"){
                this.view.date.setFullYear(this.view.date.getFullYear()+1);
            } else {
                this.view.date.setFullYear(year);
            }
            this.switchView("month");
            return this;
        },

        /*
         |  ACTION :: SELECT A DATE
         |  @since  0.1.0
         |  @update 0.3.0
         */
        selectDate: function(Y, M, D, h, i, s){
            var n = new Date();

            // Format
            var f = [
                (this.con.dateFormat)? this.con.dateFormat: "",
                (this.con.timeFormat)? this.con.timeFormat: "",
            ].join(" ").trim();

            // Date
            this.select = new Date(
                ((Y)? Y: ((Y == undefined)? this.view.date.getFullYear(): n.getFullYear())),
                ((M)? M: ((M == undefined)? this.view.date.getMonth(): n.getMonth())),
                ((D)? D: ((D == undefined)? this.view.date.getDate(): n.getDate())),
                ((h)? h: ((h == undefined)? this.view.date.getHours(): 0)),
                ((i)? i: ((i == undefined)? this.view.date.getMinutes(): 0)),
                ((s)? s: ((s == undefined)? this.view.date.getSeconds(): 0))
            );

            // Trigger
            tail.trigger(this.dt, "tail.DateTime::select", {
                bubbles: false,
                cancelable: true,
                detail: self
            });

            // Value
            this.e.value = this.convertDate(this.select, f);
            this.e.setAttribute("data-tail-value", this.convertDate(this.select, "YYYY-mm-dd HH:ii:ss"));
            return this.switchView(this.view.type);
        },
        selectTime: function(h, i, s){
            return this.selectDate(false, false, false, h, i, s);
        },

        /*
         |  ACTION :: SELECT CALENDAR
         |  @since  0.1.0
         |  @update 0.3.4
         */
        createCalendar: function(month, year){
            var day = 1, haveDays = true,
                startDay = new Date(year, month, day).getDay(),
                daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                calendar = [];

            // Calc start Day
            startDay = startDay-__("shorts").indexOf(this.con.weekStart);
            if(startDay < 0){
                startDay = 7 + startDay;
            }

            // Cache
            if(tailDateTime.cache[this.con.weekStart + "_" + year] && !tailDateTime.isIE11){
                if(tailDateTime.cache[this.con.weekStart + "_" + year][month]){
                    return tailDateTime.cache[this.con.weekStart + "_" + year][month];
                }
            } else {
                tailDateTime.cache[this.con.weekStart + "_" + year] = {};
            }

            // Calculate
            var i = 0;
            while(haveDays){
                calendar[i] = [];
                for(var j = 0; j < 7; j++){
                    if(i === 0){
                        if(j === startDay){
                            calendar[i][j] = '<span>' + day++ + '</span>';
                            startDay++;
                        }
                    } else if(day <= daysInMonths[month]){
                        calendar[i][j] = '<span>' + day++ + '</span>';
                    } else {
                        calendar[i][j] = "";
                        haveDays = false;
                    }
                    if(day > daysInMonths[month]){
                        haveDays = false;
                    }
                }
                i++;
            }

            // Render
            for(var i = 0; i < calendar.length; i++){
                calendar[i] = '<tr>\n<td class="calendar-day">' + calendar[i].join('</td>\n<td class="calendar-day">') + '</td>\n</tr>';
            }
            if(tail.IE){
                var inner = "<table><tbdy>" + calendar.join("") + "</tbody></table>";
                var render = d.createElement("div");
                    render.innerHTML = inner;
                    render = render.getElementsByTagName("table")[0];
            } else {
                var render = d.createElement("table");
                    render.className = "calendar-current";
                    render.innerHTML = calendar.join("");
            }

            // Empty Fields
            var empty = render.querySelectorAll("td:empty");
            for(var i = 0; i < empty.length; ++i){
                empty[i].className += " empty";
            }

            // Today Field
            if(month == new Date().getMonth() && year == new Date().getFullYear()){
                var today = Array.prototype.slice.call(render.querySelectorAll("td"));
                today.forEach(function(current, index, array){
                    if(current.innerText === new Date().getDate().toString()){
                        current.className += " today";
                    }
                });
            }

            // Return
            this.view.date.setMonth(month);
            this.view.date.setFullYear(year);
            this.view = tail.clone(this.view, {content: render});
            tailDateTime.cache[this.con.weekStart + "_" + year][month] = this.view;
            return tailDateTime.cache[this.con.weekStart + "_" + year][month];
        },

        /*
         |  CONVERT DATE
         |  @since  0.1.0
         |  @update 0.3.3
         */
        convertDate: function(inDate, format){
            var dateObject = {
                H: String("00" + inDate.getHours()).toString().slice(-2),
                G: function(hours){
                    return (hours % 12)? hours % 12: 12;
                }(inDate.getHours()),
                A: inDate.getHours() >= 12? "PM": "AM",
                a: inDate.getHours() >= 12? "pm": "am",
                i: String("00" + inDate.getMinutes()).toString().slice(-2),
                s: String("00" + inDate.getSeconds()).toString().slice(-2),

                Y: inDate.getFullYear(),
                y: parseInt(inDate.getFullYear().toString().slice(2)),
                m: String("00" + (inDate.getMonth() + 1)).toString().slice(-2),
                M: __("months", [inDate.getMonth()]).slice(0, 3),
                F: __("months", [inDate.getMonth()]),
                d: String("00" + inDate.getDate()).toString().slice(-2),
                D: __("days", [inDate.getDay()]),
                l: __("shorts", [inDate.getDay()]).toLowerCase()
            };

            var regex = new RegExp("(H{1,2}|G{1,2}|i{1,2}|s{1,2}|Y{2,4}|y{2}|m{1,2}|d{1,2})", "g");
                format = format.replace(regex, function(token){
                    var datePart = dateObject[token.slice(-1)].toString(),
                        tokenlen = token.length, zeroPad

                    if(tokenlen == 4 || tokenlen == 2){
                        return datePart.slice(-Math.abs(tokenlen));
                    }
                    if(tokenlen == 1 && datePart[0] == "0"){
                        return datePart.slice(-1)
                    }
                    return datePart;
                });
                format = format.replace(/(A|a|M|F|D|l)/g, function(token){
                    return dateObject[token];
                });
            return format;
        }
    }

    // Assign to Window
    if(typeof(w.tail) == "undefined"){
        w.tail = {};
    }
    w.tail.DateTime = tailDateTime;
    return w.tail.DateTime
})(this);
