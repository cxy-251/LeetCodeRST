0162. Find Peak Element
=======================

题目信息
--------

:题号: 0162. 寻找峰值
:难度: Medium
:主题: 数组、二分查找、局部单调性
:原题: `LeetCode 0162 <https://leetcode.com/problems/find-peak-element/>`_
:重点: 从逐点验证峰值，推导到用一条相邻斜率保留必含峰值的区间

题目重述
--------

给定整数数组 ``nums``，相邻元素互不相等。若 ``nums[i]`` 严格大于它的左右邻居，
则下标 ``i`` 是峰值。数组两端之外视为负无穷，因此首、尾元素也可能成为峰值。

数组至少含一个元素，可能存在多个峰值；返回任意一个峰值的下标，并将时间复杂度控制在
``O(log n)``。

自建示例
--------

.. code-block:: text

   输入：nums = [1,3,2,5,4]
   输出：1 或 3

   下标 1 和 3 都高于各自的两个邻居，返回其中任意一个都满足题意。

.. code-block:: text

   输入：nums = [8,5,2]
   输出：0

   8 大于右邻居 5，左侧边界又是负无穷，所以首元素就是峰值。

.. code-block:: text

   输入：nums = [6]
   输出：0

   唯一元素的两侧都是虚拟的负无穷。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       int linearFirstDescent(const std::vector<int>& nums) {
           int size = static_cast<int>(nums.size());
           for (int i = 0; i + 1 < size; ++i) {
               if (nums[i] > nums[i + 1]) {
                   return i;
               }
           }
           return size - 1;
       }

       int binaryBySlope(const std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left < right) {
               int middle = left + (right - left) / 2;
               if (nums[middle] < nums[middle + 1]) {
                   left = middle + 1;
               } else {
                   right = middle;
               }
           }
           return left;
       }

   public:
       int findPeakElement(std::vector<int>& nums) {
           return binaryBySlope(nums);
       }
   };

题解
----

原始任务是逐点验证
~~~~~~~~~~~~~~~~~~

按照定义，可以依次检查每个下标是否同时高于左右邻居。这一定正确，却需要最坏
``O(n)`` 次检查，而且每个内部位置会反复参与左右两次比较。

把观察单位从“一个点的两个邻居”改成“一对相邻元素”，线性扫描已经能减少思考：

* 找到第一条下降边 ``nums[i] > nums[i + 1]`` 时，``i`` 就是峰值。若 ``i > 0``，
  此前没有下降边且相邻值不等，所以 ``nums[i - 1] < nums[i]``；若 ``i = 0``，
  左侧是负无穷；
* 若一直没有下降，数组严格上升到末尾，末元素就是峰值。

``linearFirstDescent`` 实现了这个基线方案。它说明寻找峰值不必完整比较每个点，
但仍可能走完整个数组。

一条斜率能排除哪一半
~~~~~~~~~~~~~~~~~~~~~~

比较中点 ``middle`` 与它的右邻居，只会出现两种情况：

* ``nums[middle] < nums[middle + 1]``：这里正在上坡。从 ``middle + 1`` 继续向右，
  要么以后出现第一条下降边，其左端是峰值；要么一路上升到有效区间右端。因此保留
  ``[middle + 1, right]``；
* ``nums[middle] > nums[middle + 1]``：这里正在下坡。反向向左使用同一论证，
  ``[left, middle]`` 中必有峰值；``middle`` 自己仍可能是峰值，不能写成
  ``right = middle - 1``。

相邻元素不相等非常关键：比较结果不会出现平台。若允许相等，仅凭一条水平边无法判断
哪一侧必有严格峰值。

区间不变量
~~~~~~~~~~

二分区间不表示峰值已经确定，而表示“区间内至少存在一个峰值”。可以用两条边界斜率
把这件事说得更精确：

* 若 ``left > 0``，则区间从左边界外向内上升，即
  ``nums[left - 1] < nums[left]``；
* 若 ``right + 1 < n``，则区间从内部向右边界外下降，即
  ``nums[right] > nums[right + 1]``。

初始区间借助两侧的负无穷满足这个条件。遇到上坡并令 ``left = middle + 1``，
这条上坡正好成为新的左边界保证；遇到下坡并令 ``right = middle``，这条下坡正好成为
新的右边界保证。因此每次删除一半旧搜索区间后，不变量仍成立。

当 ``left == right`` 时，只剩一个位置。左边界保证它高于左邻居，右边界保证它高于
右邻居，缺失的邻居则由负无穷补足，所以该位置必为峰值。

具体走读
~~~~~~~~

对 ``[1,3,2,5,4]``：

#. 初始 ``[left,right] = [0,4]``，``middle = 2``；``2 < 5`` 是上坡，峰值必在
   右侧，令 ``left = 3``。待搜索区间成为 ``[3,4]``；
#. 此时 ``middle = 3``；``5 > 4`` 是下坡，保留可能成为峰值的 ``middle``，令
   ``right = 3``；
#. 区间收缩到下标 3。它左侧由第一轮的上坡保证更小，右侧由第二轮的下坡保证更小，
   因而返回 3。

对严格下降的 ``[8,5,2]``，每轮都走 ``right = middle``，最终停在下标 0；
对单元素数组，循环根本不执行，初始位置直接返回。``middle + 1`` 始终安全，因为只有
``left < right`` 时才计算中点，此时 ``middle < right``。

方案选择与复杂度
~~~~~~~~~~~~~~~~

线性方案的证明直观，时间为 ``O(n)``、额外空间为 ``O(1)``；二分方案把“继续走到峰值”
压缩为“根据当前斜率删除不可能需要保留的一半区间”，时间降为 ``O(log n)``，额外空间
仍为 ``O(1)``。题目明确要求对数时间，因此 ``binaryBySlope`` 是主解。
