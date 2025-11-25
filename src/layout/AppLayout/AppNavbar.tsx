import Image from 'next/image'
import { BellOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'

type AppNavbarProps = {
  onToggleSidebar: () => void
}

export function AppNavbar({ onToggleSidebar }: AppNavbarProps) {
  const notificationCount = 16

  return (
    <header className='z-20 flex flex-shrink-0 items-center justify-between gap-6 border-b border-gray-200 bg-white px-6 py-3'>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          className='rounded-md p-2 text-gray-600 hover:bg-gray-100'
          onClick={onToggleSidebar}
          aria-label='Toggle sidebar'
        >
          <MenuOutlined />
        </button>
        <Image src='/gtep.png' alt='GTEP Logo' width={120} height={10} className='h-10 w-auto' />
      </div>

      <div className='flex flex-1 items-center justify-end '>
        <div className='hidden max-w-md flex-1 lg:flex'>
          <Input
            placeholder='Find courses, training, or resources'
            className='!py-3 !px-4 !rounded-full !border-0 !bg-gray-100 !text-sm !text-gray-600 hover:!border-primary-600 focus:!border-primary-600 focus:!ring-0 focus:!shadow-[0_0_0_4px_rgba(221,91,74,0.15)] '
            suffix={<SearchOutlined className='!text-gray-500' size={50} />}
          />
        </div>

        {/* <button
          className='hidden rounded-full p-2 hover:bg-gray-100 lg:block'
          aria-label='Toggle theme'
        >
          <Image src='/icons/sun.svg' alt='Toggle theme' width={20} height={20} />
        </button> */}

        <button className='relative rounded-full p-2 hover:bg-gray-100' aria-label='Notifications'>
          <BellOutlined className='text-lg text-gray-700' />
          {notificationCount > 0 ? (
            <span className='absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1 text-xs font-semibold text-white'>
              {notificationCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  )
}
