/**
 * Cloudflare Pages Function: POST /api/cert/issue
 * Issues edge-signed hardware diagnostic certificates using env.CERT_SIGNING_SECRET
 * and optionally stores immutable attestation records in env.CERT_LEDGER (KV).
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

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { id, category, grade, status } = body || {};

    if (!id || !category || !grade || !status) {
      return new Response(JSON.stringify({ error: 'Missing required certificate fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const canonicalPayload = JSON.stringify({
      id: String(id),
      category: String(category),
      grade: String(grade),
      status: String(status)
    });

    const hasEdgeSecret = Boolean(env && env.CERT_SIGNING_SECRET);
    const sig = await computeHmac(canonicalPayload, hasEdgeSecret ? env.CERT_SIGNING_SECRET : FALLBACK_KEY);
    const issuedAt = new Date().toISOString();

    if (env && env.CERT_LEDGER) {
      await env.CERT_LEDGER.put(`cert:${id}`, JSON.stringify({
        id,
        category,
        grade,
        status,
        sig,
        issuedAt
      }), { expirationTtl: 60 * 60 * 24 * 365 * 2 });
    }

    return new Response(JSON.stringify({
      id,
      sig,
      mode: hasEdgeSecret ? 'edge' : 'local',
      ledgerPersisted: Boolean(env && env.CERT_LEDGER),
      issuedAt
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
