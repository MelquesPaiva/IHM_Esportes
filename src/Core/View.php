<?php

namespace Source\Core;

use League\Plates\Engine;

/**
 * Class View
 * @package Source\Core
 */
class View
{
    /** @var Engine */
    private Engine $engine;

    /**
     * View constructor.
     * @param string $path
     * @param string $ext
     */
    public function __construct(string $path = CONF_VIEW_PATH, string $ext = CONF_VIEW_EXT)
    {
        $this->engine = Engine::create($path, $ext);
    }

    /**
     * @param string $name
     * @param string $path
     * @param bool $fallback
     * @return View
     */
    public function path(string $name, string $path, bool $fallback = false): View
    {
        $this->engine->addFolder($name, $path, $fallback);
        return $this;
    }

    /**
     * @param string $templateName
     * @param array $data
     * @return string
     */
    public function render(string $templateName, array $data): string
    {
        return $this->engine->render($templateName, $data);
    }

    /**
     * @return Engine
     */
    public function engine(): Engine
    {
        return $this->engine();
    }
}
