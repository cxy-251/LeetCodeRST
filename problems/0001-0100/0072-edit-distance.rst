0072. Edit Distance
===================

题目信息
--------

:题号: 0072
:难度: Medium
:主题: 字符串、动态规划、状态压缩
:原题: `LeetCode 0072 <https://leetcode.com/problems/edit-distance/>`_
:访问状态: Available
:教学重点: 前缀状态、三种编辑转移、对角旧值、一行压缩、空串边界

题目重述
--------

给定两个只包含小写英文字母的字符串 ``word1`` 和 ``word2``，返回把 ``word1`` 转换为 ``word2`` 所需
的最少操作数。每次只能插入一个字符、删除一个字符或替换一个字符。两个字符串长度都在 ``0`` 至
``500`` 之间，输入只读，答案不超过 ``500``。

自建示例
--------

.. code-block:: text

   输入：word1 = "plane"，word2 = "plans"
   输出：1
   解释：把最后一个 e 替换为 s。

.. code-block:: text

   输入：word1 = "kit"，word2 = "sitting"
   输出：5
   一种最优过程包含替换、插入等操作；算法只返回最小次数，不构造操作脚本。

问题抽象
--------

令 ``D[i][j]`` 表示把 ``word1`` 的前 ``i`` 个字符变成 ``word2`` 的前 ``j`` 个字符所需的最少操作数。
空前缀边界为 ``D[i][0] = i``、``D[0][j] = j``。

若末字符相同，最后一步无需操作：

.. code-block:: text

   D[i][j] = D[i-1][j-1]

若末字符不同，最后一步必为三种操作之一：

.. code-block:: text

   替换：D[i-1][j-1] + 1
   删除：D[i-1][j]   + 1
   插入：D[i][j-1]   + 1

取三者最小值即可。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 二维前缀动态规划
     - ``O(mn)``
     - ``O(mn)``
     - 状态直观，保存了全部中间值
   * - 一行滚动动态规划
     - ``O(mn)``
     - ``O(min(m,n))``
     - 主解法；显式保存对角旧值
   * - 朴素递归枚举编辑
     - 指数级
     - 递归深度 ``O(m+n)``
     - 大量重复子问题，不适合本题规模

主解法：一行前缀动态规划
------------------------

状态与覆盖顺序
~~~~~~~~~~~~~~

把较短字符串放在列方向。每行开始前，``dp[j]`` 表示上一行的 ``D[i-1][j]``。从左向右更新时：

* 更新前的 ``dp[j]`` 是上方状态；
* 更新后的 ``dp[j-1]`` 是当前行左侧状态；
* 标量 ``diagonal`` 保存覆盖前的 ``D[i-1][j-1]``。

读取三个旧来源后才能写入 ``dp[j]``，随后把原 ``above`` 保存为下一列的 ``diagonal``。

正确性依据
~~~~~~~~~~

任一最优转换若末字符相同，可以删除两边相同末字符而不增加操作，剩余成本为对角状态。末字符不同
时，最优方案的最后一步只能是替换、删除或插入；移除该最后操作后分别得到三个严格更短的前缀子问题。
反过来，任一子问题最优方案追加对应操作都构成合法方案，因此取三者最小值既不遗漏也不会低估。

边界 ``D[i][0] = i`` 只能通过删除得到，``D[0][j] = j`` 只能通过插入得到。按行从左向右覆盖保留了
所有转移需要的上方、左侧和对角状态，所以一行数组与完整二维表等价。

数值与复杂度
~~~~~~~~~~~~

答案至多为 ``max(m,n) <= 500``，所有固定宽 ``int`` 安全。时间复杂度为 ``O(mn)``；滚动数组长度为
较短字符串长度加一，额外空间为 ``O(min(m,n))``。字符串交换或字节视图不修改调用者输入。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   static int minimum3(int a, int b, int c) {
       int result = a < b ? a : b;
       return result < c ? result : c;
   }

   int minDistance(char *word1, char *word2) {
       size_t rows = strlen(word1);
       size_t cols = strlen(word2);
       if (cols > rows) {
           char *temporary_word = word1;
           word1 = word2;
           word2 = temporary_word;
           size_t temporary_length = rows;
           rows = cols;
           cols = temporary_length;
       }

       int *dp = malloc((cols + 1) * sizeof(int));
       if (dp == NULL) {
           return -1;
       }
       for (size_t col = 0; col <= cols; ++col) {
           dp[col] = (int)col;
       }

       for (size_t row = 1; row <= rows; ++row) {
           int diagonal = dp[0];
           dp[0] = (int)row;

           for (size_t col = 1; col <= cols; ++col) {
               const int above = dp[col];
               if (word1[row - 1] == word2[col - 1]) {
                   dp[col] = diagonal;
               } else {
                   // diagonal、above、dp[col - 1] 分别对应替换、删除、插入。
                   dp[col] = 1 + minimum3(diagonal, above, dp[col - 1]);
               }
               diagonal = above;
           }
       }

       const int answer = dp[cols];
       free(dp);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   public:
       int minDistance(std::string word1, std::string word2) {
           if (word2.size() > word1.size()) {
               std::swap(word1, word2);
           }
           const std::size_t rows = word1.size();
           const std::size_t cols = word2.size();
           std::vector<int> dp(cols + 1);
           for (std::size_t col = 0; col <= cols; ++col) {
               dp[col] = static_cast<int>(col);
           }

           for (std::size_t row = 1; row <= rows; ++row) {
               int diagonal = dp[0];
               dp[0] = static_cast<int>(row);
               for (std::size_t col = 1; col <= cols; ++col) {
                   const int above = dp[col];
                   if (word1[row - 1] == word2[col - 1]) {
                       dp[col] = diagonal;
                   } else {
                       dp[col] = 1 + std::min({diagonal, above, dp[col - 1]});
                   }
                   diagonal = above;
               }
           }
           return dp[cols];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minDistance(self, word1: str, word2: str) -> int:
           if len(word2) > len(word1):
               word1, word2 = word2, word1

           dp = list(range(len(word2) + 1))
           for row, left_char in enumerate(word1, start=1):
               diagonal = dp[0]
               dp[0] = row

               for col, right_char in enumerate(word2, start=1):
                   above = dp[col]
                   if left_char == right_char:
                       dp[col] = diagonal
                   else:
                       dp[col] = 1 + min(diagonal, above, dp[col - 1])
                   diagonal = above

           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {
       public int minDistance(String word1, String word2) {
           if (word2.length() > word1.length()) {
               String temporary = word1;
               word1 = word2;
               word2 = temporary;
           }

           int[] dp = new int[word2.length() + 1];
           for (int col = 0; col < dp.length; ++col) {
               dp[col] = col;
           }

           for (int row = 1; row <= word1.length(); ++row) {
               int diagonal = dp[0];
               dp[0] = row;
               for (int col = 1; col <= word2.length(); ++col) {
                   int above = dp[col];
                   if (word1.charAt(row - 1) == word2.charAt(col - 1)) {
                       dp[col] = diagonal;
                   } else {
                       dp[col] = 1 + Math.min(diagonal, Math.min(above, dp[col - 1]));
                   }
                   diagonal = above;
               }
           }
           return dp[word2.length()];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_distance(word1: String, word2: String) -> i32 {
           let (longer, shorter) = if word1.len() >= word2.len() {
               (word1.as_bytes(), word2.as_bytes())
           } else {
               (word2.as_bytes(), word1.as_bytes())
           };

           let mut dp: Vec<i32> = (0..=shorter.len() as i32).collect();
           for row in 1..=longer.len() {
               let mut diagonal = dp[0];
               dp[0] = row as i32;
               for col in 1..=shorter.len() {
                   let above = dp[col];
                   if longer[row - 1] == shorter[col - 1] {
                       dp[col] = diagonal;
                   } else {
                       dp[col] = 1 + diagonal.min(above).min(dp[col - 1]);
                   }
                   diagonal = above;
               }
           }
           dp[shorter.len()]
       }
   }

Go
~~

.. code-block:: go

   package main

   func minDistance(word1 string, word2 string) int {
       if len(word2) > len(word1) {
           word1, word2 = word2, word1
       }

       dp := make([]int, len(word2)+1)
       for col := range dp {
           dp[col] = col
       }

       for row := 1; row <= len(word1); row++ {
           diagonal := dp[0]
           dp[0] = row
           for col := 1; col <= len(word2); col++ {
               above := dp[col]
               if word1[row-1] == word2[col-1] {
                   dp[col] = diagonal
               } else {
                   dp[col] = 1 + min3(diagonal, above, dp[col-1])
               }
               diagonal = above
           }
       }
       return dp[len(word2)]
   }

   func min3(a int, b int, c int) int {
       if a > b {
           a = b
       }
       if a > c {
           a = c
       }
       return a
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minDistance(word1: string, word2: string): number {
       if (word2.length > word1.length) {
           [word1, word2] = [word2, word1];
       }

       const dp = Array.from({ length: word2.length + 1 }, (_, index) => index);
       for (let row = 1; row <= word1.length; row += 1) {
           let diagonal = dp[0];
           dp[0] = row;

           for (let col = 1; col <= word2.length; col += 1) {
               const above = dp[col];
               if (word1[row - 1] === word2[col - 1]) {
                   dp[col] = diagonal;
               } else {
                   dp[col] = 1 + Math.min(diagonal, above, dp[col - 1]);
               }
               diagonal = above;
           }
       }
       return dp[word2.length];
   }

C#
~~

.. code-block:: csharp

   using System;

   public class Solution {
       public int MinDistance(string word1, string word2) {
           if (word2.Length > word1.Length) {
               (word1, word2) = (word2, word1);
           }

           int[] dp = new int[word2.Length + 1];
           for (int col = 0; col < dp.Length; ++col) {
               dp[col] = col;
           }

           for (int row = 1; row <= word1.Length; ++row) {
               int diagonal = dp[0];
               dp[0] = row;
               for (int col = 1; col <= word2.Length; ++col) {
                   int above = dp[col];
                   if (word1[row - 1] == word2[col - 1]) {
                       dp[col] = diagonal;
                   } else {
                       dp[col] = 1 + Math.Min(diagonal, Math.Min(above, dp[col - 1]));
                   }
                   diagonal = above;
               }
           }
           return dp[word2.Length];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function min_distance(word1::String, word2::String)::Int
       left = collect(codeunits(word1))
       right = collect(codeunits(word2))
       if length(right) > length(left)
           left, right = right, left
       end

       dp = collect(0:length(right))
       for row in 1:length(left)
           diagonal = dp[1]
           dp[1] = row
           for col in 1:length(right)
               above = dp[col + 1]
               if left[row] == right[col]
                   dp[col + 1] = diagonal
               else
                   dp[col + 1] = 1 + min(diagonal, above, dp[col])
               end
               diagonal = above
           end
       end
       return dp[end]
   end

R
~

.. code-block:: r

   min_distance <- function(word1, word2) {
     left <- utf8ToInt(word1)
     right <- utf8ToInt(word2)
     if (length(right) > length(left)) {
       temporary <- left
       left <- right
       right <- temporary
     }

     dp <- 0:length(right)
     if (length(left) == 0) {
       return(dp[length(dp)])
     }

     for (row in seq_along(left)) {
       diagonal <- dp[1]
       dp[1] <- row
       if (length(right) > 0) {
         for (col in seq_along(right)) {
           above <- dp[col + 1]
           if (left[row] == right[col]) {
             dp[col + 1] <- diagonal
           } else {
             dp[col + 1] <- 1 + min(diagonal, above, dp[col])
           }
           diagonal <- above
         }
       }
     }
     dp[length(dp)]
   }

关联题目
--------

* `0010. Regular Expression Matching <0010-regular-expression-matching.rst>`_：比较二维字符串 DP 的状态定义；
* `0044. Wildcard Matching <0044-wildcard-matching.rst>`_：同样依赖前缀状态与遍历顺序；
* `0062. Unique Paths <0062-unique-paths.rst>`_：比较一维压缩中的上方、左侧和覆盖不变量。

知识记录
--------

* 新增：编辑距离前缀状态与插入、删除、替换三类最后操作；
* 新增：一行 DP 中用 ``diagonal`` 保存左上旧状态；
* 强化：滚动数组压缩必须证明覆盖顺序不会丢失尚未使用的旧值。

语言边界与实现说明
------------------

* C 的资源分配、失败返回和所有权在代码附近明确；
* C++、Java、C#、Go 与 TypeScript 使用目标语言的可变或动态容器表达同一状态；
* Rust 通过借用或拥有的标准容器保持边界清晰；
* Julia 与 R 使用一基下标，正文中的零基状态需要显式换算；
* TypeScript 的整数运算不使用会隐式转成 32 位有符号数的位运算；
* R 的函数返回修改后的值时，这是复制语义适配，不改变算法核心状态。

验证证据
--------

本题代码块从 RST 中抽取后执行质量门。可用环境中的 C、C++、Python、Java、Go 与 TypeScript
完成编译或运行；Rust、C#、Julia 与 R 完成静态语义检查。Python 另使用独立基准进行随机或穷举
对拍。验证范围与具体用例在本批提交报告中记录，不把未执行语言描述为运行通过。

关键边界
--------

* 空字符串、根目录、单行单列或零长度前缀必须由初始化直接覆盖；
* 第一行、第一列、栈为空和滚动数组第零项不能套用内部区域的普通更新；
* C 的资源失败值必须与合法输出区分，调用者按接口说明处理。

易错点
------

* 把特殊标记和普通数据混为一谈；
* 更新状态后丢失下一步仍需要的旧值；
* 忽略空输入、单元素或第一行、第一列等边界；
* 只说明代码过程，没有证明状态足以覆盖全部合法解；
* 隐藏容器复制、字符串拆分、结果快照或返回值的空间成本。

最小自检
--------

#. 状态变量分别表示什么？
#. 当前更新会不会覆盖后续仍需读取的旧状态？
#. 边界初始化为什么与一般转移一致？
#. 返回结果是否满足题目要求的规范形式或原地副作用？
#. 复杂度是否包含必要的输入规范化和输出构造？

答案要点
--------

* 先用一句话写出状态含义，再解释更新所需的旧值；
* 正确性证明围绕分类完备性、不变量保持和边界恢复展开；
* 代码只实现正文已经证明的主解法，语言差异不改变问题语义。
