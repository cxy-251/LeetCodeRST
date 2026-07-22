PREFIXES = {
    "0001-0100/0004-median-of-two-sorted-arrays.rst": r'''题目信息
--------

:题号: 0004
:题名: Median of Two Sorted Arrays
:难度: Hard
:类型: Algorithms
:主题: 数组、二分查找、分割
:原题: `LeetCode 0004 <https://leetcode.com/problems/median-of-two-sorted-arrays/>`_

题目重述
--------

给定两个分别按非递减顺序排列的整数数组 ``nums1`` 和 ``nums2``，求把两者视为一个有序序列后的中位数。其中一个数组可以为空，两个数组不能同时为空。总长度为奇数时返回中间元素；总长度为偶数时返回中间两个元素的平均值。目标时间复杂度应为 ``O(log(m+n))``，输入数组保持不变。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1, 2, 8], nums2 = [3, 4, 5, 6, 7]
   输出：4.5
   解释：合并序列为 [1,2,3,4,5,6,7,8]，中间两个值是 4 和 5。

.. code-block:: text

   输入：nums1 = [], nums2 = [2, 4, 6]
   输出：4.0
   解释：允许一侧为空，中位数是唯一的中间元素。''',
    "0001-0100/0005-longest-palindromic-substring.rst": r'''题目信息
--------

:题号: 0005
:题名: Longest Palindromic Substring
:难度: Medium
:类型: Algorithms
:主题: 字符串、动态规划、中心扩展
:原题: `LeetCode 0005 <https://leetcode.com/problems/longest-palindromic-substring/>`_

题目重述
--------

给定字符串 ``s``，返回其中长度最长的回文子串。子串必须是原字符串中的连续区间；回文串从左向右和从右向左读取完全相同。若存在多个长度相同的最长答案，返回其中任意一个即可。

自建示例
--------

.. code-block:: text

   输入：s = "cabacx"
   输出："cabac"
   解释：前五个字符正向和反向读取都相同。

.. code-block:: text

   输入：s = "zabccbay"
   输出："abccba"
   解释：最长回文子串位于下标 1 到 6。''',
    "0001-0100/0006-zigzag-conversion.rst": r'''题目信息
--------

:题号: 0006
:题名: Zigzag Conversion
:难度: Medium
:类型: Algorithms
:主题: 字符串、模拟、周期
:原题: `LeetCode 0006 <https://leetcode.com/problems/zigzag-conversion/>`_

题目重述
--------

给定字符串 ``s`` 和行数 ``numRows``，按从上到下、再斜向上、再从上到下的方式循环排列字符，形成 Z 字形布局。随后逐行从左到右读取字符并返回结果。当 ``numRows`` 为 1，或行数不少于字符串长度时，排列结果与原字符串相同。

自建示例
--------

.. code-block:: text

   输入：s = "ABCDEFGHIJ", numRows = 4
   布局行：AG / BFH / CEI / DJ
   输出："AGBFHCEIDJ"

.. code-block:: text

   输入：s = "ABCDE", numRows = 2
   布局行：ACE / BD
   输出："ACEBD"''',
    "0001-0100/0007-reverse-integer.rst": r'''题目信息
--------

:题号: 0007
:题名: Reverse Integer
:难度: Medium
:类型: Algorithms
:主题: 数学、整数溢出
:原题: `LeetCode 0007 <https://leetcode.com/problems/reverse-integer/>`_

题目重述
--------

给定一个 32 位有符号整数 ``x``，反转其十进制数字顺序并保留原符号。反转后产生的前导零自动消失；若结果超出 32 位有符号整数范围 ``[-2^31, 2^31-1]``，返回 0。实现不能依赖 64 位整数存放最终结果。

自建示例
--------

.. code-block:: text

   输入：x = 12030
   输出：3021
   解释：反转后开头的两个 0 不保留。

.. code-block:: text

   输入：x = 1563847412
   输出：0
   解释：反转值 2147483651 超出 32 位有符号整数上限。''',
    "0001-0100/0008-string-to-integer-atoi.rst": r'''题目信息
--------

:题号: 0008
:题名: String to Integer (atoi)
:难度: Medium
:类型: Algorithms
:主题: 字符串、模拟、状态机
:原题: `LeetCode 0008 <https://leetcode.com/problems/string-to-integer-atoi/>`_

题目重述
--------

将字符串 ``s`` 转换为 32 位有符号整数。先跳过开头的空格，再读取可选的 ``+`` 或 ``-``，随后连续读取十进制数字；遇到第一个非数字字符即停止。若没有读到数字则返回 0；若数值越界，则截断到 ``INT_MIN`` 或 ``INT_MAX``。

自建示例
--------

.. code-block:: text

   输入：s = "   -314xyz"
   输出：-314
   解释：符号后的连续数字被读取，遇到 x 后停止。

.. code-block:: text

   输入：s = "words 52"
   输出：0
   解释：跳过前导空格后首字符不是符号或数字。

.. code-block:: text

   输入：s = "99999999999"
   输出：2147483647
   解释：正数越界后截断到 INT_MAX。''',
    "0001-0100/0009-palindrome-number.rst": r'''题目信息
--------

:题号: 0009
:题名: Palindrome Number
:难度: Easy
:类型: Algorithms
:主题: 数学、数字反转
:原题: `LeetCode 0009 <https://leetcode.com/problems/palindrome-number/>`_

题目重述
--------

判断整数 ``x`` 的十进制表示是否为回文。负数包含负号，因此不是回文；除 0 外，以 0 结尾的正整数也不可能是回文。返回布尔值，不要求把整数转换为字符串。

自建示例
--------

.. code-block:: text

   输入：x = 1234321
   输出：true
   解释：从左向右和从右向左读取均为 1234321。

.. code-block:: text

   输入：x = 120
   输出：false
   解释：反向读取为 021，与原数的十进制表示不同。''',
    "0001-0100/0010-regular-expression-matching.rst": r'''题目信息
--------

:题号: 0010
:题名: Regular Expression Matching
:难度: Hard
:类型: Algorithms
:主题: 字符串、动态规划、递归
:原题: `LeetCode 0010 <https://leetcode.com/problems/regular-expression-matching/>`_

题目重述
--------

给定字符串 ``s`` 和模式 ``p``，判断模式能否匹配整个字符串。模式中的普通字符只能匹配自身，``.`` 可以匹配任意单个字符，``*`` 表示它前面的元素可以重复零次或多次。匹配必须覆盖 ``s`` 的全部字符，不能只匹配其中一段。

自建示例
--------

.. code-block:: text

   输入：s = "bbbba", p = "b*a"
   输出：true
   解释：b* 匹配四个 b，末尾 a 匹配自身。

.. code-block:: text

   输入：s = "abcd", p = ".*e"
   输出：false
   解释：.* 可以覆盖前缀，但模式最后仍要求一个 e。''',
    "0001-0100/0011-container-with-most-water.rst": r'''题目信息
--------

:题号: 0011
:题名: Container With Most Water
:难度: Medium
:类型: Algorithms
:主题: 数组、双指针、贪心
:原题: `LeetCode 0011 <https://leetcode.com/problems/container-with-most-water/>`_

题目重述
--------

数组 ``height`` 中第 ``i`` 个值表示位于横坐标 ``i`` 的竖线高度。任选两条竖线与 x 轴组成容器，容器能装的水量等于两线间距乘以较短竖线的高度。返回所有选择中的最大面积，竖线不能倾斜。

自建示例
--------

.. code-block:: text

   输入：height = [2, 3, 10, 5, 7, 8, 9]
   输出：36
   解释：下标 2 和 6 的间距为 4，较短高度为 9，面积为 36。

.. code-block:: text

   输入：height = [5, 1, 5]
   输出：10
   解释：选择两端，面积为 min(5,5) * 2。''',
    "0001-0100/0012-integer-to-roman.rst": r'''题目信息
--------

:题号: 0012
:题名: Integer to Roman
:难度: Medium
:类型: Algorithms
:主题: 数学、字符串、贪心
:原题: `LeetCode 0012 <https://leetcode.com/problems/integer-to-roman/>`_

题目重述
--------

给定 ``1`` 到 ``3999`` 之间的整数 ``num``，按照标准罗马数字规则返回对应字符串。通常从大到小组合符号；4、9、40、90、400、900 使用减法形式 ``IV``、``IX``、``XL``、``XC``、``CD``、``CM``。

自建示例
--------

.. code-block:: text

   输入：num = 2421
   输出："MMCDXXI"
   解释：2000 + 400 + 20 + 1。

.. code-block:: text

   输入：num = 944
   输出："CMXLIV"
   解释：900、40 和 4 都使用减法形式。''',
    "0001-0100/0013-roman-to-integer.rst": r'''题目信息
--------

:题号: 0013
:题名: Roman to Integer
:难度: Easy
:类型: Algorithms
:主题: 数学、字符串、哈希表
:原题: `LeetCode 0013 <https://leetcode.com/problems/roman-to-integer/>`_

题目重述
--------

给定一个合法罗马数字字符串 ``s``，返回它表示的整数。通常符号值从左到右相加；当较小符号位于较大符号之前时，该较小值应被减去，例如 ``IV`` 表示 4、``CM`` 表示 900。输入结果范围为 1 到 3999。

自建示例
--------

.. code-block:: text

   输入：s = "MMCDXXI"
   输出：2421
   解释：MM + CD + XX + I = 2000 + 400 + 20 + 1。

.. code-block:: text

   输入：s = "CMXLIV"
   输出：944
   解释：CM = 900，XL = 40，IV = 4。''',
    "0001-0100/0014-longest-common-prefix.rst": r'''题目信息
--------

:题号: 0014
:题名: Longest Common Prefix
:难度: Easy
:类型: Algorithms
:主题: 字符串、字典树
:原题: `LeetCode 0014 <https://leetcode.com/problems/longest-common-prefix/>`_

题目重述
--------

给定字符串数组 ``strs``，返回所有字符串共同拥有的最长前缀。前缀必须从每个字符串的第一个字符开始连续出现；若第一个字符就不一致，返回空字符串。

自建示例
--------

.. code-block:: text

   输入：strs = ["interview", "internet", "internal"]
   输出："inter"
   解释：三个字符串前五个字符相同，第六个字符开始分叉。

.. code-block:: text

   输入：strs = ["alpha", "beta", "gamma"]
   输出：""
   解释：不存在共同的首字符。''',
    "0001-0100/0015-3sum.rst": r'''题目信息
--------

:题号: 0015
:题名: 3Sum
:难度: Medium
:类型: Algorithms
:主题: 数组、排序、双指针
:原题: `LeetCode 0015 <https://leetcode.com/problems/3sum/>`_

题目重述
--------

给定整数数组 ``nums``，找出所有由三个不同下标组成、元素和为 0 的三元组。答案按数值去重：相同的三个数无论来自哪些下标，只能出现一次；三元组内部和答案列表的顺序均不作要求。

自建示例
--------

.. code-block:: text

   输入：nums = [-2, 0, 1, 1, 2]
   输出：[[-2, 0, 2], [-2, 1, 1]]
   解释：两组数值和均为 0，重复下标组合不会产生重复答案。

.. code-block:: text

   输入：nums = [0, 0, 0, 0]
   输出：[[0, 0, 0]]
   解释：虽然有多种下标选择，数值三元组只保留一次。''',
    "0001-0100/0016-3sum-closest.rst": r'''题目信息
--------

:题号: 0016
:题名: 3Sum Closest
:难度: Medium
:类型: Algorithms
:主题: 数组、排序、双指针
:原题: `LeetCode 0016 <https://leetcode.com/problems/3sum-closest/>`_

题目重述
--------

给定整数数组 ``nums`` 和目标值 ``target``，从三个不同下标中各取一个元素，使三数之和与 ``target`` 的差的绝对值最小，并返回这个三数之和。题目要求返回最接近的和值，而不是返回三个元素或下标。

自建示例
--------

.. code-block:: text

   输入：nums = [1, 2, 5, 10, 11], target = 12
   输出：13
   解释：1 + 2 + 10 = 13，与目标只差 1。

.. code-block:: text

   输入：nums = [-4, -1, 1, 2], target = 1
   输出：2
   解释：-1 + 1 + 2 = 2，是最接近目标的和值。''',
    "0001-0100/0017-letter-combinations-of-a-phone-number.rst": r'''题目信息
--------

:题号: 0017
:题名: Letter Combinations of a Phone Number
:难度: Medium
:类型: Algorithms
:主题: 字符串、回溯
:原题: `LeetCode 0017 <https://leetcode.com/problems/letter-combinations-of-a-phone-number/>`_

题目重述
--------

给定只包含数字 ``2`` 到 ``9`` 的字符串 ``digits``，按照电话按键上每个数字对应的字母，返回所有可能的字母组合。每个输入数字必须贡献一个字母，组合顺序与数字顺序一致；输入为空时返回空列表。

自建示例
--------

.. code-block:: text

   输入：digits = "27"
   输出：["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"]
   解释：2 对应 abc，7 对应 pqrs，共有 3 * 4 个组合。

.. code-block:: text

   输入：digits = ""
   输出：[]''',
    "0001-0100/0018-4sum.rst": r'''题目信息
--------

:题号: 0018
:题名: 4Sum
:难度: Medium
:类型: Algorithms
:主题: 数组、排序、双指针
:原题: `LeetCode 0018 <https://leetcode.com/problems/4sum/>`_

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，找出所有由四个不同下标组成、元素和等于 ``target`` 的四元组。答案按四个数的取值去重，相同数值组合只能出现一次；返回顺序不作要求。

自建示例
--------

.. code-block:: text

   输入：nums = [-3, -1, 0, 2, 4, 5], target = 2
   输出：[[-3, -1, 2, 4]]

.. code-block:: text

   输入：nums = [2, 2, 2, 2, 2], target = 8
   输出：[[2, 2, 2, 2]]
   解释：虽然有多种下标选择，数值四元组只保留一次。''',
    "0001-0100/0019-remove-nth-node-from-end-of-list.rst": r'''题目信息
--------

:题号: 0019
:题名: Remove Nth Node From End of List
:难度: Medium
:类型: Algorithms
:主题: 链表、双指针
:原题: `LeetCode 0019 <https://leetcode.com/problems/remove-nth-node-from-end-of-list/>`_

题目重述
--------

给定单链表头节点 ``head`` 和正整数 ``n``，删除链表中倒数第 ``n`` 个节点，并返回删除后的头节点。``n`` 一定不会超过链表长度；被删除节点可能是头节点、尾节点或中间节点。

自建示例
--------

.. code-block:: text

   输入：head = [7, 8, 9, 10], n = 4
   输出：[8, 9, 10]
   解释：倒数第 4 个节点就是头节点 7。

.. code-block:: text

   输入：head = [1, 2], n = 1
   输出：[1]
   解释：删除尾节点。''',
    "0001-0100/0020-valid-parentheses.rst": r'''题目信息
--------

:题号: 0020
:题名: Valid Parentheses
:难度: Easy
:类型: Algorithms
:主题: 字符串、栈
:原题: `LeetCode 0020 <https://leetcode.com/problems/valid-parentheses/>`_

题目重述
--------

给定只由 ``()``、``[]``、``{}`` 组成的字符串 ``s``，判断括号是否有效。每个左括号必须由相同类型的右括号闭合，闭合顺序必须符合嵌套关系，并且不能出现没有对应左括号的右括号或未闭合的左括号。

自建示例
--------

.. code-block:: text

   输入：s = "{[()]}"
   输出：true
   解释：三层括号按相反顺序依次闭合。

.. code-block:: text

   输入：s = "([)]"
   输出：false
   解释：方括号尚未闭合时先出现了右圆括号。''',
    "0001-0100/0021-merge-two-sorted-lists.rst": r'''题目信息
--------

:题号: 0021
:题名: Merge Two Sorted Lists
:难度: Easy
:类型: Algorithms
:主题: 链表、递归、迭代
:原题: `LeetCode 0021 <https://leetcode.com/problems/merge-two-sorted-lists/>`_

题目重述
--------

给定两个按非递减顺序排列的单链表 ``list1`` 和 ``list2``，将它们合并为一个同样按非递减顺序排列的链表，并返回新链表的头节点。输入链表可以为空，重复值需要全部保留。

自建示例
--------

.. code-block:: text

   输入：list1 = [1, 3, 7], list2 = [2, 2, 8]
   输出：[1, 2, 2, 3, 7, 8]

.. code-block:: text

   输入：list1 = [], list2 = [4, 5]
   输出：[4, 5]''',
    "0001-0100/0022-generate-parentheses.rst": r'''题目信息
--------

:题号: 0022
:题名: Generate Parentheses
:难度: Medium
:类型: Algorithms
:主题: 字符串、回溯、动态规划
:原题: `LeetCode 0022 <https://leetcode.com/problems/generate-parentheses/>`_

题目重述
--------

给定正整数 ``n``，生成所有由 ``n`` 对圆括号组成的有效字符串。每个结果必须包含恰好 ``n`` 个左括号和 ``n`` 个右括号，任意前缀中的右括号数量都不能超过左括号数量；结果顺序不作要求。

自建示例
--------

.. code-block:: text

   输入：n = 2
   输出：["(())", "()()"]

.. code-block:: text

   输入：n = 1
   输出：["()"]''',
    "0001-0100/0023-merge-k-sorted-lists.rst": r'''题目信息
--------

:题号: 0023
:题名: Merge k Sorted Lists
:难度: Hard
:类型: Algorithms
:主题: 链表、堆、分治
:原题: `LeetCode 0023 <https://leetcode.com/problems/merge-k-sorted-lists/>`_

题目重述
--------

给定包含 ``k`` 条单链表的数组 ``lists``，每条链表都按非递减顺序排列。把所有节点合并为一条非递减链表并返回头节点。数组本身、其中的链表以及某些链表都可能为空，重复值需要全部保留。

自建示例
--------

.. code-block:: text

   输入：lists = [[-1, 4], [0, 3, 5], [2, 2]]
   输出：[-1, 0, 2, 2, 3, 4, 5]

.. code-block:: text

   输入：lists = []
   输出：[]''',
    "0001-0100/0024-swap-nodes-in-pairs.rst": r'''题目信息
--------

:题号: 0024
:题名: Swap Nodes in Pairs
:难度: Medium
:类型: Algorithms
:主题: 链表、递归、指针
:原题: `LeetCode 0024 <https://leetcode.com/problems/swap-nodes-in-pairs/>`_

题目重述
--------

给定单链表头节点 ``head``，每两个相邻节点组成一组并交换它们的位置，返回交换后的头节点。必须调整节点连接关系，不能只交换节点中的值；若链表长度为奇数，最后一个未配对节点保持原位。

自建示例
--------

.. code-block:: text

   输入：head = [7, 8, 9, 10, 11]
   输出：[8, 7, 10, 9, 11]

.. code-block:: text

   输入：head = [5]
   输出：[5]''',
    "0001-0100/0025-reverse-nodes-in-k-group.rst": r'''题目信息
--------

:题号: 0025
:题名: Reverse Nodes in k-Group
:难度: Hard
:类型: Algorithms
:主题: 链表、递归、指针
:原题: `LeetCode 0025 <https://leetcode.com/problems/reverse-nodes-in-k-group/>`_

题目重述
--------

给定单链表头节点 ``head`` 和正整数 ``k``，从头开始把节点按连续的 ``k`` 个分组，并反转每个完整分组的节点顺序。末尾不足 ``k`` 个节点时保持原顺序。必须修改节点连接关系，不能只交换节点值。

自建示例
--------

.. code-block:: text

   输入：head = [1, 2, 3, 4, 5, 6, 7], k = 3
   输出：[3, 2, 1, 6, 5, 4, 7]

.. code-block:: text

   输入：head = [1, 2], k = 3
   输出：[1, 2]
   解释：节点数量不足一个完整分组。''',
    "0001-0100/0026-remove-duplicates-from-sorted-array.rst": r'''题目信息
--------

:题号: 0026
:题名: Remove Duplicates from Sorted Array
:难度: Easy
:类型: Algorithms
:主题: 数组、双指针
:原题: `LeetCode 0026 <https://leetcode.com/problems/remove-duplicates-from-sorted-array/>`_

题目重述
--------

给定按非递减顺序排列的数组 ``nums``，在原数组上移除重复值，使每个不同元素只保留一次，并返回不同元素数量 ``k``。修改后 ``nums`` 的前 ``k`` 个位置必须按原顺序保存所有不同元素；下标 ``k`` 之后的内容不作要求。

自建示例
--------

.. code-block:: text

   输入：nums = [0, 0, 1, 1, 1, 2, 3, 3]
   输出：k = 4，nums 前四项为 [0, 1, 2, 3]

.. code-block:: text

   输入：nums = [5]
   输出：k = 1，nums 前一项为 [5]''',
    "0001-0100/0027-remove-element.rst": r'''题目信息
--------

:题号: 0027
:题名: Remove Element
:难度: Easy
:类型: Algorithms
:主题: 数组、双指针
:原题: `LeetCode 0027 <https://leetcode.com/problems/remove-element/>`_

题目重述
--------

给定整数数组 ``nums`` 和整数 ``val``，在原数组上移除所有等于 ``val`` 的元素，并返回剩余元素数量 ``k``。修改后前 ``k`` 个位置必须保存全部剩余元素，顺序可以改变；后续位置的值不作要求。

自建示例
--------

.. code-block:: text

   输入：nums = [4, 1, 4, 2, 4], val = 4
   输出：k = 2，前两项可为 [1, 2]

.. code-block:: text

   输入：nums = [1, 2, 3], val = 9
   输出：k = 3
   解释：数组中没有需要移除的元素。''',
    "0001-0100/0028-find-the-index-of-the-first-occurrence-in-a-string.rst": r'''题目信息
--------

:题号: 0028
:题名: Find the Index of the First Occurrence in a String
:难度: Easy
:类型: Algorithms
:主题: 字符串、字符串匹配
:原题: `LeetCode 0028 <https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/>`_

题目重述
--------

给定字符串 ``haystack`` 和 ``needle``，返回 ``needle`` 在 ``haystack`` 中第一次完整出现的起始下标；若从未出现，返回 ``-1``。匹配必须是连续且逐字符相同的子串，存在多次匹配时只返回最靠左的位置。

自建示例
--------

.. code-block:: text

   输入：haystack = "algorithmbook", needle = "book"
   输出：9

.. code-block:: text

   输入：haystack = "aaaaa", needle = "bba"
   输出：-1''',
    "0001-0100/0029-divide-two-integers.rst": r'''题目信息
--------

:题号: 0029
:题名: Divide Two Integers
:难度: Medium
:类型: Algorithms
:主题: 数学、位运算
:原题: `LeetCode 0029 <https://leetcode.com/problems/divide-two-integers/>`_

题目重述
--------

给定两个 32 位有符号整数 ``dividend`` 和非零整数 ``divisor``，计算整数商，结果向 0 截断。实现不能使用乘法、除法和取模运算。若唯一的溢出情况 ``INT_MIN / -1`` 发生，返回 ``INT_MAX``。

自建示例
--------

.. code-block:: text

   输入：dividend = 43, divisor = -8
   输出：-5
   解释：精确结果为 -5.375，向 0 截断为 -5。

.. code-block:: text

   输入：dividend = -2147483648, divisor = -1
   输出：2147483647
   解释：数学结果超过 32 位有符号整数上限。''',
    "0001-0100/0030-substring-with-concatenation-of-all-words.rst": r'''题目信息
--------

:题号: 0030
:题名: Substring with Concatenation of All Words
:难度: Hard
:类型: Algorithms
:主题: 字符串、哈希表、滑动窗口
:原题: `LeetCode 0030 <https://leetcode.com/problems/substring-with-concatenation-of-all-words/>`_

题目重述
--------

给定字符串 ``s`` 和字符串数组 ``words``，其中所有单词长度相同。找出所有起始下标，使从该位置开始的连续子串可以由 ``words`` 中的全部单词各使用一次、按任意顺序首尾连接而成。``words`` 中的重复单词必须按出现次数使用，答案顺序不作要求。

自建示例
--------

.. code-block:: text

   输入：s = "catdogcatdog", words = ["cat", "dog"]
   输出：[0, 3, 6]
   解释：对应子串依次为 "catdog"、"dogcat"、"catdog"。

.. code-block:: text

   输入：s = "aaaaaa", words = ["aa", "aa"]
   输出：[0, 1, 2]
   解释：每个长度为 4 的 "aaaa" 都能拆成两个 "aa"。''',
}
