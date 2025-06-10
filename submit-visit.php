<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'date' => $_POST['date'] ?? '',
        'time' => $_POST['time'] ?? '',
        'message' => $_POST['message'] ?? ''
    ];

    // Here you would typically:
    // 1. Validate the data
    // 2. Send an email notification
    // 3. Store in a database
    // 4. Return success/error response

    echo json_encode(['success' => true, 'message' => 'Visit scheduled successfully!']);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}