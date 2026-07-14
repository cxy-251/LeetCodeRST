C#
~~

.. code-block:: csharp

   public class Solution {
       public void Solve(char[][] board) {
           if (board.Length == 0 || board[0].Length == 0) return;
           int rows = board.Length;
           int cols = board[0].Length;
           var queue = new Queue<(int Row, int Col)>();

           void Enqueue(int row, int col) {
               if (board[row][col] == 'O') {
                   board[row][col] = '#';
                   queue.Enqueue((row, col));
               }
           }

           for (int col = 0; col < cols; ++col) {
               Enqueue(0, col);
               Enqueue(rows - 1, col);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               Enqueue(row, 0);
               Enqueue(row, cols - 1);
           }

           int[][] directions = {
               new[] {1, 0}, new[] {-1, 0},
               new[] {0, 1}, new[] {0, -1}
           };
           while (queue.Count > 0) {
               var (row, col) = queue.Dequeue();
               foreach (int[] direction in directions) {
                   int nr = row + direction[0];
                   int nc = col + direction[1];
                   if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                       Enqueue(nr, nc);
                   }
               }
           }

           for (int row = 0; row < rows; ++row) {
               for (int col = 0; col < cols; ++col) {
                   if (board[row][col] == 'O') board[row][col] = 'X';
                   else if (board[row][col] == '#') board[row][col] = 'O';
               }
           }
       }
   }
