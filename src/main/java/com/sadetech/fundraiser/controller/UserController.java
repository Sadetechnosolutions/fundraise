package com.sadetech.fundraiser.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sadetech.fundraiser.dto.*;
import com.sadetech.fundraiser.model.Otp;
import com.sadetech.fundraiser.service.UserAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fund-raiser")
public class UserController {

    @Autowired
    private UserAuthenticationService userAuthenticationService;

    @Autowired
    private org.modelmapper.ModelMapper modelMapper;

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/register-mobile")
    public ResponseEntity<?> registerWithMobileNumber(@RequestBody MobileRegisterRequest request) {
        Otp response = userAuthenticationService.registerWithMobileNumber(
                request.getPhoneNumber());

        OtpResponse otpResponse = modelMapper.map(response, OtpResponse.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(otpResponse);
    }

    @PostMapping("/verify-otp-register")
    public ResponseEntity<LoginResponse> verifyOtpAndRegisterForPhoneNumber(
            @RequestBody VerificationRequest verificationRequest) {
        LoginResponse response = userAuthenticationService.verifyOtpAndRegisterForPhoneNumber(
                verificationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> userLogin(@RequestParam(required = false) String email, @RequestParam(required = false) String phoneNumber, @RequestParam String password, HttpServletRequest request) {
        LoginResponse response = userAuthenticationService.loginWithPhoneNumberOrEmail(email, phoneNumber, password,request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/get-all-otp")
    public ResponseEntity<?> getAllOtp() {
        return ResponseEntity.status(HttpStatus.OK).body(userAuthenticationService.getAllOtp());
    }

    @PostMapping(value = "/patient-info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> patientInfo(
            @RequestPart("patientImage") MultipartFile patientImage,
            @RequestPart("reportsImages") List<MultipartFile> reportsImages,
            @RequestPart("patientRequestDto") String patientRequestDtoStr,
            HttpServletRequest request) throws FileUploadException, JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        PatientRequestDto patientRequestDto = objectMapper.readValue(patientRequestDtoStr, PatientRequestDto.class);

        String response = userAuthenticationService.patientInfo(patientImage, reportsImages, patientRequestDto, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(response));
    }

    @GetMapping("/patient-info")
    public ResponseEntity<List<PatientResponseDto>> patientInfo(@RequestParam Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(userAuthenticationService.getBasicInfo(userId));
    }

    @GetMapping("/uploads/{filename:.*}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists()) {
                String contentType = determineContentType(filename);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    private String determineContentType(String fileName) {

        if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (fileName.toLowerCase().endsWith(".webp")){
            return "image/webp";
        }else {
            return "application/octet-stream";
        }
    }

}
