0215. Kth Largest Element in an Array
======================================

题目信息
--------

:题号: 0215. 数组中的第 K 个最大元素
:难度: Medium
:主题: 数组、选择问题、堆、快速选择
:原题: `LeetCode 0215 <https://leetcode.com/problems/kth-largest-element-in-an-array/>`_
:重点: 第 K 大转为升序下标、重复值排名、三向划分只保留目标分区

题目重述
--------

给定未排序整数数组 ``nums`` 和整数 ``k``，返回把数组按非递增顺序排列后第 ``k`` 个位置的元素值。
这是排名问题：重复值占据不同位置，例如 ``[3,3,1]`` 的第二大仍然是 3。``k`` 在 ``[1, nums.size()]`` 内，
题目保证答案存在；算法可以原地重排数组，但只要求返回值。

自建示例
--------

重复值仍按位置计数：

.. code-block:: text

   nums = [7, 2, 9, 4, 9], k = 2
   降序 = [9, 9, 7, 4, 2]
   输出 = 9

两个 9 分别占据第一、第二大，不能把“不同数值的第二大”误当成题目目标。

负数和下标方向：``nums = [-3,-1,-2]``、``k = 3`` 时答案是 ``-3``。若数组长度为 ``n``，第 ``k`` 大在升序数组中的
目标下标是 ``target = n-k``，不是 ``k-1``。

从完整排序到只确定一个位置
--------------------------

最直接的做法是排序后取 ``nums[n-k]``。它肯定正确，但为所有元素建立完整顺序，时间为 ``O(n log n)``；题目只询问一个排名，
其余元素之间的精确先后其实不重要。

固定大小为 ``k`` 的最小堆只保留当前最大的 ``k`` 个元素。遍历一个新值时，堆未满就加入；堆已满且新值大于堆顶，就替换堆顶。
最后堆顶是第 ``k`` 大，时间 ``O(n log k)``，空间 ``O(k)``。它删除了“小于当前前 k 名”的元素，但仍为每个候选维护堆序。

快速选择进一步只保留目标所在的区间。选择一个枢轴后把当前区间分成“小于、等于、大于”三段；目标下标落在哪一段，
就只处理那一段，其他两段的内部顺序不再关心。三向划分特别处理等于枢轴的元素，避免大量重复值让二向划分反复处理同一批数据。

状态不变量
----------

先把第 ``k`` 大转换为升序下标 ``target``。循环维护闭区间 ``[left,right]``，目标一定在此区间内，区间外元素已经被证明
不可能改变目标值。一次三向划分过程中维护：

* ``[left, less)`` 的值都小于枢轴；
* ``[less, current)`` 的值都等于枢轴；
* ``(greater, right]`` 的值都大于枢轴；
* ``[current, greater]`` 尚未分类。

遇到小于枢轴的值，交换到 ``less`` 区并同时推进 ``less``、``current``；遇到等于枢轴的值只推进 ``current``；
遇到大于枢轴的值交换到 ``greater`` 区，但不能推进 ``current``，因为换回来的元素还没有分类。分类结束后，
目标若在等于段就已经确定；否则收缩到左段或右段，继续保持目标不被删除。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       int selectBySorting(std::vector<int>& nums, int target) {
           std::sort(nums.begin(), nums.end());
           return nums[target];
       }

       int selectByHeap(const std::vector<int>& nums, int k) {
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

       int selectByPartition(std::vector<int>& nums, int target) {
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

为什么三向划分不会漏掉目标
~~~~~~~~~~~~~~~~~~~~~~~~~~

划分完成后，所有小于枢轴的元素都在等于段左侧，所有大于枢轴的元素都在右侧。若 ``target`` 落在等于段，升序排列时该位置
必然是枢轴值，直接返回无需知道段内顺序；若落在左段，右侧所有元素（包括等于段）都不可能改变目标位置的值，右边界可以缩到
``less-1``；落在右段时同理把左边界移到 ``greater+1``。每次缩区间都删除了已经确定无关的排列工作。

以 ``[7,2,9,4,9]``、``k=2`` 为例，目标下标为 3。第一次枢轴取中间位置的 9，三向划分得到“小于段 [7,2,4]、
等于段 [9,9]、大于段为空”；目标下标 3 落在等于段，立即返回 9。算法不需要比较 7、4、2 的彼此顺序。

重复值为何需要等于段
~~~~~~~~~~~~~~~~~~~~~~

若只把元素分成 ``< pivot`` 与 ``>= pivot``，大量等于枢轴的值可能被反复放进下一轮，目标在重复值中间时仍要多次扫描。
三向划分一次把全部相等值封闭起来；它们在升序排名中连续占据一段，目标落入这段时答案已经确定。

方法取舍
~~~~~~~~

排序法最短、最容易验证，适合确实需要完整有序数组的场景；最小堆在 ``k`` 很小时节省时间和空间，但堆顶只代表候选集合的边界，
仍要维护 ``log k`` 的调整；快速选择平均 ``O(n)`` 且原地，只做与目标相关的分区，代价是枢轴选择不佳时最坏可退化为 ``O(n^2)``，
并且会改变输入数组。主入口选三向快速选择，因为本题只要一个排名且重复值是明确的边界情况；两个替代方法保留在类中用于展示搜索空间如何逐步压缩。

代码分析
~~~~~~~~

``target = n-k`` 把“从大到小数”转换成统一的升序位置，正数、负数和重复值都不需要另写分支。``greater`` 分支不推进
``current`` 是代码最容易写错的地方：交换回来的值还没有参加比较，若提前推进会让它逃过分类。``selectBySorting`` 和
``selectByHeap`` 没有被公共入口调用，分别对应完整排序和固定候选集；``selectByPartition`` 才是根据前文不变量选择的主解。

快速选择循环最终一定会命中等于段，因为题目保证目标下标有效；末尾返回只为覆盖编译器的控制流分析。原地交换不另建结果数组，
堆方法则明确使用最小堆而不是最大堆：堆顶必须是当前保留的第 ``k`` 大候选中最小的那个，才能被更大的新值淘汰。

复杂度与边界
~~~~~~~~~~~~

排序法时间 ``O(n log n)``、额外空间取决于排序实现；最小堆时间 ``O(n log k)``、额外空间 ``O(k)``；三向快速选择平均时间
``O(n)``、额外空间 ``O(1)``，最坏时间 ``O(n^2)``。三种方法都把输出数组空间省掉，因为只返回一个整数。

``k=1`` 的目标是最大值，``k=n`` 的目标是最小值；所有元素相等时第一次划分就得到完整等于段；单元素数组的目标区间只有一个位置，
同样直接返回。题目允许原地修改，因此主解的交换不会违反接口合同；若调用者要保留原数组，可在外层先复制后调用。
