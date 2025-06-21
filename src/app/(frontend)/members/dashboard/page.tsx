import { Metadata } from 'next'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'
import SubmissionTabs from './SubmissionTabs'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Member dashboard',
}

async function getUserSubmissions(userId: string) {
  const payload = await getPayload({ config: configPromise })
  const submissions = await payload.find({
    collection: 'submissions',
    where: {
      submittedBy: {
        equals: userId,
      },
    },
    sort: '-submittedAt',
  })
  return submissions.docs
}

export default async function Dashboard() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/members/login')
  }
  const user = await currentUser()
  const submissions = await getUserSubmissions(userId)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome, {user?.firstName || user?.username || 'User'}!
        </h1>
        <div className="space-y-6">
          <div className="p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            {submissions.length > 0 ? (
              <div className="space-y-6">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          YouTube ID:{' '}
                          <Link
                            href={`https://youtube.com/watch?v=${submission.yt_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {submission.yt_id}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                          Submitted on: {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <SubmissionTabs
                        summary={submission.summary}
                        transcript={submission.transcript}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No submissions yet.</p>
            )}
          </div>

          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
