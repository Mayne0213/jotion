import { Settings, ChevronDown, ChevronRight, Share2, ShieldX, Layout } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { TemplateSelector } from "../template/template-selector";

interface QuickActionsProps {
  isExpanded: boolean;
  onToggle: () => void;
  published: boolean;
  onShare?: () => void;
  onUnshare?: () => void;
  onCreateTemplate?: () => void;
  onApplyTemplate?: (template: any) => void;
}

export const QuickActions = ({
  isExpanded,
  onToggle,
  published,
  onShare,
  onUnshare,
  onCreateTemplate,
  onApplyTemplate,
}: QuickActionsProps) => {
  if (!onShare && !onUnshare) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
          <Settings className="h-4 w-4" />
          Quick Actions
        </h3>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-2">
          {published ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start dark:bg-[#1F1F1F] dark:border dark:border-gray-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={onUnshare}
            >
              <ShieldX className="h-4 w-4 mr-2" />
              Unshare Document
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start dark:bg-[#1F1F1F] dark:border dark:border-gray-700"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Document
            </Button>
          )}
          {onCreateTemplate && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start dark:bg-[#1F1F1F] dark:border dark:border-gray-700"
              onClick={onCreateTemplate}
            >
              <Layout className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          )}
          {onApplyTemplate && (
            <div className="mb-2">
              <TemplateSelector onSelectTemplate={onApplyTemplate} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

