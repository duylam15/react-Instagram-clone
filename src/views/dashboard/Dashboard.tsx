import { Column, Line, ColumnProps } from '@ant-design/charts';
import { Card, Select, Spin, Table } from 'antd';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Thongke.scss';

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

// Cột cho bảng thống kê người dùng mới
const userColumns = [
  { title: 'Thời gian', dataIndex: 'time', key: 'time' },
  { title: 'Số lượng người dùng mới', dataIndex: 'value', key: 'value' },
];

// Cột cho bảng thống kê 3 bài đăng
const postColumns = [
  { title: 'ID Bài đăng', dataIndex: 'postId', key: 'postId' },
  { title: 'Nội dung', dataIndex: 'content', key: 'content', render: (text: string) => text.length > 50 ? `${text.substring(0, 50)}...` : text },
  { title: 'Người đăng', dataIndex: 'userName', key: 'userName', render: (_: any, record: TopPostResponseDTO) => `${record.userFirstName} ${record.userLastName}` },
  { title: 'Thời gian tạo', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Cảm xúc', dataIndex: 'numberEmotion', key: 'numberEmotion' },
  { title: 'Bình luận', dataIndex: 'numberComment', key: 'numberComment' },
  { title: 'Chia sẻ', dataIndex: 'numberShare', key: 'numberShare' },
  { title: 'Tổng tương tác', dataIndex: 'totalInteraction', key: 'totalInteraction' },
];

// Mảng màu cho các cột
const colors = [
  'hsl(16, 100%, 76%)', // Orange cho Cảm xúc
  'hsl(217, 100%, 50%)', // Blue cho Bình luận
  'hsl(0, 100%, 67%)', // Pink cho Chia sẻ
  'hsl(145, 84%, 73%)', // Green
  'hsl(271, 100%, 71%)', // Purple
];

const Dashboard = () => {
  // State cho thống kê người dùng mới
  const [userTimeFrame, setUserTimeFrame] = useState('monthly');
  const [userViewType, setUserViewType] = useState('Chart');
  const [growthData, setGrowthData] = useState<{ time: string; value: number }[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // State cho thống kê top 3 bài đăng
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

  // Fetch dữ liệu người dùng mới
  useEffect(() => {
    const fetchGrowthData = async () => {
      setUserLoading(true);
      try {
        const endpoint = `http://localhost:9999/api/users/statistics/${userTimeFrame}`;
        const response = await axios.get(endpoint);
        if (response.data.statusCode === 204) {
          setGrowthData([]); // Không có dữ liệu
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

  // Fetch dữ liệu top 3 bài đăng
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
          setTopPosts([]); // Không có dữ liệu
        } else {
          setTopPosts(response.data.data);
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

  // Cấu hình biểu đồ cho thống kê người dùng mới
  const growthRateConfig = {
    data: growthData,
    xField: 'time',
    yField: 'value',
    smooth: true,
    point: { size: 5, shape: 'diamond' },
    areaStyle: { fillOpacity: 0.2 },
  };

  // Xử lý dữ liệu cho biểu đồ cột top 3 bài đăng
  const postChartData = topPosts.flatMap((post) => [
    { postId: post.postId, interactionType: 'Cảm xúc', value: post.numberEmotion },
    { postId: post.postId, interactionType: 'Bình luận', value: post.numberComment },
    { postId: post.postId, interactionType: 'Chia sẻ', value: post.numberShare },
  ]);

  // Cấu hình biểu đồ cột cho top 3 bài đăng
  const postChartConfig: ColumnProps = {
    data: postChartData,
    xField: 'postId',
    yField: 'value',
    seriesField: 'interactionType',
    isGroup: true,
    color: colors.slice(0, 3),
    label: {
      position: 'top',
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      postId: { alias: 'ID Bài đăng' },
      value: { alias: 'Số lượng' },
      interactionType: { alias: 'Loại tương tác' },
    },
  };

  return (
    <div className="dashboard-container">
      <h1>Trang Thống Kê</h1>

      {/* Thống kê người dùng mới */}
      <div className="stats-container">
        <h2>Thống kê người dùng mới</h2>
        <div className="filter-container">
          <Select
            value={userTimeFrame}
            style={{ width: 120, marginRight: 10 }}
            onChange={(value: string) => setUserTimeFrame(value)}
          >
            <Option value="daily">Ngày</Option>
            <Option value="weekly">Tuần</Option>
            <Option value="monthly">Tháng</Option>
            <Option value="yearly">Năm</Option>
          </Select>
          <Select
            value={userViewType}
            style={{ width: 120 }}
            onChange={(value: string) => setUserViewType(value)}
          >
            <Option value="Chart">Biểu đồ</Option>
            <Option value="Table">Bảng</Option>
          </Select>
        </div>
        <Card className="data-container">
          {userLoading ? (
            <div className="loading-container">
              <Spin />
            </div>
          ) : growthData.length === 0 ? (
            <div className="no-data">Không có dữ liệu để hiển thị</div>
          ) : userViewType === 'Chart' ? (
            <Line {...growthRateConfig} />
          ) : (
            <Table
              dataSource={growthData.map((item, index) => ({
                key: index,
                ...item,
              }))}
              columns={userColumns}
              pagination={{ pageSize: 4, showSizeChanger: false }}
            />
          )}
        </Card>
      </div>

      {/* Thống kê top 3 bài đăng */}
      <div className="stats-container">
        <h2>Thống kê top 3 bài đăng có lượt tương tác cao nhất</h2>
        <div className="filter-container">
          <Select
            value={postTimeFrame}
            style={{ width: 120, marginRight: 10 }}
            onChange={(value: string) => {
              setPostTimeFrame(value);
              setWeek(null);
              setMonth(null);
            }}
          >
            <Option value="weekly">Tuần</Option>
            <Option value="monthly">Tháng</Option>
            <Option value="yearly">Năm</Option>
          </Select>
          {postTimeFrame === 'weekly' && (
            <Select
              value={week}
              style={{ width: 120, marginRight: 10 }}
              onChange={(value: number) => setWeek(value)}
              placeholder="Chọn tuần"
            >
              {weekList.map((w) => (
                <Option key={w} value={w}>
                  Tuần {w}
                </Option>
              ))}
            </Select>
          )}
          {postTimeFrame === 'monthly' && (
            <Select
              value={month}
              style={{ width: 120, marginRight: 10 }}
              onChange={(value: number) => setMonth(value)}
              placeholder="Chọn tháng"
            >
              {monthList.map((m) => (
                <Option key={m} value={m}>
                  Tháng {m}
                </Option>
              ))}
            </Select>
          )}
          <Select
            value={year}
            style={{ width: 120, marginRight: 10 }}
            onChange={(value: number) => setYear(value)}
          >
            {yearList.map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>
          <Select
            value={postViewType}
            style={{ width: 120 }}
            onChange={(value: string) => setPostViewType(value)}
          >
            <Option value="Chart">Biểu đồ</Option>
            <Option value="Table">Bảng</Option>
          </Select>
        </div>
        <Card className="data-container">
          {postLoading ? (
            <div className="loading-container">
              <Spin />
            </div>
          ) : topPosts.length === 0 ? (
            <div className="no-data">Không có dữ liệu để hiển thị</div>
          ) : postViewType === 'Chart' ? (
            postChartData.length > 0 ? (
              <Column {...postChartConfig} />
            ) : (
              <div className="no-data">Đang tải dữ liệu biểu đồ...</div>
            )
          ) : (
            <Table
              dataSource={topPosts.map((item, index) => ({
                key: index,
                ...item,
              }))}
              columns={postColumns}
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;