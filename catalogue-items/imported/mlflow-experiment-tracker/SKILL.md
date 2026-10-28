---
name: mlflow
description: Track ML experiments, manage model registry with versioning, deploy models to production, and reproduce experiments with MLflow - framework-agnostic ML lifecycle platform
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [MLOps, MLflow, Experiment Tracking, Model Registry, ML Lifecycle, Deployment, Model Versioning, PyTorch, TensorFlow, Scikit-Learn, HuggingFace]
dependencies: [mlflow, sqlalchemy, boto3]
---

# MLflow: ML Lifecycle Management Platform

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use This Skill

Use MLflow when you need to:
- **Track ML experiments** with parameters, metrics, and artifacts
- **Manage model registry** with versioning and stage transitions
- **Deploy models** to various platforms (local, cloud, serving)
- **Reproduce experiments** with project configurations
- **Compare model versions** and performance metrics
- **Collaborate** on ML projects with team workflows
- **Integrate** with any ML framework (framework-agnostic)

**MLflow library licence**: Apache 2.0 (this skill file is MIT, as in the front matter)

## Installation

```bash
# Install MLflow
pip install mlflow

# Install with extras
pip install mlflow[extras]  # Includes SQLAlchemy, boto3, etc.

# Start MLflow UI
mlflow ui

# Access at http://localhost:5000
```

## Quick Start

### Basic Tracking

```python
import mlflow

# Start a run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("batch_size", 32)

    # Your training code
    model = train_model()

    # Log metrics
    mlflow.log_metric("train_loss", 0.15)
    mlflow.log_metric("val_accuracy", 0.92)

    # Log model
    mlflow.sklearn.log_model(model, "model")
```

### Autologging (Automatic Tracking)

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier

# Enable autologging
mlflow.autolog()

# Train (automatically logged)
model = RandomForestClassifier(n_estimators=100, max_depth=5)
model.fit(X_train, y_train)

# Metrics, parameters, and model logged automatically!
```

## Core Concepts

### 1. Experiments and Runs

**Experiment**: Logical container for related runs
**Run**: Single execution of ML code (parameters, metrics, artifacts)

```python
import mlflow

# Create/set experiment
mlflow.set_experiment("my-experiment")

# Start a run
with mlflow.start_run(run_name="baseline-model"):
    # Log params
    mlflow.log_param("model", "ResNet50")
    mlflow.log_param("epochs", 10)

    # Train
    model = train()

    # Log metrics
    mlflow.log_metric("accuracy", 0.95)

    # Log model
    mlflow.pytorch.log_model(model, "model")

# Run ID is automatically generated
print(f"Run ID: {mlflow.active_run().info.run_id}")
```

### 2. Logging Parameters

```python
with mlflow.start_run():
    # Single parameter
    mlflow.log_param("learning_rate", 0.001)

    # Multiple parameters
    mlflow.log_params({
        "batch_size": 32,
        "epochs": 50,
        "optimizer": "Adam",
        "dropout": 0.2
    })

    # Nested parameters (as dict)
    config = {
        "model": {
            "architecture": "ResNet50",
            "pretrained": True
        },
        "training": {
            "lr": 0.001,
            "weight_decay": 1e-4
        }
    }

    # Log as JSON string or individual params
    for key, value in config.items():
        mlflow.log_param(key, str(value))
```

### 3. Logging Metrics

```python
with mlflow.start_run():
    # Training loop
    for epoch in range(NUM_EPOCHS):
        train_loss = train_epoch()
        val_loss = validate()

        # Log metrics at each step
        mlflow.log_metric("train_loss", train_loss, step=epoch)
        mlflow.log_metric("val_loss", val_loss, step=epoch)

        # Log multiple metrics
        mlflow.log_metrics({
            "train_accuracy": train_acc,
            "val_accuracy": val_acc
        }, step=epoch)

    # Log final metrics (no step)
    mlflow.log_metric("final_accuracy", final_acc)
```

### 4. Logging Artifacts

```python
with mlflow.start_run():
    # Log file
    model.save('model.pkl')
    mlflow.log_artifact('model.pkl')

    # Log directory
    os.makedirs('plots', exist_ok=True)
    plt.savefig('plots/loss_curve.png')
    mlflow.log_artifacts('plots')

    # Log text
    with open('config.txt', 'w') as f:
        f.write(str(config))
    mlflow.log_artifact('config.txt')

    # Log dict as JSON
    mlflow.log_dict({'config': config}, 'config.json')
```

### 5. Logging Models

```python
# PyTorch
import mlflow.pytorch

with mlflow.start_run():
    model = train_pytorch_model()
    mlflow.pytorch.log_model(model, "model")

# Scikit-learn
import mlflow.sklearn

with mlflow.start_run():
    model = train_sklearn_model()
    mlflow.sklearn.log_model(model, "model")

# Keras/TensorFlow
import mlflow.keras

with mlflow.start_run():
    model = train_keras_model()
    mlflow.keras.log_model(model, "model")

# HuggingFace Transformers
import mlflow.transformers

with mlflow.start_run():
    mlflow.transformers.log_model(
        transformers_model={
            "model": model,
            "tokenizer": tokenizer
        },
        artifact_path="model"
    )
```

## Autologging

Automatically log metrics, parameters, and models for popular frameworks.

### Enable Autologging

```python
import mlflow

# Enable for all supported frameworks
mlflow.autolog()

# Or enable for specific framework
mlflow.sklearn.autolog()
mlflow.pytorch.autolog()
mlflow.keras.autolog()
mlflow.xgboost.autolog()
```

### Autologging with Scikit-learn

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Enable autologging
mlflow.sklearn.autolog()

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train (automatically logs params, metrics, model)
with mlflow.start_run():
    model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    # Metrics like accuracy, f1_score logged automatically
    # Model logged automatically
    # Training duration logged
```

### Autologging with PyTorch Lightning

```python
import mlflow
import pytorch_lightning as pl

# Enable autologging
mlflow.pytorch.autolog()

# Train
with mlflow.start_run():
    trainer = pl.Trainer(max_epochs=10)
    trainer.fit(model, datamodule=dm)

    # Hyperparameters logged
    # Training metrics logged
    # Best model checkpoint logged
```

## Model Registry

Manage model lifecycle with versioning and stage transitions.

### Register Model

```python
import mlflow

# Log and register model
with mlflow.start_run():
    model = train_model()

    # Log model
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="my-classifier"  # Register immediately
    )

# Or register later
run_id = "abc123"
model_uri = f"runs:/{run_id}/model"
mlflow.register_model(model_uri, "my-classifier")
```

### Model aliases (default) and stages (older MLflow only)

AI Blocks note: use aliases by default. Model stages are deprecated in recent MLflow releases, and the stage commands below may warn or fail on a current install. An alias is a name, such as `champion`, that you point at the version you trust:

```python
client.set_registered_model_alias("my-classifier", "champion", 3)
model = mlflow.pyfunc.load_model("models:/my-classifier@champion")
```

Ask which MLflow version the user has (`pip show mlflow`). Use aliases on a recent version, and the stage commands only on an older one. Check the MLflow docs for your version before you rely on either.

Legacy stage commands (None → Staging → Production → Archived), for older MLflow only:

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Promote to staging
client.transition_model_version_stage(
    name="my-classifier",
    version=3,
    stage="Staging"
)

# Promote to production
client.transition_model_version_stage(
    name="my-classifier",
    version=3,
    stage="Production",
    archive_existing_versions=True  # Archive old production versions
)

# Archive model
client.transition_model_version_stage(
    name="my-classifier",
    version=2,
    stage="Archived"
)
```

### Load Model from Registry

```python
import mlflow.pyfunc

# Newer MLflow: load by alias (use this first)
model = mlflow.pyfunc.load_model("models:/my-classifier@champion")

# Load a specific version (works on all versions)
model = mlflow.pyfunc.load_model("models:/my-classifier/3")

# Older MLflow only (stages), which may fail on a current install:
# model = mlflow.pyfunc.load_model("models:/my-classifier/Production")
# model = mlflow.pyfunc.load_model("models:/my-classifier/Staging")

# Use model
predictions = model.predict(X_test)
```

### Model Versioning

The stage lookups below (`current_stage`, `get_latest_versions` with `stages`) are for older MLflow only. On a current install, find a version by alias or by number instead.

```python
client = MlflowClient()

# List all versions
versions = client.search_model_versions("name='my-classifier'")

for v in versions:
    print(f"Version {v.version}: {v.current_stage}")

# Get latest version by stage
latest_prod = client.get_latest_versions("my-classifier", stages=["Production"])
latest_staging = client.get_latest_versions("my-classifier", stages=["Staging"])

# Get model version details
version_info = client.get_model_version(name="my-classifier", version="3")
print(f"Run ID: {version_info.run_id}")
print(f"Stage: {version_info.current_stage}")
print(f"Tags: {version_info.tags}")
```

### Model Annotations

```python
client = MlflowClient()

# Add description
client.update_model_version(
    name="my-classifier",
    version="3",
    description="[WHAT THE MODEL IS, WHAT IT WAS TRAINED ON, AND ITS MEASURED SCORE]"
)

# Add tags
client.set_model_version_tag(
    name="my-classifier",
    version="3",
    key="validation_status",
    value="approved"
)

client.set_model_version_tag(
    name="my-classifier",
    version="3",
    key="deployed_date",
    value="[DATE YOU DEPLOYED IT]"
)
```

## Searching Runs

Find runs programmatically.

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Search all runs in experiment
experiment_id = client.get_experiment_by_name("my-experiment").experiment_id
runs = client.search_runs(
    experiment_ids=[experiment_id],
    filter_string="metrics.accuracy > 0.9",
    order_by=["metrics.accuracy DESC"],
    max_results=10
)

for run in runs:
    print(f"Run ID: {run.info.run_id}")
    print(f"Accuracy: {run.data.metrics['accuracy']}")
    print(f"Params: {run.data.params}")

# Search with complex filters
runs = client.search_runs(
    experiment_ids=[experiment_id],
    filter_string="""
        metrics.accuracy > 0.9 AND
        params.model = 'ResNet50' AND
        tags.dataset = 'ImageNet'
    """,
    order_by=["metrics.f1_score DESC"]
)
```

## Integration Examples

### PyTorch

```python
import mlflow
import torch
import torch.nn as nn

# Enable autologging
mlflow.pytorch.autolog()

with mlflow.start_run():
    # Log config
    config = {
        "lr": 0.001,
        "epochs": 10,
        "batch_size": 32
    }
    mlflow.log_params(config)

    # Train
    model = create_model()
    optimizer = torch.optim.Adam(model.parameters(), lr=config["lr"])

    for epoch in range(config["epochs"]):
        train_loss = train_epoch(model, optimizer, train_loader)
        val_loss, val_acc = validate(model, val_loader)

        # Log metrics
        mlflow.log_metrics({
            "train_loss": train_loss,
            "val_loss": val_loss,
            "val_accuracy": val_acc
        }, step=epoch)

    # Log model
    mlflow.pytorch.log_model(model, "model")
```

### HuggingFace Transformers

```python
import mlflow
from transformers import Trainer, TrainingArguments

# Enable autologging
mlflow.transformers.autolog()

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    evaluation_strategy="epoch",  # newer transformers releases call this eval_strategy; use the name your installed version accepts
    save_strategy="epoch",
    load_best_model_at_end=True
)

# Start MLflow run
with mlflow.start_run():
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset
    )

    # Train (automatically logged)
    trainer.train()

    # Log final model to registry
    mlflow.transformers.log_model(
        transformers_model={
            "model": trainer.model,
            "tokenizer": tokenizer
        },
        artifact_path="model",
        registered_model_name="hf-classifier"
    )
```

### XGBoost

```python
import mlflow
import xgboost as xgb

# Enable autologging
mlflow.xgboost.autolog()

with mlflow.start_run():
    dtrain = xgb.DMatrix(X_train, label=y_train)
    dval = xgb.DMatrix(X_val, label=y_val)

    params = {
        'max_depth': 6,
        'learning_rate': 0.1,
        'objective': 'binary:logistic',
        'eval_metric': ['logloss', 'auc']
    }

    # Train (automatically logged)
    model = xgb.train(
        params,
        dtrain,
        num_boost_round=100,
        evals=[(dtrain, 'train'), (dval, 'val')],
        early_stopping_rounds=10
    )

    # Model and metrics logged automatically
```

## Best Practices

### 1. Organize with Experiments

```python
# ✅ Good: Separate experiments for different tasks
mlflow.set_experiment("sentiment-analysis")
mlflow.set_experiment("image-classification")
mlflow.set_experiment("recommendation-system")

# ❌ Bad: Everything in one experiment
mlflow.set_experiment("all-models")
```

### 2. Use Descriptive Run Names

```python
# ✅ Good: Descriptive names
with mlflow.start_run(run_name="resnet50-imagenet-lr0.001-bs32"):
    train()

# ❌ Bad: No name (auto-generated UUID)
with mlflow.start_run():
    train()
```

### 3. Log Comprehensive Metadata

```python
with mlflow.start_run():
    # Log hyperparameters
    mlflow.log_params({
        "learning_rate": 0.001,
        "batch_size": 32,
        "epochs": 50
    })

    # Log system info
    mlflow.set_tags({
        "dataset": "ImageNet",
        "framework": "PyTorch 2.0",
        "gpu": "A100",
        "git_commit": get_git_commit()
    })

    # Log data info
    mlflow.log_param("train_samples", len(train_dataset))
    mlflow.log_param("val_samples", len(val_dataset))
```

### 4. Track Model Lineage

```python
# Link runs to understand lineage
with mlflow.start_run(run_name="preprocessing"):
    data = preprocess()
    mlflow.log_artifact("data.csv")
    preprocessing_run_id = mlflow.active_run().info.run_id

with mlflow.start_run(run_name="training"):
    # Reference parent run
    mlflow.set_tag("preprocessing_run_id", preprocessing_run_id)
    model = train(data)
```

### 5. Use Model Registry for Deployment

```python
# ✅ Good: Use registry for production (an alias on current MLflow)
model_uri = "models:/my-classifier@champion"
model = mlflow.pyfunc.load_model(model_uri)

# ❌ Bad: Hard-code run IDs
model_uri = "runs:/abc123/model"
model = mlflow.pyfunc.load_model(model_uri)
```

## Deployment

**Prerequisite note.** Serving a model on your own computer needs nothing extra. The SageMaker and Azure ML commands further down are optional and need an AWS or Azure account with credentials, which cost money. Registry commands depend on your MLflow version: aliases on a recent one, stages on an older one.

### Serve Model Locally

```bash
# Serve registered model (by alias)
mlflow models serve -m "models:/my-classifier@champion" -p 5001

# Serve from run
mlflow models serve -m "runs:/<RUN_ID>/model" -p 5001

# Test endpoint
curl http://127.0.0.1:5001/invocations -H 'Content-Type: application/json' -d '{
  "inputs": [[1.0, 2.0, 3.0, 4.0]]
}'
```

### Deploy to Cloud

**Optional, and needs credentials.** SageMaker and Azure ML need your own paid AWS or Azure account, with credentials set up on your machine first (for example the AWS or Azure command-line sign-in). They may cost money, so check prices before you run these commands. Skip this section if you only track runs.

```bash
# Deploy to AWS SageMaker (optional; needs AWS credentials and a paid account)
mlflow sagemaker deploy -m "models:/my-classifier@champion" --region-name [YOUR AWS REGION]

# Deploy to Azure ML (optional; needs Azure credentials and a paid account)
mlflow azureml deploy -m "models:/my-classifier@champion"
```

## Configuration

### Tracking Server

This listens on your own computer only (127.0.0.1). MLflow has no login by default, so do not change the host to 0.0.0.0 or expose the port to other people without putting a login or private network in front of it. Keep real passwords in environment variables, not in commands you paste.

```bash
# Start tracking server with backend store
mlflow server \
  --backend-store-uri postgresql://[USER]:[PASSWORD]@localhost/mlflow \
  --default-artifact-root s3://[YOUR BUCKET]/mlflow \
  --host 127.0.0.1 \
  --port 5000
```

### Client Configuration

```python
import mlflow

# Set tracking URI
mlflow.set_tracking_uri("http://localhost:5000")

# Or use environment variable
# export MLFLOW_TRACKING_URI=http://localhost:5000
```

## Resources

- **Documentation**: https://mlflow.org/docs/latest
- **GitHub**: https://github.com/mlflow/mlflow
- **Examples**: https://github.com/mlflow/mlflow/tree/master/examples
- **Community**: https://mlflow.org/community

## See Also

- `references/tracking.md` - Comprehensive tracking guide
- `references/model-registry.md` - Model lifecycle management
- `references/deployment.md` - Production deployment patterns

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Build it** with the [Language model benchmark runner](https://useaiblocks.com/skills/language-model-benchmark-runner).
- The [Python LLM app evaluation planner](https://useaiblocks.com/skills/copilot-eval-driven-dev).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
