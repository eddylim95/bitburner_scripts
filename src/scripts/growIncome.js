var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function main(ns) {
    return __awaiter(this, void 0, void 0, function* () {
        let serverName = ns.args[0];
        if (!serverName) {
            serverName = "home";
        }
        // let scriptName = "/Hacknet/scripts/getHacknetUpgradeStats.js"
        let scriptName = "/Hacknet/scripts/growHacknetNodes.js";
        // let scriptName = ns.args[1]
        ns.tprint(`ram: ${ns.getScriptRam("/scripts/growIncome.js")}, executing growIncome`);
        let pid = yield execScript(ns, scriptName, serverName);
        // this.ns.printf(`Hacknet Upgrade Income: ${hacknetUpgradeStats.incomeGain}, Upgrade Cost: ${hacknetUpgradeStats.upgradeCost}`);
    });
}
function execScript(ns, scriptName, serverName, threads = 1, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (serverName !== "home") {
            yield ns.scp(scriptName, serverName);
        }
        ns.tprint(`ram: ${ns.getScriptRam(scriptName)}, executing script ${scriptName} on ${serverName}`);
        return ns.exec(scriptName, serverName, threads, ...args);
    });
}
