const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("SearchBtn")
const resultsDiv = document.getElementById("results")
const errorEl = document.getElementById("error")
const searchedTerm = document.getElementById("term")

searchBtn.addEventListener("click", () => {
  const word = searchInput.value.trim()
  if (!word) {
    errorEl.classList.remove("hidden")
    resultsDiv.classList.add("hidden")
    errorEl.innerHTML = "<p>Please Enter a Search Term To Continue</p>";
    setTimeout(()=>{
    errorEl.classList.add("hidden")
    },5000)
    return;
  }
  
  fetchMeaning(word)
})
async function fetchMeaning(word){
     
       searchedTerm.textContent = `Showing results for ${word}`;
  
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const data = await response.json()
    console.log(data)

    if (!Array.isArray(data)) {
      console.log(data)
     showError(data)
    }
    
    renderUI(data)
  } catch (error) {
    console.error("An error occurred", error.message)
  }
  
}

function showError(data){
  
  errorEl.classList.remove("hidden")
  
  errorEl.innerHTML = `<p>${data.message}. ${data.resolution}</p>`;
  
  
  setTimeout(() => {
  errorEl.classList.add("hidden")
  }, 15000)
}

function renderUI(words) {
  resultsDiv.innerHTML = "";
  resultsDiv.classList.remove("hidden");

  let html = "";

  words.forEach(word => {
    const wordText = word.word;

    const phonetic = word.phonetic || "";
    const audio = word.phonetics?.find(p => p.audio)?.audio;

    html += `
      <div class="word-card">
        <h2>${wordText}</h2>
        <p>${phonetic}</p>
        ${audio ? `<audio controls src="${audio}"></audio>` : ""}
    `;

    word.meanings?.forEach(meaning => {
      html += `<h4>${meaning.partOfSpeech}</h4>`;

      meaning.definitions?.forEach(def => {
        html += `
          <p>• ${def.definition}</p>
          ${def.example ? `<small>Example: ${def.example}</small>` : ""}
        `;
      });
    });

    html += `</div>`;
  });

  resultsDiv.innerHTML = html;
}

searchInput.addEventListener("input", () => {
  resultsDiv.innerHTML = "";
  
  let word = searchInput.value.trim();
  searchedTerm.textContent = `Showing results for ${word}`;
  if(word) {
    
    console.log("mambo vulai");
    errorEl.classList.add("hidden")
    
  }
  else {
    resultsDiv.classList.add("hidden");
    searchedTerm.textContent = ""
    
  }
});
