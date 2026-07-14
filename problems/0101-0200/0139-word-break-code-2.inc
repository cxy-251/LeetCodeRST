Python
~~~~~~

.. code-block:: python

   class Solution:
       def wordBreak(self, s: str, wordDict: list[str]) -> bool:
           reachable = [False] * (len(s) + 1)
           reachable[0] = True

           for start in range(len(s)):
               if not reachable[start]:
                   continue
               for word in wordDict:
                   end = start + len(word)
                   if end <= len(s) and s.startswith(word, start):
                       reachable[end] = True

           return reachable[len(s)]

Java
~~~~

.. code-block:: java

   import java.util.List;

   class Solution {
       public boolean wordBreak(String s, List<String> wordDict) {
           boolean[] reachable = new boolean[s.length() + 1];
           reachable[0] = true;

           for (int start = 0; start < s.length(); ++start) {
               if (!reachable[start]) continue;
               for (String word : wordDict) {
                   int end = start + word.length();
                   if (end <= s.length() && s.startsWith(word, start)) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.length()];
       }
   }
