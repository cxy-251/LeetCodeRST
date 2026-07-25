1838. Frequency of the Most Frequent Element
============================================

题目信息
--------

:题号: 1838
:难度: Medium
:主题: 排序、滑动窗口
:原题: `LeetCode 1838 <https://leetcode.com/problems/frequency-of-the-most-frequent-element/>`_
:重点: 至多执行 ``k`` 次加一操作，使某个值出现次数最大

题目重述
--------

每次可以把一个数组元素增加 1，最多执行 ``k`` 次。返回操作后任一数值能够达到的最高频率。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,4], k = 5
   输出：3
   解释：把 1 增加 3 次、2 增加 2 次，三个元素都变为 4。

.. code-block:: text

   输入：nums = [5,5], k = 0
   输出：2
   解释：无需操作，5 已出现两次。
