import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CPaginationItem,
  CPagination,
  CFormInput,
} from "@coreui/react";
import { getListPost } from "../../services/post_admin/post_admin";
import AlertMessage from "../../components/Notifications/alertMessage";

type PostType = {
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberEmotion: number;
  numberComment: number;
  numberShare: number;
  visibility: "PUBLIC" | "PRIVATE" | "FRIENDS";
  typePost: "TEXT" | "NON_TEXT" | "MIX";
  comments: [];
  postMedia: [];
};

const Post = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // bắt đầu từ 0
  const [totalPages, setTotalPages] = useState(1);
  const [totalPost, setTotalPost] = useState(0);
  const pageSize = 10;
  const [alert, setAlert] = useState<{
    message: string;
    severity: "success" | "warning" | "info" | "danger";
    key: number;
  } | null>(null);

  const showAlert = (message: string, severity: "success" | "warning" | "info" | "danger") => {
    setAlert({ message, severity, key: Date.now() });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = { page: currentPage, size: pageSize };
        const response = await getListPost(data);
        const resData = response.data;

        setPosts(resData.data);
        setTotalPages(resData.totalPage);
        setTotalPost(resData.totalElements);
        setCurrentPage(resData.currentPage); // đồng bộ lại nếu backend có xử lý gì
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu bài post:", err);
        showAlert("Không thể tải danh sách bài post", "danger");
      }
    };
    fetchPosts();
  }, [currentPage, loading]);

  const maxPageButtons = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;
  if (endPage >= totalPages) {
    endPage = totalPages - 1;
    startPage = Math.max(0, endPage - maxPageButtons + 1);
  }

  return (
    <>
      {alert && <AlertMessage message={alert.message} severity={alert.severity} />}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong className="fs-5">Danh Sách Bài Post</strong>
              <div className="d-flex align-items-center gap-3">
                <CFormInput
                  type="text"
                  placeholder="🔍 Tìm kiếm bài post..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "250px" }}
                />
                <CButton color="success" className="px-4">
                  + Thêm Bài Post
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable bordered striped hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Nội dung</CTableHeaderCell>
                    <CTableHeaderCell>Số lượng emotion</CTableHeaderCell>
                    <CTableHeaderCell>Số lượng comment</CTableHeaderCell>
                    <CTableHeaderCell>Số lượng share</CTableHeaderCell>
                    <CTableHeaderCell>Chế độ hiển thị</CTableHeaderCell>
                    <CTableHeaderCell>Hành Động</CTableHeaderCell>
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
                        <CButton color="primary" size="sm" className="me-2">
                          Xem
                        </CButton>
                        <CButton color="warning" size="sm">
                          Sửa
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Hiển thị {posts.length} / {totalPost} bài post</span>
                <CPagination align="end">
                  <CPaginationItem
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  >
                    Trước
                  </CPaginationItem>

                  {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                    const page = startPage + index;
                    return (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page + 1}
                      </CPaginationItem>
                    );
                  })}

                  <CPaginationItem
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  >
                    Sau
                  </CPaginationItem>
                </CPagination>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Post;