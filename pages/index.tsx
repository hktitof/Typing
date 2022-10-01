import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import StatisticsTab from "../components/statisticsTab/StatisticsTab";
import TimerSpan from "../components/timer/TimerSpan";
import About from "../components/AboutComp/About";
type ActiveWordWithIndex = {
  wordIndex: number;
  wordDetail: {
    word: ReturnType<() => string>;
    typedStatus: boolean;
    indexFrom: number;
    indexTo: number;
  };
};
type Data = [wordsStatus, [{ char: string; charColor: string }?], { CursorPosition: number }];
type wordsStatus = [{ word: string; typedStatus: boolean; indexFrom: number; indexTo: number }?];
type ActiveWordIndex = { index: number; word: string } | null;
type InputAndCursorPos = { input: string; cursorPos: number };
type CharAndColor = { char: string; charColor: string };
type Statistics = [{ round: number; wpm: number; accuracy: number }?];
/**
 * @note use minLength & maxLength to limit the quote length
 * @default_URL : https://api.quotable.io/random?minLength=100&maxLength=140
 */
const getData = async (
  arg_state: React.Dispatch<React.SetStateAction<Data>>,
  setActiveWordWithIndex: React.Dispatch<React.SetStateAction<ActiveWordWithIndex>>,
  setRoundCounter: React.Dispatch<React.SetStateAction<number>>,
  roundCounter: number
) => {
  fetch("/api/typing/10")
    .then(response => response.json())
    .then(data => {
      // data.content = "People.";
      data.quote = "j";
      const wordsAndStatus: wordsStatus = []; // this aaay will hold the words and their status
      data.quote.split(" ").forEach((item: string, index: number) => {
        const word = () => {
          if (data.quote.split(" ").length - 1 == index) {
            return item;
          } else {
            return item + " ";
          }
        };
        wordsAndStatus.push({
          word: word(),
          typedStatus: false,
          indexFrom: 0,
          indexTo: 0,
        });
      });
      // getting index of the first char and last char in the text.
      let LastIndex = 0;
      wordsAndStatus.forEach((item, index) => {
        if (index == 0) {
          item.indexFrom = 0;
          item.indexTo = item.word.length - 1;
          LastIndex = item.indexTo;
        } else {
          item.indexFrom = LastIndex + 1;
          item.indexTo = item.indexFrom + item.word.length - 1;
          LastIndex = item.indexTo;
        }
      });
      const temArray: Data = [wordsAndStatus, [], { CursorPosition: 0 }];

      /**
       * @@explanation for the following action
       * this will will convert data to array of char then push each char to the tempArray second Array
       * as objects with background default value ""
       */
      data.quote.split("").forEach((item: string, index: number) => {
        // pushing the char to the tempArray second Array
        temArray[1].push({
          char: item,
          charColor: "text-gray-500",
        });
      });
      setRoundCounter(roundCounter + 1);
      setActiveWordWithIndex({ wordIndex: 0, wordDetail: temArray[0][0] }); // set the first active word as active after Data is loaded
      /**
       * @stateChange : this will change the state that contains the data
       */
      arg_state(temArray);
    })
    .catch(err => console.error(err));
};

const calculateWpm = (input: CharAndColor[], time: number) => {
  let cpm = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i].charColor == "text-AAsecondary") {
      cpm++;
    } else if (input[i].charColor == "text-gray-500") {
      break;
    }
  }
  return Math.floor(Math.round((cpm / time) * 60) / 5);
};
const calculateAccuracy = (input: CharAndColor[]) => {
  let correct = 0;
  let incorrect = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i].charColor == "text-AAsecondary") {
      correct++;
    } else if (input[i].charColor == "text-AAerror") {
      incorrect++;
    }
  }
  return Math.floor((correct * 100) / input.length);
};

let keyboardEvent;
let eventInputLostFocus;
// let timerCountingInterval;
export default function Home() {
  // ? this will be an array of characters for now
  const [myText, setMyText] = React.useState<Data>([[], [], { CursorPosition: 0 }]);
  const [activeWordWithIndex, setActiveWordWithIndex] = useState<ActiveWordWithIndex>(null);
  const [roundCounter, setRoundCounter] = useState<number>(0);
  const [inputAndCursorPos, setInputAndCursorPos] = useState<InputAndCursorPos>(
    { input: "", cursorPos: 0 } // if input is "abc" cursorPos is 3, so to remove b index is 1 that means cursorPos - 2
  );
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);
  const absoluteTextINputRef = useRef<HTMLDivElement>(null);
  const [inputLostFocus, setInputLostFocus] = useState(false);
  const [timerIsFinished, setTimerIsFinished] = useState(false);
  const timeToType = 180;
  const seconds = useRef<number>(timeToType);
  const timerCountingInterval = useRef();
  const [statistics, setStatistics] = useState<Statistics>([]);
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

  // !TODO:

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

  // useEffect(()=>{
  //   if(!isFinished){
  //     inputRef.current?.focus();
  //   }
  //   console.log("useEffect isFinished executed...");
  // },[isFinished])

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
      // set statistics state
      statistics.push({
        round: roundCounter,
        wpm: calculateWpm(myText[1], 180 - seconds.current),
        accuracy: calculateAccuracy(myText[1]),
      });
      setStatistics([...statistics]);
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
  const handleHeightCenter=()=>{
    if(window){
      return "h-["+window.innerHeight/2+"px]";
    }
  }

  console.log("rounded Count : ", roundCounter);
  console.log("page re-rendered...");
  console.log("data : ", myText);
  console.log("Active Word : ", activeWordWithIndex);
  console.log("input : ", inputAndCursorPos.input);
  console.log("CursorPosition : ", myText[2].CursorPosition);
  console.log("rendering Finished-----------------------------");

  return (
    <div className={` bg-AAprimary min-h-screen  w-full flex flex-col justify-center items-center ${isFinished ?"pt-48":""}`}>
      {!isFinished && !(myText[1].length == 0) && (
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
                {seconds.current == 180 ? "0" : calculateWpm(myText[1], 180 - seconds.current)} wpm
              </span>
              <TimerSpan
                setIsFinished={setIsFinished}
                inputLostFocus={inputLostFocus}
                seconds={seconds}
                timerCountingInterval={timerCountingInterval}
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
                              <motion.span
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: [1, 0] }}
                                transition={{
                                  opacity: { duration: 0.8, repeat: Infinity },
                                }}
                                className="absolute left-0 w-[3px] lg:h-8 sm:bottom-0 top-1 sm:h-5 h-4 rounded bg-AAsecondary "
                              ></motion.span>
                            ) : (
                              <></>
                            )}
                            _
                          </div>
                        );
                      } else if (char.localeCompare(" ") == 0) {
                        return (
                          <div key={i} className="relative ">
                            {i + word.indexFrom == myText[2].CursorPosition ? (
                              <motion.span
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: [1, 0] }}
                                transition={{
                                  opacity: { duration: 0.8, repeat: Infinity },
                                }}
                                className="absolute left-0 w-[3px] lg:h-8 sm:bottom-0 top-1 sm:h-5 h-4 rounded bg-AAsecondary "
                              ></motion.span>
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
                              <motion.div
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: [1, 0] }}
                                transition={{
                                  opacity: { duration: 0.8, repeat: Infinity },
                                }}
                                className="absolute left-0 w-[3px] lg:h-8 sm:bottom-0 top-1 sm:h-6 h-4 rounded bg-AAsecondary "
                              ></motion.div>
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
                className="w-52 bg-AAprimary text-xl text-center text-gray-600 border-b-2 border-b-gray-600 
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
                className="flex flex-col items-center text-gray-500 hover:text-AAsecondary duration-300"
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
                <div className="h-8 w-8 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-500 group-hover:text-AAsecondary group-hover:rotate-180 duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                    />
                  </svg>
                </div>
                <span className="sm:text-lg text-sm font-mono text-gray-500 group-hover:text-AAsecondary duration-200 group-hover:translate-x-2">
                  Restart
                </span>
              </motion.div>
            </section>
            {/* Round Details */}
            {/* <section className="w-full flex flex-row justify-around"></section> */}
            <section className=" w-full 2xl:px-96 xl:px-80 lg:px-64 md:px-28 sm:px-12 flex flex-col space-y-2">
              {/* <div className="w-full flex flex-row justify-between px-1">
                <div className="text-lg text-gray-400">round {roundCounter} : </div>
                <div className="text-lg text-gray-400">Finished in {(timeToType - seconds.current).toString()} sec</div>
              </div> */}
              <StatisticsTab
                statistics={statistics}
                round={roundCounter}
                finishedTime={(timeToType - seconds.current).toString()}
              />
            </section>
            <About/>
        </>
            

      )}
    </div>
  );
}
