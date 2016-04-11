(function($, Backbone, _, MjeClient, toastr){
    var MjeRealtime =  function (){
        var self = this;
        this.noticeTemplate = _.template($('#mjob-realtime-new-job-notify').html());
        this.mjeClient = new MjeClient('139.59.241.200','8081', '/mje/notify');

        this.mjeClient.pubsub.on('mje_realtime:open', function(evt){
            console.log(evt);
        });

        this.mjeClient.pubsub.on('mje_realtime:message', function(data){
            try{
                data = JSON.parse(data);
                if(typeof data.action != 'undefined'){
                    switch ( data.action ) {
                        case 'MJOB_POST_NEW_PUBLISH':
                        case 'MJOB_POST_DRAFT_PUBLISH':
                        case 'MJOB_POST_PENDING_PUBLISH':
                            self.onNewJob(data.post);
                            break;
                        case 'MJOB_POST_PUBLISH_DRAFT':
                            self.onJobDelete(data.post);
                            break;
                        default:
                            console.log(data);
                            break;
                    }
                }
            }catch (e){
                console.log(e);
            }
        });
    };

    MjeRealtime.prototype.onJobDelete = function(job){
        if($('body').hasClass('postid-'+job.ID)){
            window.location.href = '/';
        }
    };

    MjeRealtime.prototype.onNewJob = function(job){
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
        var mjeRealtime = new MjeRealtime();
    });
})(jQuery, Backbone, _, window.MjeClient, window.toastr);
