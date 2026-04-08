declare module "@orpc/client" {
  export function createORPCClient(link: any): any;
  export function onError(handler: (error: any) => void): any;
}

declare module "@orpc/client/fetch" {
  export class RPCLink {
    constructor(options: {
      url: string;
      headers: () => Record<string, string>;
      interceptors?: any[];
    });
  }
}

declare module "@orpc/contract" {
  export type ContractRouterClient<T> = any;
}
