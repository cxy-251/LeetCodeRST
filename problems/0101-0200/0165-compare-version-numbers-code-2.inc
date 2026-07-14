Python
~~~~~~

.. code-block:: python

   class Solution:
       def compareVersion(self, version1: str, version2: str) -> int:
           position1 = 0
           position2 = 0

           while position1 < len(version1) or position2 < len(version2):
               start1, digits1, position1 = self._read_segment(
                   version1,
                   position1,
               )
               start2, digits2, position2 = self._read_segment(
                   version2,
                   position2,
               )

               if digits1 != digits2:
                   return -1 if digits1 < digits2 else 1

               for offset in range(digits1):
                   first = version1[start1 + offset]
                   second = version2[start2 + offset]
                   if first != second:
                       return -1 if first < second else 1

           return 0

       @staticmethod
       def _read_segment(
           version: str,
           position: int,
       ) -> tuple[int, int, int]:
           end = position
           while end < len(version) and version[end] != ".":
               end += 1

           significant = position
           while significant < end and version[significant] == "0":
               significant += 1

           next_position = end + 1 if end < len(version) else len(version)
           return significant, end - significant, next_position

Java
~~~~

.. code-block:: java

   class Solution {
       public int compareVersion(String version1, String version2) {
           int position1 = 0;
           int position2 = 0;

           while (
               position1 < version1.length() ||
               position2 < version2.length()
           ) {
               Segment left = readSegment(version1, position1);
               Segment right = readSegment(version2, position2);

               if (left.length != right.length) {
                   return left.length < right.length ? -1 : 1;
               }
               for (int offset = 0; offset < left.length; offset++) {
                   char first = version1.charAt(left.start + offset);
                   char second = version2.charAt(right.start + offset);
                   if (first != second) {
                       return first < second ? -1 : 1;
                   }
               }

               position1 = left.next;
               position2 = right.next;
           }

           return 0;
       }

       private Segment readSegment(String version, int position) {
           int end = position;
           while (
               end < version.length() &&
               version.charAt(end) != '.'
           ) {
               end++;
           }

           int significant = position;
           while (
               significant < end &&
               version.charAt(significant) == '0'
           ) {
               significant++;
           }

           int next = end < version.length()
               ? end + 1
               : version.length();
           return new Segment(significant, end - significant, next);
       }

       private static final class Segment {
           private final int start;
           private final int length;
           private final int next;

           private Segment(int start, int length, int next) {
               this.start = start;
               this.length = length;
               this.next = next;
           }
       }
   }
