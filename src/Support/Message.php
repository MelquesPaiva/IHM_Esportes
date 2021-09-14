<?php

namespace Source\Support;

use Source\Core\Session;

/**
 * Class Message
 * @package Source\Support
 */
class Message
{
    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->render();
    }

    /** @var string */
    private string $typeMessage = "";

    /** @var string */
    private string $message = "";

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->typeMessage;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function success(string $message): Message
    {
        $this->typeMessage = "success";
        $this->message = $this->filterMessage($message);
        return $this;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function info(string $message): Message
    {
        $this->typeMessage = "info";
        $this->message = $this->filterMessage($message);
        return $this;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function warning(string $message): Message
    {
        $this->typeMessage = "warning";
        $this->message = $this->filterMessage($message);
        return $this;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function error(string $message): Message
    {
        $this->typeMessage = "error";
        $this->message = $this->filterMessage($message);
        return $this;
    }

    /**
     * @param string $typeMessage
     * @param string $message
     * @return $this
     */
    public function generic(string $typeMessage, string $message): Message
    {
        $this->typeMessage = $typeMessage;
        $this->message = $this->filterMessage($message);
        return $this;
    }

    /**
     * @param string $message
     * @return string
     */
    private function filterMessage(string $message): string
    {
        return filter_var($message, FILTER_DEFAULT);
    }

    public function flash(): void
    {
        (new Session())->set("flash", $this);
    }

    /**
     * @param string $complementClass
     * @return string
     */
    public function render(string $complementClass = ""): string
    {
        return "<div class='message {$this->getType()} {$complementClass}'>{$this->getMessage()}</div>";
    }
}
