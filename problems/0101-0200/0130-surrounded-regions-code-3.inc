Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:
       def solve(self, board: list[list[str]]) -> None:
           if not board or not board[0]:
               return

           rows, cols = len(board), len(board[0])
           queue: deque[tuple[int, int]] = deque()

           def enqueue(row: int, col: int) -> None:
               if board[row][col] == "O":
                   board[row][col] = "#"
                   queue.append((row, col))

           for col in range(cols):
               enqueue(0, col)
               enqueue(rows - 1, col)
           for row in range(1, rows - 1):
               enqueue(row, 0)
               enqueue(row, cols - 1)

           while queue:
               row, col = queue.popleft()
               for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                   nr, nc = row + dr, col + dc
                   if 0 <= nr < rows and 0 <= nc < cols:
                       enqueue(nr, nc)

           for row in range(rows):
               for col in range(cols):
                   if board[row][col] == "O":
                       board[row][col] = "X"
                   elif board[row][col] == "#":
                       board[row][col] = "O"
