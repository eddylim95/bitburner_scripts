import { HacknetNodeNetwork } from "Hacknet/hacknetObjects";
export function main(ns) {
    let hacknetNodeNetwork = new HacknetNodeNetwork(ns);
    return {
        incomeGain: hacknetNodeNetwork.networkNextUpgrade.incomeGain,
        upgradeCost: hacknetNodeNetwork.networkNextUpgrade.upgradeCost,
    };
}
