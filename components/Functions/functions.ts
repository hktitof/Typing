type wordsStatus = [{ word: string; typedStatus: boolean; indexFrom: number; indexTo: number }?];
type Data = [wordsStatus, [{ char: string; charColor: string }?], { CursorPosition: number }];
type ActiveWordWithIndex = {
    wordIndex: number;
    wordDetail: {
      word: ReturnType<() => string>;
      typedStatus: boolean;
      indexFrom: number;
      indexTo: number;
    };
  };

/**
 * @note use minLength & maxLength to limit the quote length
 * @default_URL : https://api.quotable.io/random?minLength=100&maxLength=140
 */
 export const getData = async (
    arg_state: React.Dispatch<React.SetStateAction<Data>>,
    setActiveWordWithIndex: React.Dispatch<React.SetStateAction<ActiveWordWithIndex>>,
    setRoundCounter: React.Dispatch<React.SetStateAction<number>>,
    roundCounter: number
  ) => {
    fetch("/api/typing/10")
      .then(response => response.json())
      .then(data => {
        // ?UNCOMMENT THIS TO MODIFY THE QUOTE FOR TESTING
        // data.quote = "j";
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
        const temArray: Data = [wordsAndStatus, [], { CursorPosition: 0 }]; //temporary array to hold the data
  
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


  type CharAndColor = { char: string; charColor: string };
// this function will calculate the wpm
export const calculateWpm = (input: CharAndColor[], time: number) => {
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


  // this function will calculate the accuracy
export const calculateAccuracy = (input: CharAndColor[]) => {
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
  }