import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Button, Modal, List, Avatar, Input } from "antd";
import { UserOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { deleteFriend, getListFriends, getListInviteReceived, getListInviteSent, updateInvite } from "../../services/friend/friend";
import { getUserProfile } from "../../services/user/user";
import { useNavigate } from "react-router-dom";

const FriendsMenu = (data: { idProfileDangXem: any  , key : any }) => {

  const idDangNhap = Number(localStorage.getItem("userId"))
  const idProfile = data.idProfileDangXem;
  const [visibleModal, setVisibleModal] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const fetchListInviteSent = async () => {
    try {
      const response = await getListInviteSent({ idProfile: idProfile });
      console.log("danh sach loi moi da gui")
      console.log(response)
      const listInviteSent: any = [];
      await Promise.all(response.data.data.map(async (item: any) => {
        const profile = await getUserProfile({ idUser: item.receiver });
        listInviteSent.push({ id: profile.data.userId, name: profile.data.firstName + " " + profile.data.lastName })
      }))
      console.log("danh sach loi moi da gui : ")
      console.log(listInviteSent);
      setSentRequests(listInviteSent);
    } catch (error) {

    }
  };

  const fetchListInviteReceived = async () => {
    try {
      const response = await getListInviteReceived({ idProfile: idProfile });
      console.log("danh sach loi moi da nhânkj")
      console.log(response)
      const listInviteReceived: any = [];
      await Promise.all(response.data.data.map(async (item: any) => {
        const profile = await getUserProfile({ idUser: item.sender });
        listInviteReceived.push({ id: profile.data.userId, name: profile.data.firstName + " " + profile.data.lastName })
      }))
      console.log("danh sach loi moi da nhânkj : ")
      console.log(listInviteReceived);
      setReceivedRequests(listInviteReceived);
    } catch (error) {

    }
  };

  const fetchListFriends = async () => {
    try {
      const response = await getListFriends({ idProfile: idProfile });
      console.log("danh sach ban be")
      console.log(response)
      const listFriends = [];
      await Promise.all(response.data.data.map(async (item: any) => {
        const profile = await getUserProfile({ idUser: item.friend_id == idProfile ? item.user_id : item.friend_id });
        listFriends.push({ id: profile.data.userId, name: profile.data.firstName + " " + profile.data.lastName })
      }))
      console.log("danh sach ban be : ")
      console.log(listFriends);
      setFriends(listFriends);
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchListFriends();
    fetchListInviteReceived();
    fetchListInviteSent();
    console.log(friends.length + "------------------------------")
  }, []);

  useEffect(() => {
    fetchListFriends();
    fetchListInviteReceived();
    fetchListInviteSent();
    console.log(friends.length + "------------------------------")
  }, [data.idProfileDangXem ]);

  useEffect(() => {
    fetchListFriends();
    fetchListInviteReceived();
    fetchListInviteSent();
    console.log(friends.length + "------------------------------")
  }, [data.idProfileDangXem , data.key]);

  useEffect(() => {
    fetchListFriends();
    console.log(friends.length + "------------------------------")
  }, [loading]);


  const handleMenuClick = ({ key }) => {
    setVisibleModal(key);
  };

  const handleCloseModal = () => {
    setVisibleModal(null);
    setSearchText(""); // Reset tìm kiếm khi đóng modal
    setLoading(!loading);
  };


  const handleType = async (id, type) => {
    console.log("+++++" + id)
    if (type === "list") {
      console.log("xoá")
      try {
        const response = await deleteFriend({ idUser: idProfile, idFriend: id })
        console.log(response);
        setFriends((prevFriends) => prevFriends.filter(friend => friend.id !== id));
      } catch (error) {

      }
    };
    if (type === "sent") {
      console.log("huy yeu cau")
      try {
        const response = await updateInvite({ idSender: idProfile, idReceiver: id, status: "CANCEL" })
        console.log(response);
        setSentRequests((prevSent) => prevSent.filter(request => request.id !== id));
      } catch (error) {

      }
    };
    if (type === "received") {
      console.log("từ chôi")
      try {
        const response = await updateInvite({ idSender: id, idReceiver: idProfile, status: "DENY" })
        console.log(response);
        setReceivedRequests((prevReceived) => prevReceived.filter(request => request.id !== id));
      } catch (error) {

      }
    };
  };

  const handleAccept = async (id) => {
    console.log("dong y")
    try {
      const response = await updateInvite({ idSender: id, idReceiver: idProfile, status: "ACCEPT" })
      console.log(response);
      setReceivedRequests((prevReceived) => prevReceived.filter(request => request.id !== id));
      setLoading(!loading)
    } catch (error) {

    }
  }


  const filterData = (data) =>
    data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="list">Danh sách</Menu.Item>
      {
        idProfile == idDangNhap &&
        <>
          <Menu.Item key="sent">Lời mời đã gửi</Menu.Item>
          <Menu.Item key="received">Lời mời đã nhận</Menu.Item>
        </>
      }
    </Menu>
  );


  const renderModal = (title, data, type) => (
    <Modal
      title={<div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>{title}</div>}
      open={visibleModal === type}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={400}
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
      <div style={{ height  :  "500px", maxHeight: "725px", overflowY: "auto" }}>
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
                    onClick={() => handleType(item.id, type)}
                  >
                    Hủy yêu cầu
                  </Button>
                ) : type === "received" ? (
                  <>
                    <Button
                      type="text"
                      style={{ color: "#1890ff", fontWeight: "bold" }}
                      onClick={() => handleAccept(item.id, type)}
                    >
                      Đồng ý
                    </Button>
                    <Button
                      type="text"
                      style={{ color: "#ff4d4f", fontWeight: "bold" }}
                      onClick={() => handleType(item.id, type)}
                    >
                      Từ chối
                    </Button>
                  </>
                ) : (
                  <Button
                    type="text"
                    style={{ color: "#ff4d4f", fontWeight: "bold" }}
                    onClick={() => handleType(item.id, type)}
                  >
                    Xóa
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                style={{ paddingLeft: "10px" }}
                avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />}
                title={<span
                  style={{ cursor: "pointer" ,  fontWeight: "bold" }}
                  onClick={() => {
                    navigate(`/profile/${item.id}`);
                  }}>{item.name}</span>}
              />
            </List.Item>
          )}
        />
      </div>

    </Modal>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="text">{friends.length} Bạn bè</Button>
      </Dropdown>

      {/* Modals */}
      {renderModal("Danh sách bạn bè", friends, "list")}
      {renderModal("Lời mời đã gửi", sentRequests, "sent")}
      {renderModal("Lời mời đã nhận", receivedRequests, "received")}
    </>
  );
};

export default FriendsMenu;
