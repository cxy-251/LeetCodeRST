Go
~~

.. code-block:: go

   func partition(s string) [][]string {
       n := len(s)
       pal := make([][]bool, n)
       for i := range pal {
           pal[i] = make([]bool, n)
       }
       for start := n - 1; start >= 0; start-- {
           for end := start; end < n; end++ {
               pal[start][end] = s[start] == s[end] &&
                   (end-start < 2 || pal[start+1][end-1])
           }
       }
       answers := make([][]string, 0)
       path := make([]string, 0)
       var dfs func(int)
       dfs = func(start int) {
           if start == n {
               answers = append(answers, append([]string(nil), path...))
               return
           }
           for end := start; end < n; end++ {
               if !pal[start][end] {
                   continue
               }
               path = append(path, s[start:end+1])
               dfs(end + 1)
               path = path[:len(path)-1]
           }
       }
       dfs(0)
       return answers
   }
