Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_cut(s: String) -> i32 {
           let bytes = s.as_bytes();
           let n = bytes.len();
           let mut pal = vec![vec![false; n]; n];
           let mut cuts: Vec<usize> = (0..n).collect();

           for end in 0..n {
               for start in (0..=end).rev() {
                   let inner = end - start <= 1 ||
                       pal[start + 1][end - 1];
                   if bytes[start] == bytes[end] && inner {
                       pal[start][end] = true;
                       let candidate = if start == 0 {
                           0
                       } else {
                           cuts[start - 1] + 1
                       };
                       cuts[end] = cuts[end].min(candidate);
                   }
               }
           }
           cuts[n - 1] as i32
       }
   }

Go
~~

.. code-block:: go

   func minCut(s string) int {
       n := len(s)
       pal := make([][]bool, n)
       cuts := make([]int, n)
       for i := range pal {
           pal[i] = make([]bool, n)
       }

       for end := 0; end < n; end++ {
           cuts[end] = end
           for start := end; start >= 0; start-- {
               inner := end-start <= 1 ||
                   pal[start+1][end-1]
               if s[start] == s[end] && inner {
                   pal[start][end] = true
                   candidate := 0
                   if start > 0 {
                       candidate = cuts[start-1] + 1
                   }
                   if candidate < cuts[end] {
                       cuts[end] = candidate
                   }
               }
           }
       }
       return cuts[n-1]
   }
