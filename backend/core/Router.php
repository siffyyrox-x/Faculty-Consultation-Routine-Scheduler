<?php

/**
 * Basic API Router
 * Maps incoming HTTP requests to controller actions.
 */
class Router {
    private $routes = [];

    /**
     * Register a new route
     */
    public function add($method, $url, $action) {
        $this->routes[] = [
            'method' => strtoupper($method),
            'url' => rtrim($url, '/'),
            'action' => $action
        ];
    }

    /**
     * Match and execute the requested route
     */
    public function dispatch($requestMethod, $requestUrl) {
        // Normalize URL by removing leading/trailing slashes
        $requestUrl = trim($requestUrl, '/');
        if (empty($requestUrl)) {
            $requestUrl = 'home';
        }

        // Handle CORS preflight
        if ($requestMethod === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $route['url'] === $requestUrl) {
                $action = explode('@', $route['action']);
                $controllerName = $action[0];
                $methodName = $action[1];

                if (class_exists($controllerName)) {
                    $controller = new $controllerName();
                    if (method_exists($controller, $methodName)) {
                        try {
                            $controller->$methodName();
                        } catch (Exception $exception) {
                            $this->sendError(500, "System Error: " . $exception->getMessage());
                        }
                        return;
                    }
                } else {
                    $this->sendError(500, "Application Error: Controller '{$controllerName}' is missing.");
                    return;
                }
            }
        }

        $this->sendError(404, "API Error: The endpoint '{$requestUrl}' does not exist on this server.");
    }

    private function sendError($code, $message) {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode(['message' => $message]);
    }
}
