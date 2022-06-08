import { HacknetNodeNetwork } from "Hacknet/hacknetObjects";
export function main(ns) {
    let playerMoney = ns.getServerMoneyAvailable("home");
    let hacknetNodeNetwork = new HacknetNodeNetwork(ns);
    // let node1 : HacknetNode = ns.hacknet.getHacknetNode(0);
    // let hacknetLevelCost = ns.hacknet.getLevelUpgradeCost(i, 10);
    // let hacknet.getHacknetNode(i).level
    let network_upgrade_time = hacknetNodeNetwork.calculateUpgradeTime();
    ns.printf(`Hacknet Node Network Upgrade Time = ${network_upgrade_time}`);
    hacknetNodeNetwork.upgradeAndUpdateNodeNetwork();
}
// function getHackNet(ns): Hacknet {
// }
// export function main(ns) {
// 	let grow_times: number = ns.args[0];
// 	ns.printf(grow_times);
// 	for (let i = 0; i < grow_times; i++) {
// 		growHacknetNode(ns);
// 	}	
// }
