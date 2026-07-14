C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char *s;
       int n;
       unsigned char pal[16][16];
       char *path[16];
       int depth;
       char ***answers;
       int *columns;
       int size;
   } Context;

   static char *slice(char *s, int start, int end) {
       int n = end - start + 1;
       char *part = malloc((size_t)n + 1U);
       memcpy(part, s + start, (size_t)n);
       part[n] = '\0';
       return part;
   }

   static void save(Context *ctx) {
       char **row = malloc((size_t)ctx->depth * sizeof(*row));
       for (int i = 0; i < ctx->depth; ++i) {
           size_t n = strlen(ctx->path[i]) + 1U;
           row[i] = malloc(n);
           memcpy(row[i], ctx->path[i], n);
       }
       ctx->answers[ctx->size] = row;
       ctx->columns[ctx->size++] = ctx->depth;
   }

   static void dfs(Context *ctx, int start) {
       if (start == ctx->n) {
           save(ctx);
           return;
       }
       for (int end = start; end < ctx->n; ++end) {
           if (ctx->pal[start][end] == 0U) continue;
           ctx->path[ctx->depth++] = slice(ctx->s, start, end);
           dfs(ctx, end + 1);
           free(ctx->path[--ctx->depth]);
       }
   }

   char ***partition(
       char *s,
       int *returnSize,
       int **returnColumnSizes
   ) {
       Context ctx = {0};
       ctx.s = s;
       ctx.n = (int)strlen(s);
       int capacity = 1 << (ctx.n - 1);
       ctx.answers = malloc((size_t)capacity * sizeof(*ctx.answers));
       ctx.columns = malloc((size_t)capacity * sizeof(*ctx.columns));

       for (int start = ctx.n - 1; start >= 0; --start) {
           for (int end = start; end < ctx.n; ++end) {
               ctx.pal[start][end] = (unsigned char)(
                   s[start] == s[end] &&
                   (end - start < 2 || ctx.pal[start + 1][end - 1])
               );
           }
       }
       dfs(&ctx, 0);
       *returnSize = ctx.size;
       *returnColumnSizes = ctx.columns;
       return ctx.answers;
   }
