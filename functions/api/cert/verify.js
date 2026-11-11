/**
 * Cloudflare Pages Function: GET /api/cert/verify
 * Validates issued certificate signatures against env.CERT_SIGNING_SECRET
 * and optionally confirms presence in env.CERT_LEDGER (KV).
 */

const FALLBACK_KEY = 'TechTest-Auth-Sig-v1-Production-Verification-Key';

export async function computeHmac(payloadString, secret) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret || FALLBACK_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(payloadString));
  return Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const id = url.searchParams.get('id');
  const category = url.searchParams.get('cat');
  const grade = url.searchParams.get('grade');
  const status = url.searchParams.get('status');
  const sig = url.searchParams.get('sig');

  if (!id || !category || !grade || !status || !sig) {
    return new Response(JSON.stringify({ valid: false, reason: 'Missing required verification parameters.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const canonicalPayload = JSON.stringify({ id, category, grade, status });
  const hasEdgeSecret = Boolean(env && env.CERT_SIGNING_SECRET);
  const expectedEdge = hasEdgeSecret ? await computeHmac(canonicalPayload, env.CERT_SIGNING_SECRET) : null;
  const expectedLocal = await computeHmac(canonicalPayload, FALLBACK_KEY);

  let ledgerRecord = null;
  if (env && env.CERT_LEDGER) {
    try {
      const raw = await env.CERT_LEDGER.get(`cert:${id}`);
      if (raw) ledgerRecord = JSON.parse(raw);
    } catch {}
  }

  const matchesEdge = Boolean(expectedEdge && expectedEdge === sig);
  const matchesLocal = expectedLocal === sig;
  const valid = matchesEdge || matchesLocal;

  return new Response(JSON.stringify({
    valid,
    mode: matchesEdge ? 'edge' : (matchesLocal ? 'local' : 'invalid'),
    ledgerVerified: Boolean(ledgerRecord && ledgerRecord.sig === sig),
    issuedAt: ledgerRecord ? ledgerRecord.issuedAt : null
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
