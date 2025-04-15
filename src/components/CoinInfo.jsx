import { Flex, Typography } from 'antd'

export default function CoinInfo({ coin, withSymbol, withAddress }) {
    return (
        <Flex align='center'>
            <img src={coin.icon} alt={coin.name} style={{ width: 40, marginRight: 10 }} />
            <Typography.Title level={2} style={{ margin: 0 }} >
                {withSymbol && <span>({coin.symbol})</span>}  {coin.name}
                {withAddress && coin.contractAddress && (<Typography.Paragraph>
                    <Typography.Text strong>Contract address: </Typography.Text>
                    {withAddress && coin.contractAddress}
                </Typography.Paragraph>
                )}
            </Typography.Title>
        </Flex>
    )
}