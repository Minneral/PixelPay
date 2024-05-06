<?php

class RESPONSE_STATUS
{
    const OK = 'OK';
    const ERROR = 'ERROR';
}

class Response
{
    public static function send_response(string $status, int $code, $data, ?string $message = "")
    {
        http_response_code($code);
        $response = array(
            "status" => $status,
            "message" => $message,
        );

        if ($status == RESPONSE_STATUS::OK)
            $response["data"] = $data;

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }
}
