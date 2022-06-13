import { HacknetNodeNetwork } from "Hacknet/hacknetObjects";
import { incomeSourceStats, dbIncomeSourceStats } from "sharedObjects/incomeDbObjects";
export async function main(ns) {
    let hacknetNodeNetwork = new HacknetNodeNetwork(ns);
    let data = new incomeSourceStats({
        incomeSource: "hacknet",
        incomeGain: hacknetNodeNetwork.networkNextUpgrade.incomeGain,
        upgradeCost: hacknetNodeNetwork.networkNextUpgrade.upgradeCost,
        modifyTime: Date.now(),
    });
    let dbIncomeSourceStat = new dbIncomeSourceStats(ns);
    await dbIncomeSourceStat.storeIncomeStats(ns, [data]);
}
