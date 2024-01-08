import classNames from 'classnames'
import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AppContext } from 'src/Context/App.context'
import path from 'src/constants/Path'
import { getAvatarUrl, userImage } from 'src/utils/utils'

function UserSideNav() {
  const { profile } = useContext(AppContext)

  return (
    <div className='pr-5'>
      <div className='flex items-center gap-4'>
        <Link className='h-12 w-12' to={path.profile}>
          <img className='rounded-full' src={getAvatarUrl(profile?.avatar) || getAvatarUrl(userImage)} alt='avatar' />
        </Link>
        <div>
          <h3 className='text-sm font-semibold'>vuvuongan</h3>
          <Link to={path.profile} className='flex items-center text-sm text-gray-500'>
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className='border-b border-gray-200 pt-4'></div>
      <div className='mt-5'>
        <UserNavLink
          content='Tìa khoản của tôi'
          imageUrl='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
          path={path.profile}
        />
        <UserNavLink
          content='Đổi mật khẩu'
          imageUrl='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
          path={path.changePassword}
        />
        <UserNavLink
          content='Đơn mua'
          imageUrl='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
          path={path.purchasesHistory}
        />
      </div>
    </div>
  )
}

function UserNavLink({ path, imageUrl, content }: { path: string; imageUrl: string; content: string }) {
  return (
    <NavLink
      className={({ isActive }) => {
        return classNames('flex items-center py-1 text-gray-600 hover:text-orangeshopee', {
          'text-orangeshopee': isActive
        })
      }}
      to={path}
    >
      <div className='mr-2 h-5 w-5'>
        <img src={imageUrl} alt='icon' />
      </div>
      {content}
    </NavLink>
  )
}

export default UserSideNav
