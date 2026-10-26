---
name: spark-optimization
description: "Optimize Apache Spark jobs with partitioning, caching, shuffle optimization, and memory tuning. Use when improving Spark performance, debugging slow jobs, or scaling data processing pipelines."
risk: critical
source: community
date_added: "2026-02-27"
---

# Apache Spark Optimization

Production patterns for optimizing Apache Spark jobs including partitioning strategies, memory management, shuffle optimization, and performance tuning.

## Do not use this skill when

- The job runs fine today and nobody is waiting on it. Leave it alone.
- The pipeline is not Spark, or the work is SQL on a warehouse such as BigQuery or Snowflake. Those need their own tuning guides.
- The job fails with a bug or wrong results. Fix correctness first, then tune.
- You only have a vague wish for "faster". Ask for the job code and one run time first.

## Use this skill when

- A Spark job takes far longer than it should
- A few tasks run much longer than the rest (data skew)
- Executors run out of memory or spill to disk
- You are scaling a pipeline to much bigger data
- You want to cut shuffle (data moved between steps) and cost

## Risk note

Settings here change how a cluster uses memory and money. Wrong values can make a job fail or raise the bill. Try each change on a small run or a copy of the data first. Never apply changes to a production job without a rollback plan.

## What you need

Ask once, in one message, for anything missing:

1. The job code (PySpark, Scala or Spark SQL).
2. The Spark version and where it runs (Databricks, EMR, Dataproc, on your own cluster).
3. Cluster size and the current settings (executors, memory, cores, shuffle partitions).
4. Rough data size and the current run time.
5. The Spark UI stage view or the slowest stages (optional, but it helps most).

## Steps

1. **State the goal.** Write the target in one line, such as "cut the nightly run from 2 hours to under 1".
2. **Diagnose before tuning.** From the stage view, name the slow stage and the cause: too few or too many partitions, a large shuffle, skewed keys, memory spill, or slow serialization. If you have no stage view, say which stage you guess and mark it unmeasured.
3. **Pick fixes from the patterns below.** Order them by expected effect and risk. Start with the cheapest: turn on adaptive query execution, broadcast small tables, prune columns and partitions.
4. **Give each fix as a change.** Show the exact setting or code diff, why it helps, the effect you expect, and the metric to check afterwards.
5. **Say how to verify.** Name the same run, the same data, and the numbers to compare (run time, shuffle read and write, spill, longest task against the median).
6. **Stop at the limit.** If the data is too skewed or small for these fixes to matter, say so and suggest a data-layout change instead of more settings.

## Output

Return:

1. **Diagnosis:** the slow stage, the cause, and the evidence.
2. **Changes, ranked:** a table with columns change (setting or code diff), why, expected effect, risk, metric to check.
3. **Rewritten code:** only the parts that change.
4. **Settings block:** the full set of settings to try, with old and new values.
5. **How to confirm:** the numbers to compare before and after.
6. **Next steps:** what to try if the gain is too small, and what to watch in the Spark UI.

## If something is missing

- No job code: ask for it. Do not tune from a description alone.
- No stage view or run time: give general fixes, labelled unmeasured, and ask for the Spark UI view.
- Unknown Spark version: assume 3.2 or newer for adaptive execution and say so.
- Never state a speed gain as fact. Say "expected" until a run confirms it.

## Core Concepts

### 1. Spark Execution Model

```
Driver Program
    ↓
Job (triggered by action)
    ↓
Stages (separated by shuffles)
    ↓
Tasks (one per partition)
```

### 2. Key Performance Factors

| Factor | Impact | Solution |
|--------|--------|----------|
| **Shuffle** | Network I/O, disk I/O | Minimize wide transformations |
| **Data Skew** | Uneven task duration | Salting, broadcast joins |
| **Serialization** | CPU overhead | Use Kryo, columnar formats |
| **Memory** | GC pressure, spills | Tune executor memory |
| **Partitions** | Parallelism | Right-size partitions |

## Quick Start

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

# Create optimized Spark session
spark = (SparkSession.builder
    .appName("OptimizedJob")
    .config("spark.sql.adaptive.enabled", "true")
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true")
    .config("spark.sql.adaptive.skewJoin.enabled", "true")
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
    .config("spark.sql.shuffle.partitions", "200")
    .getOrCreate())

# Read with optimized settings
df = (spark.read
    .format("parquet")
    .option("mergeSchema", "false")
    .load("s3://bucket/data/"))

# Efficient transformations
result = (df
    .filter(F.col("date") >= "2024-01-01")
    .select("id", "amount", "category")
    .groupBy("category")
    .agg(F.sum("amount").alias("total")))

result.write.mode("overwrite").parquet("s3://bucket/output/")
```

## Patterns

### Pattern 1: Optimal Partitioning

```python
# Calculate optimal partition count
def calculate_partitions(data_size_gb: float, partition_size_mb: int = 128) -> int:
    """
    Optimal partition size: 128MB - 256MB
    Too few: Under-utilization, memory pressure
    Too many: Task scheduling overhead
    """
    return max(int(data_size_gb * 1024 / partition_size_mb), 1)

# Repartition for even distribution
df_repartitioned = df.repartition(200, "partition_key")

# Coalesce to reduce partitions (no shuffle)
df_coalesced = df.coalesce(100)

# Partition pruning with predicate pushdown
df = (spark.read.parquet("s3://bucket/data/")
    .filter(F.col("date") == "2024-01-01"))  # Spark pushes this down

# Write with partitioning for future queries
(df.write
    .partitionBy("year", "month", "day")
    .mode("overwrite")
    .parquet("s3://bucket/partitioned_output/"))
```

### Pattern 2: Join Optimization

```python
from pyspark.sql import functions as F
from pyspark.sql.types import *

# 1. Broadcast Join - Small table joins
# Best when: One side < 10MB (configurable)
small_df = spark.read.parquet("s3://bucket/small_table/")  # < 10MB
large_df = spark.read.parquet("s3://bucket/large_table/")  # TBs

# Explicit broadcast hint
result = large_df.join(
    F.broadcast(small_df),
    on="key",
    how="left"
)

# 2. Sort-Merge Join - Default for large tables
# Requires shuffle, but handles any size
result = large_df1.join(large_df2, on="key", how="inner")

# 3. Bucket Join - Pre-sorted, no shuffle at join time
# Write bucketed tables
(df.write
    .bucketBy(200, "customer_id")
    .sortBy("customer_id")
    .mode("overwrite")
    .saveAsTable("bucketed_orders"))

# Join bucketed tables (no shuffle!)
orders = spark.table("bucketed_orders")
customers = spark.table("bucketed_customers")  # Same bucket count
result = orders.join(customers, on="customer_id")

# 4. Skew Join Handling
# Enable AQE skew join optimization
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "256MB")

# Manual salting for severe skew
def salt_join(df_skewed, df_other, key_col, num_salts=10):
    """Add salt to distribute skewed keys"""
    # Add salt to skewed side
    df_salted = df_skewed.withColumn(
        "salt",
        (F.rand() * num_salts).cast("int")
    ).withColumn(
        "salted_key",
        F.concat(F.col(key_col), F.lit("_"), F.col("salt"))
    )

    # Explode other side with all salts
    df_exploded = df_other.crossJoin(
        spark.range(num_salts).withColumnRenamed("id", "salt")
    ).withColumn(
        "salted_key",
        F.concat(F.col(key_col), F.lit("_"), F.col("salt"))
    )

    # Join on salted key
    return df_salted.join(df_exploded, on="salted_key", how="inner")
```

### Pattern 3: Caching and Persistence

```python
from pyspark import StorageLevel

# Cache when reusing DataFrame multiple times
df = spark.read.parquet("s3://bucket/data/")
df_filtered = df.filter(F.col("status") == "active")

# Cache in memory (MEMORY_AND_DISK is default)
df_filtered.cache()

# Or with specific storage level
df_filtered.persist(StorageLevel.MEMORY_AND_DISK_SER)

# Force materialization
df_filtered.count()

# Use in multiple actions
agg1 = df_filtered.groupBy("category").count()
agg2 = df_filtered.groupBy("region").sum("amount")

# Unpersist when done
df_filtered.unpersist()

# Storage levels explained:
# MEMORY_ONLY - Fast, but may not fit
# MEMORY_AND_DISK - Spills to disk if needed (recommended)
# MEMORY_ONLY_SER - Serialized, less memory, more CPU
# DISK_ONLY - When memory is tight
# OFF_HEAP - Tungsten off-heap memory

# Checkpoint for complex lineage
spark.sparkContext.setCheckpointDir("s3://bucket/checkpoints/")
df_complex = (df
    .join(other_df, "key")
    .groupBy("category")
    .agg(F.sum("amount")))
df_complex.checkpoint()  # Breaks lineage, materializes
```

### Pattern 4: Memory Tuning

```python
# Executor memory configuration
# spark-submit --executor-memory 8g --executor-cores 4

# Memory breakdown (8GB executor):
# - spark.memory.fraction = 0.6 (60% = 4.8GB for execution + storage)
#   - spark.memory.storageFraction = 0.5 (50% of 4.8GB = 2.4GB for cache)
#   - Remaining 2.4GB for execution (shuffles, joins, sorts)
# - 40% = 3.2GB for user data structures and internal metadata

spark = (SparkSession.builder
    .config("spark.executor.memory", "8g")
    .config("spark.executor.memoryOverhead", "2g")  # For non-JVM memory
    .config("spark.memory.fraction", "0.6")
    .config("spark.memory.storageFraction", "0.5")
    .config("spark.sql.shuffle.partitions", "200")
    # For memory-intensive operations
    .config("spark.sql.autoBroadcastJoinThreshold", "50MB")
    # Prevent OOM on large shuffles
    .config("spark.sql.files.maxPartitionBytes", "128MB")
    .getOrCreate())

# Monitor memory usage
def print_memory_usage(spark):
    """Print current memory usage"""
    sc = spark.sparkContext
    for executor in sc._jsc.sc().getExecutorMemoryStatus().keySet().toArray():
        mem_status = sc._jsc.sc().getExecutorMemoryStatus().get(executor)
        total = mem_status._1() / (1024**3)
        free = mem_status._2() / (1024**3)
        print(f"{executor}: {total:.2f}GB total, {free:.2f}GB free")
```

### Pattern 5: Shuffle Optimization

```python
# Reduce shuffle data size
# With adaptive query execution on, Spark merges small shuffle partitions by itself.
# Start near data size / 128MB, or leave the default of 200.
spark.conf.set("spark.sql.shuffle.partitions", "200")
spark.conf.set("spark.shuffle.compress", "true")
spark.conf.set("spark.shuffle.spill.compress", "true")

# Pre-aggregate before shuffle
df_optimized = (df
    # Local aggregation first (combiner)
    .groupBy("key", "partition_col")
    .agg(F.sum("value").alias("partial_sum"))
    # Then global aggregation
    .groupBy("key")
    .agg(F.sum("partial_sum").alias("total")))

# Avoid shuffle with map-side operations
# BAD: Shuffle for each distinct
distinct_count = df.select("category").distinct().count()

# GOOD: Approximate distinct (no shuffle)
approx_count = df.select(F.approx_count_distinct("category")).collect()[0][0]

# Use coalesce instead of repartition when reducing partitions
df_reduced = df.coalesce(10)  # No shuffle

# Optimize shuffle with compression
spark.conf.set("spark.io.compression.codec", "lz4")  # Fast compression
```

### Pattern 6: Data Format Optimization

```python
# Parquet optimizations
(df.write
    .option("compression", "snappy")  # Fast compression
    .option("parquet.block.size", 128 * 1024 * 1024)  # 128MB row groups
    .parquet("s3://bucket/output/"))

# Column pruning - only read needed columns
df = (spark.read.parquet("s3://bucket/data/")
    .select("id", "amount", "date"))  # Spark only reads these columns

# Predicate pushdown - filter at storage level
df = (spark.read.parquet("s3://bucket/partitioned/year=2024/")
    .filter(F.col("status") == "active"))  # Pushed to Parquet reader

# Delta Lake optimizations
(df.write
    .format("delta")
    .option("optimizeWrite", "true")  # Bin-packing
    .option("autoCompact", "true")  # Compact small files
    .mode("overwrite")
    .save("s3://bucket/delta_table/"))

# Z-ordering for multi-dimensional queries
spark.sql("""
    OPTIMIZE delta.`s3://bucket/delta_table/`
    ZORDER BY (customer_id, date)
""")
```

### Pattern 7: Monitoring and Debugging

```python
# Enable detailed metrics
spark.conf.set("spark.sql.codegen.wholeStage", "true")
spark.conf.set("spark.sql.execution.arrow.pyspark.enabled", "true")

# Explain query plan
df.explain(mode="extended")
# Modes: simple, extended, codegen, cost, formatted

# Get physical plan statistics
df.explain(mode="cost")

# Monitor task metrics
def analyze_stage_metrics(spark):
    """Analyze recent stage metrics"""
    status_tracker = spark.sparkContext.statusTracker()

    for stage_id in status_tracker.getActiveStageIds():
        stage_info = status_tracker.getStageInfo(stage_id)
        print(f"Stage {stage_id}:")
        print(f"  Tasks: {stage_info.numTasks}")
        print(f"  Completed: {stage_info.numCompletedTasks}")
        print(f"  Failed: {stage_info.numFailedTasks}")

# Identify data skew
def check_partition_skew(df):
    """Check for partition skew"""
    partition_counts = (df
        .withColumn("partition_id", F.spark_partition_id())
        .groupBy("partition_id")
        .count()
        .orderBy(F.desc("count")))

    partition_counts.show(20)

    stats = partition_counts.select(
        F.min("count").alias("min"),
        F.max("count").alias("max"),
        F.avg("count").alias("avg"),
        F.stddev("count").alias("stddev")
    ).collect()[0]

    skew_ratio = stats["max"] / stats["avg"]
    print(f"Skew ratio: {skew_ratio:.2f}x (>2x indicates skew)")
```

## Configuration Cheat Sheet

```python
# Production configuration template
spark_configs = {
    # Adaptive Query Execution (AQE)
    "spark.sql.adaptive.enabled": "true",
    "spark.sql.adaptive.coalescePartitions.enabled": "true",
    "spark.sql.adaptive.skewJoin.enabled": "true",

    # Memory
    "spark.executor.memory": "8g",
    "spark.executor.memoryOverhead": "2g",
    "spark.memory.fraction": "0.6",
    "spark.memory.storageFraction": "0.5",

    # Parallelism
    "spark.sql.shuffle.partitions": "200",
    "spark.default.parallelism": "200",

    # Serialization
    "spark.serializer": "org.apache.spark.serializer.KryoSerializer",
    "spark.sql.execution.arrow.pyspark.enabled": "true",

    # Compression
    "spark.io.compression.codec": "lz4",
    "spark.shuffle.compress": "true",

    # Broadcast
    "spark.sql.autoBroadcastJoinThreshold": "50MB",

    # File handling
    "spark.sql.files.maxPartitionBytes": "128MB",
    "spark.sql.files.openCostInBytes": "4MB",
}
```

## Best Practices

### Do's
- **Enable AQE** - Adaptive query execution handles many issues
- **Use Parquet/Delta** - Columnar formats with compression
- **Broadcast small tables** - Avoid shuffle for small joins
- **Monitor Spark UI** - Check for skew, spills, GC
- **Right-size partitions** - 128MB - 256MB per partition

### Don'ts
- **Don't collect large data** - Keep data distributed
- **Don't use UDFs unnecessarily** - Use built-in functions
- **Don't over-cache** - Memory is limited
- **Don't ignore data skew** - It dominates job time
- **Don't use `.count()` for existence** - Use `.take(1)` or `.isEmpty()`

## Resources

- [Spark Performance Tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html)
- [Spark Configuration](https://spark.apache.org/docs/latest/configuration.html)
- [Databricks Optimization Guide](https://docs.databricks.com/en/optimizations/index.html)

## Limitations

- Settings depend on your Spark version, your cluster and your data. Measure on a test run before you apply them.
- Do not treat this as a substitute for review by someone who knows your cluster.
- Stop and ask if the job code, the cluster size or the goal is missing.
