<?php

class Consultation extends Model {

    public function findByFaculty($faculty_id) {
        $query = "SELECT 
                    c.id,
                    c.day_of_week,
                    c.start_time,
                    c.end_time,
                    c.location,
                    c.is_active,
                    co.id as course_id,
                    co.course_code,
                    co.course_name,
                    co.department
                  FROM consultations c
                  JOIN courses co ON c.course_id = co.id
                  WHERE c.faculty_id = :faculty_id
                  ORDER BY 
                    FIELD(c.day_of_week, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                    c.start_time";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":faculty_id", $faculty_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create($faculty_id, $course_id, $day_of_week, $start_time, $end_time, $location) {
        $query = "INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location, is_active) 
                  VALUES (:faculty_id, :course_id, :day_of_week, :start_time, :end_time, :location, TRUE)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":faculty_id", $faculty_id);
        $stmt->bindParam(":course_id", $course_id);
        $stmt->bindParam(":day_of_week", $day_of_week);
        $stmt->bindParam(":start_time", $start_time);
        $stmt->bindParam(":end_time", $end_time);
        $stmt->bindParam(":location", $location);
        
        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    public function update($id, $faculty_id, $day_of_week, $start_time, $end_time, $location, $is_active) {
        $query = "UPDATE consultations 
                  SET day_of_week = :day_of_week, start_time = :start_time, end_time = :end_time, location = :location, is_active = :is_active 
                  WHERE id = :id AND faculty_id = :faculty_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":day_of_week", $day_of_week);
        $stmt->bindParam(":start_time", $start_time);
        $stmt->bindParam(":end_time", $end_time);
        $stmt->bindParam(":location", $location);
        $stmt->bindParam(":is_active", $is_active, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":faculty_id", $faculty_id);
        return $stmt->execute();
    }

    public function delete($id, $faculty_id) {
        $this->db->beginTransaction();
        try {
            // Delete associated requests first
            $query1 = "DELETE FROM consultation_requests WHERE consultation_id = :id AND faculty_id = :faculty_id";
            $stmt1 = $this->db->prepare($query1);
            $stmt1->bindParam(":id", $id);
            $stmt1->bindParam(":faculty_id", $faculty_id);
            $stmt1->execute();

            $query2 = "DELETE FROM consultations WHERE id = :id AND faculty_id = :faculty_id";
            $stmt2 = $this->db->prepare($query2);
            $stmt2->bindParam(":id", $id);
            $stmt2->bindParam(":faculty_id", $faculty_id);
            $stmt2->execute();

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}
