package com.sadetech.fundraiser.utility;

import com.sadetech.fundraiser.dto.ContactRequest;
import com.sadetech.fundraiser.model.Otp;
import com.sadetech.fundraiser.repository.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EmailService {

    @Autowired
    private OtpRepository otpRepository;

    @Value("${spring.mail.username}")
    private String mailAddress;

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

    public void sendMailToOrganization(ContactRequest contactRequest){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(mailAddress);
        simpleMailMessage.setTo(mailAddress);
        simpleMailMessage.setReplyTo(contactRequest.getEmail());
        simpleMailMessage.setSubject(contactRequest.getSubject());
        String body = "Sender: " + contactRequest.getEmail() + "\n\n"
                + "Subject: " + contactRequest.getSubject() + "\n\n"
                + "Query:\n" + contactRequest.getQuery();
        simpleMailMessage.setText(body);

        try {
            javaMailSender.send(simpleMailMessage);
        } catch (MailException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

}
