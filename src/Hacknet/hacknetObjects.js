import { HacknetNodeConstants, HacknetNodeComponentName, NetworkNextUpgradeAction } from "Hacknet/hacknetConstants";
export class HacknetNode {
    constructor(ns, nodeIndex) {
        let nodeStats = ns.hacknet.getNodeStats(nodeIndex);
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
        if (this.maxMoneyRateComponent.name == HacknetNodeComponentName.level) {
            this.ns.hacknet.upgradeLevel(this.nodeIndex, 1);
            ++this.level;
        }
        else if (this.maxMoneyRateComponent.name == HacknetNodeComponentName.ram) {
            this.ns.hacknet.upgradeRam(this.nodeIndex, 1);
            ++this.ram;
        }
        else if (this.maxMoneyRateComponent.name == HacknetNodeComponentName.core) {
            this.ns.hacknet.upgradeCore(this.nodeIndex, 1);
            ++this.cores;
        }
        this.ns.printf(`Upgraded ${HacknetNodeComponentName[this.maxMoneyRateComponent.name]} for ${this.name}`);
        // update maxMoneyRateComponent
        this.getMaxCostNormalizedMoneyRateComponent();
    }
    getMaxCostNormalizedMoneyRateComponent() {
        // const levelMult = level * gainPerLevel;
        // const ramMult = Math.pow(1.035, ram - 1);
        // const coresMult = (cores + 5) / 6;
        // let moneyGainRate = levelMult * ramMult * coresMult * mult * BitNodeMultipliers.HacknetNodeMoney;
        let levelUpgradeCost = this.ns.hacknet.getLevelUpgradeCost(this.nodeIndex, 1);
        let ramUpgradeCost = this.ns.hacknet.getRamUpgradeCost(this.nodeIndex, 1);
        let coreUpgradeCost = this.ns.hacknet.getCoreUpgradeCost(this.nodeIndex, 1);
        let levelUpgradeProductionGain = this.production / (this.level) * (this.level + 1) - this.production;
        let ramUpgradeProductionGain = this.production / (Math.pow(1.035, this.ram - 1) * Math.pow(1.035, this.ram + 1 - 1)) - this.production;
        let coreUpgradeProductionGain = this.production / ((this.cores + 5) / 6) * ((this.cores + 1 + 5) / 6) - this.production;
        let levelCostNormalizedUpgradeMoneyRate = levelUpgradeProductionGain / levelUpgradeCost;
        let ramCostNormalizedUpgradeMoneyRate = ramUpgradeProductionGain / ramUpgradeCost;
        let coreCostNormalizedUpgradeMoneyRate = coreUpgradeProductionGain / coreUpgradeCost;
        const upgrades = [
            { name: HacknetNodeComponentName.level, costNormalizedMoneyRate: levelCostNormalizedUpgradeMoneyRate, productionGain: levelUpgradeProductionGain, cost: levelUpgradeCost },
            { name: HacknetNodeComponentName.ram, costNormalizedMoneyRate: ramCostNormalizedUpgradeMoneyRate, productionGain: ramUpgradeProductionGain, cost: ramUpgradeCost },
            { name: HacknetNodeComponentName.core, costNormalizedMoneyRate: coreCostNormalizedUpgradeMoneyRate, productionGain: coreUpgradeProductionGain, cost: coreUpgradeCost },
        ];
        let maxCostNormalizedMoneyRateComponent = upgrades.reduce((previousValue, currentValue) => (previousValue.costNormalizedMoneyRate < currentValue.costNormalizedMoneyRate ? currentValue : previousValue), upgrades[0]);
        return maxCostNormalizedMoneyRateComponent;
    }
}
export class HacknetNodeNetwork {
    constructor(ns) {
        this.ns = ns;
        this.numNodes = ns.hacknet.numNodes();
        this.nodes = this.getNetworkHacknetnodes();
        this.maxMoneyRateNode = this.getMaxMoneyRateNode();
        this.networkIncome = this.calculateIncome();
        ns.printf(`maxMoneyRateNode=${this.maxMoneyRateNode.name}, costNormalizedMoneyRate=${this.maxMoneyRateNode.maxMoneyRateComponent.costNormalizedMoneyRate}`);
        this.networkNextUpgrade = this.getNetworkNextUpgrade();
    }
    upgradeAndUpdateNodeNetwork() {
        // Prefer to buy new nodes
        if (this.networkNextUpgrade.action == NetworkNextUpgradeAction.addNode) {
            this.purchaseNodeAndUpdateNetwork();
        }
        else {
            this.maxMoneyRateNode.upgradeAndUpdateMaxMoneyRateComponent();
            this.networkIncome = this.calculateIncome();
            this.networkNextUpgrade = this.getNetworkNextUpgrade();
        }
    }
    getNetworkNextUpgrade() {
        let newNodeCost = this.ns.hacknet.getPurchaseNodeCost();
        if (this.maxMoneyRateNode.maxMoneyRateComponent.cost > newNodeCost && this.numNodes < this.ns.hacknet.maxNumNodes()) {
            return {
                action: NetworkNextUpgradeAction.addNode,
                incomeGain: HacknetNodeConstants.MoneyGainPerLevel * 1,
                upgradeCost: newNodeCost,
            };
        }
        else {
            return {
                action: NetworkNextUpgradeAction.upgradeNode,
                incomeGain: this.maxMoneyRateNode.maxMoneyRateComponent.productionGain,
                upgradeCost: this.maxMoneyRateNode.maxMoneyRateComponent.cost,
            };
        }
    }
    purchaseNodeAndUpdateNetwork() {
        let newNodeIndex = this.ns.hacknet.purchaseNode();
        let newNode = new HacknetNode(this.ns, newNodeIndex);
        this.nodes.push(newNode);
        ++this.numNodes;
        this.networkIncome += newNode.production;
        this.networkNextUpgrade = this.getNetworkNextUpgrade();
        this.ns.printf(`Purchased new node: ${newNode.name}`);
    }
    calculateIncome() {
        let totalIncome = 0;
        for (let node of this.nodes) {
            totalIncome += node.production;
        }
        return totalIncome;
    }
    getNetworkHacknetnodes() {
        let networkHacknetnodes = [];
        for (let i = 0; i < this.numNodes; i++) {
            networkHacknetnodes.push(new HacknetNode(this.ns, i));
        }
        return networkHacknetnodes;
    }
    getMaxMoneyRateNode() {
        let maxMoneyRateNode = this.nodes.reduce((previousValue, currentValue) => (previousValue.maxMoneyRateComponent.costNormalizedMoneyRate < currentValue.maxMoneyRateComponent.costNormalizedMoneyRate ? currentValue : previousValue), this.nodes[0]);
        return maxMoneyRateNode;
    }
}
