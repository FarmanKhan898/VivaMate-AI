import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const storeFile = fileURLToPath(new URL('./store.json', import.meta.url));

function readLocalStore() {
  try {
    const saved = JSON.parse(readFileSync(storeFile, 'utf8'));
    return {
      users: Array.isArray(saved.users) ? saved.users : [],
      subjects: Array.isArray(saved.subjects) ? saved.subjects : [],
      tasks: Array.isArray(saved.tasks) ? saved.tasks : [],
      quizHistory: Array.isArray(saved.quizHistory) ? saved.quizHistory : [],
    };
  } catch {
    return { users: [], subjects: [], tasks: [], quizHistory: [] };
  }
}

export const memoryStore = {
  ...readLocalStore(),
};

export function persistMemoryStore() {
  writeFileSync(storeFile, JSON.stringify(memoryStore, null, 2), {
    encoding: 'utf8',
    mode: 0o600,
  });
}
