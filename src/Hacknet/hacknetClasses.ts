import { HacknetNodeConstants, HacknetNodeComponentNames } from "src/Hacknet/hacknetConstants";

export class HacknetNode {
    ns;
    nodeIndex: number;
    name: string;
    level: number;
    ram: number;
    cores: number;
    // cache: number;
    // hashCapacity: number;
    production: number;
    timeOnline: number;
    totalProduction: number;
    maxMoneyRateComponent: {
        name: HacknetNodeComponentNames;
        moneyRate: number;
        cost: number;
    };

    constructor(ns, nodeIndex: number) {
        let nodeStats = ns.hacknet.getHacknetNode(nodeIndex);
        this.ns = ns;
        this.nodeIndex = nodeIndex;
        this.name = nodeStats.name;
        this.level = nodeStats.level;
        this.ram = nodeStats.ram;
        this.cores = nodeStats.cores;
        // this.cache = nodeStats.cache;
        // this.hashCapacity = nodeStats.hashCapacity;
        this.production = nodeStats.production;
        this.timeOnline = nodeStats.timeOnline;
        this.totalProduction = nodeStats.totalProduction;
        this.maxMoneyRateComponent = this.getmaxMoneyRateComponent();
    }

    upgradeAndUpdateMaxMoneyRateComponent() {
        // upgrade maxMoneyRateComponent
        if (this.maxMoneyRateComponent.name == HacknetNodeComponentNames.level) { this.ns.upgradeLevel(this.nodeIndex, 1); ++this.level; }
        else if (this.maxMoneyRateComponent.name == HacknetNodeComponentNames.ram) { this.ns.upgradeRam(this.nodeIndex, 1); ++this.ram; }
        else if (this.maxMoneyRateComponent.name == HacknetNodeComponentNames.core) { this.ns.upgradeCore(this.nodeIndex, 1); ++this.cores; }

        // update maxMoneyRateComponent
        this.getmaxMoneyRateComponent()
    }

    private getmaxMoneyRateComponent() {
        // const levelMult = level * gainPerLevel;
        // const ramMult = Math.pow(1.035, ram - 1);
        // const coresMult = (cores + 5) / 6;
        // let moneyGainRate = levelMult * ramMult * coresMult * mult * BitNodeMultipliers.HacknetNodeMoney;
        let levelProduction = this.level * HacknetNodeConstants.MoneyGainPerLevel;
        let ramProduction = Math.pow(1.035, this.ram - 1);
        let coreProduction = (this.cores + 5) / 6;

        let levelUpgradeCost = this.ns.getLevelUpgradeCost(this.nodeIndex, 1);
        let ramUpgradeCost = this.ns.getRamUpgradeCost(this.nodeIndex, 1);
        let coreUpgradeCost = this.ns.getCoreUpgradeCost(this.nodeIndex, 1);
        
        let levelUpgradeMoneyRate = (this.level + 1) * HacknetNodeConstants.MoneyGainPerLevel * ramProduction * coreProduction / levelUpgradeCost;
        let ramUpgradeMoneyRate = levelProduction * (Math.pow(1.035, this.ram + 1 - 1)) * coreProduction / ramUpgradeCost;
        let coreUpgradeMoneyRate = levelProduction * ramProduction * ((this.cores + 1 + 5) / 6) / coreUpgradeCost;

        const upgrades = [
            {name: HacknetNodeComponentNames.level, moneyRate: levelUpgradeMoneyRate, cost: levelUpgradeCost},
            {name: HacknetNodeComponentNames.ram, moneyRate: ramUpgradeMoneyRate, cost: ramUpgradeCost},
            {name: HacknetNodeComponentNames.core, moneyRate: coreUpgradeMoneyRate, cost: coreUpgradeCost},
        ];
        let maxMoneyRateComponent = upgrades.reduce(
            (previousValue, currentValue) => (previousValue.moneyRate < currentValue.moneyRate ? currentValue : previousValue),
            upgrades[0]
        );

        return maxMoneyRateComponent;
    }
}

export class HacknetNodeNetwork {
    ns;
    maxNumNodes: number;
    numNodes: number;
    nodes: Array<HacknetNode>;
    newNodeCost: number;
    maxMoneyRateNode: HacknetNode;

    constructor(ns) {
        this.ns = ns;
        this.maxNumNodes = ns.hacknet.maxNumNodes();
        this.numNodes = ns.hacknet. numNodes();
        this.nodes = this.getNetworkHacknetnodes();
        this.newNodeCost = ns.hacknet.getPurchaseNodeCost();
        this.maxMoneyRateNode = this.getMaxMoneyRateNode();
        ns.printf(`maxMoneyRateNode = ${this.maxMoneyRateNode.name}`);
    }
    
    upgradeAndUpdateNodeNetwork() {
        if (this.maxMoneyRateNode.maxMoneyRateComponent.cost > this.ns.newNodeCost && this.numNodes < this.maxNumNodes) { this.ns.purchaseNode(); ++this.numNodes; }
        else { this.maxMoneyRateNode.upgradeAndUpdateMaxMoneyRateComponent(); }
    }

    private getNetworkHacknetnodes(): Array<HacknetNode> {
        let networkHacknetnodes: Array<HacknetNode> = [];
        for (let i = 0; i < this.numNodes; i++) {
            networkHacknetnodes.push(new HacknetNode(this.ns, i))
        }
        return networkHacknetnodes;
    }

    // TODO: Add opportunity cost by time with rate
    private getMaxMoneyRateNode() : HacknetNode {
        let maxMoneyRateNode = this.nodes.reduce(
            (previousValue, currentValue) => (previousValue.maxMoneyRateComponent.moneyRate < currentValue.maxMoneyRateComponent.moneyRate ? currentValue : previousValue),
            this.nodes[0]
        );

        return maxMoneyRateNode;
    }
}
