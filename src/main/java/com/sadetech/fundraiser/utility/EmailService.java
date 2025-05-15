package com.sadetech.fundraiser.utility;

import com.sadetech.fundraiser.model.Otp;
import com.sadetech.fundraiser.repository.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    @Autowired
    private OtpRepository otpRepository;

    private final JavaMailSender javaMailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendOtpEmail(String to, String otp, String otpType) {
        if (to == null || otp == null || otpType == null) {
            throw new IllegalArgumentException("Recipient email, OTP, and OTP type must not be null.");
        }

        String subject = "Fundraiser OTP for Login";
        String text = "Your OTP for registration is: " + otp;

        // Save email content to the database
        Otp otpEntity = new Otp(to, otp, otpType, text, LocalDateTime.now(),false);
        otpRepository.save(otpEntity);

        // Send the email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            logger.info("Attempting to send email to: {}", to);
            javaMailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

}
