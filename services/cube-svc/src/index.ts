import { createApp } from './app';
import type { Env } from './env';

const app = createApp();

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response> {
    return app.fetch(request, env, ctx);
  }
} satisfies ExportedHandler<Env>;
