const path = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/user/profile',
  changePassword: '/user/password',
  purchasesHistory: '/user/purchases',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
