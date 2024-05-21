import React from 'react'
import Image from 'next/image';


interface IProps {
    imgSrc?: string;
    info: string;
    title: string;
    date: string;
}

const NotificationBox: React.FC<IProps> = ({
    imgSrc,
    info,
    title,
    date,
}) => {
  return (
    <div className='py-3 px-6 flex flex-col w-[100%] min-h-[70px] rounded-md 
    cursor-pointer hover:opacity-80 transition-all border-l-[3px] bg-[#fff] shadow-md mb-6'>
        <div className='flex justify-between items-center mb-6'>
            <div className='flex justify-start items-center gap-4'>
                {imgSrc && <Image src={imgSrc} alt='image' width={30} height={30} />}
                <p className='font-medium text-lg text-[#333]'>{title}</p>
            </div>
            <p className='font-normal text-base text-[#bbbb]' >{date}</p>
        </div>

        <p className='font-normal text-base text-[#333]'>{info}</p>
    </div>
  )
}

export default NotificationBox