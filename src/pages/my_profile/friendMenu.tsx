import React, { useState } from "react";
import { Dropdown, Menu, Button, Modal, List, Avatar, Input } from "antd";
import { UserOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

const FriendsMenu = () => {
  const [visibleModal, setVisibleModal] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Dữ liệu mẫu
  const [friends, setFriends] = useState([
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Văn C" }
  ]);

  const [sentRequests, setSentRequests] = useState([
    { id: 4, name: "Phạm Thị D" },
    { id: 5, name: "Hoàng Văn E" }
  ]);

  const [receivedRequests, setReceivedRequests] = useState([
    { id: 6, name: "Lý Văn F" },
    { id: 7, name: "Đặng Thị G" }
  ]);

  const handleMenuClick = ({ key }) => {
    setVisibleModal(key);
  };

  const handleCloseModal = () => {
    setVisibleModal(null);
    setSearchText(""); // Reset tìm kiếm khi đóng modal
  };

  const handleDelete = (id, type) => {
    if (type === "friends") setFriends(friends.filter(friend => friend.id !== id));
    if (type === "sent") setSentRequests(sentRequests.filter(req => req.id !== id));
    if (type === "received") setReceivedRequests(receivedRequests.filter(req => req.id !== id));
  };

  const filterData = (data) =>
    data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="list">Danh sách</Menu.Item>
      <Menu.Item key="sent">Lời mời đã gửi</Menu.Item>
      <Menu.Item key="received">Lời mời đã nhận</Menu.Item>
    </Menu>
  );

  const renderModal = (title, data, type) => (
    <Modal
      title={<div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>{title}</div>}
      open={visibleModal === type}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={320}
    >
      {/* Ô tìm kiếm */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "280px",
            borderRadius: "20px",
            padding: "8px 12px",
            border: "1px solid #d9d9d9",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1890ff")}
          onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
        />
      </div>
  
      {/* Danh sách */}
      <List
        dataSource={filterData(data)}
        locale={{ emptyText: "Không tìm thấy kết quả" }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              type === "sent" ? (
                <Button
                  type="text"
                  style={{ color: "#1890ff", fontWeight: "bold" }}
                  onClick={() => handleDelete(item.id, type)}
                >
                  Hủy yêu cầu
                </Button>
              ) : type === "received" ? (
                <Button
                  type="text"
                  style={{ color: "#ff4d4f", fontWeight: "bold" }}
                  onClick={() => handleDelete(item.id, type)}
                >
                  Từ chối
                </Button>
              ) : (
                <Button
                  type="text"
                  style={{ color: "#ff4d4f", fontWeight: "bold" }}
                  onClick={() => handleDelete(item.id, type)}
                >
                  Xóa
                </Button>
              )
            ]}
          >
            <List.Item.Meta
              style={{ paddingLeft: "10px" }}
              avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />}
              title={<span style={{ fontWeight: "bold" }}>{item.name}</span>}
            />
          </List.Item>
        )}
      />
    </Modal>
  );  

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="text">20 Bạn bè</Button>
      </Dropdown>

      {/* Modals */}
      {renderModal("Danh sách bạn bè", friends, "list")}
      {renderModal("Lời mời đã gửi", sentRequests, "sent")}
      {renderModal("Lời mời đã nhận", receivedRequests, "received")}
    </>
  );
};

export default FriendsMenu;
