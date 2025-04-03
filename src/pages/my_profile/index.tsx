import { Carousel, Modal, Button, Upload } from "antd";
import React, { useState, useEffect } from "react";
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

export default function MyProfile() {
  let idDangNhap =  Number(localStorage.getItem("idUser"));
  let idProfileDangXem = 2 ;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/images/default-avatar.jpg");

  const [showEditOption, setShowEditOption] = useState(false);
  const navigate = useNavigate();

  const images = [
    "/images/uifaces-popular-image (12).jpg",
    "/images/uifaces-popular-image (13).jpg",
    "/images/uifaces-popular-image (14).jpg",
    "/images/uifaces-popular-image (5).jpg",
    "/images/uifaces-popular-image (6).jpg",
    "/images/uifaces-popular-image (7).jpg",
    "/images/uifaces-popular-image (14).jpg",
  ];

  const { theme } = useTheme();
  const { t } = useTranslation();
  const iconColor = theme === "dark" ? "white" : "black";



  // Lấy thông tin user
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/api/users/${idProfileDangXem}`);
        setUsername(response?.data?.data?.userName);
        setAvatar(response.data.data.urlAvatar);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
        setUsername("User not found");
      }
    };
    fetchUserProfile();
  }, [id]);

  // Mở/đóng modal hiển thị ảnh
  const handleImageClick = (post: any) => {
    setSelectedImages(post.postMedia.map((media: any) => media.mediaUrl)); // Lấy danh sách ảnh của bài post
    setIsModalOpen(true);
  };


  // Mở popup thay đổi avatar
  const handleOpenPop = () => setIsPopOpen(true);
  const handleClosePop = () => setIsPopOpen(false);

  // Xử lý tải ảnh mới
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.put(`http://localhost:9999/api/api/users/avatar/${idProfileDangXem}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setAvatar(response.data.data.urlAvatar);
      handleClosePop();
      onSuccess("Upload thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật avatar:", error);
      onError(error);
    }
  };


  // Gỡ ảnh hiện tại 
  const handleRemoveAvatar = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:9999/api/api/users/avatar/${idProfileDangXem}`
      );


      // Cập nhật avatar về mặc định
      setAvatar("/images/default-avatar.jpg");

      // Đóng popup nếu có
      handleClosePop();
    } catch (error: any) {
      console.error("Lỗi khi gỡ avatar:", error);
    }
  };


  //nhấn vào icon '...'
  const handleIconClick = () => {
    setShowEditOption(!showEditOption); // Hiển thị hoặc ẩn tùy chọn chỉnh sửa
  };

  const handleEditProfileClick = () => {
    navigate('/edit-profile'); // Điều hướng đến trang chỉnh sửa thông tin cá nhân
  };
  const [posts, setPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/api/posts/user/${idProfileDangXem}`);
        const posts = response.data.data.data; // Lấy mảng bài post

        setPosts(posts); // Cập nhật state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
      }
    };

    fetchUserPosts();
  }, []);

  console.log("postspostsposts", posts)

  return (
    <div className="ml-25 min-h-[100vh] p-4 flex flex-col items-center">
      {/* Thông tin người dùng */}
      <div className="flex items-center gap-30 mb-8">
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
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-4 justify-center">
            <h2 className="text-xl font-normal">{username || "Loading..."}</h2>
            <div
              className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[148px] h-[32px] leading-[100%] flex items-center justify-center text-black-600"
              style={{ background: "var(--hover-color)" }}
            >
                abc
            </div>
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

          <div className="flex gap-6 mt-2">
            <span className="font-light flex items-center gap-2">
              <strong className="font-bold">20</strong> {t("post")}
            </span>
            <span className="font-light flex items-center gap-2">
              {/* <strong className="font-bold">5.2K</strong> {t("follower")} */}
              <FriendsMenu idProfileDangXem={idProfileDangXem} />
            </span>
            <span className="font-light flex items-center gap-2">
              <strong className="font-bold">120</strong> {t("following")}
            </span>
          </div>

          <p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
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
            <img src={post?.postMedia[0]?.mediaUrl} alt="Post" className="w-full h-full object-cover" />
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


      {/* Modal hiển thị ảnh */}
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
              <div className="flex p-5  items-center gap-3 border-b border-gray-300 pb-3">
                <img
                  src="/public/images/uifaces-popular-image (11).jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                />
                <span className="font-semibold text-gray-800">username</span>
              </div>

              <div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
                comment
              </div>
            </div>

            <div className="pl-5 pr-5 border-t border-gray-300">
              <CommentInput />
            </div>
          </div>
        </div>
      </Modal>  
      <ChatAppGemini />
    </div>
  );
}
