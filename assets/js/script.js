// fetch() afin de relier le fichier json (fonction async)
async function getJson() {
    const data = await fetch("http://localhost:5500/data.json");
    return data.json();
}



// fonction principale, en async également car recours à fetch( une nouvelle fois)
async function check() {
    document.querySelector('form').addEventListener('submit', valid);
    questions = await getJson(); //récupère data json sous forme de tableau
    shuffleArray(questions); //randomise le tableau
    questions = questions.slice(0, 10); //on sélectionne le nombre de questions à afficher
    affichageQuiz();
    affichageFin();
}

// fonction de tri aléatoire du tableau
function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}



function affichageFin() { //affiche le résutat
    document.querySelector('form').innerHTML += `
   <div id="result">
      <div id="score"></div>
      <button type="submit" class="btn">L'enfer sur terre !</button>
   </div>
   
   <input type="text" class="pseudo" placeholder="Pseudo" id="pseudo"></input>`;
}

function affichageQuiz() { //fonction pour afficher les questions et les choix de réponses
    var form = document.querySelector('form');
    for (i = 1; i < questions.length + 1; i++) {
        question = questions[i - 1];

        //remplissage du formulaire
        form.innerHTML += `
        <div id="question${i}" class="question">
            <div class="quest">${question.question}</div>
            <div class="answer">
                <input type="radio" name="question${i}" id="answer${i}-1" value="0">
                <label for="answer${i}-1">${question.propositions[0]}</label>
            </div>
            <div class="answer">
                <input type="radio" name="question${i}" id="answer${i}-2" value="1">
                <label for="answer${i}-2">${question.propositions[1]}</label>
            </div>
            <div class="answer">
                <input type="radio" name="question${i}" id="answer${i}-3" value="2">
                <label for="answer${i}-3">${question.propositions[2]}</label>
            </div>
            <div class="answer">
                <input type="radio" name="question${i}" id="answer${i}-4" value="3">
                <label for="answer${i}-4">${question.propositions[3]}</label>
            </div>
        </div>
        <div id="anecdote${i}" class="anecdote"></div>
      `;
    }
}

// récup des valeurs de champs radio
function inputValue(name) {
    var input = document.querySelector('input[name= ' + name + ']:checked');

    if (input) {
        return input.value;
    }
    return null;
}

function valid(event) { //valide le quiz, score et fin
    event.preventDefault();
    var score = 0;
    for (let i = 0; i < questions.length; i++) {
        var rep_nbr = inputValue('question' + (i + 1));

        var answer = questions[i].propositions[rep_nbr];
        var bonneRep = questions[i].reponse;

        var label = document.querySelectorAll('#question' + (i + 1) + ' label');

        // Réinitialise la couleur des réponses
        for (let j = 0; j < label.length; j++) {
            label[j].parentNode.classList.remove('green');
            label[j].parentNode.classList.remove('red');
        }

        // Compte le score et applique les couleurs + pop de l'anecdote sur la réponse donnée est bonne
        if (rep_nbr) {
            if (answer == bonneRep) {
                score++;
                label[rep_nbr].parentNode.classList.add('green');
            } else {
                label[rep_nbr].parentNode.classList.add('red');
            }
        }
        document.getElementById(`anecdote${i + 1}`).innerText = questions[i].anecdote; //on appelle l'instert des annecdotes
    }

    // Affiche le score + petite phrase en fonction du score
    if (score < questions.length) {
        document.getElementById('score').innerHTML = `
            Ton score est de ${score} / ${questions.length}. 
            Essaye encore!`;
    } else {
        document.getElementById('score').innerHTML = `
            Parfait!
            Tu as maîtrisé le Quiz tel un full stack, GG!`;
    }
    localStorage.setItem("score", score);
    const pseudo = inputValue(document.getElementById('pseudo'));
    localStorage.setItem("pseudo", pseudo);
}

check();