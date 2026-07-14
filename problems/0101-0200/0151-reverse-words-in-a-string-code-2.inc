Python
~~~~~~

.. code-block:: python

   class Solution:
       def reverseWords(self, s: str) -> str:
           words: list[str] = []
           end = len(s) - 1

           while end >= 0:
               while end >= 0 and s[end] == " ":
                   end -= 1
               if end < 0:
                   break

               start = end
               while start >= 0 and s[start] != " ":
                   start -= 1
               words.append(s[start + 1 : end + 1])
               end = start - 1

           return " ".join(words)

Java
~~~~

.. code-block:: java

   class Solution {
       public String reverseWords(String s) {
           StringBuilder result = new StringBuilder(s.length());
           int end = s.length() - 1;

           while (end >= 0) {
               while (end >= 0 && s.charAt(end) == ' ') {
                   end--;
               }
               if (end < 0) {
                   break;
               }

               int start = end;
               while (start >= 0 && s.charAt(start) != ' ') {
                   start--;
               }
               if (result.length() > 0) {
                   result.append(' ');
               }
               result.append(s, start + 1, end + 1);
               end = start - 1;
           }

           return result.toString();
       }
   }
