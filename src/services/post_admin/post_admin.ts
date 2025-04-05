import axios from '../../configs/axiosConfigAdmin'


const API_URL_BASE = "http://localhost:9999"

export const getListPost = async (data : {page : number , size : number, searchTerm: string}) => {
    try {
        console.log(data)
        const response = await axios.get(
            `${API_URL_BASE}/api/posts?page=${data.page}&size=${data.size}&search=${data.searchTerm}`
        );
        console.log("Dữ liệu nhận được list post:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const updatePost = async (
    postId: number,
    editedContent: string,
    visibility: any, // Nên thay bằng enum nếu có
    removeOldMedia: boolean,
    newFiles: File[] = []
) => {
    if (!editedContent.trim()) {
        return { success: false, error: "Nội dung bài viết không được để trống!" };
    }

    const formData = new FormData();
    const postUpdateRequest = JSON.stringify({ content: editedContent, visibility, removeOldMedia });

    console.log("postUpdateRequest JSON:", postUpdateRequest);

    // Sử dụng chuỗi JSON thay vì Blob
    formData.append("postUpdateRequest", postUpdateRequest);

    if (newFiles.length > 0) {
        newFiles.forEach((file) => {
            if (file instanceof File) {  // Chỉ thêm nếu là File
                formData.append("newFiles", file);
            } else {
                console.error("Lỗi: newFiles chứa phần tử không phải File!", file);
            }
        });
    }

    console.log("FormData keys:", [...formData.keys()]);
    console.log("FormData values:", [...formData.entries()]);

    try {
       
        const response = await axios.put(
            `${API_URL_BASE}/api/posts/${postId}`,
            formData,
            { 
              headers: { 
                "Content-Type": "multipart/form-data" 
              } 
            }
          );
        console.log("Response:", response);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log("Error:", error);
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật bài post!";
        return { success: false, error: errorMessage };
    }
};