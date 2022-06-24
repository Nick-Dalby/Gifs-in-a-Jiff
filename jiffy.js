const API_KEY = 'bKHj69pJA3k5hkE88MPu0JfQhZYnJ2oQ'

const videosElement = document.querySelector('.videos')
const searchElement = document.querySelector('.search-input')
const hintElement = document.querySelector('.search-hint')
const clearElement = document.querySelector('.search-clear')

const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

const createVideo = (src) => {
  const video = document.createElement('video')
  video.className = 'video'
  video.src = src
  video.autoplay = true
  video.loop = true

  return video
}

// show spinner on loading and change hint text
const toggleLoading = (state) => {
  //if state is true we add loading class to body - otherwise remove it
  if (state) {
    document.body.classList.add('loading')
    searchElement.disabled = true
  } else {
    document.body.classList.remove('loading')
    searchElement.disabled = false
    searchElement.focus()
  }
}

const searchGiphy = (searchTerm) => {
  console.log(searchTerm)
  toggleLoading(true)
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en`
  )
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      // using the random choice function defined above to pick out a random index from the response array
      const gif = randomChoice(response.data)
      const src = gif.images.original.mp4

      // using the creat video function defined above, using the fetched src as an argument
      const video = createVideo(src)

      videosElement.appendChild(video)

      //listening for the loaded event to fire
      //when loaded we'll display on the page with a trasition
      video.addEventListener('loadeddata', (event) => {
        video.classList.add('visible')

        toggleLoading(false)

        document.body.classList.add('has-results')

        //change the hint text
        hintElement.innerHTML = `Hit enter to search for ${searchTerm} again!`
      })
    })
    .catch((error) => {
      toggleLoading(false)
      hintElement.innerHTML = `no results found for ${searchTerm}...`
    })
}

const doSearch = (event) => {
  const searchTerm = searchElement.value

  if (searchTerm.length > 2) {
    hintElement.innerHTML = `Hit enter to search for ${searchTerm}!`
    document.body.classList.add('show-hint')
  } else {
    document.body.classList.remove('show-hint')
  }

  if (event.key === 'Enter' && searchTerm.length > 2) {
    searchGiphy(searchTerm)
  }
}

searchElement.addEventListener('keyup', doSearch)

const clearSearch = (event) => {
  // remove class
  document.body.classList.remove('has-results')

  // reset contents
  videosElement.innerHTML = ''
  hintElement.innerHTML = ''
  searchElement.value = ''

  // focus cursor back onto the input
  searchElement.focus()
}


clearElement.addEventListener('click', clearSearch)

// run clearSearch function on hitting escape
document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    clearSearch()
  }
})