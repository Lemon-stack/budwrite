"use client";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { FileText, PlusSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

interface Writing {
  id: string;
  title: string;
  created_at: string;
  content: string;
}

const ITEMS_PER_PAGE = 10;

export function WritingHistory() {
  const { user } = useAuth();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const router = useRouter();
  const db = getFirestore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const loadWritings = async (
    lastDocument?: QueryDocumentSnapshot<DocumentData>
  ) => {
    if (!user || (lastDocument && !hasMore)) {
      setIsLoading(false);
      return;
    }

    try {
      if (lastDocument) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const writingsRef = collection(db, `users/${user.id}/writings`);
      let writingsQuery = query(
        writingsRef,
        orderBy("created_at", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      if (lastDocument) {
        writingsQuery = query(
          writingsRef,
          orderBy("created_at", "desc"),
          startAfter(lastDocument),
          limit(ITEMS_PER_PAGE)
        );
      }

      // Clean up existing listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      const unsubscribe = onSnapshot(
        writingsQuery,
        (snapshot) => {
          try {
            const writingsArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Writing[];

            if (lastDocument) {
              setWritings((prev) => [...prev, ...writingsArray]);
            } else {
              setWritings(writingsArray);
            }

            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(writingsArray.length === ITEMS_PER_PAGE);
            setIsLoading(false);
            setIsLoadingMore(false);
          } catch (err) {
            console.error("Error processing Firestore data:", err);
            setError("Failed to load writings");
            toast.error("Failed to load writings");
            setIsLoading(false);
            setIsLoadingMore(false);
          }
        },
        (error) => {
          console.error("Firestore error:", error);
          setError(error.message);
          toast.error("Failed to load writings");
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error("Error in loadWritings:", err);
      setError("Failed to load writings");
      toast.error("Failed to load writings");
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setWritings([]);
      return;
    }

    loadWritings();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && lastDoc) {
      loadWritings(lastDoc);
    }
  };

  const handleDelete = async (writingId: string) => {
    if (!user) return;

    try {
      setSelectedId(writingId);
      const writingRef = doc(db, `users/${user.id}/writings/${writingId}`);
      await deleteDoc(writingRef);
      toast.success("Writing deleted successfully");
      setWritings((prev) => prev.filter((w) => w.id !== writingId));
    } catch (error) {
      console.error("Error deleting writing:", error);
      toast.error("Failed to delete writing");
    } finally {
      setSelectedId(null);
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">Failed to load writings</div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        className="flex items-center border-sidebar-border border gap-2 px-2 py-1.5 bg-sidebar-border/70 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1"
        onClick={() => {
          router.push("/home/w/new");
        }}
      >
        <PlusSquare className="h-4 w-4" />
        New writing
      </button>
      {isLoading ? (
        <div className="flex flex-col gap-1 mt-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-col px-2 py-1.5 rounded-md">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-16 ml-6 mt-1" />
            </div>
          ))}
        </div>
      ) : writings.length === 0 ? (
        <div className="text-center text-muted-foreground py-2 text-xs">
          No writings yet. Create your first writing!
        </div>
      ) : (
        <>
          {writings.map((writing) => (
            <div
              key={writing.id}
              className={`flex flex-col px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                selectedId === writing.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => {
                setSelectedId(writing.id);
                router.push(`/home/w/${writing.id}`);
              }}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate text-sm font-medium">
                  {writing.title}
                </span>
              </div>
              <span className="pl-6 text-xs text-muted-foreground truncate">
                {formatDistanceToNow(new Date(writing.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))}
          {isLoadingMore && (
            <div className="flex flex-col gap-1 mt-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col px-2 py-1.5 rounded-md">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-md" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-3 w-16 ml-6 mt-1" />
                </div>
              ))}
            </div>
          )}
          {hasMore && !isLoadingMore && (
            <button
              className="mt-2 flex items-center justify-center border-sidebar-border border gap-2 px-2 py-1.5 bg-sidebar-border/70 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}
