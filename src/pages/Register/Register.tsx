import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from 'src/Context/App.context'
import Button from 'src/components/Button'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit
  } = useForm<FormData>({
    resolver: yupResolver(schema.pick(['email', 'password', 'confirm_password']))
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  // const rules = getRules(getValues)
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    console.log(data)
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        toast.success('Đăng ký thành công')
      },
      // Xử lý lỗi 422
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          // Cách lặp qua object data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // Cách 2
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='bg-orangeshopee'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 md:grid-cols-5 md:py-5 md:pr-10'>
          <div className='md:col-span-2 md:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl font-semibold uppercase'>Đăng ký</div>
              {/* Tên đăng nhập  */}
              <Input
                className='mt-8'
                name='email'
                type='email'
                placeholder='Email'
                register={register}
                // rules={rules.email}
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
                // rules={rules.password}
                errorMessage={errors.password?.message}
              />
              {/* Xác nhận Mật khẩu */}
              <Input
                className='mt-2'
                name='confirm_password'
                type='password'
                placeholder='Cofffirm password'
                autoComplete='on'
                register={register}
                // rules={rules.confirm_password}
                errorMessage={errors.confirm_password?.message}
              />
              {/* Button Đăng Ký */}
              <div className='mt-4'>
                <Button
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  className='w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                >
                  Đăng ký
                </Button>
              </div>
              {/* Bạn đã có tải khoản? */}
              <div className='mt-8 text-center'>
                <div className='item-center flex justify-center'>
                  <span className='mr-2 text-gray-400'>Bạn đã có tải khoản?</span>
                  <Link className='font-bold text-red-400' to='/login'>
                    Đăng nhập
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
