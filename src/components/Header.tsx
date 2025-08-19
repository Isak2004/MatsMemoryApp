import React from 'react'
import { Globe, Heart } from 'lucide-react'

export default function Header() {

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/50 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center relative">
              <Heart className="w-6 h-6 text-white" />
              <Globe className="w-4 h-4 text-white/80 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shared Memories</h1>
              <p className="text-sm text-gray-600">A global collection of precious moments</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}