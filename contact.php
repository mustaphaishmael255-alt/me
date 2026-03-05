<?php
// Contact Form Handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$toEmail = 'mustaphaishmael255@gmail.com';
$subjectPrefix = '[Portfolio Contact]';

// Validate and sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Get POST data
$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!validateEmail($email)) {
    $errors[] = 'Invalid email format';
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

if (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long';
}

if (strlen($message) > 1000) {
    $errors[] = 'Message must not exceed 1000 characters';
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ]);
    exit;
}

// Email headers
$headers = [
    'From: ' . $email,
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

// Email template
$emailTemplate = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
        }
        .field-value {
            background: #fff;
            padding: 10px;
            border-left: 4px solid #fbbf24;
            border-radius: 4px;
        }
        .message-content {
            background: #fff;
            padding: 15px;
            border-left: 4px solid #fbbf24;
            border-radius: 4px;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>New Contact Form Submission</h1>
        <p>Portfolio Website - Mustapha Ishmael</p>
    </div>
    <div class='content'>
        <div class='field'>
            <div class='field-label'>Name:</div>
            <div class='field-value'>" . htmlspecialchars($name) . "</div>
        </div>
        <div class='field'>
            <div class='field-label'>Email:</div>
            <div class='field-value'>" . htmlspecialchars($email) . "</div>
        </div>
        <div class='field'>
            <div class='field-label'>Subject:</div>
            <div class='field-value'>" . htmlspecialchars($subject) . "</div>
        </div>
        <div class='field'>
            <div class='field-label'>Message:</div>
            <div class='message-content'>" . htmlspecialchars($message) . "</div>
        </div>
    </div>
    <div class='footer'>
        <p>This message was sent from the portfolio website contact form.</p>
        <p>Sent on: " . date('Y-m-d H:i:s') . "</p>
        <p>IP Address: " . $_SERVER['REMOTE_ADDR'] . "</p>
    </div>
</body>
</html>
";

// Send email
$fullSubject = $subjectPrefix . ' ' . $subject;
$emailSent = mail($toEmail, $fullSubject, $emailTemplate, implode("\r\n", $headers));

// Auto-reply to sender
$autoReplyTemplate = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Thank you for contacting me</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>Thank You for Contacting Me!</h1>
        <p>Mustapha Ishmael - Software Developer</p>
    </div>
    <div class='content'>
        <p>Dear " . htmlspecialchars($name) . ",</p>
        <p>Thank you for reaching out to me through my portfolio website. I have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message details:</strong></p>
        <ul>
            <li><strong>Subject:</strong> " . htmlspecialchars($subject) . "</li>
            <li><strong>Message:</strong> " . htmlspecialchars(substr($message, 0, 200)) . (strlen($message) > 200 ? '...' : '') . "</li>
        </ul>
        <p>I typically respond within 24-48 hours. If your matter is urgent, please feel free to reach out through my LinkedIn profile as well.</p>
        <p>Best regards,<br>
        Mustapha Ishmael<br>
        Software Developer</p>
    </div>
    <div class='footer'>
        <p>This is an automated response. Please do not reply to this email.</p>
        <p>Portfolio: https://g.dev/ishmael-dev</p>
    </div>
</body>
</html>
";

$autoReplyHeaders = [
    'From: ' . $toEmail,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

// Send auto-reply
$autoReplySent = mail($email, 'Thank you for contacting me', $autoReplyTemplate, implode("\r\n", $autoReplyHeaders));

// Log the contact attempt (for security and analytics)
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message_length' => strlen($message),
    'email_sent' => $emailSent,
    'auto_reply_sent' => $autoReplySent
];

// Create logs directory if it doesn't exist
$logDir = _DIR_ . '/logs';
if (!file_exists($logDir)) {
    mkdir($logDir, 0755, true);
}

// Write to log file
$logFile = $logDir . '/contact_' . date('Y-m-d') . '.json';
$logData = [];
if (file_exists($logFile)) {
    $logData = json_decode(file_get_contents($logFile), true) ?: [];
}
$logData[] = $logEntry;
file_put_contents($logFile, json_encode($logData, JSON_PRETTY_PRINT));

// Return response
if ($emailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully! I will get back to you soon.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later.'
    ]);
}
?>