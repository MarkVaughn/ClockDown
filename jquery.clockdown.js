/**
* ClockDown is a jQuery plugin creates circulare clock looking countdowns 
* to an upcomming time in the datetime field of a <time> tag
*
* @name clockdown
* @version 0.2
* @requires jQuery v1.2.3+
* @author Mark Vaughn
* @license MIT License - http://www.opensource.org/licenses/mit-license.php
*
* Inspirations and parse code from https://github.com/rmm5t/jquery-timeago
* For usage and examples, visit:
* http://jsfiddle.net/IfTrueElseFalse/QfdEd/33/
*
*/
(function($) {
    $.clockdown = {};
    defaults = {
        settings: {
            radius: 30,
            borderSize: 0,
            ringWidth:0
        },
        parse: function(iso8601) {
            var s = $.trim(iso8601);
            s = s.replace(/\.\d+/, ""); // remove milliseconds
            s = s.replace(/-/, "/").replace(/-/, "/");
            s = s.replace(/T/, " ").replace(/Z/, " UTC");
            s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");
            return new Date(s);
        },
        relativeObject: function(date) {
            var seconds = Math.round($.clockdown.fromNow(date) / 1000),
                minutes = Math.round(seconds / 60),
                hours = Math.floor(minutes / 60),
                days = Math.floor(hours / 24),
                weeks = Math.floor(days/ 7),
                months= Math.floor(days/ 30),
                years = days / 365,
                number = 0,
                unit = null,
                degrees = null;
            if (seconds < 60) {
                unit = seconds === 1 ? 'second' : 'seconds';
                number = seconds;
                degrees = 360 * number / 60;
            } else if (minutes < 60) {
                unit = minutes === 1 ? 'minute' : 'minutes';
                number = minutes;
                degrees = 360 * number / 60;
            } else if (hours < 24) {
                unit = hours === 1 ? 'hour' : 'hours';
                number = hours;
                degrees = 360 * number / 24;
            } else if (days < 7) {
                unit = days === 1 ? 'day' : 'days';
                number = days;
                degrees = 360 * number / 7;
            } else if (weeks < 5) {
                unit = weeks === 1 ? 'week' : 'weeks';
                number = weeks ;
                degrees = 360 * number / 4;
            } else if (months < 12) {
                unit = months === 1 ? 'month' : 'months';
                number = months ;
                degrees = 360 * months / 12;
            }else{
                unit = years=== 1 ? 'year' : 'years';
                number = years;
                degrees = 360 * number / 4;
            }
            return {
                number: number,
                unit: unit,
                degrees: Math.round(degrees)
            };
        },
        fromNow: function(date) {
            return Math.abs(new Date().getTime() - date.getTime());
        }
    };
    $.extend($.clockdown, defaults);
    $.fn.clockdown = function(options) {

        s = $.extend($.clockdown.settings, options);
        return this.filter('[datetime]').each(function() {
            var $this = $(this),
                date = $.clockdown.parse($this.attr('datetime')),
                relativeObject = $.clockdown.relativeObject(date),
                r = s.radius,
                rW = s.ringWidth,
                $pie = $('<div class=clockdown-pie/>').html('<div class=clockdown-hold><div class=clockdown-fill/><div class=clockdown-piece/></div><div class=clockdown-inner/><div class=clockdown-time><div class=clockdown-number/><div class=clockdown-unit/></div>');
            if( rW > 0 && r > rW){
                $pie.find('.clockdown-inner').css({width: (r-rW) *2,height: (r-rW) *2, borderRadius: (r-rW), top: rW, left: rW});
            } else{
                $pie.find('.clockdown-inner').remove();
            }
            $this.hide();
            $this.before($pie.css({
                width: r * 2,
                height: r * 2,
                borderRadius: r + s.borderSize,
                borderSize: s.borderSize
            }));
            $pie.find('.clockdown-hold, .clockdown-piece, .clockdown-fill').css({
                width: r * 2,
                height: r * 2,
                clip: relativeObject.degrees <= 180 ? 'rect(0,' + r * 2 + 'px,' + r * 2 + 'px,' + r + 'px)' : null
            }).filter('.clockdown-piece').css({
                clip: 'rect(0,' + r + 'px,' + r * 2 + 'px,0)',
                transform: 'rotate(' + relativeObject.degrees + 'deg)'
            });
            $pie.find('.clockdown-fill').css({
                marginLeft: r
            });
            if (relativeObject.degrees <= 180) {
                $pie.find('.clockdown-fill').remove()
            }
            $pie.find('.clockdown-number').text(relativeObject.number);
            $pie.find('.clockdown-unit').text(relativeObject.unit);
            margin = Math.round((r * 2 - $pie.find('.clockdown-time').height()) / 2);
            $pie.find('.clockdown-time').width(r * 2);
            if (margin > 0) {
                $pie.find('.clockdown-time').css({
                    marginTop: margin
                });
            }
        });
    };
})(jQuery);