import { HacknetNodeNetwork } from "Hacknet/hacknetObjects";

export function main(ns): void {
	let hacknetNodeNetwork = new HacknetNodeNetwork(ns);
	hacknetNodeNetwork.upgradeAndUpdateNodeNetwork()
}
