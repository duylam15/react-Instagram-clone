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
  const [postViewType, setPostViewType] = useState('Chart');
  const [topPosts, setTopPosts] = useState<TopPostResponseDTO[]>([]);
  const [postLoading, setPostLoading] = useState(false);

  // Tạo danh sách năm, tuần, tháng
  const yearList = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const weekList = Array.from({ length: 53 }, (_, i) => i + 1);
  const monthList = Array.from({ length: 12 }, (_, i) => i + 1);

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

  // Fetch dữ liệu người dùng mới
  useEffect(() => {
    const fetchGrowthData = async () => {
      setUserLoading(true);
      try {
        const endpoint = `http://localhost:9999/api/users/statistics/${userTimeFrame}`;
        const response = await axios.get(endpoint);
        if (response.data.statusCode === 204) {
          setGrowthData([]);
        } else {
          const formattedData = response.data.data.map((item: any) => ({
            time: userTimeFrame === 'daily'
              ? item.date
              : userTimeFrame === 'weekly'
                ? `Tuần ${item.week}, ${item.year}`
                : userTimeFrame === 'monthly'
                  ? `${item.month}/${item.year}`
                  : item.year,
            value: item.count,
          }));
          setGrowthData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching user statistics:', error);
        setGrowthData([]);
      } finally {
        setUserLoading(false);
      }
    };

    fetchGrowthData();
  }, [userTimeFrame]);

  // Fetch dữ liệu top 5 bài đăng
  useEffect(() => {
    const fetchTopPosts = async () => {
      setPostLoading(true);
      try {
        let endpoint = `http://localhost:9999/api/posts/statistics/top-interaction-by-timeframe?timeFrame=${postTimeFrame}`;
        if (postTimeFrame === 'weekly' && week !== null) {
          endpoint += `&week=${week}&year=${year}`;
        } else if (postTimeFrame === 'monthly' && month !== null) {
          endpoint += `&month=${month}&year=${year}`;
        } else if (postTimeFrame === 'yearly') {
          endpoint += `&year=${year}`;
        }
        const response = await axios.get(endpoint);
        if (response.data.statusCode === 204) {
          setTopPosts([]);
        } else {
          setTopPosts(response.data.data.slice(0, 5)); // Chỉ lấy top 3
        }
      } catch (error) {
        console.error('Error fetching top posts:', error);
        setTopPosts([]);
      } finally {
        setPostLoading(false);
      }
    };

    if (
      (postTimeFrame === 'weekly' && week !== null) ||
      (postTimeFrame === 'monthly' && month !== null) ||
      postTimeFrame === 'yearly'
    ) {
      fetchTopPosts();
    } else {
      setTopPosts([]);
    }
  }, [postTimeFrame, week, month, year]);

  // Biểu đồ đường cho thống kê người dùng mới
  const growthRateChart = (
    <CChartLine
      data={{
        labels: growthData.map(item => item.time),
        datasets: [
          {
            label: 'Số lượng người dùng mới',
            data: growthData.map(item => item.value),
            borderColor: 'hsl(217, 100%, 50%)',
            fill: true,
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
          },
        ],
      }}
      options={{
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: 'Thời gian' } },
          y: { title: { display: true, text: 'Số lượng' } },
        },
      }}
    />
  );

  const [postDateRange, setPostDateRange] = useState<any>([]);
  const [postList, setPostList] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);

  const userFilters = useMemo(() => {
    const labels = Array.from(
      new Set(
        data.map((item: any) => {
          const fullName = `${item.user?.lastName || ''} ${item.user?.firstName || ''}`.trim();
          const userName = item.user?.userName || '';
          return fullName ? `${fullName} (${userName})` : userName;
        })
      )
    );

    return labels.map((label) => ({
      text: label,
      value: label,
    }));
  }, [data]);

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
      <h1>Trang Thống Kê</h1>

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
    </div>
  );
};

export default Dashboard;