<?php

/*
Plugin Name: Mje Realtime
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: A brief description of the Plugin.
Version: 1.0
Author: duoc
Author URI: http://URI_Of_The_Plugin_Author
License: A "Slug" license name e.g. GPL2
*/
define('MJE_REALTIME__PLUGIN_URL', plugin_dir_url(__FILE__));
define('MJE_REALTIME__PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MJE_TIME__VERSION', '1.0.0');

function mje_realtime_enqueue_script()
{
    wp_enqueue_script('mje-script', MJE_REALTIME__PLUGIN_URL.'/js/script.js', array('jquery', 'underscore', 'backbone', 'appengine'), MJE_TIME__VERSION, true);
}
add_action('wp_enqueue_scripts', 'mje_realtime_enqueue_script');

function mje_realtime_render_template()
{
    include_once MJE_REALTIME__PLUGIN_DIR.'/template-js/new-job-notify.php';
}
add_action('wp_footer', 'mje_realtime_render_template');

function mje_realtime_on_post_status($new_status, $old_status, $post)
{
    if (wp_is_post_revision($post->ID)) {
        return;
    }

    if ($old_status == 'auto-draft') {
        return;
    }

    $action = sprintf('%s_%s_%s', strtoupper($post->post_type), strtoupper($old_status), strtoupper($new_status));
    $args = array(
        'method' => 'POST',
        'timeout' => 45,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking' => true,
        'headers' => array(),
        'body' => json_encode(array('action' => $action, 'post' => $post)),
        'cookies' => array(),
    );
    wp_remote_post('http://139.59.241.200:8081/mje/notify', $args);
}
add_action('transition_post_status', 'mje_realtime_on_post_status', 10, 3);
