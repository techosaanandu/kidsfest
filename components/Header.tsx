'use client'
import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo1.png'
import VenueLogo from '@/data/venuelogo.png' // Import the venue logo
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Header = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  let headerClass = 'flex items-center w-full bg-blue-950 dark:bg-gray-950 justify-between p-4' // Increased padding
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50 '
  }

  return (
    <header className={headerClass}>
      <div className="flex w-full items-center justify-between dark:bg-gray-950">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="flex justify-center items-center mr-3 h-12 w-12 sm:h-20 sm:w-20">
              <Image
                src={Logo} // Path to your main logo
                width={250}
                height={250}
                alt="Logo"
                className="object-contain"
              />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-3xl font-bold text-white sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          <div className="text-white font-extrabold text-2xl">
            <h1>venue: Mar Baselios Public School, Kaithacode</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src={VenueLogo} // Path to your venue logo
                width={50} // Adjust width as needed
                height={50} // Adjust height as needed
                alt="Venue Logo"
                className="object-contain"
              />
            </div>
            {session && (
              <p
                onClick={() => router.push('/dashboard')}
                className="block cursor-pointer font-medium text-white hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
              >
                DASHBOARD
              </p>
            )}
            {session ? (
              <p
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block cursor-pointer font-medium text-white hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
              >
                LOGOUT
              </p>
            ) : (
              <Link
                href={'/sign-in'}
                className="block font-medium text-white hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
              >
                <div className="bg-white rounded-md text-blue-900 p-2">LOGIN</div>
              </Link>
            )}
          </div>
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
