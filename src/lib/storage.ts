export interface PersistedHistoryUpload {
  name: string;
  text: string;
}

const DB_NAME = 'history-analyzer';
const STORE_NAME = 'app-state';
const UPLOAD_KEY = 'uploaded-history-csv';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

export async function loadPersistedHistoryUpload(): Promise<PersistedHistoryUpload | null> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(UPLOAD_KEY);

    request.onsuccess = () => resolve((request.result as PersistedHistoryUpload | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('Failed to read persisted upload'));
    transaction.oncomplete = () => database.close();
  });
}

export async function savePersistedHistoryUpload(upload: PersistedHistoryUpload): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    store.put(upload, UPLOAD_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to save upload'));
  });
}

export async function clearPersistedHistoryUpload(): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    store.delete(UPLOAD_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to clear upload'));
  });
}
