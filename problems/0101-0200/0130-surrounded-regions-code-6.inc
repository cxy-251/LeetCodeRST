Go
~~

.. code-block:: go

   func solve(board [][]byte) {
       if len(board) == 0 || len(board[0]) == 0 {
           return
       }
       rows, cols := len(board), len(board[0])
       queue := make([][2]int, 0)
       add := func(row, col int) {
           if board[row][col] == 'O' {
               board[row][col] = '#'
               queue = append(queue, [2]int{row, col})
           }
       }
       for col := 0; col < cols; col++ {
           add(0, col)
           add(rows-1, col)
       }
       for row := 1; row+1 < rows; row++ {
           add(row, 0)
           add(row, cols-1)
       }
       directions := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
       for head := 0; head < len(queue); head++ {
           row, col := queue[head][0], queue[head][1]
           for _, d := range directions {
               nr, nc := row+d[0], col+d[1]
               if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
                   add(nr, nc)
               }
           }
       }
       for row := range board {
           for col := range board[row] {
               if board[row][col] == 'O' {
                   board[row][col] = 'X'
               } else if board[row][col] == '#' {
                   board[row][col] = 'O'
               }
           }
       }
   }
