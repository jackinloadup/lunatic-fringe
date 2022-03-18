# Lunatic Fringe
Lunatic Fringe is a game beloved by those of us who had the privilege to play it back in the early 90s. It has a special charm that has not been replicated in games since. 

Lunatic Fringe is at risk of being lost to time. The original After Dark module only works in classic OS 9 and below. A group at [Sealie Software](http://www.sealiesoftware.com/fringe/) has created a wrapper that allows it to work on OS X, but support for their method was dropped in OS X Lion. No version has ever worked on Windows. From now on, the ability to play Lunatic Fringe is waning.

This project is an attempt to recreate Lunatic Fringe using web technologies. When finished, the game will be able to be enjoyed by anyone with a modern web browser on any platform and OS of their choosing. 

## Try it out!
[Lunatic Fringe](https://jackinloadup.github.io/lunatic-fringe/)

## Game history
Light reading can be found on Wikipedia's [After Dark](https://en.wikipedia.org/wiki/After_Dark_%28software%29#After_Dark_Games_and_onward) page. More information will be filled out as we care more.

## Code base history
Original foundation was written by [James Carnley](http://jamescarnley.com). Google Code [Project](https://code.google.com/p/lunatic-fringe/).

## Usage
NOTE: With the refactor that separated out the code into multiple files, it is no longer possible to just open up index.html in a browser due to being blocked by CORS policy. So until I think of a way to handle this to potentially get around that without requiring that you turn off blocking for CORS violations, the best way to run this locally is to run a local server to host the files. There are multiple ways you could do this, but some of the easiest ways are probably as follows:
#### VS Code Server
1. Download Visual Studio Code (it's free) https://code.visualstudio.com/
2. Find an extenstion for Visual Studio Code for running a local server (Live Server is one I found that has lots of downloads and a high star rating https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer&ssr=false#review-details)
3. Open the folder containing the code on your local machine
4. Start your local server (for the Live Server extenstion, you should be able to just click the 'Go Live' button in the bottom right corner of the Visual Studio Code window)
5. Play
#### Python Server (https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server):
1. Download Python 3 (it's free) https://www.python.org/downloads/
2. Open a terminal/cmd window in the folder containing the code on your local machine
3. Run the command `python3 -m http.server1`
4. Go to `http://localhost:8000` in the browser
5. Play

## Controls
* Up Arrow key: Accelerate
* Left Arrow key: Turn left
* Right Arrow key: Turn right
* Spacebar: Shoot
* CapsLock: Pause/Unpause
* V: Use invulnerability powerup (if available)
* B: Use turbo boost powerup (if available)

## Hey the origial game had X!
This is a work in progress. You are welcome to submit issues. Please search before creating a new one. For the more technically inclined fork and submit pull requests.

## We welcome contributions
Please note that issues and PR's may sit for a while before they get a proper response. We appreciate your patience.
