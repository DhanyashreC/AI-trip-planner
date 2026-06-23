import React from 'react'
import ChatBox from './_components/ChatBox'

function CreateNewTrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-10">
      <div>
        <ChatBox />
      </div>

      <div className="pt-10 text-center">
        <h2>Map and trip Plan to Display</h2>
      </div>
    </div>
  )
}

export default CreateNewTrip