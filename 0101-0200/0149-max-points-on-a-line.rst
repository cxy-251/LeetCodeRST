0149. Max Points on a Line
==========================

题目信息
--------

:题号: 0149
:难度: Hard
:主题: 几何、最大公约数、哈希计数
:原题: `LeetCode 0149 <https://leetcode.com/problems/max-points-on-a-line/>`_
:重点: 任意直线、点互不重复、共线判定、最大点数

题目重述
--------

给定二维平面上的整数点数组 ``points``，返回能够同时落在同一条直线上的最大点数。直线可以是水平线、竖直线，也可以具有任意其他斜率；答案只统计输入数组中的点。

``points`` 的长度在 ``1..300`` 范围内，每个点都表示为 ``[x, y]``，其中 ``x`` 和 ``y`` 均在 ``-10^4..10^4`` 范围内。输入中的所有点互不重复。

自建示例
--------

.. code-block:: text

   输入：points = [[-2,-1],[0,0],[2,1],[4,2],[0,3]]
   输出：4
   解释：前四个点都满足 y = x / 2，位于同一条直线上；点 [0,3] 不在该直线上。

.. code-block:: text

   输入：points = [[3,-2],[3,1],[3,5],[-1,5],[6,5]]
   输出：3
   解释：三个横坐标为 3 的点位于同一条竖直线上；同时也有三个纵坐标为 5 的点，最大共线点数仍为 3。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <numeric>
   #include <unordered_map>
   #include <utility>
   #include <vector>

   struct PairHash {
       std::size_t operator()(const std::pair<int,int>& p) const {
           return (static_cast<std::uint64_t>(static_cast<std::uint32_t>(p.first)) << 32) ^
                  static_cast<std::uint32_t>(p.second);
       }
   };

   class Solution {
   private:
       int crossProduct(const std::vector<std::vector<int>>& points) {
           int n=points.size(),best=std::min(n,2);
           for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){
               int count=0;
               long long dx=points[j][0]-points[i][0];
               long long dy=points[j][1]-points[i][1];
               for(int k=0;k<n;++k)
                   if(dx*(points[k][1]-points[i][1])==dy*(points[k][0]-points[i][0]))++count;
               best=std::max(best,count);
           }
           return best;
       }

       std::pair<int,int> direction(int dx,int dy) {
           if(dx==0)return {1,0};
           if(dy==0)return {0,1};
           int divisor=std::gcd(std::abs(dx),std::abs(dy));
           dx/=divisor;dy/=divisor;
           if(dx<0){dx=-dx;dy=-dy;}
           return {dy,dx};
       }

       int directionHash(const std::vector<std::vector<int>>& points) {
           int n=points.size(),best=1;
           for(int anchor=0;anchor<n;++anchor){
               std::unordered_map<std::pair<int,int>,int,PairHash> count;
               int local=0;
               for(int j=anchor+1;j<n;++j){
                   auto key=direction(points[j][0]-points[anchor][0],
                                      points[j][1]-points[anchor][1]);
                   local=std::max(local,++count[key]);
               }
               best=std::max(best,local+1);
           }
           return best;
       }

   public:
       int maxPoints(std::vector<std::vector<int>>& points) {
           return directionHash(points);
       }
   };

题解
----

为什么固定锚点
~~~~~~~~~~~~~~

任意包含至少两个点的最优直线都包含某个输入点。固定该点为锚点后，其他点与锚点的方向相同，当且仅当它们位于同一条过锚点直线上。

方向如何规范化
~~~~~~~~~~~~~~

方向向量 ``(dy,dx)`` 先除以 ``gcd(|dy|,|dx|)``。随后要求 ``dx>0``；若 ``dx<0``，两个分量同时取反。竖线统一为 ``(1,0)``，横线统一为 ``(0,1)``。

为什么不能使用 double 斜率
~~~~~~~~~~~~~~~~~~~~~~~~~~

数学上相等的有理数经过浮点除法后可能因舍入得到不同比特模式；竖线还需要无穷大，水平线会遇到 ``0`` 与 ``-0``。约分后的整数对是精确等价类。

锚点覆盖为什么完整
~~~~~~~~~~~~~~~~~~

若最优直线含 ``k`` 个点，选择其中下标最小的点作为锚点时，其余 ``k-1`` 个点都会被扫描并落入同一个方向桶，所以全局最大值不会遗漏。

复杂度来源
~~~~~~~~~~

共有 ``O(n)`` 个锚点，每个锚点扫描 ``O(n)`` 个点，哈希期望时间 ``O(n²)``、空间 ``O(n)``。三点叉积基准为 ``O(n³)``。

九语言实现
----------

C
~

.. code-block:: c

   static int gcd2(int a,int b){a=abs(a);b=abs(b);while(b){int t=a%b;a=b;b=t;}return a;}int maxPoints(int**p,int n,int*cols){if(n<3)return n;int best=1,cap=1024;unsigned long long*keys=malloc((size_t)cap*sizeof(*keys));unsigned short*count=malloc((size_t)cap*sizeof(*count));unsigned char*used=malloc((size_t)cap);for(int i=0;i<n;i++){memset(used,0,(size_t)cap);int local=0;for(int j=i+1;j<n;j++){int dx=p[j][0]-p[i][0],dy=p[j][1]-p[i][1];if(dx==0){dy=1;}else if(dy==0){dx=1;}else{int g=gcd2(dx,dy);dx/=g;dy/=g;if(dx<0){dx=-dx;dy=-dy;}}unsigned long long key=((unsigned long long)(unsigned)dy<<32)|(unsigned)dx;int s=(int)((key^(key>>32))*2654435761u)&(cap-1);while(used[s]&&keys[s]!=key)s=(s+1)&(cap-1);if(!used[s]){used[s]=1;keys[s]=key;count[s]=0;}if(++count[s]>local)local=count[s];}if(local+1>best)best=local+1;}free(keys);free(count);free(used);return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def maxPoints(self, points):
           from collections import defaultdict
           from math import gcd
           best=1
           for i,(x,y) in enumerate(points):
               count=defaultdict(int);local=0
               for x2,y2 in points[i+1:]:
                   dx,dy=x2-x,y2-y
                   if dx==0: key=(1,0)
                   elif dy==0: key=(0,1)
                   else:
                       g=gcd(abs(dx),abs(dy));dx//=g;dy//=g
                       if dx<0: dx,dy=-dx,-dy
                       key=(dy,dx)
                   count[key]+=1;local=max(local,count[key])
               best=max(best,local+1)
           return best

Java
~~~~

.. code-block:: java

   class Solution {int gcd(int a,int b){a=Math.abs(a);b=Math.abs(b);while(b!=0){int t=a%b;a=b;b=t;}return a;}public int maxPoints(int[][]p){int best=1;for(int i=0;i<p.length;i++){Map<Long,Integer>m=new HashMap<>();int local=0;for(int j=i+1;j<p.length;j++){int dx=p[j][0]-p[i][0],dy=p[j][1]-p[i][1];if(dx==0)dy=1;else if(dy==0)dx=1;else{int g=gcd(dx,dy);dx/=g;dy/=g;if(dx<0){dx=-dx;dy=-dy;}}long k=((long)dy<<32)^(dx&0xffffffffL);int c=m.getOrDefault(k,0)+1;m.put(k,c);local=Math.max(local,c);}best=Math.max(best,local+1);}return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn max_points(p:Vec<Vec<i32>>)->i32{fn gcd(mut a:i32,mut b:i32)->i32{a=a.abs();b=b.abs();while b!=0{let t=a%b;a=b;b=t}a}let mut best=1;for i in 0..p.len(){let mut m=std::collections::HashMap::new();let mut local=0;for j in i+1..p.len(){let(mut dx,mut dy)=(p[j][0]-p[i][0],p[j][1]-p[i][1]);if dx==0{dy=1}else if dy==0{dx=1}else{let g=gcd(dx,dy);dx/=g;dy/=g;if dx<0{dx=-dx;dy=-dy}}let c=m.entry((dy,dx)).or_insert(0);*c+=1;local=local.max(*c)}best=best.max(local+1)}best}}

Go
~~

.. code-block:: go

   func maxPoints(p [][]int)int{gcd:=func(a,b int)int{if a<0{a=-a};if b<0{b=-b};for b!=0{a,b=b,a%b};return a};best:=1;for i:=range p{m:=map[[2]int]int{};local:=0;for j:=i+1;j<len(p);j++{dx,dy:=p[j][0]-p[i][0],p[j][1]-p[i][1];if dx==0{dy=1}else if dy==0{dx=1}else{g:=gcd(dx,dy);dx/=g;dy/=g;if dx<0{dx=-dx;dy=-dy}};k:=[2]int{dy,dx};m[k]++;if m[k]>local{local=m[k]}};if local+1>best{best=local+1}};return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPoints(p:number[][]):number{const gcd=(a:number,b:number)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a};let best=1;for(let i=0;i<p.length;i++){const m=new Map<string,number>();let local=0;for(let j=i+1;j<p.length;j++){let dx=p[j][0]-p[i][0],dy=p[j][1]-p[i][1];if(dx===0)dy=1;else if(dy===0)dx=1;else{const g=gcd(dx,dy);dx/=g;dy/=g;if(dx<0){dx=-dx;dy=-dy}}const k=`${dy}/${dx}`,c=(m.get(k)||0)+1;m.set(k,c);local=Math.max(local,c)}best=Math.max(best,local+1)}return best;}

C#
~~

.. code-block:: csharp

   public class Solution {int Gcd(int a,int b){a=Math.Abs(a);b=Math.Abs(b);while(b!=0){int t=a%b;a=b;b=t;}return a;}public int MaxPoints(int[][]p){int best=1;for(int i=0;i<p.Length;i++){var m=new Dictionary<(int,int),int>();int local=0;for(int j=i+1;j<p.Length;j++){int dx=p[j][0]-p[i][0],dy=p[j][1]-p[i][1];if(dx==0)dy=1;else if(dy==0)dx=1;else{int g=Gcd(dx,dy);dx/=g;dy/=g;if(dx<0){dx=-dx;dy=-dy;}}var k=(dy,dx);m[k]=m.GetValueOrDefault(k)+1;local=Math.Max(local,m[k]);}best=Math.Max(best,local+1);}return best;}}

Julia
~~~~~

.. code-block:: julia

   function max_points(p)
       best=1
       for i in eachindex(p);m=Dict{Tuple{Int,Int},Int}();local=0
           for j in i+1:length(p);dx=p[j][1]-p[i][1];dy=p[j][2]-p[i][2]
               if dx==0;dy=1;elseif dy==0;dx=1;else;g=gcd(abs(dx),abs(dy));dx÷=g;dy÷=g;if dx<0;dx=-dx;dy=-dy;end;end
               k=(dy,dx);m[k]=get(m,k,0)+1;local=max(local,m[k])
           end
           best=max(best,local+1)
       end
       best
   end

R
~

.. code-block:: r

   max_points <- function(p){gcd<-function(a,b){a<-abs(a);b<-abs(b);while(b!=0){tmp<-a%%b;a<-b;b<-tmp};a};best<-1L;for(i in seq_len(nrow(p))){m<-new.env(hash=TRUE,parent=emptyenv());local<-0L;if(i<nrow(p))for(j in (i+1L):nrow(p)){dx<-p[j,1]-p[i,1];dy<-p[j,2]-p[i,2];if(dx==0)dy<-1 else if(dy==0)dx<-1 else{g<-gcd(dx,dy);dx<-dx/g;dy<-dy/g;if(dx<0){dx<--dx;dy<--dy}};k<-paste(dy,dx,sep="/");v<-if(exists(k,m,inherits=FALSE))get(k,m)+1L else 1L;assign(k,v,m);local<-max(local,v)};best<-max(best,local+1L)};best}