<?php

class Controller {
    /**
     * Send a JSON response with a specific HTTP status code
     */
    protected function jsonResponse($payload, $httpStatus = 200) {
        http_response_code($httpStatus);
        echo json_encode($payload);
        exit;
    }

    /**
     * Send an error response in JSON format
     */
    protected function errorResponse($errorMessage, $httpStatus = 400) {
        http_response_code($httpStatus);
        echo json_encode(['message' => $errorMessage]);
        exit;
    }

    /**
     * Parse and validate incoming JSON input
     */
    protected function getJsonInput() {
        $rawInput = file_get_contents("php://input");
        $decodedData = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->errorResponse("Malformed JSON request", 400);
        }
        return $decodedData;
    }
}
