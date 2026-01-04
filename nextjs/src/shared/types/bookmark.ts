// Bookmark related types
export interface BookmarkAttributes {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  author?: string;
  loading?: boolean;
  error?: string;
}

export interface BookmarkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  author?: string;
}

export interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBookmark: (metadata: BookmarkMetadata) => void;
}

