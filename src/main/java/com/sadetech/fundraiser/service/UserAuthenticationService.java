package com.sadetech.fundraiser.service;

import com.sadetech.fundraiser.dto.*;
import com.sadetech.fundraiser.exception.*;
import com.sadetech.fundraiser.model.*;
import com.sadetech.fundraiser.repository.*;
import com.sadetech.fundraiser.utility.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.FileNotFoundException;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BloodDonorRepository bloodDonorRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private GoogleAuthService googleAuthService;

    public LoginResponse checkUserAndRegisterWithOAuth(String idToken) {

        if (idToken == null || idToken.isBlank()) {
            throw new InvalidTokenException("Id token should not be null");
        }

        // Step 1: Verify Google ID Token and get email
        String email = googleAuthService.verifyGoogleToken(idToken);

        // Step 2: Check if the user already exists
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User savedUser = optionalUser.get();
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setId(savedUser.getId());
            loginResponse.setToken(jwtUtils.generateToken(savedUser));
            loginResponse.setRefreshToken(jwtUtils.generateRefreshToken(savedUser));
            loginResponse.setMessage("Successfully Logged In");
            return loginResponse;
        }

        // Step 4: Register a new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setRole(new HashSet<>(List.of("ROLE_USER")));

        User savedUser = userRepository.save(newUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setId(savedUser.getId());
        loginResponse.setToken(jwtUtils.generateToken(savedUser));
        loginResponse.setRefreshToken(jwtUtils.generateRefreshToken(savedUser));
        loginResponse.setMessage("Successfully Registered & Logged In");

        return loginResponse;
    }

    public Otp registerWithMobileNumber(String phoneNumber) {

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new InvalidPhoneNumberException("Phone number is required.");
        }

        phoneNumber = phoneNumber.replaceAll("\\s+", "");

        if (phoneNumber.startsWith("0") || !phoneNumber.matches("^[6-9]\\d{9}$")) {
            throw new InvalidPhoneNumberException("Invalid phone number format.");
        }

        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new UserAlreadyExistException("Phone number already exists. Please log in.");
        }

        // ✅ OTP resend cooldown check
        Optional<Otp> existingOtp = otpRepository.findFirstByPhoneNumberAndUsedFalseAndOtpTypeOrderByCreatedAtDesc(phoneNumber,"Sign up");
        if (existingOtp.isPresent()) {
            LocalDateTime otpCreatedAt = existingOtp.get().getCreatedAt();
            if (LocalDateTime.now().isBefore(otpCreatedAt.plusMinutes(1))) {
                throw new RequestTimeoutException("An OTP was recently sent. Please wait before requesting another.");
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

    public Otp sendOtpToPhoneNumber(LoginRequest loginRequest) {
        String input = loginRequest.getInput();
        input = input.trim();
        Otp otp = new Otp();

        String email;

        if (input.contains("@")) {
            // ✅ Email flow
             email = input;

            // Optional: Add email format validation
            if (!email.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$")) {
                throw new InvalidInputException("Invalid email format.");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("No email found. You need to register first."));

            // Check OTP cooldown for email
            Optional<Otp> existingOtp = otpRepository.findFirstByEmailAndUsedFalseOrderByCreatedAtDesc(email);
            if (existingOtp.isPresent()) {
                LocalDateTime otpCreatedAt = existingOtp.get().getCreatedAt();
                if (LocalDateTime.now().isBefore(otpCreatedAt.plusMinutes(1))) {
                    throw new RequestTimeoutException("An OTP was recently sent. Please wait before requesting another.");
                }
            }

            String otpCode = generateOtp();
            otp.setOtp(otpCode);
            otp.setOtpType("Login");
            otp.setEmail(email);
            otp.setEmailOtpContent("Login OTP for your email: " + otpCode);
            otp.setPhoneNumber(user.getPhoneNumber()); // optional, if needed

            emailService.sendOtpEmail(email, otpCode, otp.getOtpType());

        } else {
            // ✅ Phone number flow
            String phoneNumber = input.replaceAll("\\s+", "");

            if (phoneNumber.isEmpty()) {
                throw new InvalidPhoneNumberException("Phone number is required.");
            }

            if (phoneNumber.startsWith("0") || !phoneNumber.matches("^[6-9]\\d{9}$")) {
                throw new InvalidPhoneNumberException("Invalid phone number format.");
            }

            User user = userRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new UserNotFoundException("No phone number found. You need to register first."));

            // Check OTP cooldown for phone
            Optional<Otp> existingOtp = otpRepository.findFirstByPhoneNumberAndUsedFalseOrderByCreatedAtDesc(phoneNumber);
            if (existingOtp.isPresent()) {
                LocalDateTime otpCreatedAt = existingOtp.get().getCreatedAt();
                if (LocalDateTime.now().isBefore(otpCreatedAt.plusMinutes(1))) {
                    throw new RequestTimeoutException("An OTP was recently sent. Please wait before requesting another.");
                }
            }

            String otpCode = generateOtp();
            otp.setOtp(otpCode);
            otp.setOtpType("Login");
            otp.setPhoneNumber(phoneNumber);
            otp.setEmail(user.getEmail()); // optional, if needed
            otp.setEmailOtpContent("Login OTP for your phone: " + otpCode);
        }

        return otpRepository.save(otp);
    }

    public LoginResponse verifyOtpAndRegisterForPhoneNumber(VerificationRequest verificationRequest) {

        LoginResponse response = new LoginResponse();

        String phoneNumber = verificationRequest.getInput();
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
        Optional<Otp> otpEntityOpt = otpRepository.findFirstByPhoneNumberAndUsedFalseOrderByCreatedAtDesc(phoneNumber);

        if (otpEntityOpt.isEmpty()) {
            throw new InvalidOtpException("Invalid or expired OTP. Please request a new one.");
        }

        Otp otpEntity = otpEntityOpt.get();

        if(otpEntity.getOtpType().equalsIgnoreCase("Sign up")){

            // ✅ Ensure the entered OTP matches the latest one
            if (!otpEntity.getOtp().equals(otpCode)) {
                throw new InvalidOtpException("This OTP is no longer valid. Please use the latest OTP.");
            }

            // ✅ Check if the OTP is expired
            if (LocalDateTime.now().isAfter(otpEntity.getCreatedAt().plusMinutes(5))) {
                throw new InvalidOtpException("OTP has expired.");
            }

            // ✅ Check if the user already exists
            if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
                throw new PhoneNumberExistException("Phone number already registered. Please log in.");
            }

            // ✅ Create and save a new user
            User newUser = new User();
            newUser.setPhoneNumber(phoneNumber);
            newUser.setRole(new HashSet<>(List.of("ROLE_USER")));

            User savedUser = userRepository.save(newUser);

            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);

            // ✅ Generate JWT & refresh token
            String jwt = jwtUtils.generateToken(savedUser);
            String refreshToken = jwtUtils.generateRefreshToken(savedUser);

            // ✅ Prepare response
            response.setId(savedUser.getId());
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setMessage("Successfully Registered & Logged In");

            return response;
        }else {
            throw new InvalidOtpException("Invalid OTP type.");
        }
    }

    public LoginResponse verifyOtpAndLoginForEmailOrPhoneNumber(VerificationRequest verificationRequest) {

        LoginResponse response = new LoginResponse();
        String input = verificationRequest.getInput();
        String otpCode = verificationRequest.getOtp();
        String email = null;

        if (input.contains("@")) {
            email = input;

            if (email.trim().isEmpty()) {
                throw new InvalidPhoneNumberException("Email is required.");
            }

            if (!email.matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$")) {
                throw new InvalidInputException("Invalid email format.");
            }

            if (otpCode == null || otpCode.trim().isEmpty()) {
                throw new InvalidOtpException("Please enter otp.");
            }

            otpCode = otpCode.replaceAll("\\s+", "");

            if (!otpCode.matches("\\d{6}")) {
                throw new InvalidOtpException("Invalid OTP format.");
            }

            // ✅ Get the latest unused OTP for this phone number
            Optional<Otp> otpEntityOpt = otpRepository.findFirstByEmailAndUsedFalseOrderByCreatedAtDesc(email);

            if (otpEntityOpt.isEmpty()) {
                throw new InvalidOtpException("Invalid or expired OTP. Please request a new one.");
            }

            Otp otpEntity = otpEntityOpt.get();

            if(!otpEntity.getOtpType().equalsIgnoreCase("Login")){
                throw new InvalidOtpException("Invalid OTP type.");
            }

            if (!otpEntity.getOtp().equals(otpCode)) {
                throw new InvalidOtpException("This OTP is no longer valid. Please use the latest OTP sent");
            }

            if (otpEntity.getIsUsed()) {
                throw new InvalidOtpException("OTP has already been used.");
            }

            if (LocalDateTime.now().isAfter(otpEntity.getCreatedAt().plusMinutes(5))) {
                throw new OtpExpiredException("OTP has expired. Request new otp.");
            }

            // ✅ OTP is valid here — generate token only now
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(user);

            userRepository.save(user);

            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);


            response.setId( user.getId());
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setMessage("Welcome to Fund Raiser's!");

            return response;
        } else {
            // ✅ Phone number flow
            String phoneNumber = input.replaceAll("\\s+", "");
            if (phoneNumber.trim().isEmpty()) {
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
            Optional<Otp> otpEntityOpt = otpRepository.findFirstByPhoneNumberAndUsedFalseOrderByCreatedAtDesc(phoneNumber);

            if (otpEntityOpt.isEmpty()) {
                throw new InvalidOtpException("Invalid or expired OTP. Please request a new one.");
            }

            Otp otpEntity = otpEntityOpt.get();
            if(!otpEntity.getOtpType().equalsIgnoreCase("Login")){
                throw new InvalidOtpException("Invalid OTP type.");
            }

            if (!otpEntity.getOtp().equals(otpCode)) {
                throw new InvalidOtpException("This OTP is no longer valid. Please use the latest OTP sent");
            }

            if (otpEntity.getIsUsed()) {
                throw new InvalidOtpException("OTP has already been used.");
            }

            if (LocalDateTime.now().isAfter(otpEntity.getCreatedAt().plusMinutes(5))) {
                throw new OtpExpiredException("OTP has expired. Request new otp.");
            }

            // ✅ OTP is valid here — generate token only now
            User user = userRepository.findByPhoneNumber(phoneNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(user);

            userRepository.save(user);

            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);


            response.setId( user.getId());
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setMessage("Welcome to Fund Raiser's!");

            return response;
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public List<Otp> getAllOtp() {
        return otpRepository.findAll();
    }

    @Transactional
    public String patientInfo(MultipartFile patientImage, List<MultipartFile> reportsImages, PatientRequestDto patientRequestDto, HttpServletRequest request) throws FileUploadException, FileNotFoundException {

        long userId = Long.parseLong((String) request.getAttribute("userId"));

        if(request.getAttribute("userId") == null){
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        if(userId != patientRequestDto.getBasicInfo().getUserId()){
            throw new UnAuthorizedAccessException("You are not authorized to perform this action.");
        }

        if (patientImage.isEmpty()) {
            throw new FileNotFoundException("Failed to upload file: empty file");
        }


        if(!Objects.requireNonNull(patientImage.getOriginalFilename()).endsWith(".jpg") ||
                patientImage.getOriginalFilename().endsWith(".jpeg") ||
                patientImage.getOriginalFilename().endsWith(".png") ||
                patientImage.getOriginalFilename().endsWith(".webp")){
            throw new FileUploadException("Failed to upload file: only jpg, jpeg, png and webp file are allowed");
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
        basicInfo.setStatus(Status.PENDING);
        basicInfo.setMessage("Processing patient info. Please wait for a response from the admin. Thank you for your patience.");
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
            dto.setStatus(entity.getStatus());
            dto.setMessage(entity.getMessage());
            dto.setCreatedAt(entity.getCreatedAt());
            dto.setUpdatedAt(entity.getUpdatedAt());
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

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public String updateProfile(EditProfileRequest editProfileRequest, String authHeader) {

        String firstName = editProfileRequest.getFirstName();
        String lastName = editProfileRequest.getLastName();
        String fullName = editProfileRequest.getFullName();

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Invalid Authorization header format");
        }

        String token = authHeader.substring(7); // gets the token part
        Long extractedId = Long.valueOf(jwtUtils.extractUserId(token));

        if (!extractedId.equals(editProfileRequest.getUserId())) {
            throw new UnAuthorizedAccessException("Access denied.");
        }

        if ((firstName == null || firstName.isBlank()) &&
                (lastName == null || lastName.isBlank()) &&
                (fullName == null || fullName.isBlank())) {
            throw new InvalidInputException("Something went wrong, update any one of the field.");
        }

        User user = userRepository.findById(editProfileRequest.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        if(user.getFirstName() == null && user.getLastName() == null && user.getFullName() == null){
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setFullName(fullName);

            userRepository.save(user);
            return "Profile saved successfully";
        }

        if ((firstName == null || Objects.equals(user.getFirstName(), firstName)) &&
                (lastName == null || Objects.requireNonNull(user.getLastName()).equalsIgnoreCase(lastName)) &&
                (fullName == null || user.getFullName().equalsIgnoreCase(fullName))) {
            return "Profile saved with no changes";
        }

        // Handle First Name
        if (firstName != null && !firstName.trim().isEmpty()) {
            user.setFirstName(firstName);
        }

        // Handle Last Name
        if (lastName != null && !lastName.trim().isEmpty()) {
            user.setLastName(lastName);
        }

        // Handle Full Name
        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setFullName(fullName);
        }

        userRepository.save(user);
        return "Profile details updated successfully";
    }

    private void validateName(String name, String fieldName) {
        if (name.length() < 3) {
            throw new InvalidInputException(fieldName + " must be at least 3 characters long");
        }

        if (name.length() > 25) {
            throw new InvalidInputException(fieldName + " too large");
        }

        if (!name.matches("^[A-Za-z0-9 .'-]+$") || !name.matches(".*[A-Za-z].*")) {
            throw new InvalidInputException(fieldName + " must contain at least one alphabet, and only include letters, spaces, hyphens, apostrophes, dots, or numbers.");
        }
    }

    public String addBloodDonorDetails(BloodDonorDetails bloodDonorDetails) {

        BloodDonor bloodDonor = new BloodDonor();

        if (bloodDonorDetails.getPhoneNumber() == null || bloodDonorDetails.getPhoneNumber().trim().isEmpty()) {
            throw new InvalidPhoneNumberException("Phone number is required.");
        }

        if (!bloodDonorDetails.getPhoneNumber().matches("^[6-9]\\d{9}$")) {
            throw new InvalidPhoneNumberException("Invalid phone number format.");
        }

        Optional<BloodDonor> bloodDonor1 = bloodDonorRepository.findByPhoneNumber(bloodDonorDetails.getPhoneNumber());

        if (bloodDonor1.isPresent()) {
            throw new ResourceAlreadyExistException("Blood donor already exists for this phone number: " + bloodDonorDetails.getPhoneNumber() + ". Please use the update blood donor details endpoint to update existing blood donor details.");
        }

        bloodDonor.setUserId(bloodDonorDetails.getUserId());
        bloodDonor.setFullName(bloodDonorDetails.getFullName());
        bloodDonor.setPhoneNumber(bloodDonorDetails.getPhoneNumber());
        bloodDonor.setEmail(bloodDonorDetails.getEmail());
        bloodDonor.setBloodGroup(bloodDonorDetails.getBloodGroup());
        bloodDonor.setAlternateMobileNumber(bloodDonorDetails.getAlternateMobileNumber());
        bloodDonor.setCountry(bloodDonorDetails.getCountry());
        bloodDonor.setState(bloodDonorDetails.getState());
        bloodDonor.setDistrict(bloodDonorDetails.getDistrict());
        bloodDonor.setCity(bloodDonorDetails.getCity());
        bloodDonor.setTownOrVillage(bloodDonorDetails.getTownOrVillage());
        bloodDonor.setPinCode(bloodDonorDetails.getPinCode());

        bloodDonorRepository.save(bloodDonor);
        return "Blood donor details saved successfully!";
    }

    public BloodDonor getBloodDonorDetails(String phoneNumber) {

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new InvalidPhoneNumberException("Phone number is required.");
        }

        if (!phoneNumber.matches("^[6-9]\\d{9}$")) {
            throw new InvalidPhoneNumberException("Invalid phone number format.");
        }

        return bloodDonorRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Blood donor not found for this user."));
    }

    public BloodDonor getBloodDonorDetailsById(Long id) {
        return bloodDonorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood donor not found with id: " + id));
    }

    public List<BloodDonor> getAllBloodDonorDetails(){

        List<BloodDonor> bloodDonors = bloodDonorRepository.findAll();
        if (bloodDonors.isEmpty()) {
            throw new ResourceNotFoundException("Blood donors list is empty.");
        }

        return bloodDonors;
    }

    public String updatePatientInfoDetailsStatus(Long id, Status status, String message) {
        BasicInfo basicInfo = basicInfoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Basic info not found with id: " + id));

        // Compare enum directly with enum
        if (basicInfo.getStatus() == Status.APPROVED || basicInfo.getStatus() == Status.REJECTED) {
            throw new IllegalArgumentException("Patient info status already updated.");
        }

        if (basicInfo.getStatus() == Status.PENDING || basicInfo.getStatus() == Status.VERIFICATION) {
            basicInfo.setStatus(status);
            basicInfo.setMessage(message);
            basicInfo.setUpdatedAt(LocalDateTime.now());
            basicInfoRepository.save(basicInfo);
            return "Patient info updated successfully!";
        }

        throw new IllegalStateException("Invalid status state");
    }

    @Transactional
    public List<PatientResponseDto> getPatientDetailsByStatus(Status status, HttpServletRequest request) {
        List<BasicInfo> entities = basicInfoRepository.findByStatus(status);
        if (entities.isEmpty()) {
            throw new ResourceNotFoundException("No details found for status: " + status);
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Invalid Authorization header format");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtUtils.extractRole(token);

        List<PatientResponseDto> responseList = new ArrayList<>();

        for (BasicInfo entity : entities) {
            boolean isAdmin = roles.contains("ROLE_ADMIN");
            boolean isUser = roles.contains("ROLE_USER");

            // Access logic:
            if (isUser && status == Status.APPROVED) {
                responseList.add(mapToResponseDto(entity));
            } else if (isAdmin) {
                responseList.add(mapToResponseDto(entity));
            } else {
                throw new UnAuthorizedAccessException("You are not authorized to view this information.");
            }
        }

        return responseList;
    }

    @Transactional
    public List<PatientResponseDto> getPatientDetailsByStatusAndCause(String cause, HttpServletRequest request) {
        List<BasicInfo> entities = basicInfoRepository.findAll();
        if (entities.isEmpty()) {
            throw new ResourceNotFoundException("No details found.");
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Invalid Authorization header format");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtUtils.extractRole(token);

        List<PatientResponseDto> responseList = new ArrayList<>();

        for (BasicInfo entity : entities) {
            boolean isAdmin = roles.contains("ROLE_ADMIN");
            boolean isUser = roles.contains("ROLE_USER");

            // Access logic:
            if (isUser && entity.getStatus() == Status.APPROVED) {
                if (Objects.equals(cause, entity.getCause().getCause())){
                    responseList.add(mapToResponseDto(entity));
                }
            } else if (isAdmin) {
                if (Objects.equals(cause, entity.getCause().getCause())){
                    responseList.add(mapToResponseDto(entity));
                }
            } else {
                throw new UnAuthorizedAccessException("You are not authorized to view this information.");
            }
        }

        return responseList;
    }

    public PatientResponseDto getPatientDetailsById(Long id, HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Invalid Authorization header format");
        }

        String token = authHeader.substring(7);
        List<String> roles = jwtUtils.extractRole(token);

        Long userId = Long.valueOf(jwtUtils.extractUserId(token));

        boolean isAdmin = roles.contains("ROLE_ADMIN");
        boolean isUser = roles.contains("ROLE_USER");

        BasicInfo basicInfo = basicInfoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Basic info not found with id: " + id));


        if (isAdmin) {
            return mapToResponseDto(basicInfo);
        } else if (basicInfo.getUserId().equals(userId)) {
            return mapToResponseDto(basicInfo);
        } else if (isUser && basicInfo.getStatus() == Status.APPROVED){
            return mapToResponseDto(basicInfo);
        } else {
            throw new UnAuthorizedAccessException("You are not authorized to view this information.");
        }
    }

    private PatientResponseDto mapToResponseDto(BasicInfo entity) {
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
        dto.setStatus(entity.getStatus());
        dto.setMessage(entity.getMessage());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
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

        return patientResponseDto;
    }

    public void sendEmailToOrganization(ContactRequest contactRequest) {
        emailService.sendMailToOrganization(contactRequest);
    }

    public String updateRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<String> currentRoles = user.getRole();
        Set<String> updatedRoles = new HashSet<>();

        for (String role : currentRoles) {
            updatedRoles.add("ROLE_" + role);
        }

        user.setRole(updatedRoles);
        userRepository.save(user); // Save the updated user back to the database

        return "Roles updated successfully";
    }

    public LoginResponse loginForAdmin(AdminLogin adminLogin) {
        LoginResponse response = new LoginResponse();

        if(adminLogin.getEmail() == null || adminLogin.getEmail().isBlank()){
            throw new InvalidInputException("Email should not be empty");
        }

        if(adminLogin.getPassword() == null || adminLogin.getPassword().isBlank()){
            throw new InvalidInputException("Password should not be empty");
        }

        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

        // Validate email
        if (adminLogin.getEmail() != null) {
            if (!emailPattern.matcher(adminLogin.getEmail()).matches()) {
                throw new InvalidInputException("Please enter a valid email.");
            }
            if (adminLogin.getEmail().length() > 50) {
                throw new InvalidInputException("Email must not exceed 50 characters.");
            }
        }

        if (adminLogin.getPassword().length() < 8) {
            throw new WeakPasswordException("Password must be at least 8 characters long");
        }

        // First check if user exists
        var user = userRepository.findByEmail(adminLogin.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not registered"));

        // Then validate password
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(adminLogin.getEmail(), adminLogin.getPassword()));
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        // Generate tokens
        var jwt = jwtUtils.generateToken(user);
        var refreshToken = jwtUtils.generateRefreshToken(user);

        response.setToken(jwt);
        response.setRefreshToken(refreshToken);
        response.setMessage("Successfully Logged In");

        return response;
    }


}   // End of UserAuthenticationService class