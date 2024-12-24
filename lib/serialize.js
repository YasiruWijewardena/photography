// lib/serialize.js

export function serializeData(data) {
    if (Array.isArray(data)) {
      return data.map(serializeData);
    } else if (data !== null && typeof data === 'object') {
      const serialized = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          if (value instanceof Date) {
            serialized[key] = value.toISOString();
          } else if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
            serialized[key] = serializeData(value);
          } else {
            serialized[key] = value;
          }
        }
      }
      return serialized;
    }
    return data;
  }
  