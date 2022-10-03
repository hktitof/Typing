import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import StatisticsTab from "../components/statisticsTab/StatisticsTab";
import TimerSpan from "../components/timer/TimerSpan";
import About from "../components/AboutComp/About";
import Footer from "../components/Footer/Footer";
import RestartIcon from "../components/Icons/RestartIcon";
import { getData, calculateWpm, calculateAccuracy } from "../components/Functions/functions";

type ActiveWordWithIndex = {
  wordIndex: number;
  wordDetail: {
    word: ReturnType<() => string>;
    indexFrom: number;
    indexTo: number;
  };
};
type Data = [wordsStatus, [{ char: string; charColor: string }?], { CursorPosition: number }];
type wordsStatus = [{ word: string; indexFrom: number; indexTo: number }?];
type CharAndColor = { char: string; charColor: string };
type Statistics = [{ round: number; wpm: number; accuracy: number }?];

const CursorCarrotComp = () => {
  return (
    <motion.span
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: [1, 0] }}
      transition={{
        opacity: { duration: 0.8, repeat: Infinity },
      }}
      className="absolute left-0 w-[3px] lg:h-8 sm:bottom-0 top-1 sm:h-5 h-4 rounded bg-AAsecondary "
    ></motion.span>
  );
};

let keyboardEvent; // this variable will hold the keyboard event;
let eventInputLostFocus; //  this variable will hold the event that will be fired when window is resizing & input lost focus
// let timerCountingInterval;
export default function Home() {
  // ? this general state will hold the data
  const [myText, setMyText] = React.useState<Data>([[], [], { CursorPosition: 0 }]);
  // ? this state will hold the active word index and the word details
  const [activeWordWithIndex, setActiveWordWithIndex] = useState<ActiveWordWithIndex>(null);
  const [roundCounter, setRoundCounter] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);
  const absoluteTextINputRef = useRef<HTMLDivElement>(null);
  const [inputLostFocus, setInputLostFocus] = useState(false);
  const timeToType: number = 180; // default time to type
  const seconds = useRef<number>(timeToType); // this useRef will hold the remaining seconds to type
  const timerCountingInterval = useRef(); // this useRef will hold the interval used in TimerSpan Component
  const [statistics, setStatistics] = useState<Statistics>([]); // this state will hold the statistics after user finish typing

  // ? this restart will be assigned again in each render only when roundCounter increase
  const restart = useCallback(() => {
    console.log("event Listener is Removed!!!!!!!!!!");
    document.removeEventListener("keydown", keyboardEvent);
    seconds.current = timeToType;
    getData(setMyText, setActiveWordWithIndex, setRoundCounter, roundCounter);
    setActiveWordWithIndex(null);
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
  }, [roundCounter]);

  // ?update Statistics state
  const updateStatistics = useCallback(() => {
    statistics.push({
      round: roundCounter,
      wpm: calculateWpm(myText[1], timeToType - seconds.current),
      accuracy: calculateAccuracy(myText[1]),
    });
    setStatistics([...statistics]);
  }, [myText, roundCounter, statistics]);

  // add event listener to track window size to change inputLostFocus Element height
  useEffect(() => {
    if (inputLostFocus) {
      eventInputLostFocus = () => {
        console.log("window is resized..Changing inputLostFocus height");
        if (absoluteTextINputRef.current?.style && inputLostFocus) {
          absoluteTextINputRef.current.style.height = textInputRef.current.clientHeight + "px";
        }
      };
      window.addEventListener("resize", eventInputLostFocus);
    } else {
      // delete event listener when it's Focused
      window.removeEventListener("resize", eventInputLostFocus);
    }
  }, [inputLostFocus]);
  useEffect(() => {
    if (myText[0].length == 0) {
      console.log("#useEffect Getting Data.......");
      getData(setMyText, setActiveWordWithIndex, setRoundCounter, roundCounter); // setMyText is the callback function
    }
    inputRef.current?.focus();
    console.log("useEffect executed...");
  }, [myText, activeWordWithIndex, isFinished, roundCounter]);

  useEffect(() => {
    inputRef.current?.focus();
    keyboardEvent = (e: KeyboardEvent) => {
      console.log("KeyDown Detected : ", e.code);
      if ((e.metaKey || e.ctrlKey) && e.code === "Slash") {
        restart();
        console.log("Restarted By Shortcut!!!!");
      }
    };
  }, [restart]);

  useEffect(() => {
    if (isFinished) {
      console.log("event Listener added!!!");
      document.addEventListener("keydown", keyboardEvent);
    }
    console.log("useEffect add event listener and remove event listener");
  }, [isFinished, restart]);

  // this will handle new round conditions.
  useEffect(() => {
    console.log("event Listener is Removed!!!!!!!!!!");
    document.removeEventListener("keydown", keyboardEvent);
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
    setIsFinished(false); // set isFinished to false each time roundCounter changes that means each new round
    console.log("useEffect RoundCounter executed...");
  }, [roundCounter]);
  useEffect(() => {
    if (inputLostFocus) {
      if (absoluteTextINputRef.current?.style && inputLostFocus) {
        absoluteTextINputRef.current.style.height = textInputRef.current.clientHeight + "px";
      }
    } else {
      inputRef.current?.focus();
    }
  }, [inputLostFocus]);

  const handleOnChangeInput = (input: string, event: React.ChangeEvent<HTMLInputElement>) => {
    /**
     * @nextForLoop
     * this for loop to give the char its default color back, starting from activeWord first char index
     * this for loop will help  when user delete a character
     */
    for (let j = activeWordWithIndex.wordDetail.indexFrom; j < myText[1].length; j++) {
      myText[1][j].charColor = "text-gray-500";
    }

    // start validating from this index CharIndex initial
    let targetWordIndexIncrement = activeWordWithIndex.wordDetail.indexFrom;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === myText[1][targetWordIndexIncrement].char) {
        myText[1][targetWordIndexIncrement].charColor = "text-AAsecondary";
      } else {
        myText[1][targetWordIndexIncrement].charColor = "text-AAError";
      }
      targetWordIndexIncrement++;
    }
    console.log("here....");
    // checks if input is equal to the active word ( true => set inputValue to "" )
    if (input.localeCompare(activeWordWithIndex.wordDetail.word) == 0) {
      const nextWordIndex = activeWordWithIndex.wordIndex + 1;
      setActiveWordWithIndex({
        wordIndex: nextWordIndex,
        wordDetail: myText[0][nextWordIndex],
      });
      event.target.value = "";
    }

    //? INFORMATIONAL : this will set the ActiveWordIndex to next word if user typed last two words incorrectly
    // if (
    //   input.length == activeWordWithIndex.wordDetail.word.length + myText[0][activeWordWithIndex.wordIndex+1].word.length
    // ) {
    //   const nextWordIndex = activeWordWithIndex.wordIndex + 1;
    //   setActiveWordWithIndex({
    //     wordIndex: nextWordIndex,
    //     wordDetail: myText[0][nextWordIndex],
    //   });
    //   event.target.value = "";
    // }

    // set the cursor position to next target Char that will be typed of the active word
    for (let i = 0; i < myText[1].length; i++) {
      if (myText[1][i].charColor.localeCompare("text-gray-500") == 0) {
        myText[2].CursorPosition = i;
        break;
      }
    }
    setMyText([...myText]); // update the state
    // Checking if the user finished typing by checking if the last char gray color is changed!
    if (!(myText[1][myText[1].length - 1].charColor === "text-gray-500")) {
      console.log("Player Finished typing!!");

      updateStatistics();
      /**
       * @note :  next line will prevent from showing the previous text when user restarts
       *  by checking !(myText[1].length==0) when the DOM is loaded
       */
      myText[1] = [];
      setMyText([...myText]);
      setIsFinished(true);
      clearInterval(timerCountingInterval.current);
    }
  };
  const handleHeightCenter = () => {
    if (window) {
      return "h-[" + window.innerHeight / 2 + "px]";
    }
  };

  console.log("rounded Count : ", roundCounter);
  console.log("page re-rendered...");
  console.log("data : ", myText);
  console.log("Active Word : ", activeWordWithIndex);
  console.log("CursorPosition : ", myText[2].CursorPosition);
  console.log("rendering Finished-----------------------------");

  return (
    <div
      className={` bg-AAprimary min-h-screen  w-full flex flex-col justify-center items-center ${
        isFinished ? "pt-48" : ""
      }`}
    >
      {!isFinished && !(myText[1].length == 0) && (
        <>
          <main className="w-full 2xl:px-96 xl:px-80 lg:px-64 md:px-28 px-12 flex flex-col justify-center items-center space-y-12">
            <div ref={textInputRef} className="relative w-full h-full flex flex-col space-y-8  ">
              {inputLostFocus && (
                <div
                  onClick={() => {
                    setInputLostFocus(false);
                  }}
                  ref={absoluteTextINputRef}
                  className="absolute w-full z-10 bg-AAprimary opacity-90 rounded border-[0.5px] border-gray-700 flex justify-center items-center
                          hover:cursor-pointer"
                >
                  <span className="text-gray-400 font-mono">Click to continue..</span>
                </div>
              )}
              {/* Above Text : Timer and Word Per Minute */}
              <div className="w-full flex justify-between pb-8">
                <span className="text-gray-400 md:text-xl text-sm ">
                  {seconds.current == timeToType ? "0" : calculateWpm(myText[1], timeToType - seconds.current)} wpm
                </span>
                <TimerSpan
                  setIsFinished={setIsFinished}
                  inputLostFocus={inputLostFocus}
                  seconds={seconds}
                  timerCountingInterval={timerCountingInterval}
                  updateStatistics={updateStatistics}
                />
              </div>
              <div
                className="lg:text-3xl md:text-xl sm:text-xl hover:cursor-pointer flex flex-wrap px-2 "
                onClick={() => inputRef.current.focus()}
              >
                {myText[0].map((word, index) => {
                  // console.log("DOM Showing words......");
                  return (
                    <div key={index} className="flex ">
                      {word.word.split("").map((char, i) => {
                        if (
                          char.localeCompare(" ") == 0 &&
                          myText[1][word.indexFrom + i].charColor.localeCompare("text-AAError") == 0
                        ) {
                          return (
                            <div key={i} className={`relative text-AAError`}>
                              {i + word.indexFrom == myText[2].CursorPosition ? (
                                <CursorCarrotComp/>
                              ) : (
                                <></>
                              )}
                              <div className="relative">
                                &nbsp; <div className="absolute bottom-0 h-[3px] w-full bg-AAError"></div>
                              </div>
                            </div>
                          );
                        } else if (char.localeCompare(" ") == 0) {
                          return (
                            <div key={i} className="relative ">
                              {i + word.indexFrom == myText[2].CursorPosition ? (
                                <CursorCarrotComp/>
                              ) : (
                                <></>
                              )}
                              &nbsp;
                            </div>
                          );
                        } else {
                          return (
                            <div key={i} className={`relative ${myText[1][word.indexFrom + i].charColor}`}>
                              {char}
                              {i + word.indexFrom == myText[2].CursorPosition ? (
                                <CursorCarrotComp/>
                              ) : (
                                <></>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })}
              </div>
              {/**
               * @textInput
               */}
              <div className="w-full flex justify-center">
                <input
                  onBlur={() => {
                    console.log("input lost focus!!");
                    setInputLostFocus(true);
                  }}
                  ref={inputRef}
                  type="text"
                  // ?INFORMATION: uncomment the following line to see the input
                  // className="w-52 bg-AAprimary text-xl text-center text-gray-600 border-b-2 border-b-gray-600
                  //           py-2 px-4 focus:outline-none "

                  className="w-0 h-0 bg-AAprimary text-xl text-center text-gray-600  border-b-gray-600
                  py-2 px-4 focus:outline-none "
                  onChange={e => {
                    handleOnChangeInput(e.target.value, e);
                  }}
                  onKeyDownCapture={e => {
                    // prevent cursor in input from jumping two characters
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                      inputRef.current.setSelectionRange(
                        inputRef.current.value.length,
                        inputRef.current.value.length + 1
                      );
                      inputRef.current.focus();
                    }
                  }}
                />
              </div>
            </div>
          </main>
          <Footer className="absolute bottom-0" link="https://github.com/hktitof/Typing" />
        </>
      )}

      {/* Finished Section */}
      {isFinished && (
        <>
          <section className=" w-full h-full flex flex-row sm:space-x-12 space-x-4 justify-center items-center pb-16">
            {/* Shortcuts mention */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-gray-400 hover:text-AAsecondary duration-300"
            >
              <span className="sm:text-base text-xs">Windows : Ctrl + /</span>
              <span className="sm:text-base text-xs">Or</span>
              <span className="sm:text-base text-xs">Mac : Cmd + /</span>
            </motion.div>
            {/**Separator */}
            <div className="h-8 w-[2px] bg-gray-400 rounded"></div>
            {/* Restart part */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => {
                console.log("Restarted By a click!!!!");
                restart();
              }}
              className="group flex flex-row space-x-3 items-center hover:cursor-pointer"
            >
              <div className="sm:h-8 sm:w-8 h-5 w-5 ">
                <RestartIcon />
              </div>
              <span className="sm:text-lg text-sm font-mono text-gray-400 group-hover:text-AAsecondary duration-200 group-hover:translate-x-2">
                Restart
              </span>
            </motion.div>
          </section>
          {/* Round Details */}
          <section className=" w-full 2xl:px-96 xl:px-80 lg:px-64 md:px-28 sm:px-12 flex flex-col space-y-2">
            <StatisticsTab
              statistics={statistics}
              round={roundCounter}
              finishedTime={(timeToType - seconds.current).toString()}
            />
          </section>
          <About />
          <Footer className="pt-16" link="https://github.com/hktitof/Typing" />
        </>
      )}
    </div>
  );
}
