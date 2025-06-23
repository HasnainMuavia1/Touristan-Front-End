import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';
import { sendChatMessage } from '../../utils/chatService';
import { FaComments, FaPaperPlane, FaTimes, FaRobot, FaCircle, FaCheck, FaCheckDouble } from 'react-icons/fa';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle chat widget open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // If opening chat for the first time and no messages, add welcome message
    if (!isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'Hello! 👋 I\'m your Touristaan travel assistant. How can I help you plan your next adventure?' 
        }
      ]);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: newMessage.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Format messages for API
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      messageHistory.push(userMessage);
      
      // Send to API and get response
      const response = await sendChatMessage(messageHistory);
      
      // Add assistant response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again later.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Chat toggle button */}
      <button 
        className="chat-widget-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>
      
      {/* Chat panel */}
      <div className={`chat-widget-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-widget-header">
          <div className="header-title">
            <div className="bot-avatar">
              <FaRobot />
            </div>
            <div>
              <h3>Touristaan Assistant</h3>
              <div className="online-status">
                <FaCircle className="online-dot" /> Online
              </div>
            </div>
          </div>
          <button 
            className="chat-close-button" 
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="chat-widget-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                {message.content}
                {message.role === 'user' && (
                  <span className="message-status">
                    <FaCheckDouble className="message-tick" />
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message assistant-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-widget-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            ref={inputRef}
            onKeyDown={(e) => e.key === 'Enter' && newMessage.trim() && handleSendMessage(e)}
          />
          <button 
            type="submit" 
            className={isLoading || !newMessage.trim() ? 'disabled' : ''}
            disabled={isLoading || !newMessage.trim()}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
