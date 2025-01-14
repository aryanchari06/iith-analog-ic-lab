"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Comment {
  text: string;
  owner: { _id: string; username: string; email: string };
  article: string;
  _id: string;
  commentOwner: Owner;
}

interface Owner {
  _id: string;
  username: string;
  email: string;
}

interface Article {
  title: string;
  imgUrl: string;
  _id: string;
  owner: string;
  description: string;
  createdAt: Date;
  articleOwner: Owner;
  comments: Comment[];
}

const Page = () => {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [commentText, setCommentText] = useState("");
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(
          `/api/fetch-article/${params.articleId}`
        );
        setArticle(data.data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    fetchArticle();
  }, [params.articleId]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await axios.get(
        `/api/fetch-article-comments/${params.articleId}`
      );
      setComments(fetchedComments.data.data);
    };

    fetchComments();
  }, [params.articleId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (session?.user._id) {
      try {
        const response = await axios.post("/api/add-comment", {
          text: commentText,
          owner: session.user._id,
          article: params.articleId,
        });
        const newComment = response.data.comment;
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
      } catch (error) {
        console.error("Failed to add comment:", error);
        toast({
          title: "Error",
          description: "Failed to add comment.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sign In Required",
        description: "Sign in to comment.",
        variant: "destructive",
      });

      setTimeout(() => {
        router.replace("/sign-in");
      }, 1000);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      setIsDeletingComment(true);
      const deletedComment = await axios.post(
        `/api/delete-comment/${commentId}`,
        { commentId }
      );

      if (deletedComment.status === 200) {
        toast({
          title: "Success",
          description: "Comment Deleted Successfully!",
        });
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentToDelete)
        );
        setCommentToDelete(null); // Close the dialog
      } else {
        throw new Error(deletedComment.data.message);
      }
    } catch (error) {
      toast({
        title: "Failure",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeletingComment(false);
      setCommentToDelete(null);
    }
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Fetching article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white">
      {/* Fullscreen Image Modal */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75 animate__animated animate__fadeIn"
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={article.imgUrl}
            alt={article.title}
            className="max-w-[90%] max-h-[90%] rounded-md"
          />
        </div>
      )}

      <div className="mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {article.title}
        </h1>
        <img
          src={article.imgUrl}
          alt={article.title}
          className="w-full h-64 mb-8 object-cover rounded-md shadow-md cursor-pointer transform transition duration-300 hover:scale-[1.01]"
          onClick={() => setIsImageOpen(true)}
        />
        
        <p className="text-sm text-gray-600 mt-2">
          Published by{" "}
          <span className="font-medium text-gray-800">
            {article.articleOwner.username}
          </span>{" "}
          on {new Date(article.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-800 mt-4">{article.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comments</h2>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:outline-none transition-all"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-lg transition-all"
            onClick={handleAddComment}
          >
            Comment
          </Button>
        </div>

        <ul className="space-y-4">
          {comments.length === 0 ? (
            <li className="text-gray-600 italic">No comments yet.</li>
          ) : (
            comments.map((comment) => (
              <li
                key={comment?._id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between transform transition duration-300 hover:scale-105"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {comment.commentOwner?.username}
                  </p>
                  <p className="text-gray-700 mt-2">{comment.text}</p>
                </div>
                {comment.commentOwner?._id === session?.user?._id ||
                comment.commentOwner?._id === article.articleOwner._id ? (
                  <Dialog>
                    <DialogTrigger>
                      <Trash className="text-red-600 cursor-pointer transform transition duration-300 hover:scale-110" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          className="bg-red-600 text-white"
                          onClick={() => {
                            handleCommentDelete(comment._id);
                          }}
                        >
                          {isDeletingComment ? (
                            <>
                              <Loader2 className="animate-spin" />
                              "Deleting..."
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                        <Button
                          className="ml-2"
                          onClick={() => setCommentToDelete(null)}
                        >
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Page;
