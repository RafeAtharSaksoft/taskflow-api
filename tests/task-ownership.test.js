const request = require('supertest');
const app = require('../src/app');

// Reuse the same helper pattern from tests/tasks.test.js
async function registerAndLogin(email) {
  const res = await request(app)
    .post('/auth/register')
    .send({ email, password: 'hunter2' });
  return res.body.token;
}

async function createTask(token, title) {
  const res = await request(app)
    .post('/tasks')
    .set('Authorization', 'Bearer ' + token)
    .send({ title, description: 'test description' });
  return res.body;
}

// NOTE: The source code (src/routes/tasks.js) does NOT currently implement
// ownership checks on PUT /:id or DELETE /:id. These tests are written
// against the REQUIREMENT (403 for non-owners, 401 for unauthenticated)
// and will therefore FAIL on the current implementation, correctly exposing
// the missing enforcement.

describe('task ownership — update (PUT /tasks/:id)', () => {
  it('owner can update their own task (PUT)', async () => {
    const ownerToken = await registerAndLogin('own-put-owner@example.com');
    const task = await createTask(ownerToken, 'owner task for put');

    const res = await request(app)
      .put('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + ownerToken)
      .send({ title: 'updated title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('updated title');
    // Ownership of the task must not be changed by the update
    expect(res.body.userId).toBe(task.userId);
  });

  it('non-owner authenticated user receives 403 when updating another user\'s task (PUT)', async () => {
    const ownerToken = await registerAndLogin('own-put-victim@example.com');
    const attackerToken = await registerAndLogin('own-put-attacker@example.com');
    const task = await createTask(ownerToken, 'victim task put');

    const res = await request(app)
      .put('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + attackerToken)
      .send({ title: 'hijacked title' });

    expect(res.status).toBe(403);
  });

  it('task data is unchanged after a rejected non-owner PUT', async () => {
    const ownerToken = await registerAndLogin('own-put-intact-owner@example.com');
    const attackerToken = await registerAndLogin('own-put-intact-attacker@example.com');
    const task = await createTask(ownerToken, 'original title');

    // Attacker attempts the update
    await request(app)
      .put('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + attackerToken)
      .send({ title: 'hijacked title' });

    // Owner reads the task back to verify it is intact
    const check = await request(app)
      .get('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + ownerToken);

    expect(check.status).toBe(200);
    expect(check.body.title).toBe('original title');
  });

  it('unauthenticated PUT request receives 401', async () => {
    const ownerToken = await registerAndLogin('own-put-unauth@example.com');
    const task = await createTask(ownerToken, 'task for unauth put');

    const res = await request(app)
      .put('/tasks/' + task.id)
      .send({ title: 'no auth header' });
    // No Authorization header at all

    expect(res.status).toBe(401);
  });
});

describe('task ownership — delete (DELETE /tasks/:id)', () => {
  it('owner can delete their own task (DELETE)', async () => {
    const ownerToken = await registerAndLogin('own-del-owner@example.com');
    const task = await createTask(ownerToken, 'task to be deleted by owner');

    const res = await request(app)
      .delete('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + ownerToken);

    expect(res.status).toBe(204);

    // Confirm the task is gone
    const check = await request(app)
      .get('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + ownerToken);
    expect(check.status).toBe(404);
  });

  it('non-owner authenticated user receives 403 when deleting another user\'s task (DELETE)', async () => {
    const ownerToken = await registerAndLogin('own-del-victim@example.com');
    const attackerToken = await registerAndLogin('own-del-attacker@example.com');
    const task = await createTask(ownerToken, 'victim task delete');

    const res = await request(app)
      .delete('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + attackerToken);

    expect(res.status).toBe(403);
  });

  it('task still exists after a rejected non-owner DELETE', async () => {
    const ownerToken = await registerAndLogin('own-del-intact-owner@example.com');
    const attackerToken = await registerAndLogin('own-del-intact-attacker@example.com');
    const task = await createTask(ownerToken, 'should survive delete attempt');

    // Attacker attempts deletion
    await request(app)
      .delete('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + attackerToken);

    // Owner verifies the task still exists
    const check = await request(app)
      .get('/tasks/' + task.id)
      .set('Authorization', 'Bearer ' + ownerToken);

    expect(check.status).toBe(200);
    expect(check.body.id).toBe(task.id);
  });

  it('unauthenticated DELETE request receives 401', async () => {
    const ownerToken = await registerAndLogin('own-del-unauth@example.com');
    const task = await createTask(ownerToken, 'task for unauth delete');

    const res = await request(app)
      .delete('/tasks/' + task.id);
    // No Authorization header at all

    expect(res.status).toBe(401);
  });
});
