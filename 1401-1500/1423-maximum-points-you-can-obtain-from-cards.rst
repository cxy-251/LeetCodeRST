1423. Maximum Points You Can Obtain from Cards
==============================================

题目信息
--------

:题号: 1423
:难度: Medium
:主题: 数组、滑动窗口、前后缀
:原题: `LeetCode 1423 <https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/>`_
:重点: 恰好执行 ``k`` 次，每次只能取当前最左或最右卡牌；最大化取得点数总和

题目重述
--------

给定卡牌点数数组 ``cardPoints``，所有卡牌排成一行。一次操作只能从当前数组最左端或最右端取走一张卡牌，并获得其点数。

必须恰好取走 ``k`` 张卡牌，请返回能够获得的最大总点数。

``1 <= cardPoints.length <= 10^5``，``1 <= cardPoints[i] <= 10^4``，``1 <= k <= cardPoints.length``。

自建示例
--------

连续从同一端取牌可能优于两端各取一张：

.. code-block:: text

   输入：cardPoints = [1,100,1], k = 2
   输出：101
   解释：先取最右侧的 1，再取新的最右侧 100，总分为 101。

必须取走全部卡牌时答案为数组总和：

.. code-block:: text

   输入：cardPoints = [4,6], k = 2
   输出：10
   解释：两张卡牌都必须被取走。