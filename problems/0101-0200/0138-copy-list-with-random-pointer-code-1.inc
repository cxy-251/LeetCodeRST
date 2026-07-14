C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   struct PointerEntry {
       const struct Node *key;
       int index;
   };

   static size_t pointer_hash(const struct Node *node, size_t mask) {
       uintptr_t value = (uintptr_t)node;
       value ^= value >> 17;
       value ^= value >> 9;
       return (size_t)value & mask;
   }

   static void insert_pointer(
       struct PointerEntry *table,
       size_t mask,
       const struct Node *key,
       int index
   ) {
       size_t slot = pointer_hash(key, mask);
       while (table[slot].key != NULL) {
           slot = (slot + 1U) & mask;
       }
       table[slot].key = key;
       table[slot].index = index;
   }

   static int find_pointer(
       const struct PointerEntry *table,
       size_t mask,
       const struct Node *key
   ) {
       size_t slot = pointer_hash(key, mask);
       while (table[slot].key != key) {
           slot = (slot + 1U) & mask;
       }
       return table[slot].index;
   }

   static void free_copies(struct Node **copies, int count) {
       for (int i = 0; i < count; ++i) {
           free(copies[i]);
       }
   }

   struct Node *copyRandomList(struct Node *head) {
       if (head == NULL) {
           return NULL;
       }

       int count = 0;
       for (struct Node *node = head; node != NULL; node = node->next) {
           ++count;
       }

       struct Node **originals =
           malloc((size_t)count * sizeof(*originals));
       struct Node **copies = malloc((size_t)count * sizeof(*copies));
       size_t capacity = 1U;
       while (capacity < (size_t)count * 2U) {
           capacity <<= 1U;
       }
       struct PointerEntry *table =
           calloc(capacity, sizeof(*table));

       if (originals == NULL || copies == NULL || table == NULL) {
           free(originals);
           free(copies);
           free(table);
           return NULL;
       }

       int index = 0;
       for (struct Node *node = head; node != NULL; node = node->next) {
           originals[index] = node;
           copies[index] = malloc(sizeof(*copies[index]));
           if (copies[index] == NULL) {
               free_copies(copies, index);
               free(originals);
               free(copies);
               free(table);
               return NULL;
           }
           copies[index]->val = node->val;
           copies[index]->next = NULL;
           copies[index]->random = NULL;
           insert_pointer(table, capacity - 1U, node, index);
           ++index;
       }

       for (int i = 0; i < count; ++i) {
           copies[i]->next = i + 1 < count ? copies[i + 1] : NULL;
           if (originals[i]->random != NULL) {
               int random_index = find_pointer(
                   table,
                   capacity - 1U,
                   originals[i]->random
               );
               copies[i]->random = copies[random_index];
           }
       }

       struct Node *answer = copies[0];
       free(originals);
       free(copies);
       free(table);
       return answer;
   }
