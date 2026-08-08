0169. Majority Element
======================

题目信息
--------

:题号: 0169. 多数元素
:难度: Easy
:主题: 数组、计数、排序、Boyer–Moore 投票
:原题: `LeetCode 0169 <https://leetcode.com/problems/majority-element/>`_
:重点: 利用严格过半保证，将不同元素成对抵消并把完整频次表压缩成候选与余额

题目重述
--------

给定长度为 ``n`` 的整数数组 ``nums``，返回其中的多数元素。多数元素的出现次数严格大于
``floor(n / 2)``，题目保证它一定存在。

进阶目标是用 ``O(n)`` 时间和 ``O(1)`` 额外空间完成。

自建示例
--------

.. code-block:: text

   输入：nums = [2,2,1,1,1,2,2]
   输出：2

   2 出现 4 次，严格超过长度 7 的一半；扫描中的临时候选可以变化，最终仍回到 2。

.. code-block:: text

   输入：nums = [-5,3,-5,-5,3]
   输出：-5

   多数性的定义只依赖频次，与数值大小和正负无关。

.. code-block:: text

   输入：nums = [7]
   输出：7

   唯一元素出现 1 次，严格大于 floor(1 / 2) = 0。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       int repeatedCounting(const std::vector<int>& nums) {
           for (int candidate : nums) {
               int occurrences = 0;
               for (int value : nums) {
                   if (value == candidate) {
                       ++occurrences;
                   }
               }
               if (occurrences > static_cast<int>(nums.size()) / 2) {
                   return candidate;
               }
           }
           return nums.front();
       }

       int frequencyTable(const std::vector<int>& nums) {
           std::unordered_map<int, int> occurrences;
           occurrences.reserve(nums.size());
           int threshold = static_cast<int>(nums.size()) / 2;

           for (int value : nums) {
               if (++occurrences[value] > threshold) {
                   return value;
               }
           }
           return nums.front();
       }

       int sortedMiddle(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           return nums[nums.size() / 2];
       }

       int cancellationCandidate(const std::vector<int>& nums) {
           int candidate = 0;
           int balance = 0;

           for (int value : nums) {
               if (balance == 0) {
                   candidate = value;
               }
               if (value == candidate) {
                   ++balance;
               } else {
                   --balance;
               }
           }
           return candidate;
       }

   public:
       int majorityElement(std::vector<int>& nums) {
           return cancellationCandidate(nums);
       }
   };

题解
----

从定义出发的重复计数
~~~~~~~~~~~~~~~~~~~~

按定义，可以把每个位置的值都当作候选，再扫描整个数组统计其出现次数。
``repeatedCounting`` 一定会找到题目保证存在的多数元素，但相同候选会被反复统计，最坏
时间为 ``O(n²)``。瓶颈不在“判断是否相等”，而在没有保存此前已经得到的频次。

``frequencyTable`` 用哈希表把每个值的计数保留下来。每读一个元素只增量更新一次；计数
首次超过 ``floor(n/2)`` 时可以立即返回，因为后续元素不会让该计数下降。这将期望时间
降为 ``O(n)``，代价是最多保存 ``O(n)`` 个不同值。

排序暴露了另一种结构
~~~~~~~~~~~~~~~~~~~~

如果数组排好序，多数元素会形成长度超过 ``n/2`` 的连续块。这样长的块无论从哪里开始，
都必然覆盖下标 ``n/2``，所以中间位置就是答案。``sortedMiddle`` 不再维护全部频次，
但复制和排序需要 ``O(n)`` 空间与 ``O(n log n)`` 时间；若原地排序可以省去复制空间，
却会修改输入。

题目的“严格超过一半”还能提供更强的信息：多数元素的数量大于其余所有元素数量之和。
这允许不排序、不记频次，只不断删除互不相同的元素对。

成对抵消为何保持多数性
~~~~~~~~~~~~~~~~~~~~~~~~

假设当前总长度为 ``N``，真正多数元素出现 ``M`` 次，满足 ``M > N/2``。删除两个不同
元素时：

* 若其中一个是多数元素，新的计数和长度是 ``M-1``、``N-2``，而
  ``M-1 > (N-2)/2`` 与原不等式等价；
* 若两者都不是多数元素，多数计数不变、总长度减少 2，多数性只会更强。

因此任意反复删除不同值对，都不会改变“剩余元素中的多数是谁”。真正多数元素不可能在
抵消完成后彻底消失；否则其余元素也至少要提供同样多的配对数量，与严格过半矛盾。

候选与余额压缩了哪些历史
~~~~~~~~~~~~~~~~~~~~~~~~

``cancellationCandidate`` 不真的删除数组元素。``candidate`` 表示当前未配对元素的值，
``balance`` 表示该值尚未抵消的数量：

* 当前值等于候选，无法与已有候选配成不同值对，余额加一；
* 当前值不同，拿它与一个未配对候选抵消，余额减一；
* 余额为零时，之前这个抵消段没有留下任何元素，当前值可以开启新的候选段。

完整哈希表中的每个频次被压缩成了两个标量。``balance`` 不是候选在整个前缀中的真实
出现次数，而是当前抵消段中的净剩余票数；把它误解为总频次会无法解释候选为何能改变。

具体走读
~~~~~~~~

对 ``[2,2,1,1,1,2,2]``：

.. code-block:: text

   读入值  动作                         candidate  balance
   2       余额为 0，选择 2；同值加票   2          1
   2       同值加票                     2          2
   1       异值抵消                     2          1
   1       异值抵消                     2          0
   1       余额为 0，选择 1；同值加票   1          1
   2       异值抵消                     1          0
   2       余额为 0，选择 2；同值加票   2          1

中途候选 2 的余额归零并不表示 2 已被证明不是多数，只表示已处理的那一段可以整体成对
删除。最后未被抵消的候选是 2；由题目保证存在多数元素，它必然就是真正多数。

存在性保证的重要性
~~~~~~~~~~~~~~~~~~

Boyer–Moore 第一遍只产生“抵消后的候选”。若题目不保证多数元素存在，例如
``[1,2,3]``，算法仍会返回某个候选，却不能证明它超过一半；此时必须再扫描一次验证
候选频次。本题已经明确保证存在，因此第二遍验证不会改变结果，可以省略。

方案选择与复杂度
~~~~~~~~~~~~~~~~

重复计数时间 ``O(n²)``、空间 ``O(1)``；哈希计数期望时间 ``O(n)``、空间 ``O(n)``；
排序取中点时间 ``O(n log n)``，当前实现因复制数组使用 ``O(n)`` 空间。Boyer–Moore
只扫描一次，时间 ``O(n)``、额外空间 ``O(1)``，同时满足进阶目标，因此主解采用
``cancellationCandidate``。
