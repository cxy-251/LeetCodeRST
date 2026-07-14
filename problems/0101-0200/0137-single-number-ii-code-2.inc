Python
~~~~~~

.. code-block:: python

   class Solution:
       def singleNumber(self, nums: list[int]) -> int:
           ones = 0
           twos = 0
           for value in nums:
               ones = (ones ^ value) & ~twos
               twos = (twos ^ value) & ~ones
           return ones

Java
~~~~

.. code-block:: java

   class Solution {
       public int singleNumber(int[] nums) {
           int ones = 0;
           int twos = 0;
           for (int value : nums) {
               ones = (ones ^ value) & ~twos;
               twos = (twos ^ value) & ~ones;
           }
           return ones;
       }
   }
