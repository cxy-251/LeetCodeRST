0169. Majority Element
======================

题目信息
--------

:题号: 0169
:难度: Easy
:主题: 数组、Boyer-Moore 投票、成对抵消、不变量
:原题: `LeetCode 0169 <https://leetcode.com/problems/majority-element/>`_
:访问状态: Available
:教学重点: 严格多数、抵消模型、候选状态含义、常数空间

精确契约
--------

输入非空整数数组 ``nums``，满足：

* ``1 <= nums.length <= 5 * 10^4``；
* ``-10^9 <= nums[i] <= 10^9``；
* 存在某个元素，其出现次数严格大于 ``floor(nums.length / 2)``。

返回这个多数元素。这里的“多数”不是普通众数：出现次数最多但没有超过一半，或者恰好占一半，都不满足定义。
题目保证多数元素存在，因此主解法可以直接返回最终候选；若把算法扩展到没有该保证的输入，必须再扫描一次验证候选频次。

示例与反例
----------

基本示例
~~~~~~~~

``nums = [3,2,3]``。3 出现 2 次，严格超过 ``floor(3/2)=1``，答案为 3。

多次抵消
~~~~~~~~

``nums = [2,2,1,1,1,2,2]``。可以把不同值成对删除，剩余值仍为 2。算法中的 ``balance``
会经历增减和归零，但最终候选是 2。

候选切换
~~~~~~~~

``nums = [1,2,3,3,3]``。候选可以先是 1，随后余额归零并切换；这不表示算法已经否定未来的多数。
``candidate`` 只代表当前尚未抵消部分的值，不是整个已扫描前缀中出现次数最多的值。

单元素
~~~~~~

``nums = [7]``。唯一元素出现 1 次，严格超过 ``floor(1/2)=0``，直接是多数。

“恰好一半”不是多数
~~~~~~~~~~~~~~~~~~

``[1,1,2,2]`` 没有严格多数。Boyer-Moore 仍会留下某个候选，但不能据此宣称候选合法。
这说明“题目保证存在多数”是省略第二遍验证的必要前提。

问题抽象与解法选择
------------------

把不同值的两个元素视为一对并同时抵消。若某个值 ``M`` 在长度 ``n`` 的数组中出现 ``m`` 次，且
``m > n/2``，那么无论怎样删除由两个不同值组成的配对，都不可能删除掉所有 ``M``：每删除一个 ``M``，
必须同时删除一个非 ``M``，而非 ``M`` 的总数少于 ``M``。

Boyer-Moore 投票算法把这个抵消过程压缩成两个标量：

* ``candidate``：当前尚未抵消部分所代表的值；
* ``balance``：当前尚未抵消的 ``candidate`` 个数。

扫描当前值 ``value`` 时：

#. 若 ``balance == 0``，从 ``value`` 开始建立新的未抵消段，并令 ``candidate = value``；
#. 若 ``value == candidate``，余额加一；
#. 否则用 ``value`` 与一个未抵消的 ``candidate`` 配对，余额减一。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - Boyer-Moore 投票
     - ``O(n)``
     - ``O(1)``
     - 主解法；依赖多数存在保证
   * - 哈希计数
     - 期望 ``O(n)``
     - ``O(k)``
     - 直接得到真实频次，但不满足常数空间进阶目标
   * - 排序后取中位位置
     - ``O(n log n)``
     - 取决于排序实现
     - 多数一定覆盖中位位置，但会修改输入或复制数组

状态、不变量与实现映射
----------------------

已处理前缀的不变量
~~~~~~~~~~~~~~~~~~

处理任意前缀后，该前缀都可以被划分为：

* 若干对数值不同的元素；
* ``balance`` 个值都等于 ``candidate`` 的未配对元素。

当 ``balance == 0`` 时，未配对部分为空，``candidate`` 的旧值没有语义；下一元素会成为新候选。

代码中的三种转移与这个划分逐项对应：

* 空余额遇到新值：把它放入未配对部分，余额变为 1；
* 遇到候选值：未配对部分增加一个同值元素；
* 遇到不同值：它与一个未配对候选组成异值对，余额减一。

``balance`` 不是候选在原前缀中的真实出现次数。原前缀里可能有许多候选已经参与抵消，
也可能存在候选切换；它只描述当前抵消表示中的剩余数量。

正确性证明
----------

引理一：前缀抵消不变量始终成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始前缀为空，可划分为零个异值对和空的未配对部分，不变量成立。

假设处理当前元素前不变量成立：

* 若余额为零，新增元素独自构成一个未配对候选；
* 若新增元素等于候选，把它加入未配对部分；
* 若新增元素不同于候选，从未配对部分取出一个候选，与新增元素组成异值对。

三种转移都得到合法划分，因此归纳可知不变量对每个前缀成立。

引理二：删除一对不同值不会消灭严格多数关系
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设当前多重集合大小为 ``n``，多数元素 ``M`` 出现 ``m`` 次，并满足 ``2m > n``。
删除一对不同值：

* 若配对包含一个 ``M``，新计数为 ``m-1``、新大小为 ``n-2``，由 ``2m>n`` 得
  ``2(m-1)>n-2``；
* 若配对不包含 ``M``，``M`` 的计数仍为 ``m``，集合大小变为 ``n-2``，严格多数关系更强。

所以连续删除异值对后，只要还有元素，多数元素仍是剩余集合的严格多数；它不可能被全部抵消。

引理三：扫描结束时未配对部分非空且其值是多数元素
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

由引理一，整个数组被划分为若干异值对和 ``balance`` 个相同的候选值。由引理二，真正多数元素
无法在删除异值对的过程中全部消失，因此最终未配对部分必非空，即 ``balance > 0``。
未配对部分只有 ``candidate`` 一种值；真正多数仍必须存在于其中，所以 ``candidate`` 就是真正多数。

引理四：算法终止
~~~~~~~~~~~~~~~~

循环每轮恰好处理一个输入元素，数组有限，因此扫描在 ``nums.length`` 轮后终止。

定理：算法返回题目保证存在的多数元素
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理三证明最终候选等于真正多数，引理四证明算法有限终止，因此返回值正确。

复杂度与语言成本
----------------

设数组长度为 ``n``：

* 核心扫描时间为 ``O(n)``；
* 只维护 ``candidate`` 和 ``balance``，核心额外空间为 ``O(1)``；
* 返回值是单个整数，不产生随 ``n`` 增长的输出载荷；
* C++、Java、Rust、Go、C#、Julia 实现借用或接收数组容器，不主动复制；
* Python 与 TypeScript 接收对象引用；R 的循环不修改 ``nums``，也不主动构造计数表；
* 若在无多数保证的扩展版本中加入第二遍验证，时间仍为 ``O(n)``，空间仍为 ``O(1)``。

十语言实现
----------

C
~

.. code-block:: c

   int majorityElement(int* nums, int numsSize) {
       int candidate = 0;
       int balance = 0;

       for (int index = 0; index < numsSize; ++index) {
           if (balance == 0) {
               candidate = nums[index];  // 建立新的未抵消段
           }

           if (nums[index] == candidate) {
               ++balance;
           } else {
               --balance;  // 与一个候选配成异值对
           }
       }

       return candidate;  // 题目保证严格多数存在
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int majorityElement(const std::vector<int>& nums) {
           int candidate = 0;
           int balance = 0;

           for (const int value : nums) {
               if (balance == 0) {
                   candidate = value;
               }
               balance += (value == candidate) ? 1 : -1;
           }

           return candidate;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def majorityElement(self, nums: list[int]) -> int:
           candidate = 0
           balance = 0

           for value in nums:
               if balance == 0:
                   candidate = value
               balance += 1 if value == candidate else -1

           return candidate

Java
~~~~

.. code-block:: java

   class Solution {
       public int majorityElement(int[] nums) {
           int candidate = 0;
           int balance = 0;

           for (int value : nums) {
               if (balance == 0) {
                   candidate = value;
               }
               balance += value == candidate ? 1 : -1;
           }

           return candidate;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn majority_element(nums: Vec<i32>) -> i32 {
           let mut candidate = 0_i32;
           let mut balance = 0_i32;

           for value in nums {
               if balance == 0 {
                   candidate = value;
               }
               balance += if value == candidate { 1 } else { -1 };
           }

           candidate
       }
   }

Go
~~

.. code-block:: go

   func majorityElement(nums []int) int {
       candidate := 0
       balance := 0

       for _, value := range nums {
           if balance == 0 {
               candidate = value
           }
           if value == candidate {
               balance++
           } else {
               balance--
           }
       }

       return candidate
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function majorityElement(nums: number[]): number {
       let candidate = 0;
       let balance = 0;

       for (const value of nums) {
           if (balance === 0) {
               candidate = value;
           }
           balance += value === candidate ? 1 : -1;
       }

       return candidate;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MajorityElement(int[] nums) {
           int candidate = 0;
           int balance = 0;

           foreach (int value in nums) {
               if (balance == 0) {
                   candidate = value;
               }
               balance += value == candidate ? 1 : -1;
           }

           return candidate;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function majority_element(nums::Vector{Int})::Int
       candidate = 0
       balance = 0

       for value in nums
           if balance == 0
               candidate = value
           end
           balance += value == candidate ? 1 : -1
       end

       return candidate
   end

R
~

.. code-block:: r

   majority_element <- function(nums) {
     candidate <- 0
     balance <- 0L

     for (value in nums) {
       if (balance == 0L) {
         candidate <- value
       }
       balance <- balance + if (value == candidate) 1L else -1L
     }

     candidate
   }

静态审查记录
------------

本题题解代码未运行、未编译、未对拍。完成了以下人工与静态检查：

* ``[3,2,3]``：状态依次为 ``(3,1) -> (3,0) -> (3,1)``，返回 3；
* ``[2,2,1,1,1,2,2]``：余额归零后可重新建立候选，最终返回 2；
* ``[1,2,3,3,3]``：候选切换不破坏抵消不变量，最后剩余 3；
* 单元素 ``[7]``：第一轮建立候选并返回 7；
* 十语言均先在余额为零时设置候选，再根据当前值增减余额；没有把当前元素重复处理；
* C/C++/Java/Rust/C# 的 ``balance`` 最大绝对值不超过 ``n``，当前约束下普通整数安全；
* TypeScript 与 R 的计数和输入整数都处于精确整数范围；
* 所有实现都只维护常数状态，没有隐藏哈希表、排序副本或输入修改；
* 代码依赖题目“多数必存在”的合同，未伪装成可处理任意输入的验证版本。

剩余风险：代码没有实际通过目标平台编译或执行；各平台签名以当前仓库接口约定静态核对。

边界、失败路径与易错点
----------------------

* 空数组不在官方合同内；若外部接口允许空数组，必须定义错误返回，不能沿用当前实现；
* ``balance == 0`` 时旧候选已失效，必须由当前元素重新赋值；
* 更新候选后，当前元素仍要贡献 ``+1``，不能直接跳到下一轮；
* ``balance`` 表示抵消后的余额，不是候选真实频次；
* 仅当严格多数保证成立时，最终候选无需验证；
* 哈希计数解法可以正确，但空间是 ``O(k)``，不能标成 ``O(1)``。

知识更新与关联题目
------------------

本题新增的可迁移知识：

* **成对抵消**：把全局频次优势转化为局部删除操作；
* **压缩状态不变量**：两个标量代表一个隐式多重集合划分；
* **合同驱动验证**：是否需要第二遍计数由“多数必存在”决定；
* **严格多数存活性**：删除异值对保持多数关系。

关联题目：

* 0229 Majority Element II：阈值变为 ``n/3``，需要最多两个候选并必须验证；
* 0001 Two Sum：同样是一次扫描，但依赖哈希历史，而本题依赖可抵消结构；
* 0167 Two Sum II：利用有序单调性压缩候选范围，本题利用频次优势压缩状态。

自检问题
--------

#. 为什么 ``balance`` 不能解释为候选的真实出现次数？
#. 删除一对不同值后，严格多数为什么仍然是严格多数？
#. 没有“多数一定存在”的保证时，算法还缺哪一步？
#. 为什么最终余额不可能为零？

答案要点
~~~~~~~~

#. 已参与异值配对的候选不会计入余额，候选也可能切换；余额只描述未抵消部分。
#. 若删掉一个多数和一个非多数，计数与总数分别减 1 和 2，严格不等式保持；若不删多数则优势更强。
#. 再扫描一次统计最终候选，确认其频次严格超过 ``floor(n/2)``。
#. 真正多数数量多于所有非多数之和，异值配对不可能把它全部删除。
