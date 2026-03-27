package com.booking.booking_ticket.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {

    public Map uploadFile(MultipartFile file, String folderName);

    public Map uploadVideo(MultipartFile file, String folderName);
}
