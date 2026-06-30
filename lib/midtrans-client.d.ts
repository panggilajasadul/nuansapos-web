declare module 'midtrans-client' {
  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(config: SnapConfig);
    createTransaction(parameter: Record<string, unknown>): Promise<SnapTransactionResult>;
  }

  const midtransClient: { Snap: typeof Snap };
  export default midtransClient;
}
