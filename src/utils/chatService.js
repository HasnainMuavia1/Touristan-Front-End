import axios from 'axios';

// Send chat message through backend API (which uses Groq)
// The Groq API key is stored securely in the backend environment variables
export const sendChatMessage = async (messages) => {
  try {
    // Send to backend API endpoint which handles Groq API integration
    // The backend uses process.env.GROQ_API_KEY from server environment
    const response = await axios.post('/api/chat/message', {
      messages: messages
    });
    
    if (response.data.success) {
      return response.data.response;
    } else {
      throw new Error(response.data.error || 'Failed to get response');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
};
