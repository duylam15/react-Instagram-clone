import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { Card, Spin } from 'antd';

const VisibilityPieChart = ({ data }: { data: [string, number][] }) => {
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		if (data?.length) {
			const formatted = data.map(([type, value]) => ({
				type: getLabel(type),
				value,
			}));
			setChartData(formatted);
		}
	}, [data]);

	const getLabel = (key: string) => {
		switch (key) {
			case 'PUBLIC':
				return 'Công khai';
			case 'PRIVATE':
				return 'Riêng tư';
			case 'DELETE':
				return 'Đã xoá';
			default:
				return key;
		}
	};

	const config = {
		appendPadding: 10,
		data: chartData,
		angleField: 'value',
		colorField: 'type',
		radius: 1,
		label: {
			type: 'spider',
			labelHeight: 28,
			content: '{name} ({percentage})',
		},
		interactions: [{ type: 'element-active' }],
		legend: {
			position: 'right',
		},
	};

	return (
		<Card title="Biểu đồ chế độ hiển thị bài viết">
			{chartData.length ? <Pie {...config} /> : <Spin />}
		</Card>
	);
};

export default VisibilityPieChart;
