0089. Gray Code
===============

题目信息
--------

:题号: 0089
:难度: Medium
:主题: 位运算、构造、二进制反射
:原题: `LeetCode 0089 <https://leetcode.com/problems/gray-code/>`_
:重点: 反射构造、Gray 闭式、相邻一位差、首尾循环

题目重述
--------

给定 ``n``，返回长度为 ``2^n`` 的整数序列。序列从 0 开始，包含 ``0..2^n-1`` 每个值恰好一次；相邻元素以及首尾元素的二进制表示都只相差一位。

自建示例
--------

.. code-block:: text

   n=3 -> [0,1,3,2,6,7,5,4]
   相邻异或为 1,2,1,4,1,2,1，首尾异或为 4，均为 2 的幂。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       bool backtrack(int current, int n, std::vector<char>& used,
                      std::vector<int>& path) {
           if (path.size() == used.size())
               return (path.back() ^ path.front()) &&
                      (((path.back() ^ path.front()) & ((path.back() ^ path.front()) - 1)) == 0);
           for (int bit = 0; bit < n; ++bit) {
               int next = current ^ (1 << bit);
               if (used[next]) continue;
               used[next] = true; path.push_back(next);
               if (backtrack(next, n, used, path)) return true;
               path.pop_back(); used[next] = false;
           }
           return false;
       }

       std::vector<int> hypercubeSearch(int n) {
           int total = 1 << n;
           std::vector<char> used(total);
           std::vector<int> path{0}; used[0] = true;
           backtrack(0, n, used, path);
           return path;
       }

       std::vector<int> reflection(int n) {
           std::vector<int> result{0};
           for (int bit = 0; bit < n; ++bit) {
               int prefix = 1 << bit;
               for (int i = static_cast<int>(result.size()) - 1; i >= 0; --i)
                   result.push_back(prefix | result[i]);
           }
           return result;
       }

       std::vector<int> directFormula(int n) {
           std::vector<int> result;
           result.reserve(1 << n);
           for (int value = 0; value < (1 << n); ++value)
               result.push_back(value ^ (value >> 1));
           return result;
       }

   public:
       std::vector<int> grayCode(int n) {
           return directFormula(n);
       }
   };

题解
----

搜索模型为何代价高
~~~~~~~~~~~~~~~~

把 ``n`` 位整数视为超立方体顶点，只差一位的两个整数之间有边。题目要求从 0 出发访问所有顶点一次并形成环。回溯可以搜索 Hamilton 环，但忽略了 Gray Code 已有确定构造。

反射构造如何扩展一位
~~~~~~~~~~~~~~~~~~~~

已知 ``n`` 位 Gray 序列后，构造 ``n+1`` 位序列：原序列前半最高位补 0；把原序列反向后最高位补 1。连接处只有新增最高位变化，前后两半内部仍保持一位差。

.. code-block:: text

   n=2: 00, 01, 11, 10
   反向: 10, 11, 01, 00
   n=3: 000,001,011,010, 110,111,101,100

闭式公式从何而来
~~~~~~~~~~~~~~~~

二进制反射 Gray 编码可写为：

.. code-block:: text

   gray(i) = i XOR (i >> 1)

Gray 位 ``g_k`` 等于二进制位 ``b_{k+1} XOR b_k``。它描述当前位与更高一位是否发生边界变化，正好对应反射构造的层级翻转。

相邻整数为何只留下一个变化位
~~~~~~~~~~~~~~~~~~~~~~~~~~

从 ``i`` 加一到 ``i+1`` 时，二进制末尾连续 1 全部翻为 0，并把它们上方第一个 0 翻为 1。``i XOR (i+1)`` 因此是一段连续低位 1；右移后的异或是同一段少一位。二者再异或只剩最高那一位：

.. code-block:: text

   gray(i) XOR gray(i+1)
   = (i XOR i>>1) XOR ((i+1) XOR (i+1)>>1)

结果始终为 2 的幂，所以相邻 Gray 编码只差一位。

为什么所有输出互不相同
~~~~~~~~~~~~~~~~~~~~~~

Gray 映射可逆。从最高位开始，二进制最高位等于 Gray 最高位，之后每一位满足 ``b_k = b_{k+1} XOR g_k``。不同 ``i`` 不可能映射到同一 Gray 值，因此 ``0..2^n-1`` 的输出恰好覆盖全部 n 位整数。

首尾为什么也只差一位
~~~~~~~~~~~~~~~~~~~~

首项 ``gray(0)=0``。最后输入为全 1 的 ``2^n-1``，右移后为低 ``n-1`` 位全 1，两者异或只留下最高位 ``1<<(n-1)``，因此末项与 0 只差最高位。

公式与反射的关系
~~~~~~~~~~~~~~~~

当输入下标从 ``0..2^n-1`` 扩展到下一最高位区间时，公式生成的后半序列正是前半序列反向并补最高位。闭式不是另一种偶然方案，而是反射构造的位运算表达。

输出复杂度为何是下界
~~~~~~~~~~~~~~~~~~~~

必须返回 ``2^n`` 个整数，任何算法至少花费 ``Theta(2^n)`` 时间和输出空间。公式法每项只做常数位运算，达到该下界；除返回结果外额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int*grayCode(int n,int*returnSize){int total=1<<n,*out=malloc((size_t)total*sizeof(int));for(int i=0;i<total;i++)out[i]=i^(i>>1);*returnSize=total;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def grayCode(self, n: int) -> list[int]:
           return [value ^ (value >> 1) for value in range(1 << n)]

Java
~~~~

.. code-block:: java

   class Solution {public List<Integer> grayCode(int n){List<Integer>out=new ArrayList<>(1<<n);for(int i=0;i<(1<<n);i++)out.add(i^(i>>1));return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn gray_code(n:i32)->Vec<i32>{(0..(1<<n)).map(|value|value^(value>>1)).collect()}}

Go
~~

.. code-block:: go

   func grayCode(n int)[]int{total:=1<<n;out:=make([]int,total);for i:=0;i<total;i++{out[i]=i^(i>>1)};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function grayCode(n:number):number[]{return Array.from({length:1<<n},(_,value)=>value^(value>>1));}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<int> GrayCode(int n){var output=new List<int>(1<<n);for(int value=0;value<(1<<n);value++)output.Add(value^(value>>1));return output;}}

Julia
~~~~~

.. code-block:: julia

   gray_code(n::Int) = [xor(value,value>>1) for value in 0:(1<<n)-1]

R
~

.. code-block:: r

   gray_code <- function(n){values<-0:(bitwShiftL(1L,n)-1L);bitwXor(values,bitwShiftR(values,1L))}
