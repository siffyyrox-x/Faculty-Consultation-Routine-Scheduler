<?php
// =============================================
// Database Configuration
// =============================================

class Database {
    private $host = "localhost";
    private $db_name = "faculty_consultation_db";
    private $username = "root";
    private $password = "";
    // private $host = "sql105.infinityfree.com";
    // private $db_name = "if0_40789216_faculty_consulation";
    // private $username = "if0_40789216";
    // private $password = "5EuxtFhiEVcbln";
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Connection Error: " . $e->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}
?>
