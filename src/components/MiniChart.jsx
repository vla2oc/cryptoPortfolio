import { useRef } from 'react';
import { useCrypto } from '../context/crypto-context';
import { useEffect } from 'react';
export default function MiniChart() {
    const container = useRef()

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/tv.js"
        script.async = true
        script.onload = () => {
            new window.TradingView.widget({
                container_id: 'tradingview-chart',
                autosize: true,
                symbol: 'BTCUSD',
                interval: '4H',
                timezone: 'Etc/UTC',
                theme: 'dark',
                style: '1',
                locale: 'en',
                enable_publishing: false,
                hide_top_toolbar: false,
                hide_legend: false,
                allow_symbol_change: true,

            })
        }
        container.current.appendChild(script)

    }, [])
    return (
        <div ref={container}>
            <div id='tradingview-chart' style={{ height: '35vw', marginTop: '10vw' }}></div>

        </div>
    )
}