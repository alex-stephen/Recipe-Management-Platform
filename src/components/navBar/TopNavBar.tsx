import { CoffeeOutlined, HomeOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import router from 'next/router';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: '/home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Recipes',
    key: '/recipes',
    icon: <CoffeeOutlined />,
  },
];

const TopNavBar: React.FC = () => {
    const [current, setCurrent] = useState('/home');
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        router.push(e.key)
    };
    return (
        <div className="w-full overflow-hidden">
            <Menu 
                onClick={onClick}
                selectedKeys={[current]} 
                mode="horizontal" 
                items={items}
                className="w-full justify-center flex-wrap md:flex-nowrap"
            />
        </div>
    );
}

export default TopNavBar;