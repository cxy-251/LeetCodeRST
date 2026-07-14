C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
       int rows = 0;
       int cols = 0;
       std::vector<std::vector<char>>* grid = nullptr;

       void mark(int row, int col) {
           if (row < 0 || row >= rows || col < 0 || col >= cols ||
               (*grid)[row][col] != 'O') {
               return;
           }
           (*grid)[row][col] = '#';
           mark(row + 1, col);
           mark(row - 1, col);
           mark(row, col + 1);
           mark(row, col - 1);
       }

   public:
       void solve(std::vector<std::vector<char>>& board) {
           if (board.empty() || board[0].empty()) return;
           grid = &board;
           rows = static_cast<int>(board.size());
           cols = static_cast<int>(board[0].size());
           for (int col = 0; col < cols; ++col) {
               mark(0, col);
               mark(rows - 1, col);
           }
           for (int row = 1; row + 1 < rows; ++row) {
               mark(row, 0);
               mark(row, cols - 1);
           }
           for (auto& row : board) {
               for (char& cell : row) {
                   if (cell == 'O') cell = 'X';
                   else if (cell == '#') cell = 'O';
               }
           }
       }
   };
