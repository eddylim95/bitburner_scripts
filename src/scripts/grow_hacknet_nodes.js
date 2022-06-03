class HacknetNode {
    constructor(ns, nodeIndex) {
        let nodeStats = ns.hacknet.getHacknetNode(nodeIndex);
        this.ns = ns;
        this.nodeIndex = nodeIndex;
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
    getBestValueUpgradeCost() {
    }
}
this.ns.getCacheUpgradeCost(index, n);
this.ns.getCoreUpgradeCost(index, n);
this.ns.getHashUpgradeLevel(upgName);
this.ns.getLevelUpgradeCost(index, n);
this.ns.getNodeStats(index);
this.ns.getPurchaseNodeCost();
this.ns.getRamUpgradeCost(index, n);
this.ns.upgradeCache(index, n);
this.ns.upgradeCore(index, n);
this.ns.upgradeLevel(index, n);
this.ns.upgradeRam(index, n);
class HacknetNetwork {
    constructor(ns) {
        this.nodes = this.getHacknetnodes(ns);
        this.newNodeCost = ns.getPurchaseNodeCost();
        ns.maxNumNodes();
        ns.numNodes();
        ns.purchaseNode();
    }
    getHacknetnodes(ns) {
        let hacknetSize = ns.hacknet.numNodes();
        let nodes = [];
        for (let i = 0; i < hacknetSize; i++) {
            nodes.push(new HacknetNode(ns, i));
        }
        return nodes;
    }
}
function growHacknetNode(ns) {
    let playerMoney = ns.getServerMoneyAvailable("home");
    let node1 = ns.hacknet.getHacknetNode(0);
    // let hacknetLevelCost = ns.hacknet.getLevelUpgradeCost(i, 10);
    // let hacknet.getHacknetNode(i).level
}
// function getHackNet(ns): Hacknet {
// }
export function main(ns) {
    let grow_times = ns.args[0];
    ns.printf(grow_times);
    for (let i = 0; i < grow_times; i++) {
        growHacknetNode(ns);
    }
}
//# sourceMappingURL=grow_hacknet_nodes.js.map