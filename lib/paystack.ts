import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_fallback_key";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializeTransactionParams {
  email: string;
  amountKobo: number;
  planCode?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export async function initializePaystackTransaction(params: InitializeTransactionParams) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      plan: params.planCode || undefined,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to initialize Paystack transaction.");
  }

  return data.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to verify Paystack transaction.");
  }

  return data.data as {
    status: string; // "success" | "failed" | "abandoned"
    reference: string;
    amount: number;
    channel: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata?: Record<string, any>;
  };
}

export function verifyPaystackWebhookSignature(signature: string, rawBody: string): boolean {
  if (!signature || !rawBody) return false;
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
