C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char **items;
       int size;
       int capacity;
   } StringList;

   static void free_list(StringList *list) {
       for (int index = 0; index < list->size; ++index) {
           free(list->items[index]);
       }
       free(list->items);
       list->items = NULL;
       list->size = 0;
       list->capacity = 0;
   }

   static bool reserve_one(StringList *list) {
       if (list->size < list->capacity) {
           return true;
       }
       int next_capacity = list->capacity == 0
           ? 4
           : list->capacity * 2;
       char **next = realloc(
           list->items,
           (size_t)next_capacity * sizeof(*next)
       );
       if (next == NULL) {
           return false;
       }
       list->items = next;
       list->capacity = next_capacity;
       return true;
   }

   static bool append_sentence(
       StringList *list,
       const char *word,
       size_t word_length,
       const char *tail
   ) {
       if (!reserve_one(list)) {
           return false;
       }

       size_t tail_length = strlen(tail);
       size_t sentence_length = word_length +
           (tail_length == 0 ? 0 : 1 + tail_length);
       char *sentence = malloc(sentence_length + 1);
       if (sentence == NULL) {
           return false;
       }

       memcpy(sentence, word, word_length);
       size_t cursor = word_length;
       if (tail_length != 0) {
           sentence[cursor++] = ' ';
           memcpy(sentence + cursor, tail, tail_length);
           cursor += tail_length;
       }
       sentence[cursor] = '\0';
       list->items[list->size++] = sentence;
       return true;
   }

   char **wordBreak(
       char *s,
       char **wordDict,
       int wordDictSize,
       int *returnSize
   ) {
       *returnSize = 0;
       size_t n = strlen(s);
       StringList *sentences = calloc(
           n + 1,
           sizeof(*sentences)
       );
       size_t *lengths = malloc(
           (size_t)wordDictSize * sizeof(*lengths)
       );
       if (sentences == NULL || lengths == NULL) {
           free(sentences);
           free(lengths);
           return NULL;
       }

       for (int index = 0; index < wordDictSize; ++index) {
           lengths[index] = strlen(wordDict[index]);
       }
       if (!append_sentence(&sentences[n], "", 0, "")) {
           for (size_t pos = 0; pos <= n; ++pos) {
               free_list(&sentences[pos]);
           }
           free(lengths);
           free(sentences);
           return NULL;
       }

       for (size_t start = n; start-- > 0;) {
           for (int index = 0; index < wordDictSize; ++index) {
               size_t word_length = lengths[index];
               size_t end = start + word_length;
               if (end > n ||
                   memcmp(
                       s + start,
                       wordDict[index],
                       word_length
                   ) != 0) {
                   continue;
               }

               for (int tail_index = 0;
                    tail_index < sentences[end].size;
                    ++tail_index) {
                   if (!append_sentence(
                           &sentences[start],
                           wordDict[index],
                           word_length,
                           sentences[end].items[tail_index]
                       )) {
                       for (size_t pos = 0; pos <= n; ++pos) {
                           free_list(&sentences[pos]);
                       }
                       free(lengths);
                       free(sentences);
                       return NULL;
                   }
               }
           }
       }

       char **answer = sentences[0].items;
       *returnSize = sentences[0].size;
       sentences[0].items = NULL;
       sentences[0].size = 0;
       sentences[0].capacity = 0;

       for (size_t pos = 0; pos <= n; ++pos) {
           free_list(&sentences[pos]);
       }
       free(lengths);
       free(sentences);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::vector<std::string> wordBreak(
           std::string s,
           std::vector<std::string>& wordDict
       ) {
           std::vector<std::vector<std::string>> sentences(
               s.size() + 1
           );
           sentences[s.size()].push_back("");

           for (std::size_t start = s.size(); start-- > 0;) {
               for (const std::string& word : wordDict) {
                   std::size_t end = start + word.size();
                   if (end > s.size() ||
                       s.compare(start, word.size(), word) != 0) {
                       continue;
                   }
                   for (const std::string& tail : sentences[end]) {
                       sentences[start].push_back(
                           tail.empty()
                               ? word
                               : word + " " + tail
                       );
                   }
               }
           }
           return sentences[0];
       }
   };
