0152. Maximum Product Subarray
==============================

题目信息
--------

:题号: 0152. 乘积最大子数组
:难度: Medium
:主题: 数组、动态规划、符号翻转、滚动状态
:原题: `LeetCode 0152 <https://leetcode.com/problems/maximum-product-subarray/>`_
:重点: 为每个右端点同时保留最大积与最小积，让负数乘法能够交换两类候选，并允许从当前值重新开始

题目重述
--------

给定非空整数数组 ``nums``，选择一个连续且非空的子数组，返回其中所有元素乘积的最大值。不能跳过中间
元素，也不能用空子数组贡献乘积一。题目保证相关乘积和答案可由 32 位有符号整数表示。

自建示例
--------

* ``[-2, 5, -3]``：整个数组乘积为 ``30``，两个负数使积重新为正；
* ``[-1, -2, -3, 0, 4]``：``[-2, -3]`` 的乘积 ``6`` 最大，零把左右候选区间隔开；
* ``[-5]``：必须选择非空子数组，答案是 ``-5``，不能返回初始化单位元 ``1``；
* ``[0, -2, 0]``：单独的零优于负数，答案为 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int enumerateEverySubarray(const std::vector<int>& nums) {
           int answer = nums[0];
           for (int left = 0;
                left < static_cast<int>(nums.size());
                ++left) {
               int product = 1;
               for (int right = left;
                    right < static_cast<int>(nums.size());
                    ++right) {
                   product *= nums[right];
                   answer = std::max(answer, product);
               }
           }
           return answer;
       }

       int trackBothEndingExtremes(const std::vector<int>& nums) {
           int maximumEndingHere = nums[0];
           int minimumEndingHere = nums[0];
           int answer = nums[0];

           for (int index = 1;
                index < static_cast<int>(nums.size());
                ++index) {
               const int value = nums[index];
               const int previousMaximum = maximumEndingHere;
               const int previousMinimum = minimumEndingHere;

               maximumEndingHere = std::max({
                   value,
                   previousMaximum * value,
                   previousMinimum * value
               });
               minimumEndingHere = std::min({
                   value,
                   previousMaximum * value,
                   previousMinimum * value
               });
               answer = std::max(answer, maximumEndingHere);
           }
           return answer;
       }

   public:
       int maxProduct(std::vector<int>& nums) {
           return trackBothEndingExtremes(nums);
       }
   };

题解
----

原始空间：每个左右端点都是候选
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的 ``enumerateEverySubarray`` 固定左端点，向右逐个乘入元素；这样比每次从头计算乘积少了重复乘法，
但仍有 ``O(n^2)`` 个连续区间。许多区间共享相同右端点和前缀，只是从不同位置开始，算法没有压缩它们对
未来的影响。

若从左向右扫描，新子数组要么只含当前元素，要么由某个“以上一位置结尾”的子数组追加当前值。连续性因此
让状态可以按右端点递推，不需要保留任意更早的结束位置。

为什么最大和问题的一项状态不够
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若是最大子数组和，较小前缀加上同一个值仍然较小，只保留最大值即可。乘法的顺序关系会被负数反转：一个
很小的负积乘负数，可能成为最大的正积；原来的最大正积乘负数则可能成为新的最小积。因此只保存
``maximumEndingHere`` 会永久丢掉未来翻盘所需的负候选。

对每个位置必须同时保存：

* ``maximumEndingHere``：所有以当前位置结尾的非空子数组中的最大乘积；
* ``minimumEndingHere``：同一集合中的最小乘积。

这两个极值足够。追加当前值是对旧乘积统一乘一个常数：常数为正时顺序不变，旧最大/最小仍产生新两端；
常数为负时顺序反转，旧最小/最大交换角色；常数为零时所有延长候选都归零。中间值不可能越过两端成为新
极值。

三类候选怎样表达继续与重启
~~~~~~~~~~~~~~~~~~~~~~~~~~

以当前位置结尾的子数组只有三种可能来源：

.. code-block:: text

   value                            从当前位置重新开始
   previousMaximum * value          延长旧最大积子数组
   previousMinimum * value          延长旧最小积子数组

最大状态取三者最大，最小状态取三者最小。单独选择 ``value`` 很关键：此前前缀可能为零或会让结果更差，
当前元素必须能成为新子数组起点。它也让零自然完成分隔，无需显式清空状态；读到零时三候选都包含零或由零
比较，后一个非零位置又能通过自己的 ``value`` 重启。

状态更新为何要先保存旧值
~~~~~~~~~~~~~~~~~~~~~~~~

新最大值和新最小值都依赖同一轮的旧最大、旧最小。若先覆盖 ``maximumEndingHere``，再用它计算最小值，
第二个状态会错误使用“已经乘过当前元素”的结果，相当于把当前值重复乘入。代码用
``previousMaximum``、``previousMinimum`` 拍下同一时刻的快照，再并行生成两端。

具体走读负数翻转
~~~~~~~~~~~~~~~~

对 ``[-2, 5, -3]``：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 三个候选
     - 新最大 / 新最小
     - 全局答案
   * - ``-2``
     - 初始单元素
     - ``-2 / -2``
     - ``-2``
   * - ``5``
     - ``5, -10, -10``
     - ``5 / -10``
     - ``5``
   * - ``-3``
     - ``-3, -15, 30``
     - ``30 / -15``
     - ``30``

第三步的 ``30`` 正是旧最小 ``-10`` 乘负数得到；若上一轮只保留最大 ``5``，结果最多看到 ``-3`` 与
``-15``，会漏掉正确答案。

全局答案与结尾状态为何分开
~~~~~~~~~~~~~~~~~~~~~~~~~~

两个滚动状态只描述“必须以当前位置结尾”的区间，用于向下一位置传播；最优子数组可能早已在前面结束，
所以还要用 ``answer`` 保存所有右端点最大状态的最大值。三者都以 ``nums[0]`` 初始化，保证单元素、全负数
输入仍选择真实非空区间，而不是错误的零或一。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用双极值滚动 DP。每个元素只计算常数个候选，时间 ``O(n)``；只保存旧、新极值和全局答案，
额外空间 ``O(1)``。区间枚举时间 ``O(n^2)``、空间 ``O(1)``，保留它作为原始候选空间；主解利用符号对
顺序的有限三种作用，将所有同右端点区间压缩为两个极值。
