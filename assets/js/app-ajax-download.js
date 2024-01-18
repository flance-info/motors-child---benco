(function($) {
    "use strict";

    $(document).ready(function () {
		 stm_ajax_add_download_child_pdf();
    });

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


