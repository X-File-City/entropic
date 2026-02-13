import { invoke } from "@tauri-apps/api/core";

const DEFAULT_GATEWAY_URL = "ws://127.0.0.1:19789";
const LEGACY_GATEWAY_TOKEN = "nova-local-gateway";

type GatewayAuthResponse = {
  ws_url?: string;
  token?: string;
};

export async function resolveGatewayAuth(): Promise<{ wsUrl: string; token: string }> {
  try {
    const auth = await invoke<GatewayAuthResponse>("get_gateway_auth");
    const wsUrl = auth?.ws_url?.trim() || DEFAULT_GATEWAY_URL;
    const token = auth?.token?.trim() || LEGACY_GATEWAY_TOKEN;
    return { wsUrl, token };
  } catch {
    const wsUrl =
      (await invoke<string>("get_gateway_ws_url").catch(() => "")) || DEFAULT_GATEWAY_URL;
    return { wsUrl, token: LEGACY_GATEWAY_TOKEN };
  }
}
