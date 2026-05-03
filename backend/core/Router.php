<?php

class Router {
    private $routes = [];

    public function add($method, $url, $action) {
        $this->routes[] = [
            'method' => $method,
            'url' => rtrim($url, '/'),
            'action' => $action
        ];
    }

    public function dispatch($requestMethod, $requestUrl) {
        // Strip trailing slash
        $requestUrl = rtrim($requestUrl, '/');

        // Allow CORS preflight requests
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
                        } catch (Exception $e) {
                            $this->sendError(500, "Server Error: " . $e->getMessage());
                        }
                        return;
                    }
                }
            }
        }

        $this->sendError(404, "Route not found");
    }

    private function sendError($code, $message) {
        http_response_code($code);
        echo json_encode(['message' => $message]);
    }
}
