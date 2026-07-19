0150. Evaluate Reverse Polish Notation
======================================

题目信息
--------

:题号: 0150
:难度: Medium
:主题: 栈、表达式求值、整数除法
:原题: `LeetCode 0150 <https://leetcode.com/problems/evaluate-reverse-polish-notation/>`_
:访问状态: Available
:教学重点: 合法前缀、子表达式栈、操作数次序、向零截断

精确契约
--------

输入 ``tokens`` 是一个合法逆波兰表达式的非空 token 序列，满足：

* ``1 <= len(tokens) <= 10000``；
* 每个 token 要么是完整的单字符运算符 ``+``、``-``、``*``、``/``，要么是
  ``[-200,200]`` 内整数的十进制文本；
* 四个运算符都是二元运算符；表达式的每个运算符都能取得两个已有操作数，完整序列最终形成
  一个表达式；
* 除数不会为零；
* 答案和每次子表达式计算的真实结果都能用有符号 32 位整数表示；
* 除法丢弃小数部分，即向零截断；例如 ``7 / -3 = -2``，而不是 ``-3``；
* 输入只读。Rust 适配器按平台签名取得 token 向量所有权，但不修改字符串内容。

返回完整表达式的整数值。负数字符串如 ``"-11"`` 是一个操作数，不是减号运算符；因此分类条件
必须比较完整 token，不能只看首字符或是否含有 ``-``。

题目给出的 32 位中间值保证同时排除了固定宽语言的加、减、乘溢出，也排除了
``INT_MIN / -1`` 这类数学商超出 32 位的路径。合法性保证支撑弹栈、解析和最终唯一值，
但实现仍需保持正确的左右次序。

自建示例与反例
--------------

非交换运算与负商
~~~~~~~~~~~~~~~~

考虑：

.. code-block:: text

   tokens = ["20", "7", "-", "-3", "/"]

它表示 ``(20 - 7) / -3``，不是 ``20 - (7 / -3)``。栈变化为：

.. list-table::
   :header-rows: 1

   * - token
     - 动作
     - 栈（底 → 顶）
   * - ``20``
     - 压入数字
     - ``[20]``
   * - ``7``
     - 压入数字
     - ``[20, 7]``
   * - ``-``
     - ``left=20``、``right=7``，压入 13
     - ``[13]``
   * - ``-3``
     - 完整 token 不是运算符，压入数字
     - ``[13, -3]``
   * - ``/``
     - ``left=13``、``right=-3``，向零得到 -4
     - ``[-4]``

答案是 ``-4``。若把第一次取出的 ``-3`` 错当左操作数，就会计算 ``-3 / 13 = 0``；若把
``-3`` 按首字符误判为减号，甚至会在只有一个栈项时下溢。

除法方向表
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``right``
     - 向零商
     - 向下取整商
   * - 7
     - 3
     - 2
     - 2
   * - -7
     - 3
     - -2
     - -3
   * - 7
     - -3
     - -2
     - -3
   * - -7
     - -3
     - 2
     - 2
   * - 2
     - -3
     - 0
     - -1

只有商为负且不能整除时，向零与向下取整不同。Python ``//`` 和 R ``%/%`` 都采用向下取整，
不能直接作用于带符号的 ``left``、``right``。本文先计算
``abs(left) // abs(right)`` 或正数 ``%/%``，再按异号关系恢复符号，因而不经过浮点近似。

问题抽象与解法选择
------------------

中缀表达式要处理优先级和括号；逆波兰表达式已经把求值顺序写入 token 顺序。一个二元表达式的
编码是：

.. code-block:: text

   encode(left) encode(right) operator

所以扫描到运算符时，它的右操作数是最近完成的表达式，左操作数是再前一个完成的表达式。
只需保存这些已经完成、尚未被已扫描运算符合并的值，不需要重新建立括号或优先级。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 峰值核心空间
     - 取舍
   * - 单次扫描 + 数值栈
     - ``O(t+L)``
     - ``O(s)``
     - 主解法；状态与 RPN 构造规则直接对应
   * - 从末尾递归解析
     - ``O(t+L)``
     - ``O(h)`` 递归栈
     - 可行，但逆向下标、左右返回顺序和深递归适配更复杂
   * - 构造完整表达式树再求值
     - ``O(t+L)``
     - ``O(t)``
     - 保存了题目没有要求的节点和边
   * - 拼接宿主语言表达式并调用 ``eval``
     - 依解释器而定
     - 依解释器而定
     - 破坏整数除法合同并引入代码执行风险，不采用

这里 ``t`` 是 token 数，``L`` 是所有 token 的字符总量，``s`` 是扫描过程中最大栈深，
``h`` 是表达式树高。

状态与代码映射
--------------

``token``
   当前完整字符串。只有它与四个单字符运算符之一完全相等时才进入运算分支，否则按十进制
   整数解析。

``stack``
   从底到顶保存已处理前缀中，已经形成但尚未被已处理运算符合并的完整子表达式值；顺序与
   这些表达式在前缀中从左到右的顺序相同。

``top`` 或动态容器长度
   当前栈深。C、Java、C#、R 用显式 ``top``；其余语言由容器长度表示。

``right``、``left``
   遇到运算符时取得的两个值。栈顶是编码中更靠后的右表达式，所以先取 ``right``，再取
   ``left``。

``value``
   ``left op right`` 的 32 位合法结果；除法使用题目规定的向零截断。

``answer``
   扫描结束时唯一栈项。数组实现读取 ``stack[0]``，一基语言读取 ``stack[1]``。

算法
----

#. 建立空栈。
#. 从左到右扫描每个完整 token：

   * 若 token 不是四个运算符之一，把它解析为整数并压栈；
   * 否则先取栈顶为 ``right``，再取新栈顶为 ``left``；计算 ``left op right``，
     把结果压回。

#. 返回扫描结束后的唯一栈项。

合法输入无需运行时验证栈下溢、除零、解析失败或最终栈深；这些性质仍要在证明中说明，
不能因为代码没有分支就省略证明义务。

核心不变量
----------

前缀栈深不变量
~~~~~~~~~~~~~~~~

设已处理前缀含 ``operands`` 个数字 token 和 ``operators`` 个运算符 token，则处理后
始终有：

.. code-block:: text

   depth = operands - operators

数字使两边都增加 1；二元运算符弹出两个值、压回一个值，栈深净减 1，而 ``operators``
增加 1，所以等式保持。合法 RPN 的任意非空前缀都有正栈深，每个运算符到达前的深度至少
为 2，完整输入结束时深度恰为 1。

完成子表达式不变量
~~~~~~~~~~~~~~~~~~~~

处理任意前缀后，栈项从底到顶恰好对应这个前缀从左到右尚未被已处理运算符合并的完整表达式块；
每个栈项等于对应表达式块按题目整数语义求得的值。所有已处理 token 恰属于一个这样的块，
没有遗漏、重叠或重复消费。

操作数次序不变量
~~~~~~~~~~~~~~~~~~

运算符前，栈顶两个块按前缀顺序是 ``left-block``、``right-block``。RPN 把右块编码放在
运算符紧前面，因此第一次弹出的值一定属于 ``right-block``，第二次才属于 ``left-block``。
压回的值必须是
``left op right``。

数值与终止不变量
~~~~~~~~~~~~~~~~~~

每次压入的数字在 ``[-200,200]``，每次合成结果由官方保证适合有符号 32 位；除法前
``right != 0``。扫描下标每轮严格前进一个 token，所以有限输入必然终止。

正确性证明
----------

引理一：栈深等于操作数数减运算符数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

空前缀时两者都为 0。读到数字时，代码压入一个值，栈深和操作数数同时加一。读到二元
运算符时，代码弹出两个值再压入一个，栈深净减一；与此同时运算符数加一，右式也减一。
由归纳法，等式对每个前缀成立。

题目保证序列是合法 RPN，因此任何运算符都已有两个完整操作数，对应它到达前
``depth >= 2``；完整表达式的操作数数比二元运算符数恰多一，所以结束时 ``depth = 1``。
因此所有弹栈和最终读取都有结构见证。

引理二：完成子表达式不变量在数字转移后保持
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

数字 token 本身就是一个完整表达式块。解析得到其整数值并压到栈顶，相当于把这个新块追加到
既有块序列末尾。旧块不变，新块恰覆盖当前 token，块之间仍不重叠且覆盖整个已处理前缀，
因此不变量保持。

引理三：完成子表达式不变量在运算符转移后保持
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由合法性和引理一，运算符前至少有两个栈项。根据 RPN 编码规则，前缀末尾两个尚未合并块
依次是左表达式和右表达式；运算符紧跟在右表达式之后。代码先取得 ``right``、再取得
``left``，按指定运算计算
``left op right``，于是结果恰是两个块与当前运算符合成的新完整表达式值。

这三个部分被一个新块替代，其他较早块保持原序；每个 token 仍恰被一个块覆盖。加减乘结果按
整数算术计算，除法按向零合同计算，且除数非零，所以新值合法且正确。不变量保持。

引理四：结束时唯一栈项覆盖整个输入
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一给出完整输入结束时栈深为 1；引理二、三给出唯一栈项对应某个完整表达式块，并且所有
已处理 token 被栈中块无重叠地完整覆盖。只有一个块时，它必覆盖全部 token，因而就是整个
输入表达式。

定理：算法返回逆波兰表达式的正确值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理四，结束时唯一栈项对应完整输入；由完成子表达式不变量，它等于该表达式按指定四则运算
和向零除法求得的值。数值保证使每次固定宽运算可表示，扫描有限且严格前进。因此算法终止并
返回正确整数。

复杂度与真实语言成本
--------------------

每个 token 被分类一次；数字解析读取其全部字符。栈的压入和弹出为摊还或数组常数时间，
所以总时间是 ``O(t+L)``。官方数字 token 最长只有 ``-200`` 的四个字符，故
``L=O(t)``，在当前合同下可简写为 ``O(t)``。

核心同时存活 ``s`` 个值，抽象峰值空间为 ``O(s)`` 且 ``s<=t``。实现成本还包括：

* C、Java、C# 和 R 直接按 ``t`` 预分配栈，实际分配空间是 ``O(t)``，即使某个输入的
  ``s`` 很小；
* C++、Python、Rust、Go、TypeScript 和 Julia 使用动态顺序容器，逻辑载荷为 ``O(s)``；
  扩容会带来摊还
  ``O(t)`` 总搬移，容量峰值仍为 ``O(s)``；
* Python 每个整数和 TypeScript/托管容器的槽位有对象或运行时元数据；渐进界不变；
* R 的数值栈是双精度向量，预分配 ``t`` 个槽。每个 32 位整数都可精确表示，当前加、减、
  乘结果也由合同限制在该范围；
* TypeScript ``number`` 精确表示所有 32 位整数。除法先产生二进制浮点商，再由
  ``Math.trunc`` 向零截断；在
  32 位整数被除数与非零除数范围内，其精度足以保持正确整数部分；
* token 输入及其字符串载荷是调用者输入，不计为工作空间。Rust 消费输入向量但没有克隆
  token；其余实现不修改输入；
* 没有输出容器，返回载荷只是一个整数。

上面的浮点商结论不是把“安全整数”直接外推到任意除法。若整数 ``a/b`` 不能整除，精确商到
相邻整数边界的距离至少为 ``1/abs(b)``；而 ``abs(a)<=2^31`` 时，binary64 在该商量级的
舍入误差严格小于 ``2^-21/abs(b)``，不足以跨过边界。因此 TypeScript 的 ``Math.trunc`` 和
R 对正整数幅值使用的 ``%/%`` 都能得到本题所需的整数部分。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   static int is_operator(const char *token) {
       return token[0] != '\0' &&
              token[1] == '\0' &&
              (token[0] == '+' || token[0] == '-' ||
               token[0] == '*' || token[0] == '/');
   }

   int evalRPN(char **tokens, int tokensSize) {
       int *stack = malloc(
           (size_t)tokensSize * sizeof(*stack)
       );
       if (stack == NULL) {
           return 0;
       }

       int top = 0;
       for (int index = 0; index < tokensSize; ++index) {
           const char *token = tokens[index];
           if (!is_operator(token)) {
               stack[top++] = (int)strtol(token, NULL, 10);
               continue;
           }

           const int right = stack[--top];
           const int left = stack[--top];
           int value;
           if (token[0] == '+') {
               value = left + right;
           } else if (token[0] == '-') {
               value = left - right;
           } else if (token[0] == '*') {
               value = left * right;
           } else {
               value = left / right;
           }
           stack[top++] = value;
       }

       const int answer = stack[0];
       free(stack);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       int evalRPN(std::vector<std::string>& tokens) {
           std::vector<int> stack;

           for (const std::string& token : tokens) {
               if (token != "+" && token != "-" &&
                   token != "*" && token != "/") {
                   stack.push_back(std::stoi(token));
                   continue;
               }

               const int right = stack.back();
               stack.pop_back();
               const int left = stack.back();
               stack.pop_back();

               if (token == "+") {
                   stack.push_back(left + right);
               } else if (token == "-") {
                   stack.push_back(left - right);
               } else if (token == "*") {
                   stack.push_back(left * right);
               } else {
                   stack.push_back(left / right);
               }
           }

           return stack.front();
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def evalRPN(self, tokens: list[str]) -> int:
           stack: list[int] = []

           for token in tokens:
               if token not in ("+", "-", "*", "/"):
                   stack.append(int(token))
                   continue

               right = stack.pop()
               left = stack.pop()
               if token == "+":
                   stack.append(left + right)
               elif token == "-":
                   stack.append(left - right)
               elif token == "*":
                   stack.append(left * right)
               else:
                   quotient = abs(left) // abs(right)
                   if (left < 0) != (right < 0):
                       quotient = -quotient
                   stack.append(quotient)

           return stack[0]

Java
~~~~

.. code-block:: java

   class Solution {
       public int evalRPN(String[] tokens) {
           int[] stack = new int[tokens.length];
           int top = 0;

           for (String token : tokens) {
               if (!isOperator(token)) {
                   stack[top++] = Integer.parseInt(token);
                   continue;
               }

               int right = stack[--top];
               int left = stack[--top];
               char operator = token.charAt(0);
               if (operator == '+') {
                   stack[top++] = left + right;
               } else if (operator == '-') {
                   stack[top++] = left - right;
               } else if (operator == '*') {
                   stack[top++] = left * right;
               } else {
                   stack[top++] = left / right;
               }
           }

           return stack[0];
       }

       private static boolean isOperator(String token) {
           return token.equals("+") || token.equals("-") ||
                  token.equals("*") || token.equals("/");
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn eval_rpn(tokens: Vec<String>) -> i32 {
           let mut stack: Vec<i32> = Vec::new();

           for token in tokens {
               match token.as_str() {
                   "+" | "-" | "*" | "/" => {
                       let right = stack.pop().unwrap();
                       let left = stack.pop().unwrap();
                       let value = match token.as_str() {
                           "+" => left + right,
                           "-" => left - right,
                           "*" => left * right,
                           _ => left / right,
                       };
                       stack.push(value);
                   }
                   _ => {
                       stack.push(token.parse::<i32>().unwrap());
                   }
               }
           }

           stack[0]
       }
   }

Go
~~

.. code-block:: go

   import "strconv"

   func evalRPN(tokens []string) int {
       stack := make([]int, 0)

       for _, token := range tokens {
           switch token {
           case "+", "-", "*", "/":
               right := stack[len(stack)-1]
               left := stack[len(stack)-2]
               stack = stack[:len(stack)-2]

               var value int
               switch token {
               case "+":
                   value = left + right
               case "-":
                   value = left - right
               case "*":
                   value = left * right
               default:
                   value = left / right
               }
               stack = append(stack, value)
           default:
               value, _ := strconv.Atoi(token)
               stack = append(stack, value)
           }
       }

       return stack[0]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function evalRPN(tokens: string[]): number {
       const stack: number[] = [];

       for (const token of tokens) {
           if (token !== "+" && token !== "-" &&
               token !== "*" && token !== "/") {
               stack.push(Number(token));
               continue;
           }

           const right = stack.pop()!;
           const left = stack.pop()!;
           if (token === "+") {
               stack.push(left + right);
           } else if (token === "-") {
               stack.push(left - right);
           } else if (token === "*") {
               stack.push(left * right);
           } else {
               stack.push(Math.trunc(left / right));
           }
       }

       return stack[0];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int EvalRPN(string[] tokens) {
           int[] stack = new int[tokens.Length];
           int top = 0;

           foreach (string token in tokens) {
               if (!IsOperator(token)) {
                   stack[top++] = int.Parse(token);
                   continue;
               }

               int right = stack[--top];
               int left = stack[--top];
               if (token == "+") {
                   stack[top++] = left + right;
               } else if (token == "-") {
                   stack[top++] = left - right;
               } else if (token == "*") {
                   stack[top++] = left * right;
               } else {
                   stack[top++] = left / right;
               }
           }

           return stack[0];
       }

       private static bool IsOperator(string token) {
           return token == "+" || token == "-" ||
                  token == "*" || token == "/";
       }
   }

Julia
~~~~~

.. code-block:: julia

   function eval_rpn(tokens::Vector{String})::Int
       stack = Int[]

       for token in tokens
           if !(token in ("+", "-", "*", "/"))
               push!(stack, parse(Int, token))
               continue
           end

           right = pop!(stack)
           left = pop!(stack)
           value = if token == "+"
               left + right
           elseif token == "-"
               left - right
           elseif token == "*"
               left * right
           else
               div(left, right, RoundToZero)
           end
           push!(stack, value)
       end

       return stack[1]
   end

R
~

.. code-block:: r

   eval_rpn <- function(tokens) {
     operators <- c("+", "-", "*", "/")
     stack <- numeric(length(tokens))
     top <- 0L

     for (token in tokens) {
       if (!(token %in% operators)) {
         top <- top + 1L
         stack[top] <- as.numeric(token)
         next
       }

       right <- stack[top]
       left <- stack[top - 1L]
       top <- top - 2L

       value <- switch(
         token,
         "+" = left + right,
         "-" = left - right,
         "*" = left * right,
         "/" = {
           quotient <- abs(left) %/% abs(right)
           if (xor(left < 0, right < 0)) {
             -quotient
           } else {
             quotient
           }
         }
       )
       top <- top + 1L
       stack[top] <- value
     }

     stack[1L]
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，没有执行官方示例、随机对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下证据来自逐 token 纸面推演、前缀等式证明、官方语言
语义资料和逐语言静态检查。

官方示例一
~~~~~~~~~~

``["2","1","+","3","*"]`` 的完整推演为：

.. list-table::
   :header-rows: 1

   * - token
     - ``operands-operators``
     - 栈
   * - ``2``
     - 1
     - ``[2]``
   * - ``1``
     - 2
     - ``[2,1]``
   * - ``+``
     - 1
     - ``[3]``
   * - ``3``
     - 2
     - ``[3,3]``
   * - ``*``
     - 1
     - ``[9]``

最终唯一值为 9。

官方示例二
~~~~~~~~~~

``["4","13","5","/","+"]`` 依次得到 ``[4]``、``[4,13]``、``[4,13,5]``。
除号先取 ``right=5``、再取 ``left=13``，压入 2，栈变为 ``[4,2]``；加号合成 6，
最终为 ``[6]``。

官方示例三
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - token
     - 动作
     - 栈
   * - ``10``
     - 数字
     - ``[10]``
   * - ``6``
     - 数字
     - ``[10,6]``
   * - ``9``
     - 数字
     - ``[10,6,9]``
   * - ``3``
     - 数字
     - ``[10,6,9,3]``
   * - ``+``
     - ``9+3``
     - ``[10,6,12]``
   * - ``-11``
     - 完整 token 是数字
     - ``[10,6,12,-11]``
   * - ``*``
     - ``12*(-11)``
     - ``[10,6,-132]``
   * - ``/``
     - ``6/(-132)`` 向零为 0
     - ``[10,0]``
   * - ``*``
     - ``10*0``
     - ``[0]``
   * - ``17``
     - 数字
     - ``[0,17]``
   * - ``+``
     - ``0+17``
     - ``[17]``
   * - ``5``
     - 数字
     - ``[17,5]``
   * - ``+``
     - ``17+5``
     - ``[22]``

最大栈深为 4，所有运算符前深度至少为 2，完整序列最后深度为 1。``-11`` 没有进入运算
分支，负的小数商 ``6/-132`` 没有被向下取成 -1。

边界纸面推导
~~~~~~~~~~~~

* 单 token ``["-11"]``：一次数字转移后栈为 ``[-11]``，直接返回；不需要人为添加
  运算符。
* ``["5","2","-"]``：第一次弹出 2 是 right，第二次弹出 5 是 left，结果为 3，
  不是 -3。
* ``["-7","3","/"]``、``["7","-3","/"]``、``["-7","-3","/"]`` 分别得到 -2、-2、2。
* ``["2","-3","/"]`` 的绝对值商为 0，恢复负号仍是整数零；不能得到 -1。
* ``["1","2","3","4","+","+","+"]`` 在前四个数字后达到深度 4，随后每个运算符
  合并两个块，
  展示 ``s`` 可能线性增长。

C 资源路径专项审查
~~~~~~~~~~~~~~~~~~

``tokensSize`` 在 ``1..10000``，所以 ``(size_t)tokensSize * sizeof(int)`` 在首次分配前
已扩为容量类型且不会溢出。分配成功后只有循环后的一个出口，先保存答案再 ``free(stack)``；
分配前没有已取得资源。

``malloc`` 失败时函数返回 0，但 0 也是合法表达式结果，LeetCode 的 ``int`` 签名没有独立错误
通道，因此两者无法区分。这是接口限制，不是正确输入上的算法分支。合法 RPN 保证每次
``--top`` 前至少有两个值，结束时 ``top==1``；代码读取 ``stack[0]`` 有不变量见证。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：完整 token 比较不会把 ``-11`` 当运算符；``strtol``/``stoi`` 只解析合法
  小整数。C11 与 C++11 及以后有符号整数除法丢弃小数部分。32 位中间保证排除算术溢出、
  除零和最小值除 -1。
* **Python**：四字符串元组做完整相等比较。``int`` 精确解析，绝对值整除只作用于非负整数，
  再由异号关系恢复符号；没有用浮点 ``int(left/right)``，也没有直接对负商使用 ``//``。
* **Java**：``Integer.parseInt`` 与 ``int[]`` 对应官方 32 位域；Java 整数 ``/`` 向零。
  显式 ``top`` 每次
  运算净减一，最终读取槽 0。
* **Rust**：``match token.as_str()`` 只匹配四个完整 token；合法输入和前缀不变量支撑两个
  ``unwrap`` 与解析 ``unwrap``。``i32`` 除法向零；输入 ``Vec`` 被消费，但字符串没有克隆或修改。
* **Go**：字符串 ``switch`` 完整匹配；``int`` 至少覆盖有符号 32 位，``Atoi`` 的错误被
  合法 token 契约排除。
  切片先读最后两项再缩短，保留 left/right；整数除法向零。
* **TypeScript**：``Number`` 精确解析当前小整数，全部中间值位于安全整数域；没有使用会强制
  转 32 位的位运算。
  非空断言由合法前缀支撑，``Math.trunc`` 明确删除商的小数部分。
* **C#**：``int.Parse``、数组和返回类型保持 32 位语义；完整字符串比较区分负数。整数除法
  向零，合同排除
  ``int.MinValue / -1`` 和除零异常路径。
* **Julia**：``in`` 比较完整字符串；``Int`` 覆盖官方 32 位域，
  ``div(left,right,RoundToZero)`` 明确选择
  向零模式。三参数 ``div`` 需要 Julia 1.4 或更高；当前代码没有构造可能反向的 ``a:b`` 范围。
* **R**：运算符向量在循环外建立，``%in%`` 做完整字符串匹配；预分配数值向量避免反复
  ``c`` 追加。解析值和
  32 位中间整数都能由双精度精确表示；``%/%`` 只处理两个非负整数幅值，再显式恢复符号。

剩余风险
~~~~~~~~

静态审查没有确认目标判题机的实际编译器、解释器版本和模板，也没有观察分配器、动态容器扩容
或异常路径的运行时行为。C 的资源失败歧义、托管语言内存不足异常、Julia 低于 1.4 的版本
差异、R/TypeScript 具体数值运行时以及 Go 忽略的、在合法输入上不可达的 ``Atoi`` 错误，
都没有被写成“通过”。

关键边界与失败方式
------------------

* 第一次弹出的必须是 ``right``；减法和除法写反会立即改变结果。
* 运算符识别必须是完整 token 相等；首字符 ``-`` 也可能属于负数。
* 合法前缀保证运算符前至少两个值；若扩展到不可信输入，必须增加下溢、解析、除零和最终
  深度检查。
* Python ``//`` 与 R ``%/%`` 对负商向下取整，不能直接替代向零除法。
* 用 ``int(left/right)``、浮点强转或 ``floor`` 统一十语言，会引入精度或方向差异。
* 完整表达式结束时必须恰有一个值；返回“最后一个值”不能掩盖非法输入留下的多个块。
* 固定宽实现不能因为最终答案适合 32 位就忽略中间值；本题是官方明确保证所有中间计算也
  适合 32 位。
* ``INT_MIN / -1`` 的数学商超出 32 位；它由当前合同排除，不能在更宽输入域中照搬结论。
* C 分配失败的 0 与合法答案 0 相同；平台接口没有让算法返回错误对象的空间。
* R 若用 ``stack <- c(stack, value)`` 和负下标反复删尾，会产生不必要的累计复制；预分配加
  ``top`` 更准确。

学习链与知识更新
----------------

本题展示了“语法顺序已经编码依赖关系”时的最小状态：RPN 不需要显式优先级，只要保存尚未
被合并的完成块。前缀栈深等式负责结构合法性，子表达式不变量负责值正确性，两者缺一不可。

新增或强化的知识包括：

* 二元 RPN 的栈深守恒式 ``operands-operators``；
* 栈顶顺序来自 ``encode(left) encode(right) operator``，不是任意约定；
* “完整 token 分类”把二元减号与负数字面量可靠分开；
* 向零截断与向下取整是不同的整数语义，跨语言移植必须显式分类；
* 题面最终值界不能自动保护中间表达式；本题因为额外给出全部中间值界才可统一使用 32 位；
* 关联到 `0020. Valid Parentheses <../0001-0100/0020-valid-parentheses.rst>`_ 的栈前缀
  合法性；本题的栈项保存数值子表达式，而不是未匹配定界符；
* 可继续关联到表达式树、编译器操作数栈和后续计算器题。

带答案自检
----------

#. **为什么 ``["5","2","-"]`` 中第一次弹出的 2 是右操作数？**

   RPN 把左表达式编码在前、右表达式编码在后，最后才放运算符；因此更靠近运算符的栈顶块
   是右表达式。

#. **为什么栈深等于数字数减运算符数？**

   数字压入一个值，使深度加一；二元运算符弹二压一，使深度净减一。

#. **结束时深度为 1 为什么还不够，仍需子表达式不变量？**

   深度只证明结构数量；子表达式不变量才证明该唯一值按正确左右次序和运算语义覆盖了全部
   token。

#. **Python 为什么不能直接写 ``left // right``？**

   ``//`` 向负无穷取整，例如 ``-7//3=-3``；题目要求向零得到 -2。

#. **R 对负数除法如何避免 ``%/%`` 的方向问题？**

   先对两个绝对值做正数整除，再根据原操作数是否异号决定是否取负。

#. **为什么 ``-11`` 不会被代码当成减号？**

   所有实现都比较完整 token；只有恰好等于单字符 ``"-"`` 才是运算符。

#. **为什么固定宽语言可以用 32 位栈？**

   官方不仅保证最终答案，还保证每次中间计算都适合有符号 32 位，并保证除数非零。

#. **抽象峰值 ``O(s)`` 与 C 实际空间 ``O(t)`` 为什么不同？**

   抽象只需保存最大同时存活的 s 个值；C 为了避免扩容直接按 token 总数 t 预分配，可能
   多留空槽。
