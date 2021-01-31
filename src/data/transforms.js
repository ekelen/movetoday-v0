const moveList = require('./moveList.json')
const fs = require('fs')
const path = require('path')

const weeks = [1,
1,
1,
1,
1,
1,
1,
2,
2,
2,
2,
2,
2,
3,
3,
3,
3,
3,
3,
3,
4,
4,
4,
4,
4,
4,
4]

let cleanData = []

moveList.forEach((move, i) => {
	const { durationMin, durationMax, repsMin, repsMax, isPerSide, sets, focus, warning, corePlay , aligned, alignedHsDrill, flow, warmup} = move;
	const cleanMove = {}
	cleanMove.name = move.alias || move.name
	cleanMove.id = i
	cleanMove.notes = move.notes
	cleanMove.durationMax = durationMax
	cleanMove.durationMin = durationMin
	cleanMove.repsMax = repsMax
	cleanMove.repsMin = repsMin
	cleanMove.sets = sets
	cleanMove.isPerSide = isPerSide
	cleanMove.focus = focus
	cleanMove.source = corePlay ? 'COREPLAY' : aligned ? 'ALIGNED' : 'CUSTOM'
	cleanMove.warning = warning
	cleanMove.handstandType === !aligned ? null : alignedHsDrill ? 'DRILL' : 'CONDITIONIG'
	if (weeks[i]) {
		cleanMove.corePlayWeek = weeks[i]
	}
	cleanData.push(cleanMove)
})

console.log(`cleanData.slice(0, 3):`, cleanData.slice(0, 3));

fs.writeFileSync('./cleanData.json', JSON.stringify(cleanData, null, 2))


// let notes = []
// let query = []

// let i = moveList.length;

// for (let move of moveList) {

// 	if (i > 1 && move.notes) {
// 		notes.push(`{name: "${move.name}", notes: "${move.notes}"}`)
// 	} else if (i === 1 && move.notes) {
// 		notes.push(`{name: "${move.name}", notes: "${move.notes}"}`)
// 	}

// 	i--;
// 	// if (move.notes)
// 	// 	notes.push({ })
// 	// console.log(`"move.name"`)
// }
// const queryStr = notes.join("\n")
// console.log(`queryStr:`, queryStr);

