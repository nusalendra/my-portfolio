<?php
// Database Config
define('DB_HOST', 'localhost');
define('DB_USER', 'username_portfolio_user');
define('DB_PASS', 'password_anda');
define('DB_NAME', 'username_portfolio_db');

// Fungsi koneksi database
function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Cek koneksi
    if ($conn->connect_error) {
        die(json_encode([
            'success' => false,
            'message' => 'Koneksi database gagal: ' . $conn->connect_error
        ]));
    }
    
    // Set charset
    $conn->set_charset("utf8mb4");
    
    return $conn;
}

// Fungsi untuk membersihkan input
function cleanInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>