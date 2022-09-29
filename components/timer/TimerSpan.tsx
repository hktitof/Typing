import React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// let timerCountingInterval;
// this will return min and sec Tens and Units
const getMinutesAndSeconds = (secondsCounts: number) => {
  if (secondsCounts >= 60) {
    const minutes = Math.floor(secondsCounts / 60);
    const secondsUnits = secondsCounts - minutes * 60;
    if (secondsUnits > 9) {
      const secondsUnit = Math.floor(secondsUnits / 10);
      return [minutes, secondsUnit, secondsUnits - secondsUnit * 10];
    } else {
      return [minutes, 0, secondsUnits];
    }
  } else {
    if (secondsCounts > 9) {
      const secondsTen = Math.floor(secondsCounts / 10);
      return [0, secondsTen, secondsCounts - secondsTen * 10];
    } else {
      return [0, 0, secondsCounts];
    }
  }
};
export default function TimerSpan({ setIsFinished, isFinished, inputLostFocus, seconds,timerCountingInterval }) {
  const [secondsState, setSecondsState] = useState<number>(seconds.current);
  const timerSpanRef = useRef<HTMLSpanElement>(null);

  // !TODO : Fix Timer is executing even if the user is finished typing that means, isFinished is true

  useEffect(() => {
    if (inputLostFocus) {
      clearInterval(timerCountingInterval.current); //clear interval when input is lost focus
    } else {
      timerCountingInterval.current = setInterval(() => {
        console.log("Timer executing...", seconds.current);
        seconds.current--;
        setSecondsState(seconds.current);

        if (seconds.current >= 0) {
          if (timerSpanRef.current) {
            const [minutes, secondsTen, secondsUnit] = getMinutesAndSeconds(seconds.current);
            timerSpanRef.current.innerText = `${minutes}:${secondsTen}${secondsUnit}`;
          }
        } else {
          // timer is Finished here by it self
          clearInterval(timerCountingInterval.current);
          setIsFinished(true);
        }
      }, 1000);
    }
  }, [setIsFinished, inputLostFocus, seconds, isFinished, timerCountingInterval]);
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
      {secondsState > 15 && <span ref={timerSpanRef} className="text-gray-400 text-xl"></span>}
    </>
  );
}
