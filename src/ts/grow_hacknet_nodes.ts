class HacknetNode {
    name: string;
    level: number;
    ram: number;
    cores: number;
    cache: number;
    hashCapacity: number;
    production: number;
    timeOnline: number;
    totalProduction: number;

	constructor(ns, nodeIndex: number) {
		let nodeStats = ns.hacknet.getHacknetNode(nodeIndex)
		this.name = nodeStats.name;
		this.level = nodeStats.level;
		this.ram = nodeStats.ram;
		this.cores = nodeStats.cores;
		this.cache = nodeStats.cache;
		this.hashCapacity = nodeStats.hashCapacity;
		this.production = nodeStats.production;
		this.timeOnline = nodeStats.timeOnline;
		this.totalProduction = nodeStats.totalProduction;
	}
}

class HacknetNetwork {
	nodes: Array<HacknetNode>;
	// minLevelUpgradeNodes: Array<HacknetNode>;
	// minLevelUpgradeCost: number;
	// minRamUpgradeNodes: Array<HacknetNode>;
	// minRamUpgradeCost: number;
	// minCoreUpgradeNodes: Array<HacknetNode>;
	// minCoreUpgradeCost: number;
	minIncomeNode

	constructor(ns) {
		this.nodes = this.getHacknetnodes(ns);
	}

	getHacknetnodes(ns): Array<HacknetNode> {
		let hacknetSize: number = ns.hacknet.numNodes();
		let nodes: Array<HacknetNode> = [];
		for (let i = 0; i < hacknetSize; i++) {
			nodes.push(new HacknetNode(ns, i))
		}
		return nodes;
	}
}


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