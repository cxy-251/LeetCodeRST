Java
~~~~

.. code-block:: java

   import java.util.ArrayDeque;
   import java.util.Queue;

   class Solution {
       public void solve(char[][] board) {
           if (board.length == 0 || board[0].length == 0) {
               return;
           }
           int rows = board.length;
           int cols = board[0].length;
           Queue<int[]> queue = new ArrayDeque<>();

           for (int col = 0; col < cols; ++col) {
               enqueue(board, 0, col, queue);
               enqueue(board, rows - 1, col, queue);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               enqueue(board, row, 0, queue);
               enqueue(board, row, cols - 1, queue);
           }

           int[][] directions = {
               {1, 0}, {-1, 0}, {0, 1}, {0, -1}
           };
           while (!queue.isEmpty()) {
               int[] cell = queue.remove();
               for (int[] direction : directions) {
                   int nr = cell[0] + direction[0];
                   int nc = cell[1] + direction[1];
                   if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                       enqueue(board, nr, nc, queue);
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
       }

       private void enqueue(
           char[][] board,
           int row,
           int col,
           Queue<int[]> queue
       ) {
           if (board[row][col] == 'O') {
               board[row][col] = '#';
               queue.add(new int[] {row, col});
           }
       }
   }
