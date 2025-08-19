import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Camera, Save, Loader2, X, Globe } from 'lucide-react'
import CameraCapture from './CameraCapture'

interface MemoryFormProps {
  onMemoryAdded: () => void
}

export default function MemoryForm({ onMemoryAdded }: MemoryFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageCapture = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    setShowCamera(false)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const uploadImage = async (file: File, userId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `public/${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('memories')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data } = supabase.storage
      .from('memories')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setLoading(true)
    setError(null)

    try {
      let imageUrl: string | null = null
      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage)
        if (!imageUrl) {
          throw new Error('Failed to upload image')
        }
      }

      const { error } = await supabase
        .from('memories')
        .insert({
          title: title.trim(),
          description: description.trim(),
          image_url: imageUrl,
        })

      if (error) throw error

      // Reset form
      setTitle('')
      setDescription('')
      setSelectedImage(null)
      setImagePreview(null)
      
      onMemoryAdded()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900">Share a Memory</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Public Memory:</strong> This memory will be visible to everyone who visits this app. Share something beautiful! ✨
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Memory Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70"
              placeholder="Give your memory a title..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 resize-none"
              placeholder="Describe this special moment..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 group"
              >
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-purple-500 transition-colors" />
                  <p className="text-gray-600 group-hover:text-purple-600 transition-colors">
                    Click to add a photo
                  </p>
                </div>
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !title.trim() || !description.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Memory</span>
              </>
            )}
          </button>
        </div>
      </form>

      {showCamera && (
        <CameraCapture
          onImageCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  )
}