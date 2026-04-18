import { useRef, useState } from 'react';
import { FileUp, FolderOpen, Trash2 } from 'lucide-react';

interface HistoryUploadProps {
  onFileSelect: (file: File) => void | Promise<void>;
  onClear?: () => void | Promise<void>;
  fileName?: string | null;
  isLoading?: boolean;
  hasPersistedUpload?: boolean;
  compact?: boolean;
}

export function HistoryUpload({
  onFileSelect,
  onClear,
  fileName,
  isLoading = false,
  hasPersistedUpload = false,
  compact = false
}: HistoryUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFileDialog = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || isLoading) return;
    onFileSelect(file);
  };

  const wrapperClassName = compact
    ? 'rounded-xl border border-slate-800/80 bg-slate-900/40 px-3 py-2.5 transition-all'
    : 'rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 transition-all';

  const iconClassName = compact
    ? 'rounded-lg bg-slate-800/80 p-2 text-blue-400'
    : 'mt-0.5 rounded-xl bg-slate-800/80 p-2.5 text-blue-400';

  const title = isLoading
    ? 'Loading CSV...'
    : compact
      ? 'Drop CSV or choose file'
      : 'Drop a CSV here or choose a file';

  const description = compact
    ? 'Saved in this browser and restored on reload.'
    : 'Upload an exported browser history CSV. The latest upload is saved in this browser and restored on reload.';

  return (
    <div
      className={[
        wrapperClassName,
        isDragging ? 'border-blue-500/70 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.35)]' : 'hover:border-slate-700/90',
        isLoading ? 'opacity-80' : 'cursor-pointer'
      ].join(' ')}
      onClick={openFileDialog}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openFileDialog();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (event.currentTarget === event.target) {
          setIsDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload browsing history CSV"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.currentTarget.value = '';
        }}
      />

      <div className={compact ? 'flex items-start gap-2.5' : 'flex items-start gap-3'}>
        <div className={iconClassName}>
          <FileUp className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className={compact ? 'text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200' : 'text-sm font-semibold text-white'}>
            {title}
          </p>
          <p className={compact ? 'mt-1 text-[11px] leading-relaxed text-slate-400' : 'mt-1 text-xs leading-relaxed text-slate-400'}>
            {description}
          </p>

          <div className={compact ? 'mt-2 flex flex-wrap items-center gap-1.5' : 'mt-3 flex flex-wrap items-center gap-2'}>
            <button
              type="button"
              className={[
                'inline-flex items-center rounded-lg bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60',
                compact ? 'gap-1.5 px-2.5 py-1 text-[11px]' : 'gap-2 px-3 py-1.5 text-xs'
              ].join(' ')}
              onClick={(event) => {
                event.stopPropagation();
                openFileDialog();
              }}
              disabled={isLoading}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Choose File
            </button>

            {hasPersistedUpload && onClear ? (
              <button
                type="button"
                className={[
                  'inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60',
                  compact ? 'gap-1.5 px-2.5 py-1 text-[11px]' : 'gap-2 px-3 py-1.5 text-xs'
                ].join(' ')}
                onClick={(event) => {
                  event.stopPropagation();
                  onClear();
                }}
                disabled={isLoading}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {compact ? 'Clear' : 'Clear Saved CSV'}
              </button>
            ) : null}
          </div>

          {fileName ? (
            <p className={compact ? 'mt-2 truncate text-[11px] text-slate-400' : 'mt-3 truncate text-xs text-slate-300'}>
              {compact ? (
                <span className="font-medium text-slate-200">{fileName}</span>
              ) : (
                <>
                  Active file: <span className="font-medium text-white">{fileName}</span>
                </>
              )}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
