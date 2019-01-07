/*
 |  fur.demo    The default demonstration website for all tail projects @ pytesNET.
 |  @file       ./js/fur.demo.js
 |  @author     SamBrishes <sam@pytes.net>
 |  @version    3.0.0 - Beta
 |
 |  @website    https://github.com/pytesNET/fur.demo
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2016 - 2019 SamBrishes, pytesNET <info@pytes.net>
 */
;(function(factory){
    if(typeof(define) == "function" && define.amd){
        define(function(){ return factory(window); });
    } else {
        document.addEventListener("DOMContentLoaded", function(){
            factory(window);
        });
    }
}(function(){
	"use strict";
    var w = window, d = window.document;

    // Helper Methods
    function cHAS(e, name){
        return (new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)")).test((e.className || ""));
    }
    function cADD(e, name){
        if(!(new RegExp("\\b" + name + "\\b")).test(e.className || name)){
            e.className += " " + name;
        }
        return e;
    }
    function cREM(e, name, regex){
        if((regex = new RegExp("\\b(" + name + ")\\b")) && regex.test(e.className || "")){
            e.className = e.className.replace(regex, "");
        }
        return e;
    }
    function each(els, cb, end_cb){
        if(typeof cb !== "function"){
            return false;
        }
        if(els && els.length){
            for(var l = els.length, i = 0; i < l; i++){
                cb.call(els[i], (i+1), els[i]);
            }
        } else if(els instanceof HTMLElement || els instanceof Element){
            cb.call(els, 1, els);
        }
        (end_cb || function(){ }).call(els, els)
    }

	/*
	 |	TOOLTIP
	 */
    var tooltipID = 0,
        tooltip = function(event){
        event.preventDefault();
        if(event.type === "mouseenter"){
            if(!this.hasAttribute("data-tooltip-id")){
                var element = d.createElement("DIV");
                    element.id = "tooltip-" + ++tooltipID;
                    element.innerText = this.getAttribute("data-tooltip");
                    element.className = "tooltip";
                    element.style.opacity = 0;
                    element.style.display = "block";
                    d.body.appendChild(element);

                // Get Position
                var position = function(element){
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
                }(this);

                // Calculate Position
                element.style.top = (position.top + position.height) + "px";
                element.style.left = (position.left + (position.width / 2) - (element.offsetWidth / 2)) + "px";

                // Add to Element
                this.setAttribute("data-tooltip-id", "tooltip-" + tooltipID);
            }
            cADD(d.querySelector("#" + this.getAttribute("data-tooltip-id")), "active");
        } else if(event.type === "mouseleave"){
            if(this.hasAttribute("data-tooltip-id")){
                var element = d.querySelector("#" + this.getAttribute("data-tooltip-id"));
                cREM(element, "active");
                this.removeAttribute("data-tooltip-id");
                (function(e){
                    setTimeout(function(){ e.parentElement.removeChild(e); }, 150);
                })(element);
            }
        }
    };
    each(d.querySelectorAll("*[data-tooltip]"), function(){
        this.addEventListener("mouseenter", tooltip);
        this.addEventListener("mouseleave", tooltip);
    });

    /*
     |  TOGGLE SOURCE CODE
     */
    var source = function(event){
        var container = this.nextElementSibling;
        if(!cHAS(container, "active")){
            var coptainer = container.cloneNode(true);
                coptainer.style.height = "auto";
                coptainer.style.position = "absolute";
                coptainer.style.visibility = "hidden";
                coptainer.className += " active";

            this.parentElement.appendChild(coptainer);
            var height = coptainer.offsetHeight;
            this.parentElement.removeChild(coptainer);

            this.innerText = "Hide Example Code";
            cADD(this, "active");
            cADD(container, "active");
            container.style.height = height + "px";
        } else {
            container.removeAttribute("style");
            this.innerText = "Show Example Code";
            cREM(this, "active");
            cREM(container, "active");
        }
    }
    each(d.querySelectorAll("*[data-handle='example']"), function(){
        this.addEventListener("click", source);
    });

    /*
     |  INIT SCROLLSPY
     */
    each(d.querySelector("*[data-handle='menuspy']"), function(_, main){
        var spy = new MenuSpy(this, {
            callback: function(item){
                var navi = item.elm.parentElement.parentElement, close = [];

                // Add Open
                while(navi.tagName == "UL"){
                    cADD(navi, "open");
                    close.push(navi);
                    navi = navi.parentElement.parentElement;
                }

                // Remove Open
                var open = main.querySelectorAll("ul.open");
                for(var l = open.length, i = 0; i < l; i++){
                    if(close.indexOf(open[i]) == -1){
                        cREM(open[i], "open")
                    }
                }
            }
        });
    });

    /*
     |  CONNECT FORM FIELDS
     */
    each(d.querySelectorAll("select[data-connect]"), function(){
        var source = d.querySelector(this.getAttribute("data-connect")), self = this;
        if(!source){
            return false;
        }

        var change = function(source, result){
            each(result.options, function(){
                this.style.display = "none";
            });
            each(result.querySelectorAll("[data-value='" + source.value + "']"), function(i){
                this.style.removeProperty("display");
                this.selected = (i == 1);
            });
        };
        source.addEventListener("change", function(event){
            change(event.target, self);
        });
        change(source, this);
    });
}));
