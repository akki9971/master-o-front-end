import React, { useEffect, useState } from 'react'
import { ToastForAttemt } from './ToastForAttemt'

export function GameUIMobile({ quizData, setScore, score, setCurrentQuestion, currentQuestion }) {

  const [isCorrect, setIsCorrect] = useState(null)
  const [isModelOpen, setIsModelOpen] = useState(false)


  const [isMouseDown, setIsMouseDown] = useState('init')
  const [top, setTop] = useState('38px')
  const [tailHeight, setTailHeight] = useState(200)

  const [distanceFromCenter, setDistanceFromCenter] = useState(0)
  const [cardFocused, setCardFocused] = useState('init')

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
      controller.addEventListener('touchmove', handleTouchMove)

    } else if (isMouseDown == 'up') {
      controller.removeEventListener('touchmove', handleTouchMove)

      if (cardFocused !== 'init' || cardFocused !== 'out-of-range') {

        setTop(`${tailHeight - 35}px`)

        let answer_cards = document.querySelectorAll('.answer-card')

        let card_width = answer_cards[0].clientWidth


        // <======= ("first card") =========>
        if (distanceFromCenter < (-1 * (card_width + 5)) && distanceFromCenter > (-2 * card_width) + 5) {
          shootAndCheckCorrect(answer_cards[0])
        }


        // <======= ("second card") =========>
        if (distanceFromCenter < 0 && distanceFromCenter > (-1 * (card_width + 5))) {
          shootAndCheckCorrect(answer_cards[1])
        }


        // <======= ("third card") =========>
        if (distanceFromCenter > 0 && distanceFromCenter < card_width + 5) {
          shootAndCheckCorrect(answer_cards[2])

        }


        // <======= ("fourth card") =========>
        if (distanceFromCenter > card_width + 5 && distanceFromCenter < (2 * card_width) + 5) {
          shootAndCheckCorrect(answer_cards[3])
        }

        // <======== out of range of cards =======>
        if ((distanceFromCenter < (-2 * card_width) + 5) || (distanceFromCenter > (2 * card_width) + 5)) {
          setTop('38px')
        }


      } else {
        setTop(`38px`)
      }

    }

    return () => {
      controller.removeEventListener('touchmove', handleTouchMove)
      setTop('38px')

    }

  }, [isMouseDown])

  function shootAndCheckCorrect(currentCard) {
    setTimeout(() => {
      currentCard.classList.add('card-shooted')

      if (quizData.answer == currentCard?.innerText) {
        currentCard.classList.add('card-right')
        setIsCorrect(true)
        setScore(prevState => prevState += 10)
      } else {
        currentCard.classList.add('card-wrong')
        setIsCorrect(false)
      }

    }, 400)

    setTimeout(() => {
      setIsModelOpen(true)
    }, 700)
  }


  const handleTouchStart = (event) => {
    setIsMouseDown('down')
  }
  const handleTouchEnd = (event) => {
    setIsMouseDown('up')

  }

  const handleTouchMove = (event) => {
    let controller = document.querySelector('#controller_wrapper')

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let controller_width = controller.clientWidth
    let controller_height = controller.clientHeight

    let client_x = event.touches[0].clientX - (screenWidth - controller_width)
    let client_y = event.touches[0].clientY - (screenHeight - controller_height)

    let center_x = controller_width / 2
    let center_y = controller_height


    // to find angle between cursor position and center point of controller
    let angle = Math.atan2(client_y - center_y, client_x - center_x) * (180 / Math.PI)

    let answer_cards = document.querySelectorAll('.answer-card')
    let card_width = answer_cards[0].clientWidth


    // accurate rotation for tablet screen
    if (screenWidth <= 1024 && screenWidth >= 768) {
      let accurateAngle = ((angle * Math.PI)) + 360;

      
      moveBallAccToResponsive(accurateAngle, controller_height, card_width, answer_cards)
    }
    
    // accurate rotation for mobile screen
    if (screenWidth < 768) {
      let accurateAngle_1 = angle + 90;

      
      moveBallAccToResponsive(accurateAngle_1, controller_height, card_width, answer_cards)
    }
  
  }

  function moveBallAccToResponsive(accurateAngle, controller_height, card_width, answer_cards) {
    
    //rotate ball on hover
    // limiting rotation of ball
    if(accurateAngle < -85 || accurateAngle > 85){
      return;
    } else {
      setAngle(accurateAngle);

    }

    // get horizontal distance from top center of controller  
    let secValue = 1 / Math.cos(accurateAngle * Math.PI / 180);
    let tanValue = Math.tan(accurateAngle * Math.PI / 180)
    let distance = tanValue * controller_height

    setDistanceFromCenter(distance)
    focusCardOnHover(distance, card_width, answer_cards)

    if (secValue < 0) {
      let height = secValue * (-1) * controller_height
      setTailHeight(height)
    } else {
      let height = secValue * controller_height
      setTailHeight(height)
    }
  }


  function focusCardOnHover(distance, card_width, answer_cards) {

    // <======= ("first card") =========>
    if (distance < (-1 * (card_width)) && distance > (-2 * card_width)) {
      setCardFocused('card-1')
      answer_cards[0].classList.add('card-focused')
      answer_cards[1].classList.remove('card-focused')
      answer_cards[2].classList.remove('card-focused')
      answer_cards[3].classList.remove('card-focused')

    }

    // <======= ("second card") =========>
    if (distance < 0 && distance > (-1 * (card_width))) {
      setCardFocused('card-2')
      answer_cards[1].classList.add('card-focused')
      answer_cards[0].classList.remove('card-focused')
      answer_cards[2].classList.remove('card-focused')
      answer_cards[3].classList.remove('card-focused')
    }

    // <======= ("third card") =========>
    if (distance > 0 && distance < card_width) {
      setCardFocused('card-3')
      answer_cards[2].classList.add('card-focused')
      answer_cards[0].classList.remove('card-focused')
      answer_cards[1].classList.remove('card-focused')
      answer_cards[3].classList.remove('card-focused')
    }

    // <======= ("fourth card") =========>
    if (distance > card_width && distance < (2 * card_width)) {
      setCardFocused('card-4')
      answer_cards[3].classList.add('card-focused')
      answer_cards[0].classList.remove('card-focused')
      answer_cards[1].classList.remove('card-focused')
      answer_cards[2].classList.remove('card-focused')
    }

    if ((distance < (-2 * card_width)) || (distance > (2 * card_width))) {
      setCardFocused('out-of-range')
      answer_cards[0].classList.remove('card-focused')
      answer_cards[1].classList.remove('card-focused')
      answer_cards[2].classList.remove('card-focused')
      answer_cards[3].classList.remove('card-focused')
    }

  }


  return (
    <div className="game-ui">
      <div className="card mx-auto">
        <div className="question-wrapper">
          <h5 className="d-flex justify-content-start">
            <span className="me-2">Q.{`${currentQuestion + 1} `}  </span><span className="">{quizData?.question}</span></h5>
        </div>
        <div className="cards-wrapper">
          {quizData?.options?.map((option, i) => (
            <div className={`answer-card`} id={`card-${i}`} key={i}>
              <div className="">
                {option}
              </div>
            </div>
          ))}
        </div>

        <div
          className="controller-wrapper"
          id="controller_wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="controller-pad">
            <div
              className="arrow-tail"
              style={{ "--angle": angle + 'deg', "--tail-height": tailHeight + 'px' }}
            >
              <div
                className="arrow-head bg-warning"
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
