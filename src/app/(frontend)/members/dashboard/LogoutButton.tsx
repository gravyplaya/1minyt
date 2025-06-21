'use client'
import { SignOutButton } from '@clerk/nextjs'

export default function LogoutButton() {
  return (
    <SignOutButton>
      <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
        Logout
      </button>
    </SignOutButton>
  )
}
