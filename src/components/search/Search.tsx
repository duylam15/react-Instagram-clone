import React, { useEffect, useState } from "react";
import { List, Spin, Pagination, Avatar } from "antd"; // Thêm Avatar
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "axios";

// --- Interfaces (giữ nguyên) ---
interface Post {
    postId: number;
    userId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    numberEmotion: number;
    numberComment: number;
    numberShare: number;
    visibility: string;
    typePost: string;
    comments: any[];
    postMedia: any[];
}

interface User {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    isOnline: boolean;
    urlAvatar: string;
    urlBackground: string;
}

interface SearchResult {
    // Giả sử mỗi SearchResult có thể đại diện cho 1 user HOẶC 1 post được tìm thấy
    // Hoặc API trả về một mảng SearchResult[] mà mỗi phần tử có users/posts?
    // Tạm thời giữ nguyên cấu trúc render hiện tại nhưng cải thiện nó.
    // ID duy nhất cho mỗi SearchResult item là cần thiết cho List key
    // Nếu API không trả ID, chúng ta cần tạo hoặc dùng index (không khuyến khích nếu list thay đổi)
    id?: string | number; // Thêm ID nếu có thể
    users: User[];
    posts: Post[];
}


export default function Search() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const { t } = useTranslation();

    // Debounce API call
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            // Reset về trang 1 mỗi khi query thay đổi
            // Điều này tránh trường hợp đang ở trang 5, gõ query mới mà API chỉ có 1 trang
            const pageToFetch = query !== "" && query === sessionStorage.getItem("lastSearchQuery") ? currentPage : 1;
            if (query.trim()) {
                if (pageToFetch !== currentPage) {
                    setCurrentPage(pageToFetch); // Cập nhật state trước khi gọi API nếu cần
                }
                handleSearch(query, pageToFetch, pageSize);
                sessionStorage.setItem("lastSearchQuery", query); // Lưu lại query để so sánh
            } else {
                setResults([]);
                setTotal(0);
                setCurrentPage(1); // Reset trang khi xóa query
                sessionStorage.removeItem("lastSearchQuery");
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [query, currentPage, pageSize]); // Bỏ currentPage, pageSize khỏi dependency của debounce logic chính, chỉ dùng trong effect

    // Effect riêng để gọi search khi page/size thay đổi (và query có giá trị)
    // useEffect(() => {
    //     if (query.trim()) {
    //         handleSearch(query, currentPage, pageSize);
    //     }
    //     // Không cần debounce ở đây
    // }, [currentPage, pageSize]); // Bỏ query vì đã xử lý ở effect trên

    // --- handleSearch (giữ nguyên logic gọi API) ---
    const handleSearch = async (value: string, page: number, size: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:9999/api/search", {
                params: {
                    query: value,
                    page: page,
                    pageSize: size
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
             // Quan trọng: Giả sử API trả về { data: SearchResult[], totalElements: number }
             // Nếu API trả về { data: { users: User[], posts: Post[] }, totalElements: number }
             // thì cần điều chỉnh cách setResults và cấu trúc SearchResult interface
            setResults(response.data.data || []);
            setTotal(response.data.totalElements || 0);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setResults([]);
            setTotal(0);
        }
        setLoading(false);
    };


    // Xử lý thay đổi trang
    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size); // Cập nhật pageSize nếu thay đổi
    };

    // Xóa input
    const handleClear = () => {
        setQuery("");
        // State khác sẽ tự reset trong useEffect của query
    };

    // --- Render User Item ---
    const renderUserItem = (user: User) => (
        <List.Item key={`user-${user.userId}`} className="hover-effect !px-3 !py-2"> {/* Thêm class cho padding/hover */}
            <List.Item.Meta
                avatar={<Avatar src={user.urlAvatar} />}
                title={<div className="font-medium text-[15px]" style={{ color: "var(--text-color)" }}>{user.firstName} {user.lastName}</div>}
                description={<div className="text-sm text-gray-500">@{user.userName}</div>}
            />
        </List.Item>
    );

    // --- Render Post Item ---
    const renderPostItem = (post: Post) => (
        <div key={`post-${post.postId}`} className="border-t pt-3 mt-2 px-3 pb-2 hover-effect"> {/* Thêm key và padding */}
             <div className="text-sm text-gray-500 mb-1">
                 {/* Cân nhắc dùng thư viện như date-fns hoặc moment để format đẹp hơn */}
                 {new Date(post.createdAt).toLocaleDateString()} - {new Date(post.createdAt).toLocaleTimeString()}
             </div>
             <div className="text-[15px] mb-2" style={{ color: "var(--text-color)" }}>
                 {post.content} {/* Có thể cần giới hạn độ dài hoặc xử lý xuống dòng */}
             </div>
             <div className="flex gap-4 text-xs text-gray-500"> {/* Giảm cỡ chữ */}
                 <span>{post.numberEmotion} {t("emotions")}</span>
                 <span>{post.numberComment} {t("comments")}</span>
                 <span>{post.numberShare} {t("shares")}</span>
             </div>
        </div>
    );

    return (
        <div className="w-[400px] relative" style={{ background: "var(--bg-color)" }}>
            <div className="text-[24px] font-medium mt-3 p-3">{t("search")}</div>

            {/* Ô tìm kiếm */}
            <div className="p-3 relative"> {/* Thêm relative để Spin định vị */}
                <input
                    className="custom-input border px-4 py-2 rounded-md focus:outline-none w-full"
                    placeholder={t("search")}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        // setCurrentPage(1); // Reset về trang 1 ngay khi gõ, hoặc để useEffect xử lý
                    }}
                    style={{ borderColor: "var(--white-to-gray)", paddingRight: '35px' }} // Thêm paddingRight để icon không che chữ
                />
                {/* Icon Loading hoặc Clear */}
                <div style={{ position: 'absolute', right: '25px', top: '50%', transform: 'translateY(-50%)', marginTop: '-2px' /* Điều chỉnh nhỏ */ }}>
                    {loading && query ? ( // Chỉ hiển thị loading của input khi đang loading VÀ có query
                         <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} size="small" />
                    ) : query ? (
                         <CloseCircleOutlined
                             onClick={handleClear}
                             style={{ cursor: "pointer", fontSize: 18, color: 'var(--text-color-secondary)' /* Thêm màu */}}
                         />
                     ) : null}
                 </div>
            </div>

            {/* Danh sách kết quả */}
            {/* Chỉ hiển thị khu vực kết quả nếu có query */}
            {query && (
                <div className="absolute w-full rounded-md mt-1 z-10 max-h-[calc(100vh-200px)] overflow-y-auto shadow-lg" // Tăng max-height, thêm shadow
                     style={{ background: "var(--bg-color)", border: '1px solid var(--border-color)' /* Thêm border */ }}>
                    {/* === Cải thiện Loading State cho List === */}
                    {loading ? (
                        <div className="flex justify-center items-center h-[200px]"> {/* Container cho Spin */}
                            <Spin size="large" />
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <List
                                itemLayout="vertical" // Hoặc horizontal tùy ý
                                dataSource={results}
                                // Cung cấp key dựa trên ID của SearchResult nếu có, nếu không dùng index (cẩn thận)
                                renderItem={(item, index) => (
                                    // Quan trọng: Cần có key duy nhất cho mỗi SearchResult item
                                    // Nếu API không trả về ID duy nhất cho SearchResult, dùng index + query làm key tạm thời
                                    <div key={item.id || `${query}-${index}`}>
                                        {/* Render users nếu có */}
                                        {item.users && item.users.length > 0 && (
                                            // Không cần List lồng nữa, trực tiếp render User items
                                            <div>{item.users.map(renderUserItem)}</div>
                                        )}
                                        {/* Render posts nếu có */}
                                        {item.posts && item.posts.length > 0 && (
                                             // Không cần List lồng nữa, trực tiếp render Post items
                                            <div>{item.posts.map(renderPostItem)}</div>
                                        )}
                                    </div>
                                )}
                            />
                            {/* === Cải thiện Pagination === */}
                            {total > pageSize && ( // Chỉ hiển thị pagination nếu tổng số kết quả lớn hơn kích thước trang
                                <div className="sticky bottom-0 p-3 text-center" style={{ background: "var(--bg-color)", borderTop: '1px solid var(--border-color)' }}>
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={total}
                                        onChange={handlePageChange}
                                        showSizeChanger // Giữ lại nếu muốn cho phép đổi pageSize
                                        showQuickJumper // Giữ lại nếu muốn cho phép nhảy trang nhanh
                                        size="small"   // Làm cho pagination nhỏ gọn hơn
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="p-4 text-center text-gray-500">{t("no_results_found")}</p> // Giảm margin top, thêm padding
                    )}
                </div>
            )}
        </div>
    );
}