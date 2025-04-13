import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onClose: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("avatar", file); // Đảm bảo bạn đang gửi đúng tệp ảnh

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:9999/api/api/users/avatar/${localStorage.getItem("userId")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.data?.data?.urlAvatar) {
        onUploadSuccess(response.data.data.urlAvatar); // Gọi hàm callback với URL ảnh mới
        onSuccess("Upload thành công");

        onClose(); // Đóng popup sau khi tải ảnh thành công
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật avatar:", error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload
      customRequest={handleUpload} // Sử dụng customRequest để xử lý upload file
      showUploadList={false}
      accept="image/png, image/jpeg, image/jpg" // Chỉ chấp nhận file hình ảnh
    >
      <Button
        type="text"
        className="custom-btn upload-btn text-blue-600 font-medium text-base w-full my-2"
        icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>}
        loading={loading}
      >
        Tải ảnh lên
      </Button>
    </Upload>
  );
};

export default ImageUploader;
