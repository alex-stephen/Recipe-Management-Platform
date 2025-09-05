import { Flex, Image } from 'antd';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import RecipeCard from '../components/recipeCard/RecipeCard';
import { Recipe } from '../types/recipe';
import TopNavBar from '../components/navBar/TopNavBar';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
      async function fetchRecipes() {
        const res = await fetch('/api/recipes');
        const data = await res.json();
        setRecipes(data);
      }
  
      fetchRecipes();
    }, []);

    return (
        <div>
          <TopNavBar/>
          <div className="flex flex-col gap-6">
            <div className="w-full flex justify-center">
              <Flex 
                className='w-full max-w-[1600px] mx-auto h-auto rounded-[6px] border border-transparent flex-wrap items-center justify-center flex-col md:flex-row'
                justify='center' 
                align='center'
              >
                <div className='flex justify-center w-full md:w-auto mt-4 md:mt-0 px-4 sm:px-6'>
                  <img
                    className='rounded-[4px] border w-full max-w-[500px] h-auto object-cover my-4 md:m-10'
                    src='images/Birthday_Cake.png'
                    alt='birthday cake'
                  />
                </div>
                <p className='flex-1 min-w-[300px] max-w-[600px] break-normal p-4 md:p-10 font-roboto text-lg text-center md:text-left'>
                  {t('pages.home.description')}
                </p>
              </Flex>
            </div>
            <div className="flex justify-center">
              <h1 className='text-2xl justify-self-center'>{t('pages.home.recent')}</h1>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 justify-items-center ml-5 mr-5">
              {recipes &&
                [...recipes].slice(-6).reverse().map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))
              }
            </div>
          </div>
        </div>
    );
}

export default Home;