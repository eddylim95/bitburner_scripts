import { FileStorageFormat } from "DB/dbConstants";

export class RowColObj {
    columns: Array<string>;
    rows: Array<Array<any>>;

    constructor(init?:Partial<RowColObj>){
        Object.assign(this, init);
    }
}

interface IDataStore {
    readonly storageFormat: FileStorageFormat;
    metadata: {
        lastModifiedTime: number;
        filePath: string;
    };
    data: RowColObj;
}

export class CsvStore implements IDataStore {
    readonly storageFormat: FileStorageFormat.csv;
    metadata: {
        lastModifiedTime: number;
        filePath: string;
        delimiter: string;
    };
    data: RowColObj;

    constructor(ns, filePath, serverName="home", delimiter=",") {
        this.metadata = {
            lastModifiedTime: 0,
            filePath: filePath,
            delimiter: delimiter,
        }
        this.readCsvToData(ns, filePath, serverName, delimiter);
    }

    async storeRows(ns, data: RowColObj): Promise<void> {
        // Currently no data validation check, full overwrite
        this.data = data;
        ns.printf(`${this.data.columns}`)
        ns.printf(`${this.data.rows}`)
        await this.writeRows(ns, this.metadata.filePath, "w")
    };

    private async writeRows(ns, filePath: string, mode: "w" | "a"): Promise<void> {
        let dataToWrite: string = this.data.columns.join(this.metadata.delimiter) + "\n"
        for (let row of this.data.rows) {
            dataToWrite += row.join(this.metadata.delimiter) + "\n"
        }
        ns.printf(`writing csv to ${filePath}...`)
        await ns.write(filePath, dataToWrite, mode);
    }

    // private updateModifiedTime(): void {
    //     this.metadata.lastModifiedTime = Date.now();
    // };

    private readCsvToData(ns, filePath, serverName, delimiter): void {
        let fileData: string;
        if (ns.fileExists(filePath, serverName)) {
            fileData = ns.read(filePath)
            ns.printf(`csv string: ${fileData}`);
            let fileDataArr = fileData.split("\n")
            this.data = {
                columns: fileDataArr.shift().split(delimiter),
                rows: fileDataArr.map(fileData => fileData.split(delimiter)),
            }
        } else {
            this.data = {
                columns: null,
                rows: null,
            }
        }
        ns.printf(`csv: \n ${this.data.rows} \n ${this.data.rows}`);
    };

}