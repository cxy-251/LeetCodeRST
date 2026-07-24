1371. Find the Longest Substring Containing Vowels in Even Counts
=================================================================

题目信息
--------

:题号: 1371
:难度: Medium
:主题: 字符串、前缀状态、位掩码
:原题: `LeetCode 1371 <https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/>`_
:重点: 连续子串中 ``a/e/i/o/u`` 各自出现次数都必须为偶数，零次也属于偶数；辅音不受限制

题目重述
--------

给定小写字符串 ``s``。寻找最长连续子串，使五个元音字母 ``a``、``e``、``i``、``o``、``u`` 在该子串中的出现次数分别都是偶数。

返回该子串的最大长度。子串可以不包含某些元音；不存在非空合法子串时返回 ``0``。

``1 <= s.length <= 5 * 10^5``。

自建示例
--------

整个字符串的各元音次数均为偶数：

.. code-block:: text

   输入：s = "abbaeebb"
   输出：8
   解释：a 和 e 各出现两次，其他元音出现零次，整个字符串合法。

只有不同元音且各出现一次时无非空答案：

.. code-block:: text

   输入：s = "aei"
   输出：0
   解释：任意非空子串至少有一种元音出现奇数次。