import { ChevronsLeft, MenuIcon, Plus, Search, Settings, Folder, FolderOpen, ChevronRight, ChevronDown, FileText, Code, User, LogOut, HelpCircle, Palette, Keyboard, Shield, Zap, MoreHorizontal, X, CheckSquare } from "lucide-react";
import Image from "next/image";
import { FileTree } from "@/widgets/documents";
import { usePathname, useRouter } from "next/navigation";
import { ElementRef, MouseEventHandler, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/src/app/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import Link from "next/link";
import { Logo } from "@/widgets/landing";
import { useDocumentManagementStore } from "@/features/document-management/model/store";
import { useFolderManagementStore } from "@/features/folder-management/model/store";
import { useDocumentStore } from "@/entities/document/model/store";
import { useFolderStore } from "@/entities/folder/model/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/shared/ui/dropdown-menu";
import { useTheme } from "next-themes";


interface Document {
  id: string;
  title: string;
  content: any;
  icon?: string;
  cover?: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  userId: string;
  folderId?: string;
  type?: 'PAGE' | 'CODE_FILE';
  folder?: {
    id: string;
    name: string;
    icon?: string;
  };
}

interface Folder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
  documents?: Array<{
    id: string;
    title: string;
    icon?: string;
    updatedAt: string;
  }>;
  children?: Folder[];
  _count?: {
    documents: number;
    children: number;
  };
}

export const Navigation = () => {
    const pathName = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const isMobile = useMediaQuery("(max-width: 768px")
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting,setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    
    // Use hooks for documents and folders
    const documentManagement = useDocumentManagementStore();
    const folderManagement = useFolderManagementStore();
    const documentStore = useDocumentStore();
    const folderStore = useFolderStore();
    
    const documents = documentStore.documents;
    const folders = folderStore.folders;
    const isLoading = documentStore.isLoading || folderStore.isLoading;
    
    const { deleteDocumentFromFolder, fetchDocuments } = documentManagement;
    const { fetchFolders } = folderManagement;

    // Fetch initial data
    useEffect(() => {
        fetchDocuments();
        fetchFolders();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Get display theme name
    const getThemeDisplay = () => {
        if (theme === "light") return "Light";
        if (theme === "dark") return "Dark";
        if (theme === "system") return "System";
        return "Light";
    };

    // Toggle folder expansion
    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    // Handle document deletion
    const handleDeleteDocument = async (documentId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this document?")) {
            await deleteDocumentFromFolder(documentId);
        }
    };

    useEffect(() => {
        if(isMobile){
            collapse();
        } else{
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if(isMobile){
            collapse();
        }
    }, [pathName,isMobile]);

    // Listen for folder updates from other components
    useEffect(() => {
        const handleFoldersUpdated = () => {
            // No need to refetch folders here, useFolders hook handles it
        };

        window.addEventListener('foldersUpdated', handleFoldersUpdated);

        return () => {
            window.removeEventListener('foldersUpdated', handleFoldersUpdated);
        };
    }, []);

    const handleMouseDown =(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizingRef.current) return;
        let newWidth = event.clientX;

        if(newWidth < 240) newWidth = 240;
        if(newWidth > 480) newWidth = 480;

        if(sidebarRef.current && navbarRef.current){
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left",`${newWidth}px`);
            navbarRef.current.style.setProperty("width",`calc(100%-${newWidth}px)`);
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup",handleMouseUp)
    }

    const resetWidth = () => {
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(false);
            setIsResetting(true)

            sidebarRef.current.style.width = isMobile ?"100%" : "240px";
            navbarRef.current.style.setProperty("width",isMobile ? "0" : "calc(100 - 240px)");
            navbarRef.current.style.setProperty("left",isMobile ? "100%" : "240px");
            setTimeout(() => setIsResetting(false),300);
        }
    }

    const collapse = () => {
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width","100%")
            navbarRef.current.style.setProperty("left","0");
            setTimeout(() => setIsResetting(false),300);
        }
    }

    // Render folder and its documents
    const renderFolder = (folder: Folder, level = 0) => {
        const isExpanded = expandedFolders.has(folder.id);
        // Find child folders by parentId
        const childFolders = folders.filter(f => f.parentId === folder.id);
        const hasChildren = childFolders.length > 0 || (folder.documents?.length || 0) > 0;

        return (
            <div key={folder.id}>
                {/* Folder */}
                <div
                    className={cn(
                        "group flex items-center gap-1 p-1 rounded-sm hover:bg-accent cursor-pointer",
                        "select-none"
                    )}
                    style={{ paddingLeft: `${level * 12 + 4}px` }}
                    onClick={() => toggleFolder(folder.id)}
                >
                    <div className="flex items-center gap-1">
                        {hasChildren ? (
                            isExpanded ? (
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            )
                        ) : (
                            <div className="w-3" />
                        )}
                        {isExpanded ? (
                            <FolderOpen className="h-3 w-3 text-blue-600" />
                        ) : (
                            <Folder className="h-3 w-3 text-blue-600" />
                        )}
                    </div>
                    <span className="flex-1 text-sm text-muted-foreground truncate">
                        {folder.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {(folder.documents?.length || 0) + childFolders.length}
                    </span>
                </div>

                {/* Documents in folder */}
                {isExpanded && folder.documents?.map((document) => (
                    <Link
                        key={document.id}
                        href={`/documents/${document.id}`}
                        className={cn(
                            "group flex items-center gap-1 p-1 rounded-sm hover:bg-accent cursor-pointer",
                            pathName === `/documents/${document.id}` && "bg-accent"
                        )}
                        style={{ paddingLeft: `${(level + 1) * 12 + 4}px` }}
                    >
                        <div className="flex items-center gap-1">
                            <div className="w-3" />
                            {document.icon ? (
                                <span className="text-sm">{document.icon}</span>
                            ) : (
                                <FileText className="h-3 w-3 text-gray-600" />
                            )}
                        </div>
                        <span className="flex-1 text-sm text-muted-foreground truncate">
                            {document.title}
                        </span>
                    </Link>
                ))}

                {/* Child folders */}
                {isExpanded && childFolders.map((childFolder) =>
                    renderFolder(childFolder, level + 1)
                )}
            </div>
        );
    };

    return (
        <>
            <aside ref={sidebarRef} className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
            isResetting && "transition-all ease-in-out duration-300",
            isMobile && "w-0"
            )}
            >
                <div onClick={collapse}  role="button" className={cn("h-6 w-6 text-mutes-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100"
                )}>
                    <ChevronsLeft className="h-6 w-6"/>
                </div>

                {/* Logo Section */}
                <Link href="/documents" className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                    <Logo />
                </Link>

                {/* Todo Link */}
                <div className="px-3 pt-3">
                    <Link 
                        href="/documents/todos"
                        className={cn(
                            "flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors",
                            pathName === '/documents/todos' && "bg-accent"
                        )}
                    >
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">할 일</span>
                    </Link>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Spinner size="sm" />
                        </div>
                    ) : (
                        <>
                            {/* Folders */}
                            {folders.filter(f => !f.parentId).length > 0 && (
                                <div className="px-3 py-2">
                                    <p className="text-sm font-medium text-muted-foreground">Folders</p>
                                </div>
                            )}
                            {folders.filter(f => !f.parentId).length > 0 && (
                                <div className="px-3">
                                    {folders.filter(f => !f.parentId).map((folder) => renderFolder(folder))}
                                </div>
                            )}


                            {/* Documents not in folders */}
                            {documents.filter(doc => !doc.folderId && doc.type !== 'CODE_FILE').length > 0 && (
                                <div className="px-3 py-2">
                                    <p className="text-sm font-medium text-muted-foreground">Documents</p>
                                </div>
                            )}
                            {documents.filter(doc => !doc.folderId && doc.type !== 'CODE_FILE').length > 0 && (
                                <div className="px-3">
                                    {documents.filter(doc => !doc.folderId && doc.type !== 'CODE_FILE').map((document) => (
                                        <div
                                            key={document.id}
                                            className="relative group"
                                        >
                                            <Link
                                                href={`/documents/${document.id}`}
                                                className={cn(
                                                    "flex items-center gap-1 p-1 rounded-sm hover:bg-accent cursor-pointer",
                                                    pathName === `/documents/${document.id}` && "bg-accent"
                                                )}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {document.icon ? (
                                                        <span className="text-sm">{document.icon}</span>
                                                    ) : (
                                                        <FileText className="h-3 w-3 text-gray-600" />
                                                    )}
                                                </div>
                                                <span className="flex-1 text-sm text-muted-foreground truncate">
                                                    {document.title}
                                                </span>
                                            </Link>

                                            <button
                                                onClick={(e) => handleDeleteDocument(document.id, e)}
                                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute right-0 top-0 p-1"
                                            >
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {folders.length === 0 && documents.filter(doc => !doc.folderId && doc.type !== 'CODE_FILE').length === 0 && (
                                <div className="px-3">
                                    <p className="text-sm text-muted-foreground p-2">
                                        No documents yet
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div onMouseDown={handleMouseDown} onClick={resetWidth}  className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"/>
                
                {/* User Info Section - Fixed at sidebar bottom */}
                {user && (
                    <div className="absolute bottom-0 left-0 right-0 bg-secondary border-t border-gray-200 dark:border-gray-700 p-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer w-full">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {user.name || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                    <MoreHorizontal className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="top" className="w-56 z-[100001] mb-2">
                                {/* Profile Section */}
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                                </div>
                                <DropdownMenuSeparator />
                                {/* Theme Preferences */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Palette className="h-4 w-4 mr-2" />
                                        <span>Theme</span>
                                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{getThemeDisplay()}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                            System
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                {/* Logout */}
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </aside>
            <div ref={navbarRef} className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isMobile && "left-0 w-full")}>
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth}  role="button" className="h-6 w-6 text-muted-foreground" />}
                    </nav>

            </div>
        </>
    );
}
