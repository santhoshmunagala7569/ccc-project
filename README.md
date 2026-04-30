# Greedy Cargo Optimiser

This project is a web application that implements the **Fractional Knapsack problem** to optimise cargo loading using a **Greedy Algorithm**. It provides a clear, interactive visual demonstration of how a greedy approach can be used to maximize the value of items placed into a container of limited capacity.

## The Algorithm: Fractional Knapsack (Greedy Approach)

The core logic of this application is driven by the Fractional Knapsack algorithm. Unlike the 0/1 Knapsack problem where you must either take an entire item or leave it, the fractional version allows you to take a *fraction* of an item. This characteristic makes the problem perfectly solvable with a greedy strategy.

### How the Greedy Algorithm Works

The algorithm follows a straightforward "greedy choice property" — it always makes the locally optimal choice in the hope that these local choices will lead to a globally optimal solution. Here, the locally optimal choice is always picking the item that offers the most "bang for your buck" (highest value per unit of weight).

Here is the step-by-step breakdown:

1. **Calculate Value-to-Weight Ratio:**
   For every available cargo item, the algorithm calculates its value density:
   `Ratio = Value / Weight`

2. **Sort Items (The Greedy Step):**
   The items are then sorted in **descending order** based on their calculated ratio. The item with the highest value-to-weight ratio comes first, ensuring that the most valuable materials (relative to their weight) are prioritized.

3. **Fill the Knapsack (Cargo):**
   The algorithm iterates through the sorted list of items and attempts to add them to the cargo hold (the "knapsack"):
   * **If the knapsack has enough remaining capacity** to hold the entire item, the whole item is added. The capacity is reduced by the item's weight, and the total value increases by the item's value.
   * **If the knapsack does NOT have enough capacity** to hold the entire item, the algorithm takes a *fraction* of the item exactly equal to the remaining capacity. The knapsack is now completely full, and the total value increases proportionally.
   * **If the knapsack is full** (capacity = 0), the loop terminates early.

### Why is this approach optimal?

In the context of the *fractional* knapsack problem, this greedy strategy is mathematically proven to always yield the maximum possible total value. Because we are allowed to take fractions of items, there is never a situation where taking a lower-ratio item would be more beneficial than taking a higher-ratio item. We simply fill up on the most valuable stuff first, and if we run out of room, we take as much as we can of the next best thing.

### Algorithm Complexity
* **Time Complexity:** $O(N \log N)$ where $N$ is the number of items. This is dominated by the sorting step. The subsequent iteration to fill the knapsack takes $O(N)$ time.
* **Space Complexity:** $O(N)$ or $O(1)$ depending on the sorting algorithm implementation and whether a new list is created for the selected items (in our case, we create a `selected_items` list, resulting in $O(N)$ space).

## Technologies Used
* **Backend:** Python with Flask framework
* **Frontend:** HTML/CSS/JavaScript (served via Flask `render_template`)

## How to Run

1. Ensure you have Python installed.
2. Install Flask if you haven't already:
   ```bash
   pip install flask
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your web browser and navigate to `http://localhost:5000` (or `http://127.0.0.1:5000`).
