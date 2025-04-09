import { Button } from "antd";
import { useEffect, useState } from "react";
import { checkFriend, checkSent, createInvite, deleteFriend, updateInvite } from "../../services/friend/friend";

const FriendButton = (data: { idUser1: number, idUser2: number }) => {

  const [loading, setLoading] = useState(false)
  const [textButton, setTextButton] = useState("")
  const [textButton1, setTextButton1] = useState("Đồng ý")
  const statusButton = { xoaban: "Xoá ban", themban: "Thêm bạn", huyloimoi: "Huỷ lời mời", tuchoi: "Từ chối" }

  // kiểm tra coi cả 2 có phải bạn không ? 
  // có  =>  textButton = xoá bạn
  // không =>  kiểm tra xem 1 trong 2 đã gửi lời mởi kết bạn chưa
  // rồi =>  user1 là user_id => textButton = huỷ hoặc user1 = receiver_id => textButton =  từ chối
  // chưa => textButton = thêm bạn 


  const ChekcSent = async () => {
    try {
      const response = await checkSent(data);
      console.log("check sent")
      console.log(response);
      if (response.data.isSent) {
        if (response.data.data.sender == data.idUser1)
          setTextButton(statusButton.huyloimoi)
        else if (response.data.data.sender == data.idUser2)
          setTextButton(statusButton.tuchoi)
      }
      else {
        setTextButton(statusButton.themban)
      }
    } catch (error) {

    }
  }

  const ChekcFriend = async () => {
    try {
      const response = await checkFriend(data);
      console.log("check friend")
      console.log(response);
      if (response.data.isFriend)
        setTextButton(statusButton.xoaban)
      else
        ChekcSent();
    } catch (error) {

    }
  }

  const DeleteFriend = async () => {
    try {
      const response = await deleteFriend({ idUser: data.idUser1, idFriend: data.idUser2 })
      console.log(response);
      setLoading(!loading)
    } catch (error) {

    }
  }

  const CreateInvite = async (status: string) => {
    try {
      const response = await createInvite({ idSender: data.idUser1, idReceiver: data.idUser2, status: status })
      console.log(response);
      setLoading(!loading)
    } catch (error) {

    }
  }

  const UpdateInvite = async (data: { idUser1: number, idUser2: number, status: string }) => {
    try {
      const response = await updateInvite({ idSender: data.idUser1, idReceiver: data.idUser2, status: data.status })
      console.log(response);
      setLoading(!loading)
    } catch (error) {

    }
  }

  useEffect(() => {
    ChekcFriend();
  }, [loading , data.idUser1 , data.idUser2])

  const handleClick = () => {



    // Gửi yêu cầu thêm bạn
    console.log(textButton + " : " + data.idUser1 + " to " + data.idUser2)
    // so sánh với textButton để thực hiện nhiệm vụ
    if (textButton == statusButton.xoaban) {
      DeleteFriend();
    }
    if (textButton == statusButton.themban) {
      CreateInvite("SENT")
    }
    if (textButton == statusButton.tuchoi) {
      UpdateInvite({ idUser1: data.idUser2, idUser2: data.idUser1, status: "DENY" })
    }
    if (textButton == statusButton.huyloimoi) {
      UpdateInvite({ idUser1: data.idUser1, idUser2: data.idUser2, status: "CANCEL" })
    }
  };

  const handleClickAccept = () => {
    UpdateInvite({ idUser1: data.idUser2, idUser2: data.idUser1, status: "ACCEPT" });
  }

  return (
    <>
      {textButton == statusButton.tuchoi &&
        <Button type="primary" onClick={handleClickAccept}>
          {textButton1}
        </Button>
      }
      <Button type="primary" onClick={handleClick}>
        {textButton}
      </Button>
    </>
  );
};

export default FriendButton;

