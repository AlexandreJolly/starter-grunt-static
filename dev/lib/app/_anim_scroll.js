// anim_scroll.js

var App = App || {};
App.initialize = App.initialize || {};
App.modules = App.modules || {};

App.initialize.anim_scroll = function ( element ) {
    // Get Element from element attribut or by default selector
    var el = element || false;

    // Check if el is a collection of elements or not
    if ( el.length > 0 ) {
        _.each( el , function ( el ) {
            el.App = new App.modules.anim_scroll({ el : el });
        });
    } else if ( el.nodeName ) {
        el.App = new App.modules.anim_scroll({ el : el });
    }

};

App.modules.anim_scroll = function ( args ) {

    var that = this;

    this.el = {};
    this.offset = {
        top : 0,
        bottom : -250
    };

    this._events = {
        'inScreen' : new Event('app.inScreen'),
        'outScreen' : new Event('app.outScreen'),
    };

    this.init = function () {
        that.el.handler = args.el;
        this.events();
    };

    this.events = function () {
        document.addEventListener('scroll', that.onScroll);
    };

    this.topIsIn = function () {
        return that.el.handler.getClientRects()[0].top < window.innerHeight - that.offset.top ? true : false;
    };

    this.bottomIsIn = function () {
        return that.el.handler.getClientRects()[0].bottom >= 0 + that.offset.bottom ? true : false;
    };

    this.onScroll = function ( e ) {
        //console.log( that.el.handler.getClientRects()[0].top, that.el.handler.getClientRects()[0].bottom);
        if ( that.bottomIsIn() && that.topIsIn() ) {
            that.inScreen();
        } else {
            that.outScreen();
        }
    };

    this.inScreen = function () {
        //console.log("inScreen");
        if ( that.el.handler.className.indexOf(" play") < 0 ) {
            that.el.handler.className += " play";
        }
    };

    this.outScreen = function () {
        //console.log("outScreen");
        that.el.handler.className =  that.el.handler.className.replace(" play", "");
    };

    this.destroy = function () {
        that.el.handler.removeEventListener('click');
        delete that.el.App;
    };

    this.init();
};