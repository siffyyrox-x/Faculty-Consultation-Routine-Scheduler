<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    echo "Starting Migration...\n";

    // 1. Add 'initial' column if not exists
    $check = $db->query("SHOW COLUMNS FROM faculty LIKE 'initial'");
    if ($check->rowCount() == 0) {
        $db->exec("ALTER TABLE faculty ADD COLUMN initial VARCHAR(10) AFTER name");
        echo "Added 'initial' column.\n";
    }

    // 2. Populate 'initial' from 'name' (First 3 chars upper)
    $db->exec("UPDATE faculty SET initial = UPPER(SUBSTRING(name, 1, 3)) WHERE initial IS NULL OR initial = ''");
    echo "Populated default initials.\n";

    // 3. Drop 'phone' column if exists
    $checkPhone = $db->query("SHOW COLUMNS FROM faculty LIKE 'phone'");
    if ($checkPhone->rowCount() > 0) {
        $db->exec("ALTER TABLE faculty DROP COLUMN phone");
        echo "Dropped 'phone' column.\n";
    }

    echo "Migration Complete Successfully.\n";

} catch (PDOException $e) {
    echo "Migration Failed: " . $e->getMessage() . "\n";
}
?>