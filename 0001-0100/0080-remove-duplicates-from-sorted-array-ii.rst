0080. Remove Duplicates from Sorted Array II
============================================

题目信息
--------

:题号: 0080. 删除有序数组中的重复项 II
:难度: Medium
:主题: 有序数组、双指针、原地覆盖
:原题: `LeetCode 0080 <https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/>`_
:重点: 从额外缓冲过滤，推导到重复段覆盖，再压缩为倒数第二项比较

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums``，原地删除多余的重复项，使每个不同值最多出现两次。
返回处理后的有效长度 ``k``，并保证 ``nums`` 的前 ``k`` 个元素恰好是过滤后的结果。``k`` 之后的内容
不作要求。

算法必须直接修改输入数组，并使用 ``O(1)`` 额外空间。

约束为 ``1 <= nums.length <= 3 * 10^4``，``-10^4 <= nums[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：nums = [0,0,0,1,1,1,1,2,3,3]
   输出：k = 7
   有效前缀：[0,0,1,1,2,3,3]

值 0 和 1 各保留前两个副本，值 2 保留一次，值 3 保留两次。

.. code-block:: text

   输入：nums = [1,1,2,2,3]
   输出：k = 5
   有效前缀：[1,1,2,2,3]

所有重复次数都不超过两次，因此数组保持不变。

.. code-block:: text

   输入：nums = [5,5,5,5]
   输出：k = 2
   有效前缀：[5,5]

同一数值连续出现四次，只保留最前面的两个副本。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int bufferedFilter(std::vector<int>& nums) {
           std::vector<int> filtered;
           filtered.reserve(nums.size());

           for (int value : nums) {
               if (filtered.size() < 2 ||
                   value != filtered[filtered.size() - 2]) {
                   filtered.push_back(value);
               }
           }

           std::copy(filtered.begin(), filtered.end(), nums.begin());
           return static_cast<int>(filtered.size());
       }

       int segmentCounting(std::vector<int>& nums) {
           const int size = static_cast<int>(nums.size());
           int read = 0;
           int write = 0;

           while (read < size) {
               const int value = nums[read];
               int count = 0;

               while (read < size && nums[read] == value) {
                   ++read;
                   ++count;
               }

               const int keep = std::min(count, 2);
               for (int copy = 0; copy < keep; ++copy) {
                   nums[write++] = value;
               }
           }

           return write;
       }

       int explicitRunCount(std::vector<int>& nums) {
           const int size = static_cast<int>(nums.size());
           int write = 0;
           int runLength = 0;

           for (int read = 0; read < size; ++read) {
               if (read == 0 || nums[read] != nums[read - 1]) {
                   runLength = 1;
               } else {
                   ++runLength;
               }

               if (runLength <= 2) {
                   nums[write++] = nums[read];
               }
           }

           return write;
       }

       int compareSecondLast(std::vector<int>& nums) {
           int write = 0;

           for (int value : nums) {
               if (write < 2 || value != nums[write - 2]) {
                   nums[write++] = value;
               }
           }

           return write;
       }

   public:
       int removeDuplicates(std::vector<int>& nums) {
           return compareSecondLast(nums);
       }
   };

题解
----

额外缓冲
~~~~~~~~

最直接的方法是把允许保留的元素依次写入新数组，再复制回 ``nums``。缓冲数组始终保持合法，因此当前值只需
与其中倒数第二项比较。这个方案容易验证，但额外空间为 ``O(n)``，未满足题目的原地要求。

有序数组中的相同值必然连续，所以不需要哈希表记录每个值的总次数。接下来只需把缓冲数组中的写入位置
移回原数组。

分段原地覆盖
~~~~~~~~~~~~

``segmentCounting`` 用 ``read`` 找出一个完整重复段，设其长度为 ``count``，然后把该值写入
``min(count, 2)`` 次。处理完一个重复段后，后续元素一定更大，旧值不会再次出现。

``write`` 始终指向有效前缀之后的第一个位置。每个重复段都恰好保留前两个副本，因此扫描完成时，
``nums[0:write]`` 已是所需结果。

显式重复次数
~~~~~~~~~~~~

无需等到重复段结束才写入。``explicitRunCount`` 从左到右维护当前值在所属重复段中的序号：

* 遇到新值时，``runLength`` 重置为 1；
* 遇到相同值时，``runLength`` 增加；
* 只有 ``runLength <= 2`` 时才写入。

这种写法把分段统计改成单层循环，但仍显式维护当前重复次数。

倒数第二项条件
~~~~~~~~~~~~~~

有效前缀本身按非递减顺序排列，并且每个值最多出现两次。准备写入 ``value`` 时分为两种情况：

* ``write < 2``：有效前缀不足两个元素，当前值不可能已经出现两次，可以直接保留；
* ``write >= 2``：比较 ``value`` 与 ``nums[write - 2]``。

若两者相等，由于有效前缀非递减，``nums[write - 1]`` 也等于 ``value``。有效前缀末尾已经有两个该值，
当前副本必须丢弃。

若两者不等，当前值在有效前缀末尾最多出现一次，写入后仍符合“最多两次”。这样便把显式计数压缩成一次
固定距离比较。

.. list-table::
   :header-rows: 1

   * - 当前读取值
     - 写入前的有效前缀
     - 判断
     - 动作
   * - 第一个 0
     - ``[]``
     - ``write < 2``
     - 保留
   * - 第二个 0
     - ``[0]``
     - ``write < 2``
     - 保留
   * - 第三个 0
     - ``[0,0]``
     - 等于倒数第二项
     - 丢弃
   * - 第一个 1
     - ``[0,0]``
     - 不等于倒数第二项
     - 保留
   * - 第三个 1
     - ``[0,0,1,1]``
     - 等于倒数第二项
     - 丢弃

原地覆盖安全性
~~~~~~~~~~~~~~

扫描任意前缀时，写入的元素数量不会超过已读取元素数量，因此 ``write`` 总是不大于当前读取位置之后的
边界。写入只会发生在当前读取位置或其左侧，不会覆盖尚未读取的元素。

范围循环先把当前元素复制到局部变量 ``value``，再修改数组。即使写入位置恰好等于当前读取位置，本轮判断
使用的值也不会改变。

方法推广
~~~~~~~~

若规则改为“每个值最多保留 ``limit`` 次”，同一逻辑可写成：

.. code-block:: cpp

   if (write < limit || value != nums[write - limit]) {
       nums[write++] = value;
   }

有序性保证：与距离 ``limit`` 的元素相同，就说明有效前缀末尾已经存在 ``limit`` 个当前值。

复杂度
~~~~~~

缓冲方法时间 ``O(n)``、额外空间 ``O(n)``。三种原地方法都只扫描数组一次，时间 ``O(n)``，额外空间
``O(1)``。返回值 ``write`` 即有效前缀长度，后续位置无需清理。
