<?php

/**
 * Base Controller Class
 * Handles common response methods and input parsing for all controllers.
 */
class Controller {
    /**
     * Send a JSON response with a specific HTTP status code
     * 
     * @param mixed $payload Data to be encoded and sent
     * @param int $httpStatus HTTP status code (default: 200)
     * @return void
     */
    protected function jsonResponse($payload, $httpStatus = 200) {
        header('Content-Type: application/json');
        http_response_code($httpStatus);
        echo json_encode($payload);
        exit;
    }

    /**
     * Send an error response in JSON format
     * 
     * @param string $errorMessage Description of the error
     * @param int $httpStatus HTTP status code (default: 400)
     * @return void
     */
    protected function errorResponse($errorMessage, $httpStatus = 400) {
        header('Content-Type: application/json');
        http_response_code($httpStatus);
        echo json_encode(['message' => $errorMessage]);
        exit;
    }

    /**
     * Parse and validate incoming JSON input from the request body
     * 
     * @return array Decoded associative array
     */
    protected function getJsonInput() {
        $rawInput = file_get_contents("php://input");
        $decodedData = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->errorResponse("Malformed JSON request. Please check your payload syntax.", 400);
        }
        return $decodedData;
    }
}
