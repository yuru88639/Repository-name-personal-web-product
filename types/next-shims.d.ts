declare module "next" {
  export type Metadata = Record<string, unknown>;
  export type NextConfig = Record<string, unknown>;
}

declare module "next/headers" {
  export function cookies(): Promise<{
    getAll(): Array<{ name: string; value: string }>;
    set(name: string, value: string, options?: Record<string, unknown>): void;
  }>;
}

declare module "next/server" {
  export type NextRequest = {
    cookies: {
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string): void;
    };
  };

  export const NextResponse: {
    next(options?: Record<string, unknown>): {
      cookies: {
        set(name: string, value: string, options?: Record<string, unknown>): void;
      };
    };
    json(body: unknown, init?: Record<string, unknown>): Response;
  };
}

declare module "next/server.js" {
  export type NextRequest = import("next/server").NextRequest;
  export const NextResponse: typeof import("next/server").NextResponse;
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = Promise<Record<string, unknown>>;
  export type ResolvingViewport = Promise<Record<string, unknown>>;
}

declare module "next/types.js" {
  export type ResolvingMetadata = Promise<Record<string, unknown>>;
  export type ResolvingViewport = Promise<Record<string, unknown>>;
}
