(function($, Backbone, _, MjeClient, toastr){
    var MjeRealtimeMessage =  function (){
        var self = this;
        this.noticeTemplate = _.template($('#mjob-realtime-new-job-notify').html());
        this.mjeClient = new MjeClient('139.59.241.200','8081', '/mje/message');

        this.mjeClient.pubsub.on('mje_realtime:open', function(evt){
            console.log(evt);
        });

        this.mjeClient.pubsub.on('mje_realtime:message', function(data){
            try{
                data = JSON.parse(data);
                if(typeof data.action != 'undefined'){

                    switch ( data.action ) {
                        case 'AE_MESSAGE_NEW_PUBLISH':
                            self.onNewMessage(data.post);
                            break;
                    }
                }
            }catch (e){
                console.log(e);
            }
        });
    };

    MjeRealtimeMessage.prototype.onNewMessage = function(job){
        toastr.options = {
            "closeButton": true,
            "showMethod": 'fadeIn',
            "newestOnTop": true,
            "onclick": function(){
                window.location.href = job.guid;
            },
            "timeOut": 4000
        };
        toastr.info(this.noticeTemplate(job));
    };

    $(document).ready(function() {
        var mjeRealtime = new MjeRealtimeMessage();
    });
})(jQuery, Backbone, _, window.MjeClient, window.toastr);
