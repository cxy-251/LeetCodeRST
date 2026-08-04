0043. Multiply Strings
======================

题目信息
--------

:题号: 0043
:难度: Medium
:主题: 字符串、竖式乘法、位权对齐、进位
:原题: `LeetCode 0043 <https://leetcode.com/problems/multiply-strings/>`_
:重点: 从逐行部分积推导到固定结果槽位，并把乘法贡献与十进制进位分开处理

题目重述
--------

给定两个表示非负整数的十进制字符串 ``num1`` 和 ``num2``，返回它们乘积的十进制字符串。

不能把整个字符串直接转换成内置整数，也不能使用任意精度整数库。输入只包含字符 ``'0'`` 到 ``'9'``；除字符串
``"0"`` 外，输入没有前导零，输出也必须使用同样的规范形式。

``num1`` 和 ``num2`` 的长度均位于 ``[1, 200]``。

自建示例
--------

需要连续进位：

.. code-block:: text

   输入：num1 = "99", num2 = "99"
   输出："9801"
   解释：四个数字位乘积会汇入相邻槽位，统一进位后得到 9801。

乘积中保留真实的零：

.. code-block:: text

   输入：num1 = "1000", num2 = "205"
   输出："205000"
   解释：结果中间和末尾的零具有十进制位权，不能删除。

任一因数为零：

.. code-block:: text

   输入：num1 = "0", num2 = "873421"
   输出："0"
   解释：结果必须规范化为单个字符 "0"。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string addDecimalStrings(
           const std::string& first,
           const std::string& second
       ) {
           int left = static_cast<int>(first.size()) - 1;
           int right = static_cast<int>(second.size()) - 1;
           int carry = 0;
           std::string sum;

           while (left >= 0 || right >= 0 || carry != 0) {
               int value = carry;
               if (left >= 0) {
                   value += first[left] - '0';
                   --left;
               }
               if (right >= 0) {
                   value += second[right] - '0';
                   --right;
               }
               sum.push_back(static_cast<char>('0' + value % 10));
               carry = value / 10;
           }

           std::reverse(sum.begin(), sum.end());
           return sum;
       }

       std::string multiplyByOneDigit(
           const std::string& number,
           int digit,
           int decimalShift
       ) {
           if (digit == 0) {
               return "0";
           }

           int carry = 0;
           std::string product;
           for (int index = static_cast<int>(number.size()) - 1;
                index >= 0;
                --index) {
               const int value = (number[index] - '0') * digit + carry;
               product.push_back(static_cast<char>('0' + value % 10));
               carry = value / 10;
           }
           if (carry != 0) {
               product.push_back(static_cast<char>('0' + carry));
           }

           std::reverse(product.begin(), product.end());
           product.append(decimalShift, '0');
           return product;
       }

       std::string partialProductRows(
           const std::string& first,
           const std::string& second
       ) {
           if (first == "0" || second == "0") {
               return "0";
           }

           const std::string* multiplicand = &first;
           const std::string* multiplier = &second;
           if (multiplicand->size() < multiplier->size()) {
               std::swap(multiplicand, multiplier);
           }

           std::string result = "0";
           int decimalShift = 0;
           for (int index = static_cast<int>(multiplier->size()) - 1;
                index >= 0;
                --index, ++decimalShift) {
               const int digit = (*multiplier)[index] - '0';
               const std::string row = multiplyByOneDigit(
                   *multiplicand,
                   digit,
                   decimalShift
               );
               result = addDecimalStrings(result, row);
           }
           return result;
       }

       std::string accumulateBySlots(
           const std::string& first,
           const std::string& second
       ) {
           if (first == "0" || second == "0") {
               return "0";
           }

           const int firstLength = static_cast<int>(first.size());
           const int secondLength = static_cast<int>(second.size());
           std::vector<int> slots(firstLength + secondLength, 0);

           for (int firstIndex = firstLength - 1; firstIndex >= 0; --firstIndex) {
               const int firstDigit = first[firstIndex] - '0';
               for (int secondIndex = secondLength - 1;
                    secondIndex >= 0;
                    --secondIndex) {
                   const int secondDigit = second[secondIndex] - '0';
                   slots[firstIndex + secondIndex + 1] += firstDigit * secondDigit;
               }
           }

           for (int index = firstLength + secondLength - 1; index > 0; --index) {
               slots[index - 1] += slots[index] / 10;
               slots[index] %= 10;
           }

           int firstNonZero = 0;
           while (firstNonZero < static_cast<int>(slots.size()) &&
                  slots[firstNonZero] == 0) {
               ++firstNonZero;
           }

           std::string result;
           for (int index = firstNonZero;
                index < static_cast<int>(slots.size());
                ++index) {
               result.push_back(static_cast<char>('0' + slots[index]));
           }
           return result.empty() ? "0" : result;
       }

   public:
       std::string multiply(std::string num1, std::string num2) {
           return accumulateBySlots(num1, num2);
       }
   };

题解
----

为什么不能先转换成整数
~~~~~~~~~~~~~~~~~~~~~~

长度最多为 200 的十进制字符串远超任何固定宽度整数。题目要求操作的是数字字符本身，而不是寻找更大的内置类型。
真正可复用的结构是小学竖式：每次只把两个一位数字相乘，再按十进制位权对齐结果。

逐行部分积建立直接解法
~~~~~~~~~~~~~~~~~~~~~~

竖式乘法可以直接翻译为两步：

#. 用第二个数的某一位乘完整的第一个数，得到一行部分积；
#. 根据该位距离个位的距离，在行尾补零，再把所有部分积相加。

例如 ``314 * 27``：

.. code-block:: text

        314
   ×     27
   --------
       2198
      6280
   --------
      8478

``partialProductRows`` 就是这个模型。它已经不依赖数值大小，只依赖字符串长度；为了减少部分积行数，代码让较短的
字符串充当逐位乘数。

这套方法仍反复构造部分积字符串，并在每加入一行时重新执行一次十进制加法。每一位乘积最终只属于某个固定十进制
位置，可以直接累加到共享槽位中，省去中间字符串。

为什么只需要 m+n 个槽位
~~~~~~~~~~~~~~~~~~~~~~~

设两个非零数的长度分别为 ``m`` 和 ``n``。它们分别小于 ``10^m`` 和 ``10^n``，所以乘积小于
``10^(m+n)``，最多占 ``m+n`` 位。

因此建立长度为 ``m+n`` 的数组。数组下标 ``k`` 表示从最高位开始的第 ``k`` 个十进制槽位；最终最高槽位可能为
零，这正对应乘积实际只有 ``m+n-1`` 位。

数字位为什么累加到 i+j+1
~~~~~~~~~~~~~~~~~~~~~~~~

``first[i]`` 距离个位有 ``m-1-i`` 位，``second[j]`` 距离个位有 ``n-1-j`` 位。二者乘积的位权为：

.. math::

   10^{(m-1-i)+(n-1-j)}=10^{m+n-2-i-j}

长度 ``m+n`` 的结果数组中，下标 ``k`` 对应位权 ``10^{m+n-1-k}``。令两者相等可得：

.. math::

   k=i+j+1

所以每一对数字位只需执行：

.. code-block:: cpp

   slots[i + j + 1] += firstDigit * secondDigit;

此时槽位可能大于 9，它只是尚未规范化的十进制系数。

为什么可以最后统一进位
~~~~~~~~~~~~~~~~~~~~~~

把所有一位乘积累加完后，从最右槽位向左处理。若某个槽位值为 ``value``，写成：

.. math::

   value=10\times(value/10)+(value\bmod10)

保留 ``value % 10`` 作为当前位，把 ``value / 10`` 加到左边一位，表示的总数完全不变。由于从右向左处理，当前槽位
右侧已经全部规范化，而传给左侧的进位会在稍后的迭代中继续处理。

乘积最多为 ``m+n`` 位，因此处理到下标 1 后，最左槽位一定已经是合法的一位数字，不需要再扩展数组。

``99 * 99`` 的槽位演化
~~~~~~~~~~~~~~~~~~~~~~

先只累加四个数字位乘积：

.. code-block:: text

   9×9 -> slots[3] += 81
   9×9 -> slots[2] += 81
   9×9 -> slots[2] += 81
   9×9 -> slots[1] += 81

得到未进位数组：

.. code-block:: text

   [0, 81, 162, 81]

再从右向左规范化：

.. list-table::
   :header-rows: 1

   * - 处理槽位
     - 向左进位
     - 当前位保留
     - 数组
   * - 3
     - 8
     - 1
     - ``[0, 81, 170, 1]``
   * - 2
     - 17
     - 0
     - ``[0, 98, 0, 1]``
   * - 1
     - 9
     - 8
     - ``[9, 8, 0, 1]``

最终得到 ``"9801"``。

为什么不会漏算或重复计算
~~~~~~~~~~~~~~~~~~~~~~~~

十进制展开中，乘积由所有数字位对 ``(i,j)`` 的乘积之和组成。双重循环恰好访问每一对下标一次，并依据位权公式把
它加入唯一槽位，因此没有数字位对被遗漏或重复。

随后进位只把同一数值从非规范系数表示改写成每位 ``0..9`` 的标准十进制表示，不增加也不删除任何数值。最终输出的
字符串因此与原乘积完全相同。

前导零与真实零
~~~~~~~~~~~~~~

任一输入为 ``"0"`` 时直接返回 ``"0"``。两个非零输入的槽位数组可能只在最高端存在未使用的零，从第一个非零槽位
开始输出即可。

结果内部和末尾的零都对应真实位权，例如 ``1000 * 205 = 205000``，不能在输出过程中删除。

复杂度分析
~~~~~~~~~~

设两个字符串长度为 ``m`` 和 ``n``。部分积方法执行 ``O(mn)`` 次一位乘法，但还会反复创建和相加长度至多
``m+n`` 的字符串。

主方法访问全部 ``mn`` 对数字位，再用 ``O(m+n)`` 时间统一进位和输出，所以总时间为 ``O(mn)``。结果槽位数组与
输出字符串均占 ``O(m+n)`` 空间。
