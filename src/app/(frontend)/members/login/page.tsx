import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default async function Login() {
  // const { user } = await getMeUser({
  //   validUserRedirect: '/members/dashboard',
  // })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <form id="loginForm" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/members/signup" className="text-blue-600 hover:text-blue-800">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
              e.preventDefault();
              const form = e.target;
              const formData = new FormData(form);

              try {
                const response = await fetch('/api/users/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                  }),
                });

                if (response.ok) {
                  window.location.href = '/members/dashboard';
                } else {
                  const data = await response.json();
                  alert(data.errors?.[0]?.message || 'Login failed. Please try again.');
                }
              } catch (error) {
                alert('An error occurred. Please try again.');
              }
            });
          `,
        }}
      />
    </div>
  )
}
