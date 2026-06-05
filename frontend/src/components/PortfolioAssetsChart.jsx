import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useCrypto } from '../context/crypto-context';


ChartJS.register(ArcElement, Tooltip, Legend);


export default function PortfolioAssetsChart() {
    const { assets } = useCrypto()


    const data = {
        labels: assets.map((a) => a.coinName), color: ['black'],
        datasets: [
            {
                label: '$',
                data: assets.map((a) => a.totalInvested),
                backgroundColor: [
                    'rgba(247, 5, 99, 1)',
                    'rgba(150, 70, 239, 1)',
                    'rgba(255, 134, 46, 1)',
                    'rgba(67, 209, 167, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
            cutout:'85%',
            borderWidth:1,
            borderColor: 'black',

            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position:'bottom',
                labels: {
                    color: 'black',
                    font:{
                        family:"Monomaniac One ,sans-serif",
                        size:17,
                        wieight:'bold',
                    },
                    usePointStyle:true,
                    pointStyle:'circle',
                    padding:20,
                    boxWidth:10,
                    boxHeight:10,
                }
            }
        }
    }

    return <div style={{
        display: "flex",
        marginBottom: '1rem',
        justifyContent: 'center',
        height: 350,
    }}
    >
        <Pie data={data} options={options} /></div>

}