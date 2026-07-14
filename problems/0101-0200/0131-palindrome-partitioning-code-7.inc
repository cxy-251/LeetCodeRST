TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function partition(s: string): string[][] {
       const n = s.length;
       const palindrome = Array.from(
           {length: n},
           () => Array<boolean>(n).fill(false),
       );
       for (let start = n - 1; start >= 0; start--) {
           for (let end = start; end < n; end++) {
               palindrome[start][end] =
                   s[start] === s[end] &&
                   (
                       end - start < 2 ||
                       palindrome[start + 1][end - 1]
                   );
           }
       }

       const answers: string[][] = [];
       const path: string[] = [];
       const dfs = (start: number): void => {
           if (start === n) {
               answers.push([...path]);
               return;
           }
           for (let end = start; end < n; end++) {
               if (!palindrome[start][end]) continue;
               path.push(s.slice(start, end + 1));
               dfs(end + 1);
               path.pop();
           }
       };
       dfs(0);
       return answers;
   }
