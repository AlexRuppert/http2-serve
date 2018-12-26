export default function ignoreFavicon(options = {}) {
  return async function(ctx, next) {
    if (/\/favicon\.?/i.test(ctx.url)) {
      ctx.status = 404
    } else {
      await next()
    }
  }
}
