export class LocalStorageHelper {
    static saveData<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static getData<T>(key: string): T | null {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static deleteData(key: string): void {
        localStorage.removeItem(key);
    }
}
