import { RowColObj, CsvStore } from "DB/dbObjects";

export class incomeSourceStats {
    incomeSource: string;
    incomeGain: number;
    upgradeCost: number;
    modifyTime: number;

    constructor(init?:Partial<incomeSourceStats>){
        Object.assign(this, init);
    }
}

export class dbIncomeSourceStats {
    dataStore: CsvStore;
    dataObject: Array<incomeSourceStats>;

    constructor(ns, incomeSourceStatsPath = "/DB/store/incomeStats.txt") {
        this.dataStore = new CsvStore(ns, incomeSourceStatsPath);
        this.dataObject = this.getDataStoreObj();
    }

    async storeIncomeStats(ns, rows: Array<incomeSourceStats>): Promise<void> {
        ns.printf(`dataStore rows ${this.dataStore.data.rows}`)
        ns.printf(`read data: ${this.dataObject.map(x => {x.incomeSource, x.incomeGain, x.upgradeCost, x.modifyTime})}`);
        ns.printf(`new data: ${rows.map(x => {x.incomeSource, x.incomeGain, x.upgradeCost, x.modifyTime})}`);
        let combinedDataRows = [...this.dataObject, ...rows];
        ns.printf(`combined data: ${combinedDataRows.map(x => {x.incomeSource, x.incomeGain, x.upgradeCost, x.modifyTime})}`);
        let maxModifyTimeRowsBySource = this.getMaxModifyTimeRowsBySource(combinedDataRows);
        let rowColObj = new RowColObj(this.convertIncomeSourceStatsToColsRows(maxModifyTimeRowsBySource));
        await this.dataStore.storeRows(ns, rowColObj);
    }

    private getDataStoreObj(): Array<incomeSourceStats>{
        // need to check, does not work
        let dataObject = [];
        for (let row in this.dataStore.data.rows) {
            dataObject.push(new incomeSourceStats({
                incomeSource: row[0],
                incomeGain: Number(row[1]),
                upgradeCost: Number(row[2]),
                modifyTime: Number(row[3]),
            }))
        }
        return dataObject;
    }

    private getMaxModifyTimeRowsBySource(rows: Array<incomeSourceStats>): Array<incomeSourceStats> {
        let maxModifyTimeBySourceArray = Object.values(rows.reduce((r, o) => {
            r[o.incomeSource] = (r[o.incomeSource] && r[o.incomeSource].modifyTime > o.modifyTime) ? r[o.incomeSource] : o
            return r
          }, []))
        return maxModifyTimeBySourceArray
    }

    private convertIncomeSourceStatsToColsRows(rows: Array<incomeSourceStats>): RowColObj {
        let rowsToStore = [];
        for (let row of rows) {
            rowsToStore.push([row.incomeSource, row.incomeGain, row.upgradeCost, row.modifyTime]);
        }
        return {
            columns: ["incomeSource", "incomeGain", "upgradeCost", "modifyTime"],
            rows: rowsToStore,
        };
    }
}