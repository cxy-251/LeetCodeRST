0097. Interleaving String
=========================

题目信息
--------

:题号: 0097
:难度: Medium
:主题: 字符串、动态规划、滚动数组
:原题: `LeetCode 0097 <https://leetcode.com/problems/interleaving-string/>`_
:访问状态: Available
:教学重点: 双前缀状态、来源二选一、左到右覆盖、短串列压缩

题目重述
--------

给定字符串 ``s1``、``s2`` 和 ``s3``，判断能否在保持 ``s1``、``s2`` 各自字符相对顺序的前提下，
交替取出两者全部字符形成 ``s3``。题目保证三个字符串只包含小写英文字母，``s1``、``s2`` 长度都不
超过 100。

自建示例
--------

.. code-block:: text

   s1 = "aabcc"
   s2 = "dbbca"
   s3 = "aadbbcbcac"
   输出：true

``s3 = "aadbbbaccc"`` 时输出 ``false``。空串可以与另一字符串直接形成其自身。

问题抽象
--------

定义二维状态：

.. code-block:: text

   state(i, j) = s1 的前 i 个字符与 s2 的前 j 个字符
                 能否形成 s3 的前 i+j 个字符

最后一个字符只有两个来源：

* 来自 ``s1[i-1]``，前提是 ``state(i-1,j)`` 为真且字符匹配；
* 来自 ``s2[j-1]``，前提是 ``state(i,j-1)`` 为真且字符匹配。

两个来源满足任意一个即可。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 一行前缀 DP
     - ``O(mn)``
     - ``O(min(m,n))``
     - 主解法；保留完整状态语义并压缩空间
   * - 完整二维 DP
     - ``O(mn)``
     - ``O(mn)``
     - 最易观察，但保存了不再需要的旧行
   * - 记忆化递归
     - ``O(mn)``
     - ``O(mn)``
     - 状态直观，额外依赖递归栈和缓存
   * - 朴素递归
     - 指数级
     - ``O(m+n)``
     - 同一前缀状态被大量重复搜索

主解法：短串为列的一行 DP
------------------------

长度检查与维度选择
~~~~~~~~~~~~~~~~~~

若 ``len(s1) + len(s2) != len(s3)``，必然无法使用全部字符，立即返回假。为了把空间压缩为
``O(min(m,n))``，若 ``s2`` 更长就交换 ``s1`` 和 ``s2``；问题对两个来源字符串完全对称。

一行状态含义
~~~~~~~~~~~~

处理完 ``s1`` 的前 ``row`` 个字符后：

.. code-block:: text

   dp[column] = state(row, column)

进入新行前，``dp[column]`` 仍是上一行 ``state(row-1,column)``。从左到右更新时，
``dp[column-1]`` 已经是当前行 ``state(row,column-1)``。因此转移为：

.. code-block:: text

   dp[column] =
       (old dp[column] and s1[row-1] matches target) or
       (new dp[column-1] and s2[column-1] matches target)

目标字符下标是 ``row + column - 1``。

为什么必须从左到右
~~~~~~~~~~~~~~~~~~

当前状态需要当前行左邻居 ``state(row,column-1)``。左到右更新时，该值已经写入 ``dp[column-1]``；
若从右到左更新，读到的是上一行左邻居，状态语义错误。与此同时，尚未覆盖的 ``dp[column]`` 正好保留
上一行同列状态。

初始化
~~~~~~

``dp[0] = true`` 表示两个空前缀形成空前缀。第一行只允许使用 ``s2``，因此每个槽位依赖左邻居和
对应字符匹配。每个新行的 ``dp[0]`` 只允许使用 ``s1``，同样由上一行 ``dp[0]`` 连续延伸。

正确性依据
~~~~~~~~~~

**状态充分。** 已消费字符数量唯一确定目标位置，只需记录两个来源各消费多少字符。

**转移完整。** 任意非空交错前缀的最后字符必然来自 ``s1`` 或 ``s2``，两种情况覆盖全部可能。

**转移互斥不要求。** 两个来源可能同时成立；布尔或只关心是否存在至少一条合法路径。

**覆盖顺序正确。** 左到右更新同时保留上一行同列和当前行左邻居，等价于完整二维 DP。

**终止性。** 两层循环范围有限，每个状态只计算一次。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 设原始长度为 ``m``、``n``，时间复杂度 ``O(mn)``；
* 一行布尔数组长度为短串长度加一，额外空间 ``O(min(m,n))``；
* 输入由 ASCII 小写字母组成，字节、UTF-16 代码单元和题目字符位置等价；
* 输入字符串只读；交换的只是局部引用或局部字节容器；
* C 的布尔返回接口无法区分合法 ``false`` 与极端内存分配失败，代码在失败时返回 ``false``；
* Rust 转换为字节向量后交换所有权，不进行 Unicode 字符切分；
* Julia 和 R 把零基 DP 坐标映射到一基数组槽位。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   bool isInterleave(char *s1, char *s2, char *s3) {
       size_t rows = strlen(s1);
       size_t columns = strlen(s2);
       if (rows + columns != strlen(s3)) {
           return false;
       }

       if (columns > rows) {
           char *temp_string = s1;
           s1 = s2;
           s2 = temp_string;

           size_t temp_length = rows;
           rows = columns;
           columns = temp_length;
       }

       bool *dp = calloc(columns + 1, sizeof(*dp));
       if (dp == NULL) {
           return false;
       }

       dp[0] = true;
       for (size_t column = 1; column <= columns; ++column) {
           dp[column] =
               dp[column - 1] && s2[column - 1] == s3[column - 1];
       }

       for (size_t row = 1; row <= rows; ++row) {
           dp[0] = dp[0] && s1[row - 1] == s3[row - 1];
           for (size_t column = 1; column <= columns; ++column) {
               const char target = s3[row + column - 1];
               dp[column] =
                   (dp[column] && s1[row - 1] == target) ||
                   (dp[column - 1] && s2[column - 1] == target);
           }
       }

       const bool result = dp[columns];
       free(dp);
       return result;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
   public:
       bool isInterleave(std::string s1, std::string s2, std::string s3) {
           if (s1.size() + s2.size() != s3.size()) {
               return false;
           }
           if (s2.size() > s1.size()) {
               std::swap(s1, s2);
           }

           std::vector<bool> dp(s2.size() + 1, false);
           dp[0] = true;
           for (std::size_t column = 1; column <= s2.size(); ++column) {
               dp[column] =
                   dp[column - 1] && s2[column - 1] == s3[column - 1];
           }

           for (std::size_t row = 1; row <= s1.size(); ++row) {
               dp[0] = dp[0] && s1[row - 1] == s3[row - 1];
               for (std::size_t column = 1; column <= s2.size(); ++column) {
                   const char target = s3[row + column - 1];
                   dp[column] =
                       (dp[column] && s1[row - 1] == target) ||
                       (dp[column - 1] && s2[column - 1] == target);
               }
           }
           return dp[s2.size()];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
           if len(s1) + len(s2) != len(s3):
               return False
           if len(s2) > len(s1):
               s1, s2 = s2, s1

           dp = [False] * (len(s2) + 1)
           dp[0] = True
           for column in range(1, len(s2) + 1):
               dp[column] = (
                   dp[column - 1] and s2[column - 1] == s3[column - 1]
               )

           for row in range(1, len(s1) + 1):
               dp[0] = dp[0] and s1[row - 1] == s3[row - 1]
               for column in range(1, len(s2) + 1):
                   target = s3[row + column - 1]
                   dp[column] = (
                       dp[column] and s1[row - 1] == target
                   ) or (
                       dp[column - 1] and s2[column - 1] == target
                   )
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isInterleave(String s1, String s2, String s3) {
           if (s1.length() + s2.length() != s3.length()) {
               return false;
           }
           if (s2.length() > s1.length()) {
               String temporary = s1;
               s1 = s2;
               s2 = temporary;
           }

           boolean[] dp = new boolean[s2.length() + 1];
           dp[0] = true;
           for (int column = 1; column <= s2.length(); ++column) {
               dp[column] =
                   dp[column - 1] &&
                   s2.charAt(column - 1) == s3.charAt(column - 1);
           }

           for (int row = 1; row <= s1.length(); ++row) {
               dp[0] = dp[0] && s1.charAt(row - 1) == s3.charAt(row - 1);
               for (int column = 1; column <= s2.length(); ++column) {
                   char target = s3.charAt(row + column - 1);
                   dp[column] =
                       (dp[column] && s1.charAt(row - 1) == target) ||
                       (dp[column - 1] && s2.charAt(column - 1) == target);
               }
           }
           return dp[s2.length()];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_interleave(s1: String, s2: String, s3: String) -> bool {
           let (mut first, mut second) = (s1.into_bytes(), s2.into_bytes());
           let target = s3.into_bytes();
           if first.len() + second.len() != target.len() {
               return false;
           }
           if second.len() > first.len() {
               std::mem::swap(&mut first, &mut second);
           }

           let mut dp = vec![false; second.len() + 1];
           dp[0] = true;
           for column in 1..=second.len() {
               dp[column] =
                   dp[column - 1] && second[column - 1] == target[column - 1];
           }

           for row in 1..=first.len() {
               dp[0] = dp[0] && first[row - 1] == target[row - 1];
               for column in 1..=second.len() {
                   let current = target[row + column - 1];
                   dp[column] =
                       (dp[column] && first[row - 1] == current) ||
                       (dp[column - 1] && second[column - 1] == current);
               }
           }
           dp[second.len()]
       }
   }

Go
~~

.. code-block:: go

   func isInterleave(s1 string, s2 string, s3 string) bool {
       if len(s1)+len(s2) != len(s3) {
           return false
       }
       if len(s2) > len(s1) {
           s1, s2 = s2, s1
       }

       dp := make([]bool, len(s2)+1)
       dp[0] = true
       for column := 1; column <= len(s2); column++ {
           dp[column] = dp[column-1] && s2[column-1] == s3[column-1]
       }

       for row := 1; row <= len(s1); row++ {
           dp[0] = dp[0] && s1[row-1] == s3[row-1]
           for column := 1; column <= len(s2); column++ {
               target := s3[row+column-1]
               dp[column] =
                   (dp[column] && s1[row-1] == target) ||
                       (dp[column-1] && s2[column-1] == target)
           }
       }
       return dp[len(s2)]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isInterleave(s1: string, s2: string, s3: string): boolean {
       if (s1.length + s2.length !== s3.length) {
           return false;
       }
       if (s2.length > s1.length) {
           [s1, s2] = [s2, s1];
       }

       const dp = new Array<boolean>(s2.length + 1).fill(false);
       dp[0] = true;
       for (let column = 1; column <= s2.length; column += 1) {
           dp[column] =
               dp[column - 1] && s2[column - 1] === s3[column - 1];
       }

       for (let row = 1; row <= s1.length; row += 1) {
           dp[0] = dp[0] && s1[row - 1] === s3[row - 1];
           for (let column = 1; column <= s2.length; column += 1) {
               const target = s3[row + column - 1];
               dp[column] =
                   (dp[column] && s1[row - 1] === target) ||
                   (dp[column - 1] && s2[column - 1] === target);
           }
       }
       return dp[s2.length];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsInterleave(string s1, string s2, string s3) {
           if (s1.Length + s2.Length != s3.Length) {
               return false;
           }
           if (s2.Length > s1.Length) {
               string temporary = s1;
               s1 = s2;
               s2 = temporary;
           }

           bool[] dp = new bool[s2.Length + 1];
           dp[0] = true;
           for (int column = 1; column <= s2.Length; ++column) {
               dp[column] =
                   dp[column - 1] && s2[column - 1] == s3[column - 1];
           }

           for (int row = 1; row <= s1.Length; ++row) {
               dp[0] = dp[0] && s1[row - 1] == s3[row - 1];
               for (int column = 1; column <= s2.Length; ++column) {
                   char target = s3[row + column - 1];
                   dp[column] =
                       (dp[column] && s1[row - 1] == target) ||
                       (dp[column - 1] && s2[column - 1] == target);
               }
           }
           return dp[s2.Length];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_interleave(s1::String, s2::String, s3::String)::Bool
       first = collect(codeunits(s1))
       second = collect(codeunits(s2))
       target = codeunits(s3)
       length(first) + length(second) == length(target) || return false

       if length(second) > length(first)
           first, second = second, first
       end

       dp = falses(length(second) + 1)
       dp[1] = true
       for column in 1:length(second)
           dp[column + 1] =
               dp[column] && second[column] == target[column]
       end

       for row in 1:length(first)
           dp[1] = dp[1] && first[row] == target[row]
           for column in 1:length(second)
               current = target[row + column]
               dp[column + 1] =
                   (dp[column + 1] && first[row] == current) ||
                   (dp[column] && second[column] == current)
           end
       end
       return dp[end]
   end

R
~

.. code-block:: r

   is_interleave <- function(s1, s2, s3) {
     first <- utf8ToInt(s1)
     second <- utf8ToInt(s2)
     target <- utf8ToInt(s3)
     if (length(first) + length(second) != length(target)) {
       return(FALSE)
     }
     if (length(second) > length(first)) {
       temporary <- first
       first <- second
       second <- temporary
     }

     dp <- rep(FALSE, length(second) + 1L)
     dp[1L] <- TRUE
     if (length(second) > 0L) {
       for (column in seq_along(second)) {
         dp[column + 1L] <-
           dp[column] && second[column] == target[column]
       }
     }

     if (length(first) > 0L) {
       for (row in seq_along(first)) {
         dp[1L] <- dp[1L] && first[row] == target[row]
         if (length(second) > 0L) {
           for (column in seq_along(second)) {
             current <- target[row + column]
             dp[column + 1L] <-
               (dp[column + 1L] && first[row] == current) ||
               (dp[column] && second[column] == current)
           }
         }
       }
     }
     dp[length(dp)]
   }

验证计划与证据
--------------

* 固定用例覆盖两个经典示例、两个空串、单字符双来源和长度不匹配；
* Python 执行 50000 组长度 ``0..8``、字母表 ``a,b`` 的随机测试，与独立记忆化递归对拍；
* C、C++、Java、Go、TypeScript 各执行 20000 组随机测试，与完整二维 DP 对拍；
* C、C++ 使用严格警告、ASan 和 UBSan；
* 额外检查交换长短字符串后结果不变。

Rust、C#、Julia 和 R 在当前环境完成字节语义、更新方向、索引和容器边界的静态检查。

易错点
------

* 未先检查总长度会在目标下标处越界或错误接受未使用全部字符的情况；
* 一行 DP 从右向左更新会读取上一行左邻居；
* 目标下标必须是 ``row + column - 1``，不是任一来源字符串自己的下标；
* 初始化第一行或第一列时忘记继承前一状态，会错误接受中间不匹配的前缀；
* 把字符频次相同当作充分条件，无法保证两个来源内部顺序。

本题新增知识
------------

* 双字符串前缀消费状态；
* 一行 DP 中“旧同列、当前左邻”的覆盖语义；
* 通过交换来源字符串实现 ``O(min(m,n))`` 空间。

本题强化知识
------------

* `0072. Edit Distance <0072-edit-distance.rst>`_ 的一行字符串 DP；
* ASCII 字符域的跨语言索引等价；
* 动态规划遍历方向由依赖关系决定。

关联题目
--------

* `0072. Edit Distance <0072-edit-distance.rst>`_：二维字符串前缀状态与一行压缩；
* `0091. Decode Ways <0091-decode-ways.rst>`_：字符串计数 DP 和滚动状态。

最小自检
--------

#. 为什么状态只需要 ``i`` 和 ``j``，不需要单独保存 ``s3`` 下标？
#. 一行 DP 中更新前后的 ``dp[column]`` 分别表示什么？
#. 为什么更新顺序必须从左到右？
#. 交换 ``s1``、``s2`` 为什么不改变答案？

答案要点
~~~~~~~~

#. 已消费目标字符数恒等于 ``i+j``。
#. 更新前是上一行同列，更新后是当前行同列。
#. 当前状态依赖已经更新的当前行左邻居，同时需要尚未覆盖的上一行同列。
#. 两个来源的角色完全对称，只要求各自内部顺序不变。
