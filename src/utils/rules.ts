import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Bạn chưa nhập email'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email chưa đúng định dạng'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Bạn chưa nhập password'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Bạn chưa nhập lại password'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 6 - 160 ký tự'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Mật khẩu nhập vào không khớp'
        : undefined
  }
})

function priceTest(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent // this của yup có parent
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }

  return price_min !== '' || price_max !== ''
}

const handleSchemaConfirmPassword = (refStr: string) => {
  return yup
    .string()
    .required('Bạn chưa nhập password')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refStr)], 'Mật khẩu nhập vào không khớp')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Bạn chưa nhập email')
    .email('Email chưa đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Bạn chưa nhập password')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: handleSchemaConfirmPassword('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'giá không phù hợp',
    test: priceTest
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'giá không phù hợp',
    test: priceTest
  }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

export const userSchema = yup.object({
  name: yup.string().max(160),
  phone: yup.string().max(20),
  address: yup.string().max(160),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  avatar: yup.string().max(160),
  password: schema.fields['password'] as yup.StringSchema<string, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string, yup.AnyObject, undefined, ''>,
  confirm_password: handleSchemaConfirmPassword('new_password')
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>
