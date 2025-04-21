const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const startPage = document.querySelector(".startPage")
const questionsPage = document.querySelector(".questionsPage")
const endPage = document.querySelector(".endPage")

const questionBody = document.querySelector(".questionBody")
const question = document.getElementById("question")
const questionCount = document.getElementById("questionCount")
const questionTimer = document.getElementById("questionTimer")
const questionOptions = document.getElementById("questionOptions")
const finalScore = document.querySelector(".finalScore")

// shows the start page only
questionsPage.style.display = "none";
endPage.style.display       = "none";
startPage.style.display     = "block";  

let triviaUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
let arrayQuestion = [];
let questionIndex = 0;
let score = 0;
let count = 10;
let countdown;

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);

// starts the trivia
function startQuiz() {
    questionIndex = 0;
    score = 0;
    
    startPage.style.display = "none";
    questionsPage.style.display = "block";
    endPage.style.display = "none";

    nextBtn.innerHTML = "Next";
    loadQuestions();
  }
  
  // fetching the trivia questions from the online API
   function loadQuestions(){
    fetch(triviaUrl)
    .then((response => response.json()) )
    .then((data => {
        arrayQuestion = data.results;
        displayQuestion(arrayQuestion[questionIndex])
    }))
  }

  // displays the trivia questions one after another
  function displayQuestion(questionData){
    console.log(questionData)
    count = 10;
    clearInterval(countdown);
    question.innerHTML = questionData.question;
    questionCount.innerHTML = questionIndex + 1;
    loadAnswers(questionData);
}


function loadAnswers(questionData){
    questionOptions.innerHTML = "";         // clears out the previous question
    let answers = [...questionData.incorrect_answers, questionData.correct_answer];   
    answers = answers.sort(() => (Math.random() - 0.5));

    answers.forEach((answer) => {
        let option = document.createElement("li")
        option.innerHTML = answer;
        option.addEventListener("click", ()=>{
            checkAnswer(option, answers, questionData.correct_answer);      // checks if answer picked is correct
        });

        option.addEventListener("mouseover", handleMouseover);     
        option.addEventListener("mouseout", handleMouseout);

        questionOptions.append(option);
    })

    questionBody.style.display = "block";
    displayTimer();
}

function handleMouseover(event) {
    event.target.style.backgroundColor = "#F5F5DC";
}
function handleMouseout(event) {
    event.target.style.backgroundColor = "#f9f9f9"; 
}
function checkAnswer(answerOptions, answers, correctAnswer){
    let correctElement;

    answers.forEach((answer)=>{
        if(answer===correctAnswer){
            correctElement=[...questionOptions.childNodes].find((li)=>li.innerText===htmlDecode(correctAnswer))
        }
    })

    questionOptions.childNodes.forEach((li)=>{
        li.classList.add("disable")
    })
    if(htmlDecode(correctAnswer)===answerOptions.innerText){
        answerOptions.classList.add("correct")
        score++;
    }
    else{
        answerOptions.classList.add("Incorrect")
        correctElement.classList.add("correct")
    }
    clearInterval(countdown);
}

nextBtn.addEventListener("click", ()=>{
    questionTimer.innerHTML = "10"
    if(nextBtn.innerText=="Next"){
    questionIndex = questionIndex + 1
    displayQuestion(arrayQuestion[questionIndex])}
    else{
        showAnswer()
    }


if(questionIndex == 9){
    nextBtn.innerText = "Submit trivia"
}
})

function showAnswer(){
    questionsPage.style.display = "none"
    endPage.style.display = "block";
    finalScore.innerHTML = score;
    questionCount.innerHTML = 1;
    clearInterval(countdown)
    count = 10;
}

// countdown function
const displayTimer=()=> {
    countdown = setInterval(()=>{
        count--;
        questionTimer.innerHTML = count;

        if (count <= 0) {
            clearInterval(countdown);

            questionOptions.childNodes.forEach(li => li.classList.add("disable"));

            setTimeout(() => {
                nextBtn.click();  
              }, 800);  
        }
    }, 1000)
}
function htmlDecode(html){
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}