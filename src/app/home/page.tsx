"use client";

import type { MenuProps } from 'antd';
import { Flex, Image, Menu } from 'antd';
import { CoffeeOutlined, HomeOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div>
          <Menu 
              onClick={onClick} 
              selectedKeys={[current]} 
              mode="horizontal" 
              items={items}
              className='w-full justify-center'
          />
          <Flex className='w-full h-auto rounded-[6px] border border-transparent' justify='space-around' align='center'>
            <p className='flex-1 mw-500 break-normal p-10 font-roboto text-lg'>
              {t('pages.home.description')}
            </p>
            <div className='m-10'>
              <Image
                className='rounded-[4px] border'
                width={500}
                src='images/Birthday_Cake.png'
                alt='birthday cake'
              />
            </div>
          </Flex>
        </div>
    );
}

export default Home;