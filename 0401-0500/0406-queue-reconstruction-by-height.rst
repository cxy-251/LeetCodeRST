0406. Queue Reconstruction by Height
====================================

题目信息
--------

:题号: 0406
:难度: Medium
:主题: 队列约束、身高、前方人数、合法重排
:原题: `LeetCode 0406 <https://leetcode.com/problems/queue-reconstruction-by-height/>`_
:重点: ``k`` 只统计前方身高不低于本人者、每个人恰好使用一次、返回任意满足全部约束的队列

题目重述
--------

数组 ``people`` 中每个人由 ``[h, k]`` 表示：``h`` 是此人的身高，``k`` 是最终队列中排在此人前面且身高大于或等于 ``h`` 的人数。

重新排列所有人，使每个 ``[h, k]`` 的约束同时成立，并返回任意一个合法队列。输入中的每个人必须在结果中恰好出现一次。``people.length`` 位于 ``[1, 2000]``，``h`` 位于 ``[0, 10^6]``，``k`` 位于 ``[0, people.length-1]``；题目保证至少存在一个合法重排。

自建示例
--------

相同身高也会计入前方人数：

.. code-block:: text

   输入：people = [[4, 2], [6, 0], [4, 1], [5, 0]]
   输出：[[5, 0], [4, 1], [4, 2], [6, 0]]
   解释：第一个身高 4 的人前面有一个身高不低于 4 的人；第二个身高 4 的人前面有两人满足条件。身高 6 的人前面没有身高不低于 6 的人。

单个人：

.. code-block:: text

   输入：people = [[3, 0]]
   输出：[[3, 0]]
   解释：唯一的人前面没有其他人，其约束自然成立。

先放高个子，再用 k 决定位置
----------------------------

按身高降序排列，身高相同按 ``k`` 升序排列。处理当前人时，所有已经放入队列的人身高都不低于当前人，因此把他插入下标 ``k`` 的位置后，前面恰好有 ``k`` 个满足条件的人。身高相同者按 ``k`` 升序处理，插入位置也不会破坏已经满足的同高约束。

较矮的人尚未放入时不会被当前人的 ``k`` 计数；等处理到他们时，当前高个子已经固定，插入到指定位置只会影响较矮者的前方数量。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::vector<int>> reconstructQueue(
           std::vector<std::vector<int>>& people) {
           std::sort(people.begin(), people.end(),
               [](const std::vector<int>& first,
                  const std::vector<int>& second) {
                   if (first[0] != second[0]) {
                       return first[0] > second[0];
                   }
                   return first[1] < second[1];
               });

           std::vector<std::vector<int>> queue;
           for (const auto& person : people) {
               queue.insert(queue.begin() + person[1], person);
           }
           return queue;
       }
   };

代码分析
--------

插入时队列前方只有已处理的高个子或同高者，故下标 ``k`` 与题目计数完全对应；后续更矮的人不会改变当前人的计数。排序为 ``O(n log n)``，每次向量插入最坏移动 ``O(n)`` 个元素，总时间 ``O(n^2)``，额外空间为 ``O(n)``。
