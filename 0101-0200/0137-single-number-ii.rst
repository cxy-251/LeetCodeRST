0137. Single Number II
======================

题目信息
--------

:题号: 0137. 只出现一次的数字 II
:难度: Medium
:主题: 数组、位运算、模计数、有限状态机
:原题: `LeetCode 0137 <https://leetcode.com/problems/single-number-ii/>`_
:重点: 把每一位的出现次数压缩为模三状态，再用两个位掩码并行维护全部 32 位的状态转移

题目重述
--------

给定非空整数数组 ``nums``，恰有一个元素只出现一次，其余每个元素都恰好出现三次。返回这个单次元素。
进阶目标是在 ``O(n)`` 时间内只使用常量额外空间。输入与答案都按 32 位有符号整数解释。

自建示例
--------

* ``nums = [6, -9, 6, 12, 12, 6, 12]``：``6``、``12`` 各出现三次，返回 ``-9``；
* ``nums = [-2147483648, 7, 7, 7]``：答案只有最高位为一，返回 32 位最小整数；
* ``nums = [0, 4, 4, 4]``：单次元素可以为零，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <cstdint>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       int countCompleteValues(const std::vector<int>& nums) {
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

       int countEveryBitModuloThree(const std::vector<int>& nums) {
           long long signedResult = 0;
           for (int bit = 0; bit < 32; ++bit) {
               int oneCount = 0;
               for (int value : nums) {
                   const std::uint32_t bits =
                       static_cast<std::uint32_t>(value);
                   oneCount += static_cast<int>((bits >> bit) & 1U);
               }
               if (oneCount % 3 == 0) {
                   continue;
               }
               if (bit == 31) {
                   signedResult -= 1LL << 31;
               } else {
                   signedResult += 1LL << bit;
               }
           }
           return static_cast<int>(signedResult);
       }

       int runBitwiseStateMachines(const std::vector<int>& nums) {
           int seenOnce = 0;
           int seenTwice = 0;

           for (int value : nums) {
               seenOnce = (seenOnce ^ value) & ~seenTwice;
               seenTwice = (seenTwice ^ value) & ~seenOnce;
           }
           return seenOnce;
       }

   public:
       int singleNumber(std::vector<int>& nums) {
           return runBitwiseStateMachines(nums);
       }
   };

题解
----

为什么上一题的整体异或不再成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

相同值出现两次时 ``x ^ x = 0``，但出现三次时 ``x ^ x ^ x = x``。若把本题全部元素直接异或，每个三次
值反而会残留一次，与真正答案混在一起。哈希计数当然仍然正确：``countCompleteValues`` 为每个完整整数保存
频次，再找频次一；它的 ``O(n)`` 键值状态却没有利用重复次数固定为三这一信息。

三次重复提供的新结构不再是奇偶性，而是“每一位上 1 的个数对三取模”。

方案一：独立统计每个二进制位
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑固定的第 ``bit`` 位。任意三次出现的整数在此位要么贡献零个一，要么贡献三个一，模三后都为零；单次
元素若该位为一，只额外贡献一个。因此把该位在全数组中的一数量对三取模，结果恰好是答案的这一位。

``countEveryBitModuloThree`` 对 32 位各扫描一次，使用 ``uint32_t`` 查看原值的完整比特模式。最低 31 位
按正权 ``2^bit`` 加入；最高位若为一，则按二进制补码的权值 ``-2^31`` 加入。这样
``0x80000000`` 会重建为 ``-2147483648``，没有对有符号负数右移，也没有把无符号最高位结果强制转换为
超出范围的正数。

该方案已经是 ``O(32n) = O(n)`` 时间和 ``O(1)`` 空间，但对数组做了 32 遍。还可以把 32 个模三计数器
的同类状态合并到位掩码中，一次输入同时推进全部位。

单个位只需要三个状态
~~~~~~~~~~~~~~~~~~~~~~

对某一位，只关心目前读到的一数量模三的余数：

.. code-block:: text

   读到 1：0 -> 1 -> 2 -> 0
   读到 0：状态保持不变

用 ``seenOnce`` 的该位为一表示余数一，用 ``seenTwice`` 的该位为一表示余数二；余数零时两者都为零。二者
不能在同一位同时为一。由于 C++ 的按位运算对整数的所有位并行执行，一对 32 位整数就能同时表示 32 个
独立状态机。

两条更新语句怎样实现状态转移
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   seenOnce  = (seenOnce  ^ value) & ~seenTwice
   seenTwice = (seenTwice ^ value) & ~seenOnce

针对 ``value`` 中当前为一的一位：第一次出现时，第一行把 ``seenOnce`` 从零翻为一；第二次出现时，第一行
先把它清零，第二行再把 ``seenTwice`` 置一；第三次出现时，已有 ``seenTwice`` 使第一行不能置一，第二行
则通过异或清零。若输入位为零，两次异或都不改变状态。第二行必须读取更新后的 ``seenOnce``，才能区分
“刚进入余数一”和“刚离开余数一”。

.. list-table::
   :header-rows: 1

   * - 同一位累计读到一的次数
     - ``seenOnce`` 位
     - ``seenTwice`` 位
   * - ``0 mod 3``
     - ``0``
     - ``0``
   * - ``1 mod 3``
     - ``1``
     - ``0``
   * - ``2 mod 3``
     - ``0``
     - ``1``
   * - 再读一次，回到 ``0 mod 3``
     - ``0``
     - ``0``

交错顺序为何不影响结论
~~~~~~~~~~~~~~~~~~~~~~

不同整数的相同位只是在同一个模三计数器上依次加零或加一，加法模三与输入排列无关。完整 32 位又由互不
干扰的位状态机构成，所以三份相同值不必相邻。数组扫描结束后，所有三次元素在每一位的贡献都回到余数零；
单次元素的每个一位停在 ``seenOnce``，每个零位保持零，因此 ``seenOnce`` 的完整比特模式就是答案。

负数也无需为状态机特判。最高位与其他 31 位经过完全相同的三态循环；返回 ``int`` 时它仍是原答案的
32 位有符号表示。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用位状态机：只扫描数组一次，时间 ``O(n)``，维护两个整数，空间 ``O(1)``。逐位计数同为常量
空间和线性渐进时间，状态更直观但需要 32 遍扫描，保留它作为从数学条件到并行状态机的中间方案。完整值
哈希计数最通用，却需 ``O(n)`` 空间，因此不满足进阶目标。
