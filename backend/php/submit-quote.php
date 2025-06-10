<?php

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
define('FROM_EMAIL', 'moamrsabry2005@gmail.com');        
define('FROM_NAME', 'STRADA Auto');
define('ADMIN_EMAIL', 'moamrsabry2005@gmail.com');    
define('GMAIL_APP_PASSWORD', 'cegx zzmo embw ages'); // Replace with your App Password

// Business info
define('BUSINESS_ADDRESS', '123 Main Street');
define('BUSINESS_CITY', 'Your City, State 12345');
define('BUSINESS_PHONE', '01226699307');
define('BUSINESS_WEBSITE', 'www.stradaauto.com');

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

// Collect form data
$data = [
    'name' => sanitizeInput($_POST['name'] ?? ''),
    'email' => sanitizeInput($_POST['email'] ?? ''),
    'phone' => sanitizeInput($_POST['phone'] ?? ''),
    'car' => sanitizeInput($_POST['car'] ?? ''),
    'model' => sanitizeInput($_POST['model'] ?? ''),
    'message' => sanitizeInput($_POST['message'] ?? '')
];

// Validate required fields
$errors = [];
if (empty($data['name']) || strlen($data['name']) < 2) $errors[] = 'Valid name required';
if (empty($data['email']) || !validateEmail($data['email'])) $errors[] = 'Valid email required';
if (empty($data['phone']) || !validatePhone($data['phone'])) $errors[] = 'Valid phone required';
if (empty($data['car'])) $errors[] = 'Car brand selection required';
if (empty($data['model'])) $errors[] = 'Car model selection required';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    // Generate quote request ID
    $quoteId = 'QT' . date('Ymd') . rand(1000, 9999);
    
    // Send emails
    $customerEmailSent = sendCustomerEmail($data, $quoteId);
    $adminEmailSent = sendAdminEmail($data, $quoteId);
    
    if ($customerEmailSent && $adminEmailSent) {
        echo json_encode([
            'success' => true, 
            'message' => 'Quota request submitted successfully! Confirmation email sent.',
            'quote_id' => $quoteId
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'message' => 'Quota request submitted! Email confirmation may be delayed.',
            'quote_id' => $quoteId
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function sendCustomerEmail($data, $quoteId) {
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
        $mail->Subject = 'Quota Request Confirmation - STRADA AUTO';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;'>
            <div style='background-color: #d4af37; color: white; padding: 30px; text-align: center;'>
                <h1 style='margin: 0; font-size: 2.2rem;'>STRADA Auto</h1>
                <h2 style='margin: 10px 0 0 0; font-size: 1.5rem; font-weight: normal;'>Quota Request Received</h2>
            </div>
            
            <div style='padding: 40px; background-color: white; margin: 0;'>
                <p style='font-size: 18px; color: #333; margin-bottom: 20px;'>Dear {$data['name']},</p>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 25px;'>
                    Thank you for your interest in our luxury vehicles! We have received your quota request and our team is preparing a personalized quote for you.
                </p>
                
                <div style='background-color: #f8f9fa; padding: 25px; border-left: 4px solid #d4af37; margin: 25px 0;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px; font-size: 1.3rem;'>Quota Request Details</h3>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333; width: 30%;'>Quota ID:</td>
                            <td style='padding: 8px 0; color: #555;'>#{$quoteId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Vehicle:</td>
                            <td style='padding: 8px 0; color: #555;'>{$data['car']} {$data['model']}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Phone:</td>
                            <td style='padding: 8px 0; color: #555;'>{$data['phone']}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Email:</td>
                            <td style='padding: 8px 0; color: #555;'>{$data['email']}</td>
                        </tr>
                        " . (!empty($data['message']) ? "
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold; color: #333; vertical-align: top;'>Special Requests:</td>
                            <td style='padding: 8px 0; color: #555;'>{$data['message']}</td>
                        </tr>
                        " : "") . "
                    </table>
                </div>
                
                <div style='background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;'>
                    <h4 style='color: #2c5282; margin-bottom: 10px;'>What happens next?</h4>
                    <ul style='color: #2d3748; line-height: 1.8; margin: 0; padding-left: 20px;'>
                        <li>Our sales team will prepare a detailed quota within 24 hours</li>
                        <li>We'll include pricing, financing options, and availability</li>
                        <li>A dedicated sales representative will contact you to discuss details</li>
                        <li>We can arrange a test drive at your convenience</li>
                    </ul>
                </div>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <p style='color: #555; margin-bottom: 15px;'>Questions? Contact us anytime:</p>
                    <p style='margin: 5px 0;'><strong>Phone:</strong> " . BUSINESS_PHONE . "</p>
                    <p style='margin: 5px 0;'><strong>Email:</strong> " . FROM_EMAIL . "</p>
                    <p style='margin: 5px 0;'><strong>Website:</strong> " . BUSINESS_WEBSITE . "</p>
                </div>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6; margin-top: 25px;'>
                    Thank you for considering STRADA Auto for your luxury vehicle needs. We look forward to helping you find your perfect car!
                </p>
                
                <p style='font-size: 16px; color: #333; margin-top: 20px;'>
                    Best regards,<br>
                    <strong>The STRADA Auto Team</strong>
                </p>
            </div>
            
            <div style='background-color: #2d3748; color: white; padding: 20px; text-align: center;'>
                <p style='margin: 0; font-size: 14px; color: #a0aec0;'>
                    " . BUSINESS_ADDRESS . "<br>
                    " . BUSINESS_CITY . "<br>
                    Phone: " . BUSINESS_PHONE . " | Website: " . BUSINESS_WEBSITE . "
                </p>
            </div>
        </div>";
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Customer email failed: " . $e->getMessage());
        return false;
    }
}

function sendAdminEmail($data, $quoteId) {
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
        $mail->addAddress(ADMIN_EMAIL);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Quota Request - STRADA AUTO';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #d4af37; color: white; padding: 20px; text-align: center;'>
                <h1 style='margin: 0;'>STRADA Auto</h1>
                <h2 style='margin: 10px 0 0 0; font-weight: normal;'>New Quota Request</h2>
            </div>
            
            <div style='padding: 30px; background-color: #f9f9f9;'>
                <p><strong>A new quota request has been submitted on your website.</strong></p>
                
                <div style='background-color: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px;'>Quota Request Details</h3>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; width: 30%;'>Quota ID:</td>
                            <td style='padding: 8px 0;'>#{$quoteId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Name:</td>
                            <td style='padding: 8px 0;'>{$data['name']}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Email:</td>
                            <td style='padding: 8px 0;'>{$data['email']}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Phone:</td>
                            <td style='padding: 8px 0;'>{$data['phone']}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Vehicle:</td>
                            <td style='padding: 8px 0;'>{$data['car']} {$data['model']}</td>
                        </tr>
                        " . (!empty($data['message']) ? "
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold; vertical-align: top;'>Special Requests:</td>
                            <td style='padding: 8px 0;'>{$data['message']}</td>
                        </tr>
                        " : "") . "
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold;'>Submitted:</td>
                            <td style='padding: 8px 0;'>" . date('F j, Y \a\t g:i A') . "</td>
                        </tr>
                    </table>
                </div>
                
                <div style='background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <p style='margin: 0; color: #856404;'><strong>Action Required:</strong> Please prepare and send a detailed quota to the customer within 24 hours.</p>
                </div>
                
                <p>This is an automated notification from your STRADA AUTO website.</p>
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