function growHacknetNode(ns): void {
	let playerMoney: number = ns.getServerMoneyAvailable("home");
	
	let node1 : HacknetNode = ns.hacknet.getHacknetNode(0);
	// let hacknetLevelCost = ns.hacknet.getLevelUpgradeCost(i, 10);
	// let hacknet.getHacknetNode(i).level
}

// function getHackNet(ns): Hacknet {

// }


export function main(ns) {
	let grow_times: number = ns.args[0];
	ns.printf(grow_times);
	for (let i = 0; i < grow_times; i++) {
		growHacknetNode(ns);
	}	
}