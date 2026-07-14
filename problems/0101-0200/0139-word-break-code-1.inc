C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   bool wordBreak(char *s, char **wordDict, int wordDictSize) {
       size_t n = strlen(s);
       bool *reachable = calloc(n + 1, sizeof(*reachable));
       size_t *lengths = malloc(
           (size_t)wordDictSize * sizeof(*lengths)
       );
       if (reachable == NULL || lengths == NULL) {
           free(reachable);
           free(lengths);
           return false;
       }

       for (int index = 0; index < wordDictSize; ++index) {
           lengths[index] = strlen(wordDict[index]);
       }

       reachable[0] = true;
       for (size_t start = 0; start < n; ++start) {
           if (!reachable[start]) {
               continue;
           }
           for (int index = 0; index < wordDictSize; ++index) {
               size_t length = lengths[index];
               size_t end = start + length;
               if (end <= n &&
                   memcmp(s + start, wordDict[index], length) == 0) {
                   reachable[end] = true;
               }
           }
       }

       bool answer = reachable[n];
       free(lengths);
       free(reachable);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       bool wordBreak(
           std::string s,
           std::vector<std::string>& wordDict
       ) {
           std::vector<char> reachable(s.size() + 1, false);
           reachable[0] = true;

           for (std::size_t start = 0; start < s.size(); ++start) {
               if (!reachable[start]) {
                   continue;
               }
               for (const std::string& word : wordDict) {
                   std::size_t end = start + word.size();
                   if (end <= s.size() &&
                       s.compare(start, word.size(), word) == 0) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.size()];
       }
   };
