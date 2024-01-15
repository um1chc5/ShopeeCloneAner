import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from 'src/Context/App.context'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { getRules } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { Helmet } from 'react-helmet-async'

interface FormData {
  email: string
  password: string
  confirm_password: string
}

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  // const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>()
  const rules = getRules()
  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        toast.success(data.data.message)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          // Cách lặp qua object data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orangeshopee'>
      <Helmet>
        <title>Login | Shopee</title>
        <meta name='description' content='Trang đăng nhập dự án Shopee' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-5 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              {/* Tên đăng nhập  */}
              <Input
                type='email'
                name='email'
                className='mt-8'
                placeholder='Email'
                register={register}
                rules={rules.email}
                errorMessage={errors.email?.message}
              />
              {/* Mật khẩu */}
              <Input
                className='mt-2'
                name='password'
                type='password'
                placeholder='Password'
                autoComplete='on'
                register={register}
                rules={rules.password}
                errorMessage={errors.password?.message}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  isLoading={loginAccountMutation.isLoading}
                  disabled={loginAccountMutation.isLoading}
                  className='w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                >
                  Đăng nhập
                </Button>
              </div>
              {/* Bạn chưa có tải khoản? */}
              <div className='mt-8 text-center'>
                <div className='item-center flex justify-center'>
                  <span className='mr-2 text-gray-400'>Bạn chưa có tải khoản?</span>
                  <Link className='font-bold text-red-400' to='/register'>
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
