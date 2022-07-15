import Head from 'next/head';
import * as React from 'react';
import { useEffect, useState } from 'react';
import RESPONSE from '../src/component/res.json';

export default function Home() {
  const [list, setList] = useState(new Array(6).fill(null));
  const [words, setWords] = useState('');
  const [finalWord, setFinalWords] = useState('');
  const [hasWon, setHisWon] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);

  useEffect(() => {
    setFinalWords(RESPONSE[Math.floor(Math.random() * RESPONSE.length)]);
  }, [tryAgain]);

  useEffect(() => {
    if (finalWord === '') return;
    if (list.indexOf(finalWord) !== -1) {
      setIsCompleted(true);
      setHisWon(true);
      return;
    } else if (list.indexOf(null) === -1) {
      setIsCompleted(true);
      setHisWon(false);
      return;
    }

    const handleType = (event) => {
      if (event.keyCode > 64 && event.keyCode < 91) {
        if (words.length < 5) {
          setWords(words + event.key.toLowerCase());
        }
      }
      if (event.key === 'Backspace' && words.length > 0) {
        setWords(words.slice(0, -1));
      }

      if (event.key === 'Enter' && words.length === 5) {
        let idx = list.indexOf(null);
        if (idx === -1) return;
        let _list = list;
        _list[idx] = words;
        setList([..._list]);
        setWords('');
      }
    };

    window.addEventListener('keydown', handleType);

    return () => window.removeEventListener('keydown', handleType);
  }, [words, list, setList, finalWord]);

  return (
    <div className="body">
      <Head>
        <title>Wordle</title>
      </Head>
      <div className="main">
        <div className="title">Wordle</div>
        {list.map((word, index) => {
          let idx = list.indexOf(null);
          return (
            <EachWord
              word={idx === index ? words : word}
              key={index}
              finalWord={idx === index ? '' : finalWord}
            />
          );
        })}
      </div>
      {isCompleted ? (
        <div className="result">{hasWon ? 'You Won!' : 'You Lost!'}</div>
      ) : (
        ''
      )}
      {isCompleted && !hasWon ? (
        <div className="result">
          The word was - <b>{finalWord}</b>
        </div>
      ) : (
        ''
      )}
      {isCompleted ? (
        <div className="result">
          <button
            onClick={() => {
              setList(new Array(6).fill(null));
              setHisWon(false);
              setIsCompleted(false);
              setTryAgain((prevState) => !prevState);
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

const EachWord = ({ word, finalWord }) => {
  return (
    <div className="each-word">
      {new Array(5).fill('').map((letter, index) => {
        return (
          <EachLetter
            letter={(word && word[index]) || null}
            finalWord={finalWord}
            index={index}
            key={index}
          />
        );
      })}
    </div>
  );
};

const EachLetter = ({ letter, finalWord, index }) => {
  let className = 'box';
  if (letter === finalWord[index]) {
    className += ' green';
  } else if (finalWord.indexOf(letter) !== -1) {
    className += ' yellow';
  } else if (letter && finalWord !== '') {
    className += ' grey';
  } else {
    className += '';
  }
  return <div className={className}>{letter}</div>;
};
