'use client';
import {DoughnutChartProps} from '@/types';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: DoughnutChartProps) => {
  const accountType = accounts.map((t) => t.subType);
  const balance = accounts.map((b) => b.currentBalance);

  const data = {
    datasets: [
      {
        label: 'Account',
        data: [...balance, 100],
        backgroundColor: ['#0747b6', '#2265db', '#2f91fa'],
      },
    ],

    labels: [...accountType],
  };

  return (
    <div className="w-full">
      <Doughnut
        data={data}
        options={{
          cutout: '65%',
          plugins: {
            legend: {
              display: true,
            },
          },
        }}
      />
    </div>
  );
};
export default DoughnutChart;
