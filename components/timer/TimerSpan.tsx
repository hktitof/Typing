import React from 'react'
import { useEffect,useRef,useState } from 'react';
import {motion} from 'framer-motion'

let timerCountingInterval;
export default function TimerSpan({setRoundCounter,setIsFinished})  {
    const seconds = useRef<number>(2);
    const [secondsState, setSecondsState] = useState<number>(seconds.current);
    const timerSpanRef = useRef<HTMLSpanElement>(null);
    // const restartTimer=useRef(restart);
    useEffect(() => {
      timerCountingInterval = setInterval(() => {
        seconds.current--;
  
        console.log("executing...", seconds.current);
        setSecondsState(seconds.current);
  
        // decreasing timer
        if (seconds.current > 60) {
          if (timerSpanRef.current) {
            timerSpanRef.current.innerText = "1:" + (seconds.current - 60).toString();
          }
        } else if (seconds.current >= 0) {
          if (seconds.current < 10) {
            if(timerSpanRef.current){
              timerSpanRef.current.innerText = "0:0" + seconds.current.toString();
            }
          } else {
            if(timerSpanRef.current){
              timerSpanRef.current.innerText = "0:" + seconds.current.toString();
            }
          }
        } else {
          // timer is Finished here by it self
        //   restart();
        clearInterval(timerCountingInterval);
        setIsFinished(true);
        }
        // timerSpanRef.current.innerText=timerSecCounter.current.toString();
      }, 1000);
    }, [setIsFinished]);
    console.log("TimerSpan executed...");
    console.log("timer : ", seconds);
    return (
      <>
        {secondsState <= 15 && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            ref={timerSpanRef}
            className="text-AAError text-xl"
          >
            0:15
          </motion.span>
        )}
        {secondsState > 15 && <span ref={timerSpanRef} className="text-gray-400 text-xl"></span>}
      </>
    );
  };
