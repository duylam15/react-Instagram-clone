import React, { useState } from 'react';
import axios from 'axios';
import './ImageCaptionUploader.css';

const ImageCaptionUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:9999/api/api/geminiGenImage/generate-caption', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaption(response.data);
    } catch (error) {
      console.error('Error uploading file', error);
      setCaption('Lỗi khi tải hình ảnh lên.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFile(null);
    setCaption('');
  };

  return (
    <div>
      <button onClick={toggleModal} className="tooltip-button">
        Nhấn để tải hình
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chọn hình ảnh để tải lên</h2>
            {/* Input type="file" sẽ hiển thị khi modal mở */}
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isLoading || !file}>
              {isLoading ? 'Đang tải...' : 'Tải lên'}
            </button>
            <button onClick={toggleModal}>Đóng</button>

            {caption && <div className="caption-display">{caption}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCaptionUploader;
