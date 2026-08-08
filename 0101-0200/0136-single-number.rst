0136. Single Number
===================

题目信息
--------

:题号: 0136. 只出现一次的数字
:难度: Easy
:主题: 数组、位运算、异或归约、常量空间
:原题: `LeetCode 0136 <https://leetcode.com/problems/single-number/>`_
:重点: 利用其余元素恰好成对出现的强条件，让异或同时承担计数奇偶性与答案累积

题目重述
--------

给定非空整数数组 ``nums``，恰有一个元素只出现一次，其余每个元素都恰好出现两次。返回这个单次元素。
要求算法在线性时间内完成，并只使用常量级额外空间。

自建示例
--------

* ``nums = [11, -2, 7, 11, 7]``：``11`` 和 ``7`` 各出现两次，返回 ``-2``；
* ``nums = [0, 5, 5]``：唯一值可以是零，返回 ``0``；
* ``nums = [9]``：没有重复对，唯一元素本身就是答案。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       int sortIntoAdjacentPairs(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           for (int index = 0;
                index + 1 < static_cast<int>(nums.size());
                index += 2) {
               if (nums[index] != nums[index + 1]) {
                   return nums[index];
               }
           }
           return nums.back();
       }

       int countOccurrences(const std::vector<int>& nums) {
           std::unordered_map<int, int> frequency;
           for (int value : nums) {
               ++frequency[value];
           }
           for (const auto& [value, count] : frequency) {
               if (count == 1) {
                   return value;
               }
           }
           return 0;
       }

       int xorAllValues(const std::vector<int>& nums) {
           int answer = 0;
           for (int value : nums) {
               answer ^= value;
           }
           return answer;
       }

   public:
       int singleNumber(std::vector<int>& nums) {
           return xorAllValues(nums);
       }
   };

题解
----

先从通用的“找唯一频次”问题出发
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若没有“其余元素恰好出现两次”这个条件，最直接的办法是为每个值计数，再寻找频次一。哈希表让扫描期望
为 ``O(n)``，但要保存最多 ``O(n)`` 个键，不满足常量空间要求。

另一种办法是排序。相同值会聚到一起，由于数组长度为奇数，可按 ``(0,1)``、``(2,3)`` 等位置检查配对；
第一对不等时，左侧就是唯一值，若此前全部成对则唯一值在末尾。``sortIntoAdjacentPairs`` 不需要哈希表，
却因排序耗费 ``O(n log n)`` 时间，代码还复制了输入以免改变调用者数组。

这两种方法都只利用了“频次不同”，还没有把“重复频次固定为二”转化为运算规则。

为什么异或恰好能消去一对
~~~~~~~~~~~~~~~~~~~~~~~~

对固定宽度整数逐位异或，有四个关键性质：

.. code-block:: text

   x ^ x = 0
   x ^ 0 = x
   x ^ y = y ^ x
   (x ^ y) ^ z = x ^ (y ^ z)

前两条让相同的一对归零，后两条说明归约结果与输入排列、括号顺序无关。因此即使两个相同值在数组中相隔
很远，也可以在证明中把它们重排到一起：所有重复对都变为零，零再被单位元规则删除，最后只剩单次元素。

这相当于只保存每一位出现次数的奇偶性。题目保证除答案外所有完整整数都贡献两次相同比特模式，所以无需
为各个值分别建计数项。

前缀不变量与具体走读
~~~~~~~~~~~~~~~~~~~~

``answer`` 在处理任意前缀后，等于该前缀所有元素的异或。读入新值只需再异或一次，不变量继续成立。对
``[11, -2, 7, 11, 7]``：

.. list-table::
   :header-rows: 1

   * - 已读前缀
     - ``answer`` 的符号表达
     - 可删除的成对项
   * - ``[11]``
     - ``11``
     - 无
   * - ``[11, -2, 7]``
     - ``11 ^ -2 ^ 7``
     - 无
   * - 再读 ``11``
     - ``11 ^ 11 ^ -2 ^ 7``
     - 两个 ``11`` 归零
   * - 再读 ``7``
     - ``-2 ^ 7 ^ 7``
     - 两个 ``7`` 归零，只剩 ``-2``

表中重排只用于说明代数等价；代码仍按原数组顺序单次扫描，不需要真的移动元素。

零与负数为何不需要特判
~~~~~~~~~~~~~~~~~~~~~~

初值 ``0`` 是异或单位元，不是“尚未找到答案”的哨兵。若唯一值就是零，所有重复对归零后结果仍为零，
语义没有冲突。负数也按其机器整数比特模式逐位参与异或，同一个负数与自身的每一位完全相同，仍满足
``x ^ x == 0``；这里没有右移或符号扩展，因此无需单独处理符号位。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用 ``xorAllValues``：一次扫描，时间 ``O(n)``，只维护一个整数，额外空间 ``O(1)``，同时达到
两项进阶要求。哈希计数时间期望 ``O(n)``、空间 ``O(n)``，适合重复次数不固定的通用频次问题；排序方案
时间 ``O(n log n)``。三者的演进说明，真正删除额外状态的是题目“恰好两次”提供的抵消结构。
