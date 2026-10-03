/**
 * Runs one application operation in a persistence transaction.
 * The context type belongs to the consuming application and must not expose
 * a database client's concrete transaction type to domain code.
 */
export interface TransactionRunner<TransactionContext> {
  run<Value>(
    operation: (context: TransactionContext) => Promise<Value>,
  ): Promise<Value>;
}
