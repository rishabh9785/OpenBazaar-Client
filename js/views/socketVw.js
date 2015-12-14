var __ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {

  },

  initialize: function(){
    "use strict";
    var self = this;
    //model is userModel passed in from router
    var socketAddress = (this.model.get('serverUrl')).replace(/^(.*:)\/{2}([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/, 'ws://$2:18466');
    //socket should be opened when view is created, and stay open
    try{
      this.socketConnection = new WebSocket(socketAddress);
      this.socketConnection.onopen = this.socketOpen();
      this.socketConnection.onmessage = function (e) {
        self.socketMessage(e);
      };
      this.socketConnection.onerror = function (e) {
        self.socketError(e);
      };
      this.socketConnection.onclose = this.socketClose();
    } catch(exception){
      try{
        console.log(socketAddress, window.polyglot.t('errorMessages.socketError') + "<br/><br/>" + exception);
        //use default socket
        this.socketConnection = new WebSocket('ws://localhost:18466');
        this.socketConnection.onopen = this.socketOpen();
        this.socketConnection.onmessage = function (e) {
          self.socketMessage(e);
        };
        this.socketConnection.onerror = function (e) {
          self.socketError(e);
        };
        this.socketConnection.onclose = this.socketClose();
      }catch(exception){
        console.log(exception);
        //create a fake object so the rest of the view doesn't error out
        this.socketConnection = {readyState: 0};
        $('.js-loadingMessageModal').removeClass('hide');
        $('.js-indexLoadingMsg1').text("WebSockets Cannot be reached.");
        $('.js-indexLoadingMsg2').text("Stored URL of " + socketAddress + "has failed. Default address of ws://localhost:18466 has also failed.");
        $('.js-indexLoadingMsg3').text("Interface will continue loading, but some functionality will not be available.");
      }
    }

  },

  socketOpen: function() {
    "use strict";
    //placeholder
    //console.log("Websocket Opened");
  },

  waitForSocket: function(message) {
    "use strict";
    var self = this;
    if (this.socketConnection.readyState === 1){
      this.socketConnection.send(message);
    }else{
      //if socket is not ready yet, try again
      this.socketTimer = setTimeout(function(){
        self.waitForSocket(message);
      }, 1000);
    }

  },

  socketMessage: function(e){
    "use strict";
    window.obEventBus.trigger("socketMessageRecived", e);
  },

  socketError: function(e) {
    "use strict";
    console.log("error: "+ e);
  },

  socketClose: function(e) {
    "use strict";
    //console.log('Websocket Closed');
  },

  getItems: function(wsID){
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {"request": {
      "api": "v1",
      "id": wsID,
      "command": "get_homepage_listings"
    }};
    this.waitForSocket(JSON.stringify(message));
  },

  getVendors: function(wsID){
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {"request": {
      "api": "v1",
      "id": wsID,
      "command": "get_vendors"
    }};
    this.waitForSocket(JSON.stringify(message));
  },

  getModerators: function(wsID){
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {"request": {
      "api": "v1",
      "id": wsID,
      "command": "get_moderators"
    }};
    this.waitForSocket(JSON.stringify(message));
  },

  getNotifications: function(wsID) {
    "use strict";
    //id should be generated by the view that asks for the request
    var message = {"request": {
      "api": "v1",
      "id": wsID,
      "command": "get_notifications"
    }};
    this.waitForSocket(JSON.stringify(message));
  },

  sendMessage: function(chatMessage) {
    "use strict";
    //id should be generated by the view that asks for the request
    this.waitForSocket(JSON.stringify(chatMessage));
  },

  render: function(){
    var self = this;
    return this;
  },

  close: function(){
    "use strict";
    this.remove();
  }
});
