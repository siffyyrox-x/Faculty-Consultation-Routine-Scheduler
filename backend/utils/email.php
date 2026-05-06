<?php
// =============================================
// Email Utility (Enhanced for Development)
// =============================================

function sendEmail($to, $subject, $htmlMessage)
{
    // For development: Log email to error_log with nice formatting
    error_log("╔═══════════════════════════════════════════");
    error_log("║ 📧 EMAIL SENT");
    error_log("╠═══════════════════════════════════════════");
    error_log("║ TO: $to");
    error_log("║ SUBJECT: $subject");
    error_log("╠═══════════════════════════════════════════");
    error_log("║ MESSAGE:");
    error_log("║ " . strip_tags($htmlMessage));
    error_log("╚═══════════════════════════════════════════");

    // Load PHPMailer manually since Composer is not installed
    require_once __DIR__ . '/../PHPMailer/src/Exception.php';
    /**
 * Email Utility
 * Provides a standardized way to send system notifications.
 */
require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/../PHPMailer/src/SMTP.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        // Server settings
        $mail->SMTPDebug = 0; 
        // Redirect debug output to error_log instead of echoing it to the browser
        $mail->Debugoutput = function($str, $level) {
            error_log("SMTP: $str");
        };
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'youtellmee230@gmail.com';
        $mail->Password = 'lanr vqag qtqm bvhd'; //
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Bypass SSL certificate verification
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

        $mail->send();
        error_log("✅ Email sent successfully to $to");
        return true;
    } catch (\Exception $e) {
        error_log("❌ Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
        error_log("❌ Exception message: " . $e->getMessage());
        return false;
    }
}
?>