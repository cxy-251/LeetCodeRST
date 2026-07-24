1189. Maximum Number of Balloons
================================

题目信息
--------

:题号: 1189
:难度: Easy
:主题: 字符串、字符计数、单词构造
:原题: `LeetCode 1189 <https://leetcode.com/problems/maximum-number-of-balloons/>`_
:重点: 每次构造 ``balloon`` 需要一个 ``b``、一个 ``a``、两个 ``l``、两个 ``o`` 和一个 ``n``；每个字符实例只能使用一次

题目重述
--------

给定小写字符串 ``text``。可以从中选择字符并任意重排，构造若干个单词 ``"balloon"``。

每个字符位置最多使用一次。请返回最多能够构造出的完整 ``"balloon"`` 数量；其他无关字符可以不使用。

``1 <= text.length <= 10^4``，``text`` 只包含小写英文字母。

自建示例
--------

某个必需字符限制最终数量：

.. code-block:: text

   输入：text = "balloonballoo"
   输出：1
   解释：虽然 b、a、l、o 足够构造两份，但字符 n 只有一个，因此只能构造一个完整单词。

不含所需字符：

.. code-block:: text

   输入：text = "xyz"
   输出：0
   解释：无法组成单词 balloon 所需的任何完整字符集合。