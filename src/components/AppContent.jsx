import { Layout, Typography } from 'antd';
import { useCrypto } from '../context/crypto-context';
import PortfolioChart from './PortfolioChart';
import MiniChart from './MiniChart';


export default function AppContent() {
    const { assets, crypto } = useCrypto()

    const contentStyle = {
        textAlign: 'center',
        minHeight: 'calc(100vh - 60px)',
        lineHeight: '120px',
        color: '#f8f8f8',
        backgroundColor: '#001529',
    };

    return (
        <Layout.Content style={contentStyle}>

            <Typography.Title level={2} style={{ textAlign: "left", color: "white" }} >Portfolio:{" "} {assets.map(asset => {
                const coin = crypto.find(c => c.id == asset.id)

                return asset.amount * coin.price
            }).reduce((acc, v) => (acc += v), 0).toFixed(2)}$


            </Typography.Title>
            <PortfolioChart />
            <MiniChart />
        </Layout.Content>
    )
}