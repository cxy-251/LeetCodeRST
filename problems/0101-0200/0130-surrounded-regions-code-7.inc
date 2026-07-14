TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function solve(board: string[][]): void {
       if (board.length === 0 || board[0].length === 0) return;
       const rows = board.length;
       const cols = board[0].length;
       const queue: Array<[number, number]> = [];
       const add = (row: number, col: number): void => {
           if (board[row][col] === "O") {
               board[row][col] = "#";
               queue.push([row, col]);
           }
       };
       for (let col = 0; col < cols; col++) {
           add(0, col);
           add(rows - 1, col);
       }
       for (let row = 1; row + 1 < rows; row++) {
           add(row, 0);
           add(row, cols - 1);
       }
       const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
       for (let head = 0; head < queue.length; head++) {
           const [row, col] = queue[head];
           for (const [dr, dc] of directions) {
               const nr = row + dr;
               const nc = col + dc;
               if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                   add(nr, nc);
               }
           }
       }
       for (let row = 0; row < rows; row++) {
           for (let col = 0; col < cols; col++) {
               if (board[row][col] === "O") board[row][col] = "X";
               else if (board[row][col] === "#") board[row][col] = "O";
           }
       }
   }
