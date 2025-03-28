import React, { useEffect, useState } from "react";
import {
  CCard, CCardHeader, CCardBody, CCol, CRow, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CButton, CPaginationItem, CPagination,
  CFormInput, CModal, CModalHeader, CModalBody, CModalFooter, CFormTextarea
} from "@coreui/react";
import { getListPost, updatePost } from "../../services/post_admin/post_admin"; // Import API
import AlertMessage from "../../components/Notifications/alertMessage";
import { Button, Carousel, Checkbox, message, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

type PostType = {
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberEmotion: number;
  numberComment: number;
  numberShare: number;
  postMedia: { postMediaId: number; mediaUrl: string; mediaType: "IMAGE" | "VIDEO" }[];
  visibility: "PUBLIC" | "PRIVATE" | "FRIENDS";
  typePost: "TEXT" | "NON_TEXT" | "MIX";
};

const Post = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "danger"; key: number } | null>(null);
  // Modal chỉnh sửa
  const [editModal, setEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [editedContent, setEditedContent] = useState(selectedPost?.content || "");
  const [visibility, setVisibility] = useState(selectedPost?.visibility || "PUBLIC");
  const [newFiles, setNewFiles] = useState([]);
  const [removeOldMedia, setRemoveOldMedia] = useState(false);

  // Hàm hiển thị thông báo
  const showAlert = (message: string, severity: "success" | "danger") => {
    setAlert({ message, severity, key: Date.now() });
    setTimeout(() => setAlert(null), 3000);
  };

  // Fetch bài post
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getListPost({ page: currentPage, size: pageSize, searchTerm });
        setPosts(response.data.data);
        setTotalPages(response.data.totalPage);
      } catch (err) {
        showAlert("Không thể tải danh sách bài post", "danger");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchPosts, 500); // Chỉ fetch sau 500ms khi nhập tìm kiếm
    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm, editModal]);

  // Hàm mở modal sửa bài post
  const handleEdit = (post: PostType) => {
    console.log("Edit post hhhh:", post);
    setSelectedPost(post);
    setEditedContent(post.content);
    setEditModal(true);
  };

  // Xử lý khi chọn file mới
  const handleFileChange = ({ fileList }) => {
    console.log(fileList)
    console.log(newFiles)
    setNewFiles(fileList.map(file => file.originFileObj));
  };

  const handleUpdatePost = async () => {
    if (!selectedPost?.postId) {
      message.error("Không tìm thấy bài post để cập nhật!");
      return;
    }

    setLoading(true);

    try {
      const result = await updatePost(
        selectedPost.postId,
        editedContent,
        visibility,
        removeOldMedia,
        newFiles || [] // Đảm bảo newFiles là mảng
      );

      if (result.success) {
        message.success("Cập nhật bài post thành công!");
        setEditModal(false);
      } else {
        message.error(result.error);
      }
    } finally {
      setLoading(false); // Đảm bảo set lại loading dù thành công hay thất bại
    }
  };


  return (
    <>
      {alert && <AlertMessage message={alert.message} severity={alert.severity} />}

      {/* Modal chỉnh sửa */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader>Chỉnh sửa bài post</CModalHeader>
        <CModalBody>
          {/* Hiển thị media nếu có */}
          {selectedPost?.postMedia?.length > 0 && (
            <Carousel autoplay dots arrows>
              {selectedPost?.postMedia.map((media) => (
                <div key={media.postMediaId} className="mb-2 text-center flex justify-center">
                  {media.mediaType === "IMAGE" ? (
                    <img
                      src={media.mediaUrl}
                      alt="Hình ảnh bài post"
                      style={{ maxWidth: "100%", borderRadius: "10px", display: "flex", justifyContent: "center", justifyItems: "center", margin: "0 auto" }}
                    />
                  ) : (
                    <video
                      controls
                      style={{ maxWidth: "100%", borderRadius: "10px" }}
                    >
                      <source src={media.mediaUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  )}
                </div>
              ))}
            </Carousel>
          )}

          {/* Ô nhập nội dung bài viết */}
          <CFormTextarea
            rows={4}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />

          {/* Chọn chế độ hiển thị */}
          <Select
            value={visibility}
            onChange={setVisibility}
            style={{ width: "100%", marginTop: 10 }}
            getPopupContainer={trigger => trigger.parentNode} // Fix popup bị ẩn
          >
            <Select.Option value="PUBLIC">Công khai</Select.Option>
            <Select.Option value="PRIVATE">Riêng tư</Select.Option>
          </Select>

          {/* Upload media mới */}
          <div style={{ marginTop: 10 }}>
            <Upload multiple beforeUpload={() => false} onChange={handleFileChange} showUploadList>
              <Button
                type="primary"
                icon={<UploadOutlined style={{ fontSize: "16px", color: "white" }} />}
              >
                Thêm hình ảnh/video
              </Button>
            </Upload>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            {/* Checkbox xóa media cũ */}
            <Checkbox checked={removeOldMedia} onChange={(e) => setRemoveOldMedia(e.target.checked)}>
              Xóa toàn bộ hình ảnh/video cũ
            </Checkbox>
          </div>



        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>Hủy</CButton>
          <CButton
            color="primary"
            onClick={handleUpdatePost}
            disabled={!editedContent.trim() && newFiles.length === 0} // Không cho bấm nếu nội dung trống và không có file
          >
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Danh Sách Bài Post</strong>
              <CFormInput
                type="text"
                placeholder="🔍 Tìm kiếm bài post..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "250px" }}
              />
            </CCardHeader>
            <CCardBody>
              <CTable bordered striped hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Nội dung</CTableHeaderCell>
                    <CTableHeaderCell>Emotion</CTableHeaderCell>
                    <CTableHeaderCell>Comment</CTableHeaderCell>
                    <CTableHeaderCell>Share</CTableHeaderCell>
                    <CTableHeaderCell>Chế độ</CTableHeaderCell>
                    <CTableHeaderCell>Hành động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {posts.map((post) => (
                    <CTableRow key={post.postId}>
                      <CTableDataCell>{post.postId}</CTableDataCell>
                      <CTableDataCell>{post.content}</CTableDataCell>
                      <CTableDataCell>{post.numberEmotion}</CTableDataCell>
                      <CTableDataCell>{post.numberComment}</CTableDataCell>
                      <CTableDataCell>{post.numberShare}</CTableDataCell>
                      <CTableDataCell>{post.visibility}</CTableDataCell>
                      <CTableDataCell>
                        <div style={{ display: "flex", gap: 5 }} onClick={() => handleEdit(post)}>
                          <CButton color="primary" size="sm" className="me-2">
                            Xem
                          </CButton>
                          <CButton color="warning" size="sm" onClick={() => handleEdit(post)}>
                            Sửa
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CPagination align="end">
                <CPaginationItem disabled={currentPage === 0} onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}>
                  Trước
                </CPaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <CPaginationItem key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                    {i + 1}
                  </CPaginationItem>
                ))}

                <CPaginationItem disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}>
                  Sau
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Post;