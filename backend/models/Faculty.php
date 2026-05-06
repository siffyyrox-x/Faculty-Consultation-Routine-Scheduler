<?php

class Faculty extends Model {

    /**
     * Search for faculty members by course name or code
     */
    public function searchByCourse($searchTerm) {
        $query = "SELECT DISTINCT 
                    f.id as faculty_id,
                    f.name as faculty_name,
                    f.email as faculty_email,
                    f.department,
                    f.initial,
                    f.desk_no,
                    co.course_name,
                    co.course_code,
                    c.id as id,
                    c.day_of_week,
                    c.start_time,
                    c.end_time,
                    c.location
                  FROM consultations c
                  JOIN faculty f ON c.faculty_id = f.id
                  JOIN courses co ON c.course_id = co.id
                  WHERE (co.course_name LIKE :course_name OR co.course_code LIKE :course_name)
                  AND f.is_registered = TRUE
                  AND c.is_active = TRUE
                  ORDER BY f.name, c.day_of_week";

        $stmt = $this->db->prepare($query);
        $search = "%{$searchTerm}%";
        $stmt->bindParam(":course_name", $search);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }

    public function searchByName($searchTerm) {
        $query = "SELECT DISTINCT 
                    f.id as faculty_id,
                    f.name as faculty_name,
                    f.email as faculty_email,
                    f.department,
                    f.initial,
                    f.desk_no,
                    co.course_name,
                    co.course_code,
                    c.id as id,
                    c.day_of_week,
                    c.start_time,
                    c.end_time,
                    c.location
                  FROM consultations c
                  JOIN faculty f ON c.faculty_id = f.id
                  LEFT JOIN courses co ON c.course_id = co.id
                  WHERE (f.name LIKE :search_term OR f.initial LIKE :search_term)
                  AND f.is_registered = TRUE
                  AND c.is_active = TRUE
                  ORDER BY f.name, c.day_of_week";

        $stmt = $this->db->prepare($query);
        $search = "%{$searchTerm}%";
        $stmt->bindParam(":search_term", $search);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function searchByDepartment($searchTerm) {
        $query = "SELECT DISTINCT 
                    f.id as faculty_id,
                    f.name as faculty_name,
                    f.email as faculty_email,
                    f.department,
                    f.initial,
                    f.desk_no,
                    co.course_name,
                    co.course_code,
                    c.id as id,
                    c.day_of_week,
                    c.start_time,
                    c.end_time,
                    c.location
                  FROM consultations c
                  JOIN faculty f ON c.faculty_id = f.id
                  LEFT JOIN courses co ON c.course_id = co.id
                  WHERE (f.department LIKE :search_term OR co.department LIKE :search_term)
                  AND f.is_registered = TRUE
                  AND c.is_active = TRUE
                  ORDER BY f.name, c.day_of_week";

        $stmt = $this->db->prepare($query);
        $search = "%{$searchTerm}%";
        $stmt->bindParam(":search_term", $search);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function findByEmail($email) {
        $query = "SELECT id, name, email, password, department, initial, desk_no, is_registered FROM faculty WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Find a faculty member by ID
     */
    public function findById($id) {
        $query = "SELECT * FROM faculty WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Create a new faculty record
     */
    public function create($name, $email, $password, $department, $initial, $desk_no) {
        $query = "INSERT INTO faculty (name, email, password, department, initial, desk_no, is_registered) 
                  VALUES (:name, :email, :password, :department, :initial, :desk_no, TRUE)";
        $stmt = $this->db->prepare($query);
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":department", $department);
        $stmt->bindParam(":initial", $initial);
        $stmt->bindParam(":desk_no", $desk_no);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return false;
    }

    public function update($id, $name, $department, $initial, $desk_no) {
        $query = "UPDATE faculty SET name = :name, department = :department, initial = :initial, desk_no = :desk_no WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":department", $department);
        $stmt->bindParam(":initial", $initial);
        $stmt->bindParam(":desk_no", $desk_no);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    public function delete($id) {
        $this->db->beginTransaction();
        try {
            $query1 = "DELETE FROM consultation_requests WHERE faculty_id = :id";
            $stmt1 = $this->db->prepare($query1);
            $stmt1->bindParam(":id", $id);
            $stmt1->execute();

            $query2 = "DELETE FROM consultations WHERE faculty_id = :id";
            $stmt2 = $this->db->prepare($query2);
            $stmt2->bindParam(":id", $id);
            $stmt2->execute();

            $query3 = "DELETE FROM faculty WHERE id = :id";
            $stmt3 = $this->db->prepare($query3);
            $stmt3->bindParam(":id", $id);
            $stmt3->execute();

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}
