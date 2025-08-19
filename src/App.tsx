import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MemoryForm from './components/MemoryForm'
import MemoryGrid from './components/MemoryGrid'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleMemoryAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <MemoryForm onMemoryAdded={handleMemoryAdded} />
        <MemoryGrid refreshTrigger={refreshTrigger} />
      </main>
    </div>
  )
}

export default App