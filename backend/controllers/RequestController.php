<?php
require_once __DIR__ . '/../utils/email.php';

class RequestController extends Controller {

    public function faculty() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $faculty_id = isset($_GET['faculty_id']) ? $_GET['faculty_id'] : '';

        if (empty($faculty_id)) {
            $this->errorResponse("Faculty ID required", 400);
        }

        $requestModel = new Request();
        $results = $requestModel->findByFaculty($faculty_id);

        $this->jsonResponse(["data" => $results]);
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();
        
        if (empty($data['faculty_id']) || empty($data['student_email']) || empty($data['student_name']) || empty($data['message'])) {
            $this->errorResponse("Incomplete data. Name, Email and Message are required.", 400);
        }

        if (!filter_var($data['student_email'], FILTER_VALIDATE_EMAIL)) {
            $this->errorResponse("Invalid email format", 400);
        }

        // Validate faculty and consultation exist
        $facultyModel = new Faculty();
        if (!$facultyModel->findById($data['faculty_id'])) {
            $this->errorResponse("Faculty not found", 404);
        }

        $requestModel = new Request();
        $request_id = $requestModel->create(
            $data['faculty_id'], 
            isset($data['consultation_id']) ? $data['consultation_id'] : null, 
            $data['student_name'],
            $data['student_email'], 
            $data['message']
        );

        if ($request_id) {
            $this->jsonResponse(["message" => "Request submitted successfully"], 201);
        } else {
            $this->errorResponse("Unable to submit request", 503);
        }
    }

    public function student() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $email = isset($_GET['email']) ? trim($_GET['email']) : '';

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errorResponse("Valid Student Email required", 400);
        }

        $requestModel = new Request();
        $results = $requestModel->findByStudentEmail($email);

        $this->jsonResponse(["data" => $results]);
    }

    public function approve() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['request_id'])) {
            $this->errorResponse("Request ID required", 400);
        }

        $requestModel = new Request();
        $request = $requestModel->findById($data['request_id']);

        if (!$request) {
            $this->errorResponse("Request not found", 404);
        }

        if ($request['status'] !== 'pending') {
            $this->errorResponse("Request already " . $request['status'], 400);
        }

        $response_message = isset($data['response_message']) ? $data['response_message'] : null;
        if ($requestModel->updateStatus($data['request_id'], 'approved', $response_message)) {
            $subject = "Consultation Request Approved";
            $message = "<h2>Your consultation request has been approved!</h2>";
            $message .= "<p><strong>Faculty:</strong> {$request['name']}</p>";
            $message .= "<p><strong>Course:</strong> {$request['course_name']}</p>";
            $message .= "<p><strong>Day:</strong> {$request['day_of_week']}</p>";
            $message .= "<p><strong>Time:</strong> {$request['start_time']}</p>";
            $message .= "<p><strong>Location:</strong> {$request['location']}</p>";

            if (!empty($data['response_message'])) {
                $message .= "<p><strong>Message from Faculty:</strong> " . htmlspecialchars($data['response_message']) . "</p>";
            }

            sendEmail($request['student_email'], $subject, $message);

            $this->jsonResponse(["message" => "Request approved and email sent"], 200);
        } else {
            $this->errorResponse("Unable to approve request", 503);
        }
    }

    public function decline() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['request_id'])) {
            $this->errorResponse("Request ID required", 400);
        }

        $requestModel = new Request();
        $request = $requestModel->findById($data['request_id']);

        if (!$request) {
            $this->errorResponse("Request not found", 404);
        }

        if ($request['status'] !== 'pending') {
            $this->errorResponse("Request already " . $request['status'], 400);
        }

        $response_message = isset($data['response_message']) ? $data['response_message'] : null;
        if ($requestModel->updateStatus($data['request_id'], 'denied', $response_message)) {
            $subject = "Consultation Request Denied";
            $message = "<h2>Your consultation request has been denied.</h2>";
            $message .= "<p><strong>Faculty:</strong> {$request['name']}</p>";
            if (!empty($request['course_name'])) {
                $message .= "<p><strong>Course:</strong> {$request['course_name']}</p>";
            }

            if (!empty($data['response_message'])) {
                $message .= "<p><strong>Message from Faculty:</strong> " . htmlspecialchars($data['response_message']) . "</p>";
            }

            sendEmail($request['student_email'], $subject, $message);

            $this->jsonResponse(["message" => "Request denied and email sent"], 200);
        } else {
            $this->errorResponse("Unable to decline request", 503);
        }
    }
}
