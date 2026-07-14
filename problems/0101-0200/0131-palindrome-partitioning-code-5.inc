Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn partition(s: String) -> Vec<Vec<String>> {
           let bytes = s.as_bytes();
           let n = bytes.len();
           let mut palindrome = vec![vec![false; n]; n];
           for start in (0..n).rev() {
               for end in start..n {
                   palindrome[start][end] =
                       bytes[start] == bytes[end] &&
                       (end - start < 2 || palindrome[start + 1][end - 1]);
               }
           }

           fn dfs(
               s: &str,
               start: usize,
               palindrome: &[Vec<bool>],
               path: &mut Vec<String>,
               answers: &mut Vec<Vec<String>>,
           ) {
               if start == s.len() {
                   answers.push(path.clone());
                   return;
               }
               for end in start..s.len() {
                   if !palindrome[start][end] {
                       continue;
                   }
                   path.push(s[start..=end].to_string());
                   dfs(s, end + 1, palindrome, path, answers);
                   path.pop();
               }
           }

           let mut answers = Vec::new();
           dfs(&s, 0, &palindrome, &mut Vec::new(), &mut answers);
           answers
       }
   }
