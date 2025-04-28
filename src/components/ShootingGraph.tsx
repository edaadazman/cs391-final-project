import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Shooting } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataChartProps {
  shootings: Shooting[];
}

export default function DataChart({ shootings }: DataChartProps) {
  // Aggregate data for the chart (e.g., number of incidents per year)
  const incidentsPerYear = shootings.reduce((acc, shooting) => {
    const year = shooting.attributes.YEAR;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Prepare data for the chart
  const data = {
    labels: Object.keys(incidentsPerYear).sort((a, b) => Number(a) - Number(b)),
    datasets: [
      {
        label: 'Incidents per Year',
        data: Object.values(incidentsPerYear),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Shooting Incidents per Year',
      },
    },
  };

  return <Bar data={data} options={options} />;
}
