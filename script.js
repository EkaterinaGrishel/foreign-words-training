const words = [
  {
    word: 'set',
    translation: 'устанавливать',
    example: 'set a password'
  },
  {
    word: 'get',
    translation: 'получать',
    example: 'to get data'
  },
  {
    word: 'remove',
    translation: 'удалять',
    example: 'remove from list'
  },
  {
    word: 'add',
    translation: 'добавлять',
    example: 'add class'
  },
  {
    word: 'find',
    translation: 'находить',
    example: 'find number'
  }
]

const studyMode = document.querySelector('#study-mode');
const studyCards = document.querySelector('.study-cards');
const slider = document.querySelector('.slider');
const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const flipCardInner = document.querySelector('.flip-card-inner');
const flipCardFront = document.querySelector('.flip-card-front');
const flipCardBack = document.querySelector('.flip-card-back');
const cardBack = document.querySelector('#card-back');
const back = document.querySelector('#back');
const exam = document.querySelector('#exam');
const next = document.querySelector('#next');
const shuffleWords = document.querySelector('#shuffle-words');
const resultsModal = document.querySelector('.results-modal');
const examMode = document.querySelector('#exam-mode');
const sliderControls = document.querySelector('.slider-controls');
const examCards = document.querySelector('#exam-cards');
let index = 0;



flipCard.addEventListener('click', () => {
  flipCard.classList.toggle('active');
});


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// Функция для отрисовки одной карточки в режиме тренировки
const copyWords = words.slice();
shuffle(copyWords);

function prepareCardWord(wordItem) {
  const { word, translation, example } = wordItem;

  const card = new DocumentFragment();

  const elementInner = document.createElement('div');
  elementInner.classList.add('flip-card-inner');

  const elementFront = document.createElement('div');
  elementFront.classList.add('flip-card-front');
  elementInner.append(elementFront);

  const elementFrontDiv = document.createElement('div');
  elementFront.append(elementFrontDiv);

  const frontText = document.createElement('h1');
  elementFrontDiv.append(frontText);
  frontText.textContent = word;


  const elementBack = document.createElement('div');
  elementBack.classList.add('flip-card-back');
  elementInner.append(elementBack);

  const elementBackDiv = document.createElement('div');
  elementBack.append(elementBackDiv);

  const backText = document.createElement('h1');
  elementBackDiv.append(backText);
  backText.textContent = translation;

  const backExample = document.createElement('p');
  elementBackDiv.append(backExample);

  const backExampleStyle = document.createElement('b');
  backExample.append(backExampleStyle);
  backExampleStyle.textContent = 'Пример: ';

  const backExampleSpan = document.createElement('span');
  backExample.append(backExampleSpan);
  backExampleSpan.textContent = example;

  card.append(elementInner);

  flipCard.append(card);

  return card;
}

//  Функция для отрисовки всех карточек в режиме тренировки

function renderItems(array) {
  flipCard.innerHTML = "";
  array.forEach((item) => {
    flipCard.append(prepareCardWord(item));
  })
}
renderItems(copyWords);


// Функция для скрытия всех карточек кроме первой в режиме тренировки

const flipCardsInner = document.querySelectorAll('.flip-card-inner');

function hideCards() {
  flipCardsInner.forEach((item, index) => {
    item.dataset.index = index;
    if (index !== 0) item.classList.add('hidden');
  })
}

hideCards();


// Стрелка вперед

next.addEventListener('click', () => {
  currentWord.textContent = ++currentWord.textContent;
  back.disabled = false;
  if (currentWord.textContent === totalWord.textContent) {
    next.disabled = true;
    back.disabled = false;
  };

  flipCardsInner[index].classList.add('hidden');
  index++;
  flipCardsInner[index].classList.remove('hidden');

});

// Стрелка назад

back.addEventListener('click', () => {
  currentWord.textContent = --currentWord.textContent;
  back.disabled = false;
  next.disabled = false;
  if (currentWord.textContent <= 1) {
    back.disabled = true;
  };

  flipCardsInner[index].classList.add('hidden');
  index--;
  flipCardsInner[index].classList.remove('hidden');

});


// Режим тестирования

function prepareCardExamFront(arr) {
  const { word } = arr;

  const cardExamFront = new DocumentFragment();

  const elementFrontDiv = document.createElement('div');
  elementFrontDiv.classList.add('card');
  elementFrontDiv.dataset.index = index;


  const frontText = document.createElement('p');
  elementFrontDiv.append(frontText);
  frontText.textContent = word;

  cardExamFront.append(elementFrontDiv);

  examCards.append(cardExamFront);

  return cardExamFront;
}


function prepareCardExamBack(arr) {
  const { translation } = arr;

  const cardExamBack = new DocumentFragment();

  const elementBackDiv = document.createElement('div');
  elementBackDiv.classList.add('card');
  elementBackDiv.dataset.index = index;

  const backText = document.createElement('p');
  elementBackDiv.append(backText);
  backText.textContent = translation;

  cardExamBack.append(elementBackDiv);

  examCards.append(cardExamBack);

  return cardExamBack;
}


function renderItemsExam(arr) {
  arr.forEach((item) => {
    examCards.append(prepareCardExamFront(item));
    examCards.append(prepareCardExamBack(item));
    index++;
  });
};



let matchedCard = 0;
let hasClickedCard = false;
let loackBoard = false;
let firstWord;
let secondWord;


exam.addEventListener('click', () => {
  renderItemsExam(words);
  examMode.classList.remove('hidden');
  studyCards.classList.add('hidden');
  sliderControls.classList.add('hidden');
  studyMode.classList.add('hidden');


  const cards = examCards.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('click', clickCard);
  });
})

const clickCard = (event) => {
  if (loackBoard) return;
  let clickedWord = event.target.closest('.card');

  if (clickedWord === firstWord) return;

  if (!hasClickedCard) {
    hasClickedCard = true;
    firstWord = clickedWord;
    firstWord.classList.add('correct');
  } else {
    hasClickedCard = false;
    secondWord = clickedWord;
    loackBoard = false;
    checkMatchedWords();
  };
}


function checkMatchedWords() {
  if (firstWord.dataset.index === secondWord.dataset.index) {
    matchedCard++;

    if(matchedCard === words.length){
      setTimeout(() => {
      alert('Тестирование завершино успешно');
    }, 600);
    };

    firstWord.classList.add('fade-out');
    secondWord.classList.add('fade-out');
    firstWord.removeEventListener('click', clickCard);
    secondWord.removeEventListener('click', clickCard);
  } else {
    secondWord.classList.add('wrong');
    loackBoard = true;
    setTimeout(() => {
      firstWord.classList.remove('correct');
      secondWord.classList.remove('wrong');
      loackBoard = false;
    }, 500);
  };
}