import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className='flex h-screen w-full flex-col items-center justify-center bg-slate-50'>
      <h1 className='text-9xl font-extrabold tracking-widest text-blue-900'>404</h1>
      <div className='absolute rotate-12 rounded bg-orangeshopee px-2 text-sm'>Page Not Found</div>
      <button className='mt-5'>
        <Link
          to='/'
          className='group relative inline-block text-sm font-medium text-orangeshopee focus:outline-none focus:ring active:text-orangeshopee/80'
        >
          <span className='relative block border border-current bg-orangeshopee px-8 py-3 text-white hover:bg-orangeshopee/90'>
            Go Home
          </span>
        </Link>
      </button>
    </main>
  )
}

export default NotFound
