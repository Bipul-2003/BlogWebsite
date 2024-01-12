import React from 'react'

const App = () => {
  console.log(import.meta.env.VITE_APPWRITE_URL)
  return (
    <div className="flex justify-center items-center h-screen bg-[#1b1b1a] text-cyan-50">
      <div className="bg-slate-700 p-8 rounded-lg hover:bg-white hover:text-black hover:scale-150 transition ease-in-out">Hello</div>
    </div>

  )
}

export default App