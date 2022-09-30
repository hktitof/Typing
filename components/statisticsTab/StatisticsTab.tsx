import React from "react";
import { motion } from "framer-motion";
type Statistics = [{ round: number; wpm: number; accuracy: number }?];
export default function StatisticsTab({ statistics }: { statistics: Statistics }) {
  return (
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
                    Cpm
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-bold text-left text-gray-300 uppercase ">
                    Accurate
                  </th>
                  {/* <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        Edit
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        Delete
                                    </th> */}
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
                        <td className="px-6 py-4 text-sm  whitespace-nowrap">{item.wpm} wpm</td>
                        <td className="px-6 py-4 text-sm text-left  whitespace-nowrap">{item.accuracy}%</td>
                      </motion.tr>
                    ) : (
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium  whitespace-nowrap">{item.round}</td>
                        <td className="px-6 py-4 text-sm  whitespace-nowrap">{item.wpm} wpm</td>
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
  );
}
