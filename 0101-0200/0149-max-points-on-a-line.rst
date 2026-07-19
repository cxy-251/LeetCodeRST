0149. Max Points on a Line
==========================

题目信息
--------

:题号: 0149
:难度: Hard
:主题: 几何、最大公约数、哈希计数
:原题: `LeetCode 0149 <https://leetcode.com/problems/max-points-on-a-line/>`_
:访问状态: Available
:教学重点: 整数方向等价类、规范代表、锚点覆盖、哈希复杂度边界

精确契约
--------

输入 ``points`` 含 ``n`` 个二维整数点，每行恰有 ``[x, y]`` 两个坐标，并满足：

* ``1 <= n <= 300``；
* ``-10000 <= x, y <= 10000``；
* 所有点两两不同；
* 输入只读，点的排列顺序本身没有几何含义，但会决定本文只扫描后续下标时的枚举方向。

返回一条无限直线上最多包含的输入点数，结果在 ``1..n`` 内。直线包括水平线、竖直线和一般斜线。本文只做
整数减法、最大公约数、整除和哈希，不修改点、不使用浮点斜率，也不构造直线方程的浮点系数。

两点不同这一强前提很重要：固定锚点后，任意另一个点产生的方向向量都不是 ``(0,0)``，所以约分用的最大公约数
严格为正。若扩展到允许重复点，必须另设重复计数；不能让 ``gcd(0,0)=0`` 后继续除法。

自建示例与反例
--------------

多方向竞争
~~~~~~~~~~~~

令锚点为 ``O(0,0)``，其后依次有：

``A(2,2), B(-1,-1), C(0,3), D(0,-2), E(3,0), F(1,-2), G(-1,2)``。

键统一写成 ``(dy, dx)``。以 O 为锚点的纸面规范化如下：

.. list-table::
   :header-rows: 1

   * - 点
     - 原方向 ``(dy,dx)``
     - ``gcd``
     - 规范键
     - 该键累计
   * - A
     - ``(2,2)``
     - 2
     - ``(1,1)``
     - 1
   * - B
     - ``(-1,-1)``
     - 1
     - ``(1,1)``
     - 2
   * - C
     - ``(3,0)``
     - 3
     - ``(1,0)``
     - 1
   * - D
     - ``(-2,0)``
     - 2
     - ``(1,0)``
     - 2
   * - E
     - ``(0,3)``
     - 3
     - ``(0,1)``
     - 1
   * - F
     - ``(-2,1)``
     - 1
     - ``(-2,1)``
     - 1
   * - G
     - ``(2,-1)``
     - 1
     - ``(-2,1)``
     - 2

O、A、B 在正斜率直线上，O、C、D 在竖直线上，O、F、G 在负斜率直线上，三条线竞争且都含 3 个点；E 展示
水平键。其余点对不会形成含 4 点的直线，所以答案是 3。这个例子同时区分了“只约分”和“约分后统一方向”：
若不统一符号，A/B、C/D、F/G 都会被拆成两桶。

浮点斜率为何不适合作为合同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对锚点 ``O(0,0)``，点 ``P(0,2)`` 和 ``Q(0,-3)`` 在同一条竖直线上，但直接计算 ``dy/dx`` 可能得到
``+Inf`` 与 ``-Inf``，或在不支持相应浮点除零语义的语言中失败。即使把斜率格式化后作为文本键也不可靠：
``(10000,1)`` 与 ``(9999,1)`` 是不同方向，但四位小数舍入都可能变成 ``0.0001``。整数本原方向不依赖除零、
舍入精度或格式化规则，正确性可以直接由整除和符号规则证明。

问题抽象与解法选择
------------------

任意一条含至少两个输入点的直线，都能由其中一个点作为锚点、再由另一个点给出方向。于是问题可改写成：

``对每个锚点，把其他点按“经过锚点的同一条直线”分组，取最大组大小再加锚点。``

难点在于直线没有直接可哈希的唯一表示。固定锚点后，方向向量 ``(dy,dx)`` 足以表示直线；把向量除以两分量绝对值
的最大公约数，再统一正反号，就得到该方向等价类的唯一整数代表。

主方案与替代方法的取舍如下：

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 峰值工作空间
     - 取舍
   * - 锚点 + 规范方向哈希
     - 平均/期望 ``O(n² log C)``
     - ``O(n)``
     - 主解法；直接统计每条锚点直线
   * - 每对点构造一般式并收集整条直线
     - 可达 ``O(n³)``
     - 视去重结构而定
     - 同一条线会被许多点对重复发现
   * - 每个锚点排序所有方向
     - ``O(n² log n)``
     - ``O(n)``
     - 不依赖哈希平均界，但排序和临时数组成本更高
   * - 浮点斜率哈希
     - 表面上 ``O(n²)``
     - ``O(n)``
     - 竖直方向、符号和舍入使精确等价合同脆弱

这里 ``C`` 是坐标差绝对值上界，官方输入中 ``C <= 20000``。在固定官方范围内 ``log C`` 是小常数，通常把
主方案写成平均或期望 ``O(n²)``；保留 ``log C`` 能准确反映欧几里得算法的算术成本。

方向规范化
----------

固定锚点 ``points[anchor]``，对后续点 ``points[other]`` 计算：

``dx = x_other - x_anchor``，``dy = y_other - y_anchor``。

坐标差在 ``[-20000,20000]`` 内。规范化执行三步：

#. ``g = gcd(abs(dx), abs(dy))``；互异点保证 ``g > 0``；
#. 令 ``dx = dx / g``、``dy = dy / g``，得到互质分量；
#. 若 ``dx < 0``，或 ``dx == 0`` 且 ``dy < 0``，同时取反 ``dx`` 与 ``dy``。

最终必有以下规范形态之一：

* ``dx > 0``，``dy`` 可正、可零、可负；
* ``dx == 0`` 且 ``dy == 1``，表示竖直方向。

因此水平线唯一为 ``(dy,dx)=(0,1)``，竖直线唯一为 ``(1,0)``。一般方向两分量互质，正反向只保留
``dx > 0`` 的一方。

状态与代码映射
--------------

``anchor``
   当前锚点下标，范围 ``0..n-2``；Julia/R 对应 ``1..n-1``。

``other``
   当前被归类点的下标，严格大于 ``anchor``。这不是几何方向限制，只是让每个无序点对处理一次。

``dx``、``dy``、``divisor``
   原整数方向及其正最大公约数；除法后 ``dx``、``dy`` 就是规范键的两个分量。

``counts``
   当前锚点专用的方向表。``counts[(dy,dx)]`` 是已扫描后续点中落在该锚点直线上的点数，不含锚点。

``local_best``
   当前 ``counts`` 的最大桶值；候选直线点数为 ``local_best + 1``。

``answer``
   已完成锚点和当前更新中见过的最大候选点数。

C 的 ``table`` 保存完整 ``dy``、``dx``、计数和占用标记。哈希值只决定初始槽；发生哈希碰撞时仍比较两个方向
分量，并线性探测到相同键或空槽。因此“哈希值相同”不会被误当成“方向相同”。

算法
----

#. 若 ``n <= 2``，任意两个不同点都确定一条直线，直接返回 ``n``。
#. 初始化 ``answer = 2``。
#. 枚举 ``anchor = 0..n-2``：

   #. 建立空方向表，令 ``local_best = 0``；
   #. 枚举所有 ``other = anchor+1..n-1``；
   #. 计算并规范化 ``(dy,dx)``；
   #. 对该键的桶加一，更新 ``local_best``；
   #. 内层结束后用 ``local_best + 1`` 更新 ``answer``。

#. 返回 ``answer``。

本文不加入提前剪枝。这样每个点对的覆盖范围一致，证明和十语言控制流完全对应；``n <= 300`` 下也不需要用
更复杂的上界分支换取常数优化。

核心不变量
----------

本原方向不变量
~~~~~~~~~~~~~~~~

规范化完成后，``gcd(abs(dx),abs(dy)) = 1``，并满足 ``dx > 0`` 或 ``(dx,dy)=(0,1)``。原向量等于
规范向量乘以某个非零整数，可能还带一个被符号规则吸收的负号。因此规范化不改变方向所在的无向直线。

方向桶不变量
~~~~~~~~~~~~

固定锚点，处理完 ``anchor+1..other`` 后，每个键的桶值恰等于这段已处理点中与锚点形成该规范方向的点数。
每个点只计算一个键并只增加一个桶，所以桶之间不重不漏。

局部最大不变量
~~~~~~~~~~~~~~

每次增桶后，``local_best`` 等于当前所有桶值的最大值。桶不含锚点，故 ``local_best + 1`` 是已扫描点中经过
当前锚点的最大直线规模。

全局答案不变量
~~~~~~~~~~~~~~

完成一个锚点后，``answer`` 等于所有已完成锚点候选的最大值。内层只扫描后续下标，某些较晚锚点看不到较早点；
全局完整性不是靠每个锚点看见整条线，而是靠最优直线上下标最小的点作为见证。

正确性证明
----------

引理一：每个非零整数方向都有唯一规范键
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

方向非零，所以 ``g = gcd(abs(dx),abs(dy)) > 0``。除以 g 后两分量互质，且仍与原向量平行。若约分结果的
``dx < 0``，同时取反使 ``dx > 0``；若 ``dx = 0``，互质性迫使 ``abs(dy)=1``，符号规则保留 ``dy=1``。
因此每个方向的正反两个向量都映射到一个满足规范形态的键。

反过来，两个不同规范键不可能代表同一无向方向：若两个互质整数向量平行，它们只能互为正负；规范符号又排除了
负号，所以它们必须逐分量相同。唯一性成立。

引理二：固定锚点时，两个点落入同一桶当且仅当三点共线
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若两个点落入同一键，由引理一，它们相对锚点的原方向都是该规范向量的非零整数倍，两个方向互相成比例，三点共线。
若三点共线，两条非零整数方向互相成有理比例；各自除去分量最大公约数后，只可能得到同一个本原向量或其相反数，
再经符号规则必得到同一键。因此桶与“经过固定锚点的直线”一一对应。

引理三：``local_best + 1`` 是当前锚点在后续点中的最大直线规模
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

方向桶不变量和引理二说明，每个桶准确包含一条锚点直线上的所有已扫描后续点，且没有异线点混入。最大桶给出最多
的其他点数；锚点自身尚未计入且恰好应加一次，所以候选是 ``local_best + 1``。

引理四：只扫描 ``other > anchor`` 不会漏掉全局最优直线
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设一条全局最优直线 L 含 r 个点。若 ``n=1``，入口已直接返回。否则 ``r >= 2``。在 L 的所有输入点中选择下标
最小者 i；i 至多为 ``n-2``，所以会成为锚点。L 上其余 ``r-1`` 个点的下标都大于 i，全部进入 i 的内层循环，
并由引理二落入同一桶。故锚点 i 的候选至少为 r，算法不会低估最优值。

另一方面，每个桶都对应一条真实直线，任何候选都不可能超过全局最优值 r。因此算法既不低估也不高估。

定理：算法返回同一直线上的最大点数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理三保证每个记录候选合法，引理四保证至少一个锚点完整发现全局最优直线；全局答案不变量取所有候选最大值。
两个有限循环的下标都严格增加，欧几里得算法的第二参数严格减小，故算法终止并返回正确答案。

复杂度与真实语言成本
--------------------

处理的点对总数是 ``n(n-1)/2``。每对点做常数次整数操作和一次欧几里得算法，后者为 ``O(log C)``；哈希表
查找与更新在通常的平均或期望模型下为 ``O(1)``。因此参数化时间为平均/期望 ``O(n² log C)``，官方固定坐标
范围下通常简写为 ``O(n²)``。C 每个锚点还清空 ``O(n)`` 容量的表，累计仍为 ``O(n²)``。

不能把哈希平均界写成无条件最坏界。C 线性探测在极端聚簇时一次操作可扫描 ``O(n)`` 个槽，保守最坏时间可达
``O(n³ + n² log C)``；标准哈希容器的最坏界和抗碰撞策略依运行库而异。Rust 默认哈希器带随机种子，但本文仍不
把通常性能表述成确定最坏常数。

单个锚点最多保存 ``n-1`` 个方向，峰值核心空间 ``O(n)``，返回值只是一个整数。进一步的语言成本包括：

* C 只分配一次容量为 ``O(n)`` 的表并逐锚点复用；容量是至少 ``4n`` 的二次幂，负载严格低于四分之一；
* C++/Java/Python/Rust/Go/TypeScript/C#/Julia 每个锚点建立新表，峰值仍为 ``O(n)``，累计分配或初始化量可达
  ``O(n²)``；垃圾回收运行时可能暂时保留已经不可达的内部容量；
* TypeScript 与 R 为每个点对创建规范文本键，参数化字符分配为 ``O(n² log C)``，同时存活的键载荷
  ``O(n log C)``；官方范围固定时分别简写为累计 ``O(n²)``、峰值 ``O(n)``；
* Java 的 ``Long``/``Integer`` 键值产生装箱；C# ``ValueTuple`` 在泛型字典中仍是值类型键，但字典与其他容器
  都有桶和容量元数据，渐进峰值仍为 ``O(n)``；
* Rust 按值接收并取得输入 ``Vec`` 的所有权，但不克隆点；其他实现也不修改输入。输入本身不计为工作空间。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>
   #include <string.h>

   struct DirectionEntry {
       int dy;
       int dx;
       int count;
       unsigned char used;
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

   static size_t direction_hash(int dy, int dx) {
       uint64_t value =
           ((uint64_t)(uint32_t)dy << 32U) |
           (uint64_t)(uint32_t)dx;
       value ^= value >> 33U;
       value *= UINT64_C(0xff51afd7ed558ccd);
       value ^= value >> 33U;
       value *= UINT64_C(0xc4ceb9fe1a85ec53);
       value ^= value >> 33U;
       return (size_t)value;
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

       size_t capacity = 1U;
       while (capacity < (size_t)pointsSize * 4U) {
           capacity <<= 1U;
       }

       struct DirectionEntry *table =
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
                   direction_hash(dy, dx) & (capacity - 1U);
               while (table[index].used != 0U &&
                      (table[index].dy != dy ||
                       table[index].dx != dx)) {
                   index = (index + 1U) & (capacity - 1U);
               }

               if (table[index].used == 0U) {
                   table[index].used = 1U;
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

   #include <cstddef>
   #include <cstdint>
   #include <numeric>
   #include <unordered_map>
   #include <vector>

   class Solution {
       static std::uint64_t directionKey(int dy, int dx) {
           return
               (static_cast<std::uint64_t>(
                    static_cast<std::uint32_t>(dy)
                ) << 32U) |
               static_cast<std::uint32_t>(dx);
       }

   public:
       int maxPoints(std::vector<std::vector<int>>& points) {
           const int n = static_cast<int>(points.size());
           if (n <= 2) {
               return n;
           }

           int answer = 2;
           for (int anchor = 0; anchor < n - 1; ++anchor) {
               std::unordered_map<std::uint64_t, int> counts;
               counts.reserve(static_cast<std::size_t>(
                   n - anchor - 1
               ));
               int localBest = 0;

               for (int other = anchor + 1; other < n; ++other) {
                   int dx =
                       points[other][0] - points[anchor][0];
                   int dy =
                       points[other][1] - points[anchor][1];
                   const int divisor = std::gcd(dx, dy);
                   dx /= divisor;
                   dy /= divisor;

                   if (dx < 0 || (dx == 0 && dy < 0)) {
                       dx = -dx;
                       dy = -dy;
                   }

                   const std::uint64_t key = directionKey(dy, dx);
                   const int count = ++counts[key];
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

   from math import gcd


   class Solution:
       def maxPoints(self, points: list[list[int]]) -> int:
           n = len(points)
           if n <= 2:
               return n

           answer = 2
           for anchor in range(n - 1):
               counts: dict[tuple[int, int], int] = {}
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

                   key = (dy, dx)
                   count = counts.get(key, 0) + 1
                   counts[key] = count
                   local_best = max(local_best, count)

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
                       ((long)dy << 32) | (dx & 0xffffffffL);
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

           let mut answer = 2_i32;
           for anchor in 0..(n - 1) {
               let mut counts: HashMap<(i32, i32), i32> =
                   HashMap::with_capacity(n - anchor - 1);
               let mut local_best = 0_i32;

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
           counts := make(map[direction]int, n-anchor-1)
           localBest := 0

           for other := anchor + 1; other < n; other++ {
               dx := points[other][0] - points[anchor][0]
               dy := points[other][1] - points[anchor][1]
               divisor := gcdInt(absInt(dx), absInt(dy))
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

   func gcdInt(first int, second int) int {
       for second != 0 {
           first, second = second, first%second
       }
       return first
   }

   func absInt(value int) int {
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
               const divisor = gcdInt(Math.abs(dx), Math.abs(dy));
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

   function gcdInt(first: number, second: number): number {
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

     n <- nrow(points)
     if (n <= 2L) return(n)

     answer <- 2L
     for (anchor in seq_len(n - 1L)) {
       counts <- new.env(
         hash = TRUE,
         parent = emptyenv(),
         size = 2L * n
       )
       local_best <- 0L

       for (other in seq.int(anchor + 1L, n)) {
         dx <- as.integer(
           points[other, 1L] - points[anchor, 1L]
         )
         dy <- as.integer(
           points[other, 2L] - points[anchor, 2L]
         )
         divisor <- gcd_int(dx, dy)
         dx <- as.integer(dx %/% divisor)
         dy <- as.integer(dy %/% divisor)

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

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，没有执行官方示例、随机对拍、穷举、属性测试、sanitizer 或目标语言
最小程序。以下结果均来自纸面推演、整数推导和逐语言静态语义审查。

官方示例纸面推演
~~~~~~~~~~~~~~~~

* ``[[1,1],[2,2],[3,3]]``：以首点为锚，后两点原方向分别是 ``(1,1)``、``(2,2)``，都规范为
  ``(1,1)``；桶值为 2，加锚点得到 3。
* 第二个官方示例中，以 ``P0=(1,1)`` 为锚时，``P1=(3,2)`` 与 ``P2=(5,3)`` 的键同为
  ``(1,2)``，局部候选是 3，还没有发现答案 4。选择最优直线上下标最小的 ``P1=(3,2)`` 为锚：
  ``P3=(4,1)``、``P4=(2,3)``、``P5=(1,4)`` 的原方向分别为 ``(-1,1)``、``(1,-1)``、
  ``(2,-2)``，规范后都为 ``(-1,1)``；桶值 3，加锚点得到 4。其余锚点没有更大桶。

规范化边界推导
~~~~~~~~~~~~~~

以原方向 ``(dy,dx)`` 记录：

* ``(2,2)`` 与 ``(-2,-2)`` 都变为 ``(1,1)``；
* ``(3,0)`` 与 ``(-5,0)`` 都变为竖直键 ``(1,0)``；
* ``(0,4)`` 与 ``(0,-7)`` 都变为水平键 ``(0,1)``；
* ``(1,1)`` 保持 ``(1,1)``，``(1,-1)`` 翻转为 ``(-1,1)``，二者不会碰撞；
* 一个点和两个点分别由入口返回 1、2；全部共线时，最小下标锚点的唯一桶达到 ``n-1``；
* 互异点保证不出现 ``(0,0)``，所以每个代码路径中的 divisor 都严格为正。

C 表结构专项审查
~~~~~~~~~~~~~~~~

``capacity`` 从 1 翻倍到不小于 ``4*n``，所以是二次幂；在 ``n<=300`` 下容量乘法、左移和分配大小都远小于
``size_t`` 上界。每个锚点最多插入 ``n-1`` 个不同方向，负载低于四分之一，表内必有空槽，线性探测必终止。
哈希混合全部在 ``uint64_t`` 中按模 ``2^64`` 运算；有符号分量先转 ``uint32_t``，映射保留完整 32 位模式。
即使哈希值相同，槽位比较仍检查 ``dy`` 与 ``dx``，不会合并不同方向。

``calloc`` 失败时返回 0；合法答案至少为 1，所以它是可区分的资源失败哨兵，但 LeetCode 的整数返回接口没有正式
错误通道，调用平台只能把它视为运行环境超出题目合同。成功路径在唯一出口前 ``free(table)``；分配前的
``n<=2`` 返回没有资源，分配后没有其他提前返回。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：坐标差、绝对值和取负都在 ``int`` 安全范围；C 的完整双分量解决哈希碰撞。C++ 依赖 C++17
  ``std::gcd``，64 位键由两个 ``uint32_t`` 位模式无重叠拼接，因此不同有序整数对不会得到同一键。
* **Python / Java**：Python ``//`` 对负数向下取整，但 divisor 整除分量，所以商正好是整数，不受舍入方向影响。
  Java 在求 gcd 前对安全范围差值取绝对值；``((long)dy << 32) | low32(dx)`` 保留两个分量全部位。
  ``getOrDefault`` 的默认 0 与尚未出现分开，计数首次写入 1。
* **Rust**：``i32`` 覆盖差值和取负；``(i32,i32)`` 实现 ``Eq``/``Hash``，``entry().or_insert(0)`` 返回当前
  桶的可变引用。默认 ``HashMap`` 使用随机种子，但复杂度仍只声明通常/期望界。输入 Vec 被消费而不克隆。
* **Go**：规范要求 ``int`` 至少有 32 位，本题差值安全；只含两个 ``int`` 的 struct 可比较，可直接作 map 键。
  多重赋值在 gcd 中使用旧 ``first``、``second`` 同时计算新值。
* **TypeScript**：所有数值不超过 20000，减法、余数和整除结果都在 ``number`` 安全整数范围，且没有使用会强制
  转 32 位的位运算。规范整数再以逗号分隔，``(1,23)`` 与 ``(12,3)`` 等键不会粘连；``?? 0`` 只处理缺键。
* **C#**：``Math.Abs`` 输入不可能是 ``int.MinValue``；``ValueTuple<int,int>`` 按两个位置结构相等并提供字典
  哈希语义，字段名不参与相等性但分量次序固定为 ``(dy,dx)``。
* **Julia**：入口先处理 ``n<=2``，所以 ``1:(n-1)`` 与 ``(anchor+1):n`` 都是合法非空正向范围；一基坐标
  ``[1]``/``[2]`` 分别映射 x/y。``Int``、``Tuple``、``Dict`` 和精确整除覆盖当前值域。
* **R**：入口保证两个 ``seq`` 的起点不超过终点；差值和整除结果显式收窄为安全整数。逗号分隔键由规范整数
  生成，``new.env(hash=TRUE)`` 提供哈希帧，``inherits=FALSE`` 防止误读外层同名绑定，``assign`` 接受这种
  非语法名称。旧环境逐锚点变为不可达，累计分配与垃圾回收保留量不能冒充峰值核心状态。

剩余风险
~~~~~~~~

静态审查不能替代目标编译器、解释器或判题模板。当前未确认项包括：各平台实际编译版本与导入模板、C++/Java
标准容器在宿主实现中的具体扩容行为、Rust/Go/C# 元组或结构键的实际运行时布局、Julia 平台点容器是否恰为
``Vector{Vector{Int}}``、R 适配层是否恰以二维矩阵传点，以及内存分配失败或哈希极端碰撞时的宿主行为。本文没有
把这些项目写成“通过”。

关键边界与失败方式
------------------

* 使用 ``dy/dx`` 会遇到竖直除零；把斜率舍入成文本还会把不同方向合并。
* 只除以 gcd、不统一符号，会把锚点两侧的同一直线分成两个桶。
* 只规定 ``dx >= 0`` 却不处理 ``dx=0`` 时的 dy 符号，仍会产生两个竖直键。
* 键必须同时含 dy 和 dx；只存交叉乘积、和、异或或无分隔拼接都可能碰撞。
* ``gcd`` 必须取分量绝对值或使用保证返回非负值的库；负 divisor 会破坏统一形态。
* 桶只计其他点，更新答案时必须加一且只能加一次锚点。
* 只扫描后续点时，不能声称每个锚点都看见整条线；完整性见证是该线的最小输入下标点。
* 若题目允许重复点，``(0,0)`` 既不能代表方向也不能除以 gcd；必须单独累计重复点后加入局部答案。
* 64 位打包前要先把每个有符号分量转成对应 32 位模式；窄移位或未遮罩低半会丢位。
* 平均哈希 ``O(1)`` 不是最坏保证；复杂度结论必须注明平均/期望条件和碰撞退化。
* C 分配失败返回 0 是接口限制下的哨兵，不是合法几何答案，也不能遗漏成功路径的释放。

学习链与知识更新
----------------

本题把“相等对象计数”提升为“先构造等价类的规范代表，再哈希计数”。关键不是选了哪种容器，而是证明规范函数
满足两件事：同类对象一定同键，不同类对象一定不同键。最大公约数删除整数尺度，符号规则删除无向直线的正反向，
两者共同完成这个充要合同。

新增或强化的知识点包括：

* 本原整数向量是有理方向的精确规范代表；
* 枚举一半点对后的全局完整性可以由最小输入下标见证，而不是要求每个局部状态完整；
* 结构化键、无碰撞位打包和“哈希后再比较完整键”是三种不同的精确键策略；
* 算法的通常 ``O(n²)`` 必须与 gcd 成本、哈希最坏退化、文本键分配和 C 失败路径一起报告；
* 关联到 `0001. Two Sum <../0001-0100/0001-two-sum.rst>`_ 的哈希桶语义，但本题先要证明几何等价类；
* 关联到后续叉积类几何题：叉积适合判定三点共线，规范方向更适合按锚点分组计数。

带答案自检
----------

#. **为什么不能只用 ``gcd`` 约分，不做符号统一？**

   同一直线在锚点两侧产生互为相反数的本原向量，会被分进两个键。

#. **为什么竖直方向最终一定是 ``(1,0)``？**

   ``dx=0`` 且方向非零，除以 ``abs(dy)`` 后 dy 只能是 ``±1``；符号规则把负值翻为 1。

#. **两个规范键相同为什么足以推出共线？**

   两个原方向都是同一本原向量的非零整数倍，所以互相成比例，并共享锚点。

#. **只扫描 ``other > anchor`` 为什么不漏最优线？**

   取最优线上输入下标最小的点为锚，线上所有其他点都在它的后续扫描范围内。

#. **桶值为什么要加一？**

   桶只统计相对当前锚点的其他点，锚点本身属于该直线但没有存入任何桶。

#. **官方范围内整数运算为什么安全？**

   坐标差绝对值最多 20000，gcd、整除和取负都远离 32 位有符号边界；点数和桶计数最多 300。

#. **C 表负载低为什么仍只写平均哈希界？**

   低负载保证一定能遇到空槽并终止，却不能排除许多键聚集在连续槽位导致长探测链。

#. **TypeScript/R 为什么使用分隔符文本键？**

   两分量是小范围规范整数，逗号让编码可逆，避免无分隔拼接碰撞；代价是每对点产生字符串分配。
