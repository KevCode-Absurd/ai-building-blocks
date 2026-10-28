---
name: assembly-line-balancing
description: When the user wants to balance assembly lines, assign tasks to workstations, calculate takt time, or optimize line efficiency. Also use when the user mentions "line balancing," "workstation assignment," "takt time," "cycle time balancing," "precedence constraints," "task allocation," "assembly line optimization," "mixed-model balancing," or "U-shaped line." For process optimization, see process-optimization. For production scheduling, see production-scheduling.
---

# Assembly Line Balancing

You are an expert in assembly line balancing and production line design. Your goal is to help organizations optimize assembly line configurations, balance workloads across stations, minimize idle time, and maximize line efficiency while meeting production targets.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

Before balancing assembly lines, understand:

1. **Line Configuration**
   - Type of line? (single-model, mixed-model, multi-model)
   - Current line layout? (straight, U-shaped, two-sided)
   - Number of workstations?
   - Current cycle times and bottlenecks?

2. **Product & Tasks**
   - Task list with processing times?
   - Precedence relationships between tasks?
   - Task zoning constraints? (must be together/separate)
   - Equipment or skill requirements?

3. **Production Requirements**
   - Target production volume (units/day)?
   - Available working time per shift?
   - Takt time requirements?
   - Quality requirements?

4. **Constraints**
   - Fixed workstation count or flexible?
   - Space constraints?
   - Ergonomic considerations?
   - Budget for changes?

---

## Assembly Line Balancing Framework

### Problem Formulation

**Assembly Line Balancing Problem (ALBP):**

**Given:**
- Set of tasks T = {t₁, t₂, ..., tₙ}
- Task processing times: p(t)
- Precedence constraints: task i must precede task j
- Cycle time C (takt time)
- Number of workstations m

**Objectives:**
- **Type-1 (ALBP-1)**: Minimize number of workstations for given cycle time
- **Type-2 (ALBP-2)**: Minimize cycle time for given number of workstations
- **Type-E**: Maximize line efficiency

**Constraints:**
- Precedence constraints must be satisfied
- Workstation load ≤ cycle time
- Each task assigned to exactly one workstation

### Line Balancing Metrics

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from collections import defaultdict

class LineBalancingMetrics:
    """
    Calculate assembly line balancing metrics
    """

    def __init__(self, workstation_times, cycle_time):
        """
        Parameters:
        - workstation_times: list of total times at each workstation
        - cycle_time: target cycle time (takt time)
        """
        self.workstation_times = np.array(workstation_times)
        self.cycle_time = cycle_time
        self.num_workstations = len(workstation_times)

    def calculate_metrics(self):
        """
        Calculate comprehensive line balancing metrics
        """

        # Total task time
        total_time = self.workstation_times.sum()

        # Theoretical minimum workstations
        min_workstations = np.ceil(total_time / self.cycle_time)

        # Line efficiency (balance efficiency)
        line_efficiency = (total_time / (self.num_workstations * self.cycle_time)) * 100

        # Balance delay (idle time %)
        balance_delay = 100 - line_efficiency

        # Smoothness index (variability in workstation times)
        # Lower is better
        max_time = self.workstation_times.max()
        smoothness_index = np.sqrt(
            np.sum((max_time - self.workstation_times) ** 2)
        )

        # Idle time at each workstation
        idle_times = self.cycle_time - self.workstation_times

        # Bottleneck identification
        bottleneck_station = np.argmax(self.workstation_times)
        bottleneck_time = self.workstation_times[bottleneck_station]

        return {
            'total_task_time': total_time,
            'cycle_time': self.cycle_time,
            'num_workstations': self.num_workstations,
            'min_workstations_theoretical': min_workstations,
            'line_efficiency_pct': line_efficiency,
            'balance_delay_pct': balance_delay,
            'smoothness_index': smoothness_index,
            'idle_times': idle_times,
            'total_idle_time': idle_times.sum(),
            'bottleneck_station': bottleneck_station,
            'bottleneck_time': bottleneck_time,
            'workstation_times': self.workstation_times
        }

    def calculate_takt_time(self, demand_per_day, available_time_minutes):
        """
        Calculate takt time = available time / customer demand

        Parameters:
        - demand_per_day: required production volume
        - available_time_minutes: working time available per day

        Returns takt time in minutes
        """

        takt_time = available_time_minutes / demand_per_day

        return {
            'demand_per_day': demand_per_day,
            'available_time_minutes': available_time_minutes,
            'takt_time_minutes': takt_time,
            'takt_time_seconds': takt_time * 60,
            'max_units_per_day': available_time_minutes / takt_time
        }

    def plot_balance_chart(self, metrics):
        """
        Visualize line balance with bar chart
        """

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

        # Workstation times vs cycle time
        stations = [f'WS{i+1}' for i in range(self.num_workstations)]
        colors = ['red' if i == metrics['bottleneck_station'] else 'skyblue'
                 for i in range(self.num_workstations)]

        bars = ax1.bar(stations, self.workstation_times, color=colors,
                      edgecolor='black', linewidth=1.5, alpha=0.7)

        # Cycle time line
        ax1.axhline(self.cycle_time, color='green', linestyle='--',
                   linewidth=2, label=f'Cycle Time ({self.cycle_time:.1f} min)')

        # Add value labels
        for i, (bar, time) in enumerate(zip(bars, self.workstation_times)):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height,
                    f'{time:.1f}', ha='center', va='bottom', fontweight='bold')

            # Add idle time annotation
            idle = self.cycle_time - time
            if idle > 0:
                ax1.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                        f'(idle: {idle:.1f})', ha='center', va='bottom',
                        fontsize=9, color='red')

        ax1.set_xlabel('Workstation', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Time (minutes)', fontsize=12, fontweight='bold')
        ax1.set_title(f'Line Balance Chart\nEfficiency: {metrics["line_efficiency_pct"]:.1f}% (Red = Bottleneck)',
                     fontsize=13, fontweight='bold')
        ax1.legend()
        ax1.grid(True, alpha=0.3, axis='y')

        # Idle time distribution
        idle_times = metrics['idle_times']
        ax2.bar(stations, idle_times, color='lightcoral', edgecolor='black',
               linewidth=1.5, alpha=0.7)

        ax2.set_xlabel('Workstation', fontsize=12, fontweight='bold')
        ax2.set_ylabel('Idle Time (minutes)', fontsize=12, fontweight='bold')
        ax2.set_title(f'Idle Time by Workstation\nTotal Idle: {metrics["total_idle_time"]:.1f} min',
                     fontsize=13, fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='y')

        plt.tight_layout()
        return fig

# Example usage
workstation_times = [5.2, 6.8, 5.5, 6.9, 5.1, 6.5]  # minutes
cycle_time = 7.0  # target cycle time

metrics_calc = LineBalancingMetrics(workstation_times, cycle_time)

# Calculate metrics
metrics = metrics_calc.calculate_metrics()

print("Line Balancing Metrics:")
print(f"  Number of Workstations: {metrics['num_workstations']}")
print(f"  Theoretical Minimum: {metrics['min_workstations_theoretical']:.0f}")
print(f"  Cycle Time: {metrics['cycle_time']:.1f} minutes")
print(f"  Total Task Time: {metrics['total_task_time']:.1f} minutes")
print(f"  Line Efficiency: {metrics['line_efficiency_pct']:.1f}%")
print(f"  Balance Delay: {metrics['balance_delay_pct']:.1f}%")
print(f"  Smoothness Index: {metrics['smoothness_index']:.2f}")
print(f"  Total Idle Time: {metrics['total_idle_time']:.1f} minutes")
print(f"  Bottleneck: Workstation {metrics['bottleneck_station'] + 1} ({metrics['bottleneck_time']:.1f} min)")

# Takt time calculation
takt = metrics_calc.calculate_takt_time(demand_per_day=400, available_time_minutes=480)
print(f"\nTakt Time Calculation:")
print(f"  Demand: {takt['demand_per_day']} units/day")
print(f"  Available Time: {takt['available_time_minutes']} minutes/day")
print(f"  Takt Time: {takt['takt_time_minutes']:.2f} minutes ({takt['takt_time_seconds']:.0f} seconds)")

# Plot
fig = metrics_calc.plot_balance_chart(metrics)
plt.show()
```

---

## Line Balancing Algorithms

### Ranked Positional Weight (RPW) Method

```python
class LineBalancer:
    """
    Assembly line balancing using heuristic algorithms
    """

    def __init__(self, tasks, precedence_graph, cycle_time):
        """
        Parameters:
        - tasks: dict {task_id: processing_time}
        - precedence_graph: dict {task_id: [list of immediate predecessors]}
        - cycle_time: target cycle time (takt time)

        Example:
        tasks = {'A': 3.0, 'B': 2.5, 'C': 4.0, ...}
        precedence_graph = {'A': [], 'B': ['A'], 'C': ['A'], ...}
        """
        self.tasks = tasks
        self.precedence = {t: list(precedence_graph.get(t, [])) for t in tasks}
        self.cycle_time = cycle_time
        self._validate()

    def _validate(self):
        """Stop early on inputs no station layout can satisfy."""
        too_long = {t: p for t, p in self.tasks.items() if p > self.cycle_time}
        if too_long:
            raise ValueError(
                f"Tasks longer than the cycle time {self.cycle_time}: {too_long}. "
                "Split the task, run it on parallel stations, or raise the cycle time."
            )
        for task, preds in self.precedence.items():
            unknown = [p for p in preds if p not in self.tasks]
            if unknown:
                raise ValueError(f"Task {task} lists unknown predecessors {unknown}")
        # Detect precedence loops (a task that must come before itself)
        state = {}
        def visit(t):
            if state.get(t) == 1:
                raise ValueError(f"Precedence loop through task {t}")
            if state.get(t) == 2:
                return
            state[t] = 1
            for p in self.precedence[t]:
                visit(p)
            state[t] = 2
        for t in self.tasks:
            visit(t)

    def _all_successors(self):
        """Every task that must come after each task, directly or indirectly (each counted once)."""
        direct = defaultdict(set)
        for task, predecessors in self.precedence.items():
            for pred in predecessors:
                direct[pred].add(task)

        closure = {}
        def collect(task):
            if task not in closure:
                found = set()
                for s in direct[task]:
                    found.add(s)
                    found |= collect(s)
                closure[task] = found
            return closure[task]

        for task in self.tasks:
            collect(task)
        return closure

    def calculate_positional_weights(self):
        """
        Positional weight = task time + sum of the times of every task that follows it.
        Each following task is counted once, even when it can be reached by two paths
        (for example A -> B -> D and A -> C -> D counts D once for A).
        """
        succ = self._all_successors()
        return {
            task: self.tasks[task] + sum(self.tasks[s] for s in succ[task])
            for task in self.tasks
        }

    def _fill_stations(self, priority):
        """
        Station-by-station assignment. Open a station, then keep adding the
        highest-priority task whose predecessors are all assigned and that fits in
        the time left. When nothing fits, close the station and open a new one.
        A task is only placed after all its predecessors, so precedence always holds,
        and no station ever goes over the cycle time.
        """
        workstations = []
        assigned = set()
        remaining = set(self.tasks)

        while remaining:
            station, station_time = [], 0.0
            while True:
                candidates = [
                    t for t in remaining
                    if all(p in assigned for p in self.precedence[t])
                    and station_time + self.tasks[t] <= self.cycle_time + 1e-9
                ]
                if not candidates:
                    break
                task = max(candidates, key=lambda t: (priority[t], self.tasks[t], str(t)))
                station.append(task)
                station_time += self.tasks[task]
                assigned.add(task)
                remaining.remove(task)
            if not station:
                # Cannot happen after _validate, but never loop forever
                raise RuntimeError(f"Could not place tasks {sorted(remaining)}")
            workstations.append({'tasks': station, 'time': station_time})

        return {
            'workstations': workstations,
            'num_workstations': len(workstations),
            'unassigned_tasks': []
        }

    def rpw_method(self):
        """
        Ranked Positional Weight method: priority = positional weight.
        Returns workstation assignments.
        """
        return self._fill_stations(self.calculate_positional_weights())

    def largest_candidate_rule(self):
        """
        Largest Candidate Rule (LCR): priority = task time.
        Assign the longest task that fits and has all predecessors assigned.
        """
        return self._fill_stations(dict(self.tasks))

    def compare_solutions(self, solution1, solution2):
        """Compare two line balancing solutions"""

        # Calculate metrics for both
        times1 = [ws['time'] for ws in solution1['workstations']]
        times2 = [ws['time'] for ws in solution2['workstations']]

        metrics1 = LineBalancingMetrics(times1, self.cycle_time).calculate_metrics()
        metrics2 = LineBalancingMetrics(times2, self.cycle_time).calculate_metrics()

        comparison = pd.DataFrame({
            'Metric': ['Workstations', 'Efficiency %', 'Balance Delay %', 'Smoothness Index'],
            'Solution 1': [
                metrics1['num_workstations'],
                f"{metrics1['line_efficiency_pct']:.1f}",
                f"{metrics1['balance_delay_pct']:.1f}",
                f"{metrics1['smoothness_index']:.2f}"
            ],
            'Solution 2': [
                metrics2['num_workstations'],
                f"{metrics2['line_efficiency_pct']:.1f}",
                f"{metrics2['balance_delay_pct']:.1f}",
                f"{metrics2['smoothness_index']:.2f}"
            ]
        })

        return comparison

# Example usage
tasks = {
    'A': 3.0,
    'B': 2.5,
    'C': 4.0,
    'D': 1.5,
    'E': 3.5,
    'F': 2.0,
    'G': 3.0,
    'H': 2.5,
    'I': 1.5,
    'J': 2.0
}

precedence = {
    'A': [],
    'B': ['A'],
    'C': ['A'],
    'D': ['B'],
    'E': ['B', 'C'],
    'F': ['D'],
    'G': ['E'],
    'H': ['F', 'G'],
    'I': ['H'],
    'J': ['I']
}

cycle_time = 8.0  # minutes

balancer = LineBalancer(tasks, precedence, cycle_time)

# Calculate positional weights
weights = balancer.calculate_positional_weights()
print("Positional Weights:")
for task, weight in sorted(weights.items(), key=lambda x: x[1], reverse=True):
    print(f"  Task {task}: {weight:.1f}")

# RPW method
print("\n" + "="*50)
print("Ranked Positional Weight (RPW) Method")
print("="*50)
rpw_solution = balancer.rpw_method()

print(f"\nNumber of Workstations: {rpw_solution['num_workstations']}")
for i, ws in enumerate(rpw_solution['workstations']):
    print(f"  Station {i+1}: {ws['tasks']} - Time: {ws['time']:.1f} min")

if rpw_solution['unassigned_tasks']:
    print(f"  Unassigned: {rpw_solution['unassigned_tasks']}")

# Largest Candidate Rule
print("\n" + "="*50)
print("Largest Candidate Rule (LCR)")
print("="*50)
lcr_solution = balancer.largest_candidate_rule()

print(f"\nNumber of Workstations: {lcr_solution['num_workstations']}")
for i, ws in enumerate(lcr_solution['workstations']):
    print(f"  Station {i+1}: {ws['tasks']} - Time: {ws['time']:.1f} min")

# Compare solutions
print("\n" + "="*50)
print("Solution Comparison")
print("="*50)
comparison = balancer.compare_solutions(rpw_solution, lcr_solution)
print(comparison)
```

---

## Mixed-Model Line Balancing

### Multi-Product Line Balancing

```python
class MixedModelLineBalancer:
    """
    Mixed-model assembly line balancing
    Balance line for multiple product variants
    """

    def __init__(self, products, cycle_time):
        """
        Parameters:
        - products: dict {product_id: {'tasks': {task: time}, 'demand_pct': %}}
        - cycle_time: target cycle time

        Example:
        products = {
            'Model_A': {
                'tasks': {'A': 3.0, 'B': 2.5, 'C': 4.0},
                'demand_pct': 0.50
            },
            'Model_B': {
                'tasks': {'A': 2.5, 'B': 3.0, 'D': 3.5},
                'demand_pct': 0.30
            },
            'Model_C': {
                'tasks': {'A': 3.5, 'C': 3.0, 'D': 4.0},
                'demand_pct': 0.20
            }
        }
        """
        self.products = products
        self.cycle_time = cycle_time

    def calculate_average_task_times(self):
        """
        Calculate weighted average task times across all products
        """

        all_tasks = set()
        for product in self.products.values():
            all_tasks.update(product['tasks'].keys())

        avg_times = {}

        for task in all_tasks:
            weighted_time = 0
            for product in self.products.values():
                task_time = product['tasks'].get(task, 0)  # 0 if task not in product
                weighted_time += task_time * product['demand_pct']

            avg_times[task] = weighted_time

        return avg_times

    def balance_for_average(self):
        """
        Balance line using average task times
        """

        avg_times = self.calculate_average_task_times()

        # A task longer than the cycle time cannot fit in any station
        too_long = {t: round(v, 2) for t, v in avg_times.items() if v > self.cycle_time}
        if too_long:
            raise ValueError(f"Average task times longer than the cycle time: {too_long}")

        # Simple greedy assignment. This example has no precedence rules. If your
        # tasks must follow an order, use LineBalancer with the average times instead.
        # Check analyze_product_balance: one model can still go over the cycle time at
        # a station even when the average fits.
        workstations = []
        current_station = []
        current_time = 0

        # Sort tasks by time (longest first)
        sorted_tasks = sorted(avg_times.items(), key=lambda x: x[1], reverse=True)

        for task, time in sorted_tasks:
            if current_time + time <= self.cycle_time:
                current_station.append(task)
                current_time += time
            else:
                if current_station:
                    workstations.append({
                        'tasks': current_station.copy(),
                        'avg_time': current_time
                    })

                current_station = [task]
                current_time = time

        if current_station:
            workstations.append({
                'tasks': current_station.copy(),
                'avg_time': current_time
            })

        return {
            'workstations': workstations,
            'num_workstations': len(workstations),
            'avg_task_times': avg_times
        }

    def analyze_product_balance(self, solution):
        """
        Analyze balance for each product variant
        """

        product_analysis = {}

        for product_id, product_data in self.products.items():
            workstation_times = []

            for ws in solution['workstations']:
                ws_time = sum(product_data['tasks'].get(task, 0) for task in ws['tasks'])
                workstation_times.append(ws_time)

            metrics = LineBalancingMetrics(workstation_times, self.cycle_time).calculate_metrics()

            product_analysis[product_id] = {
                'demand_pct': product_data['demand_pct'] * 100,
                'efficiency': metrics['line_efficiency_pct'],
                'balance_delay': metrics['balance_delay_pct'],
                'workstation_times': workstation_times
            }

        return pd.DataFrame(product_analysis).T

# Example usage
products = {
    'Model_A': {
        'tasks': {'Task1': 3.0, 'Task2': 2.5, 'Task3': 4.0, 'Task4': 2.0},
        'demand_pct': 0.50
    },
    'Model_B': {
        'tasks': {'Task1': 2.5, 'Task2': 3.0, 'Task3': 3.5, 'Task5': 2.5},
        'demand_pct': 0.30
    },
    'Model_C': {
        'tasks': {'Task1': 3.5, 'Task3': 3.0, 'Task4': 2.5, 'Task5': 3.0},
        'demand_pct': 0.20
    }
}

mixed_balancer = MixedModelLineBalancer(products, cycle_time=10.0)

# Calculate average times
avg_times = mixed_balancer.calculate_average_task_times()
print("Average Task Times (weighted by demand):")
for task, time in sorted(avg_times.items()):
    print(f"  {task}: {time:.2f} minutes")

# Balance line
solution = mixed_balancer.balance_for_average()
print(f"\nMixed-Model Line Balance:")
print(f"  Number of Workstations: {solution['num_workstations']}")

for i, ws in enumerate(solution['workstations']):
    print(f"  Station {i+1}: {ws['tasks']} - Avg Time: {ws['avg_time']:.2f} min")

# Analyze each product
print("\nProduct-Specific Analysis:")
product_analysis = mixed_balancer.analyze_product_balance(solution)
print(product_analysis)
```

---

## Advanced Line Configurations

### U-Shaped Line Analysis

```python
class UShapedLineAnalyzer:
    """
    Analyze U-shaped assembly line configurations
    Benefits: Operator flexibility, reduced material handling
    """

    def __init__(self, tasks, num_operators):
        """
        Parameters:
        - tasks: list of task times in sequence
        - num_operators: number of operators
        """
        self.tasks = tasks
        self.num_operators = num_operators
        self.total_work_content = sum(tasks)

    def calculate_configuration(self):
        """
        Calculate U-shaped line configuration

        In U-shaped line:
        - Operators can work on both sides
        - Entrance and exit are close together
        - Flexible assignment possible
        """

        # Target work per operator
        target_work_per_operator = self.total_work_content / self.num_operators

        # Assign tasks to operators
        assignments = []
        current_operator = []
        current_workload = 0
        operator_num = 1

        for i, task_time in enumerate(self.tasks):
            if current_workload + task_time <= target_work_per_operator * 1.2:  # 20% tolerance
                current_operator.append(i+1)
                current_workload += task_time
            else:
                assignments.append({
                    'operator': operator_num,
                    'tasks': current_operator.copy(),
                    'workload': current_workload
                })

                operator_num += 1
                current_operator = [i+1]
                current_workload = task_time

        # Add last operator
        if current_operator:
            assignments.append({
                'operator': operator_num,
                'tasks': current_operator.copy(),
                'workload': current_workload
            })

        # Calculate metrics
        workloads = [a['workload'] for a in assignments]
        cycle_time = max(workloads)
        efficiency = (self.total_work_content / (len(assignments) * cycle_time)) * 100

        return {
            'assignments': assignments,
            'actual_operators': len(assignments),
            'target_operators': self.num_operators,
            'cycle_time': cycle_time,
            'efficiency_pct': efficiency,
            'target_work_per_operator': target_work_per_operator
        }

    def compare_to_straight_line(self, straight_line_cycle_time):
        """
        Compare U-shaped benefits vs. straight line

        U-shaped advantages:
        - Reduced walking distance
        - Better communication
        - Easier material flow
        - More flexible staffing
        """

        u_config = self.calculate_configuration()

        comparison = {
            'straight_line_cycle_time': straight_line_cycle_time,
            'u_shaped_cycle_time': u_config['cycle_time'],
            'improvement_pct': ((straight_line_cycle_time - u_config['cycle_time']) /
                               straight_line_cycle_time) * 100,
            # Space and material-handling savings depend on your layout.
            # Measure them on your own line; there is no standard figure.
        }

        return comparison

# Example usage
tasks = [2.5, 3.0, 2.0, 4.0, 3.5, 2.5, 3.0, 2.0, 3.5, 2.5]

u_line = UShapedLineAnalyzer(tasks, num_operators=4)

config = u_line.calculate_configuration()

print("U-Shaped Line Configuration:")
print(f"  Target Operators: {config['target_operators']}")
print(f"  Actual Operators: {config['actual_operators']}")
print(f"  Cycle Time: {config['cycle_time']:.2f} minutes")
print(f"  Line Efficiency: {config['efficiency_pct']:.1f}%")

print("\nOperator Assignments:")
for assignment in config['assignments']:
    print(f"  Operator {assignment['operator']}: Tasks {assignment['tasks']} - Workload: {assignment['workload']:.2f} min")

# Compare to straight line
comparison = u_line.compare_to_straight_line(straight_line_cycle_time=7.5)
print("\nU-Shaped vs. Straight Line Comparison:")
print(f"  Straight Line Cycle Time: {comparison['straight_line_cycle_time']:.2f} min")
print(f"  U-Shaped Cycle Time: {comparison['u_shaped_cycle_time']:.2f} min")
print(f"  Cycle Time Improvement: {comparison['improvement_pct']:.1f}%")
```

---

## Tools & Libraries

### Python Libraries

**Optimization:**
- `pulp`: Linear programming for line balancing
- `ortools`: Google optimization for assignment problems
- `scipy.optimize`: Optimization algorithms
- `networkx`: Precedence graph analysis

**Analysis:**
- `numpy`, `pandas`: Data analysis
- `matplotlib`, `seaborn`: Visualization

### Commercial Software

**Line Balancing:**
- **Arena**: Simulation with line balancing
- **FlexSim**: 3D simulation and balancing
- **Tecnomatix**: Siemens line balancing tools
- **Delmia**: Dassault line simulation
- **AutoMod**: Line simulation and optimization

**Industrial Engineering:**
- **ProModel**: Line balancing module
- **MOST/MTM**: Methods-Time Measurement

---

## Common Challenges & Solutions

### Challenge: Precedence Constraints

**Problem:**
- Complex task dependencies
- Limited flexibility in assignment
- Hard to achieve good balance

**Solutions:**
- Analyze if precedence can be relaxed
- Consider task splitting (divide complex tasks)
- Use parallel workstations for bottlenecks
- Precedence-aware algorithms (RPW method)

### Challenge: High Task Time Variability

**Problem:**
- Some tasks much longer than others
- Difficult to balance evenly
- Bottlenecks created by long tasks

**Solutions:**
- Task splitting (break long tasks into parts)
- Parallel workstations for long tasks
- Skill-based assignment (faster workers on long tasks)
- Work element standardization
- Automation of long/difficult tasks

### Challenge: Mixed-Model Production

**Problem:**
- Different products have different task times
- Balance good for one product, poor for another
- Frequent model changes

**Solutions:**
- Balance for average (weighted by demand)
- Use flexible/cross-trained operators
- Group similar products together (sequencing)
- Design for commonality (standard tasks)
- Dedicated lines for high-volume models

### Challenge: Operator Skill Differences

**Problem:**
- Not all operators equally skilled
- Task times vary by operator
- Training needs

**Solutions:**
- Multi-skilling and cross-training
- Pair experienced with new operators
- Standard work to reduce variation
- Job rotation for skill development
- Assign easier tasks to less skilled initially

### Challenge: Space Constraints

**Problem:**
- Physical space limits workstation design
- Cannot add workstations
- Equipment placement constraints

**Solutions:**
- U-shaped or two-sided lines (space-efficient)
- Vertical space utilization
- Mobile workstations
- Overlapping work zones
- Task time reduction to fit in fewer stations

---

## Output Format

### Line Balancing Report

**Executive Summary:**
- Current line configuration and performance
- Balancing results and efficiency
- Recommendations for improvement
- Expected benefits

The numbers below are a made-up example to show the layout. Use your own measured task times.

**Current State:**

| Workstation | Tasks | Time (min) | Idle Time | Utilization % |
|-------------|-------|------------|-----------|---------------|
| WS1 | A, B, C | 6.5 | 0.5 | 93% |
| WS2 | D, E | 6.9 | 0.1 | 99% (Bottleneck) |
| WS3 | F, G | 5.5 | 1.5 | 79% |
| WS4 | H, I, J | 6.0 | 1.0 | 86% |

**Current Metrics:**
- Number of Workstations: 4
- Cycle Time: 7.0 minutes
- Total work content: 24.9 minutes
- Line Efficiency: 24.9 / (4 × 7.0) = 88.9%
- Balance Delay: 11.1%
- Throughput: 60 / 7.0 = 8.6 units/hour

**Proposed Balance:** (same 24.9 minutes of work, spread more evenly)

| Workstation | Tasks | Time (min) | Idle Time at 6.4 min | Utilization % |
|-------------|-------|------------|-----------|---------------|
| WS1 | A, B, D | 6.4 | 0.0 | 100% (new bottleneck) |
| WS2 | C, E | 6.2 | 0.2 | 97% |
| WS3 | F, G, H | 6.1 | 0.3 | 95% |
| WS4 | I, J | 6.2 | 0.2 | 97% |

**Improved Metrics:**
- Number of Workstations: 4 (no change)
- Cycle Time: can drop to 6.4 minutes (the slowest station), if demand needs it
- Line Efficiency: 24.9 / (4 × 6.4) = 97.3%
- Balance Delay: 2.7%
- Throughput: 60 / 6.4 = 9.4 units/hour (+9%)

Rebalancing alone does not change efficiency if you keep the same cycle time and number of stations, because the total work stays the same. The gain comes from running at the shorter cycle time, or from removing a station.

**Recommendations:**

1. **Rebalance Workstations** (Priority: High)
   - Redistribute tasks per proposed balance
   - Expected: cycle time 7.0 → 6.4 min, about +9% throughput
   - Implementation and cost: [your estimate for training and layout changes]

2. **Reduce Bottleneck Task Time** (Priority: Medium)
   - Improve methods at the new bottleneck, WS1
   - Each minute cut there lowers the possible cycle time, until the next slowest station (6.2 min here) becomes the bottleneck
   - Methods: Improved tooling, eliminate wasted motion

3. **Consider a U-Shaped Line** (Priority: Medium)
   - Convert to U-shaped configuration if your layout allows
   - Expected: better operator flexibility; measure any floor-space saving on your own layout
   - Investment and payback: [from your own quotes]

**Expected Benefits:**
- Throughput: +9% in this example (8.6 → 9.4 units/hour), if you run at the shorter cycle time
- Line efficiency: 88.9% → 97.3% at the shorter cycle time
- Space, WIP and flexibility changes: measure on your own line

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Van loading planner](https://useaiblocks.com/skills/van-loading-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Questions to Ask

If you need more context:
1. What is the current line configuration and number of workstations?
2. What are the task list and processing times?
3. Are there precedence constraints between tasks?
4. What is the target production rate (units/day)?
5. What is the available working time per shift?
6. Are there skill or equipment constraints?
7. Is the line for single model or multiple products?
8. What is current line efficiency and bottleneck?

---

## Related Skills

- **production-scheduling**: For production planning and scheduling
- **process-optimization**: For overall process improvement
- **lean-manufacturing**: For waste elimination and flow
- **quality-management**: For quality at each station
- **capacity-planning**: For long-term capacity analysis
- **workforce-scheduling**: For operator scheduling
- **optimization-modeling**: For mathematical balancing models
- **prescriptive-analytics**: For advanced optimization
