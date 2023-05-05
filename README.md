# Black Box

## Date: 5/4/23

### By: Lark Lundberg

---

## Description

Black Box is a puzzle game invented by Eric Solomon. Five atoms are placed semi-randomly inside on a grid inside the "black box", inside which the player can't see. The player can shoot rays into the box at the edge, and atoms either be hit with the ray, returning nothing, or can bend the ray, leading it coming out of another exit. Each result gives you more information about the atoms inside.

The goal is to correctly guess the location of all the atoms with as few rays as possible.

Aesthetically, I would like the game to have an Apple II vibe

### A direct hit:

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/BlackBoxSample2.svg/1920px-BlackBoxSample2.svg.png)

### A deflection:

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlackBoxSample3.svg/1920px-BlackBoxSample3.svg.png)

### Depending on the placement, this can lead to some pretty surprising results:

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/BlackBoxSample8.svg/1920px-BlackBoxSample8.svg.png)

---

## How to Get Started:

The game will require two boards. The actual board will have n\*4 inputs for each ray. (Board sizes vary - I was thinking of going with the 8x8 to make it a little easier.) The second board will allow the player to track their guesses, and where they can submit their official guess. The second guess board is displayed over the actual board, but both need to be rendered separately.

Rendering the logic of the rays seems like the most complex part. An atom reflects all rays that cross within one cell diagonally. I would need to write a function that, at each step, calculates any effects from the eight surrounding squares in the 2D array of the board. This will probably look a lot like the Check Win function in Connect-4/Tic-Tac-Toe.

## Credits:

Images from [Wikipedia's page on Black Box](<https://en.wikipedia.org/wiki/Black_Box_(game)>)
