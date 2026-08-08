0088. Merge Sorted Array
========================

题目信息
--------

:题号: 0088. 合并两个有序数组
:难度: Easy
:主题: 数组、双指针、原地归并、逆向写入
:原题: `LeetCode 0088 <https://leetcode.com/problems/merge-sorted-array/>`_
:重点: 从额外缓冲的正向归并，推导到利用尾部空槽逆向原地写入

题目重述
--------

给定两个按非递减顺序排列的整数数组 ``nums1`` 和 ``nums2``，以及整数 ``m``、``n``：

- ``nums1`` 的长度为 ``m + n``，其中前 ``m`` 个元素有效，后 ``n`` 个位置是预留空间；
- ``nums2`` 的长度为 ``n``，全部元素有效。

把两个有效序列合并为一个非递减序列，并直接写回 ``nums1``。函数不返回合并后的数组。
``nums1`` 尾部预留位置原有的数值只是占位内容，不属于待合并元素。

约束为 ``0 <= m, n <= 200``、``1 <= m + n <= 200``，数组元素范围为
``[-10^9, 10^9]``。

自建示例
--------

.. code-block:: text

   输入：
   nums1 = [1,4,7,0,0,0], m = 3
   nums2 = [2,3,9],       n = 3

   修改后：nums1 = [1,2,3,4,7,9]

两个有效前缀依次提供元素 ``1,4,7`` 和 ``2,3,9``，末尾三个 ``0`` 只是预留空间。

.. code-block:: text

   输入：
   nums1 = [0,0,0], m = 0
   nums2 = [-2,5,8], n = 3

   修改后：nums1 = [-2,5,8]

第一个有效序列为空，需要把 ``nums2`` 的全部元素写入 ``nums1``。

.. code-block:: text

   输入：
   nums1 = [1,3,6], m = 3
   nums2 = [],      n = 0

   修改后：nums1 = [1,3,6]

第二个序列为空时，``nums1`` 已经是最终结果。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void appendAndSort(std::vector<int>& nums1, int m,
                          const std::vector<int>& nums2, int n) {
           for (int index = 0; index < n; ++index) {
               nums1[m + index] = nums2[index];
           }
           std::sort(nums1.begin(), nums1.end());
       }

       void copyThenMergeForward(std::vector<int>& nums1, int m,
                                 const std::vector<int>& nums2, int n) {
           std::vector<int> first(nums1.begin(), nums1.begin() + m);
           int first_index = 0;
           int second_index = 0;
           int write = 0;

           while (first_index < m && second_index < n) {
               if (first[first_index] <= nums2[second_index]) {
                   nums1[write++] = first[first_index++];
               } else {
                   nums1[write++] = nums2[second_index++];
               }
           }

           while (first_index < m) {
               nums1[write++] = first[first_index++];
           }
           while (second_index < n) {
               nums1[write++] = nums2[second_index++];
           }
       }

       void mergeBackward(std::vector<int>& nums1, int m,
                          const std::vector<int>& nums2, int n) {
           int first = m - 1;
           int second = n - 1;
           int write = m + n - 1;

           while (second >= 0) {
               if (first >= 0 && nums1[first] > nums2[second]) {
                   nums1[write] = nums1[first];
                   --first;
               } else {
                   nums1[write] = nums2[second];
                   --second;
               }
               --write;
           }
       }

   public:
       void merge(std::vector<int>& nums1, int m,
                  std::vector<int>& nums2, int n) {
           mergeBackward(nums1, m, nums2, n);
       }
   };

题解
----

直接利用排序
~~~~~~~~~~~~

最直接的方法是把 ``nums2`` 写入 ``nums1`` 的预留区域，再对整个数组排序。这样可以得到正确结果，
但没有利用两个输入序列原本已经有序这一条件，时间为 ``O((m+n)log(m+n))``。

正向归并
~~~~~~~~

标准归并从两个序列的左端开始，每次取较小值写入结果。这里若直接覆盖 ``nums1[0]``，可能破坏
``nums1`` 中尚未读取的有效元素。例如 ``nums1 = [4,7,0,0]``、``nums2 = [1,5]`` 时，先写入 1
会覆盖仍需参与比较的 4。

复制 ``nums1`` 的前 ``m`` 项后即可安全正向归并。每轮从两个未合并前缀的首元素中选较小者，
时间降为 ``O(m+n)``，代价是保存副本所需的 ``O(m)`` 额外空间。

尾部空槽
~~~~~~~~

``nums1`` 已在右侧预留 ``n`` 个位置。与其从左侧写最小值，不如从右侧写最大值：

.. code-block:: text

   first  = m - 1
   second = n - 1
   write  = m + n - 1

``first`` 和 ``second`` 分别指向两个未合并序列的最大元素，``write`` 指向当前最右空槽。
比较两个尾值后，把较大者放到 ``write``，再向左移动对应指针。

.. list-table::
   :header-rows: 1

   * - 未处理 nums1
     - 未处理 nums2
     - 本轮写入
   * - ``[1,4,7]``
     - ``[2,3,9]``
     - 9
   * - ``[1,4,7]``
     - ``[2,3]``
     - 7
   * - ``[1,4]``
     - ``[2,3]``
     - 4
   * - ``[1]``
     - ``[2,3]``
     - 3

写入不变量
~~~~~~~~~~

循环开始时满足：

.. code-block:: text

   write = first + second + 1

只要 ``second >= 0``，就有 ``write > first``。因此写入位置始终严格位于 ``nums1`` 尚未读取的
有效前缀右侧，不会覆盖未来仍要比较的元素。每轮同时减少 ``write`` 和某一个读指针，这个关系持续成立。

已写入的后缀包含当前已取出的最大元素，并保持非递减顺序。继续选择两个未处理尾值中的较大者，
就能逐步把这个有序后缀向左扩展。

剩余元素
~~~~~~~~

主循环只要求 ``second >= 0``：

- ``nums2`` 先耗尽时，``nums1`` 剩余元素已经位于结果前缀的正确位置，无需搬动；
- ``nums1`` 先耗尽时，条件 ``first >= 0`` 失败，循环会继续把 ``nums2`` 的剩余元素写到前部。

相等时主实现选择 ``nums2`` 的元素写到更右侧。题目只要求数值有序，不要求两个数组之间保持稳定性，
所以选择任一侧都不影响正确性。

复杂度
~~~~~~

拼接后排序的时间为 ``O((m+n)log(m+n))``。复制后正向归并和尾部逆向归并的时间均为
``O(m+n)``；前者额外使用 ``O(m)`` 空间，后者只使用三个下标，额外空间为 ``O(1)``。
