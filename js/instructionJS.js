let curSlide = 0

const allText = [
  'Black Box is a simple one-player puzzle game based on the electron microscope. Rather than examine atomic objects directly, these tools fire electron rays into an impermeable "black box". Atoms warp and shift the rays, and if they come out of the box, information about the atoms can be deduced from how the electron has changed.',
  "During normal play, you can't see inside the box. Your goal is to guess the location of the four atoms inside using the 28 ray entrances around the box. The electrons will either hit an atom directly or be turned 90 or 180 degrees.",
  'If the electrons directly hit an atom, you will only be told you got a hit.',
  'If the electrons pass a cell diagonal to an atom, they will be repelled turned 90 degrees away from the atom. You will see it come out of another entrance.',
  'If the electrons are repelled by two atoms, they will turn 180 degrees and you will get a return, or R.',
  'These three simple rules can lead to complex patterns! You may think this atom just turned to the right, based on the entrance and exit location...',
  'But it actually took a more circuitous path.',
  'The only other rule is that, if an atom is diagonal to the entrance gate, the electrons will be repelled immediately and return to the gate.',
  'The goal is to find all the atoms with a minimum of rays. Scoring is like golf: keep it as low as possible. You gain two points for every ray you use and five points for every incorrect guess, but lose five points for every correct guess. Have fun!'
]

const allImages = [
  'wikiElectronMicroscope.jpg',
  'wikiBBPicture1.png',
  'wikiBBPicture2.png',
  'wikiBBPicture3.png',
  'wikiBBPicture4.png',
  'wikiBBPicture5.png',
  'wikiBBPicture6.svg',
  'wikiBBPicture7.png',
  'wikiElectronMicroscopeMicro.jpeg'
]

const nextSlide = () => {
  curSlide = (curSlide + 1) % allText.length
  instructText.innerText = allText[curSlide]
  instructImage.src = `/img/${allImages[curSlide]}`
}

const instructText = document.getElementById('instruct-text')
const instructImage = document.getElementById('instruct-img')
const nextButton = document.getElementById('instruct-button')
nextButton.addEventListener('click', nextSlide)
