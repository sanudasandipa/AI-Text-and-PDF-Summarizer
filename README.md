# AI Text and PDF Summarizer

A modern React application that uses advanced AI technology to summarize text and PDF documents, extracting key insights with ease.

## 🌟 Live Demo

**[Try the Live Application](https://text-pdf-summarizer3.netlify.app/)**

Experience the power of AI-driven text and PDF summarization in your browser!

## Features

- 🤖 **AI-Powered Summarization**: Uses cutting-edge AI for accurate text summarization
- � **PDF Processing**: Upload and summarize PDF documents seamlessly
- �📝 **Multiple Summary Lengths**: Choose between short, medium, and long summaries
- 🎯 **Key Points Extraction**: Extract important bullet points from any text
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📋 **Copy to Clipboard**: Easy copying of results
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🧭 **Smart Navigation**: Responsive navbar with smooth scrolling
- 🎭 **Interactive Demo**: Built-in showcase with sample content

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and go to `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

## How to Use

### Text Summarization
1. **Enter Text**: Paste or type the text you want to summarize in the input area
2. **Choose Mode**: Select either "Summary" or "Key Points" tab
3. **Select Length**: For summaries, choose between Short, Medium, or Long
4. **Generate**: Click the "Summarize" or "Extract Key Points" button
5. **Copy Results**: Use the copy button to copy the results to your clipboard

### PDF Summarization
1. **Upload PDF**: Click on the PDF Summarizer tab and upload your PDF file
2. **Processing**: The app will extract text from your PDF automatically
3. **Choose Options**: Select your preferred summary length or key points extraction
4. **Get Results**: View and copy the AI-generated summary or key points

### Demo Showcase
- Explore the interactive demo section with pre-loaded examples
- Try different types of content to see how the AI performs

## API Configuration

The application uses advanced AI technology for text processing. The API configuration is already set up in the application, but you can update it in `src/services/geminiService.js` if needed.

## Technologies Used

- **React 18**: Frontend framework
- **Google Gemini AI**: Advanced AI for text summarization and processing
- **PDF.js**: PDF processing and text extraction
- **CSS3**: Modern styling with gradients and animations
- **Netlify**: Deployment and hosting platform
- **Responsive Design**: Mobile-first approach

## Project Structure

```
src/
  ├── components/
  │   ├── DemoShowcase.js     # Interactive demo examples
  │   ├── Navbar.js           # Navigation component
  │   ├── TextSummarizer.js   # Text input and summarization
  │   └── PDFSummarizer.js    # PDF upload and processing
  ├── services/
  │   └── geminiService.js    # Gemini AI service integration
  ├── App.js                  # Main application component
  ├── App.css                 # Application styles
  ├── index.js                # React entry point
  └── index.css               # Global styles
```

## Features in Detail

### Text Summarization
- **Short**: 2-3 sentence summaries
- **Medium**: 1-2 paragraph summaries (default)
- **Long**: 3-4 paragraph detailed summaries

### Key Points Extraction
- Automatically extracts and formats key points as bullet lists
- Focuses on the most important information
- Works with both text input and PDF documents

### PDF Processing
- **File Upload**: Drag and drop or click to upload PDF files
- **Text Extraction**: Automatically extracts text content from PDFs
- **Large File Support**: Handles various PDF sizes and formats
- **Error Handling**: Graceful handling of corrupted or unsupported files

### User Experience
- Real-time loading indicators
- Error handling with user-friendly messages
- Responsive design for all screen sizes
- Clean, modern interface

## 🚀 Deployment

The application is deployed and live at: **[https://text-pdf-summarizer3.netlify.app/](https://text-pdf-summarizer3.netlify.app/)**

### Deployment Details
- **Platform**: Netlify
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Auto-Deploy**: Connected to main branch for continuous deployment

### Deploy Your Own
1. Fork this repository
2. Connect your fork to Netlify
3. Set up environment variables for API keys
4. Deploy with automatic builds from your repository

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This project is open source and available under the MIT License.
