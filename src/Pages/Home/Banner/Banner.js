import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../../../Pages/assets/banner/banner.jpg';
const Banner = () => {
  return (
    <div>
      <section>
        <div className='sm:container flex flex-col justify-center sm:p-6 p-2 mx-auto sm:py-12 lg:py-24 lg:flex-row-reverse lg:justify-between'>
          <div className='flex flex-col justify-center sm:p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left'>
            <h1 className=' text-xl font-bold leading-none sm:text-6xl'>
              Your Home, <br />
              <span className='dark:text-yellow-400'>Your </span>Way
            </h1>
            <p className='mt-6 mb-8 md:text-2xl font-semibold text-xl sm:mb-12'>
              Choose from wide collection of RFL, Partex, Bengal &
              <br className='hidden md:inline lg:hidden' />
              <span className='lg:pl-2'>others brand. Your home in your Way.</span>
            </p>
            <div className='flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start'>
              <Link to='/categories' className='px-8  btn bg-gradient-to-r from-accent to-secondary text-xl text-white capitalize'>
                Shopping Now
              </Link>
            </div>
          </div>
          <div className='flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128'>
            <img
              src={banner}
              alt='BannerPhoto'
              className='object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 rounded-3xl'
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
