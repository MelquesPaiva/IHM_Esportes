<?php

/**
 * ###############
 * ##### URL #####
 * ###############
 */

/**
 * @param string $path
 * @return string
 */
function url(string $path = null): string
{
    if ($path) {
        return CONF_URL_TEST . "/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
    }
    return CONF_URL_TEST . "/";
}


/**
 * ##################
 * ##### ASSETS #####
 * #################
 */


/**
 * @param string|null $path
 * @param string $theme
 * @return string
 */
function theme(string $path = null, $theme = CONF_VIEW_APP): string
{
    if ($path) {
        return CONF_URL_TEST . "/" . CONF_VIEW_PATH . "/{$theme}/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
    }

    return CONF_URL_TEST . "/" . CONF_VIEW_PATH . "/{$theme}";
}

/**
 * @param string|null $path
 * @return string
 */
function asset(string $path = null): string
{
    if ($path) {
        return CONF_URL_TEST . "/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
    }

    return CONF_URL_TEST;
}
