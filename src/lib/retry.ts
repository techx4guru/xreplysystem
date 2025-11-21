export async function retry<T>(fn: () => Promise<T>, opts: { retries?: number; baseDelay?: number } = {}) {
  const retries = opts.retries ?? 3;
  const baseDelay = opts.baseDelay ?? 300;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const wait = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}
