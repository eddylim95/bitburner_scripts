export class RowColObj {
    columns;
    rows;
    constructor(init) {
        Object.assign(this, init);
    }
}
export class CsvStore {
    storageFormat;
    metadata;
    data;
    constructor(ns, filePath, serverName = "home", delimiter = ",") {
        this.metadata = {
            lastModifiedTime: 0,
            filePath: filePath,
            delimiter: delimiter,
        };
        this.readCsvToData(ns, filePath, serverName, delimiter);
    }
    async storeRows(ns, data) {
        // Currently no data validation check, full overwrite
        this.data = data;
        ns.printf(`${this.data.columns}`);
        ns.printf(`${this.data.rows}`);
        await this.writeRows(ns, this.metadata.filePath, "w");
    }
    ;
    async writeRows(ns, filePath, mode) {
        let dataToWrite = this.data.columns.join(this.metadata.delimiter) + "\n";
        for (let row of this.data.rows) {
            dataToWrite += row.join(this.metadata.delimiter) + "\n";
        }
        ns.printf(`writing csv to ${filePath}...`);
        await ns.write(filePath, dataToWrite, mode);
    }
    // private updateModifiedTime(): void {
    //     this.metadata.lastModifiedTime = Date.now();
    // };
    readCsvToData(ns, filePath, serverName, delimiter) {
        let fileData;
        if (ns.fileExists(filePath, serverName)) {
            fileData = ns.read(filePath);
            ns.printf(`csv string: ${fileData}`);
            let fileDataArr = fileData.split("\n");
            this.data = {
                columns: fileDataArr.shift().split(delimiter),
                rows: fileDataArr.map(fileData => fileData.split(delimiter)),
            };
        }
        else {
            this.data = {
                columns: null,
                rows: null,
            };
        }
        ns.printf(`csv: \n ${this.data.rows} \n ${this.data.rows}`);
    }
    ;
}
