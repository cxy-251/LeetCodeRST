Julia
~~~~~

.. code-block:: julia

   function compare_version(
       version1::String,
       version2::String,
   )::Int
       left = codeunits(version1)
       right = codeunits(version2)
       position1 = 1
       position2 = 1

       while position1 <= length(left) || position2 <= length(right)
           start1, digits1, next1 =
               read_version_segment(left, position1)
           start2, digits2, next2 =
               read_version_segment(right, position2)

           digits1 < digits2 && return -1
           digits1 > digits2 && return 1

           offset = 0
           while offset < digits1
               first = left[start1 + offset]
               second = right[start2 + offset]
               first < second && return -1
               first > second && return 1
               offset += 1
           end

           position1 = next1
           position2 = next2
       end

       return 0
   end

   function read_version_segment(
       version,
       position::Int,
   )::Tuple{Int, Int, Int}
       count = length(version)
       position > count && return (count + 1, 0, count + 1)

       stop = position
       while stop <= count && version[stop] != UInt8('.')
           stop += 1
       end

       significant = position
       while significant < stop && version[significant] == UInt8('0')
           significant += 1
       end

       next_position = stop <= count ? stop + 1 : count + 1
       return significant, stop - significant, next_position
   end

R
~

.. code-block:: r

   compare_version <- function(version1, version2) {
     left <- as.integer(charToRaw(version1))
     right <- as.integer(charToRaw(version2))
     position1 <- 1L
     position2 <- 1L

     while (
       position1 <= length(left) ||
       position2 <= length(right)
     ) {
       first <- read_version_segment(left, position1)
       second <- read_version_segment(right, position2)

       if (first$length < second$length) {
         return(-1L)
       }
       if (first$length > second$length) {
         return(1L)
       }

       offset <- 0L
       while (offset < first$length) {
         left_digit <- left[first$start + offset]
         right_digit <- right[second$start + offset]
         if (left_digit < right_digit) {
           return(-1L)
         }
         if (left_digit > right_digit) {
           return(1L)
         }
         offset <- offset + 1L
       }

       position1 <- first$next_position
       position2 <- second$next_position
     }

     0L
   }

   read_version_segment <- function(bytes, position) {
     count <- length(bytes)
     if (position > count) {
       return(list(
         start = count + 1L,
         length = 0L,
         next_position = count + 1L
       ))
     }

     stop <- position
     while (stop <= count && bytes[stop] != 46L) {
       stop <- stop + 1L
     }

     significant <- position
     while (significant < stop && bytes[significant] == 48L) {
       significant <- significant + 1L
     }

     list(
       start = significant,
       length = stop - significant,
       next_position = if (stop <= count) stop + 1L else count + 1L
     )
   }
