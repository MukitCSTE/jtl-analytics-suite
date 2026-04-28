import { useState, useRef, useEffect } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import {
  Card,
  CardContent,
  Text,
  Stack,
  Button,
} from '@jtl-software/platform-ui-react';
import {
  FileText,
  Send,
  Loader2,
  Bot,
  User,
  FileSpreadsheet,
  File,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  Mail,
} from 'lucide-react';

interface ReportAgentViewProps {
  appBridge: AppBridge;
}

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  data?: any;
  options?: { label: string; value: string; icon?: React.ReactNode }[];
  inputType?: 'text' | 'email' | 'choice';
  isLoading?: boolean;
}

type AgentState =
  | 'idle'
  | 'querying'
  | 'showing_results'
  | 'asking_satisfied'
  | 'asking_delivery'
  | 'asking_email'
  | 'asking_format'
  | 'processing'
  | 'done';

const AI_SERVER_URL = 'http://localhost:3006/mcp';

const MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast)' },
  { id: 'gpt-4o', name: 'GPT-4o (Powerful)' },
  { id: 'gpt-4', name: 'GPT-4 (Legacy)' },
];

const ReportAgentView: React.FC<ReportAgentViewProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I\'m your Report Agent. What report would you like me to generate?\n\nFor example:\n• "Show me sales from last week"\n• "Top 10 customers this month"\n• "Orders pending shipment"',
    },
  ]);
  const [input, setInput] = useState('');
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [currentReport, setCurrentReport] = useState<{ query: string; data: any; answer: string } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'download' | 'email'>('download');
  const [email, setEmail] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Focus input so user can edit before sending
        setTimeout(() => inputRef.current?.focus(), 100);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Text-to-speech function
  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text (remove markdown)
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/---/g, '')
      .replace(/\n+/g, '. ')
      .substring(0, 500); // Limit length

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; // Slower, more natural
    utterance.pitch = 1.05; // Slightly higher for friendlier tone
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id'>, speakText?: string) => {
    const newMessage = { ...message, id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage]);

    // Only speak short conversational messages, not report data
    if (speakText && message.role === 'agent' && !message.isLoading) {
      setTimeout(() => speak(speakText), 100);
    }
  };

  const removeLoadingMessages = () => {
    setMessages(prev => prev.filter(m => !m.isLoading));
  };

  // Parse query for auto-send instructions (email and format)
  const parseAutoSendInstructions = (query: string) => {
    const emailMatch = query.match(/[\w.-]+@[\w.-]+\.\w+/);
    const wantsEmail = /\b(email|send|mail)\b/i.test(query);
    const format = /\bjson\b/i.test(query) ? 'json' : 'csv'; // Default to CSV
    return {
      email: emailMatch ? emailMatch[0] : null,
      wantsEmail,
      format,
    };
  };

  const handleQuery = async (query: string) => {
    // Check if user wants auto-send (includes email address in query)
    const autoSend = parseAutoSendInstructions(query);

    // Add user message
    addMessage({ role: 'user', content: query });

    // Add loading message
    addMessage({ role: 'agent', content: '', isLoading: true });
    setAgentState('querying');

    try {
      const response = await fetch(`${AI_SERVER_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await response.json();
      removeLoadingMessages();

      // Store report data
      setCurrentReport({ query, data: data.data, answer: data.answer });

      // If user included email in query, auto-send without confirmation
      if (autoSend.email && autoSend.wantsEmail) {
        setEmail(autoSend.email);
        setDeliveryMethod('email');

        const reportData = { query, data: data.data, answer: data.answer };

        addMessage({
          role: 'agent',
          content: data.answer + `\n\n---\n\n📧 **Auto-sending to ${autoSend.email}...**`,
          data: data.data,
        }, `Got it! Sending report to ${autoSend.email}`);

        // Auto-process with detected format - pass report data directly
        setTimeout(() => handleFormatAuto(autoSend.format, autoSend.email!, reportData), 500);
        return;
      }

      // Show results and ask if satisfied (normal flow)
      addMessage({
        role: 'agent',
        content: data.answer + '\n\n---\n\n**Are you satisfied with this report?**',
        data: data.data,
        options: [
          { label: 'Yes, looks good!', value: 'yes', icon: <Download size={16} /> },
          { label: 'No, let me refine', value: 'no' },
        ],
        inputType: 'choice',
      }, 'Here is your report. Are you satisfied with this?');

      setAgentState('asking_satisfied');
    } catch (error) {
      removeLoadingMessages();
      addMessage({
        role: 'agent',
        content: 'Sorry, I couldn\'t generate that report. Please try again or rephrase your request.',
      });
      setAgentState('idle');
    }
  };

  const handleSatisfied = (satisfied: boolean) => {
    addMessage({ role: 'user', content: satisfied ? 'Yes, looks good!' : 'No, let me refine' });

    if (satisfied) {
      addMessage({
        role: 'agent',
        content: 'How would you like to receive the report?',
        options: [
          { label: 'Download', value: 'download', icon: <Download size={16} /> },
          { label: 'Send via Email', value: 'email', icon: <Mail size={16} /> },
        ],
        inputType: 'choice',
      }, 'How would you like to receive the report? Download or email?');
      setAgentState('asking_delivery');
    } else {
      addMessage({
        role: 'agent',
        content: 'No problem! What changes would you like? Or ask for a different report:',
      }, 'No problem! What changes would you like?');
      setAgentState('idle');
      setCurrentReport(null);
    }
  };

  const handleDeliveryMethod = (method: 'download' | 'email') => {
    setDeliveryMethod(method);
    addMessage({ role: 'user', content: method === 'download' ? 'Download' : 'Send via Email' });

    if (method === 'email') {
      addMessage({
        role: 'agent',
        content: 'Please enter the email address to send the report to:',
        inputType: 'text',
      }, 'Please enter the email address.');
      setAgentState('asking_email');
    } else {
      addMessage({
        role: 'agent',
        content: 'What format would you like?',
        options: [
          { label: 'CSV Spreadsheet', value: 'csv', icon: <FileSpreadsheet size={16} /> },
          { label: 'JSON Data', value: 'json', icon: <File size={16} /> },
        ],
        inputType: 'choice',
      }, 'What format would you like? CSV or JSON?');
      setAgentState('asking_format');
    }
  };

  const handleEmail = (emailAddress: string) => {
    setEmail(emailAddress);
    addMessage({ role: 'user', content: emailAddress });

    addMessage({
      role: 'agent',
      content: 'What format would you like the report in?',
      options: [
        { label: 'CSV Spreadsheet', value: 'csv', icon: <FileSpreadsheet size={16} /> },
        { label: 'JSON Data', value: 'json', icon: <File size={16} /> },
      ],
      inputType: 'choice',
    }, 'What format? CSV or JSON?');
    setAgentState('asking_format');
  };

  const generateReportContent = (format: string): { content: string; filename: string; mimeType: string } => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `report-${timestamp}`;
    const data = currentReport?.data;

    if (format === 'csv') {
      let csvContent = '';
      const dataArray = data?.QuerySalesOrders?.nodes || data?.QueryItems?.nodes ||
                       (Array.isArray(data) ? data : [data]);

      if (dataArray && dataArray.length > 0) {
        const headers = Object.keys(dataArray[0]);
        csvContent = headers.join(',') + '\n';

        dataArray.forEach((item: any) => {
          const row = headers.map(h => {
            const val = item[h];
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
              return `"${val.replace(/"/g, '""')}"`;
            }
            return val ?? '';
          });
          csvContent += row.join(',') + '\n';
        });
      } else {
        csvContent = 'No data available';
      }

      return { content: csvContent, filename: `${filename}.csv`, mimeType: 'text/csv' };
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      return { content: jsonContent, filename: `${filename}.json`, mimeType: 'application/json' };
    }
  };

  // Auto-send handler (skips confirmations) - takes report data directly
  const handleFormatAuto = async (format: string, emailAddr: string, reportData: { query: string; data: any; answer: string }) => {
    addMessage({ role: 'agent', content: '', isLoading: true });
    setAgentState('processing');

    await new Promise(resolve => setTimeout(resolve, 500));
    removeLoadingMessages();

    try {
      // Generate content from passed data (not from state)
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `report-${timestamp}.${format}`;
      let content = '';
      let mimeType = '';

      if (format === 'csv') {
        const dataArray = reportData.data?.QuerySalesOrders?.nodes ||
                         reportData.data?.QueryItems?.nodes ||
                         reportData.data?.QueryCustomers?.nodes ||
                         reportData.data?.QuerySalesInvoices?.nodes ||
                         (Array.isArray(reportData.data) ? reportData.data : [reportData.data]);

        if (dataArray && dataArray.length > 0 && dataArray[0]) {
          const headers = Object.keys(dataArray[0]);
          content = headers.join(',') + '\n';
          dataArray.forEach((item: any) => {
            const row = headers.map(h => {
              const val = item[h];
              if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                return `"${val.replace(/"/g, '""')}"`;
              }
              return val ?? '';
            });
            content += row.join(',') + '\n';
          });
        } else {
          content = 'No data available';
        }
        mimeType = 'text/csv';
      } else {
        content = JSON.stringify(reportData.data, null, 2);
        mimeType = 'application/json';
      }

      // Download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Open email client with mailto
      const subject = encodeURIComponent(`JTL Report: ${reportData.query}`);
      const body = encodeURIComponent(
        `Hi,\n\nPlease find the attached report.\n\n` +
        `Report: ${reportData.query}\n` +
        `Format: ${format.toUpperCase()}\n` +
        `Generated: ${new Date().toLocaleString()}\n\n` +
        `Summary:\n${reportData.answer?.substring(0, 500) || 'See attached file.'}\n\n` +
        `---\nGenerated by JTL Analytics Suite`
      );

      window.open(`mailto:${emailAddr}?subject=${subject}&body=${body}`, '_blank');

      addMessage({
        role: 'agent',
        content: `✅ **Report sent!**\n\n📥 File downloaded: **${filename}**\n📧 Email draft opened for: **${emailAddr}**\n\n💡 **Attach the downloaded file** to your email and send!\n\n---\n\nWould you like to generate another report?`,
      }, `Done! Report downloaded and email opened for ${emailAddr}.`);
    } catch (error) {
      addMessage({
        role: 'agent',
        content: '❌ Failed to generate report. Please try again.',
      });
    }

    setAgentState('idle');
    setCurrentReport(null);
    setEmail('');
    setDeliveryMethod('download');
  };

  const handleFormat = async (format: string) => {
    addMessage({ role: 'user', content: format === 'csv' ? 'CSV Spreadsheet' : 'JSON Data' });

    addMessage({ role: 'agent', content: '', isLoading: true });
    setAgentState('processing');

    await new Promise(resolve => setTimeout(resolve, 500));
    removeLoadingMessages();

    try {
      const { content, filename, mimeType } = generateReportContent(format);

      // Download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      if (deliveryMethod === 'email') {
        // Open email client with mailto
        const subject = encodeURIComponent(`JTL Report: ${currentReport?.query}`);
        const body = encodeURIComponent(
          `Hi,\n\nPlease find the attached report.\n\n` +
          `Report: ${currentReport?.query}\n` +
          `Format: ${format.toUpperCase()}\n` +
          `Generated: ${new Date().toLocaleString()}\n\n` +
          `Summary:\n${currentReport?.answer?.substring(0, 500) || 'See attached file.'}\n\n` +
          `---\nGenerated by JTL Analytics Suite`
        );

        // Open mailto link
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

        addMessage({
          role: 'agent',
          content: `✅ **Report ready!**\n\n📥 File downloaded: **${filename}**\n📧 Email draft opened for: **${email}**\n\n💡 **Attach the downloaded file** to your email and send!\n\n---\n\nWould you like to generate another report?`,
        }, `Report ready! File downloaded and email draft opened for ${email}.`);
      } else {
        addMessage({
          role: 'agent',
          content: `✅ **Report downloaded!**\n\n📄 File: **${filename}**\n📊 Report: ${currentReport?.query}\n\n---\n\nWould you like to generate another report?`,
        }, 'Report downloaded! Would you like to generate another report?');
      }
    } catch (error) {
      addMessage({
        role: 'agent',
        content: '❌ Failed to generate report. Please try again.',
      });
    }

    setAgentState('idle');
    setCurrentReport(null);
    setEmail('');
    setDeliveryMethod('download');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const value = input.trim();
    setInput('');

    switch (agentState) {
      case 'idle':
        handleQuery(value);
        break;
      case 'asking_email':
        if (value.includes('@')) {
          handleEmail(value);
        } else {
          addMessage({ role: 'user', content: value });
          addMessage({ role: 'agent', content: 'Please enter a valid email address:' });
        }
        break;
      default:
        handleQuery(value);
    }
  };

  const handleOptionClick = (value: string) => {
    switch (agentState) {
      case 'asking_satisfied':
        handleSatisfied(value === 'yes');
        break;
      case 'asking_delivery':
        handleDeliveryMethod(value as 'download' | 'email');
        break;
      case 'asking_format':
        handleFormat(value);
        break;
    }
  };

  return (
    <Stack spacing="4" direction="column" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
          >
            <FileText size={24} color="white" />
          </div>
          <div>
            <Text type="h2" weight="bold">
              Report Agent
            </Text>
            <Text type="small" color="muted">
              Ask for reports, I'll generate and send them to you
            </Text>
          </div>
        </div>
        <Button
          variant="outline"
          label="Settings"
          icon={<Settings size={16} />}
          onClick={() => setShowSettings(!showSettings)}
        />
      </div>

      {/* Value Proposition */}
      <div
        className="p-4 rounded-lg border-l-4"
        style={{
          background: 'linear-gradient(90deg, rgba(245,158,11,0.1) 0%, transparent 100%)',
          borderColor: '#f59e0b',
        }}
      >
        <div className="text-orange-500 font-semibold text-sm">
          Reports made easy with voice and chat
        </div>
        <Text type="small" color="muted">
          Just describe the report you need - "sales from last week" or "top customers this month".
          I'll generate it, show you the results, and deliver it via download or email. You can even speak your request using the microphone.
        </Text>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Text type="small" weight="semibold">AI Model:</Text>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  {MODELS.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Text type="small" weight="semibold">Voice Response:</Text>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-2 rounded-lg border transition-all ${voiceEnabled ? 'bg-orange-100 border-orange-300' : 'bg-gray-100'}`}
                >
                  {voiceEnabled ? <Volume2 size={18} className="text-orange-600" /> : <VolumeX size={18} className="text-gray-400" />}
                </button>
                <Text type="xs" color="muted">{voiceEnabled ? 'On' : 'Off'}</Text>
              </div>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-sm flex items-center gap-1"
                >
                  <VolumeX size={14} /> Stop Speaking
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Area */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <CardContent style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          <div className="flex flex-col gap-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'agent' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
                  >
                    {message.isLoading ? (
                      <Loader2 size={16} color="white" className="animate-spin" />
                    ) : (
                      <Bot size={16} color="white" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-gray-100 rounded-bl-md'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <Text type="small" color="muted">
                        {agentState === 'querying' ? 'Generating report...' : 'Preparing download...'}
                      </Text>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-sm" style={{ lineHeight: 1.6 }}>
                        {message.content}
                      </div>

                      {/* Option buttons */}
                      {message.options && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {message.options.map(option => (
                            <button
                              key={option.value}
                              onClick={() => handleOptionClick(option.value)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-orange-400 text-orange-600 hover:bg-orange-50 transition-all font-medium text-sm"
                            >
                              {option.icon}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {message.role === 'user' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#f59e0b' }}
                  >
                    <User size={16} color="white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4" style={{ borderColor: '#e5e7eb' }}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={agentState === 'querying' || agentState === 'processing'}
              className={`p-3 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 border-red-500 text-white animate-pulse'
                  : 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-300'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening...'
                  : agentState === 'asking_email'
                    ? 'Enter email address...'
                    : agentState === 'asking_satisfied' || agentState === 'asking_format' || agentState === 'asking_delivery'
                      ? 'Or type your response...'
                      : 'Ask for a report... (e.g., "Show me sales this week")'
              }
              disabled={agentState === 'querying' || agentState === 'downloading' || isListening}
              className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ borderColor: isListening ? '#ef4444' : '#e5e7eb' }}
            />
            <Button
              type="submit"
              variant="default"
              disabled={!input.trim() || agentState === 'querying' || agentState === 'downloading'}
              label=""
              icon={
                agentState === 'querying' || agentState === 'downloading' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )
              }
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
              }}
            />
          </form>

          {/* Quick suggestions */}
          {agentState === 'idle' && messages.length <= 2 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {['Sales today', 'Top customers', 'Pending orders', 'Weekly summary'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    handleQuery(suggestion);
                  }}
                  className="px-3 py-1 rounded-full text-xs border hover:bg-orange-50 hover:border-orange-300 transition-all"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Stack>
  );
};

export default ReportAgentView;
