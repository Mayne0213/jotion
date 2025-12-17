import { Folder } from "lucide-react";

interface CreateInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CreateInput = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Enter folder name...",
  autoFocus = true,
}: CreateInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Folder className="h-5 w-5 text-blue-600" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          autoFocus={autoFocus}
        />
      </div>
    </div>
  );
};

