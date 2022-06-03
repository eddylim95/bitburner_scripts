// export async function main(ns) {
// 	while(true) {
// 		await ns.hack('n00dles');
//         ns.printf('hacking')
// 	}
// }
function main(ns) {
    const { production, purchaseCost } = ns.getHacknetMultipliers();
    print(production);
    print(purchaseCost);
}
//# sourceMappingURL=testts.js.map