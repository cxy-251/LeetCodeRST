0017. Letter Combinations of a Phone Number
============================================

题目信息
--------

:题号: 0017
:难度: Medium
:主题: 字符串、回溯、笛卡尔积
:原题: `LeetCode 0017 <https://leetcode.com/problems/letter-combinations-of-a-phone-number/>`_
:重点: 逐位扩展前缀、复用回溯路径、由分支数乘积确定输出规模

题目重述
--------

给定一个只包含数字 ``2`` 到 ``9`` 的字符串 ``digits``，按照电话键盘映射返回所有可能的字母组合：

``2 -> abc``、``3 -> def``、``4 -> ghi``、``5 -> jkl``、``6 -> mno``、``7 -> pqrs``、
``8 -> tuv``、``9 -> wxyz``。

每个数字必须选择恰好一个对应字母，组合中的字符顺序必须与数字顺序一致。若 ``digits`` 为空，返回空列表。
结果顺序不限。

自建示例
--------

* 两个三字母按键：``digits = "23"``，返回 ``["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]``；
* 三字母与四字母按键：``digits = "27"``，共有 ``3 * 4 = 12`` 个组合；
* 单个数字：``digits = "8"``，返回 ``["t", "u", "v"]``；
* 重复数字：``digits = "22"``，两个位置独立选择，共有 ``3 * 3 = 9`` 个组合；
* 空输入：``digits = ""``，返回 ``[]``。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>
   #include <vector>

   class Solution {
   private:
       const std::array<std::string, 10> letters{
           "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
       };

       std::vector<std::string> iterativeProduct(const std::string& digits) {
           if (digits.empty()) {
               return {};
           }
           std::vector<std::string> result{""};
           for (char digit : digits) {
               const std::string& choices = letters[digit - '0'];
               std::vector<std::string> next;
               next.reserve(result.size() * choices.size());
               for (const std::string& prefix : result) {
                   for (char letter : choices) {
                       next.push_back(prefix + letter);
                   }
               }
               result.swap(next);
           }
           return result;
       }

       void backtrack(const std::string& digits, int index, std::string& path,
                      std::vector<std::string>& result) {
           if (index == static_cast<int>(digits.size())) {
               result.push_back(path);
               return;
           }
           for (char letter : letters[digits[index] - '0']) {
               path.push_back(letter);
               backtrack(digits, index + 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::string> backtrackingProduct(const std::string& digits) {
           if (digits.empty()) {
               return {};
           }
           int combinationCount = 1;
           for (char digit : digits) {
               combinationCount *= static_cast<int>(letters[digit - '0'].size());
           }
           std::vector<std::string> result;
           result.reserve(combinationCount);
           std::string path;
           path.reserve(digits.size());
           backtrack(digits, 0, path, result);
           return result;
       }

   public:
       std::vector<std::string> letterCombinations(std::string digits) {
           return backtrackingProduct(digits);
       }
   };

题解
----

组合结构
~~~~~~~~

第 ``i`` 个数字只决定答案中第 ``i`` 个字符的可选集合。例如 ``digits = "27"`` 时：

* 第 0 位从 ``abc`` 中选择；
* 第 1 位从 ``pqrs`` 中选择。

每个完整答案都必须从每个集合中各取一个字符，因此答案就是这些按键字母集合按输入顺序形成的笛卡尔积。
若各位置分别有 ``b0, b1, ..., bk-1`` 个选择，答案数量为：

``N = b0 * b1 * ... * bk-1``。

这意味着算法无法少于 ``N`` 次生成工作，因为这些答案本身都必须返回。

逐层扩展
~~~~~~~~

``iterativeProduct`` 从唯一的空前缀 ``""`` 开始。处理一个数字时，把当前每个前缀分别追加该按键的所有字母，
得到下一层前缀集合。

处理完前 ``i`` 个数字后，``result`` 恰好包含这 ``i`` 个位置的全部组合：

* 初始时处理了零个位置，空前缀是唯一组合；
* 假设当前已经包含前 ``i`` 位的全部组合；
* 给每个前缀分别追加第 ``i`` 位的全部合法字母，就得到前 ``i + 1`` 位的全部组合，且没有重复。

这种方法直接保存每一层的全部中间字符串。结构直观，但 ``prefix + letter`` 会为每个新节点构造一个新字符串。

回溯状态
~~~~~~~~

回溯只需要两个核心状态：

* ``index``：下一个需要选择字母的数字位置；
* ``path``：前 ``index`` 个位置已经选出的前缀。

当前位置的选择集合由 ``digits[index]`` 唯一确定。不同位置可以选择相同字母，因此不需要访问标记，也不存在
“某个字母已经使用过”的限制。

每次选择一个字母后执行三步：

``追加字母 -> 递归处理下一位 -> 删除末尾字母``。

递归返回时删除刚加入的字符，``path`` 就恢复为进入本层前的父前缀。下一次循环可以复用同一个字符串缓冲区，
不会混入上一分支的选择。

叶节点
~~~~~~

当 ``index == digits.size()`` 时，每个数字都已经贡献一个字符，此时 ``path`` 的长度恰好等于输入长度，可以
复制到结果中。

每个合法组合对应唯一的一条逐位选择路径；回溯在每一层遍历当前按键的全部字母，所以所有路径都会到达一次。
不同组合至少在一个位置选择不同，因此不会生成重复答案。

空输入
~~~~~~

若直接从空前缀开始回溯，空输入会立即到达叶节点并产生 ``[""]``。题目要求的结果是空列表，因此两个入口
都先单独处理 ``digits.empty()``，把“没有数字”与“已经为所有数字完成选择”区分开。

代码演进
~~~~~~~~

``iterativeProduct`` 用一个结果数组保存当前整层前缀，再构造下一层数组。它把笛卡尔积的逐层展开直接写成循环。

``backtrackingProduct`` 删除中间层数组，只保留一个可变 ``path``。内部节点只执行追加与撤销，完整字符串只在
叶节点复制。``combinationCount`` 由各按键分支数的乘积得到，用于提前预留结果容量，不参与搜索逻辑。

公开入口采用 ``backtrackingProduct``。它与组合树结构一一对应，并把除最终答案外的工作状态压缩到一条当前路径。

复杂度分析
~~~~~~~~~~

设数字长度为 ``k``，答案数量为 ``N``。每个答案长度为 ``k``，复制到结果需要 ``O(k)``，因此两种方法的
总时间复杂度都是 ``O(Nk)``，返回结果占 ``O(Nk)`` 空间。

迭代方法还保存当前层和下一层的中间字符串。回溯方法除返回结果外只使用长度为 ``k`` 的路径和递归栈，工作
空间为 ``O(k)``。最坏情况下每个数字有四个字母，``N = 4^k``，时间可写为 ``O(k * 4^k)``。
