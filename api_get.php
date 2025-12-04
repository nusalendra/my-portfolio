<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

try {
    $conn = getConnection();
    
    // Ambil semua projek, urutkan dari yang terbaru
    $result = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
    
    $projects = [];
    while ($row = $result->fetch_assoc()) {
        $projects[] = [
            'id' => $row['id'],
            'project_name' => $row['project_name'],
            'description' => $row['description'],
            'technologies' => $row['technologies'],
            'demo_link' => $row['demo_link'],
            'source_link' => $row['source_link'],
            'icon' => $row['icon'],
            'created_at' => $row['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $projects,
        'total' => count($projects)
    ]);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
?>