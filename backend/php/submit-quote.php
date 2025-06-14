<?php

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Set content type to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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

// Enable error logging for debugging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// If JSON is empty, try to get data from regular POST
if (empty($data) && !empty($_POST)) {
    $data = $_POST;
}

// If still no data, return error
if (empty($data)) {
    echo json_encode([
        'success' => false, 
        'message' => 'No data received'
    ]);
    exit;
}

// Validation functions
function sanitizeInput($data) {
    if (is_null($data)) return '';
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    // Basic phone validation - adjust pattern as needed
    return preg_match('/^[\d\s\-\+\(\)]{10,}$/', $phone);
}

// Collect and validate form data
$firstName = sanitizeInput($data['firstName'] ?? '');
$lastName = sanitizeInput($data['lastName'] ?? '');
$email = sanitizeInput($data['email'] ?? '');
$phone = sanitizeInput($data['phone'] ?? '');
$carOfInterest = sanitizeInput($data['carOfInterest'] ?? '');
$message = sanitizeInput($data['message'] ?? '');

// Validation
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Please enter a valid email address';
}

if (empty($phone) || !validatePhone($phone)) {
    $errors[] = 'Please enter a valid phone number';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    // Generate inquiry ID
    $inquiryId = 'INQ' . date('Ymd') . rand(1000, 9999);
    
    // Send emails
    $customerEmailSent = sendCustomerConfirmation($firstName, $lastName, $email, $phone, $carOfInterest, $message, $inquiryId);
    $adminEmailSent = sendAdminNotification($firstName, $lastName, $email, $phone, $carOfInterest, $message, $inquiryId);
    
    if ($customerEmailSent && $adminEmailSent) {
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! We will get back to you soon.',
            'inquiry_id' => $inquiryId
        ]);
    } else if ($customerEmailSent) {
        echo json_encode([
            'success' => true, 
            'message' => 'Message sent successfully! Confirmation email delivered.',
            'inquiry_id' => $inquiryId
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'message' => 'Message received! We will contact you soon.',
            'inquiry_id' => $inquiryId
        ]);
    }
    
} catch (Exception $e) {
    error_log("Exception in main try block: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function sendCustomerConfirmation($firstName, $lastName, $email, $phone, $carOfInterest, $message, $inquiryId) {
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
        $mail->addAddress($email, $firstName . ' ' . $lastName);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Thank you for contacting STRADA Auto - Inquiry Confirmation';
        
        $carOfInterestSection = !empty($carOfInterest) ? "
        <tr style='border-bottom: 1px solid #eee;'>
            <td style='padding: 8px 0; font-weight: bold; color: #333; width: 30%;'>Car of Interest:</td>
            <td style='padding: 8px 0; color: #555;'>{$carOfInterest}</td>
        </tr>" : '';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;'>
            <div style='background-color: #d4af37; color: white; padding: 30px; text-align: center;'>
                <h1 style='margin: 0; font-size: 2.2rem;'>STRADA Auto</h1>
                <h2 style='margin: 10px 0 0 0; font-size: 1.5rem; font-weight: normal;'>Thank You for Contacting Us!</h2>
            </div>
            
            <div style='padding: 40px; background-color: white; margin: 0;'>
                <p style='font-size: 18px; color: #333; margin-bottom: 20px;'>Dear {$firstName} {$lastName},</p>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 25px;'>
                    Thank you for reaching out to STRADA Auto. We have received your inquiry and our team of luxury car specialists will get back to you within 24 hours.
                </p>
                
                <div style='background-color: #f8f9fa; padding: 25px; border-left: 4px solid #d4af37; margin: 25px 0;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px; font-size: 1.3rem;'>Your Inquiry Details</h3>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333; width: 30%;'>Inquiry ID:</td>
                            <td style='padding: 8px 0; color: #555;'>#{$inquiryId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Name:</td>
                            <td style='padding: 8px 0; color: #555;'>{$firstName} {$lastName}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Email:</td>
                            <td style='padding: 8px 0; color: #555;'>{$email}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Phone:</td>
                            <td style='padding: 8px 0; color: #555;'>{$phone}</td>
                        </tr>
                        {$carOfInterestSection}
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Submitted:</td>
                            <td style='padding: 8px 0; color: #555;'>" . date('F j, Y \a\t g:i A') . "</td>
                        </tr>
                    </table>
                </div>
                
                <div style='background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;'>
                    <h4 style='color: #2c5282; margin-bottom: 10px;'>Your Message:</h4>
                    <p style='color: #2d3748; line-height: 1.6; margin: 0; font-style: italic; background-color: white; padding: 15px; border-radius: 5px;'>
                        \"{$message}\"
                    </p>
                </div>
                
                <div style='background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 25px 0;'>
                    <h4 style='color: #0c5460; margin-bottom: 10px;'>What happens next?</h4>
                    <ul style='color: #2d3748; line-height: 1.8; margin: 0; padding-left: 20px;'>
                        <li>Our luxury car specialist will review your inquiry</li>
                        <li>We'll contact you within 24 hours via phone or email</li>
                        <li>If you mentioned a specific car, we'll provide detailed information</li>
                        <li>We can schedule a showroom visit or test drive</li>
                        <li>Our team will answer all your questions personally</li>
                    </ul>
                </div>
                
                <div style='text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f8f8; border-radius: 8px;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px;'>Need Immediate Assistance?</h3>
                    <p style='color: #555; margin-bottom: 20px;'>Feel free to contact us directly or visit our showroom.</p>
                    <div style='text-align: center;'>
                        <a href='tel:" . BUSINESS_PHONE . "' style='display: inline-block; background-color: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;'>Call Us</a>
                        <a href='https://wa.me/" . BUSINESS_PHONE . "' style='display: inline-block; background-color: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;'>WhatsApp</a>
                    </div>
                </div>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <p style='color: #555; margin-bottom: 15px;'><strong>Visit Our Showroom:</strong></p>
                    <p style='margin: 5px 0;'><strong>Address:</strong> " . BUSINESS_ADDRESS . "</p>
                    <p style='margin: 5px 0;'><strong>Location:</strong> " . BUSINESS_CITY . "</p>
                    <p style='margin: 5px 0;'><strong>Phone:</strong> " . BUSINESS_PHONE . "</p>
                    <p style='margin: 5px 0;'><strong>Website:</strong> " . BUSINESS_WEBSITE . "</p>
                </div>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6; margin-top: 25px;'>
                    We appreciate your interest in STRADA Auto and look forward to helping you find your perfect luxury vehicle.
                </p>
                
                <p style='font-size: 16px; color: #333; margin-top: 20px;'>
                    Best regards,<br>
                    <strong>The STRADA Auto Team</strong>
                </p>
                
                <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;'>
                    <p style='font-size: 12px; color: #888; margin: 0;'>
                        This is an automated confirmation email. Please keep this for your records.<br>
                        Reference ID: #{$inquiryId}
                    </p>
                </div>
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
        error_log("Customer confirmation email failed: " . $e->getMessage());
        return false;
    }
}

function sendAdminNotification($firstName, $lastName, $email, $phone, $carOfInterest, $message, $inquiryId) {
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
        $mail->Subject = 'New Contact Form Inquiry - STRADA AUTO';
        
        $carOfInterestSection = !empty($carOfInterest) ? "
        <tr style='border-bottom: 1px solid #eee;'>
            <td style='padding: 8px 0; font-weight: bold; width: 30%;'>Car of Interest:</td>
            <td style='padding: 8px 0;'>{$carOfInterest}</td>
        </tr>" : '';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #d4af37; color: white; padding: 20px; text-align: center;'>
                <h1 style='margin: 0;'>STRADA Auto</h1>
                <h2 style='margin: 10px 0 0 0; font-weight: normal;'>New Contact Form Inquiry</h2>
            </div>
            
            <div style='padding: 30px; background-color: #f9f9f9;'>
                <p><strong>A new customer has submitted a contact form inquiry.</strong></p>
                
                <div style='background-color: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px;'>Customer Details</h3>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; width: 30%;'>Inquiry ID:</td>
                            <td style='padding: 8px 0;'>#{$inquiryId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Name:</td>
                            <td style='padding: 8px 0;'>{$firstName} {$lastName}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Email:</td>
                            <td style='padding: 8px 0;'><a href='mailto:{$email}' style='color: #d4af37;'>{$email}</a></td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Phone:</td>
                            <td style='padding: 8px 0;'><a href='tel:{$phone}' style='color: #d4af37;'>{$phone}</a></td>
                        </tr>
                        {$carOfInterestSection}
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold;'>Submitted:</td>
                            <td style='padding: 8px 0;'>" . date('F j, Y \a\t g:i A') . "</td>
                        </tr>
                    </table>
                </div>
                
                <div style='background-color: white; padding: 20px; border-left: 4px solid #2196F3; margin: 20px 0;'>
                    <h3 style='color: #2196F3; margin-bottom: 15px;'>Customer Message</h3>
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; font-style: italic; line-height: 1.6;'>
                        \"{$message}\"
                    </div>
                </div>
                
                <div style='background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;'>
                    <p style='margin: 0; color: #856404;'><strong>Action Required:</strong> Please follow up with this customer within 24 hours.</p>
                </div>
                
                <div style='text-align: center; margin: 20px 0;'>
                    <a href='mailto:{$email}' style='display: inline-block; background-color: #d4af37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;'>Reply by Email</a>
                    <a href='tel:{$phone}' style='display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;'>Call Customer</a>
                    <a href='https://wa.me/{$phone}' style='display: inline-block; background-color: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;'>WhatsApp</a>
                </div>
                
                <p>This is an automated notification from your STRADA AUTO website contact form.</p>
            </div>
        </div>";
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Admin contact notification failed: " . $e->getMessage());
        return false;
    }
}
?>