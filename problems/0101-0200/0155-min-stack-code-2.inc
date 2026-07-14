Python
~~~~~~

.. code-block:: python

   class MinStack:
       def __init__(self) -> None:
           self.entries: list[tuple[int, int]] = []

       def push(self, value: int) -> None:
           minimum = value
           if self.entries:
               minimum = min(minimum, self.entries[-1][1])
           self.entries.append((value, minimum))

       def pop(self) -> None:
           self.entries.pop()

       def top(self) -> int:
           return self.entries[-1][0]

       def getMin(self) -> int:
           return self.entries[-1][1]

Java
~~~~

.. code-block:: java

   import java.util.Arrays;

   class MinStack {
       private int[] values = new int[16];
       private int[] minimums = new int[16];
       private int size = 0;

       public void push(int value) {
           ensureCapacity();
           values[size] = value;
           minimums[size] = size == 0
               ? value
               : Math.min(value, minimums[size - 1]);
           size++;
       }

       public void pop() {
           size--;
       }

       public int top() {
           return values[size - 1];
       }

       public int getMin() {
           return minimums[size - 1];
       }

       private void ensureCapacity() {
           if (size < values.length) {
               return;
           }
           int capacity = values.length * 2;
           values = Arrays.copyOf(values, capacity);
           minimums = Arrays.copyOf(minimums, capacity);
       }
   }
