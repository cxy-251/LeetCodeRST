0022. Generate Parentheses
==========================

题目信息
--------

:题号: 0022
:难度: Medium
:主题: 回溯、括号序列、前缀约束、Catalan 数
:原题: `LeetCode 0022 <https://leetcode.com/problems/generate-parentheses/>`_
:访问状态: Available
:教学重点: 合法前缀不变量、选择与撤销、无效分支提前剪枝、输出规模复杂度

题目重述
--------

给定整数 ``n``，生成所有由 ``n`` 对圆括号组成的合法字符串。

合法字符串必须同时满足：

* 最终恰好使用 ``n`` 个 ``'('`` 和 ``n`` 个 ``')'``；
* 从左到右扫描任意前缀时，右括号数量不能超过左括号数量。

结果中不能重复，每个合法括号序列都要出现一次，返回顺序不影响正确性。

自建示例
--------

一对括号
~~~~~~~~

.. code-block:: text

   输入：n = 1
   输出：["()"]

三对括号
~~~~~~~~

.. code-block:: text

   输入：n = 3
   一组合法输出：
   ["((()))", "(()())", "(())()", "()(())", "()()()"]

无效前缀会被提前拒绝
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   前缀：")"
   close = 1, open = 0

   该前缀已经出现无法匹配的右括号，后面再添加任何字符都不能修复，必须立即停止。

尚未闭合但仍可扩展
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   n = 3
   前缀："(()"
   open = 2, close = 1

   可以继续添加 '('，也可以添加 ')'；两个分支分别生成不同的合法结果子集。

问题抽象
--------

长度为 ``2n`` 的每个位置有两种字符选择。直接枚举全部字符串需要检查 ``2^(2n)`` 个候选，
其中绝大多数很早就已经违反括号规则。

回溯算法只维护仍可能完成为合法答案的前缀。设当前已经使用：

* ``open`` 个左括号；
* ``close`` 个右括号。

合法前缀必须满足：

.. math::

   0 \le close \le open \le n

因此只有两种受限选择：

* 当 ``open < n`` 时，可以追加 ``'('``；
* 当 ``close < open`` 时，可以追加 ``')'``。

当路径长度达到 ``2n`` 时，根据不变量必然有 ``open = close = n``，可以直接记录答案。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 合法前缀回溯
     - ``O(C_n \cdot n)``
     - ``O(n)`` 递归与路径
     - 主解法；只访问能扩展为合法答案的前缀
   * - 枚举所有二进制选择后验证
     - ``O(4^n \cdot n)``
     - ``O(n)``
     - 产生大量必然失败候选，没有利用前缀约束
   * - 动态规划按括号对数拼接
     - 与输出规模同阶
     - 需要保存多个子问题结果
     - 可展示 Catalan 递推，但字符串去重和复制成本更高

其中 ``C_n`` 是第 ``n`` 个 Catalan 数，也是合法括号序列数量：

.. math::

   C_n = \frac{1}{n+1}\binom{2n}{n}

主解法：合法前缀回溯
--------------------

状态含义
~~~~~~~~

递归状态由三个部分构成：

* ``open``：路径中已使用的左括号数；
* ``close``：路径中已使用的右括号数；
* ``path``：长度为 ``open + close`` 的当前前缀。

``result`` 保存已经完成的长度 ``2n`` 字符串。每次递归只做一个字符选择，因此状态转移是：

.. code-block:: text

   选择 '('：open + 1, close 不变
   选择 ')'：open 不变, close + 1

为什么先限制左括号数量
~~~~~~~~~~~~~~~~~~~~~~

左括号总数不能超过 ``n``。当 ``open == n`` 时，之后只能继续添加右括号直到闭合全部左括号。

若忽略 ``open < n``，会生成使用超过 ``n`` 对括号的路径，即使前缀暂时没有未匹配右括号，
最终长度和题意也已经无法满足。

为什么右括号条件是 ``close < open``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

追加右括号后必须仍满足 ``close <= open``。在追加前等价于要求：

.. math::

   close + 1 \le open

也就是 ``close < open``。

若当前 ``close == open``，所有左括号都已闭合，再添加右括号会形成无法匹配的右括号。该失败
发生在前缀层面，任何后续字符都无法修复，所以可以完全剪掉这个分支。

路径复用与撤销
~~~~~~~~~~~~~~

高效实现通常复用一个长度最多为 ``2n`` 的可变路径：

.. code-block:: text

   追加选择
   进入下一层递归
   删除刚追加的字符

“删除刚追加的字符”不是取消已经生成的答案；完成字符串在加入 ``result`` 时会被复制。撤销
只是让同一个缓冲区回到父状态，以便探索父状态的另一个选择。

C、Julia 等实现也可以预分配固定长度字符数组，并用 ``position`` 覆盖当前位置。此时递归返回后
无需显式清空，因为下一分支会覆盖同一位置。

搜索树如何划分答案
~~~~~~~~~~~~~~~~~~

每个递归节点代表一个合法前缀。它的子树包含所有以该前缀开头的合法完整字符串。

* 追加 ``'('`` 与追加 ``')'`` 得到不同的下一字符，因此两个子树互不重叠；
* 任意合法答案从空前缀开始，逐字符选择时始终满足两个条件，所以存在一条对应路径；
* 一个完整字符串的每个字符都确定，因此它只对应一条根到叶路径。

这解释了为什么算法既不会漏解，也不会重复生成同一个结果。

核心不变量
~~~~~~~~~~

每次进入递归函数时：

* ``path`` 长度恰好等于 ``open + close``；
* ``path`` 中左、右括号数量分别为 ``open``、``close``；
* ``0 <= close <= open <= n``；
* ``path`` 的每个前缀都没有未匹配右括号；
* 当前子树中的所有结果都以 ``path`` 为前缀；
* 已加入 ``result`` 的字符串与当前尚未探索子树互不重复。

正确性依据
~~~~~~~~~~

初始状态为空字符串，``open = close = 0``，不变量成立。

追加左括号只在 ``open < n`` 时进行，因此新状态仍满足 ``open <= n``，也不会破坏
``close <= open``。追加右括号只在 ``close < open`` 时进行，所以追加后仍有
``close <= open``。两个转移都准确更新路径长度和括号计数，因此不变量保持。

任意被记录的路径长度为 ``2n``。由 ``open <= n``、``close <= open`` 和
``open + close = 2n`` 可推出 ``open = close = n``，因此它使用了正确数量的括号；前缀不变量
又保证它是合法括号序列。

反过来，任意合法答案的每个前缀都满足右括号数不超过左括号数，且左右括号总数都不超过
``n``。算法在对应位置不会剪掉它的选择，所以该答案一定到达一个叶节点。搜索树按下一字符
划分，完整字符串路径唯一，因此每个合法答案恰好生成一次。

复杂度
~~~~~~

合法结果数量是 ``C_n``。每个结果长度为 ``2n``，构造并复制到输出至少需要 ``O(n)`` 时间。
因此：

* 时间复杂度为 ``O(C_n * n)``；
* 输出空间为 ``O(C_n * n)``，这是返回全部字符串不可避免的成本；
* 不计输出时，递归深度和共享路径都为 ``O(n)``；
* 不能只写 ``O(2^n)``，因为实际搜索规模由 Catalan 数和字符串复制共同决定。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   static void append_result(
       char*** result,
       int* size,
       int* capacity,
       const char* path,
       int length
   ) {
       if (*size == *capacity) {
           *capacity *= 2;
           *result = realloc(*result, sizeof(char*) * (*capacity));
       }

       char* copy = malloc((length + 1) * sizeof(char));
       memcpy(copy, path, length);
       copy[length] = '\0';
       (*result)[(*size)++] = copy;
   }

   static void backtrack(
       int n,
       int open,
       int close,
       int position,
       char* path,
       char*** result,
       int* size,
       int* capacity
   ) {
       if (position == 2 * n) {
           append_result(result, size, capacity, path, position);
           return;
       }

       if (open < n) {
           path[position] = '(';
           backtrack(
               n, open + 1, close, position + 1,
               path, result, size, capacity
           );
       }
       if (close < open) {
           path[position] = ')';
           backtrack(
               n, open, close + 1, position + 1,
               path, result, size, capacity
           );
       }
   }

   char** generateParenthesis(int n, int* returnSize) {
       int capacity = 16;
       char** result = malloc(sizeof(char*) * capacity);
       char* path = malloc((2 * n + 1) * sizeof(char));
       *returnSize = 0;

       backtrack(
           n, 0, 0, 0, path,
           &result, returnSize, &capacity
       );

       free(path);
       return result;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       vector<string> generateParenthesis(int n) {
           vector<string> result;
           string path;
           path.reserve(2 * n);
           backtrack(n, 0, 0, path, result);
           return result;
       }

   private:
       void backtrack(
           int n,
           int open,
           int close,
           string& path,
           vector<string>& result
       ) {
           if (static_cast<int>(path.size()) == 2 * n) {
               result.push_back(path);
               return;
           }

           if (open < n) {
               path.push_back('(');
               backtrack(n, open + 1, close, path, result);
               path.pop_back();
           }
           if (close < open) {
               path.push_back(')');
               backtrack(n, open, close + 1, path, result);
               path.pop_back();
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generateParenthesis(self, n: int) -> list[str]:
           result: list[str] = []
           path: list[str] = []

           def backtrack(open_count: int, close_count: int) -> None:
               if len(path) == 2 * n:
                   result.append("".join(path))
                   return

               if open_count < n:
                   path.append("(")
                   backtrack(open_count + 1, close_count)
                   path.pop()

               if close_count < open_count:
                   path.append(")")
                   backtrack(open_count, close_count + 1)
                   path.pop()

           backtrack(0, 0)
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       public List<String> generateParenthesis(int n) {
           List<String> result = new ArrayList<>();
           StringBuilder path = new StringBuilder(2 * n);
           backtrack(n, 0, 0, path, result);
           return result;
       }

       private void backtrack(
           int n,
           int open,
           int close,
           StringBuilder path,
           List<String> result
       ) {
           if (path.length() == 2 * n) {
               result.add(path.toString());
               return;
           }

           if (open < n) {
               path.append('(');
               backtrack(n, open + 1, close, path, result);
               path.deleteCharAt(path.length() - 1);
           }
           if (close < open) {
               path.append(')');
               backtrack(n, open, close + 1, path, result);
               path.deleteCharAt(path.length() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn generate_parenthesis(n: i32) -> Vec<String> {
           fn backtrack(
               n: usize,
               open: usize,
               close: usize,
               path: &mut String,
               result: &mut Vec<String>,
           ) {
               if path.len() == 2 * n {
                   result.push(path.clone());
                   return;
               }

               if open < n {
                   path.push('(');
                   backtrack(n, open + 1, close, path, result);
                   path.pop();
               }
               if close < open {
                   path.push(')');
                   backtrack(n, open, close + 1, path, result);
                   path.pop();
               }
           }

           let n = n as usize;
           let mut result = Vec::new();
           let mut path = String::with_capacity(2 * n);
           backtrack(n, 0, 0, &mut path, &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   func generateParenthesis(n int) []string {
       result := make([]string, 0)
       path := make([]byte, 2*n)

       var backtrack func(position int, open int, close int)
       backtrack = func(position int, open int, close int) {
           if position == 2*n {
               // string(path) 创建独立字符串，后续覆盖 path 不影响结果。
               result = append(result, string(path))
               return
           }

           if open < n {
               path[position] = '('
               backtrack(position+1, open+1, close)
           }
           if close < open {
               path[position] = ')'
               backtrack(position+1, open, close+1)
           }
       }

       backtrack(0, 0, 0)
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generateParenthesis(n: number): string[] {
       const result: string[] = [];
       const path: string[] = [];

       function backtrack(open: number, close: number): void {
           if (path.length === 2 * n) {
               result.push(path.join(""));
               return;
           }

           if (open < n) {
               path.push("(");
               backtrack(open + 1, close);
               path.pop();
           }
           if (close < open) {
               path.push(")");
               backtrack(open, close + 1);
               path.pop();
           }
       }

       backtrack(0, 0);
       return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<string> GenerateParenthesis(int n) {
           var result = new List<string>();
           var path = new char[2 * n];

           void Backtrack(int position, int open, int close) {
               if (position == 2 * n) {
                   result.Add(new string(path));
                   return;
               }

               if (open < n) {
                   path[position] = '(';
                   Backtrack(position + 1, open + 1, close);
               }
               if (close < open) {
                   path[position] = ')';
                   Backtrack(position + 1, open, close + 1);
               }
           }

           Backtrack(0, 0, 0);
           return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function generate_parenthesis(n::Int)::Vector{String}
       result = String[]
       path = Vector{Char}(undef, 2 * n)

       function backtrack(position::Int, open::Int, close::Int)
           if position > 2 * n
               # join 明确把字符向量复制为独立字符串。
               push!(result, join(path))
               return
           end

           if open < n
               path[position] = '('
               backtrack(position + 1, open + 1, close)
           end
           if close < open
               path[position] = ')'
               backtrack(position + 1, open, close + 1)
           end
       end

       backtrack(1, 0, 0)
       return result
   end

R
~

.. code-block:: r

   generateParenthesis <- function(n) {
       result <- character(0)
       path <- character(2 * n)

       backtrack <- function(position, open, close) {
           if (position > 2 * n) {
               result <<- c(result, paste0(path, collapse = ""))
               return(invisible(NULL))
           }

           if (open < n) {
               path[position] <<- "("
               backtrack(position + 1, open + 1, close)
           }
           if (close < open) {
               path[position] <<- ")"
               backtrack(position + 1, open, close + 1)
           }
           invisible(NULL)
       }

       backtrack(1, 0, 0)
       result
   }

关键边界与易错点
----------------

* 右括号条件必须是 ``close < open``，写成 ``close < n`` 会生成非法前缀；
* 完成条件可以用路径长度 ``2n``，也可以用 ``open == close == n``，二者在不变量下等价；
* 使用可变路径时，递归返回后必须撤销刚才的追加；固定数组覆盖方案不需要显式清空；
* 记录结果时必须复制当前路径，不能把同一个可变缓冲区引用反复放入结果；
* 不要先生成所有长度 ``2n`` 的字符串再过滤，那会失去最重要的前缀剪枝；
* 复杂度应包含每个结果字符串的 ``O(n)`` 构造成本；
* Rust 的 ``String::len`` 返回字节数，本题只写 ASCII 括号，因此等于字符数；
* R 使用 ``<<-`` 修改闭包外的 ``result`` 和 ``path``，应限制在当前函数局部环境内。

新增与强化知识
--------------

新增
~~~~

* **合法括号前缀不变量**：任何时刻保持 ``close <= open <= n``；
* **不可修复前缀剪枝**：右括号过多后，追加字符无法消除已经出现的非法前缀；
* **Catalan 输出规模**：算法复杂度由合法结构数量而非普通二进制子集数量决定。

强化
~~~~

* 0017 的“追加、递归、撤销”回溯骨架继续使用；
* 0020 的括号栈语义在这里转化为计数：``open - close`` 就是尚未闭合左括号数量；
* 共享可变路径只保存当前递归前缀，加入结果时才复制完整字符串；
* 搜索树的两个子分支按下一字符划分互不重叠的结果集合。

关联题目
--------

* `0017. Letter Combinations of a Phone Number <0017-letter-combinations-of-a-phone-number.rst>`_：
  使用相同的回溯路径复用框架；
* `0020. Valid Parentheses <0020-valid-parentheses.rst>`_：验证已有括号串，本题则只生成始终合法的前缀。

最小自检
--------

#. 为什么 ``close == open`` 时不能再追加右括号？
#. 路径长度达到 ``2n`` 时，为什么无需再次扫描验证合法性？
#. 追加左括号后递归返回，为什么要删除刚追加的字符？
#. 算法为什么不会重复生成同一个括号字符串？
#. 时间复杂度为什么写成 ``O(C_n * n)`` 而不是简单的 ``O(2^n)``？

答案要点
~~~~~~~~

#. 当前没有未闭合左括号，追加右括号会立即形成无法匹配的非法前缀；
#. 不变量保证 ``close <= open <= n``，结合总长度 ``2n`` 只能得到左右各 ``n`` 个；
#. 同一个缓冲区要恢复父前缀，才能正确探索父节点的其他分支；
#. 每个完整字符串的字符序列唯一决定一条根到叶路径，不同下一字符的子树互不相交；
#. 一共有 ``C_n`` 个输出，每个输出长度为 ``2n``，仅复制答案就需要该数量级的时间。