
/**
 * Todo, some ideas for user settings:
 * - dimensions of grid, setting a maximum level goal
 * - size of grid, making the player scan more screen real estate
 *  -- could just be small, medium, large
 * - length of timer
 * - default or randomized number positions
 * - show numbers or letters
 * - hide the other numbers when player clicks '1', no timer
 * - only change level after user clicks a 'ready' button
 * 
 */
class Game {
    correctGuess = 1
    level = 5
    showNumbers = false
    cells = [];
    ignoreClick = false;
    countdown = 0;
    timerLength = 1500; 

    constructor(initialLevel = 5) {
        if ( ! Number.isInteger(initialLevel) ) throw new Error("bad initial level")

        initialLevel = Math.max(initialLevel, 1)
        initialLevel = Math.min(initialLevel, 25)
        this.level = initialLevel


	window.addEventListener("countdown", (event) => console.log(event.detail.color));
        // this.restartGame()
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    getShuffledArray() {
        let arr = new Array(25).fill(0)
        for (let i = 0; i < this.level; i++) {
            arr[i] = i + 1
        }

        this.shuffleArray(arr)
        return arr.map((number) => {
            let cell = { number }

            if (number == 0) {
                cell.state = 'blank'
            } else {
                cell.state = 'hidden'
            } 

            return cell
        })
    }

    testGuess(guess) {
        if ( ! guess.number || guess.state == 'revealed' || this.ignoreClick) return; 

        guess.state = 'revealed';
        console.log('guess had value ', guess)

        if (guess.number != this.correctGuess) {
            this.showNumbers = true
	    this.level--;
            console.log('incorrect')
            this.ignoreClick = true
	    setTimeout(() => {
	        this.showNumbers = true;
                setTimeout(() => this.restartGame(), 2000)
	    }, 750)
            return false;
        }

        if (this.correctGuess == this.level) {
            this.level++;
            this.ignoreClick = true
            console.log('correct, level up')
            setTimeout(() => this.restartGame(), 2000)
            return false;
        }

        console.log('correct')
        this.correctGuess++;
        return true;
    }

    setTimerLength(timerLength) {
	console.log('new timer length', timerLength);
	this.timerLength = timerLength;
	setTimeout(() => this.restartGame(), 500);
    }

    restartGame() {
        console.log('restart game');
        this.showNumbers = false;
        this.ignoreClick = true;
        this.cells = this.getShuffledArray();
        this.correctGuess = 1;

        let countdown = 3;
        this.countdown = countdown;
        let interval = setInterval(() => {
	    window.dispatchEvent( new CustomEvent("countdown", { detail: { color: this.getCountdownColor(countdown) }  }) )
            if (countdown == 0) {
                clearInterval(interval);
                this.showNumbers = true;
                setTimeout(() => {
                    console.log('timeout')
                    this.showNumbers = false
                    this.ignoreClick = false
                }, this.timerLength);
                return;
            }
	    

            console.log('countdown', countdown)
            countdown--;
            this.countdown = countdown;
        }, 900);
        
    }

    getCountdownColor(number) {
        if (number == 3) {
            return "red"
        }

        if (number == 2) {
            return "yellow"
        }

        if (number == 1) {
            return "green"
        }

        return ''
    }
}
