<?php

class Request extends Model {

    public function findByFaculty($faculty_id) {
        $query = "SELECT cr.id, cr.student_name, cr.student_email, cr.message, cr.status, cr.response_message, cr.created_at, c.day_of_week, c.start_time, c.end_time, co.course_name 
                  FROM consultation_requests cr
                  LEFT JOIN consultations c ON cr.consultation_id = c.id
                  LEFT JOIN courses co ON c.course_id = co.id
                  WHERE cr.faculty_id = :faculty_id
                  ORDER BY cr.created_at DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":faculty_id", $faculty_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findByStudentEmail($email) {
        $query = "SELECT cr.id, cr.student_name, cr.status, cr.message, cr.response_message, cr.created_at, f.name as faculty_name, co.course_name, c.day_of_week, c.start_time, c.location
                  FROM consultation_requests cr
                  LEFT JOIN faculty f ON cr.faculty_id = f.id
                  LEFT JOIN consultations c ON cr.consultation_id = c.id
                  LEFT JOIN courses co ON c.course_id = co.id
                  WHERE cr.student_email = :email
                  ORDER BY cr.created_at DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $query = "SELECT cr.id, cr.student_name, cr.status, cr.student_email, f.name, co.course_name, c.day_of_week, c.start_time, c.location
                  FROM consultation_requests cr
                  LEFT JOIN faculty f ON cr.faculty_id = f.id
                  LEFT JOIN consultations c ON cr.consultation_id = c.id
                  LEFT JOIN courses co ON c.course_id = co.id
                  WHERE cr.id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Create a new consultation request
     */
    public function create($faculty_id, $consultation_id, $student_name, $student_email, $message) {
        $query = "INSERT INTO consultation_requests (faculty_id, consultation_id, student_name, student_email, message) 
                  VALUES (:faculty_id, :consultation_id, :name, :email, :message)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":faculty_id", $faculty_id);
        $stmt->bindParam(":consultation_id", $consultation_id);
        $stmt->bindParam(":name", $student_name);
        $stmt->bindParam(":email", $student_email);
        $stmt->bindParam(":message", $message);
        
        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    public function updateStatus($id, $status, $response_message = null) {
        $query = "UPDATE consultation_requests SET status = :status, response_message = :response_message WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":response_message", $response_message);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * Count pending requests for a specific faculty member
     */
    public function countPendingByFaculty($faculty_id) {
        $query = "SELECT COUNT(*) as total FROM consultation_requests WHERE faculty_id = :faculty_id AND status = 'pending'";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":faculty_id", $faculty_id);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row['total'];
    }
}
