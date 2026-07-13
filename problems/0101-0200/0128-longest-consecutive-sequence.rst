0128. Longest Consecutive Sequence
==================================

题目信息
--------

:题号: 0128
:难度: Medium
:主题: 数组、哈希集合
:原题: `LeetCode 0128 <https://leetcode.com/problems/longest-consecutive-sequence/>`_
:访问状态: Available
:教学重点: 只从序列起点扩展

题目重述
--------

给定无序整数数组，返回最长连续整数序列长度，要求期望 ``O(n)`` 时间。

自建示例
--------

.. code-block:: text

   输入：nums = [100,4,200,1,3,2]
   输出：4

问题抽象
--------

把所有值放入集合。仅当 ``x-1`` 不在集合时，从 ``x`` 向上计数连续值。

主解法：哈希集合起点扫描
--------------

思路
~~~~

哈希集合起点扫描。 只从序列起点扩展

核心状态与不变量
~~~~~~~~~~~~~~~~

把所有值放入集合。仅当 ``x-1`` 不在集合时，从 ``x`` 向上计数连续值。

正确性依据
~~~~~~~~~~

每个连续段只有最小值满足起点条件，因此每段只被完整扫描一次。所有扩展步总计不超过不同元素数，最大段长即答案。

复杂度与语言边界
~~~~~~~~~~~~~~~~

哈希集合版本期望时间 ``O(n)``、空间 ``O(n)``；C 适配器采用排序，时间 ``O(n log n)`` 且原地改变数组顺序。整数边界处避免溢出。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static int cmp(const void*a,const void*b) {
       int x=*(const int*)a,y=*(const int*)b;
       return(x>y)-(x<y);
   }
   int longestConsecutive(int*a,int n) {
       if(!n)return 0;
       qsort(a,n,sizeof(int),cmp);
       int best=1,cur=1;
       for(int i=1;i<n;i++) {
           if(a[i]==a[i-1])continue;
           if((long long)a[i]==(long long)a[i-1]+1)cur++;
           else cur=1;
           if(cur>best)best=cur;
       }
       return best;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int longestConsecutive(vector<int>&a) {
           unordered_set<int>s(a.begin(),a.end());
           int best=0;
           for(int x:s) {
               if(x!=INT_MIN&&s.count(x-1))continue;
               int len=1,y=x;
               while(y!=INT_MAX&&s.count(y+1)) {
                   y++;
                   len++;
               }
               best=max(best,len);
           }
           return best;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def longestConsecutive(self, nums: list[int]) -> int:
           s = set(nums)
           best = 0
           for x in s:
               if x - 1 in s:
                   continue
               y = x
               while y + 1 in s:
                   y += 1
               best = max(best, y - x + 1)
           return best
Java
~~~~

.. code-block:: java

   class Solution {
       public int longestConsecutive(int[]a) {
           Set<Integer>s=new HashSet<>();
           for(int x:a)s.add(x);
           int best=0;
           for(int x:s) {
               if(x!=Integer.MIN_VALUE&&s.contains(x-1))continue;
               int len=1,y=x;
               while(y!=Integer.MAX_VALUE&&s.contains(y+1)) {
                   y++;
                   len++;
               }
               best=Math.max(best,len);
           }
           return best;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::collections::HashSet;
   impl Solution {
       pub fn longest_consecutive(a:Vec<i32>)->i32 {
           let s:HashSet<i32>=a.into_iter().collect();
           let mut best=0;
           for &x in &s {
               if x!=i32::MIN&&s.contains(&(x-1)) {
                   continue
               }
               let(mut y,mut len)=(x,1);
               while y!=i32::MAX&&s.contains(&(y+1)) {
                   y+=1;
                   len+=1;
               }
               best=best.max(len);
           }
           best
       }
   }
Go
~~

.. code-block:: go

   func longestConsecutive(a []int) int {
   	s := map[int]bool{}
   	for _, x := range a {
   		s[x] = true
   	}
   	best := 0
   	for x := range s {
   		if s[x-1] {
   			continue
   		}
   		y := x
   		for s[y+1] {
   			y++
   		}
   		if y-x+1 > best {
   			best = y - x + 1
   		}
   	}
   	return best
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestConsecutive(a: number[]): number {
       const s = new Set(a);
       let best = 0;
       for (const x of s) {
           if (s.has(x - 1))
               continue;
           let y = x;
           while (s.has(y + 1))
               y++;
           best = Math.max(best, y - x + 1);
       }
       return best;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int LongestConsecutive(int[]a) {
           var s=new HashSet<int>(a);
           int best=0;
           foreach(int x in s) {
               if(x!=int.MinValue&&s.Contains(x-1))continue;
               int y=x,len=1;
               while(y!=int.MaxValue&&s.Contains(y+1)) {
                   y++;
                   len++;
               }
               best=Math.Max(best,len);
           }
           return best;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function longest_consecutive(a::Vector{Int})::Int
       s=Set(a)
       best=0
       for x in s
           (x!=typemin(Int)&&x-1 in s)&&continue
           y=x
           while y!=typemax(Int)&&y+1 in s
               y+=1
           end
           best=max(best,y-x+1)
       end
       best
   end
R
~

.. code-block:: r

   longest_consecutive <- function(a) {
       s<-unique(a)
       env<-new.env(hash=TRUE,parent=emptyenv())
       for(x in s)env[[as.character(x)]]<-TRUE
       best<-0L
       for(x in s) {
           if(!is.null(env[[as.character(x-1)]]))next
           y<-x
           while(!is.null(env[[as.character(y+1)]]))y<-y+1
           best<-max(best,y-x+1L)
       }
       best
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空数组返回 0。
* 重复值由集合去重。
* 整数边界处避免 ``x-1`` 或 ``x+1`` 溢出。

易错点
------

* 从每个元素都向上扩展导致 ``O(n^2)``。
* 排序后声称 ``O(n)``。

本题新增知识
------------

* 只从序列起点扩展
* 题号 0128 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0136. Single Number <0136-single-number.rst>`_；

最小自检
--------

#. ``哈希集合起点扫描`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每个连续段只有最小值满足起点条件，因此每段只被完整扫描一次。所有扩展步总计不超过不同元素数，最大段长即答案。
