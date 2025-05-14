<script setup>
import { ref, onMounted } from "vue";

const isOpen = ref(false);
const messages = ref([]);
const newMessage = ref("");
const isLoading = ref(false);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  // Add user message
  messages.value.push({
    text: newMessage.value,
    sender: "user",
  });

  const userMessage = newMessage.value;
  newMessage.value = "";
  isLoading.value = true;

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    // Add AI response
    messages.value.push({
      text: data.reply,
      sender: "ai",
    });
  } catch (error) {
    messages.value.push({
      text: "Sorry, I encountered an error. Please try again.",
      sender: "ai",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="chat-container">
    <!-- Chat Button -->
    <button class="chat-button" @click="toggleChat">
      <span v-if="!isOpen">💬</span>
      <span v-else>✕</span>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>AI Assistant</h3>
      </div>

      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender]"
        >
          {{ message.text }}
        </div>
        <div v-if="isLoading" class="message ai loading">Thinking...</div>
      </div>

      <div class="input-area">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
          type="text"
        />
        <button @click="sendMessage" :disabled="isLoading">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.chat-window {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 380px;
  height: 600px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.chat-header {
  padding: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f8fafc;
}

.message {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 16px;
  margin: 2px 0;
  font-size: 0.95em;
  line-height: 1.4;
  position: relative;
}

.message.user {
  background-color: #4f46e5;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message.ai {
  background-color: white;
  color: #1f2937;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message.loading {
  opacity: 0.7;
  background-color: #f3f4f6;
}

.input-area {
  padding: 16px;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-area input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  outline: none;
  font-size: 0.95em;
  transition: all 0.2s ease;
  background-color: #f8fafc;
}

.input-area input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-area button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.input-area button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.input-area button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Custom scrollbar */
.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
