from transformers import AutoTokenizer, AutoModelForMaskedLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from datasets import load_dataset
import torch

print("Cuda Available", torch.cuda.is_available())
if torch.cuda.is_available():
    print("Device", torch.cuda.get_device_name())

# 1. Загрузить FinBERT
LOCAL_CHECKPOINT_PATH = './finbert-crypto-mlm/checkpoint-6'
model_name = "yiyanghkust/finbert-pretrain"

try:
    model =  AutoModelForMaskedLM.from_pretrained(LOCAL_CHECKPOINT_PATH)
    print(f'Successfully loaded the best adapted: {LOCAL_CHECKPOINT_PATH}')
except Exception as e:
    print(f"Local model not found. Loading original model: {model_name}")
    model = AutoModelForMaskedLM.from_pretrained(model_name)
    
tokenizer = AutoTokenizer.from_pretrained(model_name)
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=True, mlm_probability=0.15)

# 2. Загрузить свой CSV
dataset = load_dataset("csv", data_files="data/processed/context_clean2.csv")["train"]
dataset = dataset.train_test_split(test_size=0.1)

# 3. Токенизация
def tokenize(batch):
    return tokenizer(batch["text_clean"], truncation=True, padding="longest", max_length=256)

tokenized = dataset.map(tokenize, batched=True)
tokenized.set_format("torch", columns=["input_ids", "attention_mask"])

# 4. Обучение MLM
args = TrainingArguments(
    output_dir="./finbert-crypto-mlm",
    per_device_train_batch_size=16,
    num_train_epochs=3,
    learning_rate=3e-5,
    warmup_ratio=0.05,
    fp16=False,
    eval_strategy="epoch",
    logging_strategy='epoch',
    save_strategy='epoch',
    save_total_limit=1,
    report_to='none',
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    greater_is_better=False,

)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
    data_collator=data_collator,
)

trainer.train()

# 5. Сохранить адаптированную модель
trainer.save_model("./model/finbert-crypto-mlm")
