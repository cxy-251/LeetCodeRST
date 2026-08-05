0067. Add Binary
================

题目信息
--------

:题号: 0067
:难度: Easy
:主题: 字符串、二进制、双指针、进位
:原题: `LeetCode 0067 <https://leetcode.com/problems/add-binary/>`_
:重点: 从左侧补零的逐位相加，推导到无需补齐长度的双指针进位扫描

题目重述
--------

给定两个非空二进制字符串 ``a`` 和 ``b``，返回它们相加后的二进制字符串。

两个输入都只包含字符 ``'0'`` 和 ``'1'``。除字符串 ``"0"`` 外，输入没有前导零。字符串长度均在
``[1, 10^4]`` 内，因此不能先转换为固定宽度整数再计算。

自建示例
--------

.. code-block:: text

   输入：a = "10101", b = "111"
   输出："11100"

两个字符串按最低位对齐。``10101₂ = 21``，``111₂ = 7``，两者之和为 ``28``，对应二进制
``11100``。

.. code-block:: text

   输入：a = "1000", b = "1000"
   输出："10000"

最高位相加后仍留下进位，因此结果比输入多一位。

.. code-block:: text

   输入：a = "0", b = "0"
   输出："0"

没有任何进位，结果保持单个零。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   private:
       std::string padAndAdd(std::string a, std::string b) {
           if (a.size() < b.size()) {
               a.insert(a.begin(), b.size() - a.size(), '0');
           }
           if (b.size() < a.size()) {
               b.insert(b.begin(), a.size() - b.size(), '0');
           }

           std::string result(a.size(), '0');
           int carry = 0;

           for (int index = static_cast<int>(a.size()) - 1;
                index >= 0;
                --index) {
               const int total =
                   (a[index] - '0') + (b[index] - '0') + carry;
               result[index] = static_cast<char>('0' + total % 2);
               carry = total / 2;
           }

           if (carry != 0) {
               result.insert(result.begin(), '1');
           }
           return result;
       }

       std::string addWithTwoPointers(
           const std::string& a,
           const std::string& b
       ) {
           int first = static_cast<int>(a.size()) - 1;
           int second = static_cast<int>(b.size()) - 1;
           int carry = 0;

           std::string reversed;
           reversed.reserve(std::max(a.size(), b.size()) + 1);

           while (first >= 0 || second >= 0 || carry != 0) {
               int total = carry;
               if (first >= 0) {
                   total += a[first] - '0';
                   --first;
               }
               if (second >= 0) {
                   total += b[second] - '0';
                   --second;
               }

               reversed.push_back(static_cast<char>('0' + total % 2));
               carry = total / 2;
           }

           std::reverse(reversed.begin(), reversed.end());
           return reversed;
       }

   public:
       std::string addBinary(std::string a, std::string b) {
           return addWithTwoPointers(a, b);
       }
   };

题解
----

固定宽度转换
~~~~~~~~~~~~

输入最多包含一万位二进制数字，远超常见整数类型的表示范围。即使最终操作只是加法，转换阶段也已经发生
溢出。字符串本身就是逐位表示，因此应直接模拟二进制竖式加法。

左侧补零
~~~~~~~~

两个二进制数相加时按最低位对齐。最直接的实现先在较短字符串左侧补零，使两者长度相同，然后使用同一个
下标从右向左处理。

每轮读取两个输入位和旧进位。三者都只可能是 ``0`` 或 ``1``，所以总和只可能位于 ``[0, 3]``：

.. code-block:: text

   resultBit = total % 2
   carry     = total / 2

模二得到当前结果位，整除二得到传向更高位的进位。扫描完成后若 ``carry == 1``，就在结果前面增加一个
最高位 ``1``。

这种方法的下标关系直观，但补零会复制并扩展输入字符串。补出的零只用于表示“该侧已经没有数位”，可以用
指针越界条件代替。

双指针对齐
~~~~~~~~~~

``addWithTwoPointers`` 分别让 ``first`` 和 ``second`` 指向两个字符串的末尾。每轮按以下顺序处理：

#. 以旧 ``carry`` 初始化 ``total``；
#. 对仍未越界的输入读取当前位；
#. 写入 ``total % 2``；
#. 更新 ``carry = total / 2``；
#. 两个指针各自向左移动。

某个指针越界后，该侧本轮不再贡献数位，效果与左侧补零完全相同。两个字符串长度不同不会产生额外分支，也
不需要构造对齐后的副本。

进位不变量
~~~~~~~~~~

每轮开始时，两个指针右侧的输入后缀已经全部处理。``reversed`` 保存这些低位对应的正确结果，只是顺序为
从低位到高位；``carry`` 保存已处理后缀向当前更高位产生的唯一影响。

当前两位与旧进位相加后，``total % 2`` 正是本位结果，``total / 2`` 正是下一轮需要的进位。因此处理一位后，
同一不变量继续成立。

循环条件包含 ``carry != 0``。当两个输入指针都越界但仍有最高位进位时，循环会再执行一次并写入字符
``'1'``。若没有进位，循环立即结束，不会产生多余前导零。

状态演化
~~~~~~~~

以 ``a = "1011"``、``b = "110"`` 为例：

.. list-table::
   :header-rows: 1

   * - 当前输入位
     - 旧进位
     - ``total``
     - 写入低位
     - 新进位
   * - ``1 + 0``
     - 0
     - 1
     - 1
     - 0
   * - ``1 + 1``
     - 0
     - 2
     - 0
     - 1
   * - ``0 + 1``
     - 1
     - 2
     - 0
     - 1
   * - ``1 + 0``
     - 1
     - 2
     - 0
     - 1
   * - 输入均耗尽
     - 1
     - 1
     - 1
     - 0

追加顺序为从低位到高位，缓冲区得到 ``"10001"``；整体反转后仍为 ``"10001"``，即正确答案。

反向构造
~~~~~~~~

竖式加法天然从最低位产生字符，而结果字符串要求最高位在前。向字符串末尾追加字符具有常数摊还成本，完成
后再整体反转一次，总工作仍为线性。

若每轮直接在字符串头部插入新字符，已有内容会被反复后移，最坏会产生平方级字符移动。反向追加再反转避免了
这一代价。

方法关系
~~~~~~~~

``padAndAdd`` 通过实际补零统一两个输入的下标。``addWithTwoPointers`` 把“缺失位等于零”编码为指针越界，
删除了输入扩展过程。两种方法使用完全相同的本位公式和进位状态，主入口选择双指针实现。

复杂度分析
~~~~~~~~~~

设两个字符串长度分别为 ``m`` 和 ``n``。

* 左侧补零需要 ``O(m+n)`` 时间，并为补齐后的输入和结果使用 ``O(m+n)`` 空间；
* 双指针方法访问每个输入位一次，再反转结果，时间为 ``O(m+n)``；
* 双指针方法除返回字符串外只维护常数个整数状态，额外工作空间为 ``O(1)``；
* 返回字符串长度最多为 ``max(m,n)+1``。
