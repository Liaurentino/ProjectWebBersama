import { useState, useRef, useEffect } from 'react';
import {
  Copy,
  RotateCcw,
  MoreHorizontal,
  FileText,
  Check,
  Trash2,
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
    let cleanRaw = (raw || '').trim();
    cleanRaw = cleanRaw.replace(/^```(json)?\s*/i, '').replace(/\s*```$/, '');
    cleanRaw = cleanRaw.replace(/,\s*([}\]])/g, '$1');

    const parsed = JSON.parse(cleanRaw);
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
  // Support **bold** dan `inline code`
  const segments = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4)
      return <strong key={i} className="font-semibold text-inherit">{seg.slice(2, -2)}</strong>;
    if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2)
      return <code key={i} className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-[0.85em] font-mono">{seg.slice(1, -1)}</code>;
    return <span key={i}>{seg}</span>;
  });
};

const renderTableBlock = (lines) => {
  const rows = lines.map(l => l.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1));
  const header = rows[0];
  const body = rows.slice(2); // skip separator line
  return (
    <div className="overflow-x-auto my-3 rounded-xl border border-[#C3C6D7]/40 dark:border-gray-700/50">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#F0F2FF] dark:bg-[#1E2230]">
            {header.map((cell, i) => (
              <th key={i} className="px-3 py-2 text-left font-bold text-[#191C1E] dark:text-gray-200 border-b border-[#C3C6D7]/40 dark:border-gray-700/50 whitespace-nowrap">
                {renderInlineMarkdown(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-[#F8F9FB] dark:bg-[#1A1C1E]/40'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-[#434655] dark:text-gray-300 border-b border-[#C3C6D7]/20 dark:border-gray-700/30">
                  {renderInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderRichText = (text, isUser = false) => {
  const lines = text.split('\n');
  const result = [];
  let i = 0;
  const textColor = isUser ? 'text-white' : 'text-[#434655] dark:text-gray-300';

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Heading ## / ###
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const cls = isUser
        ? 'text-base font-bold text-white mt-4 mb-1'
        : level === 1
          ? 'text-base font-bold text-[#191C1E] dark:text-white mt-4 mb-1'
          : level === 2
            ? 'text-sm font-bold text-[#191C1E] dark:text-gray-100 mt-3 mb-1 flex items-center gap-2'
            : 'text-sm font-semibold text-[#434655] dark:text-gray-300 mt-2 mb-0.5';
      result.push(<p key={i} className={cls}>{renderInlineMarkdown(content)}</p>);
      i++; continue;
    }

    // Markdown table — kumpulkan baris-baris tabel
    if (trimmed.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        result.push(<div key={`tbl-${i}`}>{renderTableBlock(tableLines)}</div>);
      }
      continue;
    }

    // Bullet list
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      result.push(
        <li key={i} className={`ml-4 list-disc ${textColor} leading-relaxed`}>
          {renderInlineMarkdown(bulletMatch[1])}
        </li>
      );
      i++; continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      result.push(
        <li key={i} className={`ml-4 list-decimal ${textColor} leading-relaxed`}>
          {renderInlineMarkdown(numMatch[2])}
        </li>
      );
      i++; continue;
    }

    // Empty line
    if (!trimmed) { result.push(<br key={i} />); i++; continue; }

    // Normal paragraph
    result.push(
      <p key={i} className={`leading-relaxed ${textColor}`}>
        {renderInlineMarkdown(trimmed)}
      </p>
    );
    i++;
  }

  return result;
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

const ChatBubble = ({ id, message, sender, time, status, fileUrl, fileName, fileType, onRegenerate, onDelete }) => {
  const isUser = sender === 'user';
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleCopy = async () => {
    try {
      if (message) {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full mb-6">
        <div className="flex flex-col gap-1 items-end max-w-[80%] sm:max-w-[70%] md:max-w-[60%] animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-[#2563EB] text-white p-4 rounded-l-2xl rounded-br-2xl shadow-sm">
            {/* Attachment di atas teks */}
            <AttachmentPreview fileUrl={fileUrl} fileName={fileName} fileType={fileType} />
            {message && (
              <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-white">
                {renderRichText(message, true)}
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

      <div className="flex items-center gap-2 relative">
        <button
          onClick={handleCopy}
          className="p-1.5 text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31] rounded-md transition-colors flex items-center gap-1 text-xs"
          title="Salin Teks"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">Tersalin!</span>
            </>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>

        {onRegenerate && (
          <button
            onClick={() => onRegenerate(id)}
            className="p-1.5 text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31] rounded-md transition-colors"
            title="Generate Ulang Respon"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-1.5 text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31] rounded-md transition-colors"
            title="Opsi Lainnya"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-36 bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7]/40 dark:border-gray-800 rounded-xl shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  handleCopy();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#191C1E] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Salin Teks
              </button>
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Pesan
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
