import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'
import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { PurchaseData } from 'src/types/purchases.type'
// import { profile } from 'console'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  customizedCart: CustomizedCartItem[]
  setCustomizedCart: React.Dispatch<React.SetStateAction<CustomizedCartItem[]>>
}

interface CustomizedCartItem extends PurchaseData {
  checked: boolean
  disabled: boolean
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  customizedCart: [],
  setCustomizedCart: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [customizedCart, setCustomizedCart] = useState([] as CustomizedCartItem[])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)

  return (
    <AppContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, customizedCart, setCustomizedCart }}
    >
      {children}
    </AppContext.Provider>
  )
}
