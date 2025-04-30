//this component and the corresponding usage of in ShootingListContent to toggle to Graph View was implemented by Yikun Lan

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Shooting } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataChartProps {
  shootings: Shooting[];
}

export default function ShootinGraph({ shootings }: DataChartProps) {
  //parsing the data passed in as a prop into a format that can be used by the chart
  const incidentsPerYear = shootings.reduce((acc, shooting) => {        //using the reduce function to iterate through the shootings prop (Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
    //acc is the accumulator, which is an object that will hold the number of incidents per year
    const year = shooting.attributes.YEAR;    //getting the year to be used as the key 
    acc[year] = (acc[year] || 0) + 1;         //if the year is already in the accumulator, increment the value by 1, otherwise set it to 1
    return acc;
  }, {} as Record<number, number>);           // <Key, Value> pair for the year and the number of incidents in that year


  //Chart.js parameters for the Bar Component (Documentation: https://react-chartjs-2.js.org/components/bar)
  const data = {
    labels: Object.keys(incidentsPerYear).sort((a, b) => Number(a) - Number(b)),  // sorting the years in ascending order
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
