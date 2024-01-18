<div class="modal" id="downloadPDF" tabindex="-1" role="dialog" aria-labelledby="myModalLabelDownloadPDF">
	<form id="request-download-pdf-form" action="<?php echo esc_url( home_url('/') ); ?>" method="post">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header modal-header-iconed">
					<i class="fa fa-download"></i>
					<h3 class="modal-title" id="myModalLabelDownloadPDF"><?php esc_html_e('SOUMISSION (PDF)', 'motors') ?></h3>
					<div class="test-drive-car-name"><?php echo stm_generate_title_from_slugs(get_the_id(), $show_labels = false ); ?></div>
				</div>
				<div class="modal-body">
					<p class="clearfix text-muted">
						<?php esc_html_e('Veuillez remplir les champs et appuyer sur (TÉLÉCHARGER ICI) pour que commence le téléchargement de la soumission.', 'motors'); ?>
					</p>
					<div class="row">
						<div class="col-md-6 col-sm-6">
							<div class="form-group">
								<div class="form-modal-label"><?php esc_html_e('Name', 'motors'); ?></div>
								<input name="name" type="text"/>
							</div>
						</div>
						<div class="col-md-6 col-sm-6">
							<div class="form-group">
								<div class="form-modal-label"><?php esc_html_e('Email', 'motors'); ?></div>
								<input name="email" type="email" />
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6 col-sm-6">
							<div class="form-group">
								<div class="form-modal-label"><?php esc_html_e('Phone', 'motors'); ?></div>
								<input name="phone" type="tel" />
							</div>
						</div>

					</div>
					<div class="mg-bt-25px_"></div>
					<div class="row">
						<?php
							$recaptcha_enabled = get_theme_mod('enable_recaptcha',0);
							$recaptcha_public_key = get_theme_mod('recaptcha_public_key');
							$recaptcha_secret_key = get_theme_mod('recaptcha_secret_key');
							if(!empty($recaptcha_enabled) and $recaptcha_enabled and !empty($recaptcha_public_key) and !empty($recaptcha_secret_key)):
						?>
							<div class="col-md-6 col-sm-6">
								<div class="g-recaptcha" data-sitekey="<?php echo esc_attr($recaptcha_public_key); ?>" data-size="normal"></div>
							</div>
						<?php endif; ?>
						<div class="col-md-6 col-sm-6">
							<button type="submit" class="stm-request-test-drive"><?php esc_html_e("TÉLÉCHARGER ICI", 'motors'); ?></button>
							<div class="stm-ajax-loader" style="margin-top:10px;">
								<i class="stm-icon-load1"></i>
							</div>
						</div>
					</div>
					<div class="mg-bt-25px"></div>
					<input name="vehicle_id" type="hidden" value="<?php echo esc_attr(get_the_id()); ?>" />
					<?php
					$show_pdf = get_theme_mod('show_pdf', true);
					$car_brochure = get_post_meta(get_the_ID(),'car_brochure',true);
					if(!empty($show_pdf) and $show_pdf): ?>
						<?php if(!empty($car_brochure) and $car_brochure): ?>
						<?php /* <input type="hidden" id="download_pdf_link" value="<?php echo esc_url(wp_get_attachment_url($car_brochure)); ?>" /> */ ?>
							<input type="hidden" id="download_pdf_link" value="<?php echo get_field('pdf'); ?>" />
						<?php endif; ?>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</form>
</div>
