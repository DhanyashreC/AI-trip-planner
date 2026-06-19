import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'

const menuOptions=[
    {
    name:'Home',
    path:'/'
    },
    {name:'pricing',
        path:'/pricing'

    },
    {
        name:'Contact us',
        path:'/contact-us'
    }
]

function Header() {
  return (
    <div className='flex justify-between items-center p-4'>
      {/* Logo  */}
      <div>
<div className="flex items-center gap-2">
  <Image
    src="/logo.svg"
    alt="logo"
    width={30}
    height={30}
  />
  <h2 className="font-bold text-2xl">
    AI Trip Planner
  </h2>
</div>

</div>
      {/*Menu Options */}
      <div className='flex gap-9 items-center'>
        {menuOptions.map((menu, index) => (
  <Link
    key={index}
    href={menu.path}
  >
    <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
  </Link>
))}
      </div>


      {/* Get Started */}
      <SignInButton mode='modal'>
      <Button>Get started</Button>
      </SignInButton>
    </div>
  )
}

export default Header
