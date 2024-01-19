<?php
$theme_info = wp_get_theme();
define( 'STM_THEME_VERSION', ( WP_DEBUG ) ? time() : $theme_info->get( 'Version' ) );

add_action( 'wp_enqueue_scripts', 'stm_enqueue_parent_styles', 50 );

function stm_enqueue_parent_styles() {

	wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array('stm-theme-style'), '1.12' );
	wp_deregister_script( 'stm-theme-scripts-ajax' );
// 	wp_register_script( 'stm-theme-scripts-ajax-child', get_stylesheet_directory_uri() . '/assets/js/app-ajax.js', array( 'jquery' ), time(), true );
// 	wp_enqueue_script( 'stm-theme-scripts-ajax-child' );

	wp_enqueue_script( 'stm-theme-scripts-ajax-download-child', get_stylesheet_directory_uri() . '/assets/js/app-ajax-download.js', array( 'jquery' ), time(), true );

	wp_deregister_script('stm-lazyload');
	wp_enqueue_script( 'lazyload-child', get_stylesheet_directory_uri() . '/assets/js/lazyload.js', array( 'jquery' ), time(), true );

}

//Ajax request download pdf
function stm_ajax_add_download_pdf() {
	$response['errors'] = array();

	if ( ! filter_var( $_POST['name'], FILTER_SANITIZE_STRING ) ) {
		$response['errors']['name'] = true;
	}
	if ( ! is_email( $_POST['email'] ) ) {
		$response['errors']['email'] = true;
	}
	//if ( ! is_numeric( $_POST['phone'] ) ) {
	//	$response['errors']['phone'] = true;
	//}
	if ( empty( $_POST['phone'] ) ) {
		$response['errors']['phone'] = true;
	}


	$recaptcha = true;

							$recaptcha_enabled    = apply_filters( 'stm_me_get_nuxy_mod', 0, 'enable_recaptcha' );
							$recaptcha_public_key = apply_filters( 'stm_me_get_nuxy_mod', '', 'recaptcha_public_key' );
							$recaptcha_secret_key = apply_filters( 'stm_me_get_nuxy_mod', '', 'recaptcha_secret_key' );
	if(!empty($recaptcha_enabled) and $recaptcha_enabled and !empty($recaptcha_public_key) and !empty($recaptcha_secret_key)){
		$recaptcha = false;
		if(!empty($_POST['g-recaptcha-response'])) {
			$recaptcha = true;
		}
	}

	if ( $recaptcha ) {
		if ( empty( $response['errors'] ) and ! empty( $_POST['vehicle_id'] ) ) {
			$download_pdf['post_title']  = esc_html__( 'New request for download PDF', 'motors' ) . ' ' . get_the_title( $_POST['vehicle_id'] );
			$download_pdf['post_type']   = 'download_pdf_request';
			$download_pdf['post_status'] = 'draft';
			$download_pdf_id             = wp_insert_post( $download_pdf );
			update_post_meta( $download_pdf_id, 'name', $_POST['name'] );
			update_post_meta( $download_pdf_id, 'email', $_POST['email'] );
			update_post_meta( $download_pdf_id, 'phone', $_POST['phone'] );
			update_post_meta( $download_pdf_id, 'date', $_POST['date'] );
			$response['response'] = esc_html__( 'Your request was sent', 'motors' );
			$response['status']   = 'success';

			//Sending Mail to admin
			add_filter( 'wp_mail_content_type', 'stm_set_html_content_type' );

			$to[]      = get_bloginfo( 'admin_email' );
			$subject = esc_html__( 'Request for a download PDF', 'motors' ) . ' ' . get_the_title( $_POST['vehicle_id'] );
			$body    = esc_html__( 'Name: ', 'motors' ) .' '. sanitize_text_field($_POST['name']) . '<br/>';
			$body .= esc_html__( 'Email: ', 'motors' ) .' '. sanitize_text_field($_POST['email']) . '<br/>';
			$body .= esc_html__( 'Phone: ', 'motors' ) .' '. sanitize_text_field($_POST['phone']) . '<br/>';

			// $headers = 'From: Benco <no-reply@fermefv.ca>' . "\r\n";
			$headers = 'From: Benco <no-reply@benco.ca>' . "\r\n";
			// $to[] = 'ventas@benco.ca';

			wp_mail( $to, $subject, $body, $headers );

			remove_filter( 'wp_mail_content_type', 'stm_set_html_content_type' );
		} else {
			$response['response'] = esc_html__( 'Please fill all fields', 'motors' );
			$response['status']   = 'danger';
		}

		$response['recaptcha'] = true;
	} else {
		$response['recaptcha'] = false;
		$response['status']    = 'danger';
		$response['response']  = esc_html__( 'Please prove you\'re not a robot', 'motors' );
	}


	$response = json_encode( $response );

	echo $response;
	exit;
}

add_action( 'wp_ajax_stm_ajax_add_download_pdf', 'stm_ajax_add_download_pdf' );
add_action( 'wp_ajax_nopriv_stm_ajax_add_download_pdf', 'stm_ajax_add_download_pdf' );

STM_PostType::registerPostType(
	'download_pdf_request',
	__( 'Download PDF Requests', STM_POST_TYPE ),
	array(
		'pluralTitle' => __('Download PDF', STM_POST_TYPE),
		'supports' => array( 'title' ),
		'exclude_from_search' => true,
		'publicly_queryable' => false,
		'show_in_menu' => 'edit.php?post_type=listings'
	)
);

STM_PostType::addMetaBox( 'download_pdf_form', __( 'Credentials', STM_POST_TYPE ), array( 'download_pdf_request' ), '', '', '', array(
	'fields' => array(
		'name' => array(
			'label'   => __( 'Name', STM_POST_TYPE ),
			'type'    => 'text'
		),
		'email' => array(
			'label'   => __( 'E-mail', STM_POST_TYPE ),
			'type'    => 'text'
		),
		'phone' => array(
			'label'   => __( 'Phone', STM_POST_TYPE ),
			'type'    => 'text'
		),
	)
));
function add_alt_tags( $content ) {
  preg_match_all( '/<img (.*?)\/>/', $content, $images );
  if ( ! is_null( $images ) ) {
    foreach ( $images[1] as $index => $value ) {
      if ( preg_match( '/alt=""/', $value ) ) {
        $new_img = str_replace(
          'alt=""',
          'alt="' . esc_attr( get_the_title() ) . ' '. $index . '"',
          $images[0][$index] );
        $content = str_replace(
          $images[0][$index],
          $new_img,
          $content );
      }
    }
  }
  return $content;
}
add_filter( 'the_content', 'add_alt_tags', 99999 );

add_action('wp_footer', 'add_googleanalytics');
function add_googleanalytics() { ?>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-38328269-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-38328269-1');
</script>

<?php
}




if (!function_exists('write_log')) {

	function write_log($log) {
		if (true === WP_DEBUG) {
			if (is_array($log) || is_object($log)) {
				error_log(print_r($log, true));
			} else {
				error_log($log);
			}
		}
	}

}


add_action( 'vc_after_init', function(){

	if (function_exists('vc_map_update')){
		vc_map_update('stm_car_listing_tabbed', array(
			'html_template' => get_stylesheet_directory() . '/vc_templates/stm_car_listing_tabbed.php',
		));
	}

}, 100 );
