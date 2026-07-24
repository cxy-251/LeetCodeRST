1348. Tweet Counts Per Frequency
================================

题目信息
--------

:题号: 1348
:难度: Medium
:主题: 设计题、时间区间、频次统计
:原题: `LeetCode 1348 <https://leetcode.com/problems/tweet-counts-per-frequency/>`_
:重点: 记录同名推文时间；查询区间两端都包含，并按分钟、小时或天划分连续时间桶

题目重述
--------

实现 ``TweetCounts`` 类。``recordTweet(tweetName, time)`` 记录指定名称在整数秒 ``time`` 发布一次。``getTweetCountsPerFrequency(freq, tweetName, startTime, endTime)`` 把闭区间按 ``freq`` 对应的 60、3600 或 86400 秒分桶，返回每桶内的记录数。

最后一个桶可以短于完整频率长度。不同名称的记录独立，各次调用共享对象状态。

方法总调用次数不超过 ``10^4``，时间位于 ``[0,10^9]``。

自建示例
--------

区间末端记录计入对应桶：

.. code-block:: text

   输入：依次记录 alpha@0、alpha@10、alpha@60，再查询 minute、alpha、[0,119]
   输出：[2,1]
   解释：前一分钟桶 [0,59] 有两条，第二桶 [60,119] 有一条。

不存在该名称记录时各桶为零：

.. code-block:: text

   输入：查询 hour、beta、[0,100]
   输出：[0]
   解释：区间不足一小时但仍形成一个桶，且 beta 没有记录。