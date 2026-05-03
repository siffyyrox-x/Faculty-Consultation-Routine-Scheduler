<?php

class Controller {
    protected function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }

    protected function errorResponse($message, $statusCode = 400) {
        http_response_code($statusCode);
        echo json_encode(['message' => $message]);
        exit;
    }

    protected function getJsonInput() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->errorResponse("Invalid JSON format", 400);
        }
        return $data;
    }
}
