import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeminiChat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Gemini with your API key
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
console.log("model",model)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send prompt to Gemini API
      const result = await model.generateContent(input);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setInput(''); // Clear input
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gemini Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{ width: '70%', padding: '10px', marginRight: '10px' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiChat;