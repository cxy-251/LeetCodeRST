0215. Kth Largest Element in an Array
======================================

题目信息
--------

:题号: 0215. 数组中的第 K 个最大元素
:难度: Medium
:主题: 数组、选择问题、排序、堆、快速选择
:原题: `LeetCode 0215 <https://leetcode.com/problems/kth-largest-element-in-an-array/>`_
:重点: 第 K 大转为升序下标、重复值排名、划分不变量、只保留目标分区

题目重述
--------

给定未排序整数数组 ``nums`` 和整数 ``k``，返回按非递增顺序排列后第 ``k`` 个位置的元素值。重复值按出现位置计数，
所以这是“排名位置”而不是“第 k 个不同数值”。算法可以原地重排数组，函数只需要返回一个整数。

数组非空，``1 <= k <= nums.size()``；元素可能为负数，输入不保证互异。

自建示例
--------

``nums = [7,2,9,4,9]``、``k=2`` 的降序排列为 ``[9,9,7,4,2]``，答案是 ``9``；两个相同的 9 占据两个排名位置。

``nums = [-3,-1,-2]``、``k=3`` 返回 ``-3``。数组长度为 ``n`` 时，第 ``k`` 大元素在升序排列中的下标是 ``target=n-k``，
不是 ``k-1``。

``nums = [5,5,5]``、``k=2`` 返回 ``5``；所有元素相等时目标仍由位置定义，不需要去重。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <functional>
   #include <queue>
   #include <vector>

   class Solution {
   private:
       static int selectBySorting(std::vector<int> nums, int target) {
           std::sort(nums.begin(), nums.end());
           return nums[target];
       }

       static int selectByHeap(const std::vector<int>& nums, int k) {
           std::priority_queue<int, std::vector<int>, std::greater<int>> heap;
           for (int value : nums) {
               if (static_cast<int>(heap.size()) < k) {
                   heap.push(value);
               } else if (value > heap.top()) {
                   heap.pop();
                   heap.push(value);
               }
           }
           return heap.top();
       }

       static int selectByPartition(std::vector<int>& nums, int target) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;
           while (left <= right) {
               const int pivot = nums[left + (right - left) / 2];
               int less = left;
               int current = left;
               int greater = right;

               while (current <= greater) {
                   if (nums[current] < pivot) {
                       std::swap(nums[less++], nums[current++]);
                   } else if (nums[current] > pivot) {
                       std::swap(nums[current], nums[greater--]);
                   } else {
                       ++current;
                   }
               }

               if (target < less) {
                   right = less - 1;
               } else if (target > greater) {
                   left = greater + 1;
               } else {
                   return nums[target];
               }
           }
           return nums[target];
       }

   public:
       int findKthLargest(std::vector<int>& nums, int k) {
           const int target = static_cast<int>(nums.size()) - k;
           return selectByPartition(nums, target);
       }
   };

题解
----

排名转换与被删除的全序
~~~~~~~~~~~~~~~~~~~~~~~~

排序后取 ``nums[n-k]`` 是最直接的方案。它正确地把第 ``k`` 大转换为升序下标 ``target=n-k``，并且重复值按排名位置保留；
但它还建立了目标两侧完全不需要的相对顺序，时间为 ``O(n log n)``。固定大小的最小堆只保存最大的 ``k`` 个值，时间降为
``O(n log k)``、空间为 ``O(k)``，但仍为每个元素维护堆序。

快速选择只确定一个排名
~~~~~~~~~~~~~~~~~~~~~~~~

在当前闭区间选枢轴，把元素分成小于、等于、大于三段。目标下标只可能落在其中一段：落在等于段时答案已经确定；落在一侧时，
另一侧及等于段都不再需要排序。三向划分因此把“全数组排序”压缩成“只继续处理目标所在区间”，同时一次封闭全部重复值。

三向划分不变量
~~~~~~~~~~~~~~~~

先转成升序目标下标 ``target``。每轮开始时，``[left,right]`` 是尚未排除的区间，目标一定在其中。扫描区间内维护：

* ``[left,less)`` 全部小于枢轴；
* ``[less,current)`` 全部等于枢轴；
* ``(greater,right]`` 全部大于枢轴；
* ``[current,greater]`` 尚未分类。

当前值小于枢轴时，把它换到 ``less`` 并同时推进 ``less``、``current``；等于枢轴时只推进 ``current``；大于枢轴时与 ``greater``
交换，但不能推进 ``current``，因为换回来的元素尚未分类。划分完成后，目标在左段就收缩 ``right``，在右段就收缩 ``left``，
落在等于段则直接返回。

状态走读
~~~~~~~~

仍以 ``[7,2,9,4,9]`` 为例，设枢轴为 9：

.. list-table::
   :header-rows: 1

   * - 区域
     - 含义
     - 划分结果
   * - ``[left,less)``
     - 小于 9
     - ``[7,2,4]``
   * - ``[less,greater]``
     - 等于 9
     - ``[9,9]``
   * - ``(greater,right]``
     - 大于 9
     - 空
   * - ``target=3``
     - 目标位于等于段
     - 返回 9

目标落在左段时的收缩
~~~~~~~~~~~~~~~~~~~~~~

对 ``[7,2,9,4,9]``、``k=2``，``target=3``，取枢轴 9：小于段为 ``[7,2,4]``，等于段为 ``[9,9]``，目标落在等于段，
所以无需知道 7、4、2 的彼此顺序即可返回 9。若目标改为 1，右边界就直接移到等于段左侧；这一步正是删除旧搜索空间的地方。

重复值为何单独成段
~~~~~~~~~~~~~~~~~~~~

若只划分为 ``< pivot`` 和 ``>= pivot``，与枢轴相等的元素会反复进入下一轮，目标位于重复值中间时会重新扫描已经确定的值。
三向划分一次封闭整个等值段，重复值越多，删除的无关工作越多。

代码演进与方案选择
~~~~~~~~~~~~~~~~~~~~

``selectBySorting`` 适合还需要完整有序数组的场景，时间 ``O(n log n)``；``selectByHeap`` 只维护前 ``k`` 名，
当 ``k`` 很小时空间和调整成本更低，但仍需 ``O(n log k)``；``selectByPartition`` 只保留目标区间，平均线性且原地，
代价是枢轴选择不佳时最坏会退化为 ``O(n^2)``，并且会重排输入。公共入口选择三向快速选择，因为本题只需要一个排名，
重复值又是必须明确处理的边界；两个私有替代方法保留的是不同的搜索压缩认识，而不是重复代码。

代码中 ``nums[current] > pivot`` 的分支不推进 ``current``，这是状态不变量的直接映射；交换回来的元素仍未分类，提前推进会使它漏检。
``target=n-k``、三段指针和原地交换分别对应排名转换、等值封闭和目标区间收缩。

复杂度与边界
~~~~~~~~~~~~

排序法时间 ``O(n log n)``，复制参数时工作空间为 ``O(n)``；堆法时间 ``O(n log k)``、空间 ``O(k)``；三向快速选择平均时间 ``O(n)``、
额外空间 ``O(1)``，最坏时间 ``O(n^2)``。``k=1``、``k=n``、所有元素相等和单元素数组都由同一划分状态处理；主解允许原地修改输入，
若调用者需要保留原顺序，应在外层复制后再调用。
