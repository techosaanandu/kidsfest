'use client'

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo1.png'
import VenueLogo from '@/data/venuelogo.png'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Header = () => {
  const { data: session } = useSession()
  const router = useRouter()

  let headerClass = 'flex items-center w-full bg-blue-950 dark:bg-gray-950 px-4 py-3'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50 shadow-xl border-b border-blue-900'
  }

  return (
    <header className={headerClass}>
      {/* Grid Layout: 
          - Left: 1/4 space (col-span-3)
          - Middle: 2/4 space (col-span-6)
          - Right: 1/4 space (col-span-3)
      */}
      <div className="grid grid-cols-12 w-full items-center">
        
        {/* --- PART 1: LOGO & NAME (25%) --- */}
        <div className="col-span-3 flex items-center justify-start gap-3">
          <Link href="/" aria-label={siteMetadata.headerTitle} className="flex items-center gap-2">
            <div className="relative h-10 w-10 sm:h-14 sm:w-14 flex-shrink-0">
              <Image
                src={Logo}
                alt="Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <span className="hidden xl:block text-lg font-bold text-white tracking-tighter uppercase">
              {siteMetadata.headerTitle}
            </span>
          </Link>
        </div>

        {/* --- PART 2: THE "NAME BOARD" MARQUEE (50%) --- */}
        <div className="col-span-6 flex items-center px-4">
          <div className="flex items-center bg-blue-900/50 rounded-lg px-3 py-1.5 w-full overflow-hidden border border-blue-800">
            <div className="flex-shrink-0 mr-3 border-r border-blue-700 pr-3">
              <Image src={VenueLogo} width={24} height={24} alt="Venue" />
            </div>
            
            {/* The Scrolling Container */}
            <div className="relative flex overflow-x-hidden">
              <div className="animate-marquee whitespace-nowrap flex">
                <span className="text-sm sm:text-base font-bold text-white uppercase tracking-widest mx-4">
                  Venue: Mar Baselios School, Maruthamonpally — Welcome to the Event — Check out for Schedule —
                </span>
                {/* Duplicate for seamless loop */}
                <span className="text-sm sm:text-base font-bold text-white uppercase tracking-widest mx-4">
                  Venue: Mar Baselios Public School, Kaithacode — Welcome to the Event — Check out for Schedule —
                </span>
              </div>
            </div>
            </div>
          </div>


        {/* --- PART 3: NAV / USER (25%) --- */}
        <div className="col-span-3 flex items-center justify-end gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-4">
            {session && (
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[10px] font-black text-white hover:text-blue-300 transition-colors tracking-widest"
              >
                DASHBOARD
              </button>
            )}
            
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-[10px] font-black text-white hover:text-red-400 transition-colors tracking-widest"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="bg-white text-blue-950 px-4 py-1.5 rounded-sm text-[10px] font-black hover:bg-blue-100 transition-all tracking-widest"
              >
                LOGIN
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:ml-2">
            <ThemeSwitch />
            <MobileNav />
          </div>
        </div>

      </div>

      {/* Required CSS for the Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  )
}

export default Header
