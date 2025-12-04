<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Cek method POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Method tidak valid'
    ]);
    exit;
}

// Ambil data JSON dari request body
$input = json_decode(file_get_contents('php://input'), true);

// Jika data dikirim sebagai form-data, gunakan $_POST
if (empty($input)) {
    $input = $_POST;
}

// Ambil dan bersihkan data
$project_name = cleanInput($input['project_name'] ?? '');
$description = cleanInput($input['description'] ?? '');
$technologies = cleanInput($input['technologies'] ?? '');
$demo_link = cleanInput($input['demo_link'] ?? '');
$source_link = cleanInput($input['source_link'] ?? '');
$icon = cleanInput($input['icon'] ?? '');

// Validasi data
$errors = [];

if (empty($project_name)) {
    $errors[] = 'Nama projek harus diisi';
}

if (empty($description)) {
    $errors[] = 'Deskripsi harus diisi';
}

if (empty($technologies)) {
    $errors[] = 'Teknologi harus diisi';
}

// Jika ada error
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

// Set default icon jika kosong
if (empty($icon)) {
    $icon = '🚀';
}

// Simpan ke database
try {
    $conn = getConnection();
    
    $stmt = $conn->prepare("INSERT INTO projects (project_name, description, technologies, demo_link, source_link, icon) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $project_name, $description, $technologies, $demo_link, $source_link, $icon);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Projek berhasil ditambahkan!',
            'project_id' => $stmt->insert_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Gagal menyimpan projek: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
?>