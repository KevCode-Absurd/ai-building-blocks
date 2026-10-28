---
name: pallet-loading
description: When the user wants to optimize pallet loading, arrange boxes on pallets, or maximize pallet utilization. Also use when the user mentions "pallet optimization," "pallet packing," "pallet configuration," "pallet pattern generation," "unitization," "palletization," "case stacking," or "pallet stability." For container loading after palletization, see container-loading-optimization. For general 3D packing, see 3d-bin-packing.
---

# Pallet Loading Optimization

You are an expert in pallet loading and optimization. Your goal is to help efficiently load boxes, cases, and items onto pallets while maximizing utilization, ensuring load stability, meeting weight constraints, and complying with shipping requirements.

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

## Accuracy warning

The weight, height and compression results in this skill are rough estimates. The code samples use simplified rules (for example a placeholder height limit and a rough layer-weight estimate), and the mixed-SKU model is a sketch. Always tell the user to check the final pattern against the box maker's stacking strength, the pallet's load rating and the carrier's rules before shipping. Never present these figures as a safety guarantee. If a figure is not supplied, mark it `MISSING:` and do not guess it. The centre-of-gravity score is a rough screen with arbitrary cut-offs. It is not a safety pass, and the box compression strength and pallet load rating must come from the user.

## Initial Assessment

Before optimizing pallet loading, understand:

1. **Pallet Specifications**
   - Pallet type? (GMA/CHEP 48x40, Euro 47.2x39.4, custom)
   - Pallet dimensions: length x width x height
   - Pallet weight capacity? (typically 2,500-4,600 lbs)
   - Pallet weight itself? (typically 30-70 lbs)
   - Overhang allowed? (typically 0-3 inches)

2. **Items to Load**
   - How many items/cases? What dimensions?
   - Item weights and weight distribution
   - Stackability constraints? (stack limit, crush strength)
   - Fragile items requiring special placement?
   - All same size or mixed SKUs?

3. **Load Constraints**
   - Maximum pallet height? (often 72", 84", 96")
   - Weight distribution requirements?
   - Interlocking pattern required?
   - Stretch wrap, shrink wrap, or banding?
   - Anti-slip sheets needed?

4. **Shipping Requirements**
   - Truck or rail shipment?
   - Will pallets be stacked? (double-stacking)
   - Fork lift access directions?
   - Loading dock height constraints?
   - Transit duration and handling?

5. **Optimization Goals**
   - Maximize cases per pallet?
   - Minimize number of pallets?
   - Ensure stability (minimize overhang)?
   - Optimize for warehouse space?

---

## Pallet Loading Framework

### Standard Pallet Sizes

**North America:**
- GMA/CHEP: 48" x 40" (1219mm x 1016mm) - Most common
- 42" x 42" - Telecommunications, paint
- 48" x 48" - Drums, bulk materials
- 40" x 48" - Military, cement

**Europe:**
- EUR/EUR1: 47.2" x 31.5" (1200mm x 800mm) - European standard
- EUR2: 47.2" x 23.6" (1200mm x 600mm)
- EUR3: 39.4" x 47.2" (1000mm x 1200mm)
- EUR6: 31.5" x 47.2" (800mm x 1200mm)

**Asia:**
- 43.3" x 43.3" (1100mm x 1100mm) - Asian standard
- 39.4" x 39.4" (1000mm x 1000mm)

**ISO Standards:**
- ISO 1: 47.2" x 39.4" (1200mm x 1000mm)
- ISO 2: 39.4" x 47.2" (1000mm x 1200mm)

### Key Concepts

**1. Pallet Pattern**
- Arrangement of boxes on each layer
- Determines stability and efficiency
- Common patterns: block, row, pinwheel, split-row

**2. Interlocking**
- Boxes overlap between layers (90° rotation)
- Improves stability
- Reduces risk of collapse

**3. Column Stacking**
- Boxes directly on top of each other
- No interlocking
- Less stable but sometimes required

**4. Overhang**
- Box extends beyond pallet edge
- Typically limited to 2-3 inches
- Reduces stability, increases damage risk

**5. Compression Strength**
- Weight box can support from above
- Critical for determining stack height
- Degrades over time and with humidity

---

## Mathematical Formulation

### Pallet Loading Problem

**Objective:**
Maximize number of boxes loaded OR minimize number of pallets

**Variables:**
- x_i, y_i = position of box i on pallet
- z_i = layer number for box i
- o_i = orientation of box i (0-5)
- pattern_j = pallet pattern used for layer j

**Constraints:**
1. **Pallet dimensions**: boxes fit within pallet bounds (with overhang tolerance)
2. **Non-overlap**: boxes don't overlap in same layer
3. **Weight**: total weight ≤ pallet capacity
4. **Stability**: adequate support from below, center of gravity
5. **Stack height**: height ≤ maximum allowed
6. **Compression**: weight on each box ≤ its compression strength

---

## Algorithms and Solution Methods

### Pattern Generation Methods

**Simple Block Pattern**

```python
def generate_block_pattern(box_dims, pallet_dims, allow_overhang=2):
    """
    Generate simple block pattern for single box size

    Calculates optimal orientation and layout

    Parameters:
    - box_dims: (length, width, height)
    - pallet_dims: (length, width, max_height)
    - allow_overhang: maximum overhang in inches

    Returns pattern with max boxes per layer
    """

    box_l, box_w, box_h = box_dims
    pallet_l, pallet_w, pallet_h = pallet_dims

    best_pattern = None
    max_boxes = 0

    # Try both orientations
    orientations = [
        (box_l, box_w, box_h, 0),  # Original
        (box_w, box_l, box_h, 1)   # Rotated 90°
    ]

    for l, w, h, rotation in orientations:
        # Calculate how many fit in each direction
        effective_pallet_l = pallet_l + 2 * allow_overhang
        effective_pallet_w = pallet_w + 2 * allow_overhang

        boxes_length = int(effective_pallet_l // l)
        boxes_width = int(effective_pallet_w // w)

        boxes_per_layer = boxes_length * boxes_width

        if boxes_per_layer > max_boxes:
            max_boxes = boxes_per_layer

            # Calculate actual overhang
            actual_overhang_l = (boxes_length * l - pallet_l) / 2
            actual_overhang_w = (boxes_width * w - pallet_w) / 2

            best_pattern = {
                'boxes_per_layer': boxes_per_layer,
                'boxes_length': boxes_length,
                'boxes_width': boxes_width,
                'rotation': rotation,
                'box_dims': (l, w, h),
                'overhang': (actual_overhang_l, actual_overhang_w),
                'positions': []
            }

            # Generate positions
            for i in range(boxes_length):
                for j in range(boxes_width):
                    x = i * l - actual_overhang_l
                    y = j * w - actual_overhang_w
                    best_pattern['positions'].append((x, y, l, w))

    return best_pattern

# Example
box = (12, 10, 8)  # inches
pallet = (48, 40, 72)  # GMA pallet

pattern = generate_block_pattern(box, pallet, allow_overhang=2)
print(f"Boxes per layer: {pattern['boxes_per_layer']}")
print(f"Layout: {pattern['boxes_length']} x {pattern['boxes_width']}")
print(f"Overhang: {pattern['overhang']}")
```

**Interlocking Pattern Generator**

```python
def generate_interlocking_pattern(box_dims, pallet_dims, num_layers):
    """
    Generate interlocking pattern for stability

    Alternates orientation between layers

    Parameters:
    - box_dims: (length, width, height)
    - pallet_dims: (length, width, max_height)
    - num_layers: number of layers to generate

    Returns multi-layer interlocking pattern
    """

    box_l, box_w, box_h = box_dims
    pallet_l, pallet_w, pallet_h = pallet_dims

    patterns = []

    for layer in range(num_layers):
        # Alternate orientation by layer
        if layer % 2 == 0:
            # Layer 0, 2, 4, ... : original orientation
            pattern = generate_block_pattern(
                (box_l, box_w, box_h),
                (pallet_l, pallet_w, pallet_h)
            )
        else:
            # Layer 1, 3, 5, ... : rotated orientation
            pattern = generate_block_pattern(
                (box_w, box_l, box_h),
                (pallet_l, pallet_w, pallet_h)
            )

        # Add z-coordinate (layer height)
        z = layer * box_h
        pattern['layer'] = layer
        pattern['z'] = z

        patterns.append(pattern)

    total_boxes = sum(p['boxes_per_layer'] for p in patterns)

    return {
        'num_layers': num_layers,
        'total_boxes': total_boxes,
        'total_height': num_layers * box_h,
        'layers': patterns
    }

# Example
box = (16, 12, 10)
pallet = (48, 40, 72)
max_layers = int(pallet[2] // box[2])  # 7 layers fit

interlock = generate_interlocking_pattern(box, pallet, max_layers)
print(f"Total boxes: {interlock['total_boxes']}")
print(f"Height: {interlock['total_height']} inches")
```

**Mixed SKU Pattern Optimization**

```python
from pulp import *

def optimize_mixed_sku_pallet(items, pallet_dims, max_weight):
    """
    Optimize pallet loading with mixed SKUs

    Uses integer programming to select best combination

    Parameters:
    - items: list of dicts with 'id', 'dims', 'weight', 'quantity'
    - pallet_dims: (length, width, max_height)
    - max_weight: weight capacity

    Returns optimal loading pattern
    """

    pallet_l, pallet_w, pallet_h = pallet_dims

    # Pre-calculate patterns for each item type
    item_patterns = {}
    for item in items:
        item_id = item['id']
        dims = item['dims']

        pattern = generate_block_pattern(dims, pallet_dims)
        item_patterns[item_id] = pattern

    # Create optimization problem
    prob = LpProblem("Pallet_Loading", LpMaximize)

    # Decision variables: how many of each item to load
    x = LpVariable.dicts("load",
                        [item['id'] for item in items],
                        lowBound=0,
                        cat='Integer')

    # Objective: maximize total value/volume loaded
    prob += lpSum([
        x[item['id']] * item['dims'][0] * item['dims'][1] * item['dims'][2]
        for item in items
    ]), "Total_Volume"

    # Weight constraint
    prob += lpSum([
        x[item['id']] * item['weight']
        for item in items
    ]) <= max_weight, "Weight_Capacity"

    # Quantity constraint
    for item in items:
        prob += x[item['id']] <= item['quantity'], f"Quantity_{item['id']}"

    # Height is NOT modelled in this sketch. After solving, check height layer by
    # layer against the real maximum height. Until that check is done, report
    # "MISSING: height check" in the result. Do not invent a height limit.

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    # Extract solution
    solution = {
        'status': LpStatus[prob.status],
        'items_loaded': {},
        'total_weight': 0,
        'total_volume': 0
    }

    for item in items:
        qty = int(x[item['id']].varValue) if x[item['id']].varValue else 0
        if qty > 0:
            solution['items_loaded'][item['id']] = qty
            solution['total_weight'] += qty * item['weight']
            volume = item['dims'][0] * item['dims'][1] * item['dims'][2]
            solution['total_volume'] += qty * volume

    return solution
```

### Stability Analysis

**Center of Gravity Check**

```python
import numpy as np

def check_center_of_gravity(loaded_items, pallet_dims):
    """
    Calculate center of gravity and check stability

    Parameters:
    - loaded_items: list of dicts with 'position' (x,y,z), 'dims', 'weight'
    - pallet_dims: (length, width, height)

    Returns COG coordinates and stability score
    """

    if not loaded_items:
        return None

    total_weight = sum(item['weight'] for item in loaded_items)

    # Calculate weighted average position
    cog_x = sum(
        (item['position'][0] + item['dims'][0]/2) * item['weight']
        for item in loaded_items
    ) / total_weight

    cog_y = sum(
        (item['position'][1] + item['dims'][1]/2) * item['weight']
        for item in loaded_items
    ) / total_weight

    cog_z = sum(
        (item['position'][2] + item['dims'][2]/2) * item['weight']
        for item in loaded_items
    ) / total_weight

    # Check if COG is within pallet bounds
    pallet_center_x = pallet_dims[0] / 2
    pallet_center_y = pallet_dims[1] / 2

    offset_x = abs(cog_x - pallet_center_x)
    offset_y = abs(cog_y - pallet_center_y)

    # ROUGH SCREEN ONLY. The 10% offset rule and the cut-off of 70 are
    # arbitrary choices from the original author. They are not a safety limit.
    # Stability score (lower offset = higher stability)
    max_offset_x = pallet_dims[0] * 0.1
    max_offset_y = pallet_dims[1] * 0.1

    stability_x = max(0, 100 * (1 - offset_x / max_offset_x))
    stability_y = max(0, 100 * (1 - offset_y / max_offset_y))
    stability_score = min(stability_x, stability_y)

    return {
        'cog': (cog_x, cog_y, cog_z),
        'pallet_center': (pallet_center_x, pallet_center_y),
        'offset': (offset_x, offset_y),
        'stability_score': stability_score,
        # Rough centring screen only. It ignores weight, crush strength and wrap.
        'looks_centred': stability_score > 70
    }

# Example
items = [
    {'position': (0, 0, 0), 'dims': (12, 10, 8), 'weight': 25},
    {'position': (12, 0, 0), 'dims': (12, 10, 8), 'weight': 25},
    {'position': (0, 10, 0), 'dims': (12, 10, 8), 'weight': 25},
    {'position': (12, 10, 0), 'dims': (12, 10, 8), 'weight': 25},
]

pallet = (48, 40, 72)
cog_result = check_center_of_gravity(items, pallet)
print(f"COG: {cog_result['cog']}")
print(f"Stability Score: {cog_result['stability_score']:.1f}")
print(f"Looks centred (rough screen, not a safety pass): {cog_result['looks_centred']}")
```

**Compression Strength Check**

```python
def check_compression_strength(layers, box_compression_strength):
    """
    Verify each box can support weight above it

    Parameters:
    - layers: list of layer patterns (bottom to top)
    - box_compression_strength: max weight box can support (lbs)

    Returns safety analysis
    """

    issues = []
    safe = True

    for layer_idx in range(len(layers) - 1):
        layer = layers[layer_idx]

        # Calculate weight above this layer
        weight_above = 0
        for upper_layer_idx in range(layer_idx + 1, len(layers)):
            upper_layer = layers[upper_layer_idx]
            weight_above += sum(
                item['weight'] for item in upper_layer['items']
            )

        # Check each box in this layer
        num_boxes_in_layer = len(layer['items'])
        weight_per_box = weight_above / num_boxes_in_layer if num_boxes_in_layer > 0 else 0

        if weight_per_box > box_compression_strength:
            issues.append({
                'layer': layer_idx,
                'weight_per_box': weight_per_box,
                'max_allowed': box_compression_strength,
                'safety_factor': weight_per_box / box_compression_strength
            })
            safe = False

    return {
        'safe': safe,
        'issues': issues,
        'max_safe_layers': len(layers) if safe else layer_idx
    }
```

### Complete Pallet Optimizer

```python
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np

class PalletOptimizer:
    """
    Comprehensive Pallet Loading Optimizer

    Handles single and mixed SKU loading with stability checks
    """

    def __init__(self, pallet_type='GMA', custom_dims=None,
                 weight_capacity=None, max_height=72):
        """
        Initialize pallet optimizer

        Parameters:
        - pallet_type: 'GMA', 'EUR', 'EUR1', or 'custom'
        - custom_dims: (length, width) if pallet_type='custom'
        - weight_capacity: max weight in lbs
        - max_height: max height in inches
        """

        # Standard pallet dimensions (inches)
        pallet_dims = {
            'GMA': (48, 40),
            'CHEP': (48, 40),
            'EUR': (47.2, 31.5),
            'EUR1': (47.2, 31.5),
            'EUR2': (47.2, 23.6),
            'ISO1': (47.2, 39.4),
            'ISO2': (39.4, 47.2)
        }

        if pallet_type == 'custom':
            if custom_dims is None:
                raise ValueError("Must provide custom_dims for custom pallet")
            self.pallet_dims = (*custom_dims, max_height)
        else:
            dims = pallet_dims.get(pallet_type, (48, 40))
            self.pallet_dims = (*dims, max_height)

        # The load rating must come from the user or the pallet maker.
        # If it includes the pallet's own weight, pass the rating minus that weight.
        if weight_capacity is None:
            raise ValueError("MISSING: weight_capacity. Ask for the pallet's load rating.")

        self.pallet_type = pallet_type
        self.weight_capacity = weight_capacity
        self.items = []
        self.solution = None

    def add_item(self, length, width, height, weight,
                 quantity=1, item_id=None, compression_strength=None,
                 fragile=False):
        """Add item type to be loaded"""

        if item_id is None:
            item_id = f"SKU_{len(self.items)}"

        # Compression strength (stack limit) must come from the box maker.
        # Do not guess it. If it is missing, report "MISSING: compression strength".
        if compression_strength is None:
            raise ValueError("MISSING: compression_strength. Ask the box maker for it.")

        self.items.append({
            'id': item_id,
            'dims': (length, width, height),
            'weight': weight,
            'quantity': quantity,
            'compression_strength': compression_strength,
            'fragile': fragile
        })

    def optimize_single_sku(self, allow_overhang=2, interlock=True):
        """
        Optimize loading for single SKU

        Parameters:
        - allow_overhang: max overhang in inches
        - interlock: use interlocking pattern

        Returns optimal pallet configuration
        """

        if len(self.items) != 1:
            raise ValueError("Use optimize_single_sku only for single SKU")

        item = self.items[0]
        box_dims = item['dims']
        box_weight = item['weight']
        available_qty = item['quantity']

        # Calculate max layers by height
        max_layers_height = int(self.pallet_dims[2] // box_dims[2])

        # Calculate max layers by weight (weight_capacity must be the pallet's
        # real load rating, minus the pallet's own weight if the rating includes it)
        base_for_weight = generate_block_pattern(
            box_dims, self.pallet_dims, allow_overhang
        )
        if not base_for_weight or base_for_weight['boxes_per_layer'] == 0:
            raise ValueError("The box does not fit on this pallet.")
        max_layers_weight = int(self.weight_capacity //
                               (box_weight * base_for_weight['boxes_per_layer']))

        # Calculate max layers by compression
        max_layers_compression = int(item['compression_strength'] / box_weight) + 1

        # Take minimum
        max_layers = min(max_layers_height, max_layers_weight,
                        max_layers_compression, 15)  # Cap at 15 for safety

        if interlock:
            pattern = generate_interlocking_pattern(
                box_dims, self.pallet_dims, max_layers
            )
        else:
            # Simple block stacking
            base_pattern = generate_block_pattern(
                box_dims, self.pallet_dims, allow_overhang
            )

            pattern = {
                'num_layers': max_layers,
                'total_boxes': base_pattern['boxes_per_layer'] * max_layers,
                'layers': [base_pattern] * max_layers
            }

        # Enforce quantity AND total weight on the pattern actually built.
        # Layers can hold different box counts (interlocking layers are made
        # separately), so add them up one by one and stop before either limit
        # is passed. Never rely on the layer estimate above alone.
        kept_layers = []
        boxes_so_far = 0
        for layer in pattern['layers']:
            n = layer['boxes_per_layer']
            if boxes_so_far + n > available_qty:
                break
            if (boxes_so_far + n) * box_weight > self.weight_capacity:
                break
            kept_layers.append(layer)
            boxes_so_far += n
        pattern['layers'] = kept_layers
        pattern['num_layers'] = len(kept_layers)
        pattern['total_boxes'] = boxes_so_far

        # Calculate weight and check it against the stated capacity
        total_weight = pattern['total_boxes'] * box_weight
        within_weight = total_weight <= self.weight_capacity
        if not within_weight:
            raise ValueError(
                f"Plan weighs {total_weight} lbs, over the stated capacity of "
                f"{self.weight_capacity} lbs. Do not use it."
            )

        # Check stability
        loaded_items = []
        for layer_idx in range(pattern['num_layers']):
            z = layer_idx * box_dims[2]
            layer_pattern = pattern['layers'][layer_idx]

            for pos in layer_pattern['positions']:
                loaded_items.append({
                    'position': (pos[0], pos[1], z),
                    'dims': box_dims,
                    'weight': box_weight
                })

        if not loaded_items:
            raise ValueError("Not even one layer fits the quantity and weight limits.")
        cog = check_center_of_gravity(loaded_items, self.pallet_dims)

        self.solution = {
            'pattern': pattern,
            'total_boxes': pattern['total_boxes'],
            'total_weight': total_weight,
            'within_weight_capacity': within_weight,
            'total_height': pattern['num_layers'] * box_dims[2],
            'num_layers': pattern['num_layers'],
            'utilization': self.calculate_utilization(pattern, box_dims),
            'stability': cog,
            'loaded_items': loaded_items
        }

        return self.solution

    def optimize_mixed_sku(self):
        """
        Optimize loading for mixed SKUs

        Uses layer-by-layer heuristic
        """

        if len(self.items) < 2:
            raise ValueError("Use optimize_mixed_sku for multiple SKUs")

        # Sort items by volume (largest first)
        sorted_items = sorted(self.items,
                             key=lambda x: x['dims'][0] * x['dims'][1] * x['dims'][2],
                             reverse=True)

        loaded_items = []
        current_height = 0
        total_weight = 0

        # Load layer by layer
        while current_height < self.pallet_dims[2]:
            # Select item for this layer
            layer_item = None
            for item in sorted_items:
                if item['quantity'] > 0:
                    # Check if item fits
                    if current_height + item['dims'][2] <= self.pallet_dims[2]:
                        layer_item = item
                        break

            if layer_item is None:
                break  # No more items fit

            # Generate pattern for this layer
            layer_pattern = generate_block_pattern(
                layer_item['dims'],
                self.pallet_dims
            )

            boxes_to_load = min(
                layer_pattern['boxes_per_layer'],
                layer_item['quantity']
            )

            # Check weight
            if total_weight + boxes_to_load * layer_item['weight'] > self.weight_capacity:
                # Reduce boxes to fit weight
                boxes_to_load = int((self.weight_capacity - total_weight) / layer_item['weight'])

            if boxes_to_load == 0:
                break

            # Load boxes
            for i, pos in enumerate(layer_pattern['positions'][:boxes_to_load]):
                loaded_items.append({
                    'item_id': layer_item['id'],
                    'position': (pos[0], pos[1], current_height),
                    'dims': layer_item['dims'],
                    'weight': layer_item['weight']
                })

            layer_item['quantity'] -= boxes_to_load
            total_weight += boxes_to_load * layer_item['weight']
            current_height += layer_item['dims'][2]

        # Calculate metrics
        cog = check_center_of_gravity(loaded_items, self.pallet_dims)

        self.solution = {
            'total_boxes': len(loaded_items),
            'total_weight': total_weight,
            'within_weight_capacity': total_weight <= self.weight_capacity,
            'total_height': current_height,
            'loaded_items': loaded_items,
            'stability': cog
        }

        return self.solution

    def calculate_utilization(self, pattern, box_dims):
        """Calculate volume utilization percentage"""
        box_volume = box_dims[0] * box_dims[1] * box_dims[2]
        total_box_volume = pattern['total_boxes'] * box_volume

        pallet_volume = (self.pallet_dims[0] * self.pallet_dims[1] *
                        pattern['num_layers'] * box_dims[2])

        return (total_box_volume / pallet_volume * 100) if pallet_volume > 0 else 0

    def visualize_3d(self, save_path=None):
        """3D visualization of pallet load"""

        if self.solution is None:
            raise ValueError("No solution to visualize. Run optimize first.")

        fig = plt.figure(figsize=(12, 10))
        ax = fig.add_subplot(111, projection='3d')

        # Draw pallet base
        pallet_l, pallet_w, pallet_h = self.pallet_dims
        self._draw_pallet_base(ax, pallet_l, pallet_w)

        # Draw loaded items
        colors = plt.cm.tab20(np.linspace(0, 1, 20))

        for idx, item in enumerate(self.solution['loaded_items']):
            pos = item['position']
            dims = item['dims']
            color = colors[idx % 20]

            self._draw_box_3d(ax, pos, dims, color, alpha=0.7)

        # Draw COG
        if self.solution.get('stability'):
            cog = self.solution['stability']['cog']
            ax.scatter([cog[0]], [cog[1]], [cog[2]],
                      c='red', s=200, marker='*',
                      label='Center of Gravity')

        ax.set_xlabel('Length (in)')
        ax.set_ylabel('Width (in)')
        ax.set_zlabel('Height (in)')
        ax.set_title(f'Pallet Load: {self.solution["total_boxes"]} boxes\n'
                    f'Weight: {self.solution["total_weight"]:.0f} lbs | '
                    f'Height: {self.solution["total_height"]:.1f} in')

        ax.legend()

        # Set equal aspect
        max_dim = max(pallet_l, pallet_w, self.solution['total_height'])
        ax.set_xlim(-5, max_dim + 5)
        ax.set_ylim(-5, max_dim + 5)
        ax.set_zlim(0, max_dim + 5)

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def _draw_pallet_base(self, ax, length, width):
        """Draw pallet base"""
        vertices = np.array([
            [0, 0, 0], [length, 0, 0], [length, width, 0], [0, width, 0]
        ])

        face = [vertices]
        pallet_face = Poly3DCollection(face, facecolors='brown',
                                       linewidths=2, edgecolors='black',
                                       alpha=0.3)
        ax.add_collection3d(pallet_face)

    def _draw_box_3d(self, ax, position, dimensions, color, alpha=0.7):
        """Draw 3D box"""
        x, y, z = position
        l, w, h = dimensions

        vertices = np.array([
            [x, y, z], [x+l, y, z], [x+l, y+w, z], [x, y+w, z],
            [x, y, z+h], [x+l, y, z+h], [x+l, y+w, z+h], [x, y+w, z+h]
        ])

        faces = [
            [vertices[0], vertices[1], vertices[5], vertices[4]],
            [vertices[2], vertices[3], vertices[7], vertices[6]],
            [vertices[0], vertices[3], vertices[7], vertices[4]],
            [vertices[1], vertices[2], vertices[6], vertices[5]],
            [vertices[0], vertices[1], vertices[2], vertices[3]],
            [vertices[4], vertices[5], vertices[6], vertices[7]]
        ]

        face_collection = Poly3DCollection(faces, facecolors=color,
                                          linewidths=0.5, edgecolors='black',
                                          alpha=alpha)
        ax.add_collection3d(face_collection)

    def visualize_top_view(self, layer_index=0, save_path=None):
        """2D top-down view of specific layer"""

        if self.solution is None:
            raise ValueError("No solution to visualize")

        fig, ax = plt.subplots(figsize=(10, 8))

        # Draw pallet outline
        pallet_l, pallet_w = self.pallet_dims[:2]
        pallet_rect = patches.Rectangle((0, 0), pallet_l, pallet_w,
                                        linewidth=2, edgecolor='black',
                                        facecolor='lightgray', alpha=0.3)
        ax.add_patch(pallet_rect)

        # Filter items for this layer
        if 'pattern' in self.solution:
            # Single SKU
            if layer_index < len(self.solution['pattern']['layers']):
                layer = self.solution['pattern']['layers'][layer_index]
                box_dims = self.items[0]['dims']

                for pos in layer['positions']:
                    rect = patches.Rectangle(
                        (pos[0], pos[1]), pos[2], pos[3],
                        linewidth=1, edgecolor='blue',
                        facecolor='lightblue', alpha=0.7
                    )
                    ax.add_patch(rect)

                    # Add dimensions label
                    cx = pos[0] + pos[2]/2
                    cy = pos[1] + pos[3]/2
                    ax.text(cx, cy, f'{pos[2]:.0f}x{pos[3]:.0f}',
                           ha='center', va='center', fontsize=8)

        ax.set_xlim(-5, pallet_l + 5)
        ax.set_ylim(-5, pallet_w + 5)
        ax.set_aspect('equal')
        ax.set_xlabel('Length (in)')
        ax.set_ylabel('Width (in)')
        ax.set_title(f'Pallet Top View - Layer {layer_index + 1}')
        ax.grid(True, alpha=0.3)

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def print_solution(self):
        """Print solution summary"""

        if self.solution is None:
            print("No solution available")
            return

        print("=" * 70)
        print("PALLET LOADING SOLUTION")
        print("=" * 70)
        print(f"Pallet type: {self.pallet_type}")
        print(f"Pallet dimensions: {self.pallet_dims[0]} x {self.pallet_dims[1]} x {self.pallet_dims[2]} in")
        print(f"Weight capacity: {self.weight_capacity} lbs")
        print()
        print(f"Total boxes loaded: {self.solution['total_boxes']}")
        print(f"Total weight: {self.solution['total_weight']:.1f} lbs "
              f"({self.solution['total_weight']/self.weight_capacity*100:.1f}% of capacity)")
        print(f"Weight check: {'within stated capacity' if self.solution.get('within_weight_capacity') else 'OVER CAPACITY - DO NOT USE'}")
        print(f"Total height: {self.solution['total_height']:.1f} in "
              f"({self.solution['total_height']/self.pallet_dims[2]*100:.1f}% of max)")

        if 'utilization' in self.solution:
            print(f"Volume utilization: {self.solution['utilization']:.1f}%")

        if self.solution.get('stability'):
            stab = self.solution['stability']
            print()
            print("Stability Analysis:")
            print(f"  Center of Gravity: ({stab['cog'][0]:.1f}, {stab['cog'][1]:.1f}, {stab['cog'][2]:.1f})")
            print(f"  Offset from center: ({stab['offset'][0]:.1f}, {stab['offset'][1]:.1f}) in")
            print(f"  Stability Score: {stab['stability_score']:.1f}/100")
            print(f"  Rough centre check: {'looks centred' if stab['looks_centred'] else 'OFF CENTRE - REVIEW REQUIRED'} (not a safety pass)")
            print("  The centre check says nothing about weight, crush strength or wrapping. Check those separately.")


# Example usage
if __name__ == "__main__":
    # Example 1: Single SKU optimization
    print("Example 1: Single SKU Pallet Loading")
    print("-" * 50)

    pallet = PalletOptimizer(pallet_type='GMA', weight_capacity=2500, max_height=72)  # example values only: use the pallet's real load rating

    # Add boxes (12x10x8 inches, 25 lbs each, 100 available)
    pallet.add_item(length=12, width=10, height=8, weight=25,
                   quantity=100, item_id='BOX_A',
                   compression_strength=250)  # example value only: use the box maker's figure

    # Optimize
    solution = pallet.optimize_single_sku(interlock=True)

    # Print results
    pallet.print_solution()

    # Visualize
    print("\nGenerating 3D visualization...")
    pallet.visualize_3d()

    print("\nGenerating top view...")
    pallet.visualize_top_view(layer_index=0)
```

---

## Tools & Libraries

### Python Libraries

**palletizing** - Pallet pattern generation
**py3dbp** - Can be used for pallet loading
**rectpack** - Rectangle packing (for layer generation)

### Commercial Software

- **CAPE PACK**: Professional palletization software
- **TOPS Pro**: Pallet optimization
- **PalletStacking**: Online pallet calculator
- **LoadCalc**: Load planning software
- **Pallet Design System (PDS)**: NWPCA software

### Online Tools

- **PackEx**: Free pallet calculator
- **PalletConfigr**: Pallet pattern generator
- **Boxologic**: Free 3D packing tool

---

## Common Challenges & Solutions

### Challenge: Poor Pallet Utilization (<75%)

**Problem:**
- Boxes don't fit efficiently
- Large gaps between boxes
- Wasted vertical space

**Solutions:**
- Try different orientations (rotate 90°)
- Use interlocking pattern
- Mix similar-sized SKUs on same pallet
- Consider custom case sizes that tile better
- Fill gaps with smaller items

### Challenge: Load Instability

**Problem:**
- Pallet tips during transport
- Boxes shift or collapse
- Heavy overhang

**Solutions:**
- Limit overhang to <3 inches
- Use interlocking pattern
- Place heavy items at bottom center
- Check center of gravity calculation
- Use slip sheets between layers
- Apply stretch wrap properly
- Add corner boards for support

### Challenge: Compression Damage

**Problem:**
- Bottom boxes crushed
- Stack collapses during storage
- Corrugated boxes weakened by humidity

**Solutions:**
- Check compression strength specifications
- Limit stack height based on ECT rating
- Use column stacking for weak boxes
- Add load capping (top board)
- Control humidity in storage
- Use stronger boxes for bottom layers

### Challenge: Mixed SKU Complexity

**Problem:**
- Different box sizes don't pack well together
- Height differences create instability
- Difficult to generate efficient patterns

**Solutions:**
- Group similar heights on same layer
- Use layer-by-layer approach
- Place largest/heaviest at bottom
- Fill small gaps with dunnage
- Consider using two pallets for very different sizes

### Challenge: Shipping Constraints

**Problem:**
- Pallet too tall for truck
- Too heavy for dock equipment
- Doesn't fit through doors

**Solutions:**
- Set max height constraint (typically 72" or 84")
- Respect weight limits (forklift capacity 3,000-5,000 lbs)
- Check door clearances before optimization
- Consider double-stacking capability
- Plan for specific truck/rail car dimensions

---

## Output Format

### Pallet Loading Report

_Layout example only. Every number below is made up to show the layout. Never reuse them. Use the user's own figures, and mark any missing figure `MISSING:`._

**Summary:**
- Pallet Type: GMA (48" x 40")
- Boxes Loaded: 84 cases
- Total Weight: [TOTAL] lbs
- Weight check: [TOTAL] of [CAPACITY] lbs stated capacity (must be at or under it)
- Total Height: 64 inches
- Utilization: 89.5%
- Rough centre-of-gravity screen: looks centred (offset [OFFSET]"). This is not a safety pass.

**Loading Pattern:**

Layer 1 (Bottom):
- Pattern: 4 x 5 = 20 boxes
- Orientation: 12"L x 10"W
- Layer Height: 8"
- Layer Weight: 500 lbs

Layer 2:
- Pattern: 5 x 4 = 20 boxes (rotated 90°)
- Orientation: 10"L x 12"W
- Layer Height: 16"
- Layer Weight: 500 lbs

Layer 3:
- Pattern: 4 x 5 = 20 boxes
- Orientation: 12"L x 10"W
- Layer Height: 24"
- Layer Weight: 500 lbs

Layer 4:
- Pattern: 5 x 4 = 20 boxes (rotated 90°)
- Orientation: 10"L x 12"W
- Layer Height: 32"
- Layer Weight: 500 lbs

Layer 5 (Top):
- Pattern: 2 x 2 = 4 boxes
- Orientation: 12"L x 10"W
- Layer Height: 40"
- Layer Weight: 100 lbs

**Stability Analysis:**
- Center of Gravity: (24.0", 20.0", 20.5")
- Offset from center: 1.2" horizontal
- Rough screen: looks centred (not a safety pass)
- Recommended: Stretch wrap with 3-4 passes

**Shipping Instructions:**
- Apply stretch wrap immediately after loading
- Use 4-way entry for forklift
- Double-stack only if the pallet's load rating and the box maker's stacking strength allow it
- Max stack height: 2 high (128" total)
- Label all 4 sides

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Freight mode and carrier picker](https://useaiblocks.com/skills/freight-mode-and-carrier-picker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Questions to Ask

If you need more context:
1. What pallet size are you using? (GMA 48x40, Euro, custom?)
2. What are the box dimensions and weights?
3. How many boxes need to be loaded per pallet?
4. Is there a maximum height restriction?
5. Can boxes be rotated or mixed on same pallet?
6. Are there stability or compression strength concerns?
7. What's the shipping method? (truck, rail, container)
8. Do you need interlocking pattern for stability?

---

## Related Skills

- **3d-bin-packing**: For general 3D packing problems
- **container-loading-optimization**: For loading pallets into containers
- **vehicle-loading-optimization**: For truck loading with pallets
- **2d-bin-packing**: For layer pattern generation
- **load-building-optimization**: For order fulfillment and pallet building
- **warehouse-slotting-optimization**: For pallet storage optimization
