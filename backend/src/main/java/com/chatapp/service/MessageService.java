package com.chatapp.service;

import com.chatapp.model.ChatMessage;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;


@Service
public class MessageService {

    // Thread-safe list since multiple WebSocket sessions write concurrently
    private final List<ChatMessage> history = new CopyOnWriteArrayList<>();

    public ChatMessage save(ChatMessage message) {
        if (message.getId() == null) {
            message.setId(UUID.randomUUID().toString());
        }
        history.add(message);
        return message;
    }

    public List<ChatMessage> getHistory() {
        return Collections.unmodifiableList(history);
    }
}
