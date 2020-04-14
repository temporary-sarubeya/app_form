/*
 * common.js
 */

!(function(){
    "use strict";

    function isString(obj){
        return typeof (obj) === "string" || obj instanceof String;
    }
    window.isString = isString;

    function isNumber(obj){
        return obj !== null && isFinite(obj);
    }
    window.isNumber = isNumber;

    function formatDate (date, format) {
        if(isString(date)){
            date = new Date(date.replace(/-/g,'/'));
        }else if(isNumber(date)){
            date = new Date(date);
        }
        if(!format) format = window.date_format ? window.date_format : 'YYYY年MM月DD日(WD)';
        var weekdaylist = ["日", "月", "火", "水", "木", "金", "土"];
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        format = format.replace(/WD/g, weekdaylist[date.getDay()]);
        format = format.replace(/_M_/g, date.getMonth() + 1 * 1);
        format = format.replace(/_D_/g, date.getDate());
        format = format.replace(/_h_/g, date.getHours());
        format = format.replace(/_m_/g, date.getMinutes());
        format = format.replace(/_s_/g, date.getSeconds());
        if(format.match(/_S_/g)){
            var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
            var length = format.match(/S/g).length;
            for(var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
        return format;
    }
    window.formatDate = formatDate;

    var smoothScroll = function(tgt,easing,adjust_pos) {
        if(!adjust_pos) adjust_pos = window.scroll_adjust_pos ? window.scroll_adjust_pos : 0;
        var tgt_elm;
        if(!tgt){
            return false;
        }
        if(adjust_pos && !isFinite(adjust_pos)){
            adjust_pos = 0;
        }
        if(isString(tgt)){
            if(tgt.match(/^#\S+$/)){
                tgt_elm = document.getElementById(tgt.replace(/^#/,''));
            }else{
                tgt_elm = document.querySelector(tgt);
            }
        }else if(tgt.nodeType && tgt.nodeType ===1){
            tgt_elm = tgt;
        }
        if(!tgt_elm){
            return;
        }

        var _scroll_tgt;
        var _start_pos = document.documentElement.scrollTop || document.body.scrollTop;
        var _end_pos = tgt_elm.getBoundingClientRect().top + _start_pos + (adjust_pos || 0);
        if(_end_pos < 0){
            _end_pos = 0;
        }
        var _distance = _end_pos - _start_pos;
        var _speed = Math.abs(_distance) > 1333 ? 1000 : 750;
        var _easing = easing || 'easeOutQuad';
        var _ua = window.navigator.userAgent.toLowerCase();

        if ('scrollingElement' in document) {
            _scroll_tgt = document.scrollingElement;
        }else if (_ua.indexOf('msie') > -1 || _ua.indexOf('trident') > -1 || _ua.indexOf('firefox') > -1) {
            _scroll_tgt = document.getElementsByTagName('html')[0];
        }else{
            _scroll_tgt = document.getElementsByTagName('body')[0];
        }

        var _start_time = getTime();
        ( function loop(){
            var _last_time = getTime();
            var _elapsed_time = Math.floor(_last_time - _start_time);
            var _percentage = ( _elapsed_time / parseInt(_speed, 10) );
            _percentage = ( _percentage > 1 ) ? 1 : _percentage;
            var _current_position = _start_pos + ( _distance * easingPattern(_easing, _percentage) );
            if( _percentage === 1 || _elapsed_time > 10000){
                _scroll_tgt.scrollTop = _current_position;
            }else{
                _scroll_tgt.scrollTop = _current_position;
                requestAnimationFrame( loop );
            }
        } )();

        function getTime(){
            var now = window.performance && ( performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow );
            return ( now && now.call( performance ) ) || ( new Date().getTime() );
        }

        return false;
    };
    window.smoothScroll = smoothScroll;

    function easingPattern ( type, time ) {
        var pattern;
        if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
        if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
        if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
        if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
        if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
        if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
        if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
        if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
        if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
        if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
        if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
        if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
        return pattern || time; // no easing, no acceleration
    }

}).call(this);