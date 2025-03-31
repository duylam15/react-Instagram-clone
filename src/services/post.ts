import axios from "axios";
import { message } from "antd";

const API_BASE_URL = "http://localhost:9999/api/posts";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMDEiLCJpYXQiOjE3NDI4NjQyNzAsImV4cCI6MTc0Mjg2NjA3MH0.XFxyFEYl-G3PKdbUK1AqXSW0aJlK97Msf8zvMbNjjCk";

export const getPosts = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    console.log(token)

    const response = await axios.get("http://localhost:9999/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy bài viết:", error);

    // Nếu lỗi là 401 hoặc 403, ném lỗi để frontend xử lý
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};

export const createPost = async (userId:any, comment:any, images:any) => {
  try {
    const formData = new FormData();
    // Thêm dữ liệu postCreateRequest
    const postCreateRequest = {
      userId: userId,
      content: comment,
      visibility: "PUBLIC",
      typePost: "TEXT",
    };
    formData.append("postCreateRequest", JSON.stringify(postCreateRequest));

    // Chuyển Blob URL thành File
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      const file = new File([blob], `image${i}.png`, { type: blob.type });
      formData.append("files", file);
    }

    // Gửi API với Bearer Token
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: TOKEN,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo bài viết:", error);
    throw error;
  }
};

export const updatePost = async (postId: any, comment: any, images: any) => {
  try {
    if (!postId) {
      message.error("❌ Lỗi: Không tìm thấy ID bài viết!");
      return;
    }

    const formData = new FormData();

    const postUpdateRequest = {
      content: comment || "",
      visibility: "PRIVATE",
    };

    formData.append("postUpdateRequest", JSON.stringify(postUpdateRequest));

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        try {
          let file;
          if (images[i].startsWith("blob:")) {
            const response = await fetch(images[i]);
            const blob = await response.blob();
            file = new File([blob], `image${i}.png`, { type: blob.type });
          } else {
            file = images[i];
          }
          formData.append("newFiles", file);
        } catch (error) {
          console.error(`❌ Lỗi tải ảnh ${i + 1}:`, error);
        }
      }
    }

    const response = await axios.put(`${API_BASE_URL}/${postId}`, formData, {
      headers: {
        Authorization: TOKEN,
      },
    });

    message.success("✅ Bài viết đã được cập nhật thành công!");
    return response.data;
  } catch (error) {
    message.error("❌ Lỗi khi cập nhật bài viết!");
    console.error("❌ Chi tiết lỗi:", error);
    throw error;
  }
};

export const deletePostService = async (postId: number) => {
  if (!postId) {
    throw new Error("Không tìm thấy ID bài viết!");
  }

  try {
    const formData = new FormData();
    formData.append("postUpdateRequest", JSON.stringify({ visibility: "DELETE" }));

    const response = await fetch(`http://localhost:9999/api/posts/${postId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Xóa thất bại!");
    }

    return { success: true, message: "Xóa bài viết thành công!" };
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    throw error;
  }
};


// export const createPost = async (postData: { title: string; content: string }) => {
//   try {
//     // Lấy token từ localStorage
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
//     }

//     const response = await axios.post(API_BASE_URL, postData, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     console.error("Lỗi khi tạo bài viết:", error);

//     // Nếu lỗi là 401 hoặc 403, ném lỗi để frontend xử lý
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
//     }

//     throw error;
//   }
// };