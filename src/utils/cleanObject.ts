// src/utils/cleanObject.ts
export const cleanForFirestore = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj, (k, v) => (v === undefined ? null : v)));
};