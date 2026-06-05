from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
)
from datasets import load_dataset
import numpy as np
from sklearn.metrics import accuracy_score, f1_score

base_model_path = "./finbert-crypto-mlm/checkpoint-4"  # твоя MLM-адаптированная модель
data_path = "data/processed/news_clean2.csv"

label2id = {"negative": 0, "neutral": 1, "positive": 2}
id2label = {v: k for k, v in label2id.items()}

print("Loading tokenizer and base model...")
tokenizer = AutoTokenizer.from_pretrained(base_model_path)

model = AutoModelForSequenceClassification.from_pretrained(
    base_model_path,
    num_labels=3,
    id2label=id2label,
    label2id=label2id,
)

print("Loading dataset...")
dataset = load_dataset("csv", data_files={"data": data_path})["data"]
dataset = dataset.train_test_split(test_size=0.2, seed=42)
dataset = dataset.rename_columns({"text_clean": "raw_text"})

def preprocess(batch):
    labels = [label2id[l] for l in batch["label"]]
    tok = tokenizer(
        batch["raw_text"],
        truncation=True,
        padding="max_length",
        max_length=256,
    )
    tok["labels"] = labels
    return tok

encoded = dataset.map(preprocess, batched=True)
encoded.set_format(
    type="torch",
    columns=["input_ids", "attention_mask", "labels"],
)

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return {
        "accuracy": accuracy_score(labels, preds),
        "macro_f1": f1_score(labels, preds, average="macro"),
    }

args = TrainingArguments(
    output_dir="model/finbert-crypto-sentiment",
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    learning_rate=2e-5,
    num_train_epochs=3,
    weight_decay=0.01,
    warmup_ratio=0.06,
    eval_strategy="epoch",
    save_strategy="epoch",
    save_total_limit=1,
    load_best_model_at_end=True,
    metric_for_best_model="macro_f1",
    greater_is_better=True,
    logging_strategy="epoch",
    report_to="none",
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=encoded["train"],
    eval_dataset=encoded["test"],
    compute_metrics=compute_metrics,
)

trainer.train()
metrics = trainer.evaluate()
print(metrics)

trainer.save_model("./model/finbert-crypto-sentiment")
tokenizer.save_pretrained("./model/finbert-crypto-sentiment")
