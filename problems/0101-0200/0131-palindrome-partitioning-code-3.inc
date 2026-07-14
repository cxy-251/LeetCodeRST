Python
~~~~~~

.. code-block:: python

   class Solution:
       def partition(self, s: str) -> list[list[str]]:
           n = len(s)
           palindrome = [[False] * n for _ in range(n)]
           for start in range(n - 1, -1, -1):
               for end in range(start, n):
                   palindrome[start][end] = (
                       s[start] == s[end]
                       and (
                           end - start < 2
                           or palindrome[start + 1][end - 1]
                       )
                   )

           answers: list[list[str]] = []
           path: list[str] = []

           def dfs(start: int) -> None:
               if start == n:
                   answers.append(path.copy())
                   return
               for end in range(start, n):
                   if not palindrome[start][end]:
                       continue
                   path.append(s[start : end + 1])
                   dfs(end + 1)
                   path.pop()

           dfs(0)
           return answers
