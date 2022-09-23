import React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

let timerCountingInterval;
export default function TimerSpan({ setRoundCounter, setIsFinished, inputLostFocus }) {
  const seconds = useRef<number>(65);
  const [secondsState, setSecondsState] = useState<number>(seconds.current);
  const timerSpanRef = useRef<HTMLSpanElement>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  useEffect(() => {
    if (inputLostFocus) {
      clearInterval(timerCountingInterval); //clear interval when input is lost focus
    } else {
      timerCountingInterval = setInterval(() => {
        console.log("Timer executing...", seconds.current);
        seconds.current--;
        setSecondsState(seconds.current);
        // decreasing timer
        if (seconds.current > 60) {
          if (timerSpanRef.current) {
            if (seconds.current < 70) {
              timerSpanRef.current.innerText = "1:0" + (seconds.current - 60).toString();
            } else {
              timerSpanRef.current.innerText = "1:" + (seconds.current - 60).toString();
            }
          }
        } else if (seconds.current >= 0) {
          if (seconds.current < 10) {
            if (timerSpanRef.current) {
              timerSpanRef.current.innerText = "0:0" + seconds.current.toString();
            }
          } else {
            if (timerSpanRef.current) {
              if (seconds.current == 60) {
                timerSpanRef.current.innerText = "1:00";
              } else {
                timerSpanRef.current.innerText = "0:" + seconds.current.toString();
              }
            }
          }
        } else {
          // timer is Finished here by it self
          clearInterval(timerCountingInterval);
          setIsFinished(true);
        }

        // timerSpanRef.current.innerText=timerSecCounter.current.toString();
      }, 1000);
    }
  }, [setIsFinished, inputLostFocus]);
  return (
    <>
      {secondsState <= 5 && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          ref={timerSpanRef}
          className="text-AAError text-xl"
        >
          0:05
        </motion.span>
      )}
      {secondsState <= 15 && secondsState > 5 && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          ref={timerSpanRef}
          className="text-AAError text-xl"
        >
          0:15
        </motion.span>
      )}
      {secondsState > 15 && (
        <span ref={timerSpanRef} className="text-gray-400 text-xl">
          0:20
        </span>
      )}
    </>
  );
}
