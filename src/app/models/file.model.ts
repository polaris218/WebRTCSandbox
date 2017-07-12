export class FileModel {
    Caption: string;
    FileId: number;
    Format: string;
    IsOwned: boolean;
    LengthInBytes: number;
    LengthInSeconds: number;
    Volume: number;

    constructor(params) {
        for (let i in params) {
            if (params.hasOwnProperty(i)) {
                this[i] = params[i];
            }
        }
    }
}