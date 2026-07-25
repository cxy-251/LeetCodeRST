1839. Longest Substring Of All Vowels in Order
==============================================

题目信息
--------

:题号: 1839
:难度: Medium
:主题: 字符串、滑动窗口
:原题: `LeetCode 1839 <https://leetcode.com/problems/longest-substring-of-all-vowels-in-order/>`_
:重点: 子串必须包含五种元音且字符顺序非递减

题目重述
--------

在只含元音的字符串中，寻找最长连续子串，使其同时包含 ``a、e、i、o、u``，并按该顺序分组出现。返回长度，不存在时返回 0。

自建示例
--------

.. code-block:: text

   输入：word = "aaeeiioouu"
   输出：10
   解释：整个字符串包含全部元音且顺序正确。

.. code-block:: text

   输入：word = "aaaa"
   输出：0
   解释：缺少 e、i、o、u，不能构成美丽子串。
