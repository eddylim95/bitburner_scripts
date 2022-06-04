import { HacknetNodeConstants, HacknetNodeComponentName } from "src/Hacknet/hacknetConstants";

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
        name: HacknetNodeComponentName;
        costNormalizedMoneyRate: number;
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
        this.maxMoneyRateComponent = this.getMaxCostNormalizedMoneyRateComponent();
    }

    upgradeAndUpdateMaxMoneyRateComponent() {
        // upgrade maxMoneyRateComponent
        if (this.maxMoneyRateComponent.name == HacknetNodeComponentName.level) { this.ns.upgradeLevel(this.nodeIndex, 1); ++this.level; }
        else if (this.maxMoneyRateComponent.name == HacknetNodeComponentName.ram) { this.ns.upgradeRam(this.nodeIndex, 1); ++this.ram; }
        else if (this.maxMoneyRateComponent.name == HacknetNodeComponentName.core) { this.ns.upgradeCore(this.nodeIndex, 1); ++this.cores; }

        // update maxMoneyRateComponent
        this.getMaxCostNormalizedMoneyRateComponent()
    }

    private getMaxCostNormalizedMoneyRateComponent() {
        // const levelMult = level * gainPerLevel;
        // const ramMult = Math.pow(1.035, ram - 1);
        // const coresMult = (cores + 5) / 6;
        // let moneyGainRate = levelMult * ramMult * coresMult * mult * BitNodeMultipliers.HacknetNodeMoney;
        let levelUpgradeCost = this.ns.getLevelUpgradeCost(this.nodeIndex, 1);
        let ramUpgradeCost = this.ns.getRamUpgradeCost(this.nodeIndex, 1);
        let coreUpgradeCost = this.ns.getCoreUpgradeCost(this.nodeIndex, 1);
        
        let levelCostNormalizedUpgradeMoneyRate = (this.production / (this.level) * (this.level + 1) - this.production) / levelUpgradeCost;
        let ramCostNormalizedUpgradeMoneyRate = (this.production / (Math.pow(1.035, this.ram- 1) * Math.pow(1.035, this.ram + 1 - 1)) - this.production) / ramUpgradeCost;
        let coreCostNormalizedUpgradeMoneyRate = (this.production / ((this.cores + 5) / 6) * ((this.cores + 1 + 5) / 6) - this.production) / coreUpgradeCost;

        const upgrades = [
            {name: HacknetNodeComponentName.level, costNormalizedMoneyRate: levelCostNormalizedUpgradeMoneyRate, cost: levelUpgradeCost},
            {name: HacknetNodeComponentName.ram, costNormalizedMoneyRate: ramCostNormalizedUpgradeMoneyRate, cost: ramUpgradeCost},
            {name: HacknetNodeComponentName.core, costNormalizedMoneyRate: coreCostNormalizedUpgradeMoneyRate, cost: coreUpgradeCost},
        ];
        let maxCostNormalizedMoneyRateComponent = upgrades.reduce(
            (previousValue, currentValue) => (previousValue.costNormalizedMoneyRate < currentValue.costNormalizedMoneyRate ? currentValue : previousValue),
            upgrades[0]
        );

        return maxCostNormalizedMoneyRateComponent;
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
        ns.printf(`maxMoneyRateNode=${this.maxMoneyRateNode.name}, costNormalizedMoneyRate=${this.maxMoneyRateNode.maxMoneyRateComponent.costNormalizedMoneyRate}`);
    }
    
    calculateUpgradeTime(playerIncome : number) {
        return Math.ceil(this.maxMoneyRateNode.maxMoneyRateComponent.cost / playerIncome)
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

    private getMaxMoneyRateNode() : HacknetNode {
        let maxMoneyRateNode = this.nodes.reduce(
            (previousValue, currentValue) => (previousValue.maxMoneyRateComponent.costNormalizedMoneyRate < currentValue.maxMoneyRateComponent.costNormalizedMoneyRate ? currentValue : previousValue),
            this.nodes[0]
        );

        return maxMoneyRateNode;
    }
}
