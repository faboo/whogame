import {RefObject} from "react"

type GameOverProps = {message:string, button:string, onClick:() => void, ref:RefObject<HTMLDialogElement>}

export default function GameOver({message, button, onClick, ref}:GameOverProps){
	return (
	<dialog className="game-over" ref={ref}>
		<p>{message}</p>

		<button type="button" onClick={onClick}>{button}</button>
	</dialog>
	)
}
