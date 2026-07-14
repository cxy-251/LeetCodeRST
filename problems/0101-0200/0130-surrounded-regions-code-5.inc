Rust
~~~~

.. code-block:: rust

   use std::collections::VecDeque;

   impl Solution {
       pub fn solve(board: &mut Vec<Vec<char>>) {
           if board.is_empty() || board[0].is_empty() {
               return;
           }
           let rows = board.len();
           let cols = board[0].len();
           let mut queue = VecDeque::new();

           fn enqueue(
               board: &mut [Vec<char>],
               row: usize,
               col: usize,
               queue: &mut VecDeque<(usize, usize)>,
           ) {
               if board[row][col] == 'O' {
                   board[row][col] = '#';
                   queue.push_back((row, col));
               }
           }

           for col in 0..cols {
               enqueue(board, 0, col, &mut queue);
               enqueue(board, rows - 1, col, &mut queue);
           }
           for row in 1..rows.saturating_sub(1) {
               enqueue(board, row, 0, &mut queue);
               enqueue(board, row, cols - 1, &mut queue);
           }

           let directions = [(1_i32, 0_i32), (-1, 0), (0, 1), (0, -1)];
           while let Some((row, col)) = queue.pop_front() {
               for (dr, dc) in directions {
                   let nr = row as i32 + dr;
                   let nc = col as i32 + dc;
                   if nr >= 0 && nr < rows as i32 &&
                       nc >= 0 && nc < cols as i32 {
                       enqueue(
                           board,
                           nr as usize,
                           nc as usize,
                           &mut queue,
                       );
                   }
               }
           }

           for row in board {
               for cell in row {
                   if *cell == 'O' {
                       *cell = 'X';
                   } else if *cell == '#' {
                       *cell = 'O';
                   }
               }
           }
       }
   }
