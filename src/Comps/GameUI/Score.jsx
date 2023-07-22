import React from 'react'

export function Score({ score, attempted, restart }) {
  return (
    <div className='card w-75 shadow-sm mx-auto'>
      <div className="p-5">
        <div className="fs-1 text-center">
          <h1 className="mb-5 text-danger">
            Quiz Over!
          </h1>
          Yours Score is {score}.

          <h6 className="mt-2">
            You have attempted {attempted} questions.
          </h6>
          <h6 className="mt-2  text-success">
            Your Correct Answers {score / 10}.
          </h6>
          <h6 className="mt-2  text-danger">
            Your Incorrect Answers {attempted - (score / 10)}.
          </h6>

          <h6 className="mt-4">
            <button className="btn btn-primary" onClick={() =>  restart ()}>Want To play Again?</button>
          </h6>
        </div>

      </div>
    </div>
  )
}

export default Score