0241. Different Ways to Add Parentheses
=======================================

题目信息
--------

:题号: 0241
:难度: Medium
:主题: 字符串、分治、记忆化、表达式
:原题: `LeetCode 0241 <https://leetcode.com/problems/different-ways-to-add-parentheses/>`_
:重点: 枚举所有二元结合方式、运算符只有加减乘、相同结果可以重复、返回顺序不限

题目重述
--------

给定一个由非负十进制整数以及 ``+``、``-``、``*`` 三种二元运算符组成的表达式字符串 ``expression``。通过改变运算的括号分组方式，枚举所有可能的计算结果并返回这些整数。

字符串长度位于 ``[1, 20]``，表达式中的整数及所有中间结果、最终结果都适合 32 位有符号整数。不同括号方式即使得到相同数值，也要在结果中保留对应的重复项；返回结果的排列顺序不作要求。题目不是要求生成带括号字符串，而是返回每种合法分组对应的数值。

自建示例
--------

减法结合方向不同：

.. code-block:: text

   输入：expression = "3-1-2"
   输出：[0, 4]
   解释：(3-1)-2=0，而 3-(1-2)=4；返回 [4,0] 也同样合法。

不同分组得到重复结果：

.. code-block:: text

   输入：expression = "2*2*2"
   输出：[8, 8]
   解释：(2*2)*2 和 2*(2*2) 是两种不同分组，虽然结果都为 8，两个结果仍需保留。

按最后一个运算符分治
--------------------

任意一种完整加括号方式，都有一个最后执行的二元运算符。若它位于第 ``mid`` 个运算符，
左边表达式和右边表达式必须各自独立完成一种合法加括号方式，然后用该运算符组合两侧结果。
因此定义 ``solve(l,r)`` 为第 ``l`` 到第 ``r`` 个数字之间所有可能结果：

.. code-block:: text

   for mid in [l, r):
       left_results  = solve(l, mid)
       right_results = solve(mid+1, r)
       对每个 left、right 应用 ops[mid]

区间只有一个数字时，唯一结果就是该数字。相同区间会被许多更大区间重复请求，使用区间端点记忆化，
但组合结果本身仍按产生次数加入，不能用集合去重。

正确性说明
----------

取任意一种加括号方式，其最外层最后运算符唯一地把表达式分成左右两个连续区间；递归会枚举这个 ``mid``，
并由归纳假设取得左右方式。反过来，任取递归得到的左右结果和一个分割运算符，把两侧加括号后就是合法完整分组。
所以分治既不遗漏也不产生非法方式。不同分组即使数值相同，也在左右结果的笛卡尔积中分别保留。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> numbers;
       std::vector<char> operators;
       std::map<std::pair<int, int>, std::vector<int>> memo;

       std::vector<int> solve(int left, int right) {
           const auto key = std::make_pair(left, right);
           auto cached = memo.find(key);
           if (cached != memo.end()) return cached->second;

           if (left == right) {
               return memo[key] = {numbers[left]};
           }

           std::vector<int> result;
           for (int mid = left; mid < right; ++mid) {
               const std::vector<int> left_results = solve(left, mid);
               const std::vector<int> right_results = solve(mid + 1, right);
               for (int a : left_results) {
                   for (int b : right_results) {
                       if (operators[mid] == '+') result.push_back(a + b);
                       else if (operators[mid] == '-') result.push_back(a - b);
                       else result.push_back(a * b);
                   }
               }
           }
           return memo[key] = result;
       }

   public:
       std::vector<int> diffWaysToCompute(const std::string& expression) {
           numbers.clear();
           operators.clear();
           memo.clear();

           int number = 0;
           bool reading_number = false;
           for (char ch : expression) {
               if (ch >= '0' && ch <= '9') {
                   number = number * 10 + (ch - '0');
                   reading_number = true;
               } else {
                   numbers.push_back(number);
                   number = 0;
                   reading_number = false;
                   operators.push_back(ch);
               }
           }
           if (reading_number || numbers.empty()) numbers.push_back(number);
           return solve(0, static_cast<int>(numbers.size()) - 1);
       }
   };

代码分析
--------

表达式只有非负整数和二元运算符，解析时用连续数字构造多位数。设数字个数为 ``p``，递归深度为 ``O(p)``；
记忆化避免重复计算相同区间，但结果列表可能按 Catalan 数量增长，时间和空间必须包含这些输出结果的规模，
不能简单声称为多项式。额外的区间状态数为 ``O(p^2)``，返回顺序不影响正确性。
