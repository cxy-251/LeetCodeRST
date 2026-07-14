TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reverseWords(s: string): string {
       const words: string[] = [];
       let end = s.length - 1;

       while (end >= 0) {
           while (end >= 0 && s[end] === " ") {
               end--;
           }
           if (end < 0) {
               break;
           }

           let start = end;
           while (start >= 0 && s[start] !== " ") {
               start--;
           }
           words.push(s.slice(start + 1, end + 1));
           end = start - 1;
       }

       return words.join(" ");
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public string ReverseWords(string s) {
           var words = new List<string>();
           int end = s.Length - 1;

           while (end >= 0) {
               while (end >= 0 && s[end] == ' ') {
                   end--;
               }
               if (end < 0) {
                   break;
               }

               int start = end;
               while (start >= 0 && s[start] != ' ') {
                   start--;
               }
               words.Add(s.Substring(start + 1, end - start));
               end = start - 1;
           }

           return string.Join(" ", words);
       }
   }
