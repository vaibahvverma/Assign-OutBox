# MCQ Answers

## Question 25
**Q:** In Java, which of the following is inherited by a subinterface from its superinterface?
1. Abstract methods
2. Default methods
3. Constant fields
4. Static methods

**Answer:** 1, 2, and 3

**Explanation:** In Java, subinterfaces inherit abstract methods, default methods, and constant fields from their superinterface. Static methods are NOT inherited - they belong to the interface in which they are defined.

---

## Question 26
**Q:** Which of these OOP concepts is depicted in the following statements:
- `int max1 = MathUtil.max(10, 23);`
- `double max2 = MathUtil.max(10.34, 2.89);`

**Answer:** Method Overloading

**Explanation:** The same method name `max` is being called with different parameter types (int vs double). This is method overloading - having multiple methods with the same name but different parameter lists.

---

## Question 27
**Q:** Which of the following scheduling algorithm has the highest CPU overhead?

**Answer:** Round-robin

**Explanation:** Round-robin has the highest CPU overhead because it requires frequent context switching as the CPU cycles through processes at regular time intervals (time quantum).

---

## Question 28
**Q:** Using the preemptive Shortest Job First (SJF) algorithm, calculate the average waiting time.

| Process | Service time | Arrival time |
|---------|-------------|--------------|
| P1      | 8           | 0            |
| P2      | 4           | 1            |
| P3      | 9           | 2            |
| P4      | 5           | 3            |

**Answer:** 6.5

**Explanation:**
- t=0-1: P1 runs (remaining: 7)
- t=1-5: P2 preempts and runs to completion
- t=5-10: P4 runs to completion
- t=10-17: P1 runs to completion
- t=17-26: P3 runs to completion

Waiting times: P1=9, P2=0, P3=15, P4=2
Average = (9+0+15+2)/4 = 26/4 = 6.5

---

## Question 29
**Q:** What is the output of the following C++ code:
```cpp
#include <iostream>
using namespace std;

int main()
{
    int i = 16;
    for (; i; i >>= 1) {
        if (i = 5) {
            cout << "world ";
            break;
        }
        cout << i << " ";
    }
}
```

**Answer:** world

**Explanation:** The condition `if (i = 5)` is an assignment, not a comparison. It assigns 5 to i and evaluates to 5 (truthy). So on the first iteration, it immediately enters the if block, prints "world ", and breaks.

---

## Question 30
**Q:** In Networking, which of the following is used to translate the Internet domain names and the hostnames to an IP address?

**Answer:** Domain name server

**Explanation:** DNS (Domain Name Server/System) is responsible for translating human-readable domain names (like www.example.com) into IP addresses.

---

## Question 31
**Q:** In Data structures, what is the average case complexity analysis for the following code (bubble sort)?

**Answer:** O(N^2)

**Explanation:** Bubble sort has:
- Best case: O(n) with the optimization shown
- Average case: O(n²)
- Worst case: O(n²)

The nested loops result in quadratic time complexity for average and worst cases.

---

## Question 32
**Q:** In C or C++, which of the following operations is not supported by pointers?

**Answer:** Addition of two pointer variables

**Explanation:** Pointers support:
- Increment (ptr++)
- Decrement (ptr--)
- Subtraction of two pointers (gives number of elements between them)
- Addition of integer to pointer

However, adding two pointers together is NOT a valid operation and makes no logical sense.

---

## Question 33
**Q:** Based on the following tables, what is the output of these SQL queries?

**Answer:** 50 50 50 50 75 10

**Explanation:** The UPDATE sets CURRENT to CATEGORY from PRODUCT where PIDs match (and a match exists):
- PIDs 1-4: Match with CATEGORY 50
- PID 5: Matches with CATEGORY 75
- PID 8: No match in PRODUCT, WHERE EXISTS fails, stays 10

---

## Question 34
**Q:** In SQL, which of these allows null values?

**Answer:** Foreign key

**Explanation:** 
- Primary key: Cannot contain NULL (NOT NULL + UNIQUE constraint)
- Foreign key: CAN contain NULL (indicates no reference)
- Unique key: Typically allows NULL values

---

## Question 35
**Q:** In SQL, which of the following is used to delete both the table data and structure?

**Answer:** DROP

**Explanation:**
- DELETE: Removes rows of data, keeps table structure
- TRUNCATE: Removes all data quickly, keeps table structure
- DROP: Removes both the data AND the table structure entirely

---

## Question 36
**Q:** Which of the following SQL operators is used to test whether the value of a column is null or not?

**Answer:** IS NULL

**Explanation:** In SQL, you use `IS NULL` or `IS NOT NULL` to check for null values. You cannot use `= NULL` because NULL represents an unknown value and cannot be compared using equality operators.

---

## Question 37
**Q:** Which of the following SQL queries is used to find all the cities with weather conditions whose humidity is in the range of 60 to 100?

**Answer:** SELECT * FROM weather WHERE humidity BETWEEN 60 AND 100

**Explanation:** The BETWEEN operator is used to select values within a given range (inclusive). The syntax is `column BETWEEN low AND high`.
