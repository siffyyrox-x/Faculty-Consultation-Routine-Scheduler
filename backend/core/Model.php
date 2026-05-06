<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Base Model Class
 * Provides a database connection instance to all extending models.
 */
class Model {
    /**
     * @var mysqli Database connection instance
     */
    protected $db;

    /**
     * Initialize Model and establish database connection
     */
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
}
