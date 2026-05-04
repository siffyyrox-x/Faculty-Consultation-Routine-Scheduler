<?php

class Course extends Model {

    public function getAll() {
        $query = "SELECT id, course_code, course_name, department 
                  FROM courses 
                  ORDER BY department, course_name";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findByCode($course_code) {
        $query = "SELECT id FROM courses WHERE course_code = :course_code";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":course_code", $course_code);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function create($course_code, $course_name, $department) {
        $query = "INSERT INTO courses (course_code, course_name, department) 
                  VALUES (:course_code, :course_name, :department)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":course_code", $course_code);
        $stmt->bindParam(":course_name", $course_name);
        $stmt->bindParam(":department", $department);
        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    /**
     * Get all courses belonging to a specific department
     */
    public function findByDepartment($department) {
        $query = "SELECT id, course_code, course_name FROM courses WHERE department = :dept ORDER BY course_code";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":dept", $department);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
