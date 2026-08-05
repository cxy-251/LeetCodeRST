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

字符串竖式基线
~~~~~~~~~~~~~~

长度最多为 200 的十进制字符串远超固定宽度整数。可直接复用小学竖式：每次只计算两个一位数字的乘积，再按照十进制
位权对齐。

``partialProductRows`` 对第二个数从个位向高位扫描。每一位先与完整的第一个数相乘，再按它距离个位的位数补零，最后
把所有部分积逐行相加。例如 ``314 * 27``：

.. code-block:: text

        314
   ×     27
   --------
       2198
      6280
   --------
      8478

这个方法严格对应手算过程，也不依赖整数范围。它仍会反复创建部分积字符串，并在加入每一行时重新执行十进制加法。
所有一位乘积最终只属于固定的结果位，因此可以直接累加到共享槽位中。

固定槽位模型
~~~~~~~~~~~~

设两个非零数的长度分别为 ``m`` 和 ``n``。它们的乘积小于 ``10^(m+n)``，所以最多占 ``m+n`` 位。建立长度为
``m+n`` 的整数数组 ``slots``，每个下标代表一个十进制结果位；最高槽位允许为零，对应实际结果只有
``m+n-1`` 位。

``first[i]`` 距离个位有 ``m-1-i`` 位，``second[j]`` 距离个位有 ``n-1-j`` 位。两个数字位乘积的位权为：

.. math::

   10^{(m-1-i)+(n-1-j)}=10^{m+n-2-i-j}

长度为 ``m+n`` 的槽位数组中，下标 ``k`` 对应位权 ``10^{m+n-1-k}``。令两者相等得到：

.. math::

   k=i+j+1

因此每一对数字位只需执行：

.. code-block:: cpp

   slots[i + j + 1] += firstDigit * secondDigit;

双重循环恰好访问每一对下标一次，并把它加入唯一的位权槽位。槽位此时可以大于 ``9``，它只是尚未规范化的十进制
系数。

统一进位不变量
~~~~~~~~~~~~~~

所有乘法贡献累加完成后，从最右槽位向左处理。对于当前值 ``value``：

.. math::

   value=10\times(value/10)+(value\bmod10)

保留 ``value % 10`` 作为当前位，把 ``value / 10`` 加到左侧槽位，表示的总数不变。扫描方向保证当前槽位右侧已经
全部规范化，新增进位只会交给尚未处理的左侧继续传播。

每次迭代后都保持以下状态：

* 当前槽位及其右侧都位于 ``0..9``；
* 所有槽位共同表示的数值与全部一位乘积之和相同；
* 尚未处理的左侧槽位可以继续接收进位。

处理到下标 ``1`` 后，最左槽位已经合法。乘积最多占 ``m+n`` 位，因此不会需要数组之外的新槽位。

状态演化
~~~~~~~~

以 ``99 * 99`` 为例，四个数字位乘积先得到：

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

最终槽位为 ``[9, 8, 0, 1]``，得到 ``"9801"``。乘法阶段没有遗漏或重复任何数字位对，进位阶段只改变表示形式，
所以最终字符串与原乘积相同。

输出规范化
~~~~~~~~~~

任一输入为 ``"0"`` 时直接返回 ``"0"``。两个非零输入的槽位数组最多只在最高端出现未使用的零，从第一个非零
槽位开始输出即可。

结果内部和末尾的零都对应真实位权。例如 ``1000 * 205 = 205000``，只能跳过最高端的空槽位，不能删除中间或末尾
的零。若最终字符串为空，则乘积为零，统一返回 ``"0"``。

代码演进
~~~~~~~~

``partialProductRows`` 完整模拟竖式乘法：逐位生成部分积，再通过字符串加法合并。它建立了不依赖整数类型的正确
基线，但反复分配和扫描中间字符串。

``accumulateBySlots`` 直接按照位权把所有一位乘积累加到长度 ``m+n`` 的数组，再统一完成进位和输出。公开入口采用
该方法，因为每个数字位对只计算一次，中间状态也始终保存在固定槽位中。

复杂度分析
~~~~~~~~~~

设两个字符串长度为 ``m`` 和 ``n``。部分积方法执行 ``O(mn)`` 次一位乘法，还会反复创建并相加长度至多
``m+n`` 的字符串。

主方法访问全部 ``mn`` 对数字位，再用 ``O(m+n)`` 时间统一进位和输出，总时间为 ``O(mn)``。结果槽位数组与输出
字符串均占 ``O(m+n)`` 空间。
