TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function compareVersion(
       version1: string,
       version2: string,
   ): number {
       let position1 = 0;
       let position2 = 0;

       while (
           position1 < version1.length ||
           position2 < version2.length
       ) {
           const left = readVersionSegment(version1, position1);
           const right = readVersionSegment(version2, position2);

           if (left.length !== right.length) {
               return left.length < right.length ? -1 : 1;
           }
           for (let offset = 0; offset < left.length; offset++) {
               const first = version1[left.start + offset];
               const second = version2[right.start + offset];
               if (first !== second) {
                   return first < second ? -1 : 1;
               }
           }

           position1 = left.next;
           position2 = right.next;
       }

       return 0;
   }

   function readVersionSegment(
       version: string,
       position: number,
   ): { start: number; length: number; next: number } {
       let end = position;
       while (end < version.length && version[end] !== ".") {
           end++;
       }

       let significant = position;
       while (
           significant < end &&
           version[significant] === "0"
       ) {
           significant++;
       }

       return {
           start: significant,
           length: end - significant,
           next: end < version.length ? end + 1 : version.length,
       };
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int CompareVersion(string version1, string version2) {
           int position1 = 0;
           int position2 = 0;

           while (
               position1 < version1.Length ||
               position2 < version2.Length
           ) {
               Segment left = ReadSegment(version1, position1);
               Segment right = ReadSegment(version2, position2);

               if (left.Length != right.Length) {
                   return left.Length < right.Length ? -1 : 1;
               }
               for (int offset = 0; offset < left.Length; offset++) {
                   char first = version1[left.Start + offset];
                   char second = version2[right.Start + offset];
                   if (first != second) {
                       return first < second ? -1 : 1;
                   }
               }

               position1 = left.Next;
               position2 = right.Next;
           }

           return 0;
       }

       private static Segment ReadSegment(
           string version,
           int position
       ) {
           int end = position;
           while (end < version.Length && version[end] != '.') {
               end++;
           }

           int significant = position;
           while (
               significant < end &&
               version[significant] == '0'
           ) {
               significant++;
           }

           int next = end < version.Length
               ? end + 1
               : version.Length;
           return new Segment(significant, end - significant, next);
       }

       private readonly struct Segment {
           public int Start { get; }
           public int Length { get; }
           public int Next { get; }

           public Segment(int start, int length, int next) {
               Start = start;
               Length = length;
               Next = next;
           }
       }
   }
