TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class MinStack {
       private readonly entries: Array<[number, number]> = [];

       push(value: number): void {
           const previous = this.entries.length === 0
               ? value
               : this.entries[this.entries.length - 1][1];
           this.entries.push([value, Math.min(value, previous)]);
       }

       pop(): void {
           this.entries.pop();
       }

       top(): number {
           return this.entries[this.entries.length - 1][0];
       }

       getMin(): number {
           return this.entries[this.entries.length - 1][1];
       }
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class MinStack {
       private readonly List<(int Value, int Minimum)> entries = new();

       public void Push(int value) {
           int minimum = entries.Count == 0
               ? value
               : Math.Min(value, entries[^1].Minimum);
           entries.Add((value, minimum));
       }

       public void Pop() {
           entries.RemoveAt(entries.Count - 1);
       }

       public int Top() {
           return entries[^1].Value;
       }

       public int GetMin() {
           return entries[^1].Minimum;
       }
   }
