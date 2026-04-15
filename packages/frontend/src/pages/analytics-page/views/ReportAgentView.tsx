import { useState, useRef } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Text,
  Stack,
  Box,
  Button,
  Badge,
} from '@jtl-software/platform-ui-react';
import {
  FileText,
  Send,
  Mail,
  Clock,
  Loader2,
  CheckCircle,
  Download,
  Eye,
} from 'lucide-react';

interface ReportAgentViewProps {
  appBridge: AppBridge;
}

interface ReportRequest {
  id: string;
  query: string;
  email: string;
  delay: number; // minutes
  status: 'pending' | 'generating' | 'sent' | 'failed';
  scheduledTime: Date;
  report?: string;
}

const AI_SERVER_URL = 'http://localhost:3006';

const reportTemplates = [
  { icon: '📊', label: 'Daily Sales Summary', query: 'Generate a daily sales report with total revenue, order count, and top products' },
  { icon: '🚨', label: 'Fraud Alert Report', query: 'Generate a fraud detection report highlighting suspicious orders' },
  { icon: '👑', label: 'Top Customers Report', query: 'Generate a report of top 10 customers by revenue this month' },
  { icon: '📦', label: 'Inventory Status', query: 'Generate an inventory report showing low stock items' },
  { icon: '🚚', label: 'Shipping Report', query: 'Generate a shipping report with pending and delivered orders' },
  { icon: '📈', label: 'Weekly Trends', query: 'Generate a weekly sales trend analysis report' },
];

const ReportAgentView: React.FC<ReportAgentViewProps> = () => {
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [delay, setDelay] = useState(0); // 0 = now
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [sentReports, setSentReports] = useState<ReportRequest[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateReport = async (reportQuery: string) => {
    setIsGenerating(true);
    setReport(null);
    setReportData(null);

    try {
      const response = await fetch(`${AI_SERVER_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: reportQuery }),
      });

      const data = await response.json();
      setReport(data.answer);
      setReportData(data.data);
      setShowPreview(true);
    } catch (error) {
      setReport('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReport = async () => {
    if (!email || !report) return;

    const newRequest: ReportRequest = {
      id: Date.now().toString(),
      query,
      email,
      delay,
      status: delay > 0 ? 'pending' : 'sent',
      scheduledTime: new Date(Date.now() + delay * 60 * 1000),
      report,
    };

    setSentReports(prev => [newRequest, ...prev]);

    if (delay > 0) {
      // Simulate delayed sending
      setTimeout(() => {
        setSentReports(prev =>
          prev.map(r => (r.id === newRequest.id ? { ...r, status: 'sent' } : r))
        );
      }, delay * 60 * 1000);
    }

    // Reset form
    setQuery('');
    setReport(null);
    setShowPreview(false);
    setDelay(0);
  };

  const handleTemplateClick = (template: typeof reportTemplates[0]) => {
    setQuery(template.query);
    generateReport(template.query);
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing="6" direction="column">
      {/* Header */}
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
            Generate and send reports on-demand. Just ask!
          </Text>
        </div>
      </div>

      {/* Value Proposition */}
      <div
        className="p-4 rounded-lg border-l-4"
        style={{
          background: 'linear-gradient(90deg, rgba(245,158,11,0.1) 0%, transparent 100%)',
          borderColor: '#f59e0b',
        }}
      >
        <Text type="small" weight="semibold" style={{ color: '#f59e0b' }}>
          Reports delivered when you need them
        </Text>
        <Text type="small" color="muted">
          Say "send me a sales report now" or "email me the fraud report in 5 minutes".
          The agent generates the report and delivers it to your inbox instantly or on schedule.
        </Text>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {reportTemplates.map((template, i) => (
              <button
                key={i}
                onClick={() => handleTemplateClick(template)}
                disabled={isGenerating}
                className="p-4 text-left rounded-lg border hover:border-orange-300 hover:bg-orange-50 transition-all disabled:opacity-50"
                style={{ borderColor: '#e5e7eb' }}
              >
                <span className="text-2xl">{template.icon}</span>
                <Text type="small" weight="semibold" className="mt-2 block">
                  {template.label}
                </Text>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Request */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Text type="small" weight="semibold" className="mb-2 block">
                What report do you need?
              </Text>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g., Send me a report of all orders over 500€ this week"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text type="small" weight="semibold" className="mb-2 block">
                  <Mail size={14} className="inline mr-1" />
                  Email to
                </Text>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ borderColor: '#e5e7eb' }}
                />
              </div>

              <div>
                <Text type="small" weight="semibold" className="mb-2 block">
                  <Clock size={14} className="inline mr-1" />
                  Send when?
                </Text>
                <select
                  value={delay}
                  onChange={e => setDelay(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <option value={0}>Now</option>
                  <option value={1}>In 1 minute</option>
                  <option value={2}>In 2 minutes</option>
                  <option value={5}>In 5 minutes</option>
                  <option value={10}>In 10 minutes</option>
                  <option value={30}>In 30 minutes</option>
                  <option value={60}>In 1 hour</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => generateReport(query)}
                disabled={!query || isGenerating}
                variant="outline"
                label={isGenerating ? 'Generating...' : 'Preview Report'}
                icon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
              />
              {report && (
                <>
                  <Button
                    onClick={sendReport}
                    disabled={!email}
                    variant="default"
                    label={delay > 0 ? `Schedule (${delay} min)` : 'Send Now'}
                    icon={<Send size={16} />}
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
                  />
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    label="Download"
                    icon={<Download size={16} />}
                  />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {showPreview && report && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Preview</CardTitle>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                label="Close"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="p-4 rounded-lg bg-gray-50 whitespace-pre-wrap text-sm"
              style={{ maxHeight: '400px', overflow: 'auto' }}
            >
              {report}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sent Reports History */}
      {sentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentReports.map(req => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <div className="flex items-center gap-3">
                    {req.status === 'sent' ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : req.status === 'pending' ? (
                      <Clock size={20} className="text-orange-500" />
                    ) : (
                      <Loader2 size={20} className="text-blue-500 animate-spin" />
                    )}
                    <div>
                      <Text type="small" weight="semibold">
                        {req.query.substring(0, 50)}...
                      </Text>
                      <Text type="xs" color="muted">
                        To: {req.email}
                      </Text>
                    </div>
                  </div>
                  <Badge
                    variant={req.status === 'sent' ? 'success' : req.status === 'pending' ? 'warning' : 'outline'}
                    label={req.status === 'sent' ? 'Sent' : req.status === 'pending' ? `Sending at ${req.scheduledTime.toLocaleTimeString()}` : 'Generating'}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default ReportAgentView;
