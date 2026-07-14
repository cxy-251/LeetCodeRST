R
~

.. code-block:: r

   solve_regions <- function(board) {
     rows <- nrow(board)
     cols <- ncol(board)
     if (rows == 0L || cols == 0L) return(board)

     qr <- integer(0)
     qc <- integer(0)
     enqueue <- function(row, col) {
       if (board[row, col] == "O") {
         board[row, col] <<- "#"
         qr <<- c(qr, row)
         qc <<- c(qc, col)
       }
     }

     for (col in seq_len(cols)) {
       enqueue(1L, col)
       enqueue(rows, col)
     }
     if (rows > 2L) {
       for (row in 2L:(rows - 1L)) {
         enqueue(row, 1L)
         enqueue(row, cols)
       }
     }

     head <- 1L
     directions <- matrix(c(1L, 0L, -1L, 0L, 0L, 1L, 0L, -1L),
                          ncol = 2L, byrow = TRUE)
     while (head <= length(qr)) {
       row <- qr[[head]]
       col <- qc[[head]]
       head <- head + 1L
       for (i in seq_len(4L)) {
         nr <- row + directions[i, 1L]
         nc <- col + directions[i, 2L]
         if (nr >= 1L && nr <= rows && nc >= 1L && nc <= cols) {
           enqueue(nr, nc)
         }
       }
     }

     board[board == "O"] <- "X"
     board[board == "#"] <- "O"
     board
   }
