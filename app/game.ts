import {createContext} from 'react'

const PLAYER = '@'
const TRASH = '*';

const BOARD_WIDTH = 50
const BOARD_HEIGHT = 25
const SCREW_DRIVER_USES = 2
const TELEPORT_USES = 1
const TOTAL_DALEKS = 12
const TOTAL_SCREW_DRIVERS = 5
const TOTAL_TRANSPORTERS = 2

const DALEK_POINTS = 50
const SCREW_DRIVER_POINTS = -100
const TRANSPORTER_POINTS = -25

type Pt = [number, number]

export class Level{
	screwDriver = TOTAL_SCREW_DRIVERS
	transporters = TOTAL_TRANSPORTERS
	everything:{[key: Pt]: number|string} = { }
	daleks:Pt[] = []
	trash:Pt[] = []
	player:Pt = [0,0]
}

export class Game{
	score = 0
	level = 0
	current:Level = new Level()
	
	constructor(){
	}

	restart(): void{
		this.level = 0
		this.nextLevel()
	}

	nextLevel(): void{
		this.level += 1
		this.current = new Level()

		this.addTrash()
		this.addDaleks()
		this.addPlayer()
	}

	get won(): bool{
		return this.current.daleks.every(d => !d)
	}

	get dead(): bool{
		return this.current.everything[this.current.player] !== PLAYER
	}

	findFreePosition(): void{
		let position =
			[ Math.floor(Math.random()*BOARD_WIDTH)
			, Math.floor(Math.random()*BOARD_HEIGHT)
			]

		while(!position in this.current.everything){
			if(Math.random() < .5)
				position[0] += 1;
			else
				position[1] += 1;

			if(position[0] >= BOARD_WIDTH)
				position[0] = 0;
			else if(position[1] >= BOARD_HEIGHT)
				position[1] = 0;
		}

		return position;
	}

	addTrash(): void{
		let totalTrash = Math.max(TOTAL_DALEKS - this.level, 0)

		while(totalTrash){
			let trash = this.findFreePosition()

			this.current.trash.push(trash)
			this.current.everything[trash] = TRASH

			totalTrash -= 1
		}
	}

	addDaleks(): void{
		var dalek;

		for(var daleks = 0; daleks < TOTAL_DALEKS; daleks += 1){
			dalek = this.findFreePosition()

			this.current.daleks.push(dalek)
			this.current.everything[dalek] = daleks
		}
	}

	addPlayer(): void{
		var player = this.findFreePosition()

		this.current.player = player
		this.current.everything[player] = PLAYER
	}

	tick(): void{
	}

	bound(value:number, upper:number): number{
		return Math.max(0, Math.min(upper, value))
	}

	move(horizontal:number, vertical:number): void{
		let doctor = this.current.player

		delete this.current.everything[doctor]

		doctor[0] = this.bound(doctor[0]+horizontal, BOARD_WIDTH)
		doctor[1] = this.bound(doctor[1]+vertical, BOARD_HEIGHT)

		// If that didn't just kill the player....
		if(!(doctor in this.current.everything)){
			this.current.everything[doctor] = PLAYER

			this.tick()
		}
	}

	screwDriver(): void{
		if(this.current.screwDriver <= 0) return

		let doctor = this.current.player

		for(let x of [-1, 0, 1])
			for(let y of [-1, 0, 1])
				this.killDalek(doctor[0]+x, doctor[1]+y)

		this.score += SCREW_DRIVER_POINTS;
		this.current.screwDrivers -= 1;

		this.playSound('screwdriver')

		if(!this.won)
			this.tick()
	}

	teleport(): void{
		if(this.current.transporters <= 0) return

		let doctor = this.current.player
		let [x, y] = this.findFreePosition()

		delete this.current.everything[doctor]
		doctor[0] = x
		doctor[1] = y
		this.score += TRANSPORTER_POINTS

		this.playSound('transporter')

		// If that didn't just kill the player....
		if(!(doctor in this.current.everything)){
			this.current.everything[doctor] = PLAYER

			this.tick()
		}
	}

	killDalek(x:number, y:number): void{
		let pos = [x, y]
		let char = this.current.everything[pos]

		if(typeof char === 'number'){
			this.current.daleks[char] = null
			this.current.everything[pos] = TRASH
			this.current.trash.push(pos)

			this.score += DALEK_POINTS
		}
	}

	round(num:number): number{
		if(num > 0)
			return Math.floor(num)
		else if(num < 0)
			return Math.ceil(num)
		else
			return 0
	}

	moveDalek(index:number): void{
		let doctor = this.current.player
		let dalek = this.current.daleks[index]
		let dx = doctor[0] - dalek[0]
		let dy = doctor[1] - dalek[1]
		let killCount = 0
		let m:number
		let inspace:any

		delete this.current.everything[dalek]

		if(dx){
			m = dy/dx

			if(m > 1){
				dalek[0] += this.round(1/m) && Math.sign(dx)
				dalek[1] += Math.sign(dy)
			}
			else{
				dalek[0] += Math.sign(dx)
				dalek[1] += this.round(m) && Math.sign(dy)
			}
		}
		else{
			dalek[1] += Math.sign(dy)
		}

		inspace = this.current.everything[dalek]

		if(typeof inspace == 'number'){
			killCount = 2
			this.current.daleks[index] = null
			this.score += DALEK_POINTS
			this.killDalek(dalek[0], dalek[1])
			this.playSound('crash')
		}
		else if(inspace == TRASH){
			killCount = 1
			this.current.daleks[index] = null
			this.score += DALEK_POINTS
			this.playSound('crash')
		}
		else{
			this.current.everything[dalek] = index
		}
	}

	tick(): void{
		for(let dalek = 0; dalek < this.current.daleks.length; dalek += 1){
			if(this.current.daleks[dalek])
				this.moveDalek(dalek)
		}
	}

	playSound(name:string): void{
		let audio = document.getElementById(`${name}-sound`)
		audio.play()
	}
}

export const GameContext = createContext(new Game())
