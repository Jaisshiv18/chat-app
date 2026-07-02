package com.chatapp.controller;

import com.chatapp.model.ChatMessage;
import com.chatapp.service.MessageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/messages")
public class ChatHistoryController {

    private final MessageService messageService;

    public ChatHistoryController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<ChatMessage> getHistory() {
        return messageService.getHistory();
    }
}
