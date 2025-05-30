import {Game} from "../game.ts"

type BoardProps = {game: Game}

export default function Board({game}:BoardProps){
	let daleks = game.current.daleks
	let trash = game.current.trash
	let doctor = game.current.player
	let doctorClass = "doctor"

	if(game.won){
		doctorClass += ' won'
	}
	else if(game.dead){
		doctorClass += ' dead'
	}

	return (
	<p id="board">
		{ daleks.map((dalek, idx) =>
			dalek
			?  <span className="dalek" key={'dk'+idx} style={{left: dalek[0]+'em', top: dalek[1]+'em'}}></span>
			: null
			)
		}
		{ trash.map((trash, idx) =>
			<span className="trash" key={'tr'+idx} style={{left: trash[0]+'em', top: trash[1]+'em'}}></span>
			)
		}
		<span className={doctorClass} key="dct" style={{left: doctor[0]+'em', top: doctor[1]+'em'}}></span>
	</p>)
}

