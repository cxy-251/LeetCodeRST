Julia
~~~~~

.. code-block:: julia

   function solve!(board::Matrix{Char})::Nothing
       rows, cols = size(board)
       (rows == 0 || cols == 0) && return nothing
       queue = Tuple{Int,Int}[]
       head = 1

       function enqueue!(row::Int, col::Int)
           if board[row, col] == 'O'
               board[row, col] = '#'
               push!(queue, (row, col))
           end
       end

       for col in 1:cols
           enqueue!(1, col)
           enqueue!(rows, col)
       end
       if rows > 2
           for row in 2:(rows - 1)
               enqueue!(row, 1)
               enqueue!(row, cols)
           end
       end

       while head <= length(queue)
           row, col = queue[head]
           head += 1
           for (dr, dc) in ((1, 0), (-1, 0), (0, 1), (0, -1))
               nr, nc = row + dr, col + dc
               if 1 <= nr <= rows && 1 <= nc <= cols
                   enqueue!(nr, nc)
               end
           end
       end

       for index in eachindex(board)
           if board[index] == 'O'
               board[index] = 'X'
           elseif board[index] == '#'
               board[index] = 'O'
           end
       end
       return nothing
   end
