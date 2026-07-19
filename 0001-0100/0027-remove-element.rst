0027. Remove Element
====================

题目信息
--------

:题号: 0027
:难度: Easy
:主题: 数组、双指针、原地覆盖、稳定压缩
:原题: `LeetCode 0027 <https://leetcode.com/problems/remove-element/>`_
:访问状态: Available
:教学重点: 读写指针分工、保留条件、有效前缀、不依赖原数组有序性

题目重述
--------

给定整数数组 ``nums`` 和整数 ``val``，在原数组中移除所有等于 ``val`` 的元素，并返回
剩余元素数量 ``k``。

调用者只检查 ``nums`` 的前 ``k`` 个位置。前缀中的元素必须全部不等于 ``val``，并且要包含
原数组中所有应保留的元素。``k`` 之后的内容没有要求，可以保留旧值，也不需要缩短底层数组。

题目允许改变剩余元素的相对顺序。本题主解法选择稳定压缩，让保留元素继续按照原顺序排列，
因为它同样满足 ``O(n)`` 时间和 ``O(1)`` 额外空间，且不变量更容易理解和验证。

自建示例
--------

普通情况
~~~~~~~~

.. code-block:: text

   输入：nums = [3, 1, 3, 2, 4, 3], val = 3
   返回：3
   有效前缀：[1, 2, 4]

   数组尾部可能是 [2, 4, 3]、[3, 4, 3] 等任意内容，
   题目只检查前 3 个位置。

目标值不存在
~~~~~~~~~~~~

.. code-block:: text

   输入：nums = [2, 5, 7], val = 9
   返回：3
   有效前缀：[2, 5, 7]

全部移除
~~~~~~~~

.. code-block:: text

   输入：nums = [6, 6, 6], val = 6
   返回：0
   有效前缀：[]

空数组
~~~~~~

.. code-block:: text

   输入：nums = [], val = 1
   返回：0
   有效前缀：[]

问题抽象
--------

题目不是要求真的删除数组槽位，而是要求构造一个有效前缀。扫描原数组时，把每个
``nums[read]`` 分为两类：

* ``nums[read] == val``：丢弃，不写入有效前缀；
* ``nums[read] != val``：保留，写入 ``nums[write]``，然后令 ``write += 1``。

``read`` 负责检查每个原始元素，``write`` 同时表示：

* 已经保留的元素数量；
* 有效前缀长度；
* 下一个保留元素的写入位置。

与 0026 的区别
~~~~~~~~~~~~~~

`0026. Remove Duplicates from Sorted Array
<0026-remove-duplicates-from-sorted-array.rst>`_ 也使用读写指针，但两题的保留条件不同：

* 0026 依赖数组有序，保留“与最近保留值不同”的元素；
* 0027 不要求有序，保留“与固定目标 ``val`` 不同”的元素。

因此本题不能通过比较相邻元素判断是否保留；每个元素都必须直接与 ``val`` 比较。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 稳定读写双指针
     - ``O(n)``
     - ``O(1)``
     - 主解法；保留原相对顺序，不变量直接
   * - 与末尾元素交换
     - ``O(n)``
     - ``O(1)``
     - 当目标值很多时可减少写入，但会改变元素顺序
   * - 新建结果数组
     - ``O(n)``
     - ``O(n)``
     - 简单但不满足原地空间目标
   * - 每次删除并移动后缀
     - 最坏 ``O(n^2)``
     - ``O(1)``
     - 反复移动元素，没有必要

主解法：稳定读写双指针
----------------------

状态含义
~~~~~~~~

算法维护两个逻辑位置：

* ``read``：当前读取的原数组位置；
* ``write``：有效前缀长度，也是下一个保留元素的写入位置；
* ``nums[0:write]``：已经整理好的保留元素前缀。

初始化 ``write = 0``，因为扫描开始前还没有保留任何元素。``read`` 从数组开头依次走到末尾。

核心不变量
~~~~~~~~~~

每轮处理 ``nums[read]`` 之前：

* ``nums[0:write]`` 恰好包含原数组已扫描部分中所有不等于 ``val`` 的元素；
* 这些元素保持原来的相对顺序；
* ``write`` 等于已扫描部分中应保留元素的数量；
* 始终有 ``0 <= write <= read``，写入不会破坏尚未读取的后缀。

处理当前元素时：

* 若它等于 ``val``，已扫描部分新增一个应丢弃元素，不变量无需修改；
* 若它不等于 ``val``，把它写到 ``nums[write]``，有效前缀末尾新增正确元素，再增加
  ``write``。

为什么向前覆盖是安全的
~~~~~~~~~~~~~~~~~~~~~~

``write`` 只在发现保留元素时增加，而 ``read`` 每轮都增加，因此始终有
``write <= read``。

* ``write == read`` 时，赋值只是把元素写回原位；
* ``write < read`` 时，写入位置位于当前读取位置之前；
* 算法从不写入 ``read`` 之后的位置，所以不会覆盖未来尚未检查的元素。

这条关系是所有原地稳定压缩算法的关键安全条件。

执行过程
~~~~~~~~

以 ``nums = [3, 1, 3, 2, 4, 3]``、``val = 3`` 为例：

.. list-table::
   :header-rows: 1

   * - ``read``
     - 当前值
     - 操作
     - ``write``
     - 有效前缀
   * - 0
     - 3
     - 丢弃
     - 0
     - ``[]``
   * - 1
     - 1
     - 写入 ``nums[0]``
     - 1
     - ``[1]``
   * - 2
     - 3
     - 丢弃
     - 1
     - ``[1]``
   * - 3
     - 2
     - 写入 ``nums[1]``
     - 2
     - ``[1, 2]``
   * - 4
     - 4
     - 写入 ``nums[2]``
     - 3
     - ``[1, 2, 4]``
   * - 5
     - 3
     - 丢弃
     - 3
     - ``[1, 2, 4]``

扫描结束后，``write = 3``，前 3 个位置就是完整结果。

正确性依据
~~~~~~~~~~

证明分为“不包含错误元素”和“不遗漏正确元素”两部分。

首先，算法只有在当前元素不等于 ``val`` 时才把它写入有效前缀，因此
``nums[0:write]`` 中不会出现 ``val``。

其次，原数组中每个不等于 ``val`` 的元素都会被 ``read`` 恰好访问一次。访问时算法立即把它
写入下一个有效位置，并把 ``write`` 增加一，所以任何应保留元素都不会遗漏。写入顺序与读取
顺序相同，因此稳定版本还保持了它们原来的相对顺序。

扫描结束时，所有元素都已分类。前 ``write`` 个位置恰好包含全部且仅包含不等于 ``val`` 的
元素，``write`` 也恰好等于剩余元素数量，所以返回值和有效前缀都满足题意。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每个元素读取一次，时间复杂度为 ``O(n)``；
* 除两个索引外不使用随 ``n`` 增长的结构，额外空间复杂度为 ``O(1)``；
* 最坏情况下每个元素都被写入一次，写入次数为 ``O(n)``；
* R 的普通向量采用复制语义，接口返回修改后的向量；算法状态本身仍为常数规模。

核心语言实现
------------

C
~

.. code-block:: c

   int removeElement(int *nums, int numsSize, int val) {
       int write = 0;

       for (int read = 0; read < numsSize; ++read) {
           if (nums[read] != val) {
               /*
                * write <= read，向前覆盖不会破坏尚未读取的元素。
                */
               nums[write] = nums[read];
               ++write;
           }
       }

       return write;
   }

``nums`` 的内存由调用者管理，函数只在已有缓冲区中覆盖元素，不分配也不释放数组。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int removeElement(std::vector<int>& nums, int val) {
           int write = 0;

           for (int read = 0;
                read < static_cast<int>(nums.size());
                ++read) {
               if (nums[read] != val) {
                   nums[write] = nums[read];
                   ++write;
               }
           }

           return write;
       }
   };

``static_cast<int>`` 明确处理 ``size_t`` 与题目返回类型 ``int`` 的差异。题目约束保证数组长度
可以安全转换。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeElement(self, nums: list[int], val: int) -> int:
           write = 0

           for read, value in enumerate(nums):
               if value != val:
                   # 先保存 value，避免读写同一列表时重复索引当前槽位。
                   nums[write] = value
                   write += 1

           return write

Python 的 ``enumerate`` 同时给出零基下标和值。整数对象不可变，赋值只替换列表槽位中的引用。

Java
~~~~

.. code-block:: java

   class Solution {
       public int removeElement(int[] nums, int val) {
           int write = 0;

           for (int read = 0; read < nums.length; ++read) {
               if (nums[read] != val) {
                   nums[write] = nums[read];
                   ++write;
               }
           }

           return write;
       }
   }

Java 数组长度和下标使用 ``int``，本题没有求和或乘法，不存在额外的整数溢出风险。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_element(nums: &mut Vec<i32>, val: i32) -> i32 {
           let mut write: usize = 0;

           for read in 0..nums.len() {
               let value = nums[read];

               if value != val {
                   // i32 实现 Copy，先读出 value 后再可变写入同一 Vec。
                   nums[write] = value;
                   write += 1;
               }
           }

           write as i32
       }
   }

索引必须使用 ``usize``。先把当前 ``i32`` 复制到局部变量，可让不可变读取在写入前结束，避免
产生重叠借用问题。

Go
~~

.. code-block:: go

   func removeElement(nums []int, val int) int {
       write := 0

       for _, value := range nums {
           if value != val {
               // range 取出的 value 是当前元素的副本。
               nums[write] = value
               write++
           }
       }

       return write
   }

切片描述符按值传入，但底层数组共享，因此对 ``nums[write]`` 的写入对调用者可见。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeElement(nums: number[], val: number): number {
       let write = 0;

       for (let read = 0; read < nums.length; read++) {
           const value = nums[read];

           if (value !== val) {
               nums[write] = value;
               write++;
           }
       }

       return write;
   }

TypeScript 的 ``number`` 使用 IEEE 754 双精度浮点表示。本题只比较和移动题目给定整数，不进行
可能损失精度的算术。数组对象按引用共享，函数内覆盖会修改调用者看到的数组。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int RemoveElement(int[] nums, int val) {
           int write = 0;

           for (int read = 0; read < nums.Length; ++read) {
               if (nums[read] != val) {
                   nums[write] = nums[read];
                   ++write;
               }
           }

           return write;
       }
   }

C# 数组是引用类型，元素覆盖对调用者可见。``Length`` 和数组下标均使用 ``int``。

Julia
~~~~~

.. code-block:: julia

   function remove_element!(nums::Vector{Int}, val::Int)::Int
       write = 1

       for read in eachindex(nums)
           value = nums[read]

           if value != val
               # Julia 一基索引：write 是下一个有效槽位，而非零基长度。
               nums[write] = value
               write += 1
           end
       end

       return write - 1
   end

Julia 用函数名后的 ``!`` 表示会修改参数。``write`` 从一基位置 1 开始，最终有效长度是
``write - 1``；空数组时循环不执行，正确返回 0。

R
~

.. code-block:: r

   remove_element <- function(nums, val) {
     write <- 1L
     n <- length(nums)

     if (n > 0L) {
       for (read in seq_len(n)) {
         value <- nums[[read]]

         if (value != val) {
           # R 使用一基索引；赋值可能触发向量复制。
           nums[[write]] <- value
           write <- write + 1L
         }
       }
     }

     list(k = write - 1L, nums = nums)
   }

R 没有 LeetCode C++ 式的可变数组引用接口，因此返回 ``k`` 和修改后的向量。调用者只读取
``nums[seq_len(k)]``；当 ``k = 0`` 时应避免直接使用 ``1:k``，因为 ``1:0`` 会产生两个下标。

对照解法：与末尾元素交换
------------------------

题目不要求保留顺序时，还可以维护有效区间 ``[0, n)``：

#. 若 ``nums[index] != val``，令 ``index += 1``；
#. 若 ``nums[index] == val``，用 ``nums[n - 1]`` 覆盖当前位置，再令 ``n -= 1``；
#. 覆盖进来的元素尚未检查，所以此时不能增加 ``index``。

当 ``val`` 很多且非 ``val`` 元素很少时，这种方法通常写入更少；代价是保留元素顺序会改变。
两种方法时间和额外空间复杂度相同。主解法选择稳定压缩，因为它与 0026 形成连续的读写指针
学习路径，也更容易建立“已扫描部分全部正确”的不变量。

关键边界
--------

* 空数组直接返回 0；
* 所有元素等于 ``val`` 时，``write`` 始终为 0；
* 没有元素等于 ``val`` 时，每次写入都是原位写回，返回原长度；
* ``val`` 出现在开头、末尾或连续出现时，统一由同一条件处理；
* 结果只由前 ``k`` 个位置定义，不要清理或检查尾部；
* 主解法稳定保序只是额外性质，题目本身不要求顺序；
* R 在 ``k = 0`` 时不能用 ``1:k`` 表示空前缀。

易错点
------

#. 把“移除”误解为必须缩短数组或逐个调用删除 API。
#. 遇到 ``val`` 时仍增加 ``write``，导致目标值进入有效前缀。
#. 返回最后写入下标而不是有效长度；零基实现应直接返回 ``write``。
#. 写入后再读取同一位置之外的数据，破坏 ``write <= read`` 的安全关系。
#. 错误地认为输入有序，并复用 0026 的相邻比较条件。
#. 检查或清零 ``k`` 之后的数组内容，制造题目没有要求的工作。
#. 末尾交换法覆盖后立即增加 ``index``，漏检刚交换进来的元素。
#. Julia、R 把零基长度直接当作一基数组位置，产生偏移一位错误。

新增与强化知识
--------------

新增
~~~~

* **按固定谓词稳定压缩**：用 ``value != val`` 决定元素是否进入有效前缀。
* **有效前缀接口**：返回长度与原地修改共同定义结果，数组尾部不属于输出。
* **保留顺序与减少写入的取舍**：稳定双指针和末尾交换都满足题意，但优化目标不同。

强化
~~~~

* 延续 0026 的读写指针模型：``read`` 负责遍历，``write`` 负责构造前缀。
* 再次使用 ``write <= read`` 证明原地覆盖安全。
* 强化 Julia、R 的一基索引换算，以及 R 值语义接口与平台原地接口的差异。
* 强化“复杂度相同不代表实现目标相同”：稳定性、写入次数和证明难度也影响解法选择。

关联题目
--------

* `0026. Remove Duplicates from Sorted Array
  <0026-remove-duplicates-from-sorted-array.rst>`_：两题都原地构造有效前缀；0026 的保留条件
  依赖有序数组中的相邻不同值，本题使用固定目标值谓词。

最小自检
--------

#. ``write`` 在循环任意时刻表示什么？
#. 为什么 ``nums[write] = nums[read]`` 不会覆盖未来还未读取的元素？
#. 数组尾部在返回后需要满足什么条件？
#. 为什么本题不能使用 0026 的“与最近保留值比较”规则？
#. 末尾交换法遇到目标值后，为什么不能立即增加当前下标？
#. Julia 的 ``write`` 为什么从 1 开始却返回 ``write - 1``？

答案要点
--------

#. ``write`` 是已扫描部分中非 ``val`` 元素数量，也是下一个写入位置。
#. 始终有 ``write <= read``，写入只发生在当前读取位置或其之前。
#. 尾部没有要求，只有前 ``k`` 个位置属于有效结果。
#. 本题输入不保证有序，重复值也可能是应保留元素，唯一条件是是否等于 ``val``。
#. 末尾覆盖进来的元素尚未分类，必须在同一位置继续检查。
#. Julia 使用一基槽位；``write`` 指向下一个槽位，因此已写入数量是 ``write - 1``。
