import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import icon trái tim
import { formatDistanceToNow } from "date-fns"; // Format thời gian
import axios from "axios";


const CommentSection = ({ comments, post }: any) => {
  return (
    <div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
      {comments.map((comment: any) => (
        <CommentItem comment={comment} />
      ))}
    </div>
  );
};

const CommentItem = ({ comment, post }: any) => {

  var token = localStorage.getItem("token")

  const API_BACKEND = "http://localhost:9999/api/";
  // State for toggling likes
  const [liked, setLiked] = useState(false);

  const [replies, setReplies] = useState([]);

  // State for toggling reply visibility
  const [showReplies, setShowReplies] = useState(false);

  const fetchReplies = async () => {

    const postId = post.getPostId();

    try {
      const response = await axios.get(`${API_BACKEND}comments/comment_closer/${comment.commentId}/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }

      );
      setReplies(response.data.data);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies(); // Gọi API khi mở lần đầu
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="flex flex-col items-start gap-3">
      {/* Hiển thị comment */}
      <div className="flex items-center gap-3">
        <img
          src={comment.authorAvatarUrl}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
        />
        <div className="flex flex-col items-start justify-center">
          <span className="font-semibold" style={{ color: "var(--text-color)" }}>
            {comment.userName}
          </span>
          <span style={{ color: "var(--text-color)" }}>{comment.content}</span>
        </div>
      </div>

      {/* Like + Reply + Time */}
      <div className="flex items-center gap-5 ml-12 text-gray-500 text-sm">
        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        <span>{liked ? comment.numberEmotion + 1 : comment.numberEmotion} likes</span>
        <button className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200">
          Reply
        </button>
        <button
          className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setLiked(!liked)}
        >
          {liked ? (
            <FaHeart className="text-red-500 transform hover:scale-110 transition-transform duration-200" />
          ) : (
            <FaRegHeart className="text-gray-500 transform hover:scale-110 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Nút xem reply */}
      {comment.numberCommentChild > 0 && (
        <div className="ml-12">
          <button className="text-gray-500 text-sm underline" onClick={handleToggleReplies}>
            {showReplies ? "Hide replies" : `View replies (${comment.numberCommentChild})`}
          </button>
        </div>
      )}

      {/* Hiển thị reply nếu đã mở */}
      {showReplies && replies.length > 0 && (
        <div className="ml-12 mt-2 border-l-2 border-gray-300 pl-4">
          {replies.map((reply) => (
            <CommentItem comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};


export default CommentSection;
