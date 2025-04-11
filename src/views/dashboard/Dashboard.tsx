import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import { Card, Select, Spin, DatePicker, Button, Table, message, Space, Typography } from 'antd';
import './Thongke.scss';
import { } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const { Option } = Select;
import { Pie } from '@ant-design/plots';
import { Column } from '@ant-design/plots'; // OK
import VisibilityPieChart from "./VisibilityPieChart";
import { User, FileText, Heart, Wifi } from 'lucide-react';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

// Interface cho TopPostResponseDTO
interface TopPostResponseDTO {
  postId: number;
  content: string;
  userFirstName: string;
  userLastName: string;
  createdAt: string;
  numberEmotion: number;
  numberComment: number;
  numberShare: number;
  totalInteraction: number;
}

const Dashboard = () => {
  // State cho thống kê người dùng mới
  const [userTimeFrame, setUserTimeFrame] = useState('monthly');
  const [userViewType, setUserViewType] = useState('Chart');
  const [growthData, setGrowthData] = useState<{ time: string; value: number }[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // State cho thống kê top 5 bài đăng
  const [postTimeFrame, setPostTimeFrame] = useState('monthly');
  const [week, setWeek] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [topPosts, setTopPosts] = useState<TopPostResponseDTO[]>([]);
  const [postLoading, setPostLoading] = useState(false);

  const [visibilityStats, setVisibilityStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [topUserStats, setTopUserStats] = useState([]);
  const [limit, setLimit] = useState(5);


  console.log("visibilityStats", visibilityStats)
  console.log("userStats", userStats)
  console.log("topUserStats", topUserStats)

  const [dates, setDates] = useState([]);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!dates || dates.length !== 2) {
      message.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    const [start, end] = dates;
    const startDate = dayjs(start).format("YYYY-MM-DD");
    const endDate = dayjs(end).format("YYYY-MM-DD");

    setLoading(true);
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `http://localhost:9999/api/api/users/users/count?start=${startDate}&end=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data.users);
      setCount(response.data.data.count);
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu thống kê");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, [limit]);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [res1, res2, res3] = await Promise.all([
        axios.get('http://localhost:9999/api/posts/visibility'),
        axios.get('http://localhost:9999/api/posts/by-user'),
        axios.get(`http://localhost:9999/api/posts/top-users?limit=${limit}`),
      ]);
      setVisibilityStats(res1?.data);
      setUserStats(res2?.data);
      setTopUserStats(res3?.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };



  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ và tên",
      key: "fullName",
      render: (_: any, record: any) => `${record.firstName || ""} ${record.lastName || ""}`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const [postDateRange, setPostDateRange] = useState<any>([]);
  const [postList, setPostList] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);

  console.log("postListpostListpostList", postList)

  const [activeUserCount, setActiveUserCount] = useState()
  const [userCount, setUserCount] = useState()
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9999/api/api/users/getdsusers?page=0&size=1000", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allUsers = res?.data?.data;
        setUserCount(allUsers?.length)
        const activeUsers = allUsers.filter((user: any) => user?.isOnline === true);
        setActiveUserCount(activeUsers?.length);
      } catch (error) {
        console.error("Lỗi khi lấy người dùng đang hoạt động:", error);
      }
    };
    fetchActiveUsers();
  }, []);
  const handlePostStats = async () => {
    if (!postDateRange || postDateRange.length !== 2) {
      message.error('Vui lòng chọn khoảng thời gian');
      return;
    }

    const [start, end] = postDateRange;
    const startDate = dayjs(start).format("YYYY-MM-DD");
    const endDate = dayjs(end).format("YYYY-MM-DD");
    const token = localStorage.getItem("token")
    setPostLoading(true);
    try {
      const response = await axios.get('http://localhost:9999/api/posts/stats', {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      setPostList(response?.data?.posts);
      setTotalPostCount(response?.data?.count);
    } catch (error) {
      message.error('Lỗi khi lấy thống kê bài viết');
    } finally {
      setPostLoading(false);
    }
  };

  const [interactionCount, setInteractionCount] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchTotalInteractionsAndPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9999/api/posts?page=0&size=1000", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const posts = res?.data?.data?.data; // Nested data
        console.log("resresresxx", posts);

        // Tổng số bài viết
        setTotalPosts(posts.length);

        // Tổng tương tác
        const totalInteractions = posts.reduce((sum: number, post: any) => {
          return sum + (post?.numberEmotion || 0) + (post?.numberComment || 0) + (post?.numberShare || 0);
        }, 0);

        setInteractionCount(totalInteractions);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng tương tác và bài viết:", error);
      }
    };

    fetchTotalInteractionsAndPosts();
  }, []);


  console.log("postListpostList", postList)

  const postColumns = [
    {
      title: 'ID',
      dataIndex: 'postId',
      key: 'postId',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => <span>{text?.slice(0, 100)}</span>,
    },
    {
      title: 'Cảm xúc',
      dataIndex: 'numberEmotion',
      key: 'numberEmotion',
      sorter: (a: any, b: any) => (a.numberEmotion ?? 0) - (b.numberEmotion ?? 0),
      render: (value: number) => value ?? 0,
    },
    {
      title: 'Bình luận',
      dataIndex: 'numberComment',
      key: 'numberComment',
      sorter: (a: any, b: any) => (a.numberComment ?? 0) - (b.numberComment ?? 0),
      render: (value: number) => value ?? 0,
    },
    {
      title: 'Người đăng',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => {
        const fullName = `${user?.lastName || ''} ${user?.firstName || ''}`.trim();
        return fullName || user?.userName || 'N/A';
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Chế độ hiển thị',
      dataIndex: 'visibility',
      key: 'visibility',
      filters: [
        { text: 'Công khai', value: 'PUBLIC' },
        { text: 'Riêng tư', value: 'PRIVATE' },
      ],
      onFilter: (value: any, record: any) => record.visibility === value,
      render: (value: string) => {
        switch (value) {
          case 'PUBLIC':
            return 'Công khai';
          case 'PRIVATE':
            return 'Riêng tư';
          default:
            return value;
        }
      },
    },
  ];


  return (
    <div className="dashboard-container">
      <h1 className="flex items-start">Trang Thống Kê</h1>
      <div className='flex justify-between items-center w-full mb-10 text-black'>
        <Card className='card blue w-[220px] text-black' title='Số lượng người dùng' bordered>
          <div className='card-wrap'>
            <div>{userCount}</div>
            <User />
          </div>
        </Card>
        <Card className='card orange  w-[220px] text-black' title='Số lượng bài viết' bordered>
          <div className='card-wrap'>
            <div>{totalPosts}</div>
            <FileText />
          </div>
        </Card>
        <Card className='card pink  w-[220px] text-black' title='Số lượng tương tác' bordered>
          <div className='card-wrap'>
            <div>{interactionCount}</div>
            <Heart />
          </div>
        </Card>
        <Card className='card green  w-[220px] text-black' title='Số lượng người online' bordered>
          <div className='card-wrap'>
            <div> {activeUserCount}</div>
            <Wifi />
          </div>
        </Card>
      </div>
      <div style={{ padding: 24 }} className="bg-[#f0f0f0] mb-10 rounded-xl">
        <Title level={3}>Thống kê người dùng mới</Title>
        <Space style={{ marginBottom: 16 }}>
          <RangePicker onChange={(dates: any) => setDates(dates)} />
          <div className="mt-[-10px]">
            <Button type="primary" onClick={fetchStats} loading={loading}>
              Thống kê
            </Button>
          </div>
        </Space>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Tổng số người dùng: </Text>
          <Text>{count}</Text>
        </div>

        <Table
          rowKey="userId"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            pageSize: 10,
            className: "custom-pagination"
          }}
        />

      </div>

      <div style={{ padding: 24 }} className="bg-[#f0f0f0] mb-10 rounded-xl">
        <Title level={3}>Thống kê bài viết</Title>
        <Space style={{ marginBottom: 16 }}>
          <RangePicker value={postDateRange} onChange={setPostDateRange} />
          <Button type="primary" onClick={handlePostStats}>
            Thống kê
          </Button>
        </Space>

        <div style={{ marginBottom: 16 }}>
          <strong>Tổng số bài viết:</strong> {totalPostCount}
        </div>

        <Table
          columns={postColumns}
          dataSource={postList}
          rowKey="postId"
          loading={postLoading}
          pagination={{
            pageSize: 10,
            className: "custom-pagination"
          }}
        />
      </div>
      <div className=" ">
        <VisibilityPieChart data={visibilityStats} />
      </div>

      <Card
        title="Bảng xếp hạng người đăng nhiều bài nhất"
        style={{ marginTop: 24 }}
      >
        <Table
          dataSource={topUserStats.map(([username, count]: any, index) => ({
            key: username,
            rank: index + 1,
            username,
            postCount: count,
          }))}
          columns={[
            {
              title: 'Hạng',
              dataIndex: 'rank',
              key: 'rank',
              render: (rank: number) => {
                let color = '';
                let icon = '';

                switch (rank) {
                  case 1:
                    color = '#FFD700'; // vàng
                    icon = '🥇';
                    break;
                  case 2:
                    color = '#C0C0C0'; // bạc
                    icon = '🥈';
                    break;
                  case 3:
                    color = '#CD7F32'; // đồng
                    icon = '🥉';
                    break;
                  default:
                    color = '#888'; // xám cho các hạng còn lại
                    break;
                }

                return (
                  <span style={{ color, fontWeight: 'bold' }}>
                    {icon} #{rank}
                  </span>
                );
              },
            },
            {
              title: 'Tên người dùng',
              dataIndex: 'username',
              key: 'username',
            },
            {
              title: 'Số bài đăng',
              dataIndex: 'postCount',
              key: 'postCount',
            },
          ]}
          pagination={false}
          bordered
        />
      </Card>

    </div>
  );
};

export default Dashboard;