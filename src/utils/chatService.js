import axios from 'axios';

// Direct integration with Groq API
export const sendChatMessage = async (messages) => {
  try {
    // Replace this with your actual Groq API key
    const GROQ_API_KEY = "put your api here";
    
    // Prepare the messages array with system prompt
    const fullMessages = [
      {
        role: "system",
        content: "You are a helpful travel assistant for Touristaan. You help users find the perfect tour packages and answer their questions about travel. Always be friendly, professional, and helpful. If you don't know something, it's okay to say so."
      },
      ...messages
    ];
    
    // Send directly to Groq API using axios
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      messages: fullMessages,
      model: "llama-3.3-70b-versatile"
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error sending message to Groq API:', error);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
};
