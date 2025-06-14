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

// Collect form data
$email = sanitizeInput($_POST['email'] ?? '');

// Validate email
if (empty($email) || !validateEmail($email)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

try {
    // Generate subscription ID
    $subscriptionId = 'NL' . date('Ymd') . rand(1000, 9999);
    
    // Send emails
    $customerEmailSent = sendWelcomeEmail($email, $subscriptionId);
    $adminEmailSent = sendAdminNotification($email, $subscriptionId);
    
    if ($customerEmailSent) {
        echo json_encode([
            'success' => true, 
            'message' => 'Successfully subscribed to our newsletter! Check your email for confirmation.',
            'subscription_id' => $subscriptionId
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'message' => 'Subscription recorded! Email confirmation may be delayed.',
            'subscription_id' => $subscriptionId
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function sendWelcomeEmail($email, $subscriptionId) {
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
        $mail->addAddress($email);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Welcome to STRADA Auto Newsletter!';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;'>
            <div style='background-color: #d4af37; color: white; padding: 30px; text-align: center;'>
                <h1 style='margin: 0; font-size: 2.2rem;'>STRADA Auto</h1>
                <h2 style='margin: 10px 0 0 0; font-size: 1.5rem; font-weight: normal;'>Welcome to Our Newsletter!</h2>
            </div>
            
            <div style='padding: 40px; background-color: white; margin: 0;'>
                <p style='font-size: 18px; color: #333; margin-bottom: 20px;'>Welcome to the STRADA Auto family!</p>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 25px;'>
                    Thank you for subscribing to our newsletter. You'll now receive the latest updates about our luxury vehicles, exclusive deals, and automotive news directly in your inbox.
                </p>
                
                <div style='background-color: #f8f9fa; padding: 25px; border-left: 4px solid #d4af37; margin: 25px 0;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px; font-size: 1.3rem;'>Subscription Details</h3>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333; width: 30%;'>Subscription ID:</td>
                            <td style='padding: 8px 0; color: #555;'>#{$subscriptionId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Email:</td>
                            <td style='padding: 8px 0; color: #555;'>{$email}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold; color: #333;'>Subscribed:</td>
                            <td style='padding: 8px 0; color: #555;'>" . date('F j, Y') . "</td>
                        </tr>
                    </table>
                </div>
                
                <div style='background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;'>
                    <h4 style='color: #2c5282; margin-bottom: 10px;'>What to expect:</h4>
                    <ul style='color: #2d3748; line-height: 1.8; margin: 0; padding-left: 20px;'>
                        <li>Weekly updates on new luxury vehicles in our inventory</li>
                        <li>Exclusive offers and early access to special deals</li>
                        <li>Latest automotive news and industry insights</li>
                        <li>Invitations to exclusive events and car shows</li>
                        <li>Expert tips on luxury car maintenance and care</li>
                    </ul>
                </div>
                
                <div style='text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f8f8; border-radius: 8px;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px;'>Explore Our Premium Collection</h3>
                    <p style='color: #555; margin-bottom: 20px;'>Visit our showroom or browse our online catalog to discover luxury vehicles that match your style.</p>
                    <div style='text-align: center;'>
                        <a href='http://localhost:3000/products' style='display: inline-block; background-color: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;'>View Our Cars</a>
                        <a href='http://localhost:3000/quota' style='display: inline-block; background-color: #333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;'>Request Quote</a>
                    </div>
                </div>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <p style='color: #555; margin-bottom: 15px;'>Visit our showroom or contact us:</p>
                    <p style='margin: 5px 0;'><strong>Address:</strong> " . BUSINESS_ADDRESS . "</p>
                    <p style='margin: 5px 0;'><strong>Phone:</strong> " . BUSINESS_PHONE . "</p>
                    <p style='margin: 5px 0;'><strong>WhatsApp:</strong> " . BUSINESS_PHONE . "</p>
                    <p style='margin: 5px 0;'><strong>Website:</strong> " . BUSINESS_WEBSITE . "</p>
                </div>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6; margin-top: 25px;'>
                    We're excited to have you as part of the STRADA Auto community. Get ready to discover the world of luxury automotive excellence!
                </p>
                
                <p style='font-size: 16px; color: #333; margin-top: 20px;'>
                    Best regards,<br>
                    <strong>The STRADA Auto Team</strong>
                </p>
                
                <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;'>
                    <p style='font-size: 12px; color: #888; margin: 0;'>
                        You're receiving this email because you subscribed to STRADA Auto newsletter.<br>
                        If you no longer wish to receive these emails, you can <a href='#' style='color: #d4af37;'>unsubscribe here</a>.
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
        error_log("Newsletter welcome email failed: " . $e->getMessage());
        return false;
    }
}

function sendAdminNotification($email, $subscriptionId) {
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
        $mail->Subject = 'New Newsletter Subscription - STRADA AUTO';
        
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #d4af37; color: white; padding: 20px; text-align: center;'>
                <h1 style='margin: 0;'>STRADA Auto</h1>
                <h2 style='margin: 10px 0 0 0; font-weight: normal;'>New Newsletter Subscription</h2>
            </div>
            
            <div style='padding: 30px; background-color: #f9f9f9;'>
                <p><strong>A new user has subscribed to your newsletter.</strong></p>
                
                <div style='background-color: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;'>
                    <h3 style='color: #d4af37; margin-bottom: 15px;'>Subscription Details</h3>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold; width: 30%;'>Subscription ID:</td>
                            <td style='padding: 8px 0;'>#{$subscriptionId}</td>
                        </tr>
                        <tr style='border-bottom: 1px solid #eee;'>
                            <td style='padding: 8px 0; font-weight: bold;'>Email:</td>
                            <td style='padding: 8px 0;'>{$email}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px 0; font-weight: bold;'>Subscribed:</td>
                            <td style='padding: 8px 0;'>" . date('F j, Y \a\t g:i A') . "</td>
                        </tr>
                    </table>
                </div>
                
                <div style='background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <p style='margin: 0; color: #0c5460;'><strong>Action:</strong> This subscriber will now receive your newsletter updates.</p>
                </div>
                
                <p>This is an automated notification from your STRADA AUTO website.</p>
            </div>
        </div>";
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log("Admin newsletter notification failed: " . $e->getMessage());
        return false;
    }
}
?>