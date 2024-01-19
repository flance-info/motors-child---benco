(function($) {
    "use strict";

    $(document).ready(function () {
		 stm_ajax_add_download_child_pdf();
    });
window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

function stm_ajax_add_download_child_pdf() {
        $('#downloadPDF form').on("submit", function(event){
            event.preventDefault();
            $.ajax({
                url: ajaxurl,
                type: "POST",
                dataType: 'json',
                context: this,
                data: $( this ).serialize() + '&action=stm_ajax_add_download_pdf',
                beforeSend: function(){
                    $('.alert-modal').remove();
                    $(this).closest('form').find('input').removeClass('form-error');
					$(this).closest('form').find('.stm-ajax-loader').addClass('loading');
                },
                success: function (data) {

			    $(this).closest('form').find('.stm-ajax-loader').removeClass('loading');
	                    $(this).closest('form').find('.modal-body').append('<div class="alert-modal alert alert-'+ data.status +' text-left">' + data.response + '</div>')
	                    for(var key in data.errors) {
	                        $('#request-download-pdf-form input[name="' + key + '"]').addClass('form-error');
	                    }
	                    if(data.status == 'success'){
				    var download_pdf_link = $('#download_pdf_link').val();
				    //window.location.href = download_pdf_link;
				    //console.log(download_pdf_link);
				    if(download_pdf_link !== '') {
				    	downloadFile(download_pdf_link);
				    }

	                    }
                }
            });
            $(this).closest('form').find('.form-error').live('hover', function () {
                $(this).removeClass('form-error');
            });
        });
    }

})(jQuery);


