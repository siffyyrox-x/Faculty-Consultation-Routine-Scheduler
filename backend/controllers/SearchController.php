<?php

/**
 * Search Controller
 * Handles course and faculty search requests from students.
 */
class SearchController extends Controller {

    public function course() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $course_name = isset($_GET['course_name']) ? trim($_GET['course_name']) : '';

        if (empty($course_name)) {
            $this->errorResponse("Course name required", 400);
        }

        $facultyModel = new Faculty();
        $results = $facultyModel->searchByCourse($course_name);

        $grouped = $this->groupSearchResults($results);
        $this->jsonResponse(["data" => array_values($grouped)]);
    }

    public function faculty() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $faculty_name = isset($_GET['faculty_name']) ? trim($_GET['faculty_name']) : '';

        if (empty($faculty_name)) {
            $this->errorResponse("Faculty name required", 400);
        }

        $facultyModel = new Faculty();
        $results = $facultyModel->searchByName($faculty_name);

        $grouped = $this->groupSearchResults($results);
        $this->jsonResponse(["data" => array_values($grouped)]);
    }

    public function department() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->errorResponse("Method not allowed", 405);
        }

        $dept_name = isset($_GET['dept_name']) ? trim($_GET['dept_name']) : '';

        if (empty($dept_name)) {
            $this->errorResponse("Department name required", 400);
        }

        $facultyModel = new Faculty();
        $results = $facultyModel->searchByDepartment($dept_name);

        $grouped = $this->groupSearchResults($results);
        $this->jsonResponse(["data" => array_values($grouped)]);
    }

    private function groupSearchResults($results) {
        $grouped = [];
        foreach ($results as $row) {
            $fid = $row['faculty_id'];
            if (!isset($grouped[$fid])) {
                $grouped[$fid] = [
                    'id' => $row['faculty_id'],
                    'name' => $row['faculty_name'],
                    'email' => $row['faculty_email'],
                    'department' => $row['department'],
                    'initial' => $row['initial'],
                    'desk_no' => $row['desk_no'],
                    'courses' => [],
                    'consultations' => []
                ];
            }

            if (!empty($row['course_name']) && !in_array($row['course_name'], $grouped[$fid]['courses'])) {
                $grouped[$fid]['courses'][] = $row['course_name'];
            }

            if (!empty($row['id'])) {
                // Prevent duplicate consultations if any
                $consultExists = false;
                foreach($grouped[$fid]['consultations'] as $c) {
                    if ($c['id'] == $row['id']) {
                        $consultExists = true; break;
                    }
                }
                if (!$consultExists) {
                    $grouped[$fid]['consultations'][] = [
                        'id' => $row['id'],
                        'course' => $row['course_name'],
                        'day' => $row['day_of_week'],
                        'start_time' => $row['start_time'],
                        'end_time' => $row['end_time'],
                        'location' => $row['location']
                    ];
                }
            }
        }
        return $grouped;
    }
}
