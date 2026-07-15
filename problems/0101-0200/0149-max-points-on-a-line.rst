0149. Max Points on a Line
==========================

题目信息
--------

:题号: 0149
:难度: Hard
:主题: 几何、最大公约数、哈希计数
:原题: `LeetCode 0149 <https://leetcode.com/problems/max-points-on-a-line/>`_
:访问状态: Available
:教学重点: 方向规范化、符号统一、按锚点计数

题目重述
--------

给定平面上两两不同的整数坐标点，返回同一条无限直线上最多包含多少个点。直线可以是水平、竖直或任意斜率，
不能使用浮点斜率作为精确哈希键。

算法
----

固定一个锚点 ``i``，其余每个点 ``j`` 与锚点形成方向向量 ``(dy, dx)``。同一条经过锚点的直线上的点具有
相同方向或完全相反的方向，需要把向量规范成唯一键：

#. 用 ``gcd(abs(dx), abs(dy))`` 同时约分；
#. 若 ``dx < 0``，或 ``dx == 0`` 且 ``dy < 0``，同时翻转两个分量；
#. 以规范后的 ``(dy, dx)`` 作为哈希键计数。

这样所有竖直方向统一为 ``(1, 0)``，水平方向统一为 ``(0, 1)``，互为相反数的向量也会落入同一个键。对每个
锚点，局部最高计数加一就是经过该锚点的最大共线点数；再取所有锚点的最大值。

正确性
~~~~~~

固定锚点后，任意其他点唯一确定一条经过锚点的直线。两个点与锚点共线，当且仅当它们的方向向量互为正比例。
最大公约数约分去除正比例中的整数倍，符号规则再把相反方向统一，因此两个点得到相同键，当且仅当它们位于同一
条经过锚点的直线上。

哈希计数准确记录每条锚点直线包含的其他点数，加上锚点本身得到该直线的点数。每条全局候选直线都包含至少一个
被枚举为锚点的点，所以全局最大值不会遗漏；不同方向键不会被合并，也不会产生虚假的共线关系。算法正确。

复杂度
~~~~~~

设点数为 ``n``。每个锚点扫描其后的点，哈希操作期望 ``O(1)``，总期望时间 ``O(n²)``；单个锚点的哈希表
最多保存 ``O(n)`` 个方向，额外空间 ``O(n)``。C 使用固定容量开放寻址表，负载率保持低于一半；其他语言使用
标准哈希容器，复杂度同样是平均或期望界。R 会为方向键创建字符串，累计分配量为 ``O(n²)``，峰值哈希状态仍为
``O(n)``。坐标差在题目范围内可由普通整数表示，规范化过程中不使用浮点数。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   struct SlopeEntry {
       int dy;
       int dx;
       int count;
       int used;
   };

   static int gcd_abs(int first, int second) {
       first = abs(first);
       second = abs(second);
       while (second != 0) {
           int remainder = first % second;
           first = second;
           second = remainder;
       }
       return first;
   }

   static size_t slope_hash(int dy, int dx) {
       uint64_t first = (uint32_t)dy;
       uint64_t second = (uint32_t)dx;
       uint64_t mixed =
           first * UINT64_C(0x9e3779b185ebca87) ^
           second * UINT64_C(0xc2b2ae3d27d4eb4f);
       return (size_t)(mixed ^ (mixed >> 33));
   }

   int maxPoints(
       int **points,
       int pointsSize,
       int *pointsColSize
   ) {
       (void)pointsColSize;
       if (pointsSize <= 2) {
           return pointsSize;
       }

       size_t capacity = 1;
       while (capacity < (size_t)pointsSize * 4U) {
           capacity <<= 1U;
       }

       struct SlopeEntry *table =
           calloc(capacity, sizeof(*table));
       if (table == NULL) {
           return 0;
       }

       int answer = 2;
       for (int anchor = 0; anchor < pointsSize - 1; ++anchor) {
           memset(table, 0, capacity * sizeof(*table));
           int local_best = 0;

           for (int other = anchor + 1;
                other < pointsSize;
                ++other) {
               int dx = points[other][0] - points[anchor][0];
               int dy = points[other][1] - points[anchor][1];
               int divisor = gcd_abs(dx, dy);
               dx /= divisor;
               dy /= divisor;

               if (dx < 0 || (dx == 0 && dy < 0)) {
                   dx = -dx;
                   dy = -dy;
               }

               size_t index =
                   slope_hash(dy, dx) & (capacity - 1U);
               while (table[index].used &&
                      (table[index].dy != dy ||
                       table[index].dx != dx)) {
                   index = (index + 1U) & (capacity - 1U);
               }

               if (!table[index].used) {
                   table[index].used = 1;
                   table[index].dy = dy;
                   table[index].dx = dx;
                   table[index].count = 1;
               } else {
                   ++table[index].count;
               }

               if (table[index].count > local_best) {
                   local_best = table[index].count;
               }
           }

           if (local_best + 1 > answer) {
               answer = local_best + 1;
           }
       }

       free(table);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>
   #include <numeric>
   #include <unordered_map>
   #include <vector>

   class Solution {
   public:
       int maxPoints(std::vector<std::vector<int>>& points) {
           int n = static_cast<int>(points.size());
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               std::unordered_map<std::uint64_t, int> counts;
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   int divisor = std::gcd(
                       dx < 0 ? -dx : dx,
                       dy < 0 ? -dy : dy
                   );
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   std::uint64_t key =
                       (std::uint64_t(
                           static_cast<std::uint32_t>(dy)
                        ) << 32U) |
                       static_cast<std::uint32_t>(dx);
                   int count = ++counts[key];
                   if (count > localBest) {
                       localBest = count;
                   }
               }
               if (localBest + 1 > answer) {
                   answer = localBest + 1;
               }
           }
           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   from collections import defaultdict
   from math import gcd

   class Solution:
       def maxPoints(self, points: list[list[int]]) -> int:
           n = len(points)
           if n <= 2:
               return n

           answer = 2
           for anchor in range(n - 1):
               counts: dict[tuple[int, int], int] = defaultdict(int)
               local_best = 0

               for other in range(anchor + 1, n):
                   dx = points[other][0] - points[anchor][0]
                   dy = points[other][1] - points[anchor][1]
                   divisor = gcd(abs(dx), abs(dy))
                   dx //= divisor
                   dy //= divisor

                   if dx < 0 or (dx == 0 and dy < 0):
                       dx = -dx
                       dy = -dy

                   direction = (dy, dx)
                   counts[direction] += 1
                   local_best = max(
                       local_best,
                       counts[direction],
                   )

               answer = max(answer, local_best + 1)

           return answer

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       public int maxPoints(int[][] points) {
           int n = points.length;
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               Map<Long, Integer> counts = new HashMap<>();
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   int divisor = gcd(Math.abs(dx), Math.abs(dy));
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   long key =
                       ((long)dy << 32) ^
                       (dx & 0xffffffffL);
                   int count = counts.getOrDefault(key, 0) + 1;
                   counts.put(key, count);
                   localBest = Math.max(localBest, count);
               }
               answer = Math.max(answer, localBest + 1);
           }
           return answer;
       }

       private static int gcd(int first, int second) {
           while (second != 0) {
               int remainder = first % second;
               first = second;
               second = remainder;
           }
           return first;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
           fn gcd(mut first: i32, mut second: i32) -> i32 {
               first = first.abs();
               second = second.abs();
               while second != 0 {
                   let remainder = first % second;
                   first = second;
                   second = remainder;
               }
               first
           }

           let n = points.len();
           if n <= 2 {
               return n as i32;
           }

           let mut answer = 2;
           for anchor in 0..(n - 1) {
               let mut counts: HashMap<(i32, i32), i32> =
                   HashMap::new();
               let mut local_best = 0;

               for other in (anchor + 1)..n {
                   let mut dx =
                       points[other][0] - points[anchor][0];
                   let mut dy =
                       points[other][1] - points[anchor][1];
                   let divisor = gcd(dx, dy);
                   dx /= divisor;
                   dy /= divisor;

                   if dx < 0 || (dx == 0 && dy < 0) {
                       dx = -dx;
                       dy = -dy;
                   }

                   let count = counts.entry((dy, dx)).or_insert(0);
                   *count += 1;
                   local_best = local_best.max(*count);
               }
               answer = answer.max(local_best + 1);
           }
           answer
       }
   }

Go
~~

.. code-block:: go

   type direction struct {
       dy int
       dx int
   }

   func maxPoints(points [][]int) int {
       n := len(points)
       if n <= 2 {
           return n
       }

       answer := 2
       for anchor := 0; anchor < n-1; anchor++ {
           counts := make(map[direction]int)
           localBest := 0

           for other := anchor + 1; other < n; other++ {
               dx := points[other][0] - points[anchor][0]
               dy := points[other][1] - points[anchor][1]
               divisor := gcd(abs(dx), abs(dy))
               dx /= divisor
               dy /= divisor

               if dx < 0 || (dx == 0 && dy < 0) {
                   dx = -dx
                   dy = -dy
               }

               key := direction{dy: dy, dx: dx}
               counts[key]++
               if counts[key] > localBest {
                   localBest = counts[key]
               }
           }
           if localBest+1 > answer {
               answer = localBest + 1
           }
       }
       return answer
   }

   func gcd(first int, second int) int {
       for second != 0 {
           first, second = second, first%second
       }
       return first
   }

   func abs(value int) int {
       if value < 0 {
           return -value
       }
       return value
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function maxPoints(points: number[][]): number {
       const n = points.length;
       if (n <= 2) {
           return n;
       }

       let answer = 2;
       for (let anchor = 0; anchor < n - 1; anchor += 1) {
           const counts = new Map<string, number>();
           let localBest = 0;

           for (let other = anchor + 1; other < n; other += 1) {
               let dx = points[other][0] - points[anchor][0];
               let dy = points[other][1] - points[anchor][1];
               const divisor = gcd(Math.abs(dx), Math.abs(dy));
               dx /= divisor;
               dy /= divisor;

               if (dx < 0 || (dx === 0 && dy < 0)) {
                   dx = -dx;
                   dy = -dy;
               }

               const key = `${dy},${dx}`;
               const count = (counts.get(key) ?? 0) + 1;
               counts.set(key, count);
               localBest = Math.max(localBest, count);
           }
           answer = Math.max(answer, localBest + 1);
       }
       return answer;
   }

   function gcd(first: number, second: number): number {
       while (second !== 0) {
           const remainder = first % second;
           first = second;
           second = remainder;
       }
       return first;
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int MaxPoints(int[][] points) {
           int n = points.Length;
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               var counts =
                   new Dictionary<(int dy, int dx), int>();
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   int divisor = Gcd(Math.Abs(dx), Math.Abs(dy));
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   var key = (dy, dx);
                   counts.TryGetValue(key, out int count);
                   ++count;
                   counts[key] = count;
                   localBest = Math.Max(localBest, count);
               }
               answer = Math.Max(answer, localBest + 1);
           }
           return answer;
       }

       private static int Gcd(int first, int second) {
           while (second != 0) {
               int remainder = first % second;
               first = second;
               second = remainder;
           }
           return first;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function max_points(points::Vector{Vector{Int}})::Int
       n = length(points)
       n <= 2 && return n

       answer = 2
       for anchor in 1:(n - 1)
           counts = Dict{Tuple{Int,Int},Int}()
           local_best = 0

           for other in (anchor + 1):n
               dx = points[other][1] - points[anchor][1]
               dy = points[other][2] - points[anchor][2]
               divisor = gcd(abs(dx), abs(dy))
               dx ÷= divisor
               dy ÷= divisor

               if dx < 0 || (dx == 0 && dy < 0)
                   dx = -dx
                   dy = -dy
               end

               key = (dy, dx)
               count = get(counts, key, 0) + 1
               counts[key] = count
               local_best = max(local_best, count)
           end
           answer = max(answer, local_best + 1)
       end
       return answer
   end

R
~

.. code-block:: r

   max_points <- function(points) {
     n <- nrow(points)
     if (n <= 2L) return(n)

     gcd_int <- function(first, second) {
       first <- abs(first)
       second <- abs(second)
       while (second != 0L) {
         remainder <- first %% second
         first <- second
         second <- remainder
       }
       first
     }

     answer <- 2L
     for (anchor in seq_len(n - 1L)) {
       counts <- new.env(hash = TRUE, parent = emptyenv())
       local_best <- 0L

       for (other in seq.int(anchor + 1L, n)) {
         dx <- points[other, 1L] - points[anchor, 1L]
         dy <- points[other, 2L] - points[anchor, 2L]
         divisor <- gcd_int(dx, dy)
         dx <- dx %/% divisor
         dy <- dy %/% divisor

         if (dx < 0L || (dx == 0L && dy < 0L)) {
           dx <- -dx
           dy <- -dy
         }

         key <- paste0(dy, ",", dx)
         count <- if (exists(
           key,
           envir = counts,
           inherits = FALSE
         )) {
           get(key, envir = counts, inherits = FALSE) + 1L
         } else {
           1L
         }
         assign(key, count, envir = counts)
         local_best <- max(local_best, count)
       }
       answer <- max(answer, local_best + 1L)
     }
     answer
   }

关键边界
--------

* 一个或两个点时答案就是点数；
* 竖直线不能通过除以 ``dx`` 计算斜率；
* ``(1, 1)`` 与 ``(-1, -1)`` 必须归入同一方向；
* ``(1, -1)`` 与 ``(-1, 1)`` 也必须统一符号；
* 约分前必须对绝对值求最大公约数；
* 题目保证点互不重复，因此不会出现需要约分的 ``(0, 0)`` 向量。

验证
----

运行官方示例、全部水平、全部竖直、正负斜率混合和多条直线竞争；Python、C、C++、Go 与 Java 结果一致。另用
叉积基准对 200 组小规模随机互异点集进行针对性对拍，方向规范化结果全部一致。其余语言完成整数除法、哈希键和
符号规则静态检查。

最小自检
--------

#. 为什么不能直接用浮点数 ``dy / dx`` 作为哈希键？
#. 为什么只约分、不统一符号仍会把同一直线拆成两组？
#. 固定锚点计数为什么足以覆盖全局最优直线？
