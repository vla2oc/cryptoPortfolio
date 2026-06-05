import { Divider, Flex, Tag, Typography } from 'antd'
import CoinInfo from './CoinInfo'
import { useCrypto } from '../context/crypto-context'

export default function CoinInfoModal({ coin }) {

    const {crypto} = useCrypto()

    const marketCoin = crypto.find(c => c.id == coin.id)

    return (
        <>
            <CoinInfo coin={coin} withSymbol withAddress />
            <Divider />
            <Typography.Paragraph>
                <Typography.Text strong>1 hour: </Typography.Text>
                <Tag color={coin.grow > 0 ? 'green' : 'red'}>
                    {coin.totalAmount}%
                </Tag>

                <Typography.Text strong>1 day: </Typography.Text>
                <Tag color={marketCoin.usd_24h_change > 0 ? 'green' : 'red'}>
                    {marketCoin.usd_24h_change.toFixed(1)}%
                </Tag>

                <Typography.Text strong>1 week: </Typography.Text>
                <Tag color={coin.priceChange1w > 0 ? 'green' : 'red'}>
                    {coin.priceChange1w}%
                </Tag>
            </Typography.Paragraph>
            <Typography.Paragraph>
                <Typography.Text strong>Price: </Typography.Text>
                {marketCoin.price.toFixed(2)}$
            </Typography.Paragraph>
        </>
    )
}
