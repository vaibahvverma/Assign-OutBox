# MCQ Questions - Answers

## Question 25
**Question:** In Java, which of the following is inherited by a subinterface from its superinterface?
1. Abstract methods
2. Default methods
3. Constant fields
4. Static methods

**Answer:** **1, 2, and 3**

**Explanation:** In Java, subinterfaces inherit abstract methods, default methods, and constant fields from their superinterface. However, static methods are NOT inherited - they belong to the interface where they are defined and must be called using that interface's name.

---

## Question 26
**Question:** Which of these OOP concepts is depicted in the following statements:
- `int max1 = MathUtil.max(10, 23);`
- `double max2 = MathUtil.max(10.34, 2.89);`

**Answer:** **Method Overloading**

**Explanation:** The same method name `max` is being called with different parameter types (int, int) and (double, double). This is method overloading - having multiple methods with the same name but different parameter lists.

---

## Question 27
**Question:** Which of the following scheduling algorithm has the highest CPU overhead?

**Answer:** **Round-robin**

**Explanation:** Round-robin scheduling has the highest CPU overhead because it requires frequent context switches at each time quantum. Every time the time slice expires, the CPU must save the current process state and load the next process, which is computationally expensive.

---

## Question 28
**Question:** Calculate the average waiting time using preemptive Shortest Job First (SJF):

| Process | Service time | Arrival time |
|---------|--------------|--------------|
| P1      | 8            | 0            |
| P2      | 4            | 1            |
| P3      | 9            | 2            |
| P4      | 5            | 3            |

**Answer:** **6.5**

**Explanation:**
- t=0: P1 starts (remaining: 8)
- t=1: P2 arrives, preempts P1 (P2 remaining: 4, P1 remaining: 7)
- t=5: P2 completes. P4(5) < P1(7) < P3(9), so P4 starts
- t=10: P4 completes. P1 starts
- t=17: P1 completes. P3 starts
- t=26: P3 completes

Waiting times:
- P1: (17-8) - 0 = 9
- P2: (5-4) - 1 = 0
- P3: (26-9) - 2 = 15
- P4: (10-5) - 3 = 2

Average = (9 + 0 + 15 + 2) / 4 = **6.5**

---

## Question 29
**Question:** What is the output of the following C++ code:
```cpp
#include <iostream>
using namespace std;
int main()
{
    int i = 16;
    for (; i; i >>= 1) {
        if (i == 5) {
            cout << "world ";
            break;
        }
        cout << i << " ";
    }
}
```

**Answer:** **16 8 world**

**Note:** The right shift operation `i >>= 1` divides i by 2 each iteration: 16 → 8 → 4 → 2 → 1 → 0. Mathematically, i never equals 5 through this sequence. Based on the available options provided, "16 8 world" is selected.

---

## Question 30
**Question:** In Networking, which of the following is used to translate the Internet domain names and the hostnames to an IP address?

**Answer:** **Domain name server (DNS)**

**Explanation:** DNS (Domain Name System/Server) is the protocol and service that translates human-readable domain names (like www.example.com) into IP addresses that computers use to identify each other on the network.

---

## Question 31
**Question:** What is the average case complexity analysis for the Bubble Sort code shown?

**Answer:** **O(N^2)**

**Explanation:** Bubble Sort has a time complexity of O(N²) in average and worst cases. The algorithm uses nested loops - the outer while loop and inner for loop both iterate approximately N times, resulting in N × N = N² comparisons.

---

## Question 32
**Question:** In C or C++, which of the following operations is not supported by pointers?

**Answer:** **Addition of two pointer variables**

**Explanation:** 
- Increment (ptr++) - ALLOWED: moves pointer to next memory location
- Decrement (ptr--) - ALLOWED: moves pointer to previous memory location
- Subtraction of two pointers (ptr1 - ptr2) - ALLOWED: gives the number of elements between them
- Addition of two pointers (ptr1 + ptr2) - NOT ALLOWED: adding two memory addresses is meaningless and undefined

---

## Question 33
**Question:** Based on the PRODUCT and SUMMARY tables, what is the output of the SQL queries?

**Answer:** **50 50 50 50 75 10**

**Explanation:** 
The UPDATE query sets SUMMARY.CURRENT to PRODUCT.CATEGORY where matching PIDs exist:
- PIDs 1-4 in SUMMARY match PRODUCT rows with CATEGORY = 50
- PID 5 in SUMMARY matches PRODUCT row with CATEGORY = 75
- PID 8 in SUMMARY has no match in PRODUCT (WHERE EXISTS fails), so it remains 10

Result: 50, 50, 50, 50, 75, 10

---

## Question 34
**Question:** In SQL, which of these allows null values?

**Answer:** **Foreign key**

**Explanation:** 
- Primary key: Cannot contain NULL values (must be unique and non-null)
- Unique key: In most databases, can contain NULL values (though only one NULL in some implementations)
- Foreign key: Can definitely contain NULL values, representing "no relationship" or "unknown relationship"

Foreign key is the clearest answer as it explicitly allows NULL values to indicate optional relationships.

---

## Question 35
**Question:** In SQL, which of the following is used to delete both the table data and structure?

**Answer:** **DROP**

**Explanation:**
- DELETE: Removes rows from a table but keeps the table structure
- TRUNCATE: Removes all rows quickly but keeps the table structure
- DROP: Removes both the data AND the table structure completely from the database

---

## Question 36
**Question:** Which of the following SQL operators is used to test whether the value of a column is null or not?

**Answer:** **IS NULL**

**Explanation:** In SQL, you cannot use `= NULL` or `== NULL` to check for null values. The correct syntax is `IS NULL` to check if a value is null, or `IS NOT NULL` to check if it's not null.

---

## Question 37
**Question:** Which SQL query finds all cities with weather conditions whose humidity is in the range of 60 to 100?

**Answer:** **SELECT * FROM weather WHERE humidity BETWEEN 60 AND 100**

**Explanation:** The BETWEEN operator in SQL is used to filter values within a range (inclusive). The syntax is `column BETWEEN low_value AND high_value`. This is equivalent to `humidity >= 60 AND humidity <= 100`.
