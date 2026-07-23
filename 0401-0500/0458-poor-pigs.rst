0458. Poor Pigs
===============

题目信息
--------

:题号: 0458
:难度: Hard
:主题: 唯一有毒桶、并行测试、死亡时间、最少实验对象
:原题: `LeetCode 0458 <https://leetcode.com/problems/poor-pigs/>`_
:重点: 只有一个桶有毒、每轮可让猪饮用多个桶的混合样本、死亡结果可编码状态、必须在总时限内唯一定位

题目重述
--------

有 ``buckets`` 个液体桶，其中恰好一个有毒。猪喝到毒液后会在 ``minutesToDie`` 分钟内死亡；总测试时间为 ``minutesToTest``。在每轮开始时，可以让每只猪饮用任意若干桶的混合样本，并根据各轮结束时猪是否死亡来判断毒桶。

返回在规定时间内保证唯一找出有毒桶所需的最少猪数。``buckets`` 位于 ``[1, 1000]``，并满足 ``1 <= minutesToDie <= minutesToTest <= 100``。测试轮数为 ``floor(minutesToTest / minutesToDie)``；每只猪除了在某一轮死亡外，还可能直到测试结束仍存活。

自建示例
--------

可以进行两轮测试：

.. code-block:: text

   输入：buckets = 16，minutesToDie = 15，minutesToTest = 30
   输出：3
   解释：可以进行 2 轮，每只猪有“第一轮死、第二轮死、最终存活”三种状态。两只猪只有 3^2 = 9 种组合，不足以区分 16 桶；三只猪有 27 种组合，因此最少为 3。

只有一个桶：

.. code-block:: text

   输入：buckets = 1，minutesToDie = 10，minutesToTest = 10
   输出：0
   解释：无需进行任何测试，唯一的桶已经确定是毒桶。
