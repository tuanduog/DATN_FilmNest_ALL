package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    public FileUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping(value = "/upload/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseData<?> uploadImage(@RequestParam("file") MultipartFile file,
                                         @RequestParam("folder") String folderName) throws IOException {
        return new ResponseData<>(HttpStatus.OK.value(), "Upload Image Successful", cloudinaryService.uploadFile(file, folderName));
    }

    @PostMapping("/upload/video")
    public ResponseData<?> uploadVideo(@RequestParam("file") MultipartFile file,
                                         @RequestParam("folder") String folderName) throws IOException {
        return new ResponseData<>(HttpStatus.OK.value(), "Upload Video Successful", cloudinaryService.uploadFile(file, folderName));
    }
}