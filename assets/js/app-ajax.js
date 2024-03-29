(function($) {
    "use strict";

    var stm_single_filter_link = false;
    var stmIsotope;
    var $container = $('.stm-isotope-sorting');

    $(document).ready(function () {
        //AJAX functions
        stm_ajax_classic_filter();
        stm_ajax_classic_filter_price();
        stm_ajax_classic_filter_slider();
        //stm_classic_filter_remove_hidden();
        stm_ajax_add_to_compare();
        stm_ajax_remove_from_compare();
        stm_ajax_filter_remove_hidden();
        stm_ajax_add_test_drive();
        stm_ajax_add_download_pdf();
        stm_ajax_get_car_price();
        stm_ajax_add_trade_offer();
        clearFilter();
        stm_filter_links();
        stm_logout();

        stm_favourites();

        stm_ajax_custom_login();

        loadMoreDealerCars();
        loadMoreDealerReviews();

        //Isotope
        stm_sort_listing_cars();
        stm_modern_filter_isotope();

        stm_classic_ajax_submit();

        setTimeout(function(){
            $('img.lazy').lazyload({
                effect: "fadeIn",
                failure_limit: Math.max('img'.length - 1, 0)
            });
        },100);

        //Clear select value from listing badge
        $('body').on('click', '#modern-filter-listing .stm-clear-listing-one-unit', function(){
            var selectToClear = $(this).data('select');
            if(typeof selectToClear != 'undefined') {
                if (selectToClear != 'price' && $('select[name=' + selectToClear + ']').length > 0) {
                    $('select[name=' + selectToClear + ']').val('').change();
                } else {
                    var $priceRange = $('#stm-price-range');
                    if ($priceRange.length > 0) {
                        $priceRange.slider('values', [stmOptions.min, stmOptions.max]);
                        $("#stm_filter_min_price").val(stmOptions.min);
                        $("#stm_filter_max_price").val(stmOptions.max);
                    }
                }
            }

        });

        $('body').on('click', '.stm-clear-listing-one-unit-classic', function(){
            var selectToClear = $(this).data('select');
            var clearLinkArg = $(this).data('url');
            if(typeof selectToClear != 'undefined') {
                if(selectToClear.indexOf('[')){
                    window.location = clearLinkArg;
                    return false;
                }
                if (selectToClear != 'price' && $('select[name=' + selectToClear + ']').length > 0) {
                    window.location = clearLinkArg;
                } else {
                    var $priceRange = $('#stm-price-range');
                    if ($priceRange.length > 0) {
                        $priceRange.slider('values', [stmOptions.min, stmOptions.max]);
                        $("#stm_filter_min_price").val(stmOptions.min);
                        $("#stm_filter_max_price").val(stmOptions.max);
                        $('.classic-filter-row form').submit();
                    }
                }
            }

        });

        $('#stm-classic-filter-submit').click(function(){
            //stm_single_filter_link = false;
        })
    });

    function stm_classic_ajax_submit() {
        $('#stm-classic-filter-submit').on('click', function(e){
            e.preventDefault();
            if(!stm_single_filter_link) {
                $('#stm-filter-links-input').val('');
            }

            var data_form = $('.filter.filter-sidebar').closest('form').serialize();

            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: data_form + '&action=stm_ajax_filter',
                beforeSend: function(){
                    $('.stm-ajax-row').addClass('stm-loading');
                    //$('.classic-filter-row .filter-sidebar .select2-container--default .select2-selection--single .select2-selection__arrow b').addClass('stm-preloader');
                },
                success: function (data) {
                    /*Change select*/
                    //$('.classic-filter-row .filter-sidebar .select2-container--default .select2-selection--single .select2-selection__arrow b').removeClass('stm-preloader');
                    //$('.classic-filter-row .filter-sidebar select').prop("disabled", false);

                    /*Change content*/
                    //$('.filter.stm-vc-ajax-filter select').prop("disabled", false);
                    if(typeof data.html != 'undefined') {
                        $('.stm-ajax-row .stm-isotope-sorting:not(.stm-isotope-sorting-featured-top)').html(data.html);

                        var sortVal = $('.stm-select-sorting select').val();

                        $('.stm-ajax-row').removeClass('stm-loading');
                    }

                    stm_after_ajax_same_actions(data, sortVal);
                }
            });
        })
    }


    //Classic filter ajax request
    function stm_ajax_classic_filter() {
        $('.classic-filter-row .filter-sidebar.ajax-filter select:not(.hide), .stm-select-sorting select:not(.hide)').select2().on('change', function(){

            if(!stm_single_filter_link) {
                $('#stm-filter-links-input').val('');
            }

            if($('input[name="sort_order"]').length) {
               $('input[name="sort_order"]').val($(this).select2('val'));
            }

            var data_form = $('.filter.filter-sidebar').closest('form').serialize();

            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: data_form + '&action=stm_ajax_filter',
                beforeSend: function(){
                    $('.stm-ajax-row').addClass('stm-loading');
                    $('.classic-filter-row .filter-sidebar .select2-container--default .select2-selection--single .select2-selection__arrow b').addClass('stm-preloader');
                },
                success: function (data) {
                    /*Change select*/
                    $('.classic-filter-row .filter-sidebar .select2-container--default .select2-selection--single .select2-selection__arrow b').removeClass('stm-preloader');
                    $('.classic-filter-row .filter-sidebar select').prop("disabled", false);

                    if(typeof data.binding != 'undefined'){
                        for(var key in data.binding) {
                            if(data.binding.hasOwnProperty(key)) {
                                var obj = data.binding[key];
                                $('select[name=' + key + '] > option').each(function(){
                                    var opt_val = $(this).val();
                                    $(this).removeAttr('disabled');
                                    if(opt_val != '') {
                                        if (!obj.hasOwnProperty(opt_val)) {
                                            $(this).attr('disabled', '1');
                                        }
                                    }
                                })
                            }
                        }
                    }

                    $('.classic-filter-row .filter-sidebar select:not(.hide)').select2("destroy");

                    $('.classic-filter-row .filter-sidebar select:not(.hide)').select2();
                    /*Change content*/
                    $('.filter.stm-vc-ajax-filter select').prop("disabled", false);
                    if(typeof data.html != 'undefined') {
                        $('.stm-ajax-row .stm-isotope-sorting:not(.stm-isotope-sorting-featured-top)').html(data.html);

                        var sortVal = $('.stm-select-sorting select').val();

                        $('.stm-ajax-row').removeClass('stm-loading');
                    }

                    stm_after_ajax_same_actions(data, sortVal);
                }
            });
        });

        if(!$('.stm-filter-sidebar-boats').length) {
            $('#ca_location_listing_filter').blur(function () {

                if (!stm_single_filter_link) {
                    $('#stm-filter-links-input').val('');
                }

                $.ajax({
                    url: ajaxurl,
                    dataType: 'json',
                    context: this,
                    data: $(this).closest('form').serialize() + '&action=stm_ajax_filter',
                    beforeSend: function () {
                        $('.stm-ajax-row').addClass('stm-loading');
                        $('.stm-location-search-unit').addClass('loading');
                    },
                    success: function (data) {
                        /*Change content*/
                        $('.stm-location-search-unit').removeClass('loading');
                        $('.filter.stm-vc-ajax-filter select').prop("disabled", false);
                        if (typeof data.html != 'undefined') {
                            $('.stm-ajax-row .stm-isotope-sorting:not(.stm-isotope-sorting-featured-top)').html(data.html);

                            $('.stm-ajax-row').removeClass('stm-loading');
                        }

                        var sortVal = $('.stm-select-sorting select').select2('val');

                        stm_after_ajax_same_actions(data, sortVal);

                    }
                });

            });
        }

        $('.stm-listing-directory-checkboxes .stm-option-label').click(function(){
            var $this = $(this);

            var hasChecked = false;

            var $thisCont = $(this).closest('.stm-listing-directory-checkboxes');
            $thisCont.find('.stm-option-label').each(function(){
                var checked = $(this).find('input[type=checkbox]').prop('checked');
                if(checked) {
                    $(this).find('.stm-option-image').removeClass('non-active');
                    hasChecked = true;
                } else {
                    $(this).find('.stm-option-image').addClass('non-active');
                }
            });

            if(!hasChecked){
                $thisCont.find('.stm-option-image').removeClass('non-active');
            }

        });

        //Checkboxed area listing directory trigger

        $('.stm-ajax-checkbox-button .button, .stm-ajax-checkbox-instant .stm-option-label input').click(function(e){

            if($(this)[0].className == 'button') {
                e.preventDefault();
            }

            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).closest('form').serialize() + '&action=stm_ajax_filter',
                beforeSend: function () {
                    $(this).closest('.stm-accordion-content-wrapper .stm-accordion-inner').addClass('loading');
                    $('.stm-ajax-row').addClass('stm-loading');
                    $('.classic-filter-row .filter-sidebar .select2-container--default .select2-selection--single .select2-selection__arrow b').addClass('stm-preloader');
                },
                success: function (data) {
                    $(this).closest('.stm-accordion-content-wrapper .stm-accordion-inner').removeClass('loading');
                    $('.stm-ajax-row').removeClass('stm-loading');
                    $('.classic-filter-row .filter-sidebar .select2-container--default .select2-selection--single .select2-selection__arrow b').removeClass('stm-preloader');
                    $('.classic-filter-row .filter-sidebar select').prop("disabled", false);

                    if(typeof data.html != 'undefined') {
                        $('.stm-ajax-row .stm-isotope-sorting:not(.stm-isotope-sorting-featured-top)').html(data.html);

                        var sortVal = $('.stm-select-sorting select').select2('val');

                        $('.stm-ajax-row').removeClass('stm-loading');
                    }

                    stm_after_ajax_same_actions(data, sortVal);
                }
            })
        });

    }

    function stm_ajax_classic_filter_price() {
        $(".classic-filter-row .stm-price-range").on('slidestop', function (event, ui) {
            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).closest('form').serialize() + '&action=stm_ajax_filter',
                beforeSend: function(){
                    $('.stm-ajax-row').addClass('stm-loading');
                },
                success: function (data) {
                    /*Change content*/
                    $('.filter.stm-vc-ajax-filter select').prop("disabled", false);
                    if(typeof data.html != 'undefined') {
                        $('.stm-ajax-row .stm-isotope-sorting:not(.stm-isotope-sorting-featured-top)').html(data.html);

                        var sortVal = $('.stm-select-sorting select').val();

                        $('.stm-ajax-row').removeClass('stm-loading');
                    }

                    stm_after_ajax_same_actions(data, sortVal);
                }
            });
        });
    }

    function stm_ajax_classic_filter_slider() {
        $(".ajax-filter .stm-filter-type-slider").on('slidestop', function (event, ui) {
            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).closest('form').serialize() + '&action=stm_ajax_filter',
                beforeSend: function(){
                    $('.stm-ajax-row').addClass('stm-loading');
                },
                success: function (data) {
                    /*Change content*/
                    $('.filter.stm-vc-ajax-filter select').prop("disabled", false);
                    if(typeof data.html != 'undefined') {
                        $('.stm-ajax-row .stm-isotope-sorting:not(.stm-isotope-sorting-featured-top)').html(data.html);

                        var sortVal = $('.stm-select-sorting select').val();

                        $('.stm-ajax-row').removeClass('stm-loading');
                    }

                    stm_after_ajax_same_actions(data, sortVal);
                }
            });
        });
    }

    function stm_after_ajax_same_actions(data, sortVal) {

	    if(data.featured_html && data.featured_html !== data.html) {
		    $('.stm-featured-top-cars-title').slideDown();
			$('.stm-ajax-row .stm-isotope-sorting-featured-top').html(data.featured_html);
		} else {
			$('.stm-ajax-row .stm-isotope-sorting-featured-top').empty();
		}

		if(!data.featured_html) {
			$('.stm-featured-top-cars-title').slideUp();
		}

        if(typeof data.grid_view_link !== 'undefined') {
            $('.stm-view-by .view-grid').attr('href', unescape(data.grid_view_link));
        }

        if(typeof data.list_view_link !== 'undefined') {
            $('.stm-view-by .view-list').attr('href', unescape(data.list_view_link));
        }

        if(typeof data.pagination != 'undefined'){
            $('.stm-ajax-pagination').html(data.pagination);
        }

        if(typeof data.badges != 'undefined'){
            $('.stm-filter-chosen-units').html(data.badges);
        }

        if(typeof data.total != 'undefined'){
            $('.stm-listing-directory-total-matches span').text(data.total);
        }

        if(typeof(data.title) != 'undefined') {
            $('.stm-listing-directory-title .title').text(data.title);
        }

        $container.isotope('reloadItems').isotope('layout');
        if(typeof stm_isotope_sort_function_boats == 'function') {

            var $stm_param = $('.stm-sort-list-params ul li[data-sort="low"]');
            var sort_param = '';
            if(typeof($stm_param[0]) == 'undefined') {
                $stm_param = $('.stm-sort-list-params ul li[data-sort="high"]');
                if(typeof($stm_param[0]) != 'undefined') {
                    sort_param = $stm_param.attr('data-filter') + '_high';
                }
            } else {
                sort_param = $stm_param.attr('data-filter') + '_low';
            }

            stm_isotope_sort_function_boats(sort_param);
        } else {
            stm_isotope_sort_function(sortVal);
        }

        if(typeof(data.posts_per_page_link) != 'undefined') {
            $('.stm_boats_view_by ul li').each(function(){
                var url = data.posts_per_page_link;
                var stm_pp = parseFloat($(this).find('a').text());
                if(typeof(stm_pp) !== 'undefined') {
                    var regEx = /(posts_per_page)=([^#&]*)/g;
                    var newurl = url.replace(regEx, 'posts_per_page=' + stm_pp);
                    $(this).find('a').attr('href', newurl);
                }
            })
        }

        $("img.lazy").lazyload();

        $('.stm-tooltip-link, div[data-toggle="tooltip"]').tooltip();

        var url = unescape(data.url);
        window.history.pushState('','',url);

    }

    function stm_ajax_filter_remove_hidden() {
        $('.filter.stm-vc-ajax-filter select:not(.hide)').select2().on('change', function(){
            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).closest('form').serialize() + '&action=stm_ajax_filter_remove_hidden',
                beforeSend: function(){
                    $('.filter.stm-vc-ajax-filter select, .filter.stm-vc-ajax-filter button[type="submit"]').prop("disabled", true);
                    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').addClass('stm-preloader');
                },
                success: function (data) {
                    $('.select2-container--default .select2-selection--single .select2-selection__arrow b').removeClass('stm-preloader');
                    $('.filter.stm-vc-ajax-filter select, .filter.stm-vc-ajax-filter button[type="submit"]').prop("disabled", false);

                    if(typeof data.binding != 'undefined'){
                        for(var key in data.binding) {
                            if(data.binding.hasOwnProperty(key)) {
                                var obj = data.binding[key];
                                $('select[name=' + key + '] > option').each(function(){
                                    var opt_val = $(this).val();
                                    $(this).removeAttr('disabled');
                                    if(opt_val != '') {
                                        if (!obj.hasOwnProperty(opt_val)) {
                                            $(this).attr('disabled', '1');
                                        }
                                    }
                                })
                            }
                        }
                    }

                    $('.filter.stm-vc-ajax-filter select:not(.hide)').select2("destroy");

                    $('.filter.stm-vc-ajax-filter select:not(.hide)').select2();
                }
            });
            return false;
        });

        //Listing function
        var tab_id = '';
        $('.filter-listing.stm-vc-ajax-filter select,.stm-form1-intro-unit .stm-form-1-selects select, .stm_dynamic_listing_dealer_filter select').on('select2:open', function(e){
            var selectClass = e.currentTarget.dataset.class;
            if(typeof(selectClass) != 'undefined') {
                $('.select2-container--open').addClass(selectClass);
            }
        });
        $('.filter-listing.stm-vc-ajax-filter select:not(.hide,.stm-filter-ajax-disabled-field)').select2().on('change', function(){
            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).closest('form').serialize() + '&action=stm_ajax_filter_remove_hidden',
                success: function (data) {
                    if(typeof data.length != 'undefined') {
                        $(this).closest('.tab-pane').find('button[type="submit"] span').text(data.length);
                        if($(this).closest('.filter-listing').hasClass('stm_mc-filter-selects')) {
                            $('.stm_mc-found .number-found').text(data.length);
                        }
                    }
                }
            });
            return false;
        });
    }

    function stm_ajax_add_to_compare() {
        $(document).on('click', '.add-to-compare', function(e){
            e.preventDefault();
            var dataId = $(this).attr('data-id');
            var dataAction = $(this).attr('data-action');
            if(typeof dataAction == 'undefined') {
                dataAction = 'add';
            }
            var stm_timeout;
            if(typeof dataId != 'undefined') {
                $.ajax({
                    url: ajaxurl,
                    type: "POST",
                    dataType: 'json',
                    data: '&post_id=' + dataId + '&post_action=' + dataAction + '&action=stm_ajax_add_to_compare',
                    context: this,
                    beforeSend: function (data) {
                        $(this).addClass('disabled');
                        clearTimeout(stm_timeout);
                    },
                    success: function (data) {
                        $(this).removeClass('disabled');
                        clearTimeout(stm_timeout);
                        $('.single-add-to-compare').addClass('single-add-to-compare-visible');
                        if(typeof data.response != 'undefined') {
                            $('.single-add-to-compare .stm-title').text(data.response);
                        }
                        if(typeof data.length != 'undefined') {
                            $('.stm-current-cars-in-compare').text(data.length);
                        }
                        stm_timeout = setTimeout(function(){
                            $('.single-add-to-compare').removeClass('single-add-to-compare-visible');
                        }, 5000);
                        if(data.status != 'danger') {
                            if (dataAction == 'remove') {
                                $(this).removeClass('stm-added');
                                $(this).html('<i class="stm-icon-add"></i>' + data.add_to_text);
                                $(this).removeClass('hovered');
                                $(this).attr('data-action', 'add');
                            } else {
                                $(this).addClass('stm-added');
                                $(this).html('<i class="stm-icon-added stm-unhover"></i><span class="stm-unhover">' + data.in_com_text + '</span><div class="stm-show-on-hover"><i class="stm-icon-remove"></i>' + data.remove_text + '</div>');
                                $(this).removeClass('hovered');
                                $(this).attr('data-action', 'remove');
                            }
                        }
                    }
                });
            }
        });


        var stm_timeout;
        $(document).on('click', '.stm-user-public-listing .stm-listing-compare,.listing-list-loop.stm-listing-directory-list-loop .stm-listing-compare, .stm-gallery-action-unit.compare, .stm-compare-directory-new', function(e) {

            e.preventDefault();
            var stm_cookies = $.cookie();
            var stm_car_compare = [];
            var stm_car_add_to = $(this).data('id');
            var stm_car_title = $(this).data('title');

            for (var key in stm_cookies) {
                if (stm_cookies.hasOwnProperty(key)) {
                    if (key.indexOf('compare_ids') > -1) {
                        stm_car_compare.push(stm_cookies[key]);
                    }
                }
            }

            var stm_compare_cars_counter = stm_car_compare.length;
            $.cookie.raw = true;

            if($.inArray(stm_car_add_to.toString(), stm_car_compare) === -1){
                if(stm_car_compare.length < 3) {
                    $.cookie('compare_ids[' + stm_car_add_to + ']', stm_car_add_to, { expires: 7, path: '/' });
                    $(this).addClass('active');
                    stm_compare_cars_counter++;

                    //Added popup
                    clearTimeout(stm_timeout);
                    $('.single-add-to-compare .stm-title').text(stm_car_title + ' - ' + stm_added_to_compare_text);
                    $('.single-add-to-compare').addClass('single-add-to-compare-visible');
                    stm_timeout = setTimeout(function(){
                        $('.single-add-to-compare').removeClass('single-add-to-compare-visible');
                    }, 5000);
                    //Added popup
                } else {
                    //Already added 3 popup
                    clearTimeout(stm_timeout);
                    $('.single-add-to-compare .stm-title').text(stm_already_added_to_compare_text);
                    $('.single-add-to-compare').addClass('single-add-to-compare-visible');
                    stm_timeout = setTimeout(function(){
                        $('.single-add-to-compare').removeClass('single-add-to-compare-visible');
                        $('.single-add-to-compare').removeClass('overadded');
                        $('.compare-remove-all').remove();
                    }, 5000);
                    //Already added 3 popup
                    $('.single-add-to-compare').addClass('overadded');
                    $('.compare-remove-all').remove();
                    $('.single-add-to-compare .compare-fixed-link').before('<a href="#" class="compare-fixed-link compare-remove-all pull-right heading-font">Reset All</a>');
                }
            } else {
                $.removeCookie('compare_ids[' + stm_car_add_to + ']', { path: '/' });
                $(this).removeClass('active');
                stm_compare_cars_counter--;

                //Deleted from compare text
                clearTimeout(stm_timeout);
                $('.single-add-to-compare .stm-title').text(stm_car_title + ' ' + stm_removed_from_compare_text);
                $('.single-add-to-compare').addClass('single-add-to-compare-visible');
                stm_timeout = setTimeout(function(){
                    $('.single-add-to-compare').removeClass('single-add-to-compare-visible');
                }, 5000);
                //Deleted from compare text


                $('.single-add-to-compare').removeClass('overadded');
                $('.compare-remove-all').remove();
            }

            $('.stm-current-cars-in-compare').text(stm_compare_cars_counter);

        });

        $(document).on('click', '.compare-remove-all', function(){
            var stm_cookies = $.cookie();

            for (var key in stm_cookies) {
                if (stm_cookies.hasOwnProperty(key)) {
                    if (key.indexOf('compare_ids') > -1) {
                        $.removeCookie(key, { path: '/' });
                    }
                }
            }

            location.reload();
        });
    }

    function stm_favourites() {
        $('body.logged-in').on('click', '.stm-listing-favorite, .stm-listing-favorite-action', function(e){
            e.preventDefault();

            if($(this).hasClass('disabled')) {
                return false;
            }

            $(this).toggleClass('active');
            var stm_car_add_to = $(this).data('id');


            $.ajax({
                url: ajaxurl,
                type: "POST",
                dataType: 'json',
                data: '&car_id=' + stm_car_add_to + '&action=stm_ajax_add_to_favourites',
                context: this,
                beforeSend: function (data) {
                    $(this).addClass('disabled');
                },
                success: function (data) {
                    if(data.count) {
                        $('.stm-my-favourites span').text(data.count);
                    }
                    $(this).removeClass('disabled');
                }
            });
        });

        $('body.stm-user-not-logged-in').on('click', '.stm-listing-favorite, .stm-listing-favorite-action', function(e){
            e.preventDefault();

            $(this).toggleClass('active');

            var stm_cookies = $.cookie();
            var stm_car_add_to = $(this).data('id');
            var stm_car_favourites = [];
            if(typeof(stm_cookies['stm_car_favourites']) != 'undefined') {
                stm_car_favourites = stm_cookies['stm_car_favourites'].split(',');
                var index = stm_car_favourites.indexOf(stm_car_add_to.toString());
                if(index !== -1) {
                    stm_car_favourites.splice(index, 1);
                } else {
                    stm_car_favourites.push(stm_car_add_to.toString());
                }

                stm_car_favourites = stm_car_favourites.join(',');
                $.cookie('stm_car_favourites', stm_car_favourites, { expires: 7, path: '/' });

            } else {
                $.cookie('stm_car_favourites', stm_car_add_to.toString(), { expires: 7, path: '/' });
            }
        });
    }

    function stm_ajax_remove_from_compare() {
        $(document).on('click', '.remove-from-compare', function(e){
            e.preventDefault();
            var dataId = $(this).attr('data-id');
            var dataAction = $(this).attr('data-action');
            if(typeof dataId != 'undefined') {
                $.ajax({
                    url: ajaxurl,
                    type: "POST",
                    dataType: 'json',
                    data: '&post_id=' + dataId + '&post_action=' + dataAction + '&action=stm_ajax_add_to_compare',
                    context: this,
                    beforeSend: function (data) {
                        $(this).addClass('loading');
                        if(parseFloat($('.stm-current-cars-in-compare').text()) > 0) {
                            $('.stm-current-cars-in-compare').text(parseFloat($('.stm-current-cars-in-compare').text()) - 1);
                        }
                        $('.car-listing-row .compare-col-stm-' + dataId).hide('slide', {direction: 'left'}, function(){
                            $('.car-listing-row .compare-col-stm-' + dataId).remove();
                            $('.car-listing-row').append($('.compare-empty-car-top').html());
                        });
                        $('.stm-compare-row .compare-col-stm-' + dataId).hide('slide', {direction: 'left'}, function(){
                            $('.stm-compare-row .compare-col-stm-' + dataId).remove();
                            $('.stm-compare-row').append($('.compare-empty-car-bottom').html());
                        });
                        $('.row-compare-features .compare-col-stm-' + dataId).hide('slide', {direction: 'left'}, function(){
                            $('.row-compare-features .compare-col-stm-' + dataId).remove();
                            if($('.row-compare-features .col-md-3').length < 2) {
                                $('.row-compare-features').slideUp();
                            }
                        });
                    },
                });
            }
        });
    }

    function stm_ajax_add_test_drive() {
        $('#test-drive form').on("submit", function(event){
            event.preventDefault();
            $.ajax({
                url: ajaxurl,
                type: "POST",
                dataType: 'json',
                context: this,
                data: $( this ).serialize() + '&action=stm_ajax_add_test_drive',
                beforeSend: function(){
                    $('.alert-modal').remove();
                    $(this).closest('form').find('input').removeClass('form-error');
					$(this).closest('form').find('.stm-ajax-loader').addClass('loading');
                },
                success: function (data) {
					$(this).closest('form').find('.stm-ajax-loader').removeClass('loading');
                    $(this).closest('form').find('.modal-body').append('<div class="alert-modal alert alert-'+ data.status +' text-left">' + data.response + '</div>')
                    for(var key in data.errors) {
                        $('#request-test-drive-form input[name="' + key + '"]').addClass('form-error');
                    }
                }
            });
            $(this).closest('form').find('.form-error').live('hover', function () {
                $(this).removeClass('form-error');
            });
        });
    }


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


    function stm_ajax_add_download_pdf() {
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

    function stm_ajax_add_trade_offer() {
        $('#trade-offer form').on("submit", function(event){
            event.preventDefault();
            $.ajax({
                url: ajaxurl,
                type: "POST",
                dataType: 'json',
                context: this,
                data: $( this ).serialize() + '&action=stm_ajax_add_trade_offer',
                beforeSend: function(){
                    $('.alert-modal').remove();
                    $(this).closest('form').find('input').removeClass('form-error');
                    $(this).closest('form').find('.stm-ajax-loader').addClass('loading');
                },
                success: function (data) {
                    $(this).closest('form').find('.stm-ajax-loader').removeClass('loading');
                    $(this).closest('form').find('.modal-body').append('<div class="alert-modal alert alert-'+ data.status +' text-left">' + data.response + '</div>')
                    for(var key in data.errors) {
                        $('#request-trade-offer-form input[name="' + key + '"]').addClass('form-error');
                    }
                }
            });
            $(this).closest('form').find('.form-error').live('hover', function () {
                $(this).removeClass('form-error');
            });
        });
    }

    function stm_ajax_get_car_price() {
        $('#get-car-price form').on("submit", function(event){
            event.preventDefault();
            $.ajax({
                url: ajaxurl,
                type: "POST",
                dataType: 'json',
                context: this,
                data: $( this ).serialize() + '&action=stm_ajax_get_car_price',
                beforeSend: function(){
                    $('.alert-modal').remove();
                    $(this).closest('form').find('input').removeClass('form-error');
                    $(this).closest('form').find('.stm-ajax-loader').addClass('loading');
                },
                success: function (data) {
                    $(this).closest('form').find('.stm-ajax-loader').removeClass('loading');
                    $(this).closest('form').find('.modal-body').append('<div class="alert-modal alert alert-'+ data.status +' text-left">' + data.response + '</div>')
                    for(var key in data.errors) {
                        $('#get-car-price input[name="' + key + '"]').addClass('form-error');
                    }
                }
            });
            $(this).closest('form').find('.form-error').live('hover', function () {
                $(this).removeClass('form-error');
            });
        });
    }

    function clearFilter() {
        $('.reset-all').click(function(e){
            e.preventDefault();
            $(this).closest('.filter').find('select').each(function(){
                $(this).select2('val', '');
            })
            if($('.filter-price').length > 0) {

                $('.stm-price-range').slider( 'values', [ stmOptions.min, stmOptions.max ] );

                $("#stm_filter_min_price").val(stmOptions.min);
                $("#stm_filter_max_price").val(stmOptions.max);
            }
            //$(this).closest('.classic-filter-row').find('#stm-classic-filter-submit').trigger('click');
        });
    }

    function stm_sort_listing_cars() {
        // init Isotope
        if($('.stm-isotope-sorting').length) {
            if (typeof imagesLoaded == 'function') {
                $('.stm-isotope-sorting').imagesLoaded(function() {
                    stmIsotope = $container.isotope({
                        itemSelector: '.stm-isotope-listing-item',
                        layoutMode: 'fitRows',
                        hiddenStyle: {
                            opacity: 0
                        },
                        visibleStyle: {
                            opacity: 1
                        },
                        transitionDuration: '0.5s',
                        getSortData: {
                            price: function (itemElem) {
                                var price = $(itemElem).data('price');
                                return parseFloat(price);
                            },
                            date: function (itemElem) {
                                var date = $(itemElem).data('date');
                                return parseFloat(date);
                            },
                            mileage: function (itemElem) {
                                var mileage = $(itemElem).data('mileage');
                                return parseFloat(mileage);
                            }
                        }
                    });
                });

            }
            $('.stm-select-sorting select').select2().on('change', function(){
                stm_isotope_sort_function($(this).select2('val'));
            })


        }
    }

    function stm_modern_filter_isotope() {

        if($('#modern-filter-listing').length > 0) {

            $('body').on('click', '.modern-filter-badges ul li i', function(){
                var tab_reset = $(this).data('select');
                if(tab_reset == 'price') {

                    $('.stm-price-range').slider( 'values', [ stmOptions.min, stmOptions.max ] );

                    $("#stm_filter_min_price").val(stmOptions.min);
                    $("#stm_filter_max_price").val(stmOptions.max);

                    stmIso.isotope({
                        filter: function () {
                            var itemPrice = $(this).data('price');

                            return parseInt(itemPrice, 10) >= stmOptions.min && parseInt(itemPrice, 10) <= stmOptions.max;
                        }
                    })

                    price_string = '<li><span>Price:</span> ' + stmOptions.min + ' - ' + stmOptions.max;
                    price_string += '<i class="fa fa-close stm-clear-listing-one-unit" data-select="price"></i></li>';
                    $(this).closest('li').remove();
                } else {
                    $('#' + tab_reset + ' input[type=checkbox]').each(function () {
                        if ($(this).prop('checked')) {
                            $(this).trigger('click');
                        }
                    })
                }


                /*Number of filtered*/
                if(typeof stmIsotope != 'undefined') {
                    var stmIsoData = stmIsotope.data('isotope');
                    if(typeof stmIsoData != 'undefined') {
                        if(typeof stmIsoData.filteredItems != 'undefined') {
                            $('.stm-modern-filter-found-cars span').text(stmIsoData.filteredItems.length);
                        }
                    }
                }
            })

            var stmSortClasses = '';
            var main_string = '';
            var price_string = '';
            var string = '';
            var stmIso = $('.stm-isotope-sorting');
            var stmFilterGroups = {};

            /*Checkbox clicked, filter*/
            $('#modern-filter-listing input[type=checkbox]').click(function () {
                var badges = {};
                var badges_reset = {};
                stmFilterGroups = {};
                $(window).scroll();
                var stmFirst = 0;
                stmSortClasses = '';
                var numberOfCats = 0;

                $('#modern-filter-listing input[type=checkbox]').each(function () {
                    var stmChecked = $(this).prop('checked');
                    var stmCurrentClass = $(this).attr('name');
                    var stmBadgeValue = $(this).data('name');
                    var stmBadgeId = $(this).closest('.content').attr('id');


                    var stmFilterCurrentGroup = $(this).closest('.collapse').attr('id');

                    if (stmChecked) {
                        var tab = $(this).closest('.stm-accordion-single-unit').find('.title h5').text();
                        if(typeof badges[tab] == 'undefined') {
                            badges[tab] = [];
                        }
                        if(typeof badges_reset[tab] == 'undefined') {
                            badges_reset[tab] = '';
                        }
                        badges[tab].push(stmBadgeValue);
                        badges_reset[tab] = stmBadgeId;


                        if (stmFirst == 0) {
                            stmSortClasses += '.' + stmCurrentClass;
                        } else {
                            stmSortClasses += '.' + stmCurrentClass;
                        }
                        stmFirst++;

                        if(typeof(stmFilterGroups[stmFilterCurrentGroup]) == 'undefined') {
                            stmFilterGroups[stmFilterCurrentGroup] = [];
                        }
                        stmFilterGroups[stmFilterCurrentGroup].push(stmCurrentClass);


                    }
                    if (stmSortClasses == '') {
                        stmSortClasses = '.all';
                    }

                })


                if ($('.stm-isotope-sorting').length > 0 && stmSortClasses != '') {
                    var matches = [];

                    stmIso.isotope({
                        filter: function() {
                            matches = [];
                            var itemPrice = $(this).data('price');
                            var minPrice = $('#stm_filter_min_price').val();
                            var maxPrice = $('#stm_filter_max_price').val();


                            if(Object.keys(stmFilterGroups).length > 0) {
                                for (var key in stmFilterGroups) {
                                    if (stmFilterGroups.hasOwnProperty(key)) {
                                        for (var k = 0; k < stmFilterGroups[key].length; k++) {
                                            var match = false;
                                            if ($(this).hasClass(stmFilterGroups[key][k])) {
                                                matches[key] = true;
                                            }
                                        }
                                    }
                                }


                                var final_match = false;

                                if (Object.keys(matches).length == Object.keys(stmFilterGroups).length) {
                                    if (Object.keys(matches).length > 0) {
                                        for (var m_key in matches) {
                                            if (matches.hasOwnProperty(m_key)) {
                                                if (matches[m_key]) {
                                                    final_match = true;
                                                } else {
                                                    final_match = false;
                                                }
                                            }
                                        }
                                    } else {
                                        final_match = false;
                                    }
                                }


                                if (final_match) {
                                    if(typeof minPrice != 'undefined' && typeof maxPrice != 'undefined' && typeof itemPrice != 'undefined') {
                                        return parseInt(itemPrice, 10) >= minPrice && parseInt(itemPrice, 10) <= maxPrice;
                                    } else {
                                        return ($(this));
                                    }
                                }
                            } else {
                                return ($(this));
                            }

                        }
                    })
                }



                /*create badge*/
                string = '';

                for (var key in badges) {
                    if (badges.hasOwnProperty(key)) {
                        if(badges.hasOwnProperty(key)) {
                            string += '<li><span>' + key + ':</span> ' + badges[key].join(', ');
                            if(badges_reset.hasOwnProperty(key)) {
                                string += '<i class="fa fa-close stm-clear-listing-one-unit" data-select="' + badges_reset[key] + '"></i>';
                            }
                            string += '</li>';
                            main_string = price_string + string;
                            $('.modern-filter-badges ul.stm-filter-chosen-units-list').html(main_string);
                        }
                    }
                }

                if($.isEmptyObject(badges)){
                    main_string = price_string + string;
                    $('.modern-filter-badges ul.stm-filter-chosen-units-list').html(main_string);
                };

                var badges_length = Object.keys(badges).length;

				if(badges_length > 0) {

					var badgesWidth = 0;
					var badgesMargin = 15;
					var badgesRowWidth = $('.stm-filter-chosen-units-list').outerWidth();

					$('.stm-filter-chosen-units-list li').each(function(){
						badgesWidth += $(this).outerWidth();
					});

					// Add margins
					badgesWidth += badgesMargin * (badges_length - 1);

					var row_number = (badgesWidth/badgesRowWidth) + 1;



					$('.stm-filter-chosen-units-list').css({
						height: (parseInt(row_number) * 47) + 'px'
					});

				} else {
					$('.stm-filter-chosen-units-list').css({
						height: 0
					});
				}


                /*Number of filtered*/
                if(typeof stmIsotope != 'undefined') {
                    var stmIsoData = stmIsotope.data('isotope');
                    if(typeof stmIsoData != 'undefined') {
                        if(typeof stmIsoData.filteredItems != 'undefined') {
                            $('.stm-modern-filter-found-cars span').text(stmIsoData.filteredItems.length);
                        }
                    }
                }
            })

            $(".stm-price-range").on('slide', function (event, ui) {
                var minPrice = ui.values[0];
                var maxPrice = ui.values[1];
                stmIso.isotope({
                    filter: function () {
                        	var matches = [];
                            var itemPrice = $(this).data('price');

                            if(Object.keys(stmFilterGroups).length > 0) {
                                for (var key in stmFilterGroups) {
                                    if (stmFilterGroups.hasOwnProperty(key)) {
                                        for (var k = 0; k < stmFilterGroups[key].length; k++) {
                                            var match = false;
                                            if ($(this).hasClass(stmFilterGroups[key][k])) {
                                                matches[key] = true;
                                            }
                                        }
                                    }
                                }


                                var final_match = false;

                                if (Object.keys(matches).length == Object.keys(stmFilterGroups).length) {
                                    if (Object.keys(matches).length > 0) {
                                        for (var m_key in matches) {
                                            if (matches.hasOwnProperty(m_key)) {
                                                if (matches[m_key]) {
                                                    final_match = true;
                                                } else {
                                                    final_match = false;
                                                }
                                            }
                                        }
                                    } else {
                                        final_match = false;
                                    }
                                }


                                if (final_match) {
                                    if(typeof minPrice != 'undefined' && typeof maxPrice != 'undefined' && typeof itemPrice != 'undefined') {
                                        return parseInt(itemPrice, 10) >= minPrice && parseInt(itemPrice, 10) <= maxPrice;
                                    } else {
                                        return parseInt(itemPrice, 10) >= minPrice && parseInt(itemPrice, 10) <= maxPrice;
                                    }
                                }
                            } else {
                                return parseInt(itemPrice, 10) >= minPrice && parseInt(itemPrice, 10) <= maxPrice;
                            }
                    }
                })

                /*Number of filtered*/
                if(typeof stmIsotope != 'undefined') {
                    var stmIsoData = stmIsotope.data('isotope');
                    if(typeof stmIsoData != 'undefined') {
                        if(typeof stmIsoData.filteredItems != 'undefined') {
                            $('.stm-modern-filter-found-cars span').text(stmIsoData.filteredItems.length);
                        }
                    }
                }

                price_string = '<li><span>Price:</span> ' + minPrice + ' - ' + maxPrice;
                price_string += '<i class="fa fa-close stm-clear-listing-one-unit" data-select="price"></i></li>';
                main_string = price_string + string;
                $('.modern-filter-badges ul.stm-filter-chosen-units-list').html(main_string);

                $('.stm-filter-chosen-units-list').height('47');
            });

        }
    }

    function stm_filter_links() {
        $('body').on('click', '.stm-single-filter-link', function(){
            stm_single_filter_link = true;
            var stm_name = $(this).data('slug');
            var stm_value = $(this).data('value');
            if(typeof stm_name !== 'undefined' && typeof stm_value !== 'undefined') {
                $('.reset-all').trigger('click');
                $('#stm-filter-links-input').attr('name', stm_name);
                $('#stm-filter-links-input').val(stm_value);
            }
        })
    }

    function stm_logout() {
        $('body').on('click', '.stm_logout a', function(e){
            e.preventDefault();
            $.ajax({
                url: ajaxurl,
                type: "POST",
                dataType: 'json',
                context: this,
                data: {
                    'action':'stm_logout_user'
                },
                beforeSend: function(){
                    $('.stm_add_car_form .stm-form-checking-user .stm-form-inner').addClass('activated');
                },
                success: function (data) {
                    if(data.exit) {
                        $('#stm_user_info').slideUp('fast',function(){
                            $(this).empty();
                            $('.stm-not-enabled, .stm-not-disabled').slideDown('fast');
                            $("html, body").animate({ scrollTop: $('.stm-form-checking-user').offset().top }, "slow");
                        });

                        $('.stm-form-checking-user button[type="submit"]').removeClass('enabled').addClass('disabled');
                    }
                    $('.stm_add_car_form .stm-form-checking-user .stm-form-inner').removeClass('activated');
                }
            });
        })
    }

    function stm_ajax_custom_login() {
        $('.lOffer-account-unit').mouseout(function(){
            $('.stm-login-form-unregistered').removeClass('working');
        });
        $('.stm-forgot-password a').click(function(e){
            e.preventDefault();
            $('.stm_forgot_password_send').slideToggle();
            $('.stm_forgot_password_send input[type=text]').focus();
            $(this).toggleClass('active');
        })
        $(".stm-login-form-mobile-unregistered form,.stm-login-form form:not(.stm_password_recovery), .stm-login-form-unregistered form").submit(function (e) {
            e.preventDefault();
            if(!$(this).hasClass('stm_forgot_password_send')) {
                $.ajax({
                    type: "POST",
                    url: ajaxurl,
                    dataType: 'json',
                    context: this,
                    data: $(this).serialize() + '&action=stm_custom_login',
                    beforeSend: function () {
                        $(this).find('input').removeClass('form-error');
                        $(this).find('.stm-listing-loader').addClass('visible');
                        $('.stm-validation-message').empty();

                        if ($(this).parent('.lOffer-account-unit').length > 0) {
                            $('.stm-login-form-unregistered').addClass('working');
                        }
                    },
                    success: function (data) {
                        if ($(this).parent('.lOffer-account-unit').length > 0) {
                            $('.stm-login-form-unregistered').addClass('working');
                        }
                        if (data.user_html) {
                            var $user_html = $(data.user_html).appendTo('#stm_user_info');
                            $('.stm-not-disabled, .stm-not-enabled').slideUp('fast', function () {
                                $('#stm_user_info').slideDown('fast');
                            });

                            $("html, body").animate({scrollTop: $('.stm-form-checking-user').offset().top}, "slow");
                            $('.stm-add-a-car-login-overlay,.stm-add-a-car-login').toggleClass('visiblity');

                            $('.stm-form-checking-user button[type="submit"]').removeClass('disabled').addClass('enabled');
                        }

                        $(this).find('.stm-listing-loader').removeClass('visible');
                        for (var err in data.errors) {
                            $(this).find('input[name=' + err + ']').addClass('form-error');
                        }

                        if (data.message) {
                            var message = $('<div class="stm-message-ajax-validation heading-font">' + data.message + '</div>').hide();

                            $(this).find('.stm-validation-message').append(message);
                            message.slideDown('fast');
                        }


                        if (typeof(data.redirect_url) !== 'undefined') {
                            window.location = data.redirect_url;
                        }
                    }
                });
            } else {
                /*Send passs*/
                $.ajax({
                    type: "POST",
                    url: ajaxurl,
                    dataType: 'json',
                    context: this,
                    data: $(this).serialize() + '&action=stm_restore_password',
                    beforeSend: function () {
                        $(this).find('input').removeClass('form-error');
                        $(this).find('.stm-listing-loader').addClass('visible');
                        $('.stm-validation-message').empty();
                    },
                    success: function (data) {
                        $(this).find('.stm-listing-loader').removeClass('visible');
                        if (data.message) {
                            var message = $('<div class="stm-message-ajax-validation heading-font">' + data.message + '</div>').hide();

                            $(this).find('.stm-validation-message').append(message);
                            message.slideDown('fast');
                        }
                        for (var err in data.errors) {
                            $(this).find('input[name=' + err + ']').addClass('form-error');
                        }
                    }
                });
            }
        });

        $(".stm-register-form form").submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).serialize() + '&action=stm_custom_register',
                beforeSend: function(){
                    $(this).find('input').removeClass('form-error');
                    $(this).find('.stm-listing-loader').addClass('visible');
                    $('.stm-validation-message').empty();
                },
                success: function (data) {
                    if(data.user_html) {
                        var $user_html = $(data.user_html).appendTo('#stm_user_info');
                        $('.stm-not-disabled, .stm-not-enabled').slideUp('fast', function(){
                            $('#stm_user_info').slideDown('fast');
                        });
                        $("html, body").animate({ scrollTop: $('.stm-form-checking-user').offset().top }, "slow");

                        $('.stm-form-checking-user button[type="submit"]').removeClass('disabled').addClass('enabled');
                    }

                    $(this).find('.stm-listing-loader').removeClass('visible');
                    for(var err in data.errors){
                        $(this).find('input[name=' + err + ']').addClass('form-error');
                    }

                    if(data.redirect_url) {
                        window.location = data.redirect_url;
                    }

                    if(data.message) {
                        var message = $('<div class="stm-message-ajax-validation heading-font">' + data.message + '</div>').hide();

                        $(this).find('.stm-validation-message').append(message);
                        message.slideDown('fast');
                    }
                }
            });
        });

        $('.user_validated_field').hover(function(){
            $(this).removeClass('form-error');
        });

        $('input[name="stm_accept_terms"]').on('click', function(){
            if($(this).is(':checked')) {
                $('.stm-login-register-form .stm-register-form form input[type="submit"]').removeAttr('disabled');
            } else {
                $('.stm-login-register-form .stm-register-form form input[type="submit"]').attr('disabled', '1');
            }
        });

    }

    function loadMoreDealerCars() {
        $('body').on('click', '.stm-load-more-dealer-cars a', function(e){
            e.preventDefault();

            if($(this).closest('.stm-load-more-dealer-cars').hasClass('not-clickable')) {
                return false;
            }

            var offset = $(this).attr('data-offset');
            var user_id = $(this).data('user');
            var popular = $(this).data('popular');
            var view_type = $('#stm_dealer_view_type').val();

            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'stm_ajax_dealer_load_cars',
                    offset: offset,
                    user_id: user_id,
                    popular: popular,
                    view_type: view_type
                },
                method: 'POST',
                dataType: 'json',
                context: this,
                beforeSend: function(){
                    $(this).closest('.stm-load-more-dealer-cars').addClass('not-clickable');
                },
                success: function (data) {
                    $(this).closest('.stm-load-more-dealer-cars').removeClass('not-clickable');
                    if(data.html) {
                        $(this).closest('.tab-pane').find('.car-listing-row').append(data.html);
                    }
                    if(data.new_offset) {
                        $(this).attr('data-offset', data.new_offset);
                    }
                    if(data.button == 'hide') {
                        $(this).closest('.stm-load-more-dealer-cars').slideUp();
                        $(this).closest('.tab-pane').find('.row-no-border-last').removeClass('row-no-border-last');
                    }
                }
            });
        })
    }

    function loadMoreDealerReviews() {
        $('body').on('click', '.stm-load-more-dealer-reviews a', function(e){
            e.preventDefault();

            if($(this).closest('.stm-load-more-dealer-reviews').hasClass('not-clickable')) {
                return false;
            }

            var offset = $(this).attr('data-offset');
            var user_id = $(this).data('user');

            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'stm_ajax_dealer_load_reviews',
                    offset: offset,
                    user_id: user_id,
                },
                method: 'POST',
                dataType: 'json',
                context: this,
                beforeSend: function(){
                    $(this).closest('.stm-load-more-dealer-reviews').addClass('not-clickable');
                },
                success: function (data) {
                    $(this).closest('.stm-load-more-dealer-reviews').removeClass('not-clickable');
                    if(data.html) {
                        $(this).closest('.tab-pane').find('#stm-dealer-reviews-units').append(data.html);
                    }
                    if(data.new_offset) {
                        $(this).attr('data-offset', data.new_offset);
                    }
                    if(data.button == 'hide') {
                        $(this).closest('.stm-load-more-dealer-reviews').slideUp();
                    }
                }
            });
        })
    }

    $('#stm_submit_review .button').on('click', function(e){
        e.preventDefault();

        if(!$(this).hasClass('disabled')) {

            $.ajax({
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: $(this).closest('form').serialize() + '&action=stm_submit_review',
                beforeSend: function () {
                    $(this).closest('form').find('.stm-icon-load1').addClass('activated');
                    $('#write-review-message ').slideUp();
                },
                success: function (data) {

                    console.log(data);
                    $(this).closest('form').find('.stm-icon-load1').removeClass('activated');

                    if (data.message) {
                        $('#write-review-message ').text(data.message).slideDown();
                    }

                    if(data.updated) {
                        window.location.href = data.updated;
                        location.reload();
                    }
                }
            });
        }
    })

    $('.stm-comment-dealer-wrapper .stm-bottom .stm-report-review a').click(function(e){
        e.preventDefault();

        if(!$(this).hasClass('reported')) {
            var stmID = $(this).data('id');
            $.ajax({
                type: "POST",
                url: ajaxurl,
                dataType: 'json',
                context: this,
                data: {
                    'id': stmID,
                    'action': 'stm_report_review'
                },
                beforeSend: function () {
                    $(this).addClass('reported');
                },
                success: function (data) {
                    if (data.message) {
                        $(this).text(data.message);
                    }
                }
            });
        }
    });

    $('.dealer-search-title select').on('change', function(){
        $('input[name="stm_sort_by"]').val($(this).val());
    });

    $('.stm-load-more-dealers').click(function(e){
        e.preventDefault();

        if($(this).hasClass('not-clickable')) {
            return false;
        }

        var offset = $(this).attr('data-offset');

        $.ajax({
            url: ajaxurl,
            dataType: 'json',
            context: this,
            data: $('.stm_dynamic_listing_dealer_filter form').serialize() + '&offset=' + offset + '&action=stm_load_dealers_list',
            beforeSend: function(){
               $(this).addClass('not-clickable');
            },
            success: function (data) {
                $(this).removeClass('not-clickable');
                if(data.user_html) {
                    $('.dealer-search-results table tbody').append(data.user_html);
                }
                if(data.new_offset) {
                    $('.stm-load-more-dealers').attr('data-offset', data.new_offset);
                }
                if(data.remove && data.remove === 'hide') {
                    $(this).remove();
                }
            }
        });
    });

})(jQuery);

function loadMoreCars(that,category,taxonomy,offset,per_page) {
    var $ = jQuery;
    $.ajax({
        url: ajaxurl,
        data: { action: 'stm_ajax_load_more_cars',category:category,taxonomy:taxonomy,offset: offset,per_page: per_page },
        method: 'POST',
        dataType: 'json',
        beforeSend: function(){
            $(that).addClass('not-visible');
            $(that).closest('.dp-in').find('.preloader').fadeIn(600);
        },
        success: function (data) {
            console.log(data);
            $(that).closest('.dp-in').find('.preloader').hide();
            if(data['content'] && data['appendTo']) {
                $(data['appendTo'] + ' .car-listing-row').append(data['content']);
            }
            if( data['button'] ){
                $(that).attr('onclick', data['button']).removeClass('not-visible');
            }else{
                $(data['appendTo']).find('.car-listing-actions').addClass('all-done');
                that.parent().text('');
            }
        }
    });
}
