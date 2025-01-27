export class LocalStorageHelper {
    static saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    static getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    static deleteData(key) {
        localStorage.removeItem(key);
    }
}
