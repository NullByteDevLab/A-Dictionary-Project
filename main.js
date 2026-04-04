const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("SearchBtn")
const resultsDiv = document.getElementById("results")
const errorEl = document.getElementById("error")
const searchedTerm = document.getElementById("term")
const spinnerEl = document.querySelector(".spiner") 
let searchTimeout;


searchBtn.addEventListener("click", () => {
  const word = searchInput.value.trim()

  if (!word) {
    errorEl.classList.remove("hidden")
    resultsDiv.classList.add("hidden")
    errorEl.innerHTML = "<p>Please Enter a Search Term To Continue</p>"

    setTimeout(() => {
      errorEl.classList.add("hidden")
    }, 15000)

    return
  }

  clearTimeout(searchTimeout)
  fetchMeaning(word)
})



async function fetchMeaning(word) {

  clearTimeout(searchTimeout)

  spinnerEl.classList.remove("hidden")
  searchedTerm.textContent = `Searching for "${word}"...`

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const data = await response.json()

    console.log(data)

    
    if (!Array.isArray(data)) {
      showError(data)
      return
    }

    renderUI(data, word)

  } catch (error) {
    console.error("An error occurred", error.message)

    searchedTerm.classList.add("hidden")
    errorEl.classList.remove("hidden")

    errorEl.innerHTML = `<p>An Error Occurred: ${error.message}. Please connect to the internet and try again 😁😁</p>`

  } finally {
    spinnerEl.classList.add("hidden")
  }

  setTimeout(() => {
    errorEl.classList.add("hidden")
  }, 15000)
}


function showError(data) {

  errorEl.classList.remove("hidden")
  spinnerEl.classList.add("hidden")

  errorEl.innerHTML = `<p>${data.message}. ${data.resolution}</p>`

  setTimeout(() => {
    errorEl.classList.add("hidden")
  }, 15000)
}


function renderUI(words, searchWord) {
  resultsDiv.innerHTML = ""
  resultsDiv.classList.remove("hidden")

  searchedTerm.textContent = `Results for "${searchWord}"`

  let html = ""

  words.forEach(word => {
    const wordText = word.word
    const phonetic = word.phonetic || ""
    const audio = word.phonetics?.find(p => p.audio)?.audio

    html += `
      <div class="word-card">
        <h2>${wordText}</h2>
        <p>${phonetic}</p>
        ${audio ? `<audio controls src="${audio}"></audio>` : ""}
    `

    word.meanings?.forEach(meaning => {
      html += `<h4>${meaning.partOfSpeech}</h4>`

      meaning.definitions?.forEach(def => {
        html += `
          <p>• ${def.definition}</p>
          ${def.example ? `<small>Example: ${def.example}</small>` : ""}
        `
      })
    })

    html += `</div>`
  })

  resultsDiv.innerHTML = html
}


searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchMeaning(searchInput.value.trim())
  }
})



searchInput.addEventListener("input", () => {

  resultsDiv.innerHTML = ""
  let word = searchInput.value.trim()

  if (word) {

    errorEl.classList.add("hidden")

    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
      fetchMeaning(word)
    }, 1500)

  } else {
    resultsDiv.classList.add("hidden")
    searchedTerm.textContent = ""
    clearTimeout(searchTimeout)
  }

})
