Python
~~~~~~

.. code-block:: python

   class Solution:
       def singleNumber(self, nums: list[int]) -> int:
           answer = 0
           for value in nums:
               answer ^= value
           return answer

Java
~~~~

.. code-block:: java

   class Solution {
       public int singleNumber(int[] nums) {
           int answer = 0;
           for (int value : nums) {
               answer ^= value;
           }
           return answer;
       }
   }
