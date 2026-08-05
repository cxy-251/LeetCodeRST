0075. Sort Colors
=================

题目信息
--------

:题号: 0075
:难度: Medium
:主题: 数组、计数、双指针、原地分区
:原题: `LeetCode 0075 <https://leetcode.com/problems/sort-colors/>`_
:重点: 从统计三种颜色，推导到两次分区，再用荷兰国旗算法单遍原地排序

题目重述
--------

给定整数数组 ``nums``，其中每个元素只可能是 ``0``、``1`` 或 ``2``，分别代表红、白、蓝三种颜色。
请直接修改原数组，使所有 ``0`` 位于前面，所有 ``1`` 位于中间，所有 ``2`` 位于后面。

不能调用语言提供的通用排序函数。数组长度满足 ``1 <= nums.length <= 300``。进阶要求是只扫描一次数组，并使用
``O(1)`` 额外空间。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,0,1,2,0,0]
   修改后：[0,0,0,1,1,2,2]

三个 ``0`` 进入左段，两个 ``1`` 留在中段，两个 ``2`` 进入右段。

.. code-block:: text

   输入：nums = [2,0,2,1,1,0]
   修改后：[0,0,1,1,2,2]

右端交换回来的元素仍可能未分类，因此处理 ``2`` 时不能立刻推进扫描指针。

.. code-block:: text

   输入：nums = [1,1,1]
   修改后：[1,1,1]

数组可以缺少某些颜色，三个分区仍然成立。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void countingOverwrite(std::vector<int>& nums) {
           int count[3] = {0, 0, 0};

           for (int value : nums) {
               ++count[value];
           }

           int write = 0;
           for (int value = 0; value < 3; ++value) {
               for (int copies = 0; copies < count[value]; ++copies) {
                   nums[write++] = value;
               }
           }
       }

       void twoPartitions(std::vector<int>& nums) {
           int zero_end = 0;

           for (int scan = 0; scan < static_cast<int>(nums.size()); ++scan) {
               if (nums[scan] == 0) {
                   std::swap(nums[zero_end], nums[scan]);
                   ++zero_end;
               }
           }

           int one_end = zero_end;
           for (int scan = zero_end; scan < static_cast<int>(nums.size()); ++scan) {
               if (nums[scan] == 1) {
                   std::swap(nums[one_end], nums[scan]);
                   ++one_end;
               }
           }
       }

       void dutchFlag(std::vector<int>& nums) {
           int low = 0;
           int current = 0;
           int high = static_cast<int>(nums.size()) - 1;

           while (current <= high) {
               if (nums[current] == 0) {
                   std::swap(nums[low], nums[current]);
                   ++low;
                   ++current;
               } else if (nums[current] == 1) {
                   ++current;
               } else {
                   std::swap(nums[current], nums[high]);
                   --high;
               }
           }
       }

   public:
       void sortColors(std::vector<int>& nums) {
           dutchFlag(nums);
       }
   };

题解
----

计数覆盖
~~~~~~~~

值域只有 ``0``、``1``、``2``。先统计三种值的数量，再按数量依次写回，就能在线性时间完成排序：

.. code-block:: text

   统计：[count0, count1, count2]
   写回：count0 个 0，count1 个 1，count2 个 2

计数数组大小固定为 3，因此额外空间仍是 ``O(1)``。该方法需要一次统计和一次写回，没有利用单遍原地分区的结构。

两次分区
~~~~~~~~

第一次扫描把所有 ``0`` 交换到数组前端。完成后，区间 ``[0, zero_end)`` 已全部确定为 ``0``。

第二次只扫描剩余区间，把所有 ``1`` 交换到 ``zero_end`` 之后。剩余未被选中的元素只能是 ``2``，因此自然位于末尾。
这种方法把三色排序拆成两次二元分区，时间仍为 ``O(n)``，但最坏需要扫描数组两遍。

三段分区
~~~~~~~~

单遍方法同时维护四个区间：

.. code-block:: text

   [0, low)         已确定为 0
   [low, current)   已确定为 1
   [current, high]  尚未分类
   (high, n)        已确定为 2

初始时前三个已分类区间为空，整个数组都是未知区。每轮只检查 ``nums[current]``，并按它的值缩小未知区。

当前值为零
~~~~~~~~~~

当 ``nums[current] == 0`` 时，它应进入左侧零区，因此与 ``nums[low]`` 交换。

若 ``low < current``，``nums[low]`` 来自已经确认的一区，交换到 ``current`` 后仍然已经分类；若
``low == current``，交换等价于不变。因此交换后可以同时增加 ``low`` 和 ``current``。

当前值为一
~~~~~~~~~~

当 ``nums[current] == 1`` 时，它已经位于中间区域应扩展的位置，不需要交换，只增加 ``current``。

当前值为二
~~~~~~~~~~

当 ``nums[current] == 2`` 时，它应进入右侧二区，因此与 ``nums[high]`` 交换并减少 ``high``。

交换回来的元素来自未知区，可能是 ``0``、``1`` 或 ``2``，尚未分类。因此此时不能增加 ``current``，下一轮必须继续检查同一位置。

状态跟踪
~~~~~~~~

以 ``[2,0,2,1,1,0]`` 为例：

.. list-table::
   :header-rows: 1

   * - 数组
     - ``low,current,high``
     - 动作
   * - ``[2,0,2,1,1,0]``
     - ``0,0,5``
     - 当前为 2，与右端交换
   * - ``[0,0,2,1,1,2]``
     - ``0,0,4``
     - 当前换入 0，与 ``low`` 交换
   * - ``[0,0,2,1,1,2]``
     - ``1,1,4``
     - 当前仍为 0，继续扩大零区
   * - ``[0,0,2,1,1,2]``
     - ``2,2,4``
     - 当前为 2，与 ``high`` 交换
   * - ``[0,0,1,1,2,2]``
     - ``2,2,3``
     - 两个 1 依次扩大中间区

循环不变量
~~~~~~~~~~

每次循环前，零区、一区和二区都只包含对应颜色。三种分支分别把一个未知元素放入正确分区，并保持其他已分类区间不变。

处理 ``0`` 或 ``1`` 时 ``current`` 增加；处理 ``2`` 时 ``high`` 减少。因此未知区长度
``high - current + 1`` 每轮严格减少。循环结束时 ``current > high``，未知区为空，三个有序分区连接成最终结果。

复杂度
~~~~~~

计数覆盖、两次分区和荷兰国旗算法的时间复杂度均为 ``O(n)``，额外空间均为 ``O(1)``。荷兰国旗算法只需一次分类扫描，
每个元素最多参与常数次检查或交换。