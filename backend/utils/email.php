<?php
// =============================================
// Email Utility (Enhanced for Development)
// =============================================

// Load PHPMailer manually since Composer is not installed
if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    require_once __DIR__ . '/../PHPMailer/src/Exception.php';
    require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/../PHPMailer/src/SMTP.php';
}

/**
 * Standard Email Sending Function
 */
function sendEmail($to, $subject, $htmlMessage)
{
    // For development: Log email to error_log with nice formatting
    error_log("╔═══════════════════════════════════════════");
    error_log("║ 📧 EMAIL SENT");
    error_log("╠═══════════════════════════════════════════");
    error_log("║ TO: $to");
    error_log("║ SUBJECT: $subject");
    error_log("╚═══════════════════════════════════════════");

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        // Server settings
        $mail->SMTPDebug = 0; 
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'youtellmee230@gmail.com';
        $mail->Password = 'lanr vqag qtqm bvhd'; 
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Bypass SSL certificate verification for local XAMPP environments
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        $mail->setFrom('noreply@bracu.edu', 'BRACU Faculty Consultation System');
        $mail->addAddress($to);
        $mail->Subject = $subject;
        $mail->Body = $htmlMessage;
        $mail->isHTML(true);

        if ($mail->send()) {
            error_log("✅ Email successfully delivered to $to");
            return true;
        }
        return false;
    } catch (\Exception $e) {
        error_log("❌ SMTP ERROR: " . $mail->ErrorInfo);
        error_log("❌ EXCEPTION: " . $e->getMessage());
        return false;
    }
}
?>