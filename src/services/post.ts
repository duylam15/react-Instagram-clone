import axios from "axios";

const API_BASE_URL = "http://localhost:9999/api/posts";

export const getPosts = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }

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

export const getww = async () => {
  try {
    const response = await axios.get("http://localhost:9999/api/auth/welcome");
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu welcome:", error);
    throw error;
  }
};

export const createPost = async (postData: { title: string; content: string }) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }

    const response = await axios.post(API_BASE_URL, postData, {
      headers: {
        Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi tạo bài viết:", error);

    // Nếu lỗi là 401 hoặc 403, ném lỗi để frontend xử lý
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};