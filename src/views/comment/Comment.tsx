import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

interface CommentSectionProps {
  comments: any[];
  post: any;
  onReplyClick?: (commentId: number) => void;
}

const CommentSection = ({ comments, post, onReplyClick }: CommentSectionProps) => {
  const rootComments = comments.filter(comment => !comment.parentId);

  if (!rootComments || rootComments.length === 0) {
    return (
      <div className="pt-2 pl-5 pr-5 text-gray-500 text-center">
        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
      </div>
    );
  }

  return (
    <div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
      {rootComments.map((comment: any, index: number) => (
        <CommentItem 
          key={comment.commentId || index} 
          comment={comment} 
          post={post}
          onReplyClick={onReplyClick}
        />
      ))}
    </div>
  );
};


interface CommentItemProps {
  comment: any;
  post: any;
  onReplyClick?: (commentId: number) => void;
}

const CommentItem = ({ comment, post, onReplyClick }: CommentItemProps) => {
  const token = localStorage.getItem("token");
  const API_BACKEND = "http://localhost:9999/api/";
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.numberEmotion || 0);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
  
        const response = await axios.get(
          `${API_BACKEND}comments/checkExistedEmotion/${userId}/${comment.commentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setLiked(response.data?.data === true);
      } catch (err) {
        console.error("Error checking liked status:", err);
      }
    };
  
    if (comment?.commentId) {
      fetchLikedStatus();
    }
  }, [comment?.commentId]); // 👈 chạy lại khi commentId thay đổi
  
  

  const handleLike = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      await axios.post(
        `${API_BACKEND}comment-emotions`,
        {
          userId: parseInt(userId),
          commentId: comment.commentId,
          emotion: "LIKE"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Toggle trạng thái like và cập nhật số lượng like
      setLiked(!liked);
      setLikeCount((prev: number) => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Nếu chưa có reply trong props và có số lượng reply (numberCommentChild), có thể fetch reply
  const fetchReplies = async () => {
    if (!post?.postId) return;

    try {
      const response = await axios.get(
        `${API_BACKEND}comments/comment_closer/${comment.commentId}/${post.postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        // Ta gán trực tiếp vào comment.replies (nếu cơ chế của bạn cho phép, hoặc bạn có thể truyền thông qua hàm callback update state từ component cha)
        comment.replies = response.data.data;
        setShowReplies(true);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleToggleReplies = () => {
    // Nếu chưa hiển thị và không có reply trong props mà comment báo có reply
    if (!showReplies && (!comment.replies || comment.replies.length === 0) && comment.numberCommentChild > 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <div className="flex items-center gap-3 w-full">
        <img
          src={comment.authorAvatarUrl || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
        />
        <div className="flex flex-col items-start justify-center flex-1">
          <span className="font-semibold" style={{ color: "var(--text-color)" }}>
            {comment.userName || "User"}
          </span>
          <span style={{ color: "var(--text-color)" }}>{comment.content}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 ml-12 text-gray-500 text-sm">
        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        <span>{likeCount} likes</span>
        <button 
          className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          onClick={() => onReplyClick?.(comment.commentId)}
        >
          Reply
        </button>
        <button
          className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={handleLike}
        >
          {liked ? (
            <FaHeart className="text-red-500 transform hover:scale-110 transition-transform duration-200" />
          ) : (
            <FaRegHeart className="text-gray-500 transform hover:scale-110 transition-transform duration-200" />
          )}
        </button>
      </div>

      {(comment.numberCommentChild > 0 || (comment.replies && comment.replies.length > 0)) && (
        <div className="ml-12">
          <button className="text-gray-500 text-sm underline" onClick={handleToggleReplies}>
            {showReplies ? "Hide replies" : `View replies (${Math.max(comment.numberCommentChild, comment.replies?.length || 0)})`}
          </button>
        </div>
      )}

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-2 border-l-2 border-gray-300 pl-4 w-full">
          {comment.replies.map((reply: any) => (
            <CommentItem 
              key={reply.commentId} 
              comment={reply} 
              post={post}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default CommentSection;
