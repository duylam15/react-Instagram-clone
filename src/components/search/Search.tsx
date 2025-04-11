import React, { useEffect, useState } from "react";
import { List, Spin, Pagination, Avatar } from "antd"; // Thêm Avatar
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate()
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
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(`/profile/${user.userId}`);
                }}
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
        <div className="w-[400px] h-screen flex flex-col" style={{ background: "var(--bg-color)" }}>
            <div className="text-[24px] font-medium p-3 border-b" style={{ borderColor: "var(--white-to-gray)" }}>{t("search")}</div>

            {/* Ô tìm kiếm */}
            <div className="p-3 relative sticky top-0 z-20" style={{ background: "var(--bg-color)" }}>
                <input
                    className="custom-input border px-4 py-2 rounded-md focus:outline-none w-full"
                    placeholder={t("search")}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                    style={{ borderColor: "var(--white-to-gray)", paddingRight: '35px' }}
                />
                {/* Icon Loading hoặc Clear */}
                <div style={{ position: 'absolute', right: '25px', top: '50%', transform: 'translateY(-50%)' }}>
                    {loading && query ? (
                         <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />} size="small" />
                    ) : query ? (
                         <CloseCircleOutlined
                             onClick={handleClear}
                             style={{ cursor: "pointer", fontSize: 18, color: 'var(--text-color-secondary)' }}
                             onPointerEnterCapture={() => {}}
                             onPointerLeaveCapture={() => {}}
                         />
                     ) : null}
                 </div>
            </div>

            {/* Danh sách kết quả */}
            <div className="flex-1 overflow-y-auto">
                {query ? (
                    <div className="h-full" style={{ background: "var(--bg-color)" }}>
                        {loading ? (
                            <div className="flex justify-center items-center h-[200px]">
                                <Spin size="large" />
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                <List
                                    className="search-results-list"
                                    itemLayout="vertical"
                                    dataSource={results}
                                    renderItem={(item, index) => (
                                        <div key={item.id || `${query}-${index}`}>
                                            {item.users && item.users.length > 0 && (
                                                <div>
                                                    {item.users.map(user => (
                                                        <div 
                                                            key={`user-${user.userId}`} 
                                                            className="hover-effect !px-3 !py-2 cursor-pointer"
                                                            onClick={() => navigate(`/profile/${user.userId}`)}
                                                        >
                                                            <List.Item.Meta
                                                                avatar={<Avatar src={user.urlAvatar} />}
                                                                title={<div className="font-medium text-[15px]" style={{ color: "var(--text-color)" }}>{user.firstName} {user.lastName}</div>}
                                                                description={<div className="text-sm text-gray-500">@{user.userName}</div>}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {item.posts && item.posts.length > 0 && (
                                                <div>{item.posts.map(renderPostItem)}</div>
                                            )}
                                        </div>
                                    )}
                                />
                                {total > pageSize && (
                                    <div className="sticky bottom-0 p-2 border-t flex justify-between items-center" style={{ background: "var(--bg-color)", borderColor: "var(--white-to-gray)" }}>
                                        <span className="text-xs text-gray-500 w-[25%]">
                                            {Math.min((currentPage - 1) * pageSize + 1, total)}-
                                            {Math.min(currentPage * pageSize, total)} / {total}
                                        </span>
                                        <Pagination
                                            className="flex-1 flex justify-end"
                                            current={currentPage}
                                            total={total}
                                            pageSize={pageSize}
                                            onChange={(page) => {
                                                setCurrentPage(page);
                                                handleSearch(query, page, pageSize);
                                            }}
                                            size="small"
                                            showSizeChanger={false}
                                            showQuickJumper={false}
                                            showTotal={() => null}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-[200px] text-gray-500">
                                {t("no_results_found")}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        {t("enter_search_term")}
                    </div>
                )}
            </div>
        </div>
    );
}