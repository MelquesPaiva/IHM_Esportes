<?php

namespace Source\Core;

use Source\Support\Message;
use stdClass;

/**
 * Abstract Class Controller
 * @package Source\Core
 */
abstract class Controller
{
    /** @var View $view */
    protected View $view;

    /** @var Message $message */
    protected Message $message;

    /**
     * Controller Constructor
     *
     * @param string|null $pathToViews
     */
    public function __construct(?string $pathToViews = null)
    {
        $this->view = new View($pathToViews, CONF_VIEW_EXT);
        $this->message = new Message();
    }
}