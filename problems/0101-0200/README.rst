LeetCode 0101–0200
==================

本目录按题号顺序保存 0101 至 0200 的算法教程。当前题号进度为：完成 0101 至 0155、0160、0162、
0164 至 0169、0171 至 0174、0179、0187 至 0191、0198；0156 至 0159、0161、0163、0170、0186
登记为 Premium 跳过，0175 至 0178、0180 至 0185、0196 至 0197 登记为 Database 跳过，0192 至 0195
登记为 Shell 跳过。每道公开算法题只有一个自包含 RST，正文与十语言代码全部直接内联，
不使用 ``.inc`` 或 ``.. include::``。

``0127``、``0129–0155``、``0160``、``0162``、``0164``、``0165`` 共 32 道公开题的质量返工
已经完成，``../../state/PROGRESS.toml`` 的 ``needs_revision`` 保持为空。
``0166–0169``、``0171–0174``、``0179``、``0187–0191`` 与 ``0198`` 已按冻结基线生成，下一入口为 0199。

已完成
------

#. `0101. Symmetric Tree <0101-symmetric-tree.rst>`_
#. `0102. Binary Tree Level Order Traversal <0102-binary-tree-level-order-traversal.rst>`_
#. `0103. Binary Tree Zigzag Level Order Traversal
   <0103-binary-tree-zigzag-level-order-traversal.rst>`_
#. `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_
#. `0105. Construct Binary Tree from Preorder and Inorder Traversal
   <0105-construct-binary-tree-from-preorder-and-inorder-traversal.rst>`_
#. `0106. Construct Binary Tree from Inorder and Postorder Traversal
   <0106-construct-binary-tree-from-inorder-and-postorder-traversal.rst>`_
#. `0107. Binary Tree Level Order Traversal II <0107-binary-tree-level-order-traversal-ii.rst>`_
#. `0108. Convert Sorted Array to Binary Search Tree
   <0108-convert-sorted-array-to-binary-search-tree.rst>`_
#. `0109. Convert Sorted List to Binary Search Tree
   <0109-convert-sorted-list-to-binary-search-tree.rst>`_
#. `0110. Balanced Binary Tree <0110-balanced-binary-tree.rst>`_
#. `0111. Minimum Depth of Binary Tree <0111-minimum-depth-of-binary-tree.rst>`_
#. `0112. Path Sum <0112-path-sum.rst>`_
#. `0113. Path Sum II <0113-path-sum-ii.rst>`_
#. `0114. Flatten Binary Tree to Linked List <0114-flatten-binary-tree-to-linked-list.rst>`_
#. `0115. Distinct Subsequences <0115-distinct-subsequences.rst>`_
#. `0116. Populating Next Right Pointers in Each Node
   <0116-populating-next-right-pointers-in-each-node.rst>`_
#. `0117. Populating Next Right Pointers in Each Node II
   <0117-populating-next-right-pointers-in-each-node-ii.rst>`_
#. `0118. Pascal's Triangle <0118-pascals-triangle.rst>`_
#. `0119. Pascal's Triangle II <0119-pascals-triangle-ii.rst>`_
#. `0120. Triangle <0120-triangle.rst>`_
#. `0121. Best Time to Buy and Sell Stock <0121-best-time-to-buy-and-sell-stock.rst>`_
#. `0122. Best Time to Buy and Sell Stock II <0122-best-time-to-buy-and-sell-stock-ii.rst>`_
#. `0123. Best Time to Buy and Sell Stock III <0123-best-time-to-buy-and-sell-stock-iii.rst>`_
#. `0124. Binary Tree Maximum Path Sum <0124-binary-tree-maximum-path-sum.rst>`_
#. `0125. Valid Palindrome <0125-valid-palindrome.rst>`_
#. `0126. Word Ladder II <0126-word-ladder-ii.rst>`_
#. `0127. Word Ladder <0127-word-ladder.rst>`_
#. `0128. Longest Consecutive Sequence <0128-longest-consecutive-sequence.rst>`_
#. `0129. Sum Root to Leaf Numbers <0129-sum-root-to-leaf-numbers.rst>`_
#. `0130. Surrounded Regions <0130-surrounded-regions.rst>`_
#. `0131. Palindrome Partitioning <0131-palindrome-partitioning.rst>`_
#. `0132. Palindrome Partitioning II <0132-palindrome-partitioning-ii.rst>`_
#. `0133. Clone Graph <0133-clone-graph.rst>`_
#. `0134. Gas Station <0134-gas-station.rst>`_
#. `0135. Candy <0135-candy.rst>`_
#. `0136. Single Number <0136-single-number.rst>`_
#. `0137. Single Number II <0137-single-number-ii.rst>`_
#. `0138. Copy List with Random Pointer <0138-copy-list-with-random-pointer.rst>`_
#. `0139. Word Break <0139-word-break.rst>`_
#. `0140. Word Break II <0140-word-break-ii.rst>`_
#. `0141. Linked List Cycle <0141-linked-list-cycle.rst>`_
#. `0142. Linked List Cycle II <0142-linked-list-cycle-ii.rst>`_
#. `0143. Reorder List <0143-reorder-list.rst>`_
#. `0144. Binary Tree Preorder Traversal <0144-binary-tree-preorder-traversal.rst>`_
#. `0145. Binary Tree Postorder Traversal <0145-binary-tree-postorder-traversal.rst>`_
#. `0146. LRU Cache <0146-lru-cache.rst>`_
#. `0147. Insertion Sort List <0147-insertion-sort-list.rst>`_
#. `0148. Sort List <0148-sort-list.rst>`_
#. `0149. Max Points on a Line <0149-max-points-on-a-line.rst>`_
#. `0150. Evaluate Reverse Polish Notation <0150-evaluate-reverse-polish-notation.rst>`_
#. `0151. Reverse Words in a String <0151-reverse-words-in-a-string.rst>`_
#. `0152. Maximum Product Subarray <0152-maximum-product-subarray.rst>`_
#. `0153. Find Minimum in Rotated Sorted Array
   <0153-find-minimum-in-rotated-sorted-array.rst>`_
#. `0154. Find Minimum in Rotated Sorted Array II
   <0154-find-minimum-in-rotated-sorted-array-ii.rst>`_
#. `0155. Min Stack <0155-min-stack.rst>`_
#. `0160. Intersection of Two Linked Lists <0160-intersection-of-two-linked-lists.rst>`_
#. `0162. Find Peak Element <0162-find-peak-element.rst>`_
#. `0164. Maximum Gap <0164-maximum-gap.rst>`_
#. `0165. Compare Version Numbers <0165-compare-version-numbers.rst>`_
#. `0166. Fraction to Recurring Decimal <0166-fraction-to-recurring-decimal.rst>`_
#. `0167. Two Sum II - Input Array Is Sorted
   <0167-two-sum-ii-input-array-is-sorted.rst>`_
#. `0168. Excel Sheet Column Title <0168-excel-sheet-column-title.rst>`_
#. `0169. Majority Element <0169-majority-element.rst>`_
#. `0171. Excel Sheet Column Number <0171-excel-sheet-column-number.rst>`_
#. `0172. Factorial Trailing Zeroes <0172-factorial-trailing-zeroes.rst>`_
#. `0173. Binary Search Tree Iterator <0173-binary-search-tree-iterator.rst>`_
#. `0174. Dungeon Game <0174-dungeon-game.rst>`_
#. `0179. Largest Number <0179-largest-number.rst>`_
#. `0187. Repeated DNA Sequences <0187-repeated-dna-sequences.rst>`_
#. `0188. Best Time to Buy and Sell Stock IV
   <0188-best-time-to-buy-and-sell-stock-iv.rst>`_
#. `0189. Rotate Array <0189-rotate-array.rst>`_
#. `0190. Reverse Bits <0190-reverse-bits.rst>`_
#. `0191. Number of 1 Bits <0191-number-of-1-bits.rst>`_
#. `0198. House Robber <0198-house-robber.rst>`_

Premium 跳过
------------

* ``0156`` Binary Tree Upside Down；
* ``0157`` Read N Characters Given Read4；
* ``0158`` Read N Characters Given Read4 II - Call Multiple Times；
* ``0159`` Longest Substring with At Most Two Distinct Characters；
* ``0161`` One Edit Distance；
* ``0163`` Missing Ranges；
* ``0170`` Two Sum III - Data structure design；
* ``0186`` Reverse Words in a String II。

Database 跳过
-------------

* ``0175`` Combine Two Tables；
* ``0176`` Second Highest Salary；
* ``0177`` Nth Highest Salary；
* ``0178`` Rank Scores；
* ``0180`` Consecutive Numbers；
* ``0181`` Employees Earning More Than Their Managers；
* ``0182`` Duplicate Emails；
* ``0183`` Customers Who Never Order；
* ``0184`` Department Highest Salary；
* ``0185`` Department Top Three Salaries；
* ``0196`` Delete Duplicate Emails；
* ``0197`` Rising Temperature。

Shell 跳过
----------

* ``0192`` Word Frequency；
* ``0193`` Valid Phone Numbers；
* ``0194`` Transpose File；
* ``0195`` Tenth Line。

返工验收标准
------------

返工不是补齐章节标题，而是逐题恢复以下真实内容：

* 精确契约、自建示例、问题抽象和解法选择；
* 对应代码状态的核心不变量和完整正确性证明；
* 核心工作空间、递归栈、输入物化、输出载荷和语言适配成本；
* 十语言接口、平台类型、标准库版本和语言特化算法复核；
* 人工示例推演、逐语言静态语义审查、未执行范围和剩余风险准确记录；
* 易错点、知识更新、关联题目、自检和答案要点。

单文件结构通过但内容低于上述基线时，题号继续保留在 ``needs_revision`` 中。

执行规则
--------

返工 ``0150`` 及以前题目执行 ``../../docs/FORWARD_RULES_0101_0150.rst``；
``0151`` 起执行 ``../../docs/FORWARD_RULES_0151_ONWARD.rst``。两段范围都同时执行
``../../docs/AUTOMATION_QUALITY_GATE.rst``：

* 每道公开算法题只创建一个 ``<题号>-<slug>.rst``；
* 原创重述、算法、证明、复杂度、静态审查证据和十语言代码全部直接内联；
* 禁止题目 ``.inc``、代码分片和 ``.. include::``；
* Premium、Database、Shell 或题面不可可靠确认的题目只登记对应状态；
* 所有生成、返工、抽查和规则维护只允许直接在 ``main`` 形成一个原子提交。

下一动作
--------

下一批生成 ``0199`` Binary Tree Right Side View 与 ``0200`` Number of Islands。
批次风险和黄金样本由 ``../../state/BATCH_CONTRACT.toml`` 指定。
