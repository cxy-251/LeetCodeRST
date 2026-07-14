TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sumNumbers(root: TreeNode | null): number {
       const dfs = (
           node: TreeNode | null,
           prefix: number,
       ): number => {
           if (node === null) return 0;
           const current = prefix * 10 + node.val;
           if (node.left === null && node.right === null) {
               return current;
           }
           return dfs(node.left, current) +
               dfs(node.right, current);
       };
       return dfs(root, 0);
   }

