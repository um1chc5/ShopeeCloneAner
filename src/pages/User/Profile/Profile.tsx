import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../Components/DateSelect/DateSelect'
import { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { setProfileToLS } from 'src/utils/auth'
import { AppContext } from 'src/Context/App.context'
import { getAvatarUrl } from 'src/utils/utils'
import FileInput from '../Components/FileInput/FileInput'

type UserFormData = Pick<UserSchema, 'name' | 'address' | 'date_of_birth' | 'avatar' | 'phone'>
const profileSchema = userSchema.pick(['name', 'address', 'date_of_birth', 'avatar', 'phone'])

/* eslint-disable jsx-a11y/label-has-associated-control */
function Profile() {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    getValues
    // setError,
    // on
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1),
      phone: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const avatar = watch('avatar')

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile,
    staleTime: 20000
  })

  const profileData = data?.data.data

  useEffect(() => {
    if (profileData) {
      setValue('name', profileData.name)
      setValue('phone', profileData.phone)
      setValue('address', profileData.address)
      setValue('avatar', profileData.avatar)
      setValue('date_of_birth', profileData.date_of_birth ? new Date(profileData.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profileData, setValue])

  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutaion = useMutation(userApi.uploadAvatar)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const currentData = getValues()
      if (JSON.stringify(currentData) === JSON.stringify(data)) {
        toast.info('Thông tin người dùng không có gì thay đổi')
        return
      }

      let avatarName = avatar

      if (file) {
        const form = new FormData()
        form.append('image', file)

        const { data: uploadData } = await uploadAvatarMutaion.mutateAsync(form)
        avatarName = uploadData.data
        setValue('avatar', avatarName)
      }

      const profileData = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      }

      const { data: updateData } = await updateProfileMutation.mutateAsync(profileData)

      setProfile(updateData.data)
      setProfileToLS(updateData.data)
      toast.success(updateData.message)
      console.log('Updated profile data:', updateData)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  })

  return (
    <div>
      <h1 className='text-lg text-gray-700'>Hồ Sơ Của Tôi</h1>
      <p className='pb-5 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <hr />
      {profileData && (
        <div className='grid grid-cols-10 pt-8'>
          <form onSubmit={onSubmit} className='col-span-7 pr-12'>
            <div className='mb-6 flex items-center gap-5 text-sm'>
              <label className='basis-1/4 text-right text-gray-500'>Email</label>
              <p className='basis-3/4'>{profileData.email}</p>
            </div>
            <div className='mb-3 flex items-center gap-5 text-sm'>
              <label className='basis-1/4 text-right text-gray-500'>Tên</label>
              <Input
                type='text'
                className='basis-3/4 translate-y-3'
                classNameInput='w-full rounded border border-gray-200 p-2'
                register={register}
                name='name'
                errorMessage={errors.name?.message}
                // placeholder='Tên'
              />
            </div>
            <div className='mb-3 flex items-center gap-5 text-sm'>
              <label className='basis-1/4 text-right text-gray-500'>Số điện thoại</label>
              <Input
                className='basis-3/4 translate-y-3'
                classNameInput='w-full rounded border border-gray-200 p-2'
                register={register}
                name='phone'
                errorMessage={errors.phone?.message}
              />
            </div>
            <div className='mb-3 flex items-center gap-5 text-sm'>
              <label className='basis-1/4 text-right text-gray-500'>Địa chỉ</label>
              <Input
                type='text'
                className='basis-3/4 translate-y-3'
                classNameInput='w-full rounded border border-gray-200 p-2'
                register={register}
                name='address'
                errorMessage={errors.address?.message}
              />
            </div>
            <div className='mb-3 flex items-center gap-5 text-sm'>
              <label className='basis-1/4 text-right text-gray-500'>Ngày sinh</label>
              <Controller
                name='date_of_birth'
                control={control}
                render={({ field }) => (
                  <DateSelect
                    errorMessage={errors.date_of_birth?.message}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className='mb-3 flex gap-5'>
              <div className='basis-1/4'></div>
              <div className='basis-3/4'>
                <Button
                  type='submit'
                  className='rounded-sm bg-orangeshopee p-2 px-5 text-white hover:bg-orangeshopee/80'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </form>
          <div className='col-span-3'>
            <form className=' flex flex-col items-center gap-4 border-l border-gray-100'>
              <div className='h-24 w-24'>
                <img
                  className='h-full rounded-full object-cover'
                  src={previewImage || getAvatarUrl(avatar)}
                  alt='avatar'
                />
              </div>
              <FileInput setFile={setFile} />
              <div className='text-sm text-gray-400'>
                <p>Dụng lượng file tối đa 1 MB</p>
                <p>Định dạng:.JPEG, .PNG</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
