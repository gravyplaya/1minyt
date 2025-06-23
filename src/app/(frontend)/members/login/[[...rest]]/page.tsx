import { Metadata } from 'next'
import { SignIn } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function Login() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <SignIn 
          path="/members/login" 
          routing="path" 
          signUpUrl="/members/signup"
          afterSignInUrl="/members"
        />
      </div>
    </div>
  )
}
