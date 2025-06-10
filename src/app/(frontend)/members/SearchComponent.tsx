'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface SearchComponentProps {
  userId: number
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function SearchComponent({ userId }: SearchComponentProps) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('transcript')
  const [results, setResults] = useState<{ transcript: string; summary: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI assistant. Feel free to ask me any questions about the video content.",
    },
    {
      role: 'assistant',
      content:
        'I can help you understand the key points, provide additional context, or answer specific questions about the video.',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, userId }),
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          userId,
          transcript: results?.transcript,
          summary: results?.summary,
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.output,
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending chat message:', error)
      // Add error message to chat
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Transcribe and Summarize
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enter the YouTube URL below to get started
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a YouTube URL to transcribe and summarize"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Go'}
            </button>
          </form>
        </div>

        {/* Chat with AI Assistant */}
        {results && (
          <div className="max-w-4xl mx-auto mb-8 max-h-[700px] overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Chat with AI Assistant
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ask questions about the video content
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full ${
                        message.role === 'user'
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : 'bg-blue-100 dark:bg-blue-900'
                      } flex items-center justify-center`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          message.role === 'user'
                            ? 'text-gray-600 dark:text-gray-300'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            message.role === 'user'
                              ? 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              : 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                          }
                        />
                      </svg>
                    </div>
                    <div
                      className={`flex-1 ${
                        message.role === 'user'
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'bg-blue-100 dark:bg-blue-900'
                      } rounded-lg p-4`}
                    >
                      {message.role === 'user' ? (
                        <p
                          className={`${
                            message.role === 'user'
                              ? 'text-gray-800 dark:text-gray-200'
                              : 'text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {message.content}
                        </p>
                      ) : (
                        <div
                          className={`prose prose-sm max-w-none text-blue-800 dark:text-blue-200 prose-headings:text-current prose-p:text-current prose-strong:text-current prose-em:text-current prose-code:text-current prose-pre:bg-gray-800 prose-pre:text-gray-100`}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="mt-6 flex gap-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isChatLoading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Results Tabs */}
        {results && (
          <div className="max-w-4xl mx-auto">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
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
              </nav>
            </div>
            <div className="mt-6 p-6 rounded-lg shadow bg-white dark:bg-gray-800">
              <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                {activeTab === 'transcript' ? (
                  <div className="whitespace-pre-wrap">{results.transcript}</div>
                ) : (
                  <div className="prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-strong:text-current prose-em:text-current prose-code:text-current prose-pre:bg-gray-800 prose-pre:text-gray-100">
                    <ReactMarkdown>{results.summary}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
