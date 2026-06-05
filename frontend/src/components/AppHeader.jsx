import { Layout, Select, Space, Button, Modal, Drawer, Divider } from 'antd';
import { useCrypto } from '../context/crypto-context';
import { useEffect, useState } from 'react';
import CoinInfoModal from './CoinInfoModal';
import AddAssetForm from './AddAssetForm';
import AppMenu from './AppMenu'

const headerStyle = {
    width: '100%',
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#030514',
    overflow:'visible'
};

export default function AppHeader() {
    const [coin, SetCoin] = useState(null)
    const [select, SetSelect] = useState(false)
    const [modal, SetModal] = useState(false)
    const { assets } = useCrypto()
    const {crypto} = useCrypto()
    const [drawer, SetDrawer] = useState(false)



    useEffect(() => {
        const keypress = (event) => {
            if (event.key == '/') {
                SetSelect((prev) => !prev)
            }
        }
        document.addEventListener('keypress', keypress)
        return () => document.removeEventListener('keypress', keypress)
    }, [])

    function handleSelect(value) {
        SetCoin(assets.find((asset) => asset.id == value))
        SetModal(true)

    }


    return (
        <Layout.Header style={headerStyle}>
            <AppMenu/>
            <Select
                style={{ width: 250 }}
                open={select}
                onSelect={handleSelect}
                onClick={() => SetSelect((prev) => !prev)}
                value="press / to open"
                options={assets.map(asset => ({
                    label: asset.coinName,
                    value: asset.id,
                    icon: asset.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img style={{ width: 20 }} src={option.data.icon} alt={option.data.label} /> {option.data.label}
                    </Space>
                )}
            />
            <Button color='purple' variant='solid'  onClick={() => SetDrawer(true)}><span className='text-xl font-display flex '>Add Assets</span></Button>

            <Modal open={modal} onCancel={() => SetModal(false)} footer={null}>
                <CoinInfoModal coin={coin}></CoinInfoModal>
            </Modal>
            <Drawer width={600} title="Add Asset" onClose={() => SetDrawer(false)} open={drawer} destroyOnClose>
                <AddAssetForm onClose={() => SetDrawer(false)} />
            </Drawer>
        </Layout.Header>

    )
} 