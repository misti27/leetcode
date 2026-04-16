const DB_NAME = 'leetnotes-image-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;
const IMAGE_REF_PREFIX = 'idb://image/';

let dbPromise = null;

export function createImageRef(id) {
  return `${IMAGE_REF_PREFIX}${id}`;
}

export function isImageRef(value) {
  return typeof value === 'string' && value.startsWith(IMAGE_REF_PREFIX);
}

export function isInlineImageData(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

export function hasInlineImageBlocks(problems) {
  return problems.some((problem) =>
    Array.isArray(problem.blocks) &&
    problem.blocks.some((block) => block?.type === 'image' && isInlineImageData(block.content))
  );
}

function parseImageRef(ref) {
  return isImageRef(ref) ? ref.slice(IMAGE_REF_PREFIX.length) : null;
}

function ensureIndexedDb() {
  if (typeof indexedDB === 'undefined') {
    throw new Error('当前环境不支持 IndexedDB，无法保存图片。');
  }
}

function openImageDb() {
  ensureIndexedDb();

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('无法打开图片数据库。'));
    });
  }

  return dbPromise;
}

function runRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB 请求失败。'));
  });
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function saveImageBlob(blob) {
  const db = await openImageDb();
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  await runRequest(store.put({
    id,
    blob,
    createdAt: Date.now(),
  }));

  return createImageRef(id);
}

export async function saveDataUrlImage(dataUrl) {
  const blob = await dataUrlToBlob(dataUrl);
  return saveImageBlob(blob);
}

export async function loadImageBlob(ref) {
  const id = parseImageRef(ref);
  if (!id) return null;

  const db = await openImageDb();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const record = await runRequest(store.get(id));

  return record?.blob ?? null;
}

export async function migrateInlineImageBlocks(problems, storeInlineImage = saveDataUrlImage) {
  let changed = false;

  const migratedProblems = await Promise.all(
    problems.map(async (problem) => {
      if (!Array.isArray(problem.blocks)) {
        return problem;
      }

      let blockChanged = false;
      const migratedBlocks = await Promise.all(
        problem.blocks.map(async (block) => {
          if (block?.type !== 'image' || !isInlineImageData(block.content)) {
            return block;
          }

          const imageRef = await storeInlineImage(block.content);
          blockChanged = true;
          changed = true;
          return {
            ...block,
            content: imageRef,
          };
        })
      );

      if (!blockChanged) {
        return problem;
      }

      return {
        ...problem,
        blocks: migratedBlocks,
      };
    })
  );

  return {
    changed,
    problems: changed ? migratedProblems : problems,
  };
}
