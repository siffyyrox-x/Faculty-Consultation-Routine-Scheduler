<?php
// =============================================
// Database Configuration
// =============================================

/**
 * Database Configuration
 * Manages connection parameters and PDO initialization.
 */
class Database {
    private $host = "localhost";
    private $database_name = "faculty_consultation_db";
    private $username = "root";
    private $password = "";
    // private $host = "sql105.infinityfree.com";
    // private $database_name = "if0_40789216_faculty_consulation";
    // private $username = "if0_40789216";
    // private $password = "5EuxtFhiEVcbln";
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(["message" => "Database Connection Failed: " . $exception->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}
?>
