TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, wordDict: string[]): string[] {
       const sentences: string[][] = Array.from(
           { length: s.length + 1 },
           () => [],
       );
       sentences[s.length].push("");

       for (let start = s.length - 1; start >= 0; start -= 1) {
           for (const word of wordDict) {
               const end = start + word.length;
               if (end > s.length || !s.startsWith(word, start)) {
                   continue;
               }
               for (const tail of sentences[end]) {
                   sentences[start].push(
                       tail === "" ? word : `${word} ${tail}`,
                   );
               }
           }
       }
       return sentences[0];
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public IList<string> WordBreak(
           string s,
           IList<string> wordDict
       ) {
           List<string>[] sentences =
               new List<string>[s.Length + 1];
           for (int index = 0; index <= s.Length; ++index) {
               sentences[index] = new List<string>();
           }
           sentences[s.Length].Add("");

           for (int start = s.Length - 1; start >= 0; --start) {
               foreach (string word in wordDict) {
                   int end = start + word.Length;
                   if (end > s.Length ||
                       string.CompareOrdinal(
                           s, start, word, 0, word.Length
                       ) != 0) {
                       continue;
                   }
                   foreach (string tail in sentences[end]) {
                       sentences[start].Add(
                           tail.Length == 0
                               ? word
                               : word + " " + tail
                       );
                   }
               }
           }
           return sentences[0];
       }
   }
