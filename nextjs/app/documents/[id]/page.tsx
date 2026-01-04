"use client";

import { useAuth } from "@/src/app/providers/auth-provider";
import { 
  useDocumentData,
  useDocumentSave,
  useDocumentActions,
  useDocumentTemplates,
  useDocumentUtils,
  useDocumentHeadings,
  useSidebarSearch
} from "@/features/document-edit/model";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { RichTextEditor } from "@/widgets/editor/editor/core/rich-text-editor";
import { DocumentSidebar } from "@/widgets/editor/sidebar/document-sidebar";
import { ArrowLeft, Save, Clock, User, Eye, BookOpen, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DocumentDetailSkeleton } from "@/shared/ui/skeleton";

const DocumentPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  // 1. 문서 데이터 관리
  const {
    document,
    isLoading,
    title,
    setTitle,
    content,
    setContent,
    availableDocuments,
    updateDocument,
  } = useDocumentData({ documentId });

  // 2. 저장 기능
  const {
    saveDocument,
    isSaving,
    isAutoSaving,
    lastSaved,
  } = useDocumentSave({ 
    documentId, 
    title, 
    content,
    onSaveSuccess: updateDocument,
  });

  // 3. 문서 액션
  const {
    deleteDocument,
    shareDocument,
    unshareDocument,
    isDeleting,
  } = useDocumentActions({ 
    documentId,
    onPublishChange: (isPublished) => {
      if (document) {
        updateDocument({ ...document, isPublished });
      }
    },
  });

  // 4. 템플릿 기능
  const {
    createTemplate,
    applyTemplate,
  } = useDocumentTemplates({
    onApply: (templateContent, templateTitle) => {
      setContent(templateContent);
      if (templateTitle && !title.trim()) {
        setTitle(templateTitle);
      }
    },
  });

  // 5. 유틸리티
  const { getWordCount, formatDate } = useDocumentUtils();
  
  const [showWordCount, setShowWordCount] = useState(false);


  if (isLoading) {
    return <DocumentDetailSkeleton />;
  }

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-[#1F1F1F]">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Document not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The document you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button 
            onClick={() => router.push("/documents")}
            className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#1F1F1F]">
      {/* Modern header */}
      <div className="bg-secondary border-b border-gray-200 dark:border-gray-700 sticky h-16 top-0 z-10">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/documents")}
                className="text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300 min-w-0">
                <span className="hidden sm:inline">{user?.name ? `${user.name}'s` : "My"} Workspace</span>
                <span className="hidden sm:inline">/</span>
                {document.folder && (
                  <>
                    <span className="hidden md:inline truncate max-w-20">{document.folder.name}</span>
                    <span className="hidden md:inline">/</span>
                  </>
                )}
                <span className="text-gray-900 dark:text-white font-medium truncate">{title || "Untitled"}</span>
              </div>
            </div>

            {/* Status and actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              {/* Auto-save status */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                {isAutoSaving ? (
                  <>
                    <Spinner size="sm" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Clock className="h-3 w-3" />
                    <span className="hidden sm:inline">Saved {formatDate(lastSaved)}</span>
                  </>
                ) : null}
              </div>

              {/* Word count - Hidden on very small screens */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWordCount(!showWordCount)}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hidden sm:flex"
              >
                <FileText className="h-3 w-3 mr-1" />
                {getWordCount(content)} words
              </Button>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDocument}
                  disabled={isSaving}
                  className="hidden sm:flex border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {isSaving ? (
                    <>
                      <Spinner size="sm" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>

                {/* Mobile save button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDocument}
                  disabled={isSaving}
                  className="sm:hidden border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {isSaving ? (
                    <Spinner size="sm" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - Responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Document editor - Full width on mobile/tablet, left side on desktop */}
        <div className="flex-1 overflow-auto order-2 lg:order-1">
          <div className="w-full/ max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
            {/* Document header */}
            <div className="mb-6 sm:mb-8">
              {/* Document icon and title */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  {document.icon ? (
                    <span className="text-lg sm:text-xl">{document.icon}</span>
                  ) : (
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Untitled"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{user?.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
                    </div>
                    {document.isPublished && (
                      <button
                        onClick={() => window.open(`/home/share/${documentId}`, '_blank')}
                        className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer hover:underline"
                        title="공유된 페이지 보기"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Published</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white dark:bg-secondary rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 shadow-sm">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your document..."
                editable={true}
                availableDocuments={availableDocuments}
              />
            </div>
          </div>
        </div>

        {/* Right panel - Document sidebar - Hidden on mobile/tablet, shown on desktop */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0 order-1 lg:order-2">
        <DocumentSidebar
          content={content}
          title={title}
          lastSaved={lastSaved || undefined}
          wordCount={getWordCount(content)}
          documentId={documentId}
          published={document?.isPublished || false}
          onShare={shareDocument}
          onUnshare={unshareDocument}
          onCreateTemplate={createTemplate}
          onApplyTemplate={applyTemplate}
        />
        </div>
      </div>

    </div>
  );
};

export default DocumentPage;
