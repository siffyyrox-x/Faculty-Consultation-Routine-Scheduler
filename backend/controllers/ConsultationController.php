<?php

class ConsultationController extends Controller {

    public function faculty() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $faculty_id = isset($_GET['faculty_id']) ? $_GET['faculty_id'] : '';

        if (empty($faculty_id)) {
            $this->errorResponse("Faculty ID required", 400);
        }

        $consultationModel = new Consultation();
        $results = $consultationModel->findByFaculty($faculty_id);

        $this->jsonResponse(["data" => $results]);
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['faculty_id']) || empty($data['course_id']) || empty($data['day_of_week']) || 
            empty($data['start_time']) || empty($data['end_time']) || empty($data['location'])) {
            $this->errorResponse("Incomplete data", 400);
        }

        $consultationModel = new Consultation();
        $consultation_id = $consultationModel->create(
            $data['faculty_id'], $data['course_id'], $data['day_of_week'], 
            $data['start_time'], $data['end_time'], $data['location']
        );

        if ($consultation_id) {
            $this->jsonResponse([
                "message" => "Consultation created successfully",
                "consultation_id" => $consultation_id
            ], 201);
        } else {
            $this->errorResponse("Unable to create consultation", 503);
        }
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['consultation_id']) || empty($data['faculty_id'])) {
            $this->errorResponse("Consultation ID and Faculty ID required", 400);
        }

        $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
        
        $consultationModel = new Consultation();
        if ($consultationModel->update(
            $data['consultation_id'], $data['faculty_id'], $data['day_of_week'], 
            $data['start_time'], $data['end_time'], $data['location'], $is_active
        )) {
            $this->jsonResponse(["message" => "Consultation updated successfully"], 200);
        } else {
            $this->errorResponse("Unable to update consultation", 503);
        }
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (empty($data['consultation_id']) || empty($data['faculty_id'])) {
            $this->errorResponse("Consultation ID and Faculty ID required", 400);
        }

        $consultationModel = new Consultation();
        if ($consultationModel->delete($data['consultation_id'], $data['faculty_id'])) {
            $this->jsonResponse(["message" => "Consultation and associated requests deleted successfully"], 200);
        } else {
            $this->errorResponse("Unable to delete consultation", 503);
        }
    }
}
