import Footer from 'src/components/Footer'
import RegistorHeader from 'src/components/RegistorHeader'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegistorHeader />
      {children}
      <Footer />
    </div>
  )
}
