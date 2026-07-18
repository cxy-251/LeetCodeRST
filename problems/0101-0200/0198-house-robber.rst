0198. House Robber
==================

题目信息
--------

:题号: 0198
:难度: Medium
:主题: 动态规划、前缀最优、相邻排斥、滚动状态
:原题: `LeetCode 0198 <https://leetcode.com/problems/house-robber/>`_
:访问状态: Available
:教学重点: 最后一间二分、前缀递推、滚动变量不变量、宽整数边界

精确契约
--------

给定非负整数数组 ``nums``，``nums[i]`` 表示第 ``i`` 间房屋中可取得的金额。房屋按一条直线排列，
不能在同一方案中选择两间相邻房屋。返回所有合法选择方案能够取得的最大金额。

题目条件包含：

* 官方范围是 ``1 <= nums.length <= 100``、``0 <= nums[i] <= 400``；本章实现额外兼容
  空数组并返回 ``0``；
* 每个金额非负，因此完全不选择任何房屋始终是合法的 ``0`` 下界；
* 只能决定某间房屋选或不选，不能拆分金额；
* 输入数组只读；
* 返回值是最大金额，不要求恢复具体选择了哪些房屋。

相邻限制针对数组位置。两个金额相同的房屋仍是不同位置；若位置相邻，就不能同时选择。

示例与反例
----------

基础示例
~~~~~~~~

``nums=[1,2,3,1]``。

最优方案选择第 1 间和第 3 间，金额为 ``1+3=4``。选择 ``2+1=3`` 较小，所以答案是 ``4``。

跨越多个局部高点
~~~~~~~~~~~~~~~~

``nums=[2,7,9,3,1]``。

最优方案是选择金额 ``2``、``9`` 和 ``1``，总金额 ``12``。只观察相邻两间并选择较大值，
可能先选择 ``7``，随后丢失与 ``9`` 组合的机会，因此局部贪心不能保证全局最优。

单间与两间
~~~~~~~~~~

* ``nums=[8]``：只能选择这间或不选，答案为 ``8``；
* ``nums=[2,7]``：两间相邻，只能选其中一间，答案为 ``7``。

全零与空输入扩展
~~~~~~~~~~~~~~~~

* ``nums=[0,0,0]``：任意合法方案金额都是 ``0``，答案为 ``0``；
* ``nums=[]``：属于本章额外兼容边界，没有房屋可选，返回 ``0``。

交替大值
~~~~~~~~

``nums=[10,1,10,1,10]`` 时可以选择三个 ``10``，答案为 ``30``。状态必须允许跨过一间房屋继续累积，
不能只保留当前相邻对的信息。

问题抽象与解法选择
------------------

设 ``F(i)`` 表示只考虑前 ``i`` 间房屋时能够取得的最大金额。这里 ``i`` 是房屋数量：

* ``F(0)=0``；
* 为了统一第一间房屋的转移，定义扩展边界 ``F(-1)=0``；
* 最终目标是 ``F(n)``。

考虑前 ``i`` 间房屋中的最后一间，也就是数组下标 ``i-1``。任意合法最优方案只有两类：

#. **不选择最后一间。** 方案完全位于前 ``i-1`` 间，最优值为 ``F(i-1)``；
#. **选择最后一间。** 倒数第二间必须不选，剩余部分只能来自前 ``i-2`` 间，最优值为
   ``F(i-2)+nums[i-1]``。

所以递推式是：

.. math::

   F(i)=\max(F(i-1),F(i-2)+nums[i-1])

完整 DP 数组只会被访问最近两个位置，因此可以压缩成两个滚动变量。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 核心额外空间
     - 取舍
   * - 前缀 DP + 两变量滚动
     - ``O(n)``
     - ``O(1)``
     - 主解法；状态和证明直接对应
   * - 完整一维 DP 数组
     - ``O(n)``
     - ``O(n)``
     - 便于观察每个前缀，但保存了最终不再需要的历史状态
   * - 记忆化递归
     - ``O(n)``
     - ``O(n)``
     - 递推自然，但包含递归栈和记忆表
   * - 每对相邻房屋选择较大者
     - ``O(n)``
     - ``O(1)``
     - 局部决策会影响下一对，不能保证全局最优
   * - 枚举所有子集
     - ``O(2^n)``
     - ``O(n)``
     - 只能作为极小输入的概念基准

滚动状态与核心不变量
--------------------

初始化：

.. code-block:: text

   previous_two = 0
   previous_one = 0

在处理第 ``i`` 个数组元素前，已经处理了前 ``i`` 间房屋，并保持：

* ``previous_one = F(i)``：前 ``i`` 间房屋的最优金额；
* ``previous_two = F(i-1)``：前 ``i-1`` 间房屋的最优金额；
* 当 ``i=0`` 时，两个变量都为 ``0``，其中 ``previous_two`` 对应扩展边界 ``F(-1)=0``；
* 两个状态都来自合法的非相邻选择方案；
* 输入数组没有被修改。

当前金额为 ``value=nums[i]`` 时：

.. code-block:: text

   skip_current = previous_one
   take_current = previous_two + value
   current = max(skip_current, take_current)

必须先计算 ``current``，再整体推进：

.. code-block:: text

   previous_two = previous_one
   previous_one = current

推进后，``previous_one`` 变为 ``F(i+1)``，``previous_two`` 变为 ``F(i)``，不变量进入下一轮。

为什么更新顺序不能交换
~~~~~~~~~~~~~~~~~~~~~~

若先执行 ``previous_two = previous_one``，再计算 ``previous_two + value``，选择当前房屋的
分支就会错误读取 ``F(i)`` 而不是 ``F(i-1)``。这等价于允许当前房屋与前一间房屋同时进入方案，
破坏相邻排斥条件。

因此代码必须保留旧的两个前缀状态直到 ``current`` 计算完成。

正确性证明
----------

引理一：最后一间的二分覆盖全部合法方案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意只使用前 ``i`` 间房屋的合法方案，对第 ``i`` 间房屋只有“选择”或“不选择”两种可能，
不存在第三类。

若不选择它，方案完全属于前 ``i-1`` 间；若选择它，相邻的第 ``i-1`` 间必须不选，其他选择全部属于前
``i-2`` 间。这两类互斥且覆盖全部合法方案。

引理二：不选择最后一间时最优值是 ``F(i-1)``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

不选择第 ``i`` 间后，所有选择都限制在前 ``i-1`` 间。根据 ``F`` 的定义，这一类方案的金额不超过
``F(i-1)``；同时取得 ``F(i-1)`` 的方案本身也是前 ``i`` 间中的合法方案，因此该类最优值恰好为
``F(i-1)``。

引理三：选择最后一间时最优值是 ``F(i-2)+nums[i-1]``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

选择第 ``i`` 间后，第 ``i-1`` 间必须排除。剩余选择只能来自前 ``i-2`` 间，金额最多为 ``F(i-2)``，
加上当前房屋金额后得到上界 ``F(i-2)+nums[i-1]``。

反过来，取一个达到 ``F(i-2)`` 的前缀最优方案，再加入第 ``i`` 间。两部分之间至少隔着第 ``i-1`` 间，
不会产生相邻冲突，因此这个上界可以达到。

引理四：递推式计算 ``F(i)``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

根据引理一，全部合法方案只分为“最后一间不选”和“最后一间选择”两类；根据引理二、三，
两类最优值分别是 ``F(i-1)`` 与 ``F(i-2)+nums[i-1]``。在两类中取较大值，正好得到全部
合法方案的最大金额：

.. math::

   F(i)=\max(F(i-1),F(i-2)+nums[i-1])

引理五：滚动变量始终等于对应前缀状态
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对已处理房屋数 ``i`` 归纳。

**基础情况。** 尚未处理房屋时 ``i=0``。空前缀最优金额是 ``F(0)=0``，扩展边界是 ``F(-1)=0``，
所以初始化的两个零满足不变量。

**归纳步骤。** 假设循环开始时 ``previous_one=F(i)``、``previous_two=F(i-1)``。代码计算：

.. math::

   current=\max(previous\_one,previous\_two+nums[i])
          =\max(F(i),F(i-1)+nums[i])
          =F(i+1)

随后旧 ``previous_one`` 被移入 ``previous_two``，而 ``current`` 被写入 ``previous_one``，
因此推进后分别为 ``F(i)`` 和 ``F(i+1)``，下一轮不变量成立。

定理：算法返回最大合法金额
~~~~~~~~~~~~~~~~~~~~~~~~~~

循环按顺序处理全部 ``n`` 间房屋。由引理五，结束时 ``previous_one=F(n)``；由引理四，``F(n)`` 等于
所有不含相邻房屋的合法方案最大金额。因此返回值正确。

终止性
~~~~~~

循环每轮处理一个数组元素，索引严格向后推进，数组长度有限，所以循环必然终止。算法内部没有递归。

人工状态推演
------------

``nums=[1,2,3,1]``
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 当前金额
     - 旧 ``previous_two``
     - 旧 ``previous_one``
     - 选择当前
     - 不选当前
     - 新最优
   * - 1
     - 0
     - 0
     - 1
     - 0
     - 1
   * - 2
     - 0
     - 1
     - 2
     - 1
     - 2
   * - 3
     - 1
     - 2
     - 4
     - 2
     - 4
   * - 1
     - 2
     - 4
     - 3
     - 4
     - 4

返回 ``4``。

``nums=[2,7,9,3,1]``
~~~~~~~~~~~~~~~~~~~~~~

前缀最优值依次为：

.. code-block:: text

   F(0)=0
   F(1)=2
   F(2)=7
   F(3)=11
   F(4)=11
   F(5)=12

在金额 ``9`` 处选择 ``2+9`` 得到 ``11``；最后金额 ``1`` 接到前三间最优 ``11`` 上，得到 ``12``。

其他边界
~~~~~~~~

* 单元素 ``[8]``：``max(0,0+8)=8``；
* 两元素 ``[2,7]``：状态从 ``2`` 更新为 ``max(2,0+7)=7``；
* 全零：每轮两种分支均为 ``0``；
* 空输入：循环不执行，初始 ``previous_one=0`` 直接返回；
* 交替大值 ``[10,1,10,1,10]``：前缀最优依次为 ``10,10,20,20,30``。

复杂度与语言成本
----------------

设房屋数量为 ``n``：

* 每间房屋只处理一次，时间复杂度为 ``O(n)``；
* 只保存两个前缀状态和一个当前值，核心额外空间为 ``O(1)``；
* 没有构造完整 ``dp`` 数组，也没有递归栈；
* 固定宽语言使用 64 位中间状态，避免把金额范围与平台默认 ``int`` 位宽混为一谈；
* 合法方案至多选择 ``ceil(n/2)`` 间房屋；官方范围内答案至多为
  ``ceil(100/2)*400=20000``，可以安全转换到平台要求的 32 位整数返回类型；
* Python 整数自动扩展；TypeScript 的 ``number`` 和 R 的双精度数在本题整数范围内精确；
* Julia ``Int`` 通常已经足够，本章仍用 ``Int64`` 表明中间金额语义，再转换为接口返回类型；
* 输入只读，各语言都只扫描容器，不复制完整数组。

十语言实现
----------

C
~

.. code-block:: c

   int rob(int *nums, int numsSize) {
       if (nums == NULL || numsSize <= 0) {
           return 0;
       }

       long long previous_two = 0;
       long long previous_one = 0;

       for (int index = 0; index < numsSize; ++index) {
           long long take_current = previous_two + (long long)nums[index];
           long long current = previous_one > take_current
               ? previous_one
               : take_current;

           previous_two = previous_one;
           previous_one = current;
       }

       return (int)previous_one;
   }

``NULL`` 只在大小非正时作为扩展边界接受；官方非空输入不会触发该分支。状态使用
``long long``，最终按题目范围转换为 ``int``。

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   public:
       int rob(std::vector<int>& nums) {
           long long previousTwo = 0;
           long long previousOne = 0;

           for (int value : nums) {
               const long long current = std::max(
                   previousOne,
                   previousTwo + static_cast<long long>(value)
               );
               previousTwo = previousOne;
               previousOne = current;
           }

           return static_cast<int>(previousOne);
       }
   };

输入以引用接收，但实现不修改 ``nums``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rob(self, nums: list[int]) -> int:
           previous_two = 0
           previous_one = 0

           for value in nums:
               current = max(previous_one, previous_two + value)
               previous_two, previous_one = previous_one, current

           return previous_one

元组赋值右侧先完整求值，因此 ``previous_two + value`` 使用的是更新前状态。

Java
~~~~

.. code-block:: java

   class Solution {
       public int rob(int[] nums) {
           long previousTwo = 0L;
           long previousOne = 0L;

           for (int value : nums) {
               long current = Math.max(
                   previousOne,
                   previousTwo + (long) value
               );
               previousTwo = previousOne;
               previousOne = current;
           }

           return (int) previousOne;
       }
   }

Java 使用 ``long`` 保存中间和，返回类型保持平台要求的 ``int``。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn rob(nums: Vec<i32>) -> i32 {
           let mut previous_two: i64 = 0;
           let mut previous_one: i64 = 0;

           for value in nums {
               let current = previous_one.max(previous_two + i64::from(value));
               previous_two = previous_one;
               previous_one = current;
           }

           previous_one as i32
       }
   }

按值接收 ``Vec`` 是平台接口选择；算法只迭代元素，不额外克隆容器。

Go
~~

.. code-block:: go

   func rob(nums []int) int {
       var previousTwo int64
       var previousOne int64

       for _, value := range nums {
           takeCurrent := previousTwo + int64(value)
           current := previousOne
           if takeCurrent > current {
               current = takeCurrent
           }

           previousTwo = previousOne
           previousOne = current
       }

       return int(previousOne)
   }

切片只读扫描；中间状态显式使用 ``int64``。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rob(nums: number[]): number {
       let previousTwo = 0;
       let previousOne = 0;

       for (const value of nums) {
           const current = Math.max(previousOne, previousTwo + value);
           previousTwo = previousOne;
           previousOne = current;
       }

       return previousOne;
   }

本题最大整数远低于 ``number`` 的安全整数上限，不涉及位运算的 32 位截断。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Rob(int[] nums) {
           long previousTwo = 0L;
           long previousOne = 0L;

           foreach (int value in nums) {
               long current = System.Math.Max(
                   previousOne,
                   previousTwo + (long)value
               );
               previousTwo = previousOne;
               previousOne = current;
           }

           return (int)previousOne;
       }
   }

``long`` 中间状态和 ``int`` 返回接口分离。

Julia
~~~~~

.. code-block:: julia

   function rob(nums::Vector{Int})::Int
       previous_two = Int64(0)
       previous_one = Int64(0)

       for value in nums
           current = max(previous_one, previous_two + Int64(value))
           previous_two = previous_one
           previous_one = current
       end

       return Int(previous_one)
   end

Julia 的 ``for value in nums`` 不依赖一基索引边界；空向量时循环自然不执行。

R
~

.. code-block:: r

   rob <- function(nums) {
       previous_two <- 0
       previous_one <- 0

       for (value in nums) {
           current <- max(previous_one, previous_two + value)
           previous_two <- previous_one
           previous_one <- current
       }

       previous_one
   }

R 的数值向量使用双精度数；本题金额范围内整数运算保持精确。函数不修改调用方的 ``nums`` 绑定。

逐语言静态审查
--------------

接口与返回类型
~~~~~~~~~~~~~~

* C、C++、Java、Rust、Go 和 C# 使用平台常见整数接口，内部状态扩宽后再返回；
* Python、TypeScript、Julia 与 R 直接返回各自数值类型；
* 所有实现都额外兼容空输入并返回 ``0``；
* 输入数组均只读，没有排序、覆盖或切片重建。

滚动更新
~~~~~~~~

十种实现都先计算 ``current``，随后按“旧 ``previous_one`` 移入 ``previous_two``，``current`` 写入
``previous_one``”的顺序推进。没有实现先覆盖旧状态再计算选择分支。

数值边界
~~~~~~~~

* 非负金额保证状态不会低于 ``0``，无需负无穷哨兵；
* 64 位中间状态不存在对类型下界做加法的风险；
* TypeScript 与 R 的整数结果处于精确表示范围；
* 最终窄化由 ``20000`` 的答案上界支撑，正文没有把任意大输入错误宣称为安全。

未执行范围与剩余风险
~~~~~~~~~~~~~~~~~~~~

本章只进行了人工示例推演、递推与不变量证明、十语言接口和语义静态核对。没有运行、编译、对拍、穷举、
属性测试或 sanitizer 检查题解代码。

剩余风险主要是目标评测环境的具体语言版本、类型别名或函数签名可能与本文平台模型存在
细微差异；核心状态转移、边界处理和标准语法已按静态方式逐项核对。

关键易错点
----------

#. 把状态定义成“当前房屋是否选择”却没有说明前缀范围，导致转移来源含混；
#. 选择第 ``i`` 间时错误加到 ``F(i-1)``，从而允许相邻房屋同时选择；
#. 先覆盖 ``previous_two``，再计算 ``take_current``；
#. 使用每对相邻房屋取较大值的局部贪心；
#. 构造完整 DP 数组后仍声明核心空间 ``O(1)``；
#. 忘记单元素、全零或扩展空输入边界；
#. 在固定宽语言中只讨论返回 ``int``，忽略中间和的位宽。

知识更新与关联题目
------------------

本题新增的可复用知识是：

* **最后决策二分。** 对线性选择问题，按最后元素选或不选划分全部方案，常能得到完整递推；
* **支配性压缩。** 对同一前缀只需要保留最大金额，具体选择路径不会影响未来合法动作；
* **相邻排斥的两步依赖。** 选择当前元素时只能连接到 ``i-2`` 前缀；
* **空方案下界。** 非负权重使空方案提供统一的 ``0`` 初始状态。

本题强化的已有知识是：

* ``0152`` 的同轮旧状态保护：在覆盖旧值前必须先完成所有依赖它的计算；
* ``0152`` 的标量动态规划：只保留下一轮仍会读取的固定数量状态；
* 固定宽语言先用宽状态完成累加，再由明确的 ``20000`` 上界支撑接口窄化。

关联题目：

* ``0213 House Robber II``：房屋形成环，需要拆成两个线性区间；
* ``0337 House Robber III``：房屋形成树，状态扩展为选择/不选择当前节点；
* ``0740 Delete and Earn``：按数值聚合后转化为相邻排斥前缀 DP；
* ``0120 Triangle``：同样通过只保留未来仍需使用的状态压缩空间。

自检问题与答案
--------------

问题一
~~~~~~

为什么选择当前房屋时不能加 ``previous_one``？

答案：``previous_one`` 表示包含前一间房屋在内的前缀最优值，其中可能已经选择前一间。
直接相加无法保证相邻约束。选择当前房屋只能接到不含前一间的 ``previous_two``。

问题二
~~~~~~

递推为什么没有遗漏“最后两间都不选”的方案？

答案：这种方案属于“不选择最后一间”一类，并已经包含在 ``F(i-1)`` 中。``F(i-1)`` 允许
它的最后一间也不选。

问题三
~~~~~~

金额非负对算法有什么影响？

答案：空方案金额 ``0`` 始终是有效下界，状态无需负无穷初始化；同时最终答案不会为负。
递推本身即使允许负数也可通过空方案保持非负，但题目合同明确给出非负金额。

问题四
~~~~~~

为什么两个变量足够？

答案：计算 ``F(i)`` 只依赖 ``F(i-1)`` 与 ``F(i-2)``。更早状态已经被这两个前缀最优值
完整概括，未来不会直接读取。

问题五
~~~~~~

本章是否验证了十语言代码可以运行？

答案：没有。只完成了人工推演、数学证明、接口与语义静态审查；没有运行、编译或测试题解代码。
