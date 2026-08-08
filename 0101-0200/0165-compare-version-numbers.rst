0165. Compare Version Numbers
=============================

题目信息
--------

:题号: 0165. 比较版本号
:难度: Medium
:主题: 字符串、双指针、分段比较
:原题: `LeetCode 0165 <https://leetcode.com/problems/compare-version-numbers/>`_
:重点: 按数值语义比较修订段，用有效数字区间消除前导零、尾部零和整数转换问题

题目重述
--------

给定两个版本字符串 ``version1`` 和 ``version2``。每个版本由若干只含数字的修订段组成，
相邻修订段以点号分隔。按从左到右的顺序比较对应修订段的整数值，前导零不影响数值；
若一侧先结束，其后缺失的修订段都视为 0。

若 ``version1`` 较小返回 ``-1``，较大返回 ``1``，两者等价返回 ``0``。

自建示例
--------

.. code-block:: text

   输入：version1 = "3.10", version2 = "3.9.8"
   输出：1

   首段同为 3，第二段 10 大于 9；后面的 8 不再影响结果。

.. code-block:: text

   输入：version1 = "4.02.0.0", version2 = "4.2"
   输出：0

   02 与 2 数值相同；第一个版本多出的两个修订段都等于 0。

.. code-block:: text

   输入：version1 = "1.0000000000007", version2 = "1.7"
   输出：0

   删除前导零后，两侧第二段的有效数字都是 7，无需把长文本转换为整数。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       struct Revision {
           int begin;
           int length;
       };

       Revision readRevision(const std::string& version, int& index) {
           int size = static_cast<int>(version.size());

           while (index < size && version[index] == '0') {
               ++index;
           }
           int begin = index;

           while (index < size && version[index] != '.') {
               ++index;
           }
           int length = index - begin;

           if (index < size) {
               ++index;
           }
           return {begin, length};
       }

       int compareRevision(
           const std::string& first,
           Revision left,
           const std::string& second,
           Revision right) {
           if (left.length != right.length) {
               return left.length < right.length ? -1 : 1;
           }

           for (int offset = 0; offset < left.length; ++offset) {
               char left_digit = first[left.begin + offset];
               char right_digit = second[right.begin + offset];
               if (left_digit != right_digit) {
                   return left_digit < right_digit ? -1 : 1;
               }
           }
           return 0;
       }

   public:
       int compareVersion(std::string version1, std::string version2) {
           int first_index = 0;
           int second_index = 0;

           while (first_index < static_cast<int>(version1.size()) ||
                  second_index < static_cast<int>(version2.size())) {
               Revision left = readRevision(version1, first_index);
               Revision right = readRevision(version2, second_index);
               int order = compareRevision(
                   version1, left, version2, right);
               if (order != 0) {
                   return order;
               }
           }
           return 0;
       }
   };

题解
----

比较对象不是整个字符串
~~~~~~~~~~~~~~~~~~~~~~

若直接按字典序比较，``"3.10"`` 会被误判为小于 ``"3.9"``，因为字符 ``'1'``
小于 ``'9'``；若比较字符串长度，点号数量和前导零又会制造无关差异。题目定义的比较对象
实际上是从左到右排列的整数序列：

.. code-block:: text

   "4.02.0.0" -> [4, 2, 0, 0]
   "4.2"      -> [4, 2]

两个序列按第一处不同的修订值决定顺序；短序列后面无限补零。因此原始方案可以先按点号
切出全部字符串、转成整数数组，再逐项比较。它是正确的，但创建了两组只使用一次的中间
结果，也让整数转换承担了本可避免的位数和溢出边界。

数值比较可以保留在字符串上
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一个非负十进制数删除前导零后，只需两步就能比较大小：

#. 有效数字位数不同，位数更多的数更大；
#. 位数相同，从最高位开始逐字符比较，第一处不同的数字决定大小。

全零修订段删除前导零后长度为 0，正好成为统一的“数值 0”表示。这样无需调用
``stoi`` 或 ``stoll``，即使某个修订段文本很长，比较过程也不会发生整数溢出。

``Revision`` 只保存有效数字在原字符串中的 ``begin`` 和 ``length``，没有复制子串。
``readRevision`` 先跳过前导零，再找到点号；最后越过点号，使指针直接指向下一段。

同步消费与尾部补零
~~~~~~~~~~~~~~~~~~

``first_index``、``second_index`` 分别表示两个字符串尚未读取的位置。只要任一字符串
仍有内容，循环就同步读取一对修订段并比较：

* 比较结果非零时立即返回，因为字典式数值序列的第一处差异已经决定全局顺序；
* 比较结果为零时继续消费下一对修订段；
* 一侧已经到达末尾时，``readRevision`` 不读取字符并返回长度为 0 的修订段，等价于
  为短版本补一个零。

循环不需要真的无限补零。较长一侧的实际尾段全部比较完后，如果它们都为零，两个指针
同时到达末尾并返回 0；只要某个尾段非零，就会当场决定大小。

具体走读
~~~~~~~~

比较 ``"4.02.0.0"`` 与 ``"4.2"``：

#. 两侧首段有效区间都是 ``"4"``，位数和字符均相同；
#. 左侧 ``"02"`` 跳过一个前导零后只保留 ``"2"``，与右侧 ``"2"`` 相同；
#. 右侧已经结束。左侧下一个 ``"0"`` 的有效长度为 0，结束侧也返回长度 0；
#. 最后一段重复同样比较，随后两侧指针都到达末尾，返回 0。

比较 ``"3.10"`` 与 ``"3.9.8"`` 时，首段相同；第二段有效长度分别为 2 和 1，
无需逐字符读取 10 的大小，更无需检查第三段 8，立即返回 1。

代码状态与边界
~~~~~~~~~~~~~~

读取顺序必须是“跳前导零—记录起点—找段尾—越过点号”。如果先记录起点，长度会把
前导零算进去；如果找到点号后不前进，下一轮会反复读取空段。有效输入不会以空段开始或
结束，但已经结束的一侧允许 ``begin == size``、``length == 0``，比较函数不会访问该
位置，因此安全地表示补零状态。

复杂度
~~~~~~

设两个字符串长度分别为 ``n``、``m``。每个字符最多在跳过零、寻找段尾或比较有效数字
时被常数次访问，时间复杂度为 ``O(n + m)``；只维护两个指针和两个修订段视图，额外空间
复杂度为 ``O(1)``。
