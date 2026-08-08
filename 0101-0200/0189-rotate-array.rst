0189. Rotate Array
==================

题目信息
--------

:题号: 0189. 轮转数组
:难度: Medium
:主题: 数组、下标映射、原地反转
:原题: `LeetCode 0189 <https://leetcode.com/problems/rotate-array/>`_
:重点: 从元素目标下标推导分段置换，再用三次反转删除辅助数组并保持两段内部顺序

题目重述
--------

给定整数数组 ``nums`` 和非负整数 ``k``，将数组整体向右轮转 ``k`` 步。每一步都把最后
一个元素移动到最前面，要求直接修改输入数组。

进阶目标是使用 ``O(1)`` 额外空间。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3,4,5,6,7], k = 3
   修改后：[5,6,7,1,2,3,4]

.. code-block:: text

   输入：nums = [-1,-100,3,99], k = 6
   修改后：[3,99,-1,-100]

   6 mod 4 = 2，只需右移两步。

.. code-block:: text

   输入：nums = [8], k = 100
   修改后：[8]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void extraBuffer(std::vector<int>& nums, int k) {
           int size = static_cast<int>(nums.size());
           if (size == 0) {
               return;
           }

           int shift = k % size;
           std::vector<int> rotated(size);
           for (int index = 0; index < size; ++index) {
               rotated[(index + shift) % size] = nums[index];
           }
           nums = std::move(rotated);
       }

       void threeReversals(std::vector<int>& nums, int k) {
           int size = static_cast<int>(nums.size());
           if (size <= 1) {
               return;
           }

           int shift = k % size;
           if (shift == 0) {
               return;
           }

           std::reverse(nums.begin(), nums.end());
           std::reverse(nums.begin(), nums.begin() + shift);
           std::reverse(nums.begin() + shift, nums.end());
       }

   public:
       void rotate(std::vector<int>& nums, int k) {
           threeReversals(nums, k);
       }
   };

题解
----

逐步轮转重复搬移前缀
~~~~~~~~~~~~~~~~~~~~

完全模拟定义时，每一步取出末元素，再把其余 ``n-1`` 个元素右移，为新首元素腾位置。
一次需要 ``O(n)`` 搬移，执行 ``k`` 次最坏为 ``O(nk)``；同一元素会被来回移动很多次。

轮转 ``n`` 步会回到原数组，所以先令 ``shift = k % n``。这不只是性能优化，也把所有
输入统一到 ``0..n-1`` 的实际位移；``shift = 0`` 时可以直接返回。代码在取模前处理空
数组，避免除以零，虽然题目正式输入通常保证非空。

目标下标给出线性基线
~~~~~~~~~~~~~~~~~~~~

右移 ``shift`` 后，原下标 ``index`` 的元素目标位置唯一确定：

.. code-block:: text

   destination = (index + shift) % n

``extraBuffer`` 创建同长数组，按该映射把每个元素直接写到最终位置。它将时间降为
``O(n)``，不会重复移动；但映射可能形成多个置换环，直接覆盖原数组会破坏尚未读取的值，
所以基线使用 ``O(n)`` 辅助空间。

题目要求继续删除这块缓冲区。与其逐元素追踪置换环，可以从目标结果的两段结构出发。

右旋是两段交换
~~~~~~~~~~~~~~

将原数组按末尾 ``shift`` 个元素分成：

.. code-block:: text

   A = nums[0 .. n-shift)
   B = nums[n-shift .. n)

右旋目标是 ``B + A``，而且 A、B 各自的内部顺序都必须保持。整体反转满足：

.. code-block:: text

   reverse(A + B) = reverse(B) + reverse(A)

这已经把 B 移到前面、A 移到后面，只是两段内部都颠倒。再分别反转前 ``shift`` 项和其余
项，就得到：

.. code-block:: text

   reverse(reverse(B)) + reverse(reverse(A)) = B + A

三次反转全部在原数组上交换对称位置，不需要保存被覆盖的完整副本。

具体状态走读
~~~~~~~~~~~~

对 ``[1,2,3,4,5,6,7]``、``shift = 3``：

.. code-block:: text

   原数组：          [1,2,3,4,5,6,7]   A=[1,2,3,4], B=[5,6,7]
   整体反转：        [7,6,5,4,3,2,1]   reverse(B)+reverse(A)
   反转前 3 项：     [5,6,7,4,3,2,1]   B+reverse(A)
   反转剩余部分：    [5,6,7,1,2,3,4]   B+A

C++ ``std::reverse(first,last)`` 使用左闭右开区间，所以三次调用分别覆盖
``[0,n)``、``[0,shift)``、``[shift,n)``，两段边界没有遗漏或重叠。若把第二次反转的
长度误写为 ``n-shift``，恢复的会是错误分段，方向也可能变成左旋。

元素与边界不变量
~~~~~~~~~~~~~~~~

每次区间反转都把两端元素交换后向中间收缩；已离开活动区间的对称位置已经处于该次反转
的最终位置，不再修改。奇数长度区间的中点无需移动，重复值也不影响位置置换。

``size <= 1`` 时任何轮转都不改变数组；``shift = 0`` 时 A 是完整数组、B 为空，目标仍为
A。主解显式提前返回，避免构造空的前段反转边界。

方案选择与复杂度
~~~~~~~~~~~~~~~~

逐步搬移最坏时间 ``O(nk)``；辅助数组按目标下标直接放置，时间 ``O(n)``、空间
``O(n)``，清楚展示了轮转置换。三次反转保持同样的 ``O(n)`` 时间，只使用常数个迭代器和
交换临时值，额外空间 ``O(1)``，因此 ``threeReversals`` 是主解。
