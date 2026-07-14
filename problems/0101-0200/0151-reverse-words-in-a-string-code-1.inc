C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   char *reverseWords(char *s) {
       size_t length = strlen(s);
       char *result = malloc(length + 1U);
       if (result == NULL) {
           return NULL;
       }

       size_t write = 0U;
       ptrdiff_t end = (ptrdiff_t)length - 1;
       while (end >= 0) {
           while (end >= 0 && s[end] == ' ') {
               --end;
           }
           if (end < 0) {
               break;
           }

           ptrdiff_t start = end;
           while (start >= 0 && s[start] != ' ') {
               --start;
           }

           if (write > 0U) {
               result[write++] = ' ';
           }
           size_t word_length = (size_t)(end - start);
           memcpy(result + write, s + start + 1, word_length);
           write += word_length;
           end = start - 1;
       }

       result[write] = '\0';
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <string>

   class Solution {
   public:
       std::string reverseWords(std::string s) {
           std::string result;
           result.reserve(s.size());

           int end = static_cast<int>(s.size()) - 1;
           while (end >= 0) {
               while (end >= 0 && s[end] == ' ') {
                   --end;
               }
               if (end < 0) {
                   break;
               }

               int start = end;
               while (start >= 0 && s[start] != ' ') {
                   --start;
               }

               if (!result.empty()) {
                   result.push_back(' ');
               }
               result.append(
                   s,
                   static_cast<std::size_t>(start + 1),
                   static_cast<std::size_t>(end - start)
               );
               end = start - 1;
           }

           return result;
       }
   };
