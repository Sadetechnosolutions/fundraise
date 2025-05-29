package com.sadetech.fundraiser.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sadetech.fundraiser.dto.*;
import com.sadetech.fundraiser.exception.FileUploadException;
import com.sadetech.fundraiser.model.BloodDonor;
import com.sadetech.fundraiser.model.Otp;
import com.sadetech.fundraiser.model.Status;
import com.sadetech.fundraiser.model.User;
import com.sadetech.fundraiser.service.UserAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/fund-raiser")
public class UserController {

    @Autowired
    private UserAuthenticationService userAuthenticationService;

    @Autowired
    private org.modelmapper.ModelMapper modelMapper;

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/google-register")
    public ResponseEntity<LoginResponse> registerWithGoogle(@RequestBody GoogleAuthRequest request) {
        LoginResponse user = userAuthenticationService.checkUserAndRegisterWithOAuth(
                request.getToken());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register-mobile")
    public ResponseEntity<?> registerWithMobileNumber(@Valid @RequestBody MobileRegisterRequest request) {
        Otp response = userAuthenticationService.registerWithMobileNumber(
                request.getPhoneNumber());

        OtpResponse otpResponse = modelMapper.map(response, OtpResponse.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(otpResponse);
    }

    @PostMapping("/verify-otp-register")
    public ResponseEntity<LoginResponse> verifyOtpAndRegisterForPhoneNumber(
           @Valid @RequestBody VerificationRequest verificationRequest) {
        LoginResponse response = userAuthenticationService.verifyOtpAndRegisterForPhoneNumber(
                verificationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/send-otp-to-mobile")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody LoginRequest request) {
        Otp otp = userAuthenticationService.sendOtpToPhoneNumber(request);
        OtpResponse otpResponse = modelMapper.map(otp,OtpResponse.class);
        return new ResponseEntity<>(otpResponse, HttpStatus.CREATED);
    }

    @PostMapping("/verify-otp-login")
    public ResponseEntity<LoginResponse> verifyOtpAndLoginForPhoneNumberOrEmail(
            @Valid @RequestBody VerificationRequest verificationRequest) {
        LoginResponse response = userAuthenticationService.verifyOtpAndLoginForEmailOrPhoneNumber(
                verificationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get-all-otp")
    public ResponseEntity<?> getAllOtp() {
        return ResponseEntity.status(HttpStatus.OK).body(userAuthenticationService.getAllOtp());
    }

    @PostMapping(value = "/patient-info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> patientInfo(
            @RequestPart("patientImage") MultipartFile patientImage,
            @RequestPart("reportsImages") List<MultipartFile> reportsImages,
            @RequestPart("patientRequestDto") String patientRequestDtoStr,
            HttpServletRequest request) throws FileUploadException, JsonProcessingException, FileNotFoundException, org.apache.tomcat.util.http.fileupload.FileUploadException {

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

    @GetMapping("/user")
    public ResponseEntity<User> getUserInfo(@RequestParam Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(userAuthenticationService.getUserById(userId));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<ApiResponse> updateUserProfile(
            @Valid @RequestBody EditProfileRequest editProfileRequest,
            @RequestHeader("Authorization") String authHeader
    ) {
        String response = userAuthenticationService.updateProfile(editProfileRequest,authHeader);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ApiResponse(response));
    }

    @PostMapping("/add-donor-details")
    public ResponseEntity<ApiResponse> addDonorDetails(
            @Valid @RequestBody BloodDonorDetails donorDetailsRequest
    ) {
        String response = userAuthenticationService.addBloodDonorDetails(donorDetailsRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ApiResponse(response));
    }

    @GetMapping("/donor-details")
    public ResponseEntity<BloodDonor> getBloodDonorDetails(@RequestParam String phoneNumber) {
        BloodDonor donorDetails = userAuthenticationService.getBloodDonorDetails(phoneNumber);
        return ResponseEntity.status(HttpStatus.OK).body(donorDetails);
    }

    @PutMapping("/update-patient-details-status/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> updatePatientDetailsStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam String message
    ) {
            Status enumStatus = Status.valueOf(status.trim().toUpperCase());
            String response = userAuthenticationService.updatePatientInfoDetailsStatus(id, enumStatus, message);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ApiResponse(response));
    }

    @GetMapping("/get-patient-details-status/{status}")
    public ResponseEntity<List<PatientResponseDto>> getPatientDetailsStatus(@PathVariable String status, HttpServletRequest request) {
        Status enumStatus = Status.valueOf(status.trim().toUpperCase());
        List<PatientResponseDto> patientResponseDtoList = userAuthenticationService.getPatientDetailsByStatus(enumStatus,request);
        return ResponseEntity.status(HttpStatus.OK).body(patientResponseDtoList);
    }

    @GetMapping("/get-patient-details-cause}")
    public ResponseEntity<List<PatientResponseDto>> getPatientDetailsStatusAndCause(@RequestParam String cause, HttpServletRequest request) {
        List<PatientResponseDto> patientResponseDtoList = userAuthenticationService.getPatientDetailsByStatusAndCause(cause,request);
        return ResponseEntity.status(HttpStatus.OK).body(patientResponseDtoList);
    }

    @GetMapping("/get-detailed-information-of-fund-raiser/{id}")
    public ResponseEntity<PatientResponseDto> getDetailedInformationOfFundRaiser(@PathVariable Long id, HttpServletRequest request) {
        PatientResponseDto detailedInformationOfFundRaiserResponseDto = userAuthenticationService.getPatientDetailsById(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(detailedInformationOfFundRaiserResponseDto);
    }

    @GetMapping("/get-all-donor-details")
    public ResponseEntity<List<BloodDonor>> getAllBloodDonorDetails() {
        List<BloodDonor> bloodDonorList = userAuthenticationService.getAllBloodDonorDetails();
        return ResponseEntity.status(HttpStatus.OK).body(bloodDonorList);
    }

    @GetMapping("/get-donor-details-by-id/{id}")
    public ResponseEntity<BloodDonor> getParticularBloodDonorDetails(@PathVariable Long id) {
        BloodDonor bloodDonor = userAuthenticationService.getBloodDonorDetailsById(id);
        return ResponseEntity.status(HttpStatus.OK).body(bloodDonor);
    }

    @PostMapping("/send-email-to-organization")
    public ResponseEntity<ApiResponse> sendMessage(@RequestBody ContactRequest contactRequest) {
       userAuthenticationService.sendEmailToOrganization(contactRequest);
       return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Email sent successfully"));
    }

    @PatchMapping("/update-role")
    public ResponseEntity<ApiResponse> updateRole(@RequestParam Long userId){
        String response = userAuthenticationService.updateRole(userId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ApiResponse(response));
    }

}