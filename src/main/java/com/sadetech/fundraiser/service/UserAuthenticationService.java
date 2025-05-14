package com.sadetech.fundraiser.service;

import com.sadetech.fundraiser.dto.*;
import com.sadetech.fundraiser.exception.*;
import com.sadetech.fundraiser.model.*;
import com.sadetech.fundraiser.repository.*;
import com.sadetech.fundraiser.utility.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class UserAuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JwtUtil jwtUtils;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private BasicInfoRepository basicInfoRepository;

    @Autowired
    private CauseRepository causeRepository;

    @Autowired
    private DescriptionRepository descriptionRepository;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Otp registerWithMobileNumber(String phoneNumber) {

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new InvalidPhoneNumberException("Phone number is required.");
        }

        phoneNumber = phoneNumber.replaceAll("\\s+", "");

        if (phoneNumber.startsWith("0") || !phoneNumber.matches("^[6-9]\\d{9}$")) {
            throw new InvalidPhoneNumberException("Invalid phone number format.");
        }

        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new IllegalArgumentException("Phone number already exists. Please log in.");
        }


        // ✅ OTP resend cooldown check
        Optional<Otp> existingOtp = otpRepository.findFirstByPhoneNumberAndUsedFalseAndOtpTypeOrderByCreatedAtDesc(phoneNumber,"Sign up");
        if (existingOtp.isPresent()) {
            LocalDateTime otpCreatedAt = existingOtp.get().getCreatedAt();
            if (LocalDateTime.now().isBefore(otpCreatedAt.plusMinutes(1))) {
                throw new IllegalArgumentException("An OTP was recently sent. Please wait before requesting another.");
            }
        }

        // ✅ Generate and store OTP
        String otp = generateOtp();
        String otpType = "Sign up";
        String emailOtpContent = "Register OTP for your mobile number: " + otp;

        Otp otpEntity = new Otp();
        otpEntity.setOtp(otp);
        otpEntity.setOtpType(otpType);
        otpEntity.setPhoneNumber(phoneNumber);
        otpEntity.setUsed(false);
        otpEntity.setEmailOtpContent(emailOtpContent);
        otpEntity.setCreatedAt(LocalDateTime.now());

        return otpRepository.save(otpEntity);
    }

    public LoginResponse verifyOtpAndRegisterForPhoneNumber(VerificationRequest verificationRequest) {

        LoginResponse response = new LoginResponse();

        String phoneNumber = verificationRequest.getPhoneNumber();
        String otpCode = verificationRequest.getOtp();

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new InvalidPhoneNumberException("Phone number is required.");
        }

        phoneNumber = phoneNumber.replaceAll("\\s+", "");

        if (phoneNumber.startsWith("0") || !phoneNumber.matches("^[6-9]\\d{9}$")) {
            throw new InvalidPhoneNumberException("Invalid phone number format.");
        }

        if (otpCode == null || otpCode.trim().isEmpty()) {
            throw new InvalidOtpException("Please enter otp.");
        }

        otpCode = otpCode.replaceAll("\\s+", "");

        if (!otpCode.matches("\\d{6}")) {
            throw new InvalidOtpException("Invalid OTP format.");
        }

        // ✅ Get the latest unused OTP for this phone number
        List<Otp> otpEntityOpt = otpRepository.findByPhoneNumber(phoneNumber);

        if (otpEntityOpt.isEmpty()) {
            throw new InvalidOtpException("Invalid or expired OTP. Please request a new one.");
        }

        Otp otpEntity = otpEntityOpt.getLast();

        if(otpEntity.getOtpType().equalsIgnoreCase("Sign up")){

            // ✅ Ensure the entered OTP matches the latest one
            if (!otpEntity.getOtp().equals(otpCode)) {
                throw new InvalidOtpException("This OTP is no longer valid. Please use the latest OTP.");
            }

            if (otpEntity.isUsed()){
                throw new InvalidOtpException("This OTP has already been used. Please request a new one.");
            }

            // ✅ Check if the OTP is expired
            if (LocalDateTime.now().isAfter(otpEntity.getCreatedAt().plusMinutes(5))) {
                throw new InvalidOtpException("OTP has expired.");
            }

            // ✅ Check if the user already exists
            if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
                throw new IllegalArgumentException("Phone number already registered. Please log in.");
            }

            // ✅ Create and save a new user
            User newUser = new User();
            newUser.setPhoneNumber(phoneNumber);
            newUser.setRole(new HashSet<>(List.of("USER")));

            User savedUser = userRepository.save(newUser);

            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);


            // ✅ Generate JWT & refresh token
            String jwt = jwtUtils.generateToken(savedUser);
            String refreshToken = jwtUtils.generateRefreshToken(savedUser);

            // ✅ Prepare response

            response.setId( savedUser.getId());
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setMessage("Successfully Registered & Logged In");

            return response;

        }

        throw new InvalidOtpException("Invalid OTP type.");
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public LoginResponse loginWithPhoneNumberOrEmail(String email, String phoneNumber, String password, HttpServletRequest request) {
        LoginResponse response = new LoginResponse();

        String address = request.getRemoteAddr();
        String input = email == null ? phoneNumber : email;
        String ip = address + ":" + input;

        System.out.println("Ip address is : " + ip);
        if(!rateLimiterService.isAllowed(ip)){
            throw new TooManyRequestException("Too many request, please try after some times");
        }

        // Ensure at least one of email or phone is provided, but not both
        if ((email == null || email.isEmpty()) == (phoneNumber == null || phoneNumber.isEmpty())) {
            throw new InvalidInputException("Provide either email or phone number, but not both.");
        }

        // Ensure password is not empty
        if (Optional.ofNullable(password).orElse("").isEmpty()) {
            throw new InvalidInputException("Password cannot be empty.");
        }

        // Define validation patterns
        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
        Pattern phonePattern = Pattern.compile("^[6-9]\\d{9}$");
        Pattern passwordPattern = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$");

        // Validate email
        if (email != null) {
            if (!emailPattern.matcher(email).matches()) {
                throw new InvalidInputException("Please enter a valid email.");
            }
            if (email.length() > 50) {
                throw new InvalidInputException("Email must not exceed 50 characters.");
            }
        }


        // Validate phone number
        if (phoneNumber != null && !phonePattern.matcher(phoneNumber).matches()) {
            throw new InvalidInputException("Please enter a valid phone number.");
        }

        // Validate password
        if (!passwordPattern.matcher(password).matches()) {
            throw new InvalidInputException("Password must be at least 8 characters long and contain at least one letter and one number.");
        }

        // Retrieve user
        User user = (email != null)
                ? userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("No user found with this email."))
                : userRepository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new ResourceNotFoundException("No user found with this phone number."));

        // Authenticate user
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail() != null ? user.getEmail() : user.getPhoneNumber(), password));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Incorrect credentials. Check the credentials.");
        }

        // Generate JWT tokens
        var jwt = jwtUtils.generateToken(user);
        var refreshToken = jwtUtils.generateRefreshToken(user);

        // Prepare response
        response.setToken(jwt);
        response.setId(user.getId());
        response.setRefreshToken(refreshToken);
        response.setMessage("Welcome to FundRaiser!");

        return response;
    }

    public List<Otp> getAllOtp() {
        return otpRepository.findAll();
    }

    @Transactional
    public String patientInfo(MultipartFile patientImage, List<MultipartFile> reportsImages, PatientRequestDto patientRequestDto, HttpServletRequest request) throws FileUploadException {

        long userId = Long.parseLong(request.getHeader("userId"));

        if(userId != patientRequestDto.getBasicInfo().getUserId()){
            throw new UnAuthorizedAccessException("You are not authorized to perform this action.");
        }

        // Upload patient image
        String uploadedPatientImageUrl = fileUploadService.uploadFile(patientImage);

        // Upload report images
        List<String> uploadedReportImageUrls = fileUploadService.uploadListFile(reportsImages);
        patientRequestDto.getDescription().setReportsImages(uploadedReportImageUrls);

        BasicInfo basicInfo = new BasicInfo();
        basicInfo.setUserId(patientRequestDto.getBasicInfo().getUserId());
        basicInfo.setPatientName(patientRequestDto.getBasicInfo().getPatientName());
        basicInfo.setPatientAge(patientRequestDto.getBasicInfo().getPatientAge());
        basicInfo.setRelationWithPatient(patientRequestDto.getBasicInfo().getRelationWithPatient());
        basicInfo.setPatientAddress(patientRequestDto.getBasicInfo().getPatientAddress());
        basicInfo.setContactDetails(patientRequestDto.getBasicInfo().getContactDetails());
        basicInfo.setPatientImage(uploadedPatientImageUrl);
        basicInfoRepository.save(basicInfo);

        // Save Cause Info
        Cause cause = new Cause();
        cause.setBasicInfo(basicInfo);  // Assuming there's a @ManyToOne relationship with BasicInfo
        cause.setCause(patientRequestDto.getCause().getCause());
        cause.setAmount(patientRequestDto.getCause().getAmount());
        cause.setHospitalName(patientRequestDto.getCause().getHospitalName());
        cause.setHospitalAddress(patientRequestDto.getCause().getHospitalAddress());
        cause.setHospitalContactDetails(patientRequestDto.getCause().getHospitalContactDetails());
        cause.setMedication(patientRequestDto.getCause().getMedication());
        causeRepository.save(cause);

        // Save Description
        MedicalDescription description = new MedicalDescription();
        description.setBasicInfo(basicInfo);  // Assuming there's a @ManyToOne relationship with BasicInfo
        description.setDescriptionHeading(patientRequestDto.getDescription().getDescriptionHeading());
        description.setMedicalHistoryAndDetails(patientRequestDto.getDescription().getMedicalHistoryAndDetails());
        description.setReportsImages(uploadedReportImageUrls); // If List<String> is stored in DB (e.g., JSON)
        descriptionRepository.save(description);

        return "Patient info saved successfully!";
    }

    @Transactional
    public List<PatientResponseDto> getBasicInfo(Long userId) {
        List<BasicInfo> entities = basicInfoRepository.findByUserId(userId);
        if (entities.isEmpty()) {
            throw new ResourceNotFoundException("Patient not found with id: " + userId);
        }

        List<PatientResponseDto> responseList = new ArrayList<>();

        for (BasicInfo entity : entities) {
            PatientResponseDto patientResponseDto = new PatientResponseDto();

            BasicInfoDto1 dto = new BasicInfoDto1();
            dto.setId(entity.getId());
            dto.setUserId(entity.getUserId());
            dto.setPatientImage(entity.getPatientImage());
            dto.setPatientAge(entity.getPatientAge());
            dto.setPatientName(entity.getPatientName());
            dto.setRelationWithPatient(entity.getRelationWithPatient());
            dto.setPatientAddress(entity.getPatientAddress());
            dto.setContactDetails(entity.getContactDetails());
            dto.setCreatedAt(entity.getCreatedAt());
            patientResponseDto.setBasicInfo(dto);

            Cause cause = entity.getCause();
            if (cause != null) {
                CauseDto causeDto = new CauseDto();
                causeDto.setCause(cause.getCause());
                causeDto.setAmount(cause.getAmount());
                causeDto.setHospitalName(cause.getHospitalName());
                causeDto.setHospitalAddress(cause.getHospitalAddress());
                causeDto.setHospitalContactDetails(cause.getHospitalContactDetails());
                causeDto.setMedication(cause.getMedication());
                patientResponseDto.setCause(causeDto);
            }

            MedicalDescription description = entity.getDescription();
            if (description != null) {
                DescriptionDto descDto = new DescriptionDto();
                descDto.setDescriptionHeading(description.getDescriptionHeading());
                descDto.setMedicalHistoryAndDetails(description.getMedicalHistoryAndDetails());
                descDto.setReportsImages(description.getReportsImages());
                patientResponseDto.setDescription(descDto);
            }

            responseList.add(patientResponseDto);
        }

        return responseList;
    }

}
