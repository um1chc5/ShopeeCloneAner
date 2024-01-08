import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { UserSchema, userSchema } from 'src/utils/rules'

type PasswordFormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const profileSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<PasswordFormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit((data) => {
    const { password, new_password } = data
    if (password === new_password) {
      toast.info('Mật khẩu mới phải khác mật khẩu hiện tại')
    } else {
      updateProfileMutation.mutate(
        {
          password: password,
          new_password: new_password
        },
        {
          onSuccess: (data) => {
            toast.success(data.data.message)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (err: any) => {
            toast.error(err.message)
          }
        }
      )
    }
  })

  return (
    <div>
      <h1 className='text-lg text-gray-700'>Đổi mật khẩu</h1>
      <p className='pb-5 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <hr />
      <div className='pt-8'>
        <form className='w-full pr-12' onSubmit={onSubmit}>
          <div className='mb-3 flex items-center gap-5 text-sm'>
            <p className='basis-1/4 text-right text-gray-500'>Mật khẩu cũ</p>
            <Input
              className='basis-3/4 translate-y-3'
              classNameInput='w-full rounded border border-gray-200 p-2'
              register={register}
              name='password'
              errorMessage={errors.password?.message}
            />
          </div>
          <div className='mb-3 flex items-center gap-5 text-sm'>
            <p className='basis-1/4 text-right text-gray-500'>Mật khẩu mới</p>
            <Input
              className='basis-3/4 translate-y-3'
              classNameInput='w-full rounded border border-gray-200 p-2'
              register={register}
              name='new_password'
              errorMessage={errors.new_password?.message}
            />
          </div>
          <div className='mb-3 flex items-center gap-5 text-sm'>
            <p className='basis-1/4 text-right text-gray-500'>Xác nhận mật khẩu mới</p>
            <Input
              className='basis-3/4 translate-y-3'
              classNameInput='w-full rounded border border-gray-200 p-2'
              register={register}
              name='confirm_password'
              errorMessage={errors.confirm_password?.message}
            />
          </div>
          <div className='mb-3 flex gap-5'>
            <div className='basis-1/4'></div>
            <div className='basis-3/4'>
              <Button type='submit' className='rounded-sm bg-orangeshopee p-2 px-5 text-white hover:bg-orangeshopee/80'>
                Lưu
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
