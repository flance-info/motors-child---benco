<?php
$car_price_form_label      = get_post_meta( get_the_ID(), 'car_price_form_label', true );
$gallery_hover_interaction = apply_filters( 'stm_me_get_nuxy_mod', false, 'gallery_hover_interaction' );

// Compare.
if ( apply_filters( 'stm_is_boats', false ) ) {
	$show_compare = apply_filters( 'stm_me_get_nuxy_mod', false, 'show_listing_compare' );

	$placeholder_path = 'plchldr255.png';
	if ( apply_filters( 'stm_is_boats', false ) ) {
		$placeholder_path = 'boats-placeholders/boats-250.png';
	}
}
?>
<div class="col-md-3 col-sm-4 col-xs-12 col-xxs-12 stm-template-front-loop">
	<a href="<?php the_permalink(); ?>" class="rmv_txt_drctn xx">
		<div class="image">
			<?php
			if ( has_post_thumbnail() ) :
				$img_2x = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'stm-img-796-466' );
				if ( true === $gallery_hover_interaction && ! wp_is_mobile() ) {
					$thumbs = apply_filters( 'stm_get_hoverable_thumbs', array(), get_the_ID(), 'stm-img-255-135' );
					if ( empty( $thumbs['gallery'] ) || 1 === count( $thumbs['gallery'] ) ) :
						echo wp_get_attachment_image(
							get_post_thumbnail_id( get_the_ID() ),
							'stm-img-255-135',
							false,
							array(
								'data-retina' => $img_2x[0],
								'alt'         => get_the_title(),
							)
						);
					else :
						$array_keys    = array_keys( $thumbs['gallery'] );
						$last_item_key = array_pop( $array_keys );
						?>
						<div class="interactive-hoverable">
							<div class="hoverable-wrap">
								<?php
								foreach ( $thumbs['gallery'] as $key => $img_url ) :
									?>
									<div class="hoverable-unit <?php echo ( 0 === $key ) ? 'active' : ''; ?>">
										<div class="thumb">
											<?php if ( $key === $last_item_key && 5 === count( $thumbs['gallery'] ) && 0 < $thumbs['remaining'] ) : ?>
												<div class="remaining">
													<i class="stm-icon-album"></i>
													<p>
														<?php
														/* translators: number of remaining photos */
														echo esc_html( sprintf( _n( '%d more photo', '%d more photos', $thumbs['remaining'], 'motors' ), $thumbs['remaining'] ) );
														?>
													</p>
												</div>
											<?php endif; ?>
											<?php if ( is_array( $img_url ) ) : ?>
												<img
													data-src="<?php echo esc_url( $img_url[0] ); ?>"
													srcset="<?php echo esc_url( $img_url[0] ); ?> 1x, <?php echo esc_url( $img_url[1] ); ?> 2x"
													src="<?php echo esc_url( $img_url[0] ); ?>"
													class="lazy img-responsive"
													alt="<?php echo esc_attr( get_the_title( get_the_ID() ) ); ?>" >
											<?php else : ?>
												<img src="<?php echo esc_url( $img_url ); ?>" class="lazy img-responsive" alt="<?php echo esc_attr( get_the_title( get_the_ID() ) ); ?>" >
											<?php endif; ?>
										</div>
									</div>
								<?php
								endforeach;

								get_template_part( 'partials/listing-cars/listing-directory', 'badges' );
								?>
							</div>
							<div class="hoverable-indicators">
								<?php
								$first = true;
								foreach ( $thumbs['gallery'] as $thumb ) :
									?>
									<div class="indicator <?php echo ( $first ) ? 'active' : ''; ?>"></div>
									<?php
									$first = false;
								endforeach;
								?>
							</div>
						</div>
					<?php
					endif;
				} else {
					echo wp_get_attachment_image(
						get_post_thumbnail_id( get_the_ID() ),
						'stm-img-255-135',
						false,
						array(
							'data-retina' => ( ! empty( $img_2x[0] ) ) ? $img_2x[0] : '',
							'alt'         => get_the_title(),
						)
					);

					get_template_part( 'partials/listing-cars/listing-directory', 'badges' );
				}
			else :
				?>
				<?php if ( stm_check_if_car_imported( get_the_id() ) ) : ?>
				<img
					src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/automanager_placeholders/plchldr255automanager.png' ); ?>"
					class="img-responsive"
					alt="<?php esc_attr_e( 'Placeholder', 'motors' ); ?>"
				/>
				<?php
				get_template_part( 'partials/listing-cars/listing-directory', 'badges' );
			else :
				?>
				<img
					src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/images/plchldr255.png' ); ?>"
					class="img-responsive"
					alt="<?php esc_attr_e( 'Placeholder', 'motors' ); ?>"
				/>
				<?php

				get_template_part( 'partials/listing-cars/listing-directory', 'badges' );
			endif;
			endif;

			if ( apply_filters( 'stm_is_boats', false ) ) {
				stm_get_boats_image_hover( get_the_ID() );
				?>
				<!--Compare-->
				<?php if ( ! empty( $show_compare ) && $show_compare ) : ?>
					<div
						class="stm-listing-compare stm-compare-directory-new"
						data-post-type="<?php echo esc_attr( get_post_type( get_the_ID() ) ); ?>"
						data-id="<?php echo esc_attr( get_the_id() ); ?>"
						data-title="<?php echo wp_kses_post( apply_filters( 'stm_generate_title_from_slugs', get_the_title( get_the_ID() ), get_the_ID(), false ) ); ?>"
						data-toggle="tooltip" data-placement="<?php echo ( apply_filters( 'stm_is_boats', false ) ) ? 'left' : 'bottom'; ?>"
						title="<?php esc_attr_e( 'Add to compare', 'motors' ); ?>"
					>
						<i class="stm-boats-icon-add-to-compare"></i>
					</div>
				<?php
				endif;
			}
			?>
		</div>
		<div class="listing-car-item-meta">
			<div class="car-meta-top heading-font clearfix">
				<?php
				$price      = get_post_meta( get_the_id(), 'price', true );
				$sale_price = get_post_meta( get_the_id(), 'sale_price', true );
				if ( empty( $price ) && ! empty( $sale_price ) ) {
					$price = $sale_price;
				}
				?>
				<?php if ( ! empty( $car_price_form_label ) ) : ?>
					<div class="price">
						<div class="normal-price"><?php echo esc_html( $car_price_form_label ); ?></div>
					</div>
				<?php else : ?>
					<?php if ( ! empty( $price ) && ! empty( $sale_price ) && $price !== $sale_price ) : ?>
						<div class="price discounted-price">
							<div class="regular-price"><?php echo esc_html( apply_filters( 'stm_filter_price_view', '', $price ) ); ?></div>
							<div class="sale-price"><?php echo esc_html( apply_filters( 'stm_filter_price_view', '', $sale_price ) ); ?></div>
						</div>
					<?php elseif ( ! empty( $price ) ) : ?>
						<div class="price">
							<div class="normal-price"><?php echo esc_html( apply_filters( 'stm_filter_price_view', '', $price ) ); ?></div>
						</div>
					<?php endif; ?>
				<?php endif; ?>
				<div class="car-title">
					<?php echo esc_html( trim( preg_replace( '/\s+/', ' ', substr( apply_filters( 'stm_generate_title_from_slugs', get_the_title( get_the_ID() ), get_the_ID() ), 0, 35 ) ) ) ); ?>
					<?php
					if ( strlen( apply_filters( 'stm_generate_title_from_slugs', get_the_title( get_the_ID() ), get_the_ID() ) ) > 35 ) {
						echo '...';
					}
					?>
				</div>
			</div>

			<?php $labels = apply_filters( 'stm_get_car_listings', array() ); ?>
			<?php if ( ! empty( $labels ) ) : ?>
				<div class="car-meta-bottom">
					<ul>
						<?php foreach ( $labels as $label ) : ?>
							<?php $label_meta = get_post_meta( get_the_id(), $label['slug'], true ); ?>
							<?php if ( ! empty( $label_meta ) && ! apply_filters( 'stm_is_listing_price_field', true, $label['slug'] ) ) : ?>
								<li>
									<?php if ( ! empty( $label['font'] ) ) : ?>
										<i class="<?php echo esc_attr( $label['font'] ); ?>"></i>
									<?php endif; ?>

									<?php if ( ! empty( $label['numeric'] ) && $label['numeric'] ) : ?>
										<span><?php echo esc_html( $label_meta ); ?></span>
									<?php else : ?>

										<?php
										$data_meta_array = explode( ',', $label_meta );
										$datas           = array();

										if ( ! empty( $data_meta_array ) ) {
											foreach ( $data_meta_array as $data_meta_single ) {
												$data_meta = get_term_by( 'slug', $data_meta_single, $label['slug'] );
												if ( ! empty( $data_meta->name ) ) {
													$datas[] = esc_attr( $data_meta->name );
												}
											}
										}

										if ( ! empty( $datas ) ) :
											if ( count( $datas ) > 1 ) :
												?>
												<span
													class="stm-tooltip-link"
													data-toggle="tooltip"
													data-placement="bottom"
													title="<?php echo esc_attr( implode( ', ', $datas ) ); ?>">
													<?php echo esc_html( $datas[0] ) . '<span class="stm-dots dots-aligned">...</span>'; ?>
												</span>
											<?php else : ?>
												<span><?php echo esc_html( implode( ', ', $datas ) ); ?></span>
											<?php endif; ?>
										<?php endif; ?>

									<?php endif; ?>
								</li>
							<?php endif; ?>

						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>

		</div>
	</a>
</div>
