<?php
/**
 * @package        Picasso
 * @author         GoGetThemes
 * @copyright      2015 GoGetThemes
 * @version        Release: v1.0
 */

get_header();

?>

<div id="content-wrap" class="container boxed">
    <div class="breadcrumb row boxed">
        <div><h3><?php the_title(); ?></h3></div>
        <div><?php ggt_breadcrumbs(); ?></div>
    </div>

    <?php
    while (have_posts()) : the_post();

        if (is_left_sidebar()): ?>
            <div class="col-lg-3 col-md-3 col-sm-12">
                <?php generated_dynamic_sidebar(); ?>
            </div>
        <?php endif; ?>

        <div class="<?php echo esc_attr(get_content_cols()); ?>">
            <div class="page-content-inside">
                <div class="page-featured"><?php the_post_thumbnail(); ?></div>
                <div class="page-content-main row">
                    <?php
                    the_content();
                    ?>
                </div>
            </div>
            <?php
            // If comments are open or we have at least one comment, load up the comment template.
            if (comments_open() || get_comments_number()) {
                ?>
                <div class="page-comments clearfix">
                    <?php
                    comments_template();
                    ?>
                </div>
            <?php
            } ?>
        </div>

        <?php if (is_right_sidebar()): ?>
            <div class="col-lg-3 col-md-3 col-sm-12">
                <?php generated_dynamic_sidebar(); ?>
            </div>
        <?php endif; ?>
    <?php endwhile;
    ?>

</div>

<?php get_footer(); ?>
