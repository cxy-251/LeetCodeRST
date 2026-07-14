Python
~~~~~~

.. code-block:: python

   class Solution:
       def wordBreak(
           self,
           s: str,
           wordDict: list[str],
       ) -> list[str]:
           sentences: list[list[str]] = [
               [] for _ in range(len(s) + 1)
           ]
           sentences[len(s)] = [""]

           for start in range(len(s) - 1, -1, -1):
               for word in wordDict:
                   end = start + len(word)
                   if end > len(s) or not s.startswith(word, start):
                       continue
                   for tail in sentences[end]:
                       sentences[start].append(
                           word if tail == "" else f"{word} {tail}"
                       )

           return sentences[0]

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<String> wordBreak(
           String s,
           List<String> wordDict
       ) {
           List<List<String>> sentences = new ArrayList<>();
           for (int index = 0; index <= s.length(); ++index) {
               sentences.add(new ArrayList<>());
           }
           sentences.get(s.length()).add("");

           for (int start = s.length() - 1; start >= 0; --start) {
               for (String word : wordDict) {
                   int end = start + word.length();
                   if (end > s.length() ||
                       !s.startsWith(word, start)) {
                       continue;
                   }
                   for (String tail : sentences.get(end)) {
                       sentences.get(start).add(
                           tail.isEmpty()
                               ? word
                               : word + " " + tail
                       );
                   }
               }
           }
           return sentences.get(0);
       }
   }
