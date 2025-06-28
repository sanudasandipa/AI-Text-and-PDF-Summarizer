# AI Text Summarizer

A modern React application that uses advanced AI technology to summarize text and extract key points.

## Features

- 🤖 **AI-Powered Summarization**: Uses cutting-edge AI for accurate text summarization
- 📝 **Multiple Summary Lengths**: Choose between short, medium, and long summaries
- 🎯 **Key Points Extraction**: Extract important bullet points from any text
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📋 **Copy to Clipboard**: Easy copying of results
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🧭 **Smart Navigation**: Responsive navbar with smooth scrolling

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

1. **Enter Text**: Paste or type the text you want to summarize in the input area
2. **Choose Mode**: Select either "Summary" or "Key Points" tab
3. **Select Length**: For summaries, choose between Short, Medium, or Long
4. **Generate**: Click the "Summarize" or "Extract Key Points" button
5. **Copy Results**: Use the copy button to copy the results to your clipboard

## API Configuration

The application uses advanced AI technology for text processing. The API configuration is already set up in the application, but you can update it in `src/services/geminiService.js` if needed.

## Technologies Used

- **React 18**: Frontend framework
- **Advanced AI**: For text summarization and processing
- **CSS3**: Modern styling with gradients and animations
- **Responsive Design**: Mobile-first approach

## Project Structure

```
src/
  ├── components/
  │   ├── DemoShowcase.js     # Interactive demo examples
  │   └── Navbar.js           # Navigation component
  ├── services/
  │   └── geminiService.js    # AI service integration
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

### User Experience
- Real-time loading indicators
- Error handling with user-friendly messages
- Responsive design for all screen sizes
- Clean, modern interface

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This project is open source and available under the MIT License.
