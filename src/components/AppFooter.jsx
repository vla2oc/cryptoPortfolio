import { Layout } from 'antd';
export default function AppFooter() {
    const footerStyle = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#001529',
    };
    return (
        <Layout.Footer style={footerStyle}></Layout.Footer>

    )
}