0032. Longest Valid Parentheses
===============================

题目信息
--------

:题号: 0032
:难度: Hard
:主题: 字符串、栈、下标边界、最长合法区间
:原题: `LeetCode 0032 <https://leetcode.com/problems/longest-valid-parentheses/>`_
:访问状态: Available
:教学重点: 栈保存未匹配下标、失效边界哨兵、弹栈后的区间长度、最长连续子串

题目重述
--------

给定一个只包含 ``'('`` 与 ``')'`` 的字符串 ``s``，返回其中最长连续合法括号子串的长度。

合法括号串要求每个右括号都能匹配一个更早且尚未匹配的左括号，并且所有左括号最终都被闭合。
题目要求连续子串，不能跳过字符后重新拼接。

自建示例
--------

普通情况
~~~~~~~~

.. code-block:: text

   输入：s = ")()())"
   返回：4

   最长合法连续子串是 "()()"。

合法区间嵌套
~~~~~~~~~~~~

.. code-block:: text

   输入：s = "(()())("
   返回：6

   前六个字符 "(()())" 整体合法，末尾左括号未闭合。

非法右括号切断区间
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "())(()"
   返回：2

   下标 2 的右括号没有可匹配左括号，它会成为后续合法区间的新左边界。

没有合法括号对
~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "((("
   返回：0

空字符串
~~~~~~~~

.. code-block:: text

   输入：s = ""
   返回：0

问题抽象
--------

0020 判断整个字符串是否有效，只需知道当前右括号能否匹配栈顶左括号。本题还要计算最长连续区间，
因此必须保留下标，并知道当前合法后缀最早可以从哪里开始。

扫描到下标 ``i`` 时，栈保存两类边界：

* 栈底保存最近一个无法匹配的右括号下标，初始为 ``-1``；
* 其余元素保存尚未匹配的左括号下标。

遇到左括号时压入其下标。遇到右括号时先弹出一个元素：

* 弹出后栈非空，当前右括号完成匹配；从新栈顶之后到 ``i`` 是合法后缀，长度为
  ``i - stack.top``；
* 弹出后栈为空，说明当前右括号无法匹配，把 ``i`` 压回栈中作为新的失效边界。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 下标栈与失效边界
     - ``O(n)``
     - ``O(n)``
     - 主解法；状态直观，直接解释连续区间边界
   * - 动态规划
     - ``O(n)``
     - ``O(n)``
     - ``dp[i]`` 表示以 ``i`` 结尾的最长合法长度，转移边界更易写错
   * - 左右双向计数
     - ``O(n)``
     - ``O(1)``
     - 空间最优，但需要两次扫描才能同时处理多余左右括号
   * - 枚举所有子串
     - ``O(n^3)``
     - ``O(n)``
     - 重复验证大量区间，不可取

主解法：下标栈与失效边界
----------------------

状态含义
~~~~~~~~

设 ``stack`` 为整数下标栈：

* ``stack[0]`` 或当前栈底边界，表示最近一个不能属于任何跨越它的合法子串的位置；
* 栈中其余下标对应尚未匹配的 ``'('``；
* ``best`` 保存已扫描前缀中最长合法连续子串长度。

初始压入 ``-1``。它不是字符串下标，而是“字符串开头之前”的虚拟边界。这样当合法区间从
下标 0 开始并结束于 ``i`` 时，长度统一写成 ``i - (-1) = i + 1``。

核心不变量
~~~~~~~~~~

处理 ``s[i]`` 之前与之后，栈满足：

* 栈中下标严格递增；
* 栈顶是当前合法后缀左侧最近的阻断位置：它要么是未匹配左括号，要么是未匹配右括号边界；
* 若当前字符完成匹配且弹栈后栈非空，则 ``stack.top + 1`` 到 ``i`` 恰好构成合法括号串；
* ``best`` 等于已处理前缀中所有已完成合法区间长度的最大值。

处理左括号
~~~~~~~~~~

左括号尚未知道会与哪个右括号匹配，将其下标压栈。它会阻止当前合法后缀向左跨越，因为在它
被闭合前，包含它的后缀并不完整。

处理右括号
~~~~~~~~~~

先弹出栈顶：

* 若弹出后仍有元素，刚弹出的下标必为一个未匹配左括号。当前右括号与它配对；新栈顶是这段
  合法后缀左侧最近的阻断位置，所以长度为 ``i - stack.top``；
* 若弹出后栈为空，原栈只有一个边界，没有可匹配左括号。当前右括号不能进入任何跨越它的合法
  子串，因此把 ``i`` 作为新边界压栈。

执行过程
~~~~~~~~

以 ``s = ")()())"`` 为例：

.. list-table::
   :header-rows: 1

   * - ``i``
     - 字符
     - 操作后栈
     - 当前长度
     - ``best``
   * - 初始
     - —
     - ``[-1]``
     - —
     - 0
   * - 0
     - ``)``
     - ``[0]``
     - 无匹配，重设边界
     - 0
   * - 1
     - ``(``
     - ``[0, 1]``
     - —
     - 0
   * - 2
     - ``)``
     - ``[0]``
     - ``2 - 0 = 2``
     - 2
   * - 3
     - ``(``
     - ``[0, 3]``
     - —
     - 2
   * - 4
     - ``)``
     - ``[0]``
     - ``4 - 0 = 4``
     - 4
   * - 5
     - ``)``
     - ``[5]``
     - 无匹配，重设边界
     - 4

正确性依据
~~~~~~~~~~

先证明每次计算的长度对应合法子串。扫描到右括号 ``i`` 且弹栈后栈非空时，刚弹出的未匹配
左括号与 ``i`` 配对。新栈顶之后不存在未匹配括号边界：位于其后的所有左括号都已被右括号
按后进先出顺序闭合。因此 ``stack.top + 1`` 到 ``i`` 是合法括号串，长度公式正确。

再证明不会漏掉最长合法子串。任意合法子串都以某个右括号 ``i`` 结束。处理这个 ``i`` 时，
子串内部的左括号会被逐层弹出；弹栈后的新栈顶正位于该合法后缀左侧最近的未匹配边界。
算法此时计算的合法后缀至少覆盖该子串，并用 ``best`` 记录最大值，所以全局最长合法子串一定
会被计入。

当右括号无法匹配时，它不能属于任何跨越该位置的合法括号串。把它设为新边界不会丢失合法
答案，只会排除必然非法的跨越区间。

复杂度
~~~~~~

设字符串长度为 ``n``：

* 每个下标最多压栈一次、弹栈一次，时间复杂度为 ``O(n)``；
* 最坏情况下全部为左括号，栈保存 ``n + 1`` 个下标，额外空间复杂度为 ``O(n)``；
* 返回长度最大为 ``n``，题目约束下普通整数类型足够。

核心语言实现
------------

C
~

.. code-block:: c

   int longestValidParentheses(char *s) {
       int n = 0;
       while (s[n] != '\0') {
           ++n;
       }

       int *stack = malloc((size_t)(n + 1) * sizeof(int));
       int top = 0;
       int best = 0;
       stack[0] = -1;  /* 虚拟边界统一处理从下标 0 开始的合法区间。 */

       for (int i = 0; i < n; ++i) {
           if (s[i] == '(') {
               stack[++top] = i;
           } else {
               --top;
               if (top < 0) {
                   stack[++top] = i;  /* 当前右括号成为新的失效边界。 */
               } else {
                   int length = i - stack[top];
                   if (length > best) {
                       best = length;
                   }
               }
           }
       }

       free(stack);
       return best;
   }

C 需要 ``<stdlib.h>``。函数拥有并释放辅助栈；输入字符串只读，不接管其内存。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int longestValidParentheses(const std::string& s) {
           std::vector<int> stack;
           stack.push_back(-1);
           int best = 0;

           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               if (s[i] == '(') {
                   stack.push_back(i);
               } else {
                   stack.pop_back();
                   if (stack.empty()) {
                       stack.push_back(i);
                   } else {
                       best = std::max(best, i - stack.back());
                   }
               }
           }

           return best;
       }
   };

``std::vector<int>`` 作为栈保存下标。先压入 ``-1``，保证每次 ``pop_back`` 前容器非空。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestValidParentheses(self, s: str) -> int:
           stack = [-1]
           best = 0

           for index, char in enumerate(s):
               if char == "(":
                   stack.append(index)
               else:
                   stack.pop()
                   if not stack:
                       stack.append(index)
                   else:
                       best = max(best, index - stack[-1])

           return best

Python 列表尾部的 ``append``、``pop`` 和 ``[-1]`` 分别对应压栈、弹栈与读取栈顶。

Java
~~~~

.. code-block:: java

   class Solution {
       public int longestValidParentheses(String s) {
           int[] stack = new int[s.length() + 1];
           int top = 0;
           int best = 0;
           stack[0] = -1;

           for (int i = 0; i < s.length(); i++) {
               if (s.charAt(i) == '(') {
                   stack[++top] = i;
               } else {
                   top--;
                   if (top < 0) {
                       stack[++top] = i;
                   } else {
                       best = Math.max(best, i - stack[top]);
                   }
               }
           }

           return best;
       }
   }

数组容量为 ``n + 1``，足以容纳哨兵和全部左括号下标，避免装箱为 ``Integer``。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn longest_valid_parentheses(s: String) -> i32 {
           let mut stack: Vec<i32> = vec![-1];
           let mut best = 0i32;

           // 输入仅含 ASCII 括号，字节下标与题目字符下标一致。
           for (index, byte) in s.bytes().enumerate() {
               let index = index as i32;
               if byte == b'(' {
                   stack.push(index);
               } else {
                   stack.pop();
                   if stack.is_empty() {
                       stack.push(index);
                   } else {
                       let length = index - stack[stack.len() - 1];
                       best = best.max(length);
                   }
               }
           }

           best
       }
   }

``s.bytes()`` 不借出可变数据；栈拥有自己的整数下标，不涉及字符串切片生命周期。

Go
~~

.. code-block:: go

   func longestValidParentheses(s string) int {
       stack := []int{-1}
       best := 0

       // 题目输入是 ASCII 括号，因此按字节索引即可。
       for i := 0; i < len(s); i++ {
           if s[i] == '(' {
               stack = append(stack, i)
           } else {
               stack = stack[:len(stack)-1]
               if len(stack) == 0 {
                   stack = append(stack, i)
               } else {
                   length := i - stack[len(stack)-1]
                   if length > best {
                       best = length
                   }
               }
           }
       }

       return best
   }

Go 通过缩短切片长度弹栈，底层数组由运行时管理；算法只关心有效切片范围。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestValidParentheses(s: string): number {
       const stack: number[] = [-1];
       let best = 0;

       for (let i = 0; i < s.length; i += 1) {
           if (s[i] === "(") {
               stack.push(i);
           } else {
               stack.pop();
               if (stack.length === 0) {
                   stack.push(i);
               } else {
                   best = Math.max(best, i - stack[stack.length - 1]);
               }
           }
       }

       return best;
   }

字符串只含 ASCII 括号，UTF-16 代码单元下标与字符位置一致。长度远小于 ``number`` 的安全整数范围。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int LongestValidParentheses(string s) {
           int[] stack = new int[s.Length + 1];
           int top = 0;
           int best = 0;
           stack[0] = -1;

           for (int i = 0; i < s.Length; i++) {
               if (s[i] == '(') {
                   stack[++top] = i;
               } else {
                   top--;
                   if (top < 0) {
                       stack[++top] = i;
                   } else {
                       best = Math.Max(best, i - stack[top]);
                   }
               }
           }

           return best;
       }
   }

使用定长 ``int[]`` 避免 ``Stack<int>`` 的额外接口开销；``top`` 始终指向当前有效栈顶。

Julia
~~~~~

.. code-block:: julia

   function longest_valid_parentheses(s::String)::Int
       # 算法内部使用题目式零基下标；chars 只负责提供顺序字符。
       chars = collect(s)
       stack = Int[-1]
       best = 0

       for zero_index in 0:(length(chars) - 1)
           char = chars[zero_index + 1]  # Julia 数组一基索引。
           if char == '('
               push!(stack, zero_index)
           else
               pop!(stack)
               if isempty(stack)
                   push!(stack, zero_index)
               else
                   best = max(best, zero_index - stack[end])
               end
           end
       end

       return best
   end

当字符串为空时 ``0:-1`` 在 Julia 中不是空范围，因此工程实现应先处理空串：

.. code-block:: julia

   isempty(s) && return 0

把这行放在 ``collect`` 之前即可。题目只有 ASCII 字符，``collect`` 的字符边界不会改变答案语义。

R
~

.. code-block:: r

   longest_valid_parentheses <- function(s) {
       chars <- strsplit(s, "", fixed = TRUE)[[1]]
       if (length(chars) == 0L) {
           return(0L)
       }

       # 栈值采用零基题目下标；R 向量槽位仍是一基。
       stack <- integer(length(chars) + 1L)
       top <- 1L
       stack[top] <- -1L
       best <- 0L

       for (position in seq_along(chars)) {
           zero_index <- position - 1L
           if (chars[position] == "(") {
               top <- top + 1L
               stack[top] <- zero_index
           } else {
               top <- top - 1L
               if (top == 0L) {
                   top <- 1L
                   stack[top] <- zero_index
               } else {
                   best <- max(best, zero_index - stack[top])
               }
           }
       }

       return(as.integer(best))
   }

R 没有 LeetCode 官方统一接口时使用等价函数。预分配整数向量避免循环中反复增长对象。

关键边界与易错点
----------------

* 哨兵必须是 ``-1``，不是 ``0``；否则从字符串开头开始的合法区间会少算一位。
* 遇到右括号必须先弹栈，再判断是否为空。栈为空表示当前右括号无法匹配，需要成为新边界。
* 长度是 ``i - stack.top``，不是 ``i - stack.top + 1``；栈顶本身是区间外的阻断位置。
* 栈保存下标而不是字符，字符栈无法直接恢复最长连续区间长度。
* 只统计连续子串，不能把被非法括号分隔的两段长度相加。
* Julia 与 R 的容器一基索引不改变算法下标；栈中仍保存零基坐标，长度公式保持统一。
* C、Java、C# 的定长栈需要 ``n + 1`` 个槽位，额外一个槽位用于哨兵。

对照解法：动态规划
------------------

定义 ``dp[i]`` 为以 ``s[i]`` 结尾的最长合法括号子串长度。只有 ``s[i] == ')'`` 时可能非零：

* 若 ``s[i - 1] == '('``，则 ``dp[i] = dp[i - 2] + 2``；
* 若 ``s[i - 1] == ')'``，令 ``open = i - dp[i - 1] - 1``。若 ``open >= 0`` 且
  ``s[open] == '('``，则
  ``dp[i] = dp[i - 1] + 2 + dp[open - 1]``。

动态规划同样是 ``O(n)`` 时间、``O(n)`` 空间。它直接描述“以当前位置结尾”的答案，但
``open`` 与前一段拼接下标容易出现越界；栈方案更适合作为本题主线。

新增与强化知识
--------------

* 新增：用“最近失效边界 + 未匹配左括号下标”统一表示最长合法后缀。
* 新增：哨兵 ``-1`` 把从下标 0 开始的区间长度统一为普通减法。
* 新增：弹栈后的新栈顶，而不是被弹出的左括号，决定当前完整合法后缀的左边界。
* 强化：0020 的未闭合括号栈从“是否有效”扩展到“连续区间长度”。
* 强化：0022 的合法前缀条件解释了为什么多余右括号会永久切断可跨越区间。

关联题目
--------

* `0020. Valid Parentheses <0020-valid-parentheses.rst>`_：使用栈判断整个括号串是否合法。
* `0022. Generate Parentheses <0022-generate-parentheses.rst>`_：通过合法前缀不变量生成所有答案。

最小自检
--------

#. 为什么初始栈要放 ``-1``？
#. 遇到无法匹配的右括号时，为什么要把它的下标压回栈？
#. 对 ``s = "(()())"``，扫描最后一个字符后栈顶是多少，长度如何计算？
#. 为什么公式没有 ``+ 1``？
#. 栈中未匹配左括号如何阻止合法后缀向左扩展？

答案要点
~~~~~~~~

#. ``-1`` 表示字符串开头前的边界，使从 0 开始的区间长度为 ``i - (-1)``。
#. 任何跨越该右括号的区间都非法，它必须成为后续合法区间的新边界。
#. 最后一次匹配弹出对应左括号后只剩 ``-1``，长度为 ``5 - (-1) = 6``。
#. 栈顶是区间外边界，合法区间从 ``stack.top + 1`` 开始，因此长度正好是 ``i - stack.top``。
#. 未匹配左括号尚未闭合，包含它的后缀不完整；只有被后续右括号弹出后才能向左合并。
