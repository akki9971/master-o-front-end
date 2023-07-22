import React from 'react'

export function Score({ score }) {
  return (
    <div className='card w-75 shadow-sm mx-auto'>
      <div className="p-5">
        <div className="fs-1 text-center">
          <h1 className="mb-5 text-danger">
            Game Over!
          </h1>
          Yours Score is {score}.

        </div>

      </div>
    </div>
  )
}

export default Score