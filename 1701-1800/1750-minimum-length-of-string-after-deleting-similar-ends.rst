1750. Minimum Length of String After Deleting Similar Ends
=========================================================

题目信息
--------

:题号: 1750
:难度: Medium
:主题: 双指针、字符串
:原题: `LeetCode 1750 <https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/>`_
:重点: 首尾字符相同时可同时删除由该字符组成的非空前缀与非空后缀

题目重述
--------

重复执行合法删除，前缀与后缀不能重叠。返回能够得到的最短字符串长度。

自建示例
--------

.. code-block:: text

   输入：s = "ca"
   输出：2
   解释：首尾字符不同，不能删除。

.. code-block:: text

   输入：s = "aaaa"
   输出：0
   解释：可删除由 a 组成的前后部分直至字符串为空。