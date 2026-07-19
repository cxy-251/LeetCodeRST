0047. Permutations II
=====================

题目信息
--------

:题号: 0047
:难度: Medium
:主题: 回溯、排序、重复值去重、排列
:原题: `LeetCode 0047 <https://leetcode.com/problems/permutations-ii/>`_
:访问状态: Available
:教学重点: 同层等值分支去重、used 状态、排序后相邻判断、唯一排列证明

题目重述
--------

给定一个可能包含重复值的整数数组 ``nums``，返回所有不同的排列。每个排列必须使用数组中的
全部元素，并且每个输入下标最多使用一次。结果中不能出现两个内容完全相同的排列。

自建示例
--------

包含一个重复值
~~~~~~~~~~~~~~

.. code-block:: text

   输入：[1, 1, 2]
   输出：
   [1, 1, 2]
   [1, 2, 1]
   [2, 1, 1]

全部相同
~~~~~~~~

.. code-block:: text

   输入：[5, 5, 5]
   输出：[[5, 5, 5]]

多个重复组
~~~~~~~~~~

.. code-block:: text

   输入：[1, 1, 2, 2]
   不同排列数量：6

没有重复
~~~~~~~~

.. code-block:: text

   输入：[1, 2, 3]
   输出数量：6

问题抽象
--------

与 0046 一样，本题逐个决定排列位置。差别在于相同数值可能来自不同输入下标。若在同一递归层
分别选择两个相同值作为当前位置，它们形成的后续候选多重集合完全相同，会生成重复子树。

主解法先排序，使相同值相邻，并维护 ``used[index]``：

* ``used[index] = true`` 表示该输入下标已出现在当前路径中；
* 当前层扫描所有未使用下标；
* 当 ``nums[index] == nums[index - 1]`` 且前一个相同值尚未使用时，跳过当前下标。

去重条件写成：

.. code-block:: text

   index > 0
   nums[index] == nums[index - 1]
   used[index - 1] == false

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外状态
     - 取舍
   * - 排序、used 与同层跳过
     - ``O(n × U)``
     - ``O(n)``
     - 主解法；去重规则局部且易证明
   * - 每层哈希集合记录已选值
     - ``O(n × U)`` 期望
     - 每层集合
     - 不必排序，但常数和实现复杂度更高
   * - 生成全部 ``n!`` 排列后放集合
     - ``O(n × n!)``
     - ``O(n × n!)``
     - 先制造重复再去重，浪费搜索和内存
   * - 排序后不断调用 next permutation
     - ``O(n × U)``
     - ``O(1)`` 不含输出
     - 可按字典序生成，教学重点不同

其中 ``U`` 是不同排列数量：

.. code-block:: text

   U = n! / (count_1! × count_2! × ...)

主解法：排序后按下标回溯
------------------------

状态含义
~~~~~~~~

递归函数维护：

* ``path``：当前已确定的排列前缀；
* ``used``：每个排序后下标是否已进入当前路径；
* ``answers``：已经完成的不同排列；
* 当前递归深度等于 ``path`` 长度，也就是下一待填位置。

每层扫描所有下标，只有满足以下条件的元素可以选择：

#. 当前下标尚未使用；
#. 若它与前一个值相同，则前一个相同值必须已经在当前路径中。

为什么 used[index - 1] 为 false 表示同层重复
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设排序后相邻两个值相同：``nums[i - 1] == nums[i]``。

* 若 ``used[i - 1] == false``，前一个相同值还在本层候选集合中。选择 ``i`` 与选择 ``i - 1``
  放到当前位置，留下的值多重集合相同。前一个分支已经覆盖这棵子树，所以必须跳过 ``i``。
* 若 ``used[i - 1] == true``，前一个相同值已被祖先层使用。此时选择 ``i`` 是在更深位置再次
  放置同值，代表排列中合法的重复元素，不能跳过。

因此该条件只删除同一层的等价选择，不会禁止不同深度使用多个相同值。

核心不变量
~~~~~~~~~~

进入任意递归层时：

* ``path`` 中每个元素对应一个不同输入下标；
* ``used`` 与 ``path`` 精确一致，真值数量等于路径长度；
* 排序后的每组相同值，在当前层只允许最靠前的未使用下标作为代表；
* 每个尚未使用的数值副本仍有机会在后续位置被选择；
* 返回父层前，当前选择会从 ``path`` 和 ``used`` 中同步撤销。

正确性依据
~~~~~~~~~~

**合法性：** 每次只选择 ``used[index] == false`` 的下标，并在返回后撤销，因此一条完整路径恰好
使用每个输入下标一次。叶子路径长度为 ``n``，形成输入多重集合的一个排列。

**无重复：** 假设两个不同搜索路径生成相同数值排列。观察它们最早分歧的层。两条路径在该位置
必须选择相同数值但不同下标。排序使这些相同值相邻；在该层，较靠后的相同下标被选择时，较靠前
的等值下标仍未使用，因此触发跳过条件，矛盾。故不会生成重复排列。

**完整性：** 任取一个不同排列。从左到右构造它时，对当前所需数值，总可以选择该数值中最靠前
且尚未使用的下标。该下标不会被去重条件跳过；若它不是组内第一个，则前面的相同值一定已经被
更早位置使用。于是存在一条合法路径生成该排列，不会漏解。

复杂度
~~~~~~

设 ``U`` 为不同排列数量：

* 每个输出需要复制 ``n`` 个元素，时间复杂度为 ``O(n × U)``，另有排序 ``O(n log n)``；
* ``path``、``used`` 和递归栈均为 ``O(n)``；
* 输出占用 ``O(n × U)`` 空间。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   static int compare_ints(const void *left, const void *right) {
       int a = *(const int *)left;
       int b = *(const int *)right;
       return (a > b) - (a < b);
   }

   static void generate_unique(
       const int *nums,
       int nums_size,
       bool *used,
       int *path,
       int depth,
       int **answers,
       int *answer_count
   ) {
       if (depth == nums_size) {
           int *copy = malloc((size_t)nums_size * sizeof(int));
           memcpy(copy, path, (size_t)nums_size * sizeof(int));
           answers[*answer_count] = copy;
           ++(*answer_count);
           return;
       }

       for (int index = 0; index < nums_size; ++index) {
           if (used[index]) {
               continue;
           }
           if (index > 0 && nums[index] == nums[index - 1] &&
               !used[index - 1]) {
               continue;
           }

           used[index] = true;
           path[depth] = nums[index];
           generate_unique(
               nums,
               nums_size,
               used,
               path,
               depth + 1,
               answers,
               answer_count
           );
           used[index] = false;
       }
   }

   int **permuteUnique(
       int *nums,
       int numsSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       qsort(nums, (size_t)numsSize, sizeof(int), compare_ints);

       int capacity = 1;
       for (int value = 2; value <= numsSize; ++value) {
           capacity *= value;
       }

       int **answers = malloc((size_t)capacity * sizeof(int *));
       int *columns = malloc((size_t)capacity * sizeof(int));
       bool *used = calloc((size_t)numsSize, sizeof(bool));
       int *path = malloc((size_t)numsSize * sizeof(int));
       int answer_count = 0;

       generate_unique(
           nums,
           numsSize,
           used,
           path,
           0,
           answers,
           &answer_count
       );

       for (int index = 0; index < answer_count; ++index) {
           columns[index] = numsSize;
       }

       free(path);
       free(used);
       *returnSize = answer_count;
       *returnColumnSizes = columns;
       return answers;
   }

外层容量使用 ``n!`` 作为安全上界；有重复值时实际答案更少。排序会修改输入数组顺序。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       vector<vector<int>> permuteUnique(vector<int>& nums) {
           sort(nums.begin(), nums.end());
           vector<vector<int>> answers;
           vector<int> path;
           vector<bool> used(nums.size(), false);
           backtrack(nums, used, path, answers);
           return answers;
       }

   private:
       void backtrack(
           const vector<int>& nums,
           vector<bool>& used,
           vector<int>& path,
           vector<vector<int>>& answers
       ) {
           if (path.size() == nums.size()) {
               answers.push_back(path);
               return;
           }

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               if (used[index]) {
                   continue;
               }
               if (index > 0 && nums[index] == nums[index - 1] &&
                   !used[index - 1]) {
                   continue;
               }

               used[index] = true;
               path.push_back(nums[index]);
               backtrack(nums, used, path, answers);
               path.pop_back();
               used[index] = false;
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def permuteUnique(self, nums: list[int]) -> list[list[int]]:
           nums.sort()
           answers: list[list[int]] = []
           path: list[int] = []
           used = [False] * len(nums)

           def backtrack() -> None:
               if len(path) == len(nums):
                   answers.append(path.copy())
                   return

               for index, value in enumerate(nums):
                   if used[index]:
                       continue
                   if (
                       index > 0
                       and value == nums[index - 1]
                       and not used[index - 1]
                   ):
                       continue

                   used[index] = True
                   path.append(value)
                   backtrack()
                   path.pop()
                   used[index] = False

           backtrack()
           return answers

Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> permuteUnique(int[] nums) {
           Arrays.sort(nums);
           List<List<Integer>> answers = new ArrayList<>();
           List<Integer> path = new ArrayList<>();
           boolean[] used = new boolean[nums.length];
           backtrack(nums, used, path, answers);
           return answers;
       }

       private void backtrack(
           int[] nums,
           boolean[] used,
           List<Integer> path,
           List<List<Integer>> answers
       ) {
           if (path.size() == nums.length) {
               answers.add(new ArrayList<>(path));
               return;
           }

           for (int index = 0; index < nums.length; ++index) {
               if (used[index]) {
                   continue;
               }
               if (index > 0 && nums[index] == nums[index - 1] &&
                   !used[index - 1]) {
                   continue;
               }

               used[index] = true;
               path.add(nums[index]);
               backtrack(nums, used, path, answers);
               path.remove(path.size() - 1);
               used[index] = false;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn permute_unique(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
           nums.sort_unstable();
           let mut answers = Vec::new();
           let mut path = Vec::with_capacity(nums.len());
           let mut used = vec![false; nums.len()];
           Self::backtrack(&nums, &mut used, &mut path, &mut answers);
           answers
       }

       fn backtrack(
           nums: &[i32],
           used: &mut [bool],
           path: &mut Vec<i32>,
           answers: &mut Vec<Vec<i32>>,
       ) {
           if path.len() == nums.len() {
               answers.push(path.clone());
               return;
           }

           for index in 0..nums.len() {
               if used[index] {
                   continue;
               }
               if index > 0 && nums[index] == nums[index - 1] &&
                   !used[index - 1]
               {
                   continue;
               }

               used[index] = true;
               path.push(nums[index]);
               Self::backtrack(nums, used, path, answers);
               path.pop();
               used[index] = false;
           }
       }
   }

Go
~~

.. code-block:: go

   func permuteUnique(nums []int) [][]int {
       sort.Ints(nums)
       answers := make([][]int, 0)
       path := make([]int, 0, len(nums))
       used := make([]bool, len(nums))

       var backtrack func()
       backtrack = func() {
           if len(path) == len(nums) {
               copyOfPath := append([]int(nil), path...)
               answers = append(answers, copyOfPath)
               return
           }

           for index, value := range nums {
               if used[index] {
                   continue
               }
               if index > 0 && value == nums[index-1] &&
                   !used[index-1] {
                   continue
               }

               used[index] = true
               path = append(path, value)
               backtrack()
               path = path[:len(path)-1]
               used[index] = false
           }
       }

       backtrack()
       return answers
   }

需要导入 ``sort``。路径保存时必须复制切片。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function permuteUnique(nums: number[]): number[][] {
       nums.sort((left, right) => left - right);
       const answers: number[][] = [];
       const path: number[] = [];
       const used = new Array<boolean>(nums.length).fill(false);

       function backtrack(): void {
           if (path.length === nums.length) {
               answers.push([...path]);
               return;
           }

           for (let index = 0; index < nums.length; index++) {
               if (used[index]) {
                   continue;
               }
               if (
                   index > 0 &&
                   nums[index] === nums[index - 1] &&
                   !used[index - 1]
               ) {
                   continue;
               }

               used[index] = true;
               path.push(nums[index]);
               backtrack();
               path.pop();
               used[index] = false;
           }
       }

       backtrack();
       return answers;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> PermuteUnique(int[] nums) {
           Array.Sort(nums);
           IList<IList<int>> answers = new List<IList<int>>();
           List<int> path = new List<int>();
           bool[] used = new bool[nums.Length];
           Backtrack(nums, used, path, answers);
           return answers;
       }

       private void Backtrack(
           int[] nums,
           bool[] used,
           List<int> path,
           IList<IList<int>> answers
       ) {
           if (path.Count == nums.Length) {
               answers.Add(new List<int>(path));
               return;
           }

           for (int index = 0; index < nums.Length; ++index) {
               if (used[index]) {
                   continue;
               }
               if (index > 0 && nums[index] == nums[index - 1] &&
                   !used[index - 1]) {
                   continue;
               }

               used[index] = true;
               path.Add(nums[index]);
               Backtrack(nums, used, path, answers);
               path.RemoveAt(path.Count - 1);
               used[index] = false;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function permute_unique(nums::Vector{Int})::Vector{Vector{Int}}
       sort!(nums)
       answers = Vector{Vector{Int}}()
       path = Int[]
       used = falses(length(nums))

       function backtrack()
           if length(path) == length(nums)
               push!(answers, copy(path))
               return
           end

           for index in eachindex(nums)
               used[index] && continue
               if index > firstindex(nums) &&
                  nums[index] == nums[index - 1] &&
                  !used[index - 1]
                   continue
               end

               used[index] = true
               push!(path, nums[index])
               backtrack()
               pop!(path)
               used[index] = false
           end
       end

       backtrack()
       return answers
   end

R
~

.. code-block:: r

   permute_unique <- function(nums) {
     nums <- sort(nums)
     answers <- list()
     path <- numeric(0)
     used <- rep(FALSE, length(nums))

     backtrack <- function() {
       if (length(path) == length(nums)) {
         answers[[length(answers) + 1L]] <<- path
         return(invisible(NULL))
       }

       for (index in seq_along(nums)) {
         if (used[[index]]) {
           next
         }
         if (
           index > 1L &&
           nums[[index]] == nums[[index - 1L]] &&
           !used[[index - 1L]]
         ) {
           next
         }

         used[[index]] <<- TRUE
         path <<- c(path, nums[[index]])
         backtrack()
         path <<- path[-length(path)]
         used[[index]] <<- FALSE
       }
     }

     backtrack()
     answers
   }

``path`` 与 ``used`` 位于外层函数环境，由递归函数通过 ``<<-`` 更新。保存到答案列表时 R 使用
值语义，不会被后续撤销修改。

关键边界
--------

* 全部元素相同：每层只有第一个未使用副本能作为代表，最终只有一个答案；
* 没有重复：去重条件从不触发，退化为普通排列回溯；
* 多组重复值：每组分别应用“最靠前未使用副本”规则；
* 负数和零：排序与相等判断同样适用；
* 叶子复制：路径是可变对象，必须复制后保存。

易错点
------

* 忘记先排序，使相同值不相邻，去重条件失效；
* 把条件写成 ``used[index - 1] == true``，错误删除深层合法重复值；
* 无论前一个相同值是否使用都跳过，导致 ``[1, 1, 2]`` 无法生成包含两个 ``1`` 的排列；
* 只按数值维护一个全局 ``used`` 集合，无法区分多个相同副本；
* 返回前只弹出路径却忘记恢复 ``used``；
* 先生成全部排列再用集合去重，造成不必要的阶乘级重复工作。

新增与强化知识
--------------

新增
~~~~

* 重复值排列需要区分“相同数值”和“不同输入下标”；
* 排序把等价候选聚集在一起，使同层去重变成局部相邻判断；
* ``!used[index - 1]`` 表示前一个相同值仍属于当前层候选。

强化
~~~~

* 复用 0040 的同层重复跳过思想，但本题通过 ``used`` 判断前一个等值副本是否属于当前层；
* 复用 0046 的位置决策树，并增加规范代表选择；
* 正确性证明要分别说明无重复与不漏解。

最小自检
--------

#. 为什么排序是相邻去重条件的前提？
#. ``used[index - 1] == false`` 为什么表示同层重复？
#. ``used[index - 1] == true`` 时为什么不能跳过当前相同值？
#. 对 ``[1, 1, 2]``，第二个 ``1`` 在什么情况下可以被选择？
#. 为什么不同输入下标仍需要 ``used``，即使它们数值相同？

答案要点
~~~~~~~~

#. 排序保证相同值连续，当前值只需检查前一个相同副本。
#. 前一个副本尚未被祖先使用，仍是本层的等价候选，较前分支已经覆盖相同子树。
#. 前一个副本已在更早位置，当前副本代表在更深位置再次使用同值，是合法选择。
#. 当第一个 ``1`` 已经被当前路径使用时。
#. 每个输入下标最多使用一次；数值相同不代表是同一个副本。
