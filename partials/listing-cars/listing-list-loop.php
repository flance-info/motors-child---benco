<?php
$regular_price_label = get_post_meta(get_the_ID(), 'regular_price_label', true);
$special_price_label = get_post_meta(get_the_ID(),'special_price_label',true);

$badge_text = get_post_meta(get_the_ID(),'badge_text',true);
$badge_bg_color = get_post_meta(get_the_ID(),'badge_bg_color',true);

$price = get_post_meta(get_the_id(),'price',true);
$sale_price = get_post_meta(get_the_id(),'sale_price',true);

$car_price_form_label = get_post_meta(get_the_ID(), 'car_price_form_label', true);

$data_price = '0';

if(!empty($price)) {
	$data_price = $price;
}

if(!empty($sale_price)) {
	$data_price = $sale_price;
}

if(empty($price) and !empty($sale_price)) {
	$price = $sale_price;
}

$mileage = get_post_meta(get_the_id(),'mileage',true);

$data_mileage = '0';

if(!empty($mileage)) {
	$data_mileage = $mileage;
}

$special_car = get_post_meta(get_the_ID(),'special_car', true);
$gallery_video = get_post_meta(get_the_ID(), 'gallery_video', true);

$middle_infos = stm_get_car_archive_listings();

$taxonomies = stm_get_taxonomies();

$categories = wp_get_post_terms(get_the_ID(), $taxonomies);

$classes = array();

if(!empty($categories)) {
	foreach($categories as $category) {
		$classes[] = $category->slug.'-'.$category->term_id;
	}
}

?>

<div
	class="listing-list-loop stm-isotope-listing-item all <?php print_r(implode(' ', $classes)); ?>"
	data-price="<?php echo esc_attr($data_price) ?>"
    data-date="<?php echo get_the_date('Ymdhi') ?>"
    data-mileage="<?php echo esc_attr($data_mileage); ?>"
	>

		<div class="image">
			<?php if(!empty($gallery_video)): ?>
				<span class="video-preview fancy-iframe" data-url="<?php echo esc_url($gallery_video); ?>"><i class="fa fa-film"></i><?php esc_html_e('Video', 'motors'); ?></span>
			<?php endif; ?>
			<a href="<?php the_permalink() ?>" class="rmv_txt_drctn">
				<div class="image-inner">
					<?php if(!empty($special_car) and $special_car == 'on'): ?>
						<?php

							if(empty($badge_text)) {
								$badge_text = esc_html__('Special', 'motors');
							}

							$badge_style = '';
							if(!empty($badge_bg_color)) {
								$badge_style = 'style=background-color:'.$badge_bg_color.';';
							}
						?>
						<div class="special-label special-label-small h6" <?php echo esc_attr($badge_style); ?>>
							<?php echo esc_html__($badge_text, 'motors'); ?>
						</div>
					<?php endif; ?>

					<?php if(has_post_thumbnail()): ?>
						<?php
							$img = wp_get_attachment_image_src(get_post_thumbnail_id(get_the_ID()), 'stm-img-796-466');
						?>
						<img
							data-src="<?php echo esc_url($img[0]); ?>"
							src="<?php echo esc_url(get_stylesheet_directory_uri().'/assets/images/plchldr350.png'); ?>"
							class="lazy img-responsive"
							alt="<?php the_title(); ?>"
						/>

					<?php else : ?>
						<?php if(stm_check_if_car_imported(get_the_id())): ?>
							<img
								src="<?php echo esc_url(get_stylesheet_directory_uri().'/assets/images/automanager_placeholders/plchldr640automanager.png'); ?>"
								class="img-responsive"
								alt="<?php esc_html_e('Placeholder', 'motors'); ?>"
								/>
						<?php else :?>
							<img
								src="<?php echo esc_url(get_stylesheet_directory_uri().'/assets/images/plchldr350.png'); ?>"
								class="img-responsive"
								alt="<?php esc_html_e('Placeholder', 'motors'); ?>"
								/>
						<?php endif; ?>
					<?php endif; ?>
				</div>
			</a>
		</div>


		<div class="content">
			<div class="meta-top">

				<?php if(!empty($price) and !empty($sale_price) and $price != $sale_price):?>
					<div class="price discounted-price">
						<div class="regular-price">
							<?php if(!empty($special_price_label)): ?>
								<span class="label-price"><?php echo esc_attr($special_price_label); ?></span>
							<?php endif; ?>
							<?php echo esc_attr(stm_listing_price_view($price)); ?>
						</div>

						<div class="sale-price">
							<?php if(!empty($regular_price_label)): ?>
								<span class="label-price"><?php echo esc_attr($regular_price_label); ?></span>
							<?php endif; ?>
							<span class="heading-font"><?php echo esc_attr(stm_listing_price_view($sale_price)); ?></span>
						</div>
					</div>
				<?php elseif(!empty($price)): ?>
					<div class="price">
						<div class="normal-price">
							<?php if(!empty($regular_price_label)): ?>
								<span class="label-price"><?php echo esc_attr($regular_price_label); ?></span>
							<?php endif; ?>
							<?php if(!empty($car_price_form_label)): ?>
								<span class="heading-font">
									<?php echo esc_attr( apply_filters( 'stm_filter_price_view', '', $price ) ); ?>
								</span>

							<?php else: ?>
								<span class="heading-font">
										<?php echo esc_attr( apply_filters( 'stm_filter_price_view', '', $price ) ); ?>
								</span>
							<?php endif; ?>
						</div>
					</div>
				<?php endif; ?>
				<div class="title heading-font">
					<a href="<?php the_permalink() ?>" class="rmv_txt_drctn">
						<?php the_title(); ?>
					</a>
				</div>
			</div>
			<?php if(!empty($middle_infos)): ?>

				<div class="meta-middle">
					<?php foreach($middle_infos as $middle_info): ?>
						<?php
							$data_meta = get_post_meta(get_the_id(), $middle_info['slug'], true);
							$data_value = '';
						?>
						<?php if(!empty($data_meta) and $data_meta != 'none' and $middle_info['slug'] != 'price'):
							if(!empty($middle_info['numeric']) and $middle_info['numeric']):
								$data_value = ucfirst($data_meta);
							else:
								$data_meta_array = explode(',',$data_meta);
								$data_value = array();

								if(!empty($data_meta_array)){
									foreach($data_meta_array as $data_meta_single) {
										$data_meta = get_term_by('slug', $data_meta_single, $middle_info['slug']);
										if(!empty($data_meta->name)) {
											$data_value[] = esc_attr($data_meta->name);
										}
									}
								}

							endif;

						endif; ?>

						<?php if(!empty($data_value) and $data_value != ''): ?>
							<?php if($middle_info['slug'] != 'price' and !empty($data_meta)): ?>
								<div class="meta-middle-unit <?php if(!empty($middle_info['font'])){ echo esc_attr('font-exists');} ?> <?php echo esc_attr($middle_info['slug']); ?>">
									<div class="meta-middle-unit-top">
										<?php if(!empty($middle_info['font'])): ?>
											<div class="icon"><i class="<?php echo esc_attr($middle_info['font']); ?>"></i></div>
										<?php endif; ?>
										<div class="name"><?php esc_html_e($middle_info['single_name'],'motors'); ?></div>
									</div>

									<div class="value h5">
										<?php
											if(is_array($data_value)){
												if(count($data_value) > 1) { ?>

													<div
														class="stm-tooltip-link"
														data-toggle="tooltip"
														data-placement="bottom"
														title="<?php echo esc_attr(implode(', ', $data_value)); ?>">
														<?php echo $data_value[0].' <span class="stm-dots">...</span>'; ?>
													</div>

												<?php } else {
													echo esc_attr(implode(', ', $data_value));
												}
											} else {
												echo esc_attr($data_value);
											}
										?>
									</div>
								</div>
							<?php endif; ?>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<!--Item options-->
			<div class="meta-bottom">
				<?php do_action( 'stm_listings_load_template', 'loop/default/list/features' ); ?>
			</div>

			<a href="<?php the_permalink(); ?>" class="stm-car-view-more button visible-xs"><?php esc_html_e('View more', 'motors'); ?></a>
		</div>

</div>
