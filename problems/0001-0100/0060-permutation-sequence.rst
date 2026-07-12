0060. Permutation Sequence
==========================

题目信息
--------

:题号: 0060
:难度: Hard
:主题: 排列、字典序、阶乘分组、秩选择
:原题: `LeetCode 0060 <https://leetcode.com/problems/permutation-sequence/>`_
:访问状态: Available
:教学重点: 零基排列秩、阶乘块划分、按块排除、容器删除成本

题目重述
--------

把数字 ``1`` 到 ``n`` 各使用一次，可以得到 ``n!`` 个排列。将这些排列按字典序从小到大排列，
返回其中第 ``k`` 个排列的字符串表示。

题目保证：

* ``1 <= n <= 9``；
* ``1 <= k <= n!``；
* 每个数字只有一位，因此输出字符串长度恰好为 ``n``；
* ``9! = 362880``，阶乘、排列秩和下标都安全落在 32 位有符号整数范围内。

主实现直接定位目标排列，不生成前 ``k - 1`` 个排列。

自建示例
--------

位于第二个首位分组
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：n = 4, k = 9
   输出："2314"

以 ``1`` 开头的排列有 ``3! = 6`` 个，第 9 个排列落在以 ``2`` 开头的分组中。

首个排列
~~~~~~~~

.. code-block:: text

   输入：n = 3, k = 1
   输出："123"

最后一个排列
~~~~~~~~~~~~

.. code-block:: text

   输入：n = 4, k = 24
   输出："4321"

单元素
~~~~~~

.. code-block:: text

   输入：n = 1, k = 1
   输出："1"

问题抽象
--------

假设当前还有 ``remaining`` 个数字可选。固定首位后，剩余数字共有
``(remaining - 1)!`` 种排列，因此当前字典序区间可以连续分成 ``remaining`` 个等大块：

.. code-block:: text

   第 0 块：使用当前最小可用数字作为下一位
   第 1 块：使用第二小可用数字作为下一位
   ...
   每块大小：(remaining - 1)!

把题目的第 ``k`` 个排列转换为零基秩 ``rank = k - 1``。当前应选择的可用数字下标为：

.. code-block:: text

   choice = rank / (remaining - 1)!
   rank   = rank % (remaining - 1)!

选中该数字并从有序候选表中删除，然后在目标块内部继续处理下一位。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 算法额外空间
     - 定位
   * - 阶乘分组直接选择
     - ``O(n²)``
     - ``O(n)``
     - 主解法；跳过整个排列块
   * - 从最小排列反复调用 next permutation
     - ``O(k × n)``
     - ``O(n)``
     - 复用 0031，但可能遍历大量无关排列
   * - 回溯生成全部排列后排序
     - ``O(n × n!)``
     - ``O(n × n!)``
     - 忽略字典序分组结构
   * - 阶乘分组加顺序统计树
     - ``O(n log n)``
     - ``O(n)``
     - 适合更大 ``n``，本题没有必要

候选表删除中间元素需要移动后缀，因此普通数组或动态数组实现总时间为 ``O(n²)``。由于
``n <= 9``，这个成本远小于生成排列的阶乘级成本。

主解法：按阶乘块选择下一位
----------------------------

状态定义
~~~~~~~~

算法维护：

* ``available``：仍未写入答案的数字，始终按升序排列；
* ``remaining``：``available`` 的当前长度；
* ``rank``：目标排列在当前候选集合全部排列中的零基秩；
* ``factorials[t]``：``t!``；
* ``answer``：已经确定的字典序前缀。

开始时 ``available = [1, 2, ..., n]``，``rank = k - 1``。每轮使用块大小
``factorials[remaining - 1]`` 选择下一位。

核心不变量
~~~~~~~~~~

每轮开始时保持：

* ``answer`` 是目标排列已经确定的前缀；
* ``available`` 恰好包含尚未使用的数字，每个数字一次且保持升序；
* 所有以 ``answer`` 开头、后缀由 ``available`` 构成的排列共有 ``remaining!`` 个；
* ``0 <= rank < remaining!``，它表示目标在这些后缀排列中的零基秩；
* 已排除的字典序块全部位于目标之前，不可能包含目标排列。

局部选择为什么合法
~~~~~~~~~~~~~~~~~~

每个候选数字作为下一位时，后面都能排列出 ``(remaining - 1)!`` 个后缀。候选数字升序排列，
所以这些分组在字典序中也按候选下标连续排列。

令 ``block = (remaining - 1)!``。由 ``0 <= rank < remaining!`` 得到：

.. code-block:: text

   0 <= rank / block < remaining

因此 ``choice`` 一定是 ``available`` 的合法下标。整数除法得到目标所在块，取模得到目标在该块内部的
新秩。

正确性依据
~~~~~~~~~~

**分块完整且互不重叠。** 当前所有排列按下一位数字分成 ``remaining`` 组。每个排列的下一位唯一，
所以它只属于一组；每组枚举剩余数字的全部排列，因此所有组的并集正好覆盖当前全部候选。

**分块顺序正确。** ``available`` 升序排列。两个排列的当前前缀相同，下一位较小的排列在字典序中
必然更小，所以各组按 ``available`` 下标从小到大连续出现。

**局部选择不会漏掉目标。** ``choice = rank / block`` 恰好指出包含目标的组。所有更早组共包含
``choice × block`` 个排列，都严格位于目标之前；所有更晚组都严格位于目标之后，因此可以安全排除。

**新秩正确。** 删除更早组后，目标在选中组中的零基位置为 ``rank % block``。选定下一位并移除该
数字后，问题缩小为对剩余数字寻找这个新秩对应的排列，不变量继续成立。

**唯一性与终止性。** 每轮永久选择并删除一个数字，任何数字都不会重复使用。``remaining`` 每轮减一，
最终变为零；此时前缀长度为 ``n``，恰好得到唯一目标排列。

复杂度
~~~~~~

设数字数量为 ``n``：

* 阶乘表构造需要 ``O(n)`` 时间；
* 共选择 ``n`` 次，每次从顺序容器删除一个元素最坏移动 ``O(n)`` 个元素，总时间为 ``O(n²)``；
* ``available``、阶乘表和答案缓冲区占 ``O(n)`` 算法额外空间；
* 返回字符串占 ``O(n)`` 结果空间；
* Julia 的 ``deleteat!``、R 的负下标删除和 TypeScript 的 ``splice`` 都会移动或复制后缀，不能把
  这些实现写成 ``O(n)`` 总时间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdlib.h>

   char *getPermutation(int n, int k) {
       int factorials[10] = {1};
       int available[9];

       for (int value = 1; value <= n; ++value) {
           factorials[value] = factorials[value - 1] * value;
           available[value - 1] = value;
       }

       char *answer = malloc((size_t)n + 1U);
       if (answer == NULL) {
           return NULL;
       }

       int rank = k - 1;
       for (int position = 0; position < n; ++position) {
           int remaining = n - position;
           int block = factorials[remaining - 1];
           int choice = rank / block;
           rank %= block;

           answer[position] = (char)('0' + available[choice]);

           for (int index = choice; index + 1 < remaining; ++index) {
               available[index] = available[index + 1];
           }
       }

       answer[n] = '\0';
       return answer;
   }

``n <= 9`` 保证数字可以直接转换为单个 ASCII 字符。返回字符串由调用者负责 ``free``。

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::string getPermutation(int n, int k) {
           std::vector<int> factorials(n + 1, 1);
           std::vector<int> available;
           available.reserve(n);

           for (int value = 1; value <= n; ++value) {
               factorials[value] = factorials[value - 1] * value;
               available.push_back(value);
           }

           int rank = k - 1;
           std::string answer;
           answer.reserve(n);

           for (int remaining = n; remaining >= 1; --remaining) {
               int block = factorials[remaining - 1];
               int choice = rank / block;
               rank %= block;

               answer.push_back(
                   static_cast<char>('0' + available[choice])
               );
               available.erase(available.begin() + choice);
           }

           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def getPermutation(self, n: int, k: int) -> str:
           factorials = [1] * (n + 1)
           available = list(range(1, n + 1))

           for value in range(1, n + 1):
               factorials[value] = factorials[value - 1] * value

           rank = k - 1
           answer: list[str] = []

           for remaining in range(n, 0, -1):
               block = factorials[remaining - 1]
               choice, rank = divmod(rank, block)
               answer.append(str(available.pop(choice)))

           return "".join(answer)

``pop(choice)`` 删除中间元素时需要移动后缀，因此总时间仍为 ``O(n²)``。

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public String getPermutation(int n, int k) {
           int[] factorials = new int[n + 1];
           factorials[0] = 1;

           List<Integer> available = new ArrayList<>(n);
           for (int value = 1; value <= n; ++value) {
               factorials[value] = factorials[value - 1] * value;
               available.add(value);
           }

           int rank = k - 1;
           StringBuilder answer = new StringBuilder(n);

           for (int remaining = n; remaining >= 1; --remaining) {
               int block = factorials[remaining - 1];
               int choice = rank / block;
               rank %= block;
               answer.append(available.remove(choice));
           }

           return answer.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn get_permutation(n: i32, k: i32) -> String {
           let size = n as usize;
           let mut factorials = vec![1usize; size + 1];
           let mut available: Vec<u8> = (1..=n).map(|value| value as u8).collect();

           for value in 1..=size {
               factorials[value] = factorials[value - 1] * value;
           }

           let mut rank = (k - 1) as usize;
           let mut answer = String::with_capacity(size);

           for remaining in (1..=size).rev() {
               let block = factorials[remaining - 1];
               let choice = rank / block;
               rank %= block;

               let digit = available.remove(choice);
               answer.push((b'0' + digit) as char);
           }

           answer
       }
   }

``n`` 与 ``k`` 的题目约束保证两次有符号到无符号转换非负，且 ``choice < remaining``。

Go
~~

.. code-block:: go

   import "strings"

   func getPermutation(n int, k int) string {
       factorials := make([]int, n+1)
       factorials[0] = 1
       available := make([]int, n)

       for value := 1; value <= n; value++ {
           factorials[value] = factorials[value-1] * value
           available[value-1] = value
       }

       rank := k - 1
       var answer strings.Builder
       answer.Grow(n)

       for remaining := n; remaining >= 1; remaining-- {
           block := factorials[remaining-1]
           choice := rank / block
           rank %= block

           answer.WriteByte(byte('0' + available[choice]))
           copy(available[choice:], available[choice+1:])
           available = available[:remaining-1]
       }

       return answer.String()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getPermutation(n: number, k: number): string {
       const factorials: number[] = new Array(n + 1).fill(1);
       const available: number[] = [];

       for (let value = 1; value <= n; value += 1) {
           factorials[value] = factorials[value - 1] * value;
           available.push(value);
       }

       let rank = k - 1;
       const answer: string[] = [];

       for (let remaining = n; remaining >= 1; remaining -= 1) {
           const block = factorials[remaining - 1];
           const choice = Math.floor(rank / block);
           rank %= block;

           const [digit] = available.splice(choice, 1);
           answer.push(String(digit));
       }

       return answer.join("");
   }

最大整数只有 ``9!``，远小于 ``Number.MAX_SAFE_INTEGER``。实现不使用会强制转换为 32 位的位运算。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;
   using System.Text;

   public class Solution {
       public string GetPermutation(int n, int k) {
           int[] factorials = new int[n + 1];
           factorials[0] = 1;
           List<int> available = new List<int>(n);

           for (int value = 1; value <= n; ++value) {
               factorials[value] = factorials[value - 1] * value;
               available.Add(value);
           }

           int rank = k - 1;
           StringBuilder answer = new StringBuilder(n);

           for (int remaining = n; remaining >= 1; --remaining) {
               int block = factorials[remaining - 1];
               int choice = rank / block;
               rank %= block;

               answer.Append(available[choice]);
               available.RemoveAt(choice);
           }

           return answer.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function get_permutation(n::Int, k::Int)::String
       factorials = ones(Int, n + 1)
       available = collect(1:n)

       for value in 1:n
           factorials[value + 1] = factorials[value] * value
       end

       rank = k - 1
       answer = IOBuffer()

       for remaining in n:-1:1
           # factorials[remaining] 对应零基公式中的 (remaining - 1)!。
           block = factorials[remaining]
           choice = div(rank, block) + 1
           rank %= block

           print(answer, available[choice])
           deleteat!(available, choice)
       end

       return String(take!(answer))
   end

算法中的 ``choice`` 是零基块编号；访问 Julia 容器时加一。``n:-1:1`` 显式指定递减步长。

R
~

.. code-block:: r

   get_permutation <- function(n, k) {
     n <- as.integer(n)
     rank <- as.integer(k) - 1L

     factorials <- integer(n + 1L)
     factorials[1L] <- 1L
     available <- seq_len(n)

     for (value in seq_len(n)) {
       factorials[value + 1L] <- factorials[value] * value
     }

     answer <- character(n)
     for (position in seq_len(n)) {
       remaining <- n - position + 1L
       # factorials[remaining] 对应 (remaining - 1)!。
       block <- factorials[remaining]
       choice <- rank %/% block + 1L
       rank <- rank %% block

       answer[position] <- as.character(available[choice])
       available <- available[-choice]
     }

     paste0(answer, collapse = "")
   }

R 使用一基位置访问候选向量。负下标删除会建立新向量，因此候选维护产生 ``O(n²)`` 累计复制。

语言边界说明
------------

* 所有语言都先执行 ``k - 1``，因为阶乘块编号使用零基秩；直接使用 ``k`` 会在块边界选错下一组；
* ``n <= 9`` 同时保证阶乘适合普通整数、数字可编码为单个字符；
* C 的返回字符串是堆对象，调用者负责释放；
* Rust 消费本地候选向量，``remove`` 返回被删除数字，不需要克隆；
* Go 的 ``copy`` 与切片缩短复用同一底层数组，删除总成本仍按元素移动计算；
* TypeScript 的整数全部处于安全整数范围，不需要 ``BigInt``；
* Julia 和 R 的块编号需要从零基算法坐标转换为一基容器位置；
* R 的向量删除是复制型适配，额外空间峰值为 ``O(n)``，累计复制时间为 ``O(n²)``。

对照解法：反复生成下一个排列
----------------------------

从 ``123...n`` 开始，重复 ``k - 1`` 次 0031 的 next permutation，也能到达目标。单次变换为
``O(n)``，总时间为 ``O(k × n)``。该方法验证方便，却没有利用第 ``k`` 个排列所在的阶乘分组；当
``k`` 接近 ``n!`` 时会执行大量无关变换。

验证计划与证据
--------------

``运行验证``
   对正常样例 ``(3, 3)``、块边界 ``(4, 7)``、首个排列、最后一个排列和 ``n = 1`` 执行实现。

``随机基准对拍``
   Python 使用 ``itertools.permutations`` 生成并排序小规模全部排列，对 ``1 <= n <= 8`` 的随机
   ``k`` 与阶乘分组实现比较。基准直接枚举，不复用被测算法的分块逻辑。

``编译验证``
   C 使用 C17、``-Wall -Wextra -Werror`` 与 AddressSanitizer、UndefinedBehaviorSanitizer；C++ 使用
   C++17 严格警告；Java、Go 和 TypeScript 分别完成编译或严格类型检查。

``静态验证``
   Rust、C#、Julia 和 R 在当前环境缺少运行时，逐项检查接口、整数边界、所有权、一基索引、递减范围
   和容器删除成本，不宣称运行通过。

关键边界
--------

* ``k = 1``：``rank = 0``，每轮都选择最小可用数字；
* ``k = n!``：第一轮及后续可能选择当前最后一个候选，最终得到严格降序排列；
* 阶乘块边界：例如 ``n = 4, k = 7``，转换后 ``rank = 6``，应进入第二个首位块；
* ``remaining = 1``：块大小为 ``0! = 1``，合法选择下标只能是零；
* ``n = 9``：最大阶乘为 ``362880``，不存在整数溢出或多位数字编码问题。

易错点
------

* 忘记把 ``k`` 转为零基秩，导致所有块边界整体偏移一位；
* 当前块大小误写成 ``remaining!``，使首位选择永远落在第零块；
* 选择数字后没有从候选表删除，导致数字重复并漏掉其他数字；
* Julia 或 R 直接用零基 ``choice`` 访问容器，产生越界或选择前一项；
* 把动态数组中间删除忽略为 ``O(1)``，错误声称总时间为 ``O(n)``；
* TypeScript 使用位运算计算除法或取整，引入不必要的 32 位语义。

本题新增知识
------------

* 字典序排列可以按下一位候选分成等大的阶乘块；
* 一基题目排名转换为零基秩后，可以用整除选择块、用取模进入块内；
* 不生成排列树也能按秩直接恢复唯一排列。

本题强化知识
------------

* 0046 的每层位置选择共有 ``remaining`` 个分支，本题把每棵等大的子树整体跳过；
* 0031 的字典序定义继续成立，本题直接定位秩而非逐个求后继；
* Julia 与 R 继续区分零基算法坐标和一基容器位置；
* 动态数组删除需要计入移动或复制成本。

关联题目
--------

* `0031. Next Permutation <0031-next-permutation.rst>`_：两题都使用字典序；0031 求紧邻后继，
  本题按秩直接跳过多个后继。
* `0046. Permutations <0046-permutations.rst>`_：0046 显式遍历排列搜索树，本题利用每层子树大小
  ``(remaining - 1)!`` 直接选择目标分支。
* `0047. Permutations II <0047-permutations-ii.rst>`_：该题处理重复值导致的不等大分支；本题数字
  互异，因此每个首位分组大小完全相同。

最小自检
--------

#. 为什么必须先执行 ``rank = k - 1``？
#. 当还有 ``remaining`` 个数字时，为什么每个下一位分组正好有 ``(remaining - 1)!`` 个排列？
#. 为什么 ``choice`` 一定落在候选表合法下标范围内？
#. 普通动态数组实现为什么是 ``O(n²)``，不是 ``O(n)``？
#. Julia 与 R 在访问候选表时需要做哪一步坐标转换？

答案要点
~~~~~~~~

#. 题目使用一基排名，整除分块使用零基区间；减一后块边界才能正确对齐。
#. 固定下一位后，剩余 ``remaining - 1`` 个互异数字可以形成全部 ``(remaining - 1)!`` 个排列。
#. ``rank < remaining!``，除以 ``(remaining - 1)!`` 后商严格小于 ``remaining``。
#. 每轮删除候选可能移动线性长度后缀，累计形成平方级时间。
#. 算法得到零基块编号，访问一基容器时必须加一。
