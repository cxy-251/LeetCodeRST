0046. Permutations
==================

题目信息
--------

:题号: 0046
:难度: Medium
:主题: 回溯、排列、原地交换、搜索树
:原题: `LeetCode 0046 <https://leetcode.com/problems/permutations/>`_
:访问状态: Available
:教学重点: 位置决策、交换与撤销、排列树分层、输出敏感复杂度

题目重述
--------

给定一个不含重复值的整数数组 ``nums``，返回其中所有可能的排列。每个排列必须使用输入中的
全部元素，且每个元素恰好使用一次。结果顺序没有要求。

自建示例
--------

三个不同元素
~~~~~~~~~~~~

.. code-block:: text

   输入：[1, 2, 3]
   输出包含：
   [1, 2, 3]  [1, 3, 2]
   [2, 1, 3]  [2, 3, 1]
   [3, 1, 2]  [3, 2, 1]

单元素
~~~~~~

.. code-block:: text

   输入：[7]
   输出：[[7]]

两个元素
~~~~~~~~

.. code-block:: text

   输入：[-1, 4]
   输出：[[-1, 4], [4, -1]]

问题抽象
--------

排列可以看作逐个决定位置：

* 第 ``0`` 个位置可以放任意一个元素；
* 第 ``1`` 个位置从剩余元素中选择；
* 持续到所有位置都确定。

主解法不额外维护 ``used`` 数组，而是把数组划分为：

.. code-block:: text

   nums[0:position]   已确定前缀
   nums[position:n]  尚未选择的候选

在当前层，把后缀中每个候选依次交换到 ``position``，递归处理下一位置，返回后再交换回来。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 搜索状态空间
     - 取舍
   * - 原地交换回溯
     - ``O(n × n!)``
     - ``O(n)`` 递归栈
     - 主解法；候选集合直接编码在数组后缀中
   * - ``used`` 数组加路径
     - ``O(n × n!)``
     - ``O(n)``
     - 状态含义直观，额外维护已使用标记
   * - 反复生成下一个字典序排列
     - ``O(n × n!)``
     - ``O(1)`` 不含输出
     - 需先排序，适合按字典序枚举

主解法：交换当前位置与候选位置
--------------------------------

状态含义
~~~~~~~~

递归函数 ``backtrack(position)`` 表示：

* ``nums[0:position]`` 已经固定，不再改变；
* ``nums[position:n]`` 包含尚未放入前缀的全部元素；
* 当前层要决定 ``position`` 放哪个元素。

对每个 ``candidate`` 从 ``position`` 到 ``n - 1``：

#. 交换 ``nums[position]`` 与 ``nums[candidate]``；
#. 递归处理 ``position + 1``；
#. 再次交换相同两处，恢复父层状态。

为什么交换能够表达“未使用”
~~~~~~~~~~~~~~~~~~~~~~~~~~

每层只从当前后缀选择元素。选中的元素被交换进固定前缀，递归层不会再扫描该位置；其余元素仍
留在更短的后缀中。因此一个递归路径中，每个原始元素只会进入一个位置，不需要额外的
``used`` 标记。

核心不变量
~~~~~~~~~~

进入 ``backtrack(position)`` 时：

* 前 ``position`` 个位置构成一个合法且互不重复的选择序列；
* 后缀恰好包含尚未使用的元素，每个元素一次；
* 前缀与后缀合起来仍是原数组元素的一个重排；
* 返回调用者前，数组会恢复成进入本层时的排列。

当 ``position == n`` 时，前缀已经包含全部元素，当前数组就是一个完整排列，必须复制后保存。

正确性依据
~~~~~~~~~~

**完整性：** 任取一个目标排列。它在位置 ``0`` 需要某个元素，根层会遍历到该元素并把它交换
到位置 ``0``。随后位置 ``1`` 所需元素仍位于后缀，下一层也会遍历到它。依次进行，算法存在
一条递归路径生成该目标排列，因此不会漏解。

**唯一性：** 输入元素两两不同。某个完整排列由每个位置选择的元素唯一确定。两条不同递归路径
必然在最早分歧位置选择了不同元素，生成的排列在该位置不同，因此不会重复。

**状态恢复：** 一次递归前后交换同一对位置。交换是自身的逆操作，所以子树完成后数组恢复到
父层进入该候选前的状态，后续候选不会受到污染。

复杂度
~~~~~~

设元素数量为 ``n``：

* 一共有 ``n!`` 个输出，每个输出复制 ``n`` 个元素，因此时间下界和总时间均为
  ``O(n × n!)``；
* 递归深度为 ``n``，不计输出时额外空间为 ``O(n)``；
* 保存全部结果需要 ``O(n × n!)`` 空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   static void swap_int(int *left, int *right) {
       int temp = *left;
       *left = *right;
       *right = temp;
   }

   static void generate(
       int *nums,
       int nums_size,
       int position,
       int **answers,
       int *answer_count
   ) {
       if (position == nums_size) {
           int *copy = malloc((size_t)nums_size * sizeof(int));
           memcpy(copy, nums, (size_t)nums_size * sizeof(int));
           answers[*answer_count] = copy;
           ++(*answer_count);
           return;
       }

       for (int candidate = position;
            candidate < nums_size;
            ++candidate) {
           swap_int(&nums[position], &nums[candidate]);
           generate(
               nums,
               nums_size,
               position + 1,
               answers,
               answer_count
           );
           /* 撤销当前选择，恢复父层后缀。 */
           swap_int(&nums[position], &nums[candidate]);
       }
   }

   int **permute(
       int *nums,
       int numsSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       int capacity = 1;
       for (int value = 2; value <= numsSize; ++value) {
           capacity *= value;
       }

       int **answers = malloc((size_t)capacity * sizeof(int *));
       int *columns = malloc((size_t)capacity * sizeof(int));
       int answer_count = 0;

       generate(nums, numsSize, 0, answers, &answer_count);

       for (int index = 0; index < answer_count; ++index) {
           columns[index] = numsSize;
       }

       *returnSize = answer_count;
       *returnColumnSizes = columns;
       return answers;
   }

题目约束较小，``n!`` 可安全存入 ``int``。每个结果行和外层指针数组都由调用者负责释放。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       vector<vector<int>> permute(vector<int>& nums) {
           vector<vector<int>> answers;
           backtrack(nums, 0, answers);
           return answers;
       }

   private:
       void backtrack(
           vector<int>& nums,
           int position,
           vector<vector<int>>& answers
       ) {
           if (position == static_cast<int>(nums.size())) {
               answers.push_back(nums);
               return;
           }

           for (int candidate = position;
                candidate < static_cast<int>(nums.size());
                ++candidate) {
               swap(nums[position], nums[candidate]);
               backtrack(nums, position + 1, answers);
               swap(nums[position], nums[candidate]);
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def permute(self, nums: list[int]) -> list[list[int]]:
           answers: list[list[int]] = []

           def backtrack(position: int) -> None:
               if position == len(nums):
                   # 必须复制；nums 会在后续撤销中继续变化。
                   answers.append(nums.copy())
                   return

               for candidate in range(position, len(nums)):
                   nums[position], nums[candidate] = (
                       nums[candidate],
                       nums[position],
                   )
                   backtrack(position + 1)
                   nums[position], nums[candidate] = (
                       nums[candidate],
                       nums[position],
                   )

           backtrack(0)
           return answers

Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> permute(int[] nums) {
           List<List<Integer>> answers = new ArrayList<>();
           backtrack(nums, 0, answers);
           return answers;
       }

       private void backtrack(
           int[] nums,
           int position,
           List<List<Integer>> answers
       ) {
           if (position == nums.length) {
               List<Integer> copy = new ArrayList<>(nums.length);
               for (int value : nums) {
                   copy.add(value);
               }
               answers.add(copy);
               return;
           }

           for (int candidate = position;
                candidate < nums.length;
                ++candidate) {
               swap(nums, position, candidate);
               backtrack(nums, position + 1, answers);
               swap(nums, position, candidate);
           }
       }

       private void swap(int[] nums, int left, int right) {
           int temp = nums[left];
           nums[left] = nums[right];
           nums[right] = temp;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn permute(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
           let mut answers = Vec::new();
           Self::backtrack(&mut nums, 0, &mut answers);
           answers
       }

       fn backtrack(
           nums: &mut Vec<i32>,
           position: usize,
           answers: &mut Vec<Vec<i32>>,
       ) {
           if position == nums.len() {
               answers.push(nums.clone());
               return;
           }

           for candidate in position..nums.len() {
               nums.swap(position, candidate);
               Self::backtrack(nums, position + 1, answers);
               nums.swap(position, candidate);
           }
       }
   }

可变借用只在一次 ``swap`` 调用内存在，递归调用前已经结束，因此不会形成重叠借用。

Go
~~

.. code-block:: go

   func permute(nums []int) [][]int {
       answers := make([][]int, 0)

       var backtrack func(int)
       backtrack = func(position int) {
           if position == len(nums) {
               copyOfNums := append([]int(nil), nums...)
               answers = append(answers, copyOfNums)
               return
           }

           for candidate := position; candidate < len(nums); candidate++ {
               nums[position], nums[candidate] =
                   nums[candidate], nums[position]
               backtrack(position + 1)
               nums[position], nums[candidate] =
                   nums[candidate], nums[position]
           }
       }

       backtrack(0)
       return answers
   }

``append([]int(nil), nums...)`` 创建独立切片；直接追加 ``nums`` 会让所有结果共享同一底层数组。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function permute(nums: number[]): number[][] {
       const answers: number[][] = [];

       function backtrack(position: number): void {
           if (position === nums.length) {
               answers.push([...nums]);
               return;
           }

           for (
               let candidate = position;
               candidate < nums.length;
               candidate++
           ) {
               [nums[position], nums[candidate]] =
                   [nums[candidate], nums[position]];
               backtrack(position + 1);
               [nums[position], nums[candidate]] =
                   [nums[candidate], nums[position]];
           }
       }

       backtrack(0);
       return answers;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> Permute(int[] nums) {
           IList<IList<int>> answers = new List<IList<int>>();
           Backtrack(nums, 0, answers);
           return answers;
       }

       private void Backtrack(
           int[] nums,
           int position,
           IList<IList<int>> answers
       ) {
           if (position == nums.Length) {
               answers.Add(new List<int>(nums));
               return;
           }

           for (int candidate = position;
                candidate < nums.Length;
                ++candidate) {
               (nums[position], nums[candidate]) =
                   (nums[candidate], nums[position]);
               Backtrack(nums, position + 1, answers);
               (nums[position], nums[candidate]) =
                   (nums[candidate], nums[position]);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function permute(nums::Vector{Int})::Vector{Vector{Int}}
       answers = Vector{Vector{Int}}()

       function backtrack(position::Int)
           if position > length(nums)
               push!(answers, copy(nums))
               return
           end

           for candidate in position:length(nums)
               nums[position], nums[candidate] =
                   nums[candidate], nums[position]
               backtrack(position + 1)
               nums[position], nums[candidate] =
                   nums[candidate], nums[position]
           end
       end

       backtrack(1)
       return answers
   end

Julia 使用一基位置，因此结束条件是 ``position > length(nums)``，首层从 ``1`` 开始。

R
~

.. code-block:: r

   permute <- function(nums) {
     answers <- list()

     backtrack <- function(position) {
       if (position > length(nums)) {
         answers[[length(answers) + 1L]] <<- nums
         return(invisible(NULL))
       }

       for (candidate in seq.int(position, length(nums))) {
         temp <- nums[[position]]
         nums[[position]] <<- nums[[candidate]]
         nums[[candidate]] <<- temp

         backtrack(position + 1L)

         temp <- nums[[position]]
         nums[[position]] <<- nums[[candidate]]
         nums[[candidate]] <<- temp
       }
     }

     backtrack(1L)
     answers
   }

``nums`` 和 ``answers`` 位于外层函数环境，递归函数使用 ``<<-`` 修改它们。R 在保存列表元素时
采用值语义，后续交换不会修改已经保存的排列。

关键边界
--------

* 单元素数组：根层选择唯一元素，产生一个排列；
* 负数或零：算法只依赖元素身份，不依赖数值范围；
* 结果复制：叶子节点必须复制当前数组，不能保存可变数组引用；
* 输入元素互异：这是“不做同层去重仍不会重复”的前提；
* 撤销顺序：递归返回后必须交换同一对位置。

易错点
------

* 叶子节点直接保存 ``nums`` 引用，最终所有答案变成相同内容；
* 交换后忘记撤销，兄弟分支从被污染的数组状态开始；
* 循环从 ``0`` 开始，重新选择已经固定的前缀；
* 把结束条件写成 ``position == n - 1`` 却忘记保存最后一种状态；
* 额外使用 ``used`` 时没有在返回后清除标记；
* 对包含重复值的数组直接使用本解法，得到重复排列。

新增与强化知识
--------------

新增
~~~~

* 数组后缀可以原地表示“尚未使用的候选集合”；
* 交换与反向交换构成可逆状态变换；
* 排列搜索树第 ``d`` 层固定第 ``d`` 个位置。

强化
~~~~

* 复用 0017、0022、0039、0040 的“选择—递归—撤销”骨架；
* 输出型问题的复杂度必须包含复制全部结果的成本；
* 每条根到叶路径由一串位置选择唯一确定。

最小自检
--------

#. ``nums[0:position]`` 与 ``nums[position:n]`` 分别表示什么？
#. 为什么一条递归路径不会重复使用同一个元素？
#. 为什么叶子节点必须复制当前数组？
#. 交换撤销如何保证兄弟分支独立？
#. 为什么输入互异时不会产生重复排列？

答案要点
~~~~~~~~

#. 前者是固定前缀，后者是尚未选择的候选后缀。
#. 选中元素被交换进固定前缀，后续层只扫描更短后缀。
#. 当前数组还会被后续撤销和其他分支修改。
#. 第二次交换是第一次交换的逆操作，恢复父层状态。
#. 两条不同路径最早分歧位置选择不同值，最终排列也不同。
