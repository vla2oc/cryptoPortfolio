import { Layout, Card, Statistic, List, Typography, Spin, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import CryptoContext from '../context/crypto-context';




export default function AppSider() {
    const {totalHoldingValue,totalNetProfit } = useContext(CryptoContext)
     const isTotalGrowthPositive = totalNetProfit >= 0;

    return (
        <Layout.Sider width="25%" className='p-15 !bg-backGr'>
                <Card className='flex !bg-purple-100 !border-2 !border-purple-300 !rounded-2xl  w-full h-[200px] items-center'>
                    <Statistic
                        title= {<span className="!text-xl !text-purple-900 !font-normal !font-display">Total Holding</span>}
                        value={totalHoldingValue}
                        precision={2}
                        valueStyle={{ color: isTotalGrowthPositive ? '#3f8600' : '#cf1322' }}
                        prefix="$"
                    />
                </Card>
                <Card className='flex ! !bg-purple-100 !border-2 !border-purple-300 !rounded-2xl  !mt-10 w-full h-[200px] items-center'>
                    <Statistic
                    title= {<span className="!text-xl !text-purple-900 !font-normal !font-display">Total Profit/Loss</span>}
                    value={totalNetProfit}
                    precision={2}
                    prefix={isTotalGrowthPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="$"
                    valueStyle={{ color: isTotalGrowthPositive ? '#3f8600' : '#cf1322' }}
                />

                </Card>
                <Card className='flex !bg-purple-100 ! !border-2 !border-purple-300 !rounded-2xl  !mt-10 w-full h-[200px]'>
                    <Statistic
                    title= {<span className="!text-xl !text-purple-900 !font-normal !font-display">Watchlist</span>}
                    value=""
                />

                </Card>


        </Layout.Sider>

    )
}