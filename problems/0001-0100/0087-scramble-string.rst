0087. Scramble String
=====================

题目信息
--------

:题号: 0087
:难度: Hard
:主题: 字符串、区间动态规划、记忆化搜索、频次剪枝
:原题: `LeetCode 0087 <https://leetcode.com/problems/scramble-string/>`_
:访问状态: Available
:教学重点: 三维区间状态、交换与不交换转移、字符多重集剪枝、状态缓存

题目重述
--------

给定两个等长、非空且只包含小写英文字母的字符串 ``s1`` 与 ``s2``。允许递归地把一个字符串切成
两个非空部分，并选择保持左右顺序或交换两部分，再对子串继续执行相同操作。判断 ``s2`` 能否由
``s1`` 通过这些操作得到。

题目保证 ``1 <= len(s1) == len(s2) <= 30``，字符域为 ``'a'`` 至 ``'z'``。字符串只读，比较单位是
ASCII 字节；该字符域中，字节、Unicode 码点和题目字符一一对应。

自建示例
--------

.. code-block:: text

   输入：s1 = "great", s2 = "rgeat"
   输出：true

可以先把 ``great`` 切成 ``gr | eat``，再把 ``gr`` 的两个字符交换为 ``rg``。

不可行示例
~~~~~~~~~~

.. code-block:: text

   输入：s1 = "abcde", s2 = "caebd"
   输出：false

两个字符串虽然字符多重集相同，仍不存在一棵合法切分树把全部对应区间同时匹配起来。

问题抽象
--------

只需判断两个等长区间是否互为 scramble。定义状态：

.. code-block:: text

   solve(i, j, length)

它表示 ``s1[i:i+length]`` 能否变成 ``s2[j:j+length]``。若在 ``split`` 处分割，只有两种合法对应：

* 不交换：左区间对应左区间，右区间对应右区间；
* 交换：``s1`` 左区间对应 ``s2`` 右区间，``s1`` 右区间对应 ``s2`` 左区间。

同一三元状态会从多个上层切分重复到达，因此需要记忆化。进入枚举前先比较两个区间的 26 字母频次；
频次不同必然不可行，可以立即剪枝。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 记忆化区间搜索与前缀频次
     - ``O(n^4)``
     - ``O(n^3)``
     - 主解法；状态、两类切分和剪枝直接对应定义
   * - 自底向上四维语义 DP
     - ``O(n^4)``
     - ``O(n^3)``
     - 同一转移，遍历顺序更机械
   * - 裸递归
     - 指数级
     - ``O(n)`` 递归栈
     - 重复计算相同区间状态，不可接受

主解法：记忆化区间搜索
----------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归入口 ``solve(i, j, length)`` 维护：

* 两个待比较区间长度相同且都在字符串范围内；
* 缓存键只由 ``i``、``j`` 和 ``length`` 决定；
* 返回值等价于这两个区间之间是否存在一棵合法 scramble 切分树；
* 子调用长度严格小于父状态，因此递归最终到达直接相等区间或长度 1 状态。

缓存使用三值语义：未知、不可行、可行。合法的 ``false`` 必须与“尚未计算”区分，否则失败状态会被
反复搜索。

字符频次剪枝为何安全
~~~~~~~~~~~~~~~~~~~~

任意一次切分和交换只改变字符位置，不改变区间内字符多重集。若两个状态区间的任一字母数量不同，
它们不可能互为 scramble。

前缀频次数组令任意区间的 26 个计数在 ``O(26)`` 时间得到。26 是固定常数，因此每个状态的剪枝成本
按 ``O(1)`` 计入。频次相同只是必要条件，不是充分条件；仍需枚举切分。

两类切分为何完整
~~~~~~~~~~~~~~~~

任意非叶子 scramble 结点都会选择某个 ``1 <= split < length``，并且根结点只有两种排列方式：

.. code-block:: text

   without swap:
   s1[i : i+split]                 <-> s2[j : j+split]
   s1[i+split : i+length]          <-> s2[j+split : j+length]

   with swap:
   s1[i : i+split]                 <-> s2[j+length-split : j+length]
   s1[i+split : i+length]          <-> s2[j : j+length-split]

算法对每个切分点检查这两种情况，因此覆盖定义允许的全部根结点选择。只要任一情况的两个子状态都为
真，当前状态就为真。

直接相等检查
~~~~~~~~~~~~

若两个区间逐字符完全相同，可以直接返回真，不必继续构造无意义切分。该判断不会漏掉答案，因为
“保持原字符串”本身就是合法结果；它只是提前提交已经确定的真状态。

正确性依据
~~~~~~~~~~

**合法性。** 算法返回真时，要么两个区间直接相等，要么存在某个切分点，使不交换或交换方案的两个
子状态都为真。按归纳假设，两个子状态各自对应合法切分树，把它们接到当前根结点即可得到合法结果。

**完整性。** 对任意合法 scramble 树，若根是叶子，则区间直接相等。否则根有一个切分点，并选择交换
或不交换。算法会枚举该切分点和对应模式；两个子树按归纳假设都会被识别，因此当前状态会返回真。

**剪枝安全。** 合法操作保持字符多重集，频次不同的状态不可能存在合法切分树。

**终止性。** 每个递归分支把正长度区间拆成两个更短非空区间。状态总数有限，且每个状态最多完整计算
一次，因此搜索必然终止。

复杂度与容量
~~~~~~~~~~~~

设字符串长度为 ``n``：

* 起点组合与区间长度构成 ``O(n^3)`` 个合法状态；
* 每个状态最多枚举 ``length - 1 = O(n)`` 个切分点；
* 区间频次检查固定扫描 26 个字母；
* 最坏时间复杂度为 ``O(n^4)``；
* 缓存与两组前缀频次数组占 ``O(n^3)`` 空间；
* 递归深度最多为 ``n``；
* ``n <= 30`` 时状态槽位不超过 ``30 × 30 × 31 = 27900``。

C 使用约束上界构造固定容量缓存，避免把内存分配失败混入合法的 ``false`` 返回值。其他语言使用动态
容器，容量仍由 ``n^3`` 上界约束。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <string.h>

   #define MAX_LENGTH 30
   #define ALPHABET_SIZE 26

   typedef struct {
       const unsigned char *first;
       const unsigned char *second;
       int length;
       int prefix_first[MAX_LENGTH + 1][ALPHABET_SIZE];
       int prefix_second[MAX_LENGTH + 1][ALPHABET_SIZE];
       signed char memo[MAX_LENGTH][MAX_LENGTH][MAX_LENGTH + 1];
   } ScrambleContext;

   static bool same_interval(
       const ScrambleContext *context,
       int first_start,
       int second_start,
       int length
   ) {
       for (int offset = 0; offset < length; ++offset) {
           if (context->first[first_start + offset] !=
               context->second[second_start + offset]) {
               return false;
           }
       }
       return true;
   }

   static bool same_counts(
       const ScrambleContext *context,
       int first_start,
       int second_start,
       int length
   ) {
       for (int letter = 0; letter < ALPHABET_SIZE; ++letter) {
           const int first_count =
               context->prefix_first[first_start + length][letter] -
               context->prefix_first[first_start][letter];
           const int second_count =
               context->prefix_second[second_start + length][letter] -
               context->prefix_second[second_start][letter];
           if (first_count != second_count) {
               return false;
           }
       }
       return true;
   }

   static bool solve_state(
       ScrambleContext *context,
       int first_start,
       int second_start,
       int length
   ) {
       signed char *cached =
           &context->memo[first_start][second_start][length];
       if (*cached != -1) {
           return *cached == 1;
       }

       if (same_interval(context, first_start, second_start, length)) {
           *cached = 1;
           return true;
       }
       if (!same_counts(context, first_start, second_start, length)) {
           *cached = 0;
           return false;
       }

       for (int split = 1; split < length; ++split) {
           const bool without_swap =
               solve_state(
                   context,
                   first_start,
                   second_start,
                   split
               ) &&
               solve_state(
                   context,
                   first_start + split,
                   second_start + split,
                   length - split
               );
           if (without_swap) {
               *cached = 1;
               return true;
           }

           const bool with_swap =
               solve_state(
                   context,
                   first_start,
                   second_start + length - split,
                   split
               ) &&
               solve_state(
                   context,
                   first_start + split,
                   second_start,
                   length - split
               );
           if (with_swap) {
               *cached = 1;
               return true;
           }
       }

       *cached = 0;
       return false;
   }

   bool isScramble(char *s1, char *s2) {
       const int length = (int)strlen(s1);
       if (length != (int)strlen(s2) || length == 0 ||
           length > MAX_LENGTH) {
           return false;
       }

       ScrambleContext context = {
           (const unsigned char *)s1,
           (const unsigned char *)s2,
           length,
           {{0}},
           {{0}},
           {{{0}}}
       };

       for (int first = 0; first < MAX_LENGTH; ++first) {
           for (int second = 0; second < MAX_LENGTH; ++second) {
               for (int part = 0; part <= MAX_LENGTH; ++part) {
                   context.memo[first][second][part] = -1;
               }
           }
       }

       for (int index = 0; index < length; ++index) {
           memcpy(
               context.prefix_first[index + 1],
               context.prefix_first[index],
               sizeof(context.prefix_first[index])
           );
           memcpy(
               context.prefix_second[index + 1],
               context.prefix_second[index],
               sizeof(context.prefix_second[index])
           );
           ++context.prefix_first[index + 1][context.first[index] - 'a'];
           ++context.prefix_second[index + 1][context.second[index] - 'a'];
       }

       return solve_state(&context, 0, 0, length);
   }

C++
~~~

.. code-block:: cpp

   #include <array>
   #include <cstdint>
   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
       std::string first_;
       std::string second_;
       std::vector<std::array<int, 26>> prefix_first_;
       std::vector<std::array<int, 26>> prefix_second_;
       std::vector<std::vector<std::vector<std::int8_t>>> memo_;

       bool same_interval(int first_start, int second_start, int length) {
           for (int offset = 0; offset < length; ++offset) {
               if (first_[first_start + offset] !=
                   second_[second_start + offset]) {
                   return false;
               }
           }
           return true;
       }

       bool same_counts(int first_start, int second_start, int length) {
           for (int letter = 0; letter < 26; ++letter) {
               const int first_count =
                   prefix_first_[first_start + length][letter] -
                   prefix_first_[first_start][letter];
               const int second_count =
                   prefix_second_[second_start + length][letter] -
                   prefix_second_[second_start][letter];
               if (first_count != second_count) {
                   return false;
               }
           }
           return true;
       }

       bool solve(int first_start, int second_start, int length) {
           std::int8_t& cached = memo_[first_start][second_start][length];
           if (cached != -1) {
               return cached == 1;
           }

           if (same_interval(first_start, second_start, length)) {
               cached = 1;
               return true;
           }
           if (!same_counts(first_start, second_start, length)) {
               cached = 0;
               return false;
           }

           for (int split = 1; split < length; ++split) {
               const bool without_swap =
                   solve(first_start, second_start, split) &&
                   solve(
                       first_start + split,
                       second_start + split,
                       length - split
                   );
               if (without_swap) {
                   cached = 1;
                   return true;
               }

               const bool with_swap =
                   solve(
                       first_start,
                       second_start + length - split,
                       split
                   ) &&
                   solve(
                       first_start + split,
                       second_start,
                       length - split
                   );
               if (with_swap) {
                   cached = 1;
                   return true;
               }
           }

           cached = 0;
           return false;
       }

   public:
       bool isScramble(std::string s1, std::string s2) {
           if (s1.size() != s2.size() || s1.empty()) {
               return false;
           }

           first_ = std::move(s1);
           second_ = std::move(s2);
           const int length = static_cast<int>(first_.size());
           prefix_first_.assign(length + 1, {});
           prefix_second_.assign(length + 1, {});
           memo_.assign(
               length,
               std::vector<std::vector<std::int8_t>>(
                   length,
                   std::vector<std::int8_t>(length + 1, -1)
               )
           );

           for (int index = 0; index < length; ++index) {
               prefix_first_[index + 1] = prefix_first_[index];
               prefix_second_[index + 1] = prefix_second_[index];
               ++prefix_first_[index + 1][first_[index] - 'a'];
               ++prefix_second_[index + 1][second_[index] - 'a'];
           }

           return solve(0, 0, length);
       }
   };

Python
~~~~~~

.. code-block:: python

   from functools import cache


   class Solution:
       def isScramble(self, s1: str, s2: str) -> bool:
           if len(s1) != len(s2) or not s1:
               return False

           length = len(s1)
           prefix1 = [[0] * 26 for _ in range(length + 1)]
           prefix2 = [[0] * 26 for _ in range(length + 1)]

           for index, (first, second) in enumerate(zip(s1, s2)):
               prefix1[index + 1] = prefix1[index].copy()
               prefix2[index + 1] = prefix2[index].copy()
               prefix1[index + 1][ord(first) - ord("a")] += 1
               prefix2[index + 1][ord(second) - ord("a")] += 1

           def same_interval(i: int, j: int, part_length: int) -> bool:
               return all(
                   s1[i + offset] == s2[j + offset]
                   for offset in range(part_length)
               )

           def same_counts(i: int, j: int, part_length: int) -> bool:
               return all(
                   prefix1[i + part_length][letter] - prefix1[i][letter]
                   == prefix2[j + part_length][letter] - prefix2[j][letter]
                   for letter in range(26)
               )

           @cache
           def solve(i: int, j: int, part_length: int) -> bool:
               if same_interval(i, j, part_length):
                   return True
               if not same_counts(i, j, part_length):
                   return False

               for split in range(1, part_length):
                   without_swap = (
                       solve(i, j, split)
                       and solve(
                           i + split,
                           j + split,
                           part_length - split,
                       )
                   )
                   if without_swap:
                       return True

                   with_swap = (
                       solve(
                           i,
                           j + part_length - split,
                           split,
                       )
                       and solve(
                           i + split,
                           j,
                           part_length - split,
                       )
                   )
                   if with_swap:
                       return True

               return False

           return solve(0, 0, length)

Java
~~~~

.. code-block:: java

   class Solution {
       private String first;
       private String second;
       private int[][] prefixFirst;
       private int[][] prefixSecond;
       private byte[][][] memo;

       public boolean isScramble(String s1, String s2) {
           if (s1.length() != s2.length() || s1.isEmpty()) {
               return false;
           }

           first = s1;
           second = s2;
           int length = s1.length();
           prefixFirst = new int[length + 1][26];
           prefixSecond = new int[length + 1][26];
           memo = new byte[length][length][length + 1];

           for (int index = 0; index < length; ++index) {
               System.arraycopy(
                   prefixFirst[index],
                   0,
                   prefixFirst[index + 1],
                   0,
                   26
               );
               System.arraycopy(
                   prefixSecond[index],
                   0,
                   prefixSecond[index + 1],
                   0,
                   26
               );
               ++prefixFirst[index + 1][first.charAt(index) - 'a'];
               ++prefixSecond[index + 1][second.charAt(index) - 'a'];
           }

           return solve(0, 0, length);
       }

       private boolean sameInterval(
           int firstStart,
           int secondStart,
           int length
       ) {
           for (int offset = 0; offset < length; ++offset) {
               if (first.charAt(firstStart + offset) !=
                   second.charAt(secondStart + offset)) {
                   return false;
               }
           }
           return true;
       }

       private boolean sameCounts(
           int firstStart,
           int secondStart,
           int length
       ) {
           for (int letter = 0; letter < 26; ++letter) {
               int firstCount =
                   prefixFirst[firstStart + length][letter] -
                   prefixFirst[firstStart][letter];
               int secondCount =
                   prefixSecond[secondStart + length][letter] -
                   prefixSecond[secondStart][letter];
               if (firstCount != secondCount) {
                   return false;
               }
           }
           return true;
       }

       private boolean solve(int firstStart, int secondStart, int length) {
           byte cached = memo[firstStart][secondStart][length];
           if (cached != 0) {
               return cached == 1;
           }

           if (sameInterval(firstStart, secondStart, length)) {
               memo[firstStart][secondStart][length] = 1;
               return true;
           }
           if (!sameCounts(firstStart, secondStart, length)) {
               memo[firstStart][secondStart][length] = -1;
               return false;
           }

           for (int split = 1; split < length; ++split) {
               boolean withoutSwap =
                   solve(firstStart, secondStart, split) &&
                   solve(
                       firstStart + split,
                       secondStart + split,
                       length - split
                   );
               if (withoutSwap) {
                   memo[firstStart][secondStart][length] = 1;
                   return true;
               }

               boolean withSwap =
                   solve(
                       firstStart,
                       secondStart + length - split,
                       split
                   ) &&
                   solve(
                       firstStart + split,
                       secondStart,
                       length - split
                   );
               if (withSwap) {
                   memo[firstStart][secondStart][length] = 1;
                   return true;
               }
           }

           memo[firstStart][secondStart][length] = -1;
           return false;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_scramble(s1: String, s2: String) -> bool {
           if s1.len() != s2.len() || s1.is_empty() {
               return false;
           }

           let first = s1.as_bytes();
           let second = s2.as_bytes();
           let length = first.len();
           let mut prefix_first = vec![[0i32; 26]; length + 1];
           let mut prefix_second = vec![[0i32; 26]; length + 1];

           for index in 0..length {
               prefix_first[index + 1] = prefix_first[index];
               prefix_second[index + 1] = prefix_second[index];
               prefix_first[index + 1][(first[index] - b'a') as usize] += 1;
               prefix_second[index + 1][(second[index] - b'a') as usize] += 1;
           }

           fn same_interval(
               first: &[u8],
               second: &[u8],
               first_start: usize,
               second_start: usize,
               length: usize,
           ) -> bool {
               (0..length).all(|offset| {
                   first[first_start + offset] == second[second_start + offset]
               })
           }

           fn same_counts(
               prefix_first: &[[i32; 26]],
               prefix_second: &[[i32; 26]],
               first_start: usize,
               second_start: usize,
               length: usize,
           ) -> bool {
               (0..26).all(|letter| {
                   prefix_first[first_start + length][letter]
                       - prefix_first[first_start][letter]
                       == prefix_second[second_start + length][letter]
                           - prefix_second[second_start][letter]
               })
           }

           fn solve(
               first: &[u8],
               second: &[u8],
               prefix_first: &[[i32; 26]],
               prefix_second: &[[i32; 26]],
               memo: &mut [i8],
               total_length: usize,
               first_start: usize,
               second_start: usize,
               length: usize,
           ) -> bool {
               let memo_index =
                   ((first_start * total_length + second_start)
                       * (total_length + 1))
                       + length;
               if memo[memo_index] != 0 {
                   return memo[memo_index] == 1;
               }

               if same_interval(
                   first,
                   second,
                   first_start,
                   second_start,
                   length,
               ) {
                   memo[memo_index] = 1;
                   return true;
               }
               if !same_counts(
                   prefix_first,
                   prefix_second,
                   first_start,
                   second_start,
                   length,
               ) {
                   memo[memo_index] = -1;
                   return false;
               }

               for split in 1..length {
                   let without_swap =
                       solve(
                           first,
                           second,
                           prefix_first,
                           prefix_second,
                           memo,
                           total_length,
                           first_start,
                           second_start,
                           split,
                       ) && solve(
                           first,
                           second,
                           prefix_first,
                           prefix_second,
                           memo,
                           total_length,
                           first_start + split,
                           second_start + split,
                           length - split,
                       );
                   if without_swap {
                       memo[memo_index] = 1;
                       return true;
                   }

                   let with_swap =
                       solve(
                           first,
                           second,
                           prefix_first,
                           prefix_second,
                           memo,
                           total_length,
                           first_start,
                           second_start + length - split,
                           split,
                       ) && solve(
                           first,
                           second,
                           prefix_first,
                           prefix_second,
                           memo,
                           total_length,
                           first_start + split,
                           second_start,
                           length - split,
                       );
                   if with_swap {
                       memo[memo_index] = 1;
                       return true;
                   }
               }

               memo[memo_index] = -1;
               false
           }

           let mut memo = vec![0i8; length * length * (length + 1)];
           solve(
               first,
               second,
               &prefix_first,
               &prefix_second,
               &mut memo,
               length,
               0,
               0,
               length,
           )
       }
   }

Go
~~

.. code-block:: go

   func isScramble(s1 string, s2 string) bool {
   	if len(s1) != len(s2) || len(s1) == 0 {
   		return false
   	}

   	length := len(s1)
   	prefix1 := make([][26]int, length+1)
   	prefix2 := make([][26]int, length+1)
   	for index := 0; index < length; index++ {
   		prefix1[index+1] = prefix1[index]
   		prefix2[index+1] = prefix2[index]
   		prefix1[index+1][s1[index]-'a']++
   		prefix2[index+1][s2[index]-'a']++
   	}

   	sameInterval := func(i int, j int, partLength int) bool {
   		for offset := 0; offset < partLength; offset++ {
   			if s1[i+offset] != s2[j+offset] {
   				return false
   			}
   		}
   		return true
   	}

   	sameCounts := func(i int, j int, partLength int) bool {
   		for letter := 0; letter < 26; letter++ {
   			firstCount := prefix1[i+partLength][letter] -
   				prefix1[i][letter]
   			secondCount := prefix2[j+partLength][letter] -
   				prefix2[j][letter]
   			if firstCount != secondCount {
   				return false
   			}
   		}
   		return true
   	}

   	memo := make([]int8, length*length*(length+1))
   	var solve func(int, int, int) bool
   	solve = func(i int, j int, partLength int) bool {
   		memoIndex := ((i*length+j)*(length+1) + partLength)
   		if memo[memoIndex] != 0 {
   			return memo[memoIndex] == 1
   		}

   		if sameInterval(i, j, partLength) {
   			memo[memoIndex] = 1
   			return true
   		}
   		if !sameCounts(i, j, partLength) {
   			memo[memoIndex] = -1
   			return false
   		}

   		for split := 1; split < partLength; split++ {
   			withoutSwap := solve(i, j, split) &&
   				solve(i+split, j+split, partLength-split)
   			if withoutSwap {
   				memo[memoIndex] = 1
   				return true
   			}

   			withSwap := solve(
   				i,
   				j+partLength-split,
   				split,
   			) && solve(
   				i+split,
   				j,
   				partLength-split,
   			)
   			if withSwap {
   				memo[memoIndex] = 1
   				return true
   			}
   		}

   		memo[memoIndex] = -1
   		return false
   	}

   	return solve(0, 0, length)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isScramble(s1: string, s2: string): boolean {
       if (s1.length !== s2.length || s1.length === 0) {
           return false;
       }

       const length = s1.length;
       const prefix1: Int16Array[] = Array.from(
           { length: length + 1 },
           () => new Int16Array(26),
       );
       const prefix2: Int16Array[] = Array.from(
           { length: length + 1 },
           () => new Int16Array(26),
       );

       for (let index = 0; index < length; index += 1) {
           prefix1[index + 1].set(prefix1[index]);
           prefix2[index + 1].set(prefix2[index]);
           prefix1[index + 1][s1.charCodeAt(index) - 97] += 1;
           prefix2[index + 1][s2.charCodeAt(index) - 97] += 1;
       }

       const sameInterval = (
           firstStart: number,
           secondStart: number,
           partLength: number,
       ): boolean => {
           for (let offset = 0; offset < partLength; offset += 1) {
               if (s1[firstStart + offset] !== s2[secondStart + offset]) {
                   return false;
               }
           }
           return true;
       };

       const sameCounts = (
           firstStart: number,
           secondStart: number,
           partLength: number,
       ): boolean => {
           for (let letter = 0; letter < 26; letter += 1) {
               const firstCount =
                   prefix1[firstStart + partLength][letter]
                   - prefix1[firstStart][letter];
               const secondCount =
                   prefix2[secondStart + partLength][letter]
                   - prefix2[secondStart][letter];
               if (firstCount !== secondCount) {
                   return false;
               }
           }
           return true;
       };

       const memo = new Int8Array(length * length * (length + 1));
       const solve = (
           firstStart: number,
           secondStart: number,
           partLength: number,
       ): boolean => {
           const memoIndex = (
               (firstStart * length + secondStart) * (length + 1)
               + partLength
           );
           if (memo[memoIndex] !== 0) {
               return memo[memoIndex] === 1;
           }

           if (sameInterval(firstStart, secondStart, partLength)) {
               memo[memoIndex] = 1;
               return true;
           }
           if (!sameCounts(firstStart, secondStart, partLength)) {
               memo[memoIndex] = -1;
               return false;
           }

           for (let split = 1; split < partLength; split += 1) {
               const withoutSwap = (
                   solve(firstStart, secondStart, split)
                   && solve(
                       firstStart + split,
                       secondStart + split,
                       partLength - split,
                   )
               );
               if (withoutSwap) {
                   memo[memoIndex] = 1;
                   return true;
               }

               const withSwap = (
                   solve(
                       firstStart,
                       secondStart + partLength - split,
                       split,
                   )
                   && solve(
                       firstStart + split,
                       secondStart,
                       partLength - split,
                   )
               );
               if (withSwap) {
                   memo[memoIndex] = 1;
                   return true;
               }
           }

           memo[memoIndex] = -1;
           return false;
       };

       return solve(0, 0, length);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private string first = string.Empty;
       private string second = string.Empty;
       private int[,] prefixFirst = new int[0, 0];
       private int[,] prefixSecond = new int[0, 0];
       private sbyte[] memo = new sbyte[0];
       private int totalLength;

       public bool IsScramble(string s1, string s2) {
           if (s1.Length != s2.Length || s1.Length == 0) {
               return false;
           }

           first = s1;
           second = s2;
           totalLength = s1.Length;
           prefixFirst = new int[totalLength + 1, 26];
           prefixSecond = new int[totalLength + 1, 26];
           memo = new sbyte[
               totalLength * totalLength * (totalLength + 1)
           ];

           for (int index = 0; index < totalLength; ++index) {
               for (int letter = 0; letter < 26; ++letter) {
                   prefixFirst[index + 1, letter] =
                       prefixFirst[index, letter];
                   prefixSecond[index + 1, letter] =
                       prefixSecond[index, letter];
               }
               ++prefixFirst[index + 1, first[index] - 'a'];
               ++prefixSecond[index + 1, second[index] - 'a'];
           }

           return Solve(0, 0, totalLength);
       }

       private bool SameInterval(
           int firstStart,
           int secondStart,
           int length
       ) {
           for (int offset = 0; offset < length; ++offset) {
               if (first[firstStart + offset] != second[secondStart + offset]) {
                   return false;
               }
           }
           return true;
       }

       private bool SameCounts(
           int firstStart,
           int secondStart,
           int length
       ) {
           for (int letter = 0; letter < 26; ++letter) {
               int firstCount =
                   prefixFirst[firstStart + length, letter]
                   - prefixFirst[firstStart, letter];
               int secondCount =
                   prefixSecond[secondStart + length, letter]
                   - prefixSecond[secondStart, letter];
               if (firstCount != secondCount) {
                   return false;
               }
           }
           return true;
       }

       private bool Solve(int firstStart, int secondStart, int length) {
           int memoIndex = (
               (firstStart * totalLength + secondStart)
               * (totalLength + 1)
               + length
           );
           if (memo[memoIndex] != 0) {
               return memo[memoIndex] == 1;
           }

           if (SameInterval(firstStart, secondStart, length)) {
               memo[memoIndex] = 1;
               return true;
           }
           if (!SameCounts(firstStart, secondStart, length)) {
               memo[memoIndex] = -1;
               return false;
           }

           for (int split = 1; split < length; ++split) {
               bool withoutSwap =
                   Solve(firstStart, secondStart, split) &&
                   Solve(
                       firstStart + split,
                       secondStart + split,
                       length - split
                   );
               if (withoutSwap) {
                   memo[memoIndex] = 1;
                   return true;
               }

               bool withSwap =
                   Solve(
                       firstStart,
                       secondStart + length - split,
                       split
                   ) &&
                   Solve(
                       firstStart + split,
                       secondStart,
                       length - split
                   );
               if (withSwap) {
                   memo[memoIndex] = 1;
                   return true;
               }
           }

           memo[memoIndex] = -1;
           return false;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_scramble(s1::String, s2::String)::Bool
       first = collect(codeunits(s1))
       second = collect(codeunits(s2))
       length(first) == length(second) || return false
       isempty(first) && return false

       n = length(first)
       prefix_first = zeros(Int, n + 1, 26)
       prefix_second = zeros(Int, n + 1, 26)
       for index in 1:n
           prefix_first[index + 1, :] .= prefix_first[index, :]
           prefix_second[index + 1, :] .= prefix_second[index, :]
           prefix_first[index + 1, Int(first[index] - UInt8('a')) + 1] += 1
           prefix_second[index + 1, Int(second[index] - UInt8('a')) + 1] += 1
       end

       memo = zeros(Int8, n, n, n)

       function same_interval(i::Int, j::Int, part_length::Int)::Bool
           for offset in 0:(part_length - 1)
               first[i + offset] == second[j + offset] || return false
           end
           return true
       end

       function same_counts(i::Int, j::Int, part_length::Int)::Bool
           for letter in 1:26
               first_count = prefix_first[i + part_length, letter] -
                   prefix_first[i, letter]
               second_count = prefix_second[j + part_length, letter] -
                   prefix_second[j, letter]
               first_count == second_count || return false
           end
           return true
       end

       function solve(i::Int, j::Int, part_length::Int)::Bool
           cached = memo[i, j, part_length]
           cached != 0 && return cached == 1

           if same_interval(i, j, part_length)
               memo[i, j, part_length] = 1
               return true
           end
           if !same_counts(i, j, part_length)
               memo[i, j, part_length] = -1
               return false
           end

           for split in 1:(part_length - 1)
               without_swap = solve(i, j, split) &&
                   solve(i + split, j + split, part_length - split)
               if without_swap
                   memo[i, j, part_length] = 1
                   return true
               end

               with_swap = solve(
                   i,
                   j + part_length - split,
                   split,
               ) && solve(
                   i + split,
                   j,
                   part_length - split,
               )
               if with_swap
                   memo[i, j, part_length] = 1
                   return true
               end
           end

           memo[i, j, part_length] = -1
           return false
       end

       return solve(1, 1, n)
   end

R
~

.. code-block:: r

   is_scramble <- function(s1, s2) {
     first <- utf8ToInt(s1)
     second <- utf8ToInt(s2)
     n <- length(first)
     if (n != length(second) || n == 0L) {
       return(FALSE)
     }

     prefix_first <- matrix(0L, nrow = n + 1L, ncol = 26L)
     prefix_second <- matrix(0L, nrow = n + 1L, ncol = 26L)
     for (index in seq_len(n)) {
       prefix_first[index + 1L, ] <- prefix_first[index, ]
       prefix_second[index + 1L, ] <- prefix_second[index, ]
       first_letter <- first[index] - utf8ToInt("a") + 1L
       second_letter <- second[index] - utf8ToInt("a") + 1L
       prefix_first[index + 1L, first_letter] <-
         prefix_first[index + 1L, first_letter] + 1L
       prefix_second[index + 1L, second_letter] <-
         prefix_second[index + 1L, second_letter] + 1L
     }

     state <- new.env(parent = emptyenv())
     state$memo <- integer(n * n * n)

     memo_index <- function(i, j, part_length) {
       ((i - 1L) * n + (j - 1L)) * n + part_length
     }

     same_interval <- function(i, j, part_length) {
       offsets <- seq_len(part_length) - 1L
       all(first[i + offsets] == second[j + offsets])
     }

     same_counts <- function(i, j, part_length) {
       first_counts <- prefix_first[i + part_length, ] -
         prefix_first[i, ]
       second_counts <- prefix_second[j + part_length, ] -
         prefix_second[j, ]
       all(first_counts == second_counts)
     }

     solve <- function(i, j, part_length) {
       key <- memo_index(i, j, part_length)
       cached <- state$memo[key]
       if (cached != 0L) {
         return(cached == 1L)
       }

       if (same_interval(i, j, part_length)) {
         state$memo[key] <- 1L
         return(TRUE)
       }
       if (!same_counts(i, j, part_length)) {
         state$memo[key] <- -1L
         return(FALSE)
       }

       if (part_length > 1L) {
         for (split in seq_len(part_length - 1L)) {
           without_swap <- solve(i, j, split) &&
             solve(i + split, j + split, part_length - split)
           if (without_swap) {
             state$memo[key] <- 1L
             return(TRUE)
           }

           with_swap <- solve(
             i,
             j + part_length - split,
             split
           ) && solve(
             i + split,
             j,
             part_length - split
           )
           if (with_swap) {
             state$memo[key] <- 1L
             return(TRUE)
           }
         }
       }

       state$memo[key] <- -1L
       FALSE
     }

     solve(1L, 1L, n)
   }

验证计划与证据
--------------

* 正常真例：``great -> rgeat``；
* 正常假例：``abcde -> caebd``；
* 单字符、重复字符和整串直接相等；
* 小规模随机字符串与独立自底向上区间 DP 对拍；
* 长度 30 的直接相等与字符频次不同案例；
* 可运行语言执行编译、严格警告或严格类型检查。

关键边界
--------

* 两串必须等长且非空；官方输入已满足，代码仍防御长度不等；
* 频次相同不能直接返回真；
* ``split`` 必须使左右两段都非空；
* 交换方案中，``s2`` 右段起点是 ``j + length - split``；
* 缓存必须区分未知和已计算的假；
* 小写英文字母约束支撑固定 26 项频次数组和按字节访问。

易错点
------

* 只检查排序后字符串相同，会把 ``abcde`` 与 ``caebd`` 错判为真；
* 只写不交换转移，会漏掉定义中最关键的子树交换；
* 交换转移仍使用 ``j + split``，会比较错误区间；
* 缓存只按两个起点索引而忽略长度，会把不同状态混在一起；
* 在热循环中反复切片、排序子串，会增加大量复制和排序成本；
* R 若用普通局部向量更新递归缓存，可能反复复制；实现使用环境保存共享缓存。

本题新增知识
------------

* 三维区间状态 ``(first_start, second_start, length)``；
* scramble 根结点的交换与不交换两类完整转移；
* 字符多重集是安全必要条件剪枝；
* 假状态同样必须记忆化；
* ``O(n^3)`` 状态乘每状态 ``O(n)`` 切分得到 ``O(n^4)``。

本题强化知识
------------

* ASCII 字符域支撑字节级索引；
* 前缀计数把区间统计从线性扫描降为固定字母表查询；
* 记忆化递归需要区分共享缓存和调用局部状态；
* TypeScript 整数下标不需要位运算；
* Julia 与 R 的一基区间起点需要重新推导交换坐标。

关联题目
--------

* `0072. Edit Distance <0072-edit-distance.rst>`_：字符串区间或前缀动态规划状态设计；
* `0044. Wildcard Matching <0044-wildcard-matching.rst>`_：字符串匹配中的状态充分性与转移完整性。

最小自检
--------

#. ``solve(i, j, length)`` 精确表示什么？
#. 为什么字符频次相同仍不能直接返回真？
#. 交换转移中两个 ``s2`` 子区间的起点分别是什么？
#. 为什么状态数是 ``O(n^3)``，总时间是 ``O(n^4)``？
#. 哪些语言实现使用零基坐标，Julia 与 R 如何映射到一基位置？

答案要点
~~~~~~~~

状态比较两个等长区间。每个根结点枚举切分点，并检查不交换与交换两种子区间对应。字符频次不同可
安全剪枝，频次相同仍需递归。三元状态缓存保证每个状态只完整计算一次。
