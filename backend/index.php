<?php
require_once 'config/cors.php';
setCorsHeaders();

// Autoloader for MVC classes
spl_autoload_register(function ($class) {
    if (file_exists('core/' . $class . '.php')) {
        require_once 'core/' . $class . '.php';
    } else if (file_exists('controllers/' . $class . '.php')) {
        require_once 'controllers/' . $class . '.php';
    } else if (file_exists('models/' . $class . '.php')) {
        require_once 'models/' . $class . '.php';
    } else if (file_exists('config/' . $class . '.php')) {
        require_once 'config/' . $class . '.php';
    }
});

// Initialize Router
$router = new Router();

// Define API Routes
$router->add('GET', 'search/course', 'SearchController@course');
$router->add('GET', 'search/faculty', 'SearchController@faculty');
$router->add('GET', 'search/department', 'SearchController@department');

$router->add('GET', 'courses/list', 'CourseController@list');
$router->add('POST', 'courses/create', 'CourseController@create');

$router->add('POST', 'faculty/register', 'FacultyController@register');
$router->add('POST', 'faculty/login', 'FacultyController@login');
$router->add('PUT', 'faculty/update', 'FacultyController@update');
$router->add('POST', 'faculty/delete', 'FacultyController@delete');

$router->add('GET', 'consultations/faculty', 'ConsultationController@faculty');
$router->add('POST', 'consultations/create', 'ConsultationController@create');
$router->add('PUT', 'consultations/update', 'ConsultationController@update');
$router->add('DELETE', 'consultations/delete', 'ConsultationController@delete');

$router->add('POST', 'requests/create', 'RequestController@create');
$router->add('GET', 'requests/faculty', 'RequestController@faculty');
$router->add('GET', 'requests/student', 'RequestController@student');
$router->add('PUT', 'requests/approve', 'RequestController@approve');
$router->add('PUT', 'requests/decline', 'RequestController@decline');

// Parse URL and route
$url = isset($_GET['url']) ? $_GET['url'] : '';
// Remove .php extension if it was passed by frontend
$url = str_replace('.php', '', $url);

$router->dispatch($_SERVER['REQUEST_METHOD'], $url);
