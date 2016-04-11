(function($, Backbone, _, window){
    window.MjeClient = function(ip, port, channel){
        this.ip = ip;
        this.port = port;
        this.channel = channel;
        this.pubsub  = _.extend({}, Backbone.Events);
        if(!this.isSupported()){
            console.log("Your browser does not support WebSockets.");
        }
        else{
            var self = this;
            this.conn = new WebSocket('ws://' + ip + ':' + port + this.channel);

            this.conn.onclose = function(evt) {
                self.pubsub.trigger('mje_realtime:close', evt)
            };
            this.conn.onopen = function(evt) {
                self.pubsub.trigger('mje_realtime:open', evt)
            };

            this.conn.onmessage = function(evt) {
                self.pubsub.trigger('mje_realtime:message', evt.data);
            };

            this.conn.onerror = function(evt){
                self.pubsub.trigger('mje_realtime:error', evt);
            };
        }
    };

    MjeClient.prototype.isSupported = function(){
        return window["WebSocket"];
    };
    
    
    
    MjeClient.prototype.send = function(data){
        this.conn.send(data);
    };

    MjeClient.prototype.unsubscribe = function(){
        this.conn.close();
    };

})(jQuery, Backbone, _, window);
