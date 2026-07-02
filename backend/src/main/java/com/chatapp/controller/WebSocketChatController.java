package com.chatapp.controller;

import com.chatapp.model.ChatMessage;
import com.chatapp.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;


@Controller
public class WebSocketChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketChatController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage incoming) {
        incoming.setType(ChatMessage.MessageType.CHAT);
        incoming.setTimestamp(LocalDateTime.now());
        ChatMessage saved = messageService.save(incoming);
        messagingTemplate.convertAndSend("/topic/messages", saved);
    }

    @MessageMapping("/chat.join")
    public void addUser(ChatMessage incoming, SimpMessageHeaderAccessor headerAccessor) {
        // Stash the username on the WebSocket session so we could look it up
        // later (e.g. on disconnect) if you want to broadcast a LEAVE event.
        headerAccessor.getSessionAttributes().put("username", incoming.getSender());

        incoming.setType(ChatMessage.MessageType.JOIN);
        incoming.setContent(incoming.getSender() + " joined the chat");
        incoming.setTimestamp(LocalDateTime.now());
        ChatMessage saved = messageService.save(incoming);
        messagingTemplate.convertAndSend("/topic/messages", saved);
    }
}
