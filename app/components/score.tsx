import {Game} from "../game.ts"

type ScoreProps = {game: Game}

export default function Score({game}:ScoreProps){
	return (
	<div id="stats">
		<div id="score">
			<h2>score</h2>
			<p>{game.score}</p>
		</div>

		<div id="screwDrivers">
			<h3>sonic screwdriver uses</h3>
			<p>{game.current.screwDriver}</p>
		</div>

		<div id="transporters">
			<h3>transporter uses</h3>
			<p>{game.current.transporters}</p>
		</div>
	</div>)
}
