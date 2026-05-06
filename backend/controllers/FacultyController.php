<?php

class FacultyController extends Controller {
    /**
     * Handle faculty login
     * POST /backend/index.php?path=faculty/login
     */
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['email']) || empty($data['password'])) {
            $this->errorResponse("Incomplete data", 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errorResponse("Invalid email format", 400);
        }

        $facultyModel = new Faculty();
        $faculty = $facultyModel->findByEmail($data['email']);

        if ($faculty) {
            if (!$faculty['is_registered']) {
                $this->errorResponse("Account not activated. Please complete your registration via the faculty portal.", 403);
            }

            if (password_verify($data['password'], $faculty['password'])) {
                $this->jsonResponse([
                    "message" => "Login successful. Welcome back, {$faculty['name']}!",
                    "faculty" => [
                        "id" => $faculty['id'],
                        "name" => $faculty['name'],
                        "email" => $faculty['email'],
                        "department" => $faculty['department'],
                        "initial" => $faculty['initial'],
                        "desk_no" => $faculty['desk_no']
                    ]
                ], 200);
            } else {
                $this->errorResponse("Invalid password. Please check your credentials and try again.", 401);
            }
        } else {
            $this->errorResponse("Authentication failed. No faculty account found with that email address.", 401);
        }
    }

    /**
     * Handle new faculty registration
     * POST /backend/index.php?path=faculty/register
     */
    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            $this->errorResponse("Incomplete data", 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errorResponse("Invalid email format", 400);
        }

        $facultyModel = new Faculty();
        
        if ($facultyModel->findByEmail($data['email'])) {
            $this->errorResponse("Email already registered", 409);
        }

        $desk_no = isset($data['desk_no']) ? $data['desk_no'] : '';
        $initial = isset($data['initial']) ? $data['initial'] : '';
        $department = isset($data['department']) ? $data['department'] : '';

        $faculty_id = $facultyModel->create($data['name'], $data['email'], $data['password'], $department, $initial, $desk_no);

        if ($faculty_id) {
            $this->jsonResponse([
                "message" => "Faculty registered successfully",
                "faculty_id" => $faculty_id
            ], 201);
        } else {
            $this->errorResponse("Unable to register faculty", 503);
        }
    }

    /**
     * Update faculty profile information
     * PUT /backend/index.php?path=faculty/update
     */
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['faculty_id'])) {
            $this->errorResponse("Faculty ID required", 400);
        }

        $facultyModel = new Faculty();

        if (!$facultyModel->findById($data['faculty_id'])) {
            $this->errorResponse("Faculty not found", 404);
        }

        if ($facultyModel->update($data['faculty_id'], $data['name'], $data['department'], $data['initial'], $data['desk_no'])) {
            $this->jsonResponse(["message" => "Faculty updated successfully"], 200);
        } else {
            $this->errorResponse("Unable to update faculty", 503);
        }
    }

    /**
     * Delete faculty account and associated data
     * DELETE /backend/index.php?path=faculty/delete
     */
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['faculty_id'])) {
            $this->errorResponse("Faculty ID required", 400);
        }

        $facultyModel = new Faculty();

        if ($facultyModel->delete($data['faculty_id'])) {
            $this->jsonResponse(["message" => "Account and all associated data deleted successfully"], 200);
        } else {
            $this->errorResponse("Unable to delete account", 500);
        }
    }
}
