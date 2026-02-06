
/**
 * Simulated transaction helper. In this mock environment, we just provide a wrapper
 * to simulate the pattern of ACID transactions.
 */
export async function withTransaction<T>(callback: () => Promise<T>): Promise<T> {
  // In a real MongoDB environment, we would use session.withTransaction()
  try {
    return await callback();
  } catch (error) {
    console.error('Transaction aborted:', error);
    throw error;
  }
}
