C
~

.. code-block:: c

   #include <limits.h>
   #include <stdlib.h>

   struct MinEntry {
       int value;
       int minimum;
   };

   typedef struct {
       struct MinEntry *entries;
       int size;
       int capacity;
   } MinStack;

   MinStack *minStackCreate(void) {
       MinStack *stack = malloc(sizeof(*stack));
       if (stack == NULL) {
           return NULL;
       }

       stack->capacity = 16;
       stack->size = 0;
       stack->entries = malloc(
           (size_t)stack->capacity * sizeof(*stack->entries)
       );
       if (stack->entries == NULL) {
           free(stack);
           return NULL;
       }
       return stack;
   }

   void minStackPush(MinStack *stack, int value) {
       if (stack->size == stack->capacity) {
           int new_capacity = stack->capacity * 2;
           struct MinEntry *resized = realloc(
               stack->entries,
               (size_t)new_capacity * sizeof(*resized)
           );
           if (resized == NULL) {
               return;
           }
           stack->entries = resized;
           stack->capacity = new_capacity;
       }

       int minimum = value;
       if (stack->size > 0 &&
           stack->entries[stack->size - 1].minimum < minimum) {
           minimum = stack->entries[stack->size - 1].minimum;
       }
       stack->entries[stack->size++] =
           (struct MinEntry){value, minimum};
   }

   void minStackPop(MinStack *stack) {
       --stack->size;
   }

   int minStackTop(MinStack *stack) {
       return stack->entries[stack->size - 1].value;
   }

   int minStackGetMin(MinStack *stack) {
       return stack->entries[stack->size - 1].minimum;
   }

   void minStackFree(MinStack *stack) {
       if (stack != NULL) {
           free(stack->entries);
           free(stack);
       }
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <utility>
   #include <vector>

   class MinStack {
   public:
       void push(int value) {
           int minimum = entries_.empty()
               ? value
               : std::min(value, entries_.back().second);
           entries_.push_back({value, minimum});
       }

       void pop() {
           entries_.pop_back();
       }

       int top() const {
           return entries_.back().first;
       }

       int getMin() const {
           return entries_.back().second;
       }

   private:
       std::vector<std::pair<int, int>> entries_;
   };
