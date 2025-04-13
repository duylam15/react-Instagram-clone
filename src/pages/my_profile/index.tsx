import { Carousel, Modal, Button, Upload, Spin, message } from "antd";
import React, { useState, useEffect, useRef } from "react";
import CommentInput from "../../components/CommentInput/CommentInput";
import { IconDots } from "../../components/icons/ic_dots";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ImageUploader from "../../components/Avatar/ImageUploader";
import "./style.css"
import FriendsMenu from "./friendMenu";
import FriendButton from "./friendButton";
import { number } from "prop-types";
import ChatAppGemini from "../../components/chatGemini";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { deletePostService, updatePost } from "../../services/post";
import { useRefresh } from "../../contexts/RefreshContext";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { CustomNextArrow, CustomPrevArrow } from "../../components/InstagramPost/handle";
import { formatTimeAgo } from "../../utils/date";
import CommentSection from "../../views/comment/Comment";

export default function MyProfile() {
  // Khai báo các hook context/router
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();
  const iconColor = theme === "dark" ? "white" : "black";
  const { refreshTrigger, refresh } = useRefresh();
  const menuRef = useRef<HTMLDivElement>(null);

  // Xử lý ID đăng nhập / profile
  const userId = localStorage.getItem("userId");
  const idDangNhap = Number(userId);
  const [idProfileDangXem, setIdProfileDangXem] = useState(idDangNhap);
  const id = urlId || userId;

  // Thông tin user
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>();
  const [avatar, setAvatar] = useState("/images/default-avatar.jpg");

  // Modal, popup, image state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [images, setImages] = useState<any>();

  // Bài viết & chỉnh sửa
  const [posts, setPosts] = useState<string[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [postClick, setPostClick] = useState<any>();
  const [comment, setComment] = useState(postClick?.content);
  const [visibility, setVisibility] = useState<any>(postClick?.visibility);
  const [loading, setLoading] = useState(false);

  console.log("postClickpostClickx", postClick)
  // Hiển thị và chọn
  const [showEditOption, setShowEditOption] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPut, setIsOpenPut] = useState(false);
  const [isModalOpenPut, setIsModalOpenPut] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Xác định idProfileDangXem từ URL
  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const lastSegment: any = segments.pop(); // lấy phần cuối cùng
    const result = /^\d+$/.test(lastSegment) ? parseInt(lastSegment) : idDangNhap;
    setIdProfileDangXem(result);
  }, [location]);

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(
          `http://localhost:9999/api/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );
        setUsername(`${response?.data?.data?.firstName} ${response?.data?.data?.lastName}`);
        setUser(response?.data?.data)
        setAvatar(response.data.data.urlAvatar);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
        setUsername("User not found");
      }
    };
    fetchUserProfile();
  }, [id]);

  // Lấy danh sách bài viết của người dùng
  useEffect(() => {
    const fetchUserPosts = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:9999/api/posts/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let posts = response?.data?.data?.data || [];

        // ❌ Bỏ các bài viết có visibility là "DELETE"
        posts = posts.filter((post: any) => post.visibility !== "DELETE");

        setPosts(posts);
        setPostCount(posts.length);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
      }
    };

    fetchUserPosts();
  }, [refreshTrigger]);

  // Đóng menu khi click ra ngoài (menuRef)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đóng tùy chọn chỉnh sửa khi click ra ngoài (menuRef)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mở & đóng popup thay đổi avatar
  const handleOpenPop = () => setIsPopOpen(true);
  const handleClosePop = () => setIsPopOpen(false);

  // Xử lý khi gỡ ảnh đại diện
  const handleRemoveAvatar = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.delete(
        `http://localhost:9999/api/api/users/avatar/${idProfileDangXem}`, {
          headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );


      // Cập nhật avatar về mặc định
      setAvatar("/images/default-avatar.jpg");

      // Đóng popup nếu có
      handleClosePop();
    } catch (error: any) {
      console.error("Lỗi khi gỡ avatar:", error);
    }
  };

  // Xử lý khi click vào icon “...” (menu tùy chọn)
  const handleIconClick = () => {
    setShowEditOption(!showEditOption); // Hiển thị hoặc ẩn tùy chọn chỉnh sửa
  };

  // Điều hướng đến trang chỉnh sửa hồ sơ
  const handleEditProfileClick = () => {
    navigate('/edit-profile'); // Điều hướng đến trang chỉnh sửa thông tin cá nhân
  };

  // Xử lý khi click vào một bài viết (xem chi tiết)
  const handleImageClick = (post: any) => {
    setSelectedImages(post.postMedia.map((media: any) => media.mediaUrl)); // Lấy danh sách ảnh của bài post
    setPostClick(post)
    setImages(post?.postMedia)
    setComment(post?.content)
    setVisibility(post?.visibility)
    setIsModalOpen(true);
  };

  // Xoá bài viết
  const handleDelete = async (postId: number) => {
    console.log("postIdxxx", postId)
    try {
      const result = await deletePostService(postId);
      alert(result.message);
      setIsOpen(false);
      refresh();
    } catch (error: any) {
      alert(error.message || "Lỗi khi xóa bài viết!");
    }
  };

  // Đóng popup cập nhật bài viết
  const handleClose = () => {
    setIsOpenPut(false)
  };

  // Cập nhật bài viết
  const handlePostUpdate = async () => {
    // Check nếu thiếu thông tin thì return sớm
    if (!comment?.trim() || !visibility) {
      message.warning("⚠️ Không đủ thông tin để cập nhật bài viết");
      return;
    }

    try {
      setLoading(true); // Bắt đầu loading

      const response = await updatePost(postClick?.postId, comment, images, visibility);

      if (response?.data?.imageUrl) {
        setImages([...images, response.data.imageUrl]);
      }

      console.log("✅ Phản hồi API:", response);
      refresh();
      handleClose();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật bài viết:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Xoá ảnh trong bài viết
  const handleRemoveImage = async (img: any) => {
    console.log("imgimgxx", img)
    if (img?.postMediaId) {
      // Ảnh đã được upload lên server → gọi API xoá
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:9999/api/post-medias/${img?.postMediaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImages((prev: any[]) => prev.filter((i) => i !== img));
        refresh();
        console.log(`✅ Đã xoá ảnh server ID: ${img.postMediaId}`, response.data);
      } catch (error) {
        console.error("❌ Lỗi khi xoá ảnh từ server:", error);
        alert("Xoá ảnh thất bại. Vui lòng thử lại.");
      }
    } else {
      // Ảnh local (chưa upload) → xoá khỏi state
      setImages((prev: any[]) => prev.filter((i) => i !== img));
      console.log("🗑️ Đã xoá ảnh local:", img);
    }
  };

  // Thêm ảnh vào bài viết (preview local)
  const handleAddImage = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    const cleanUrl = imageUrl.replace("blob:", "");
    console.log("imageUrlimageUrl", cleanUrl); // Không còn 'blob:' ở đầu nữa
    setImages((prev: any) => [...prev, imageUrl]);
  };

  // Chọn chế độ hiển thị của bài viết
  const handleSelect = (value: "PUBLIC" | "PRIVATE") => {
    setVisibility(value);
    setShowOptions(false);
  };

  // Thêm emoji vào nội dung bài viết
  const handleEmojiSelect = (emoji: { native: string }) => {
    setComment((prev: any) => prev + emoji.native); // Thêm emoji vào nội dung input
    setShowPicker(false); // Ẩn picker sau khi chọn
  };

  return (
    <div className="ml-25 min-h-[100vh] p-4 flex flex-col items-center">
      {/* Thông tin người dùng */}
      <div className="flex items-center gap-4 mb-8">
        {/* Ảnh đại diện */}
        <div className="w-[168px] h-[168px] rounded-full overflow-hidden border-2 p-1.5 border-pink-500">
          <img
            src={avatar}
            alt="Avatar"
            className="object-cover rounded-[99px]"
            onClick={handleOpenPop}
          />
        </div>

        {/* Thông tin cá nhân */}
        <div className="relative flex flex-col gap-1">
          <div className="flex items-center gap-4 justify-center">
            <h2 className="text-xl font-normal">{username || "Loading..."}</h2>
            {/* <div
              className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[148px] h-[32px] leading-[100%] flex items-center justify-center text-black-600"
              style={{ background: "var(--hover-color)" }}
            >
              abc
            </div> */}
            {idDangNhap != idProfileDangXem &&
              <FriendButton
                idUser1={idDangNhap} /// id dang nhap
                idUser2={idProfileDangXem} /// id profile dang xem
              />}
            <div
              className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[100px] h-[32px] leading-[100%] flex items-center justify-center text-black-600"
              style={{ background: "var(--hover-color)" }}
            >
              Nhắn tin
            </div>
            <div
              className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[30px] h-[32px] leading-[100%] flex items-center justify-center text-black-600"
              style={{ background: "var(--hover-color)" }}
            >
              +
            </div>
            <div className="px-4 py-1 rounded-md font-medium text-[14px] text-center w-[30px] h-[32px] leading-[100%] flex items-center justify-center text-black-600">
              <p className="text-gray-600" onClick={handleIconClick}>
                <IconDots color={iconColor} />
              </p>

              {showEditOption && (
                <div className="absolute bg-white-100 p-2 text-center rounded-md shadow-lg mt-2 w-[230px] right-0 top-[14%] text-black">
                  <button
                    onClick={handleEditProfileClick}
                    className="text-black font-medium text-[14px]  py-1 px-2 rounded-md"
                    style={{ backgroundColor: '#ffff' }} // Màu nền cho nút
                  >
                    Chỉnh sửa thông tin cá nhân
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <span className="font-light flex items-center gap-2">
              <strong className="font-bold">{postCount}</strong> {t("post")}
            </span>
            <span className="font-light flex items-center gap-2">
              <FriendsMenu idProfileDangXem={idProfileDangXem} />
            </span>
            <span className="font-light flex items-center gap-2">
            </span>
          </div>
          <p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
        </div>
      </div>

      {/* Danh sách ảnh từ bài viết */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post: any) =>
          <div
            key={post?.postId}
            className="aspect-square h-[410px] w-[308px] cursor-pointer"
            onClick={() => handleImageClick(post)}
          >
            {post?.postMedia[0]?.mediaUrl ?
              <img src={post?.postMedia[0]?.mediaUrl} alt="Post" className="w-full h-full object-cover" />
              :
              <div className="w-full h-[410px] border object-cover flex text-center justify-center items-center" >Bài viết</div>
            }
          </div>
        )}
      </div>

      {/* Modal Thay đổi avatar */}
      <Modal
        open={isPopOpen}
        onCancel={handleClosePop}
        footer={null}
        centered
        width={320}
        className="custom-modal custom-height-modal"
      >
        <div className="flex flex-col items-center p-0">
          <h5 className="custom-btn text-center font-normal text-lg mt-4 mb-3">
            Thay đổi ảnh đại diện
          </h5>

          <div className="w-full h-[1px] bg-gray-300 my-1"></div>

          {/* Tải ảnh lên */}
          <ImageUploader onUploadSuccess={(url) => setAvatar(url)} onClose={handleClosePop} />


          <div className="w-full h-[1px] bg-gray-300 my-1"></div>

          {/* Gỡ ảnh hiện tại */}
          <Button
            type="text"
            danger
            className="custom-btn text-red-500 font-medium text-base w-full my-2"
            onClick={handleRemoveAvatar}
          >
            Gỡ ảnh hiện tại
          </Button>

          <div className="w-full h-[1px] bg-gray-300 my-1"></div>

          {/* Nút Hủy */}
          <Button
            className="border-0 custom-btn no-hover text-base font-medium w-full my-2"
            onClick={handleClosePop}
          >
            Hủy
          </Button>
        </div>
      </Modal>

      {/* Modal hiển thị ảnh chi tiết nếu cần */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={800}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </Modal>

      {/* Modal hiển thị ảnh và comments */}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={"70%"} centered>
        <div className="flex">
          {/* Hình ảnh bên trái */}
          <div className="w-[55%]">
            <Carousel infinite={false} arrows>
              {selectedImages.map((img, index) => (
                <img key={index} src={img} alt="Post" className="w-full h-[90vh] object-cover" />
              ))}
            </Carousel>
          </div>

          {/* Comments bên phải */}
          <div className="w-1/2 flex flex-col justify-between">
            <div className="overflow-y-auto h-[400px]">
              <div className="flex flex-col p-3 justify-between  items-start gap-3 border-b border-gray-300 pb-3">
                <div className="flex justify-between w-full items-center">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={user?.urlAvatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                  />
                  <span className="font-semibold" style={{ color: "var(--text-color)" }}>{username}</span>
                    <span className="font-normal text-[14px] text-gray-400" style={{ color: "var(--white-to-gray)" }}>{formatTimeAgo(`${postClick?.createdAt}`, t)}  </span>
                </div>

                  <div className="relative inline-block" style={{
                    color: "var(--text-color)",
                    background: " var(--bg-color)"
                  }}>

                  <div ref={menuRef}>
                      <div className="relative w-[20px] h-[20px]" onClick={() => setIsOpen(!isOpen)} >
                        <svg viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg" stroke="#c2c2c2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="#c2c2c2"></path> <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="#c2c2c2"></path> <path d="M21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12Z" fill="#c2c2c2"></path> </g></svg>
                    </div>
                    {isOpen && postClick?.userId?.toString() === userId && (
                      <div
                        className="absolute z-40 right-0 w-40 border rounded-lg shadow-lg flex flex-col text-center"
                        style={{
                          color: "var(--text-color)",
                          background: "var(--bg-color)",
                          lineHeight: 1,
                          borderColor: "var(--white-to-gray)",
                        }}
                      >
                        <p
                          className="custom-hover cursor-pointer w-full text-center leading-[40px] m-0 rounded-t-lg"
                          onClick={() => {
                            if (postClick?.postId) {
                              handleDelete(postClick?.postId);
                                setIsModalOpen(false);
                            }
                          }}
                        >
                          Xóa
                        </p>
                        <p
                          className="custom-hover cursor-pointer w-full text-center leading-[40px] m-0 rounded-b-lg"
                          onClick={() => {
                            if (postClick?.postId) {
                              setIsOpenPut(true);
                              setIsModalOpen(false);
                            }
                          }}

                        >
                          Sửa
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
                <span className="font-semibold" style={{ color: "var(--text-color)" }}>{postClick?.content}</span>
              </div>
              <div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3 text-gray-400">
                comment
            </div>
              </div>

            <div className="pl-5 pr-5 border-t border-gray-300">
              <CommentInput />
            </div>
          </div>
        </div>
      </Modal>

      {/* Update Post */}
      {isOpenPut && <div className="overlay" onClick={() => handleClose()}>
          <div className="rounded-xl" onClick={(e) => e.stopPropagation()}>
            {loading ? (
              <Spin size="large" tip="Creating post..." />
            ) : (
            <div className="flex justify-between items-center flex-col mt-[-20px] w-[1000px] h-[90vh]  rounded-xl">

                <div className="bg-black w-full text-white font-medium text-[20px] rounded-t-xl text-center p-2 flex justify-between items-center">
                <div className="">
                </div>
                <div className="ml-30">
                  Update post
                </div>
                <div className="" onClick={handlePostUpdate}>
                  Update Post
                </div>
                </div>
                <div className="flex w-full h-[90vh]">
                  {/* Khu vực hiển thị ảnh */}
                  <div className="bg-gray-700 h-full max-w-[60%] w-full rounded-bl-xl flex items-center justify-center flex-col">
                    <div className="w-full h-full relative">
                      <Carousel infinite={false}
                        arrows >
                        {images?.map((img: any, index: any) => (
                          <img
                            key={index}
                            src={img?.mediaUrl || img}
                            alt="Selected"
                            className="h-[83vh] w-[70%]  object-cover rounded-bl-xl"
                          />
                        ))}
                      </Carousel>
                      <button
                        className="bg-black absolute bottom-5 right-10 shadow-md text-white pl-4 pr-4 rounded-xl"
                        onClick={() => setIsModalOpenPut(true)}
                      >
                        Chỉnh sửa ảnh
                      </button>
                      {/* Modal chỉnh sửa ảnh */}
                      {isModalOpenPut &&
                        <div onClick={(e) => e.stopPropagation()} style={{ top: "20%" }}>
                          <Modal
                            open={isModalOpenPut}
                            onCancel={() => setIsModalOpenPut(false)}
                            footer={null}
                            centered
                            className="model_post"
                            mask={false} // ❌ Tắt overlay
                            style={{ top: "20%" }}
                          >
                            <div className="flex">
                              {/* Danh sách ảnh hiện tại */}
                              <div className="flex flex-wrap gap-3">
                                {images && images.length > 0 ? (
                                  <Carousel
                                    dots={true}
                                    className="w-[240px]"
                                    arrows
                                    prevArrow={<CustomPrevArrow />}
                                    nextArrow={<CustomNextArrow />}
                                    slidesToShow={2}
                                  >
                                    {images.map((img: any, index: number) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={img?.mediaUrl || img}
                                          alt="Selected"
                                          className="w-[100px] h-[100px] object-cover rounded"
                                        />
                                        <div
                                          className="absolute top-1 right-6 bg-gray-500 text-white p-1 rounded opacity-80 hover:opacity-100 transition"
                                          onClick={() => handleRemoveImage(img)}
                                        >
                                          Xóa
                                        </div>
                                      </div>
                                    ))}
                                  </Carousel>
                                ) : (
                                  <div className="bg-black p-4 flex justify-center items-center rounded text-center text-sm text-white">
                                    Không có hình ảnh nào
                                  </div>
                                )}
                              </div>

                              {/* Thêm ảnh mới */}
                              <div className="ml-4">
                                <Upload
                                  showUploadList={false}
                                  beforeUpload={(file) => {
                                    handleAddImage(file);
                                    return false;
                                  }}
                                >
                                  <button className="w-24 h-24 rounded flex items-center justify-center gap-2 bg-black" >
                                    <svg viewBox="0 0 20 20" width="40px" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ccc"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ccc" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"></path> </g></svg>
                                  </button>
                                </Upload>
                              </div>
                            </div>
                          </Modal>
                        </div>
                      }
                    </div>
                      )}
                    </div>
                  {/* Khu vực comment */}
                <div className="bg-gray-600 h-full w-[50%] rounded-br-xl  overflow-auto">
                    <div className="comment p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between">
                        <img src={user?.urlAvatar} alt=""
                          className="w-[50px] h-[50px] rounded-full" />
                          <div className="text-white ml-4">{username}</div>
                        </div>
                        <div className="relative" onClick={() => setShowOptions((prev) => !prev)} ref={menuRef}>
                        <svg viewBox="0 0 16 16" width="20px" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ccc"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8Z" fill="#ccc"></path> <path d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z" fill="#ccc"></path> <path d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z" fill="#ccc"></path> </g></svg>
                          {showOptions && (
                            <div className="absolute top-8 right-0 bg-black text-white rounded shadow-md z-50 w-32">
                              <div
                                onClick={() => handleSelect("PUBLIC")}
                                className="flex items-center justify-between rounded p-2 hover:bg-gray-800 cursor-pointer"
                              >
                                <span>Public</span>
                                {visibility === "PUBLIC" && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                              </div>
                              <div
                                onClick={() => handleSelect("PRIVATE")}
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer"
                              >
                                <span>Private</span>
                                {visibility === "PRIVATE" && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="input-post mt-3">
                        <div className="flex items-center py-2">
                          <textarea
                            placeholder={t('Comment')}
                          className="w-full text-white outline-none  p-1"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ color: "var(--text-color)" }}
                          ></textarea>

                        {/* Nút mở Emoji Picker */}
                          <FaSmile
                            className="text-gray-500 cursor-pointer w-[25px] h-[25px]"
                            onClick={() => setShowPicker(!showPicker)}
                          />
                        {/* Hiển thị Emoji Picker */}
                          {showPicker && (
                          <div className=" absolute bottom-0 right-54 z-10">
                              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


      </div >
      }
    </div>
  );
}


