import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';

import { createApp } from '../app.js';

async function startTestServer() {
  const app = createApp();
  const server = app.listen(0);
  const address = server.address() as AddressInfo;

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

test('POST /auth/login returns a token and protected route accepts it', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vimos.local', password: 'Password123!' }),
    });

    assert.equal(loginResponse.status, 200);

    const loginBody = (await loginResponse.json()) as { token: string };
    assert.ok(loginBody.token);

    const meResponse = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        authorization: `Bearer ${loginBody.token}`,
      },
    });

    assert.equal(meResponse.status, 200);

    const meBody = (await meResponse.json()) as { email: string };
    assert.equal(meBody.email, 'admin@vimos.local');
  } finally {
    server.close();
  }
});

test('POST /auth/logout invalidates a token', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vimos.local', password: 'Password123!' }),
    });

    const loginBody = (await loginResponse.json()) as { token: string };

    const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${loginBody.token}`,
      },
    });

    assert.equal(logoutResponse.status, 200);

    const meResponse = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        authorization: `Bearer ${loginBody.token}`,
      },
    });

    assert.equal(meResponse.status, 401);
  } finally {
    server.close();
  }
});
