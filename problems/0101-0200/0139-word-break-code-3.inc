Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn word_break(
           s: String,
           word_dict: Vec<String>,
       ) -> bool {
           let source = s.as_bytes();
           let words: Vec<&[u8]> = word_dict
               .iter()
               .map(|word| word.as_bytes())
               .collect();
           let mut reachable = vec![false; source.len() + 1];
           reachable[0] = true;

           for start in 0..source.len() {
               if !reachable[start] {
                   continue;
               }
               for word in &words {
                   let end = start + word.len();
                   if end <= source.len()
                       && &source[start..end] == *word
                   {
                       reachable[end] = true;
                   }
               }
           }
           reachable[source.len()]
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func wordBreak(s string, wordDict []string) bool {
       reachable := make([]bool, len(s)+1)
       reachable[0] = true

       for start := 0; start < len(s); start++ {
           if !reachable[start] {
               continue
           }
           for _, word := range wordDict {
               end := start + len(word)
               if end <= len(s) &&
                   strings.HasPrefix(s[start:], word) {
                   reachable[end] = true
               }
           }
       }
       return reachable[len(s)]
   }
