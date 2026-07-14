Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn word_break(
           s: String,
           word_dict: Vec<String>,
       ) -> Vec<String> {
           let source = s.as_bytes();
           let mut sentences = vec![Vec::<String>::new(); source.len() + 1];
           sentences[source.len()].push(String::new());

           for start in (0..source.len()).rev() {
               let mut current = Vec::<String>::new();
               for word in &word_dict {
                   let word_bytes = word.as_bytes();
                   let end = start + word_bytes.len();
                   if end > source.len()
                       || &source[start..end] != word_bytes
                   {
                       continue;
                   }

                   for tail in &sentences[end] {
                       if tail.is_empty() {
                           current.push(word.clone());
                       } else {
                           current.push(format!("{} {}", word, tail));
                       }
                   }
               }
               sentences[start] = current;
           }
           sentences.remove(0)
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func wordBreak(s string, wordDict []string) []string {
       sentences := make([][]string, len(s)+1)
       sentences[len(s)] = []string{""}

       for start := len(s) - 1; start >= 0; start-- {
           current := make([]string, 0)
           for _, word := range wordDict {
               end := start + len(word)
               if end > len(s) ||
                   !strings.HasPrefix(s[start:], word) {
                   continue
               }
               for _, tail := range sentences[end] {
                   if tail == "" {
                       current = append(current, word)
                   } else {
                       current = append(
                           current,
                           word+" "+tail,
                       )
                   }
               }
           }
           sentences[start] = current
       }
       return sentences[0]
   }
