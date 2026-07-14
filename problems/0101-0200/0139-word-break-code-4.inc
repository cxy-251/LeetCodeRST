TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, wordDict: string[]): boolean {
       const reachable = new Array<boolean>(s.length + 1).fill(false);
       reachable[0] = true;

       for (let start = 0; start < s.length; start += 1) {
           if (!reachable[start]) continue;
           for (const word of wordDict) {
               const end = start + word.length;
               if (end <= s.length && s.startsWith(word, start)) {
                   reachable[end] = true;
               }
           }
       }
       return reachable[s.length];
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public bool WordBreak(string s, IList<string> wordDict) {
           bool[] reachable = new bool[s.Length + 1];
           reachable[0] = true;

           for (int start = 0; start < s.Length; ++start) {
               if (!reachable[start]) continue;
               foreach (string word in wordDict) {
                   int end = start + word.Length;
                   if (end <= s.Length &&
                       string.CompareOrdinal(
                           s, start, word, 0, word.Length
                       ) == 0) {
                       reachable[end] = true;
                   }
               }
           }
           return reachable[s.Length];
       }
   }
