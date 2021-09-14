<?php

ob_start();

require __DIR__ . '/vendor/autoload.php';

use CoffeeCode\Router\Router;

$route = new Router(url());
$route->namespace("Source\App");

$route->group(null);
$route->get("/", "App:home");


/**
 * ERROR REDIRECT
 */
if (!$route->dispatch()) {
    echo "<h1>Erro na execução de rotas</h1>";
    exit;
}

ob_end_flush();
