---
description: Explicación de un cambio para el equipo de desarrollo, con 1, 5 y 10 minutos. Debe producir una sola página con selector de nivel que abre en 10 min.
tags: [trigger, explainer, niveles]
max_turns: 15
timeout_seconds: 480
allowed_tools: [Read, Glob, Grep, Skill]
---

Prepare an HTML explainer for this change. I want a 1 minute, a 5 minute and a 10 minute explainer. I am part of the dev team and want to understand the change deeply without being too distracted by implementation details. Focus on important design and architectural concepts. Use UML diagrams (class and sequence) wherever appropriate to highlight important structural and dynamic relationships. Save it as cambio.html.

```diff
--- a/src/payments/client.ts
+++ b/src/payments/client.ts
@@ -1,24 +1,22 @@
-import { sleep } from '../util/sleep';
+import { RetryPolicy, NoRetry } from './retry-policy';
+import { IdempotencyStore } from './idempotency-store';

 export class PaymentsClient {
-  constructor(private http: HttpTransport) {}
+  constructor(
+    private http: HttpTransport,
+    private retry: RetryPolicy = new NoRetry(),
+    private keys: IdempotencyStore,
+  ) {}

   async charge(req: ChargeRequest): Promise<ChargeResult> {
-    for (let i = 0; i < 3; i++) {
-      try {
-        return await this.http.post('/charges', req);
-      } catch (e) {
-        if (i === 2) throw e;
-        await sleep(200 * 2 ** i);
-      }
-    }
+    const key = await this.keys.keyFor(req.orderId);
+    return this.retry.run(() =>
+      this.http.post('/charges', req, { 'Idempotency-Key': key }),
+    );
   }
 }
--- /dev/null
+++ b/src/payments/retry-policy.ts
@@ -0,0 +1,22 @@
+export interface RetryPolicy {
+  run<T>(fn: () => Promise<T>): Promise<T>;
+}
+export class NoRetry implements RetryPolicy {
+  run<T>(fn: () => Promise<T>) { return fn(); }
+}
+export class ExponentialBackoff implements RetryPolicy {
+  constructor(private attempts = 3, private baseMs = 200, private isRetryable = isTransient) {}
+  async run<T>(fn: () => Promise<T>): Promise<T> {
+    for (let i = 0; ; i++) {
+      try { return await fn(); }
+      catch (e) {
+        if (i + 1 >= this.attempts || !this.isRetryable(e)) throw e;
+        await sleep(jitter(this.baseMs * 2 ** i));
+      }
+    }
+  }
+}
+export class CircuitBreaker implements RetryPolicy {
+  constructor(private inner: RetryPolicy, private threshold = 5, private coolDownMs = 30_000) {}
+  // open after `threshold` consecutive failures; reject fast until coolDownMs passes
+}
--- /dev/null
+++ b/src/payments/idempotency-store.ts
@@ -0,0 +1,8 @@
+export class IdempotencyStore {
+  constructor(private redis: Redis) {}
+  async keyFor(orderId: string): Promise<string> {
+    const existing = await this.redis.get(`idem:${orderId}`);
+    if (existing) return existing;
+    const key = crypto.randomUUID();
+    await this.redis.set(`idem:${orderId}`, key, 'EX', 86_400);
+    return key;
+  }
+}
```
