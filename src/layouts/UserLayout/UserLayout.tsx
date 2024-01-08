import UserSideNav from 'src/pages/User/Components/UserSideNav/UserSideNav'

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-neutral-100'>
      <div className='container grid grid-cols-12 px-10 pt-5'>
        <div className='col-span-2 py-5'>
          <UserSideNav />
        </div>
        <div className='col-span-10 bg-white px-8 py-5'>{children}</div>
      </div>
    </div>
  )
}

export default UserLayout
