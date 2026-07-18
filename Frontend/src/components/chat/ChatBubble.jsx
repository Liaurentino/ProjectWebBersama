import {
  Copy,
  RotateCcw,
  MoreHorizontal,
  FileText,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CHART_BLOCK_REGEX = /```chart\s*([\s\S]*?)```/gi;

const parseChartSpec = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    const labels = Array.isArray(parsed.labels) ? parsed.labels.map((label) => String(label)) : [];
    const values = Array.isArray(parsed.values) ? parsed.values.map((value) => Number(value) || 0) : [];
    const length = Math.min(labels.length, values.length);

    if (length === 0) return null;

    return {
      title: typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim() : 'Insight chart',
      seriesLabel: typeof parsed.seriesLabel === 'string' && parsed.seriesLabel.trim() ? parsed.seriesLabel.trim() : 'Value',
      type: parsed.type === 'line' ? 'line' : 'bar',
      data: labels.slice(0, length).map((label, index) => ({
        label,
        value: values[index],
      })),
    };
  } catch {
    return null;
  }
};

const renderInlineMarkdown = (text) => {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);

  return segments.map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      return <strong key={`${segment}-${index}`} className="font-bold text-inherit">{segment.slice(2, -2)}</strong>;
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
};

const renderRichText = (text) => {
  const paragraphs = text.split(/\n+/);

  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim();

    if (!trimmed) {
      return <br key={`break-${index}`} />;
    }

    return (
      <p key={`${trimmed}-${index}`} className="whitespace-pre-wrap leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });
};

const renderChartBlocks = (message) => {
  const nodes = [];
  let lastIndex = 0;
  let match;

  CHART_BLOCK_REGEX.lastIndex = 0;

  while ((match = CHART_BLOCK_REGEX.exec(message)) !== null) {
    const before = message.slice(lastIndex, match.index);
    if (before.trim()) {
      nodes.push(
        <div key={`text-${lastIndex}`} className="space-y-3">
          {renderRichText(before.trim())}
        </div>
      );
    }

    const spec = parseChartSpec(match[1]);
    if (spec) {
      nodes.push(
        <div key={`chart-${match.index}`} className="rounded-2xl border border-[#C3C6D7]/40 bg-white dark:bg-[#15181f] p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#737686] dark:text-gray-500">Chart</p>
            <h4 className="text-sm font-bold text-[#191C1E] dark:text-white">{spec.title}</h4>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spec.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(132, 146, 172, 0.25)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#737686" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="#737686" fontSize={11} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgba(195, 198, 215, 0.35)',
                    background: '#fff',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                  }}
                  formatter={(value) => [value, spec.seriesLabel]}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {spec.data.map((entry, index) => (
                    <Cell key={`cell-${entry.label}-${index}`} fill={index === 0 ? '#2563EB' : '#93B4FF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else {
      nodes.push(
        <div key={`chart-fallback-${match.index}`} className="rounded-2xl border border-dashed border-[#C3C6D7]/60 bg-white/70 dark:bg-white/5 p-4 text-sm text-[#737686] dark:text-gray-400">
          Chart block ditemukan, tapi format JSON-nya belum valid.
        </div>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  const tail = message.slice(lastIndex);
  if (tail.trim()) {
    nodes.push(
      <div key={`text-tail-${lastIndex}`} className="space-y-3">
        {renderRichText(tail.trim())}
      </div>
    );
  }

  return nodes.length > 0 ? nodes : renderRichText(message);
};

/** Render attachment (gambar atau PDF) di dalam bubble */
const AttachmentPreview = ({ fileUrl, fileName, fileType }) => {
  if (!fileUrl) return null;

  if (fileType === 'image') {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
        <img
          src={fileUrl}
          alt={fileName || 'Gambar'}
          className="max-w-[240px] max-h-[180px] rounded-xl object-cover border border-white/20 hover:opacity-90 transition-opacity"
        />
      </a>
    );
  }

  if (fileType === 'pdf') {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors max-w-[240px]"
      >
        <div className="w-8 h-8 bg-orange-400/30 rounded-lg flex items-center justify-center shrink-0">
          <FileText size={16} className="text-orange-200" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white text-xs font-semibold truncate">{fileName || 'Dokumen PDF'}</span>
          <span className="text-white/60 text-[10px]">Klik untuk buka PDF</span>
        </div>
      </a>
    );
  }

  return null;
};

const ChatBubble = ({ message, sender, time, status, fileUrl, fileName, fileType }) => {
  const isUser = sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end w-full mb-6">
        <div className="flex flex-col gap-1 items-end max-w-[80%] sm:max-w-[70%] md:max-w-[60%] animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-[#2563EB] text-[#EEEFFF] p-4 rounded-l-2xl rounded-br-2xl shadow-sm">
            {/* Attachment di atas teks */}
            <AttachmentPreview fileUrl={fileUrl} fileName={fileName} fileType={fileType} />
            {message && (
              <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {renderRichText(message)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#434655] dark:text-gray-400 px-1 font-medium">
            <span>{time}</span>
            <span>•</span>
            <span>{status || 'Sent'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mb-8 animate-in slide-in-from-left-4 fade-in duration-300">
      <div className="flex flex-col gap-4">
        <div className="text-[#191C1E] dark:text-gray-200 text-sm sm:text-base leading-relaxed text-justify space-y-4">
          {renderChartBlocks(message)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-1.5 text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31] rounded-md transition-colors" title="Copy">
          <Copy className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31] rounded-md transition-colors" title="Regenerate">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31] rounded-md transition-colors" title="More">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatBubble;
