import React, { useEffect, useState } from 'react'
import { ToastForAttemt } from './ToastForAttemt'

export function GameUI({ quizData, setScore, score, setCurrentQuestion, currentQuestion }) {

  const [isCorrect, setIsCorrect] = useState(null)
  const [isModelOpen, setIsModelOpen] = useState(false)


  const [isMouseDown, setIsMouseDown] = useState('init')
  const [top, setTop] = useState('38px')
  const [tailHeight, setTailHeight] = useState(200)

  const [distanceFromCenter, setDistanceFromCenter] = useState(0)

  let [angle, setAngle] = useState(0)

  function moveToNext(param) {
    setCurrentQuestion(param)
  }

  function reset() {
    setTop('38px')
    setTailHeight(200)
    setAngle(0)
    let answer_cards = document.querySelectorAll('.answer-card')
    answer_cards.forEach(item => {
      item.classList = "answer-card"
    })

  }

  useEffect(() => {
    reset()
  }, [quizData])

  useEffect(() => {
    let controller = document.querySelector('#controller_wrapper')
    if (isMouseDown == 'down') {
      controller.addEventListener('mousemove', handleMouseMove)

    } else if (isMouseDown == 'up') {
      controller.removeEventListener('mousemove', handleMouseMove)
      setTop(`${tailHeight - 36}px`)

      let answer_cards = document.querySelectorAll('.answer-card')

      console.log(answer_cards[0].classList, distanceFromCenter);

      let card_width = answer_cards[0].clientWidth

      // answer_cards[0].classList.add('card-shooted')

      // <======= ("first card") =========>
      if (distanceFromCenter < (-1 * (card_width + 5)) && distanceFromCenter > (-2 * card_width) + 5) {
        setTimeout(() => {
          answer_cards[0].classList.add('card-shooted')
          // if(quizData?.options
          //   )

          if (quizData.answer == answer_cards[0]?.innerText) {
            answer_cards[0].classList.add('card-right')
            // setIsCorrect(true)
            setScore(prevState => prevState += 10)
          } else {
            answer_cards[0].classList.add('card-wrong')
            // setIsCorrect(false)

          }

        }, 400)

        setTimeout(() => {
          setIsModelOpen(true)
        }, 700)
      }


      // <======= ("second card") =========>
      if (distanceFromCenter < 0 && distanceFromCenter > (-1 * (card_width + 5))) {
        // if (distanceFromCenter < 0 && distanceFromCenter > card_width - 5) {
        setTimeout(() => {
          answer_cards[1].classList.add('card-shooted')

          if (quizData.answer == answer_cards[1]?.innerText) {
            answer_cards[1].classList.add('card-right')
            // setIsCorrect(true)
            setScore(prevState => prevState += 10)

          } else {
            answer_cards[1].classList.add('card-wrong')
            // setIsCorrect(false)

          }
        }, 400)

        setTimeout(() => {
          setIsModelOpen(true)
        }, 700)
      }


      // <======= ("third card") =========>
      if (distanceFromCenter > 0 && distanceFromCenter < card_width + 5) {
        setTimeout(() => {
          answer_cards[2].classList.add('card-shooted')


          if (quizData.answer == answer_cards[2]?.innerText) {
            answer_cards[2].classList.add('card-right')
            // setIsCorrect(true)
            setScore(prevState => prevState += 10)
          } else {
            answer_cards[2].classList.add('card-wrong')
            // setIsCorrect(false)

          }
        }, 400)

        setTimeout(() => {
          setIsModelOpen(true)
        }, 700)
      }


      // <======= ("fourth card") =========>
      if (distanceFromCenter > card_width + 5 && distanceFromCenter < (2 * card_width) + 5) {
        setTimeout(() => {
          answer_cards[3].classList.add('card-shooted')

          if (quizData.answer == answer_cards[3]?.innerText) {
            answer_cards[3].classList.add('card-right')
            // setIsCorrect(true)
            setScore(prevState => prevState += 10)
          } else {
            answer_cards[3].classList.add('card-wrong')
            // setIsCorrect(false)
          }
        }, 400)

        setTimeout(() => {
          setIsModelOpen(true)
        }, 700)
      }

      if ((distanceFromCenter < (-2 * card_width) + 5) || (distanceFromCenter > (2 * card_width) + 5) ) {
        console.log('outofrange');
        setTimeout(()=>{
          // reset()
          setTop('38px')
        },200)
      }



    }

    return () => {
      controller.removeEventListener('mousemove', handleMouseMove)
      setTop('38px')

    }

  }, [isMouseDown])


  const handleMouseDown = (event) => {
    setIsMouseDown('down')
  }
  const handleMouseUp = (event) => {
    setIsMouseDown('up')

  }
  const handleMouseMove = (event) => {
    let controller = document.querySelector('#controller_wrapper')

    let screen_width = window.innerWidth;
    let screen_height = window.innerHeight;

    let controller_width = controller.clientWidth
    let controller_height = controller.clientHeight

    let client_x = event.clientX - (screen_width - controller_width)
    let client_y = event.clientY - (screen_height - controller_height)

    let center_x = controller_width / 2
    let center_y = controller_height


    // to find angle between cursor position and center point of controller
    let angle = Math.atan2(client_y - center_y, client_x - center_x) * (180 / Math.PI)


    // accurate rotation for tablet screen
    if (screen_width <= 1024 && screen_width >= 768) {
      let accurateAngle = ((angle * Math.PI)) + 360
      setAngle(accurateAngle);
      let secValue = 1 / Math.cos(accurateAngle * Math.PI / 180);
      let tanValue = Math.tan(accurateAngle * Math.PI / 180)
      let distance = tanValue * controller_height

      setDistanceFromCenter(distance)

      if (secValue < 0) {
        let height = secValue * (-1) * controller_height
        setTailHeight(height)
      } else {
        let height = secValue * controller_height
        setTailHeight(height)
      }

    }

    // accurate rotation for mobile screen
    if (screen_width < 768) {
      let accurateAngle_1 = angle - 270

      setAngle(accurateAngle_1);
      let secValue = 1 / Math.cos(accurateAngle_1 * Math.PI / 180);
      let tanValue = Math.tan(accurateAngle_1 * Math.PI / 180)
      let distance = tanValue * controller_height

      setDistanceFromCenter(distance)

      if (secValue < 0) {
        let height = secValue * (-1) * controller_height
        setTailHeight(height)
      } else {
        let height = secValue * controller_height
        setTailHeight(height)
      }
    }

    // accurate rotation for desktop or laptop screen
    if (screen_width > 1024) {
      let accurateAngle_2 = (angle * Math.PI) + 90
      setAngle(accurateAngle_2)
      let secValue = 1 / Math.cos(accurateAngle_2 * Math.PI / 180);
      let tanValue = Math.tan(accurateAngle_2 * Math.PI / 180)
      let distance = tanValue * controller_height

      setDistanceFromCenter(distance)

      if (secValue < 0) {
        let height = secValue * (-1) * controller_height
        setTailHeight(height)
      } else {
        let height = secValue * controller_height
        setTailHeight(height)
      }
    }

  }


  return (
    <div className="game-ui">
      <div className="card mx-auto">
        <div className="question-wrapper">
          <h5 className="d-flex justify-content-start">
            <span className="me-2">Q.{`${currentQuestion+1} `}  </span><span className="">{quizData?.question}</span></h5>
        </div>
        <div className="cards-wrapper">
          {quizData?.options?.map((option, i) => (
            <div className={`answer-card`} id={`card-${i}`}>
              <div className="">
                {option}
              </div>
            </div>
          ))}
        </div>
        <div
          className="controller-wrapper"
          id="controller_wrapper"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div className="controller-pad">
            <div
              className="arrow-tail"
              style={{ "--angle": angle + 'deg', "--tail-height": tailHeight + 'px' }}
            >
              <div
                className="arrow-head"
                style={{ '--top': top }}
              >

              </div>

            </div>
          </div>
        </div>
      </div>

      {
        isModelOpen && (
          <ToastForAttemt isCorrect={isCorrect} moveToNext={moveToNext} currentQuestion={currentQuestion} setIsModelOpen={setIsModelOpen} />
        )
      }
    </div>
  )
}

export default GameUI