'use client'
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>
        <SignUp path="/members/signup" routing="path" signInUrl="/members/login" />
      </div>
    </div>
  )
}
