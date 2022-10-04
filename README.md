# Read Me



![Project Image](https://user-images.githubusercontent.com/62770500/193928007-3d46e6c7-0478-4c94-b99c-22186800751b.png)
![Project Image](https://user-images.githubusercontent.com/62770500/193928451-529ec6ea-d064-4674-8ed3-a8dc69934b65.png)

---

### Project Name :

- Speed Typing

---

### Project Link :

- Speed Typing - [click here](https://lovely-biscotti-5ba7b3.netlify.app/)

---

### Table of Contents

- [Description](#description)
- [How To Use](#how-to-use)
- [References](#references)
- [License](#license)
- [Author Info](#author-info)

---

## Description

Most jobs do not explicitly require certain typing speeds, but that's because basic typing skills are taken as a given. Thus, you should aim for a typing speed of at least 40 WPM to keep up a standard level of efficiency at work..However this project aim to help you to improve your typing speed by tracking your progress in each round and give you a score based on your typing speed and accuracy through a table of statistics.

---

## Technologies & libraries

- Next.js
- framer-motion
- Tailwind CSS
- ---
 
## Functionalities
- Stop Timer when the user stopped focus on typing 
- Restart Typing by a keyboard Shortcut (Mac : Cmd + / OR Windows : Ctrl + /)
- Tracking each round statistics through a table
- Mobile Friendly





---

## How To Use

#### Installation & Set Up
##### Step 1 : cloning the repo to your local machine

```sh
    git clone https://github.com/hktitof/Typing
```

##### Step 2 : Dependencies installation
in the root of the project "Typing", execute in your terminal the command "***yarn***"

###### ***Note: make sure you installed node & yarn package manager***


##### Step 3 : Start the development server

```sh
    yarn dev
```

#### 🚀 Building and Running for Production

1. Generate a full static production build

   ```sh
   yarn build
   ```
---
## API Description :
##### Endpoint 1 :
the following endpoint will return a json object contains "quote" and "author", for current project i displayed only the quote, **minLength** is the minimum of characters.  

```api
    /api/typing/[minLength]
```
##### notes : 
- ***minLength*** should be between 10 - 300.
- the returned quote is a chain of 
- i costumized the original Endpoint using The API Route of Nextjs, here is the Original Endpoint.

##### Original Endpiont :
###### URL : 
```api
    https://api.quotable.io/random?minLength=[minLength]
```

example :

```api
    /api/userInfoByIP/150
```
###### ***Get Request to above endpoint will return the following json data :***
```JavaScript
    {"quote":"Technology… is a queer thing. It brings you great gifts with one hand, and it stabs you in the back with the other.","author":"carrie-snow"}
```
---

### 🎨 Color Reference

- ![#64FFDA](https://via.placeholder.com/15/64FFDA/64FFDA.png)`#64FFDA`
- ![#0A192F](https://via.placeholder.com/15/0A192F/0A192F.png) `#0A192F`
- ![#D1D5DB](https://via.placeholder.com/15/D1D5DB/D1D5DB.png) `#D1D5DB`


---

## License

MIT License

Copyright (c) [2022] [Abdellatif Anaflous]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



---

## Author Info

- Linkedin - [@abdellatif-anaflous](https://www.linkedin.com/in/abdellatif-anaflous/)
- Website - [Abdellatif Anaflous](https://anaflous.com)

[Back To The Top](#description) :

