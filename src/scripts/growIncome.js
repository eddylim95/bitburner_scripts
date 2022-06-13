export async function main(ns) {
    let serverName = ns.args[0];
    if (!serverName) {
        serverName = "home";
    }
    // let scriptName = "/Hacknet/scripts/getHacknetUpgradeStats.js"
    // let scriptName = ns.args[1]
    ns.tprint(`ram: ${ns.getScriptRam("/scripts/growIncome.js")}, executing growIncome`);
    let getHacknetUpgradeStats = "/Hacknet/scripts/getHacknetUpgradeStats.js";
    let getHacknetUpgradeStatsPid = await execScript(ns, getHacknetUpgradeStats, serverName);
    // let growHacknetNodesScript = "/Hacknet/scripts/growHacknetNodes.js"
    // let growHacknetNodesPid = await execScript(ns, growHacknetNodesScript, serverName);
    // this.ns.printf(`Hacknet Upgrade Income: ${hacknetUpgradeStats.incomeGain}, Upgrade Cost: ${hacknetUpgradeStats.upgradeCost}`);
}
async function execScript(ns, scriptName, serverName, threads = 1, ...args) {
    if (serverName !== "home") {
        await ns.scp(scriptName, serverName);
    }
    ns.tprint(`ram: ${ns.getScriptRam(scriptName)}, executing script ${scriptName} on ${serverName}`);
    return ns.exec(scriptName, serverName, threads, ...args);
}
