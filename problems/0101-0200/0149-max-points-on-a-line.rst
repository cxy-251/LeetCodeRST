0149. Max Points on a Line
==========================

题目信息
--------

:题号: 0149
:难度: Hard
:主题: 几何、哈希表、最大公约数
:原题: `LeetCode 0149 <https://leetcode.com/problems/max-points-on-a-line/>`_
:访问状态: Available
:教学重点: 规范化斜率方向

题目重述
--------

给定平面整数点，返回同一直线上的最多点数。

自建示例
--------

.. code-block:: text

   输入：points = [[1,1],[2,2],[3,3]]
   输出：3

   输入：points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
   输出：4

问题抽象
--------

对每个锚点，计算其到后续点的 ``dy/dx``，用最大公约数约分并统一符号，哈希计数相同方向。

主解法：固定锚点统计规范斜率
----------------

思路
~~~~

固定锚点统计规范斜率。 规范化斜率方向

核心状态与不变量
~~~~~~~~~~~~~~~~

对每个锚点，计算其到后续点的 ``dy/dx``，用最大公约数约分并统一符号，哈希计数相同方向。

正确性依据
~~~~~~~~~~

经过固定锚点的每条直线由规范斜率唯一表示，同一直线点映射到同一键，不同直线映射到不同键。枚举每个锚点覆盖任意最优直线，最大计数加锚点即答案。

复杂度与语言边界
~~~~~~~~~~~~~~~~

哈希规范斜率实现时间 ``O(n^2 log C)``（GCD）和空间 ``O(n)``；C 适配器对每个锚点排序斜率，时间 ``O(n^2 log n)``。差值在减法前提升到宽整数。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   typedef struct {
       long long dy,dx;
   }
   Slope;
   static long long gcdll(long long a,long long b) {
       if(a<0)a=-a;
       if(b<0)b=-b;
       while(b) {
           long long t=a%b;
           a=b;
           b=t;
       }
       return a?a:1;
   }
   static int cmpSlope(const void*a,const void*b) {
       const Slope*x=a,*y=b;
       if(x->dy!=y->dy)return x->dy<y->dy?-1:1;
       if(x->dx!=y->dx)return x->dx<y->dx?-1:1;
       return 0;
   }
   int maxPoints(int**p,int n,int*cols) {
       (void)cols;
       if(n<=2)return n;
       int best=2;
       Slope*s=malloc((size_t)(n-1)*sizeof(*s));
       for(int i=0;i<n;i++) {
           int k=0;
           for(int j=i+1;j<n;j++) {
               long long dx=(long long)p[j][0]-p[i][0],dy=(long
                   long)p[j][1]-p[i][1],g=gcdll(dx,dy);
               dx/=g;
               dy/=g;
               if(dx<0||(dx==0&&dy<0)) {
                   dx=-dx;
                   dy=-dy;
               }
               s[k++]=(Slope) {
                   dy,dx
               };
           }
           qsort(s,k,sizeof(*s),cmpSlope);
           for(int a=0;a<k;) {
               int b=a+1;
               while(b<k&&cmpSlope(&s[a],&s[b])==0)b++;
               if(b-a+1>best)best=b-a+1;
               a=b;
           }
       }
       free(s);
       return best;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int maxPoints(vector<vector<int>>&p) {
           int n=p.size(),best=min(n,2);
           for(int i=0;i<n;i++) {
               map<pair<long long,long long>,int>cnt;
               for(int j=i+1;j<n;j++) {
                   long long dx=(long long)p[j][0]-p[i][0],dy=(long
                       long)p[j][1]-p[i][1],g=gcd(llabs(dx),llabs(dy));
                   dx/=g;
                   dy/=g;
                   if(dx<0||(dx==0&&dy<0)) {
                       dx=-dx;
                       dy=-dy;
                   }
                   best=max(best,++cnt[{dy,dx}]+1);
               }
           }
           return best;
       }
   };
Python
~~~~~~

.. code-block:: python

   from math import gcd

   class Solution:

       def maxPoints(self, p: list[list[int]]) -> int:
           n = len(p)
           best = min(n, 2)
           for i in range(n):
               count = {}
               for j in range(i + 1, n):
                   dx = p[j][0] - p[i][0]
                   dy = p[j][1] - p[i][1]
                   g = gcd(dx, dy)
                   dx //= g
                   dy //= g
                   if dx < 0 or (dx == 0 and dy < 0):
                       dx = -dx
                       dy = -dy
                   count[dy, dx] = count.get((dy, dx), 0) + 1
                   best = max(best, count[dy, dx] + 1)
           return best
Java
~~~~

.. code-block:: java

   class Solution {
       public int maxPoints(int[][]p) {
           int n=p.length,best=Math.min(n,2);
           for(int i=0;i<n;i++) {
               Map<String,Integer>cnt=new HashMap<>();
               for(int j=i+1;j<n;j++) {
                   long dx = (long) p[j][0] - p[i][0];
                   long dy = (long) p[j][1] - p[i][1];
                   long g = gcd(Math.abs(dx), Math.abs(dy));
                   dx/=g;
                   dy/=g;
                   if(dx<0||(dx==0&&dy<0)) {
                       dx=-dx;
                       dy=-dy;
                   }
                   String k=dy+"/"+dx;
                   int v=cnt.merge(k,1,Integer::sum);
                   best=Math.max(best,v+1);
               }
           }
           return best;
       }
       long gcd(long a,long b) {
           while(b!=0) {
               long t=a%b;
               a=b;
               b=t;
           }
           return a==0?1:a;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;
   impl Solution {
       pub fn max_points(p:Vec<Vec<i32>>)->i32 {
           fn gcd(mut a:i64,mut b:i64)->i64 {
               a=a.abs();
               b=b.abs();
               while b!=0 {
                   let t=a%b;
                   a=b;
                   b=t;
               }
               if a==0 {
                   1
               } else {
                   a
               }
           }
           let n=p.len();
           let mut best=n.min(2)as i32;
           for i in 0..n {
               let mut c=HashMap::new();
               for j in i+1..n {
                   let(mut dx,mut dy)=((p[j][0]as i64-p[i][0]as i64),(p[j][1]as i64-p[i][1]as
                       i64));
                   let g=gcd(dx,dy);
                   dx/=g;
                   dy/=g;
                   if dx<0||(dx==0&&dy<0) {
                       dx=-dx;
                       dy=-dy;
                   }
                   let v=c.entry((dy,dx)).or_insert(0);
                   *v+=1;
                   best=best.max(*v+1);
               }
           }
           best
       }
   }
Go
~~

.. code-block:: go

   func maxPoints(p [][]int) int {
   	gcd := func(a, b int64) int64 {
   		if a < 0 {
   			a = -a
   		}
   		if b < 0 {
   			b = -b
   		}
   		for b != 0 {
   			a, b = b, a%b
   		}
   		if a == 0 {
   			return 1
   		}
   		return a
   	}
   	n := len(p)
   	if n <= 2 {
   		return n
   	}
   	best := 2
   	for i := 0; i < n; i++ {
   		c := map[[2]int64]int{}
   		for j := i + 1; j < n; j++ {
   			dx := int64(p[j][0]) - int64(p[i][0])
   			dy := int64(p[j][1]) - int64(p[i][1])
   			g := gcd(dx, dy)
   			dx /= g
   			dy /= g
   			if dx < 0 || dx == 0 && dy < 0 {
   				dx = -dx
   				dy = -dy
   			}
   			k := [2]int64{dy, dx}
   			c[k]++
   			if c[k]+1 > best {
   				best = c[k] + 1
   			}
   		}
   	}
   	return best
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPoints(p: number[][]): number {
       const gcd = (a: number, b: number) => {
           a = Math.abs(a);
           b = Math.abs(b);
           while (b)
               [a, b] = [b, a % b];
           return a || 1;
       };
       let best = Math.min(p.length, 2);
       for (let i = 0; i < p.length; i++) {
           const c = new Map<string, number>();
           for (let j = i + 1; j < p.length; j++) {
               let dx = p[j][0] - p[i][0], dy = p[j][1] - p[i][1], g = gcd(dx, dy);
               dx /= g;
               dy /= g;
               if (dx < 0 || (dx === 0 && dy < 0)) {
                   dx = -dx;
                   dy = -dy;
               }
               const k = `$ {
                   dy
               }
               /$ {
                   dx
               }
               `, v = (c.get(k) ?? 0) + 1;
               c.set(k, v);
               best = Math.max(best, v + 1);
           }
       }
       return best;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MaxPoints(int[][]p) {
           int best=Math.Min(p.Length,2);
           for(int i=0;i<p.Length;i++) {
               var c=new Dictionary<(long,long),int>();
               for(int j=i+1;j<p.Length;j++) {
                   long dx = (long)p[j][0] - p[i][0];
                   long dy = (long)p[j][1] - p[i][1];
                   long g = Gcd(Math.Abs(dx), Math.Abs(dy));
                   dx/=g;
                   dy/=g;
                   if(dx<0||(dx==0&&dy<0)) {
                       dx=-dx;
                       dy=-dy;
                   }
                   var k=(dy,dx);
                   c[k]=c.GetValueOrDefault(k)+1;
                   best=Math.Max(best,c[k]+1);
               }
           }
           return best;
       }
       long Gcd(long a,long b) {
           while(b!=0) {
               (a,b)=(b,a%b);
           }
           return a==0?1:a;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function max_points(p::Vector{Vector{Int}})::Int
       best=min(length(p),2)
       for i in eachindex(p)
           c=Dict{Tuple{Int,Int},Int}()
           for j in i+1:length(p)
               dx=p[j][1]-p[i][1]
               dy=p[j][2]-p[i][2]
               g=gcd(dx,dy)
               dx÷=g
               dy÷=g
               if dx<0||(dx==0&&dy<0)
                   dx=-dx
                   dy=-dy
               end
               k=(dy,dx)
               c[k]=get(c,k,0)+1
               best=max(best,c[k]+1)
           end
       end
       best
   end
R
~

.. code-block:: r

   max_points <- function(p) {
       n<-nrow(p)
       best<-min(n,2L)
       gcd2<-function(a,b) {
           a<-abs(a)
           b<-abs(b)
           while(b!=0) {
               tmp<-a%%b
               a<-b
               b<-tmp
           }
           if(a==0)1 else a
       }
       for(i in seq_len(n)) {
           cnt<-new.env(hash=TRUE,parent=emptyenv())
           if(i<n)for(j in (i+1L):n) {
               dx<-p[j,1]-p[i,1]
               dy<-p[j,2]-p[i,2]
               g<-gcd2(dx,dy)
               dx<-dx/g
               dy<-dy/g
               if(dx<0||(dx==0&&dy<0)) {
                   dx<--dx
                   dy<--dy
               }
               k<-paste(dy,dx,sep='/')
               cnt[[k]]<-if(is.null(cnt[[k]]))1L else cnt[[k]]+1L
               best<-max(best,cnt[[k]]+1L)
           }
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

* 点数小于等于 2 直接返回点数。
* 垂直线统一为 ``(1,0)``，水平线统一为 ``(0,1)``。
* 若输入允许重复点需单独计数；当前平台通常点互异。

易错点
------

* 用浮点斜率产生精度或正负零问题。
* ``(dy,dx)`` 符号未统一。

本题新增知识
------------

* 规范化斜率方向
* 题号 0149 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0128. Longest Consecutive Sequence <0128-longest-consecutive-sequence.rst>`_；

最小自检
--------

#. ``固定锚点统计规范斜率`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

经过固定锚点的每条直线由规范斜率唯一表示，同一直线点映射到同一键，不同直线映射到不同键。枚举每个锚点覆盖任意最优直线，最大计数加锚点即答案。
