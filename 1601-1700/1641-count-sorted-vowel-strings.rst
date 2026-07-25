1641. Count Sorted Vowel Strings
================================

题目信息
--------

:题号: 1641
:难度: Medium
:主题: 动态规划、组合计数
:原题: `LeetCode 1641 <https://leetcode.com/problems/count-sorted-vowel-strings/>`_
:重点: 字符串仅含五个元音，并按字典序非递减排列

题目重述
--------

统计长度为 ``n``、只包含 ``a,e,i,o,u`` 且字符顺序非递减的字符串数量。

``1 <= n <= 50``。

自建示例
--------

.. code-block:: text

   输入：n = 2
   输出：15
   解释：可从五种元音中有重复地选择两个并按序排列。

.. code-block:: text

   输入：n = 1
   输出：5
   解释：五个元音各形成一个字符串。