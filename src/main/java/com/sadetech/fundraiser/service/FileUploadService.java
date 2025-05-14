package com.sadetech.fundraiser.service;

import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value( "${upload.dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) throws FileUploadException {
         if (file.isEmpty()) {
             throw new FileUploadException("Failed to upload file: empty file");
         }

         try {
             String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
             String fileName = UUID.randomUUID() + "_" + originalFileName;
             Path uploadPath = Paths.get(uploadDir).toAbsolutePath();

             if(!Files.exists(uploadPath)) {
                 Files.createDirectories(uploadPath);
             }

             Path filePath = uploadPath.resolve(fileName);
             Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

             String encodedFileName = encodeFileName(fileName);

             return "/uploads/" + encodedFileName;

         } catch (IOException e) {
             throw new RuntimeException(e);
         }
    }

    public List<String> uploadListFile(List<MultipartFile> files) throws FileUploadException {

        if (files == null || files.isEmpty()) {
            throw new FileUploadException("Failed to upload file: empty file list");
        }

        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
                String fileName = UUID.randomUUID() + "_" + originalFileName;

                Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String encodedFileName = encodeFileName(fileName);
                String fileUrl = "/uploads/" + encodedFileName;

                uploadedUrls.add(fileUrl);
            } catch (IOException e) {
                throw new FileUploadException("Could not upload file: " + file.getOriginalFilename(), e);
            }
        }

        return uploadedUrls;
    }


    private String encodeFileName(String fileName) {
        String[] parts = fileName.split(" at ");
        if (parts.length == 2) {
            String firstPart = URLEncoder.encode(parts[0], StandardCharsets.UTF_8).replace("+", "%20");
            String secondPart = URLEncoder.encode(parts[1], StandardCharsets.UTF_8).replace("+", "%20");
            return firstPart + " at%20" + secondPart;  // Note the space before "at" is not encoded
        } else {
            return URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20");
        }
    }
}
