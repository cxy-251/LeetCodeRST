C
~

.. code-block:: c

   #include <stdlib.h>

   static void add_cell(
       char **board,
       int row,
       int col,
       int *qr,
       int *qc,
       int *tail
   ) {
       if (board[row][col] == 'O') {
           board[row][col] = '#';
           qr[*tail] = row;
           qc[*tail] = col;
           ++*tail;
       }
   }

   void solve(char **board, int rows, int *boardColSize) {
       if (rows == 0 || boardColSize[0] == 0) {
           return;
       }
       int cols = boardColSize[0];
       int capacity = rows * cols;
       int *qr = malloc((size_t)capacity * sizeof(*qr));
       int *qc = malloc((size_t)capacity * sizeof(*qc));
       if (qr == NULL || qc == NULL) {
           free(qr);
           free(qc);
           return;
       }

       int head = 0;
       int tail = 0;
       for (int col = 0; col < cols; ++col) {
           add_cell(board, 0, col, qr, qc, &tail);
           add_cell(board, rows - 1, col, qr, qc, &tail);
       }
       for (int row = 1; row + 1 < rows; ++row) {
           add_cell(board, row, 0, qr, qc, &tail);
           add_cell(board, row, cols - 1, qr, qc, &tail);
       }

       const int dr[4] = {1, -1, 0, 0};
       const int dc[4] = {0, 0, 1, -1};
       while (head < tail) {
           int row = qr[head];
           int col = qc[head++];
           for (int direction = 0; direction < 4; ++direction) {
               int nr = row + dr[direction];
               int nc = col + dc[direction];
               if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                   add_cell(board, nr, nc, qr, qc, &tail);
               }
           }
       }

       for (int row = 0; row < rows; ++row) {
           for (int col = 0; col < cols; ++col) {
               if (board[row][col] == 'O') {
                   board[row][col] = 'X';
               } else if (board[row][col] == '#') {
                   board[row][col] = 'O';
               }
           }
       }
       free(qr);
       free(qc);
   }
