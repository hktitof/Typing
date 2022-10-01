import React from "react";
import { motion } from "framer-motion";
type Statistics = [{ round: number; wpm: number; accuracy: number }?];
export default function StatisticsTab({
  statistics,
  round,
  finishedTime,
}: {
  round: number;
  finishedTime: string;
  statistics: Statistics;
}) {
  const getTopScore = () => {
    if (statistics.length > 1) {
      let topScore = statistics[0].wpm;
      let topScoreIndex = 0;
      statistics
        .slice(0)
        .reverse()
        .forEach((item, index) => {
          if (item.wpm > topScore) {
            topScore = item.wpm;
            topScoreIndex = index;
          }
        });
      return topScoreIndex;
    } else {
      return null;
    }
  };
  const result = getTopScore();
  const isTopScore = (index: number) => {
    if (result == null) {
      return <></>;
    } else {
      return index === result ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-yellow-300"
        >
          TopScore
        </motion.span>
      ) : (
        <></>
      );
    }
  };

  // !TODO: fix TopScore not showing up next the right top score
  console.log("score list : ", statistics);
  return (
    <>
      <div className="w-full flex flex-col spacey-y-6">
        <div className="w-full flex justify-center">
          <span className="sm:text-xl text-sm text-gray-400 underline ">Statistics</span>
        </div>
        <div className="w-full flex flex-row justify-between px-1">
          <div className="sm:text-lg text-sm text-gray-400">round {round.toString()} : </div>
          <div className="sm:text-lg text-sm text-gray-400">Finished in {finishedTime} sec</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg border-gray-500">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-500 border border-gray-500">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-300 uppercase ">
                      ROUND
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-300 uppercase ">
                      Wpm
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-300 uppercase ">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-AAsecondary">
                  {statistics
                    .slice(0)
                    .reverse()
                    .map((item, index) => {
                      return index == 0 ? (
                        <motion.tr
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            default: {
                              duration: 0.3,
                              ease: [0, 0.71, 0.2, 1.01],
                            },
                            scale: {
                              type: "spring",
                              damping: 5,
                              stiffness: 100,
                              restDelta: 0.001,
                            },
                          }}
                        >
                          <td className="px-6 py-4 text-sm font-medium  whitespace-nowrap">{item.round}</td>
                          <td className="px-6 py-4 text-sm flex sm:flex-row  flex-col   whitespace-nowrap">
                            <span className="sm:order-2 order-1 sm:pl-2">{isTopScore(index)}</span>
                            <span>{item.wpm} wpm </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-left  whitespace-nowrap">{item.accuracy}%</td>
                        </motion.tr>
                      ) : (
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium  whitespace-nowrap">{item.round}</td>
                          <td className="px-6 py-4 text-sm flex sm:flex-row flex-col  whitespace-nowrap">
                            <span className="sm:order-2 order-1 sm:pl-2">{isTopScore(index)}</span>
                            <span>{item.wpm} wpm </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-left  whitespace-nowrap">{item.accuracy}%</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
