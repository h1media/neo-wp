<?php
/**
 * Insert your custom code below.
 * It will be executed before main-theme functions.php
 */

function reset_scripts()
{
    wp_enqueue_script('main', get_stylesheet_directory_uri() . '/js/main.js', array(), '1.0', true);
}

add_action('wp_enqueue_scripts', 'reset_scripts');
