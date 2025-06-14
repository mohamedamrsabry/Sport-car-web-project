<?php
// Updated submit-visit.php - Use Composer autoload instead of manual includes

// Include Composer autoload (replaces manual PHPMailer includes)
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Set content type to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Email configuration
define('FROM_EMAIL', 'stradaautogroup@gmail.com');        
define('FROM_NAME', 'STRADA Auto');
define('ADMIN_EMAIL', 'stradaautogroup@gmail.com');    
define('GMAIL_APP_PASSWORD', 'npzy phfr lgzm hwhj');

// Business info
define('BUSINESS_ADDRESS', 'OBOUR ROAD 50');
define('BUSINESS_CITY', 'Cairo, Egypt');
define('BUSINESS_PHONE', '01226699307');
define('BUSINESS_WEBSITE', 'https://stradauto.onrender.com/');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Validation functions
function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    return preg_match('/^[\+]?[1-9][\d]{0,15}$/', preg_replace('/\D/', '', $phone));
}

function validateDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date && $d >= new DateTime();
}

// Collect form data
$data = [
    'name' => sanitizeInput($_POST['name'] ?? ''),
    'email' => sanitizeInput($_POST['email'] ?? ''),
    'phone' => sanitizeInput($_POST['phone'] ?? ''),
    'date' => sanitizeInput($_POST['date'] ?? ''),
    'time' => sanitizeInput($_POST['time'] ?? ''),
    'message' => sanitizeInput($_POST['message'] ?? '')
];

// Validate
$errors = [];
if (empty($data['name']) || strlen($data['name']) < 2) $errors[] = 'Valid name required';
if (empty($data['email']) || !validateEmail($data['email'])) $errors[] = 'Valid email required';
if (empty($data['phone']) || !validatePhone($data['phone'])) $errors[] = 'Valid phone required';
if (empty($data['date']) || !validateDate($data['date'])) $errors[] = 'Valid future date required';
if (empty($data['time'])) $errors[] = 'Time selection required';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    $appointmentId = date('Ymd') . rand(1000, 9999);
    
    $customerEmailSent = sendCustomerEmail($data, $appointmentId);
    $adminEmailSent = sendAdminEmail($data, $appointmentId);
    
    if ($customerEmailSent && $adminEmailSent) {
        echo json_encode([
            'success' => true, 
            'message' => 'Visit scheduled successfully! Confirmation email sent.',
            'appointment_id' => $appointmentId
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'message' => 'Visit scheduled! Email confirmation may be delayed.',
            'appointment_id' => $appointmentId
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function sendCustomerEmail($data, $appointmentId) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = FROM_EMAIL;
        $mail->Password = GMAIL_APP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress($data['email'], $data['name']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Showroom Visit Confirmation - STRADA Auto';
        
        $appointmentDate = date('l, F j, Y', strtotime($data['date']));
        $appointmentTime = date('g:i A', strtotime($data['time']));
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #d4af37; color: white; padding: 20px; text-align: center;'>
                <h1>STRADA Auto</h1>
                <h2>Visit Confirmation</h2>
            </div>
            
            <div style='padding: 30px; background-color: #f9f9f9;'>
                <p>Dear {$data['name']},</p>
                
                <p>Thank you for scheduling your showroom visit!</p>
                
                <div style='background-color: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;'>
                    <h3>Appointment Details</h3>
                    <p><strong>ID:</strong> #{$appointmentId}</p>
                    <p><strong>Date:</strong> {$appointmentDate}</p>
                    <p><strong>Time:</strong> {$appointmentTime}</p>
                    <p><strong>Phone:</strong> {$data['phone']}</p>
                    " . (!empty($data['message']) ? "<p><strong>Special Requests:</strong> {$data['message']}</p>" : "") . "
                </div>
                
                <p>We look forward to seeing you!</p>
                <p>Best regards,<br>STRADA Auto Team</p>
            </div>
        </div>";
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Customer email failed: " . $e->getMessage());
        return false;
    }
}

function sendAdminEmail($data, $appointmentId) {
    $mail = new PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = FROM_EMAIL;
        $mail->Password = GMAIL_APP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress(ADMIN_EMAIL);
        
        $mail->isHTML(true);
        $mail->Subject = 'New Showroom Visit Request';
        
        $appointmentDate = date('l, F j, Y', strtotime($data['date']));
        $appointmentTime = date('g:i A', strtotime($data['time']));
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px;'>
            <h2>New Showroom Visit Request</h2>
            <div style='background-color: #f9f9f9; padding: 20px;'>
                <p><strong>Appointment ID:</strong> #{$appointmentId}</p>
                <p><strong>Name:</strong> {$data['name']}</p>
                <p><strong>Email:</strong> {$data['email']}</p>
                <p><strong>Phone:</strong> {$data['phone']}</p>
                <p><strong>Date:</strong> {$appointmentDate}</p>
                <p><strong>Time:</strong> {$appointmentTime}</p>
                " . (!empty($data['message']) ? "<p><strong>Message:</strong> {$data['message']}</p>" : "") . "
            </div>
        </div>";
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Admin email failed: " . $e->getMessage());
        return false;
    }
}
?>