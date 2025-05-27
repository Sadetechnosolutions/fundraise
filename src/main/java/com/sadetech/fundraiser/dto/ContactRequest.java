package com.sadetech.fundraiser.dto;

import lombok.Data;

@Data
public class ContactRequest {
    private String email;
    private String subject;
    private String query;
}
