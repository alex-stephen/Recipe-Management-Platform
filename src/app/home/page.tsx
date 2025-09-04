"use client";

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { CoffeeOutlined, HomeOutlined } from '@ant-design/icons';
import { useState } from "react";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Recipe',
    key: 'recipe',
    icon: <CoffeeOutlined />,
  },
];

const Home: React.FC = () => {
    const [current, setCurrent] = useState('home');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div>
            <div>
                <Menu 
                    onClick={onClick} 
                    selectedKeys={[current]} 
                    mode="horizontal" 
                    items={items}
                    className='w-full justify-center'
                     />;
            </div>
        </div>
    );
}

export default Home;