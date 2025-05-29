import {Game} from "./game.ts"

type GameOverProps = {message:string, button:string, onClick:() => void, ref}

export default function GameOver({message, button, onClick, ref}:GameOverProps){
	return (
	<dialog className="game-over" ref={ref}>
		<p>{message}</p>

		<button type="button" onClick={onClick}>{button}</button>
	</dialog>
	)
}
