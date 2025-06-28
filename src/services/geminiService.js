import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA8PIcDMUUoY9MeRBZWOpo9U3Q_myVJFvQ';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async summarizeText(text, summaryLength = 'medium') {
    try {
      let lengthInstruction = '';
      
      switch (summaryLength) {
        case 'short':
          lengthInstruction = 'in 2-3 sentences';
          break;
        case 'medium':
          lengthInstruction = 'in 1-2 paragraphs';
          break;
        case 'long':
          lengthInstruction = 'in 3-4 paragraphs with detailed key points';
          break;
        default:
          lengthInstruction = 'in 1-2 paragraphs';
      }

      const prompt = `Please summarize the following text ${lengthInstruction}. Focus on the main ideas and key points:

${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw new Error('Failed to summarize text. Please try again.');
    }
  }

  async extractKeyPoints(text) {
    try {
      const prompt = `Extract the key points from the following text and present them as a bulleted list:

${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error extracting key points:', error);
      throw new Error('Failed to extract key points. Please try again.');
    }
  }
  
  async summarizePDF(text, summaryLength = 'medium', mode = 'general') {
    try {
      let lengthInstruction = '';
      
      switch (summaryLength) {
        case 'short':
          lengthInstruction = 'in 2-3 sentences';
          break;
        case 'medium':
          lengthInstruction = 'in 1-2 paragraphs';
          break;
        case 'long':
          lengthInstruction = 'in 3-4 paragraphs with detailed analysis';
          break;
        default:
          lengthInstruction = 'in 1-2 paragraphs';
      }

      let modeInstruction = '';
      switch (mode) {
        case 'academic':
          modeInstruction = 'Focus on research methodology, findings, conclusions, and academic significance. Highlight any data, statistics, or research contributions.';
          break;
        case 'business':
          modeInstruction = 'Focus on business implications, actionable insights, financial impacts, strategic recommendations, and market opportunities.';
          break;
        case 'technical':
          modeInstruction = 'Focus on technical specifications, implementation details, processes, methodologies, and technical requirements.';
          break;
        case 'executive':
          modeInstruction = 'Provide a high-level executive overview focusing on key decisions, outcomes, recommendations, and strategic implications.';
          break;
        default:
          modeInstruction = 'Provide a comprehensive overview covering the main themes, important points, and overall message of the document.';
      }

      const prompt = `Please analyze and summarize the following PDF document content ${lengthInstruction}. 

${modeInstruction}

Document Content:
${text}

Please provide a clear, well-structured summary that captures the essence of the document according to the specified focus area.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      throw new Error('Failed to summarize PDF content. Please try again.');
    }
  }

  async extractPDFKeyPoints(text, mode = 'general') {
    try {
      let modeInstruction = '';
      switch (mode) {
        case 'academic':
          modeInstruction = 'Focus on research objectives, methodology, key findings, conclusions, and academic contributions.';
          break;
        case 'business':
          modeInstruction = 'Focus on business insights, actionable recommendations, financial implications, and strategic points.';
          break;
        case 'technical':
          modeInstruction = 'Focus on technical specifications, processes, requirements, and implementation details.';
          break;
        case 'executive':
          modeInstruction = 'Focus on high-level strategic points, decisions, outcomes, and recommendations for leadership.';
          break;
        default:
          modeInstruction = 'Extract the most important and relevant points from the document.';
      }

      const prompt = `Extract the key points from the following PDF document content and present them as a well-organized bulleted list.

${modeInstruction}

Document Content:
${text}

Please organize the key points in a logical structure with clear bullet points, ensuring each point is concise but informative.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error extracting key points from PDF:', error);
      throw new Error('Failed to extract key points from PDF. Please try again.');
    }
  }
}

const aiServiceInstance = new AIService();
export default aiServiceInstance;
