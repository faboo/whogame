"use client"

import './globals.css';
import {useContext, useState, useEffect, useTransition, useRef, RefObject} from 'react'
import {Game, GameContext} from './game.ts'
import Board from './components/board.tsx'
import Score from './components/score.tsx'
import GameOver from './components/gameOver.tsx'

const Keypress:{[key: string]: (game:Game) => void} = 
	{ 'h': game => game.move(-1, 0)
	, 'l': game => game.move(1, 0)
	, 'k': game => game.move(0, -1)
	, 'j': game => game.move(0, 1)
	, 'y': game => game.move(-1, -1)
	, 'u': game => game.move(1, -1)
	, 'b': game => game.move(-1, 1)
	, 'n': game => game.move(1, 1)

	, '.': game => game.tick()

	, 't': game => game.teleport()
	, 's': game => game.screwDriver()
	}

// Synonyms
Keypress['ArrowLeft'] = Keypress['h']
Keypress['ArrowRight'] = Keypress['l']
Keypress['ArrowUp'] = Keypress['k']
Keypress['ArrowDown'] = Keypress['j']
Keypress['Home'] = Keypress['y']
Keypress['PageUp'] = Keypress['u']
Keypress['End'] = Keypress['b']
Keypress['PageDown'] = Keypress['n']

Keypress['4'] = Keypress['h']
Keypress['6'] = Keypress['l']
Keypress['8'] = Keypress['k']
Keypress['2'] = Keypress['j']
Keypress['7'] = Keypress['y']
Keypress['9'] = Keypress['u']
Keypress['1'] = Keypress['b']
Keypress['3'] = Keypress['n']

Keypress['5'] = Keypress['.']


export default function Who(){
	const [init, setInit] = useState(false)
	const game:Game = useContext(GameContext)
  const [isPending, startTransition] = useTransition()
	const terminated:RefObject<HTMLDialogElement> = useRef(null as any)
	const wonLevel:RefObject<HTMLDialogElement> = useRef(null as any)

	function onKey(event:KeyboardEvent){
		let handler:((game:Game) => void)|undefined = undefined

		if(event.key in Keypress)
			handler = Keypress[event.key]

		if(handler){
			startTransition(() => handler(game))
			event.preventDefault()
			event.stopImmediatePropagation()
		}

		if(game.dead){
			game.playSound('exterminate')
			terminated.current.showModal()
		}
		else if(game.won){
			game.playSound('tardis')
			wonLevel.current.showModal()
		}
	}

	function restart(){
		terminated.current.close()
		startTransition(() => game.restart())
	}

	function nextLevel(){
		wonLevel.current.close()
		startTransition(() => game.nextLevel())
	}

	useEffect(() => {
		if(game.level == 0)
			startTransition(() => game.restart())
	})

	// React doesn't fire key events on body without a text target, so listen manually
	useEffect(() => window.document.body.addEventListener('keyup', onKey))

	return (
	<>
		<h1>Escape the Daleks!</h1>

		<Score game={game} />
		<Board game={game} />

		<GameOver ref={terminated} message="You have been exterminated!" button="Restart" onClick={restart} />
		<GameOver ref={wonLevel} message="You have won!" button="Play Next Level" onClick={nextLevel} />

		<h2>How to Play</h2>
		<p>
				The Daleks are chasing you! Move to avoid the Daleks (&#9823;) and get them to crash into each other before they can reach you (&#9731;) so you can make your escape in the Tardis.
		</p>
		<p>
				Move with the arrow keys, keypad keys, or HJKLYUBN keys.
		</p>
		<p>
				Stand still for a turn with the . or 5 key.
		</p>
		<p>
				In a pinch, use your sonic screwdriver to destroy the Daleks adjacent to you with the S key, and teleport to safety with the T key.
		</p>

		<br />

		<footer>
			<p>
					<a href="https://www.mobygames.com/game/atari-st/daleks">"Daleks"</a> was a game for the Atari ST created by
					Bloom County Software that I remember fondly. This version of the "Doctor Who game" (as I
					remember calling it) was created for my own amusement and nolstalgia. I've recreated it as I remember it,
					filling in the gaps as I went.
			</p>
			<p>
					Doctor Who and the Daleks copyrights and trademarks belong to the BBC.
			</p>
			<p>
					This game uses sounds created by nofeedbak<span className="sound-bible"
					><a href="http://soundbible.com/1495-Basketball-Buzzer.html">1</a></span
					>, and Mike Koenig<span className="sound-bible"
					><a href="http://soundbible.com/1232-Water-Drop-Sound-High.html">2</a
					>,<a href="http://soundbible.com/642-Splat.html">3</a></span>.
					It also includes a couple of sounds from the <a href="http://www.bbc.co.uk/doctorwho/sounds/index.shtml"
					>BBC's website</a> &mdash; I hope they don't mind too terribly.
			</p>
		</footer>

		<audio id="screwdriver-sound" src="sounds/Basketball Buzzer-SoundBible.com-1863250611.mp3" preload="auto"></audio>
		<audio id="transporter-sound" src="sounds/Water Drop Sound High-SoundBible.com-1387792987.mp3" preload="auto"></audio>
		<audio id="crash-sound" src="sounds/Splat-SoundBible.com-1826190667.mp3" preload="auto"></audio>
		<audio id="exterminate-sound" src="https://pandastatic.blob.core.windows.net/drwho/sounds/exterminate.mp3" preload="auto"></audio>
		<audio id="tardis-sound" src="https://pandastatic.blob.core.windows.net/drwho/sounds/tardis.mp3" preload="auto"></audio>
	</>
	)
}
