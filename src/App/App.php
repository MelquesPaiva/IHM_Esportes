<?php

namespace Source\App;

use Source\Core\Controller;

/**
 * Class App
 * @package Source\App
 */
class App extends Controller
{
    /**
     * App Constructor
     */
    public function __construct()
    {
        parent::__construct(__DIR__ . "/../../" . CONF_VIEW_PATH . "/" . CONF_VIEW_APP);
    }

    public function home(): void
    {
        echo $this->view->render(
            "home",[]
        );
    }
}