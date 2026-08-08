0150. Evaluate Reverse Polish Notation
======================================

题目信息
--------

:题号: 0150. 逆波兰表达式求值
:难度: Medium
:主题: 栈、表达式树、后缀表达式、整数除法
:原题: `LeetCode 0150 <https://leetcode.com/problems/evaluate-reverse-polish-notation/>`_
:重点: 用操作数栈保存已完成子表达式，按右后左的弹栈顺序执行二元运算，并准确区分负数与减号

题目重述
--------

给定字符串数组 ``tokens``，它构成一个有效的逆波兰表达式。每个 token 是整数或二元运算符 ``+``、``-``、
``*``、``/``；运算符作用于它前面最近完成的两个子表达式，较早者为左操作数、较晚者为右操作数。返回
整数结果。除法向零截断；输入保证不除零，所有中间值和最终值都在 32 位有符号整数范围内。

自建示例
--------

* ``["18", "5", "-", "4", "/"]``：先算 ``18-5=13``，再算 ``13/4=3``，返回 ``3``；
* ``["7", "-3", "*", "2", "+"]``：``-3`` 是数字，结果为 ``7*(-3)+2=-19``；
* ``["4", "13", "5", "/", "+"]``：先完成右侧子表达式 ``13/5=2``，再与 ``4`` 相加，返回 ``6``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isOperator(const std::string& token) {
           return token.size() == 1 &&
                  (token[0] == '+' || token[0] == '-' ||
                   token[0] == '*' || token[0] == '/');
       }

       int apply(int left, int right, char operation) {
           if (operation == '+') {
               return left + right;
           }
           if (operation == '-') {
               return left - right;
           }
           if (operation == '*') {
               return left * right;
           }
           return left / right;
       }

       int evaluateFromEnd(
           const std::vector<std::string>& tokens,
           int& index
       ) {
           const std::string& token = tokens[index];
           --index;
           if (!isOperator(token)) {
               return std::stoi(token);
           }

           const int right = evaluateFromEnd(tokens, index);
           const int left = evaluateFromEnd(tokens, index);
           return apply(left, right, token[0]);
       }

       int evaluateWithOperandStack(
           const std::vector<std::string>& tokens
       ) {
           std::vector<int> operands;
           operands.reserve(tokens.size());

           for (const std::string& token : tokens) {
               if (!isOperator(token)) {
                   operands.push_back(std::stoi(token));
                   continue;
               }

               const int right = operands.back();
               operands.pop_back();
               const int left = operands.back();
               operands.pop_back();
               operands.push_back(apply(left, right, token[0]));
           }
           return operands.back();
       }

   public:
       int evalRPN(std::vector<std::string>& tokens) {
           return evaluateWithOperandStack(tokens);
       }
   };

题解
----

逆波兰顺序编码了怎样的表达式树
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

普通二元表达式树的后序遍历是“左子树、右子树、根运算符”。逆波兰表达式正是这个顺序：数字是叶子，每个
运算符在自己的两个子表达式都完整出现后才出现。因此不需要括号或优先级规则；读取运算符时，前面最近的
两个尚未被组合的结果就是它的左右孩子。

一种直接模拟是反复在 token 序列中寻找可计算的运算符，把它和前两个结果替换成一个数字。计算本身正确，
但数组删除、插入以及反复寻找位置会移动或扫描大量 token，最坏产生二次工作。栈可以只保留仍待父运算符
使用的子表达式结果。

操作数栈的不变量
~~~~~~~~~~~~~~~~

扫描任意合法前缀后，``operands`` 从底到顶保存若干已经完整求值、但尚未被后续运算符消费的子表达式结果。
读到数字时，它独立构成一个完成的叶子结果，压栈；读到运算符时，栈顶两个结果正是其右、左子表达式，弹出
并合成为一个新结果，再压回栈。

一次运算让栈元素数减少一：弹出两个、压回一个。完整有效表达式结束时，所有子树已组合为根，栈中恰好只
剩最终值。题目保证表达式有效，所以执行运算符时至少有两个操作数，代码不需要把非法输入分支混入核心
状态。

为什么第一次弹出的是右操作数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

后缀片段 ``left right operator`` 表示 ``left operator right``。右子表达式更晚完成，所以结果位于栈顶；
第一次 ``pop`` 必须赋给 ``right``，第二次才是 ``left``。加法、乘法满足交换律，可能掩盖写反错误；减法
和除法会直接产生不同结果。

对 ``["18", "5", "-", "4", "/"]``：

.. list-table::
   :header-rows: 1

   * - token
     - 操作前栈
     - 操作后栈
   * - ``18``
     - ``[]``
     - ``[18]``
   * - ``5``
     - ``[18]``
     - ``[18, 5]``
   * - ``-``
     - ``[18, 5]``
     - 先弹 ``right=5``、再弹 ``left=18``，压入 ``13``
   * - ``4``
     - ``[13]``
     - ``[13, 4]``
   * - ``/``
     - ``[13, 4]``
     - 计算 ``13/4``，得到 ``[3]``

负数字面量怎样与减号区分
~~~~~~~~~~~~~~~~~~~~~~~~

不能只看 token 的首字符：``"-3"`` 以减号开头却是整数，``"+12"`` 同理。只有 token 长度恰好为一，且
唯一字符属于四个运算符时，才按运算符处理；其余 token 交给 ``stoi``。单独的 ``"-"`` 是运算符，
``"-3"`` 不是。

反向递归展示了另一种状态解释
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从 token 末尾读取，首先遇到整棵表达式树的根运算符。它前面紧邻的是右子表达式的末尾，所以
``evaluateFromEnd`` 必须先递归求右子树，再递归求左子树，最后调用同一个 ``apply(left, right)``。数字
直接作为叶子返回，引用参数 ``index`` 表示下一个尚未归属某棵子树的 token。

反向递归与正向栈访问同一表达式树，只是一个从根向叶解析，一个从叶向根归约。递归深度在极端倾斜表达式中
可达 ``O(n)``；显式操作数栈没有调用栈风险，因此作为主解。

除法与边界语义
~~~~~~~~~~~~~~

C++ 有符号整数除法向零截断，与题目一致：``13/4 == 3``，``-13/4 == -3``。输入保证右操作数非零且
所有中间结果不溢出，所以 ``apply`` 不需要额外饱和或异常分支。结果为负与负数字面量识别是两件独立事情：
栈中只保存已经解析好的整数。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用操作数栈。每个 token 解析、压栈或弹栈常数次，除数字转换所需字符时间外，总扫描为
``O(n)``；栈最坏 ``O(n)``。反向递归同为线性时间和最坏 ``O(n)`` 调用栈，保留它用于说明逆波兰表达式与
表达式树后序的对应，但迭代栈的状态和执行边界更稳健。
