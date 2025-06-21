'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface SubmissionTabsProps {
  summary: string
  transcript: string
}

export default function SubmissionTabs({ summary, transcript }: SubmissionTabsProps) {
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 ${
              activeTab === 'summary'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-4 py-2 ${
              activeTab === 'transcript'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Transcript
          </button>
        </nav>
      </div>
      <div className="mt-4">
        {activeTab === 'summary' ? (
          <div className="prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-strong:text-current prose-em:text-current prose-code:text-current prose-pre:bg-gray-800 prose-pre:text-gray-100">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm">{transcript}</div>
        )}
      </div>
    </div>
  )
}
