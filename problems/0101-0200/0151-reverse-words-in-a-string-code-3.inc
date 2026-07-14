Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn reverse_words(s: String) -> String {
           let bytes = s.as_bytes();
           let mut words: Vec<&str> = Vec::new();
           let mut end = bytes.len();

           while end > 0 {
               while end > 0 && bytes[end - 1] == b' ' {
                   end -= 1;
               }
               if end == 0 {
                   break;
               }

               let mut start = end;
               while start > 0 && bytes[start - 1] != b' ' {
                   start -= 1;
               }
               words.push(&s[start..end]);
               end = start;
           }

           words.join(" ")
       }
   }

Go
~~

.. code-block:: go

   import "strings"

   func reverseWords(s string) string {
       words := make([]string, 0)
       end := len(s)

       for end > 0 {
           for end > 0 && s[end-1] == ' ' {
               end--
           }
           if end == 0 {
               break
           }

           start := end
           for start > 0 && s[start-1] != ' ' {
               start--
           }
           words = append(words, s[start:end])
           end = start
       }

       return strings.Join(words, " ")
   }
