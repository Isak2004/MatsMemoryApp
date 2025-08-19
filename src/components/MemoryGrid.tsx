import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Memory } from '../lib/supabase'
import { Calendar, Heart, Loader2, Camera, Globe, Users } from 'lucide-react'

interface MemoryGridProps {
  refreshTrigger: number
}

export default function MemoryGrid({ refreshTrigger }: MemoryGridProps) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMemories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMemories(data || [])
    } catch (error) {
      console.error('Error fetching memories:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    fetchMemories()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Camera className="w-16 h-16 text-gray-400" />
          <Globe className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No shared memories yet</h3>
        <p className="text-gray-600">Be the first to share a precious moment with the world!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Users className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900">Community Memories</h2>
        </div>
        <p className="text-gray-600">Beautiful moments shared by everyone</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {memories.map((memory) => (
        <div
          key={memory.id}
          className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          {memory.image_url && (
            <div className="aspect-square overflow-hidden">
              <img
                src={memory.image_url}
                alt={memory.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {memory.title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {memory.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(memory.created_at)}</span>
              </div>
              <button className="p-2 hover:bg-red-50 rounded-full transition-colors group">
                <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}