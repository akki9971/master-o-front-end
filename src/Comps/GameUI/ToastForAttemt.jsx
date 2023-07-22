import React from 'react'

export const ToastForAttemt = (props) => {

    const { isCorrect, moveToNext, currentQuestion, setIsModelOpen } = props

    const offset_wrapper = {
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: '0',
        left: '0',
        background: 'rgba(0,0,0,0.5)'
    }

    const toast_wrapper = {
        width: '70vw',
        height: '33vh',
        position: 'absolute',
        padding: '1rem',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: '15',
        background: 'rgba(0,0,0,0.8)'
    }
    return (
        <div style={offset_wrapper}>

            <div style={toast_wrapper} >
                {
                    isCorrect ? (
                        <div className="bg-success p-3 rounded">
                            <h2 className="text-white">
                                Well done! You have got <span className="fs-2">10</span> points!
                            </h2>
                        </div>
                    ) : (
                        <div className="bg-danger p-3 rounded">
                            <h2 className="text-white">
                                Oh ooh! You have got <span className="fs-2">0</span> points!
                            </h2>
                        </div>
                    )
                }
                <button onClick={() => { moveToNext(currentQuestion + 1); setIsModelOpen(false) }} className="btn btn-primary mt-4">Continue Quiz!</button>
            </div>
        </div>
    )
}


