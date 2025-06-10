'use client'

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        fetch('/api/users/logout', {
          method: 'POST',
        }).then(() => {
          window.location.href = '/'
        })
      }}
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  )
}
