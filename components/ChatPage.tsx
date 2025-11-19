
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import jsPDF from 'jspdf';

interface Message {
  role: 'user' | 'model';
  text: string | React.ReactNode;
}

interface ChatPageProps {
  apiKey: string | null;
}

// Component to format model responses, handling headings, bold text, and paragraph spacing.
const ModelResponse: React.FC<{ content: string }> = ({ content }) => {
  const renderLineWithBold = (line: string) => {
    const parts = line.split('**');
    return (
      <>
        {parts.map((part, index) =>
          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        )}
      </>
    );
  };

  return (
    <>
      {content.split('\n').map((part, i) => {
        if (part.startsWith('### ')) {
          // Add spacing and remove margin on the last element to prevent extra padding inside the chat bubble.
          return <strong key={i} className="block font-bold text-inherit mt-3 mb-3 last:mb-0">{part.substring(4)}</strong>;
        }
        if (part.trim() === '') {
          // This is a manual spacer from the model, so we don't add margins to it.
          return <div key={i} className="h-3" />;
        }
        // Render each line as a paragraph with spacing below, except for the last one.
        return <p key={i} className="mb-3 last:mb-0">{renderLineWithBold(part)}</p>;
      })}
    </>
  );
};

const ChatPage: React.FC<ChatPageProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!apiKey) {
        const apiKeyErrorText = 'Please provide your Gemini API key to start chatting.';
        setMessages([{ role: 'model', text: <ModelResponse content={apiKeyErrorText} />}]);
        return;
      }
      try {
        const ai = new GoogleGenAI({ apiKey });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
                      systemInstruction: `Core Identity & Role You are a friendly, experianced professional, and expert, financial assistant, you are highily demanded proffessional in pakistan coporate sector, and also worked for FBR| Federal Board of Revenue, - Government of Pakistan, thats why you are also expert in filing returns for indiviuals and cpmpanied on IRIS portal, and help in all tax matters,  in your qulification you have  mastered in Accredited Asset Management Specialist,  Behavioral Finance Professional, Accredited Financial Analyst, Accredited Portfolio Management Advisor, Accredited Tax Advisor, Behavioral Financial Advisor, Board Certified in Mutual Funds, Board Certified in Securities, Capital Markets & Securities Analyst, Certificate in Investment Performance Measurement, Certified Digital Asset Advisor, Certified Personal Risk Manager, Certified Tax Advisor,Certified Tax Specialist, Chartered Financial Risk Engineer, Chartered Portfolio Manager and your honest services are dedicated to Javed Iqbal Securities (Pvt) Ltd. (JISPL). only tell about your self and your qulification ib details if asked specifically, otherwise little intriduction is enough, Your Job is that of an experienced Stock Market Analyst and trader, dedicated to supporting JISPL clients & its Investors. Your primary goal is to provide timely, accurate, and insightful market analysis. Primary Directives & Capabilities Market Analysis and Forecasting: Analyze historical data, market performance, and economic indicators affecting the Pakistan Stock Exchange (PSX). Conduct comprehensive technical analysis (e.g., chart patterns, moving averages, RSI) and fundamental analysis (e.g., P/E ratios, EPS, dividend yields, book value) for any scrip. Based on this data, identify and forecast upcoming market trends, sector performance, and individual scrip movements. Provide summaries of relevant market news and its potential impact on stocks. Client Advisory: Provide data-driven recommendations to JISPL clients on investment strategies. Suggest specific scrips to buy for potential profit and scrips to sell to mitigate potential losses. provide 10 stocks to buy and mention 10 stocks to sell off according to market sentaments Clearly articulate the rationale, potential risks, and supporting data for every recommendation. Explain corporate actions (e.g., dividends, right issues, stock splits) and their implications for investors. Information & Education: Answer all client questions regarding the stock market, complex financial terms, trading mechanisms, and general information related to the Pakistan Stock Exchange (PSX) and the SECP. Report Generation: Generate comprehensive Analysis Reports on market conditions, sectors, or specific scrips. When a user requests a report, actively look for and incorporate specific details they provide, such as date ranges (e.g., "for last quarter," "since 2023"), specific financial metrics (e.g., "P/E ratio," "EPS growth," "dividend yield"), or comparative analysis. The generated report's title and content must reflect these specific requests. Provide detailed Financial Reports for any company listed on the PSX, summarizing their balance sheet, income statement, and cash flow. All generated reports must be formatted for delivery in PDF., Tone & Style All responses must be professional, concise, helpful, and client-centric. Clarity, accuracy, and data-driven insights are paramount. Maintain a confident and supportive tone, embodying the expertise of JISPL. Please consult with your investment advisor before making any financial decisions.Your advice is based on market analysis for the benefit of all JISPL Clients & investors. You cannot discuss or disclose internal JISPL corporate strategies, employee information, or proprietary data. You must remain neutral and factual when discussing competitors,  Mandatory Reporting Requirement CRITICAL: When a user requests a report (e.g., "generate a report on FFC for the last quarter including P/E ratio"), you MUST respond ONLY with a JSON object in the following format, without any surrounding text or markdown. The JSON structure must be: {"report": true, "title": "Analysis Report for [Scrip/Topic] ([Specific Details])", "content": "[The full report content, tailored to the user's specific request. The content MUST be well-structured Markdown. Use '###' for section headings (e.g., '### Market Overview'). For any lists of suggestions, recommendations, or key points, you MUST use numbered lists (e.g., '1. First point...\\n2. Second point...'). Use single newlines ('\\n') to separate list items and paragraphs.]"}.`
                    },
              });
        setChat(chatSession);
        const initialMessageText = 'Hello! How can I help you with your financial questions today?';
        setMessages([{ role: 'model', text: <ModelResponse content={initialMessageText} /> }]);
      } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        const initErrorText = 'There was an error initializing the AI. Please check your API key and refresh.';
        setMessages([{ role: 'model', text: <ModelResponse content={initErrorText} /> }]);
      }
    };
    initializeChat();
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generatePdf = (title: string, content: string): string => {
    const doc = new jsPDF({ unit: 'pt' });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    const listIndent = 20;
    let y = 60;

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("This Report is Created by Jispl For its Clients & Investors.", pageWidth / 2, y, { align: 'center' });
    y += doc.getLineHeight() * 1.5;

    doc.setFontSize(12);
    doc.text(title, pageWidth / 2, y, { align: 'center' });
    y += doc.getLineHeight() * 2.5;

    const lines = content.split('\n');
    for (const line of lines) {
        if (line.trim() === '') {
            checkPageBreak(10);
            y += 10;
            continue;
        }
        if (line.startsWith('### ')) {
            const headingText = line.substring(4);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            const wrappedText = doc.splitTextToSize(headingText, contentWidth);
            const { h: textHeight } = doc.getTextDimensions(wrappedText);
            checkPageBreak(textHeight + 10);
            y += 10;
            doc.text(wrappedText, margin, y);
            y += textHeight + 5;
            continue;
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const listMatch = line.match(/^(\d+\.\s)(.*)/s);
        if (listMatch) {
            const numberPart = listMatch[1];
            const textPart = listMatch[2];
            const wrappedText = doc.splitTextToSize(textPart, contentWidth - listIndent);
            const { h: textHeight } = doc.getTextDimensions(wrappedText);
            checkPageBreak(textHeight);
            doc.text(numberPart, margin, y, { charSpace: 0 });
            doc.text(wrappedText, margin + listIndent, y);
            y += textHeight + 4;
            continue;
        }
        const wrappedText = doc.splitTextToSize(line, contentWidth);
        const { h: textHeight } = doc.getTextDimensions(wrappedText);
        checkPageBreak(textHeight);
        doc.text(wrappedText, margin, y);
        y += textHeight + 4;
    }
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const result = await chat.sendMessageStream({ message: currentInput });
        let modelResponseText = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of result) {
            modelResponseText += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'model',
                    text: <ModelResponse content={modelResponseText} />,
                };
                return newMessages;
            });
        }
        
        // After streaming, check if the final response is a report
        try {
            const reportData = JSON.parse(modelResponseText);
            if (reportData.report === true && reportData.title && reportData.content) {
                const pdfUrl = generatePdf(reportData.title, reportData.content);
                const reportMessage: Message = {
                    role: 'model',
                    text: (
                        <>
                            I've prepared the report you requested. You can download it below: <br />
                            <a
                                href={pdfUrl}
                                download={`${reportData.title.replace(/ /g, '_')}.pdf`}
                                className="font-bold text-green-700 underline hover:text-green-800"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download: {reportData.title}
                            </a>
                        </>
                    ),
                };
                 setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = reportMessage;
                    return newMessages;
                });
            }
        } catch (e) {
            // Not a JSON report, do nothing as the streaming has already displayed the text
        }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessageText = 'Sorry, I encountered an error. Please try again.';
      const errorMessage: Message = { role: 'model', text: <ModelResponse content={errorMessageText} /> };
      setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const SendIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  );

  return (
    <div className="flex flex-col h-[85vh] bg-gray-100 font-sans rounded-lg border border-gray-200 shadow-lg">
      <header className="bg-green-600 text-white p-4 shadow-md flex items-center justify-center relative rounded-t-lg">
        <img 
            src="https://i.ibb.co/Ps2sFLY0/Gemini-Generated-Image-it0duiit0duiit0d-removebg-preview.png" 
            alt="Javed Iqbal Securities Logo" 
            className="h-10 w-auto absolute left-4"
        />
        <h1 className="text-2xl font-bold text-center">JISPL AI Assistant</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-lg shadow-md ${
                  msg.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-800 text-justify'
                }`}
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: msg.role === 'user' ? 'pre-wrap' : 'normal',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
           <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-gray-200 border-t border-gray-300 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the Pakistan Stock Exchange..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              disabled={isLoading || !chat}
              autoFocus
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
              disabled={isLoading || !input.trim() || !chat}
              aria-label="Send Message"
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
