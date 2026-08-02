0129. Sum Root to Leaf Numbers
==============================

题目信息
--------

:题号: 0129
:难度: Medium
:主题: 二叉树、深度优先搜索、路径状态、十进制前缀
:原题: `LeetCode 0129 <https://leetcode.com/problems/sum-root-to-leaf-numbers/>`_
:重点: 根到叶数字、前缀乘十加位、前导零、叶节点结算

题目重述
--------

给定一棵非空二叉树，每个节点保存一个 ``0..9`` 的十进制数字。每条从根节点到叶节点的路径按经过顺序组成一个整数，返回所有这些整数的总和。叶节点必须同时没有左孩子和右孩子；路径开头出现 ``0`` 时按普通整数处理，前导零不改变数值。

树中节点数在 ``1..1000`` 范围内，节点值在 ``0..9`` 范围内，树的深度不超过 ``10``，答案保证能够存入 32 位有符号整数。

自建示例
--------

.. code-block:: text

   输入：root = [3,1,7,0,4]
   输出：661
   解释：三条根到叶路径分别表示 310、314 和 37，总和为 310 + 314 + 37 = 661。

.. code-block:: text

   输入：root = [0,null,6,null,2]
   输出：62
   解释：唯一路径 0 -> 6 -> 2 表示整数 62，开头的 0 不增加位值。

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void collectDigits(TreeNode* node, std::vector<int>& path,
                          long long& total) {
           if (!node) return;
           path.push_back(node->val);
           if (!node->left && !node->right) {
               long long value = 0;
               for (int digit : path) value = value * 10 + digit;
               total += value;
           } else {
               collectDigits(node->left, path, total);
               collectDigits(node->right, path, total);
           }
           path.pop_back();
       }

       long long recursivePrefix(TreeNode* node, long long prefix) {
           if (!node) return 0;
           long long current = prefix * 10 + node->val;
           if (!node->left && !node->right) return current;
           return recursivePrefix(node->left, current) +
                  recursivePrefix(node->right, current);
       }

       long long iterativePrefix(TreeNode* root) {
           if (!root) return 0;
           std::stack<std::pair<TreeNode*, long long>> stack;
           stack.push({root, 0});
           long long total = 0;
           while (!stack.empty()) {
               auto [node, prefix] = stack.top(); stack.pop();
               long long current = prefix * 10 + node->val;
               if (!node->left && !node->right) total += current;
               else {
                   if (node->right) stack.push({node->right, current});
                   if (node->left) stack.push({node->left, current});
               }
           }
           return total;
       }

   public:
       int sumNumbers(TreeNode* root) {
           return static_cast<int>(recursivePrefix(root, 0));
       }
   };

题解
----

为什么不需要保存完整路径
~~~~~~~~~~~~~~~~~~~~~~~~

若父路径已经形成数字 ``prefix``，追加当前数字 ``digit`` 等价于十进制左移一位再加当前位：

.. code-block:: text

   current = prefix * 10 + digit

后续计算只依赖这个数值，不需要知道每个历史数字分别是什么。

叶节点为何是唯一结算位置
~~~~~~~~~~~~~~~~~~~~~~~~

内部节点的前缀还不是完整根到叶数字，即使当前数值已经形成，也必须继续沿孩子追加。只有左右孩子都为空时，``current`` 才对应一条完整路径并加入总和。

.. list-table::
   :header-rows: 1

   * - 节点
     - 进入前前缀
     - 当前数值
     - 动作
   * - 4
     - 0
     - 4
     - 传给孩子
   * - 9
     - 4
     - 49
     - 传给孩子
   * - 5
     - 49
     - 495
     - 叶节点，结算
   * - 1
     - 49
     - 491
     - 叶节点，结算
   * - 0
     - 4
     - 40
     - 叶节点，结算

前导零为什么自然处理
~~~~~~~~~~~~~~~~~~~~

``0 * 10 + 1 = 1``，再追加 2 得到 12。整数前缀运算自动忽略十进制表示中的前导零，无需字符串特判。

左右子树结果为何可以相加
~~~~~~~~~~~~~~~~~~~~~~~~

根到叶路径在当前节点之后要么进入左子树，要么进入右子树，两组叶节点互不重叠。递归分别返回两侧全部完整路径数值之和，直接相加即可。

显式栈保存什么
~~~~~~~~~~~~~~

栈元素是 ``(node, prefix_before_node)``。每条待处理分支携带独立前缀，树没有回边，不需要访问集合。先压右再压左只影响访问顺序，不影响总和。

为什么不重不漏
~~~~~~~~~~~~~~

每个叶节点在树中有唯一根路径，DFS 恰好访问它一次；到达时通过同一递推恢复该路径的十进制值。因此每条合法数字加入一次，非叶前缀不会被加入。

复杂度来源
~~~~~~~~~~

每个节点访问一次，时间 ``O(n)``。递归栈 ``O(h)``；显式栈最坏 ``O(n)``。路径数组基准还需 ``O(h)`` 缓冲，并在每个叶节点重新遍历路径。
C++ 主实现使用 64 位中间状态。

九语言实现
----------

C
~

.. code-block:: c

   static long long dfs(struct TreeNode*x,long long prefix){if(!x)return 0;long long cur=prefix*10+x->val;if(!x->left&&!x->right)return cur;return dfs(x->left,cur)+dfs(x->right,cur);}int sumNumbers(struct TreeNode*root){return(int)dfs(root,0);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sumNumbers(self, root) -> int:
           def dfs(node, prefix):
               if node is None: return 0
               current = prefix * 10 + node.val
               if node.left is None and node.right is None: return current
               return dfs(node.left, current) + dfs(node.right, current)
           return dfs(root, 0)

Java
~~~~

.. code-block:: java

   class Solution {long dfs(TreeNode x,long prefix){if(x==null)return 0;long cur=prefix*10+x.val;if(x.left==null&&x.right==null)return cur;return dfs(x.left,cur)+dfs(x.right,cur);}public int sumNumbers(TreeNode root){return(int)dfs(root,0);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn sum_numbers(root:Option<Rc<RefCell<TreeNode>>>)->i32{fn dfs(x:Option<Rc<RefCell<TreeNode>>>,prefix:i64)->i64{match x{None=>0,Some(n)=>{let b=n.borrow();let cur=prefix*10+b.val as i64;if b.left.is_none()&&b.right.is_none(){cur}else{dfs(b.left.clone(),cur)+dfs(b.right.clone(),cur)}}}}dfs(root,0)as i32}}

Go
~~

.. code-block:: go

   func sumNumbers(root *TreeNode)int{var dfs func(*TreeNode,int64)int64;dfs=func(x *TreeNode,p int64)int64{if x==nil{return 0};cur:=p*10+int64(x.Val);if x.Left==nil&&x.Right==nil{return cur};return dfs(x.Left,cur)+dfs(x.Right,cur)};return int(dfs(root,0))}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sumNumbers(root:TreeNode|null):number{const dfs=(x:TreeNode|null,p:number):number=>{if(!x)return 0;const cur=p*10+x.val;if(!x.left&&!x.right)return cur;return dfs(x.left,cur)+dfs(x.right,cur);};return dfs(root,0);}

C#
~~

.. code-block:: csharp

   public class Solution {long Dfs(TreeNode x,long p){if(x==null)return 0;long cur=p*10+x.val;if(x.left==null&&x.right==null)return cur;return Dfs(x.left,cur)+Dfs(x.right,cur);}public int SumNumbers(TreeNode root)=>(int)Dfs(root,0);}

Julia
~~~~~

.. code-block:: julia

   function sum_numbers(root)
       function dfs(x,p);x===nothing&&return 0;cur=p*10+x.val;x.left===nothing&&x.right===nothing&&return cur;dfs(x.left,cur)+dfs(x.right,cur);end
       dfs(root,0)
   end

R
~

.. code-block:: r

   sum_numbers <- function(root){dfs<-function(x,prefix){if(is.null(x))return(0);current<-prefix*10+x$val;if(is.null(x$left)&&is.null(x$right))return(current);dfs(x$left,current)+dfs(x$right,current)};dfs(root,0)}
