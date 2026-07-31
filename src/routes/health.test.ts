import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';

import { createApp } from '../app.js';

test('GET /api/health returns the service status', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const address = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);

    assert.equal(response.status, 200);

    const body = (await response.json()) as { status: string; service: string };
    assert.deepEqual(body, { status: 'ok', service: 'vimos-api' });
  } finally {
    server.close();
  }
});
