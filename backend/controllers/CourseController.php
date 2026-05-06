<?php

/**
 * Course Controller
 * Manages academic courses and department listings.
 */
class CourseController extends Controller {

    public function list() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $courseModel = new Course();
        $results = $courseModel->getAll();

        $this->jsonResponse(["data" => $results]);
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->errorResponse("Method not allowed", 405);
        }

        $data = $this->getJsonInput();

        if (!empty($data['course_code']) && !empty($data['course_name']) && !empty($data['department'])) {
            $courseModel = new Course();

            if ($courseModel->findByCode($data['course_code'])) {
                $this->errorResponse("Course code already exists", 409);
            }

            $course_id = $courseModel->create($data['course_code'], $data['course_name'], $data['department']);

            if ($course_id) {
                $this->jsonResponse([
                    "message" => "Course created successfully",
                    "course_id" => $course_id
                ], 201);
            } else {
                $this->errorResponse("Unable to create course", 503);
            }
        } else {
            $this->errorResponse("Incomplete data. Required: course_code, course_name, department", 400);
        }
    }
}
